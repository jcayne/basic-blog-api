var nconf = require('nconf');

var db;

exports.setup = function() {
  // Load properties from the config file.
  nconf.argv()
     .env()
     .file({ file: 'local-config.json' });

  nconf.env('__');

  // Create the database
  var nano = require('nano')(nconf.get('cloudant:url'));
  nano.db.create('basic-blog');

  db = nano.db.use('basic-blog');

  db.insert(
    { "views":
      { "text_by_username":
        { "map": function(doc) { emit([doc.username, doc.modified], doc._id); } }
      }
    }, '_design/text', function (err, res) {
      // Ignore if the view already exists.
      if(err && err.statusCode !== 409) {
        throw new Error("Setup error.");
      }
   });

}

exports.insert = function(text, username, callback) {
  if(!db) {
    return callback(true, {code: '500', message: 'An internal error occurred.'});
  }
  db.insert({
    username: username,
    modified: Date.now(),
    text: text,
    replies: []
  }, function(err, body) {
    if(err) {
      console.error('Insert failed with error: ' + JSON.stringify(err));
      return callback(true, {code: '400', message: 'An error occurred storing the text.'});
    }

    return callback(false, body);
  });
}

exports.update = function(doc, replies, callback) {
  if(!db) {
    return callback(true, {code: '500', message: 'An internal error occurred.'});
  }
  db.insert({
    _id: doc._id,
    _rev: doc._rev,
    username: doc.username,
    modified: doc.modified,
    text: doc.text,
    replies: replies
  }, function(err, body) {
    if(err) {
      console.error('Update failed with error: ' + JSON.stringify(err));
      return callback(true, {code: '400', message: 'An error occurred updating the replies.'});
    }
    return callback(false, body);
  });
}

exports.delete = function(id, rev, callback) {
  if(!db) {
    return callback(true, {code: '500', message: 'An internal error occurred.'});
  }
  db.destroy(id, rev, function(err, body) {
    if(err) {
      console.error('Delete failed with error: ' + JSON.stringify(err));
      return callback(true, {code: '400', message: 'An error occurred deleting the document.'});
    }

    return callback(false);
  });
}

exports.get = function(id, callback) {
  if(!db) {
    return callback(true, {code: '500', message: 'An internal error occurred.'});
  }
  db.get(id, function(err, body) {
    if(err) {
      console.error('Retrieve document failed with error: ' + JSON.stringify(err));
      return callback(true, {code: '400', message: 'An error occurred retrieving the text.'});
    }

    return callback(false, body);
  });
}

exports.getAllDocumentsByUsername = function(username, callback) {
  if(!db) {
    return callback(true, {code: '500', message: 'An internal error occurred.'});
  }
  db.view('text', 'text_by_username', {include_docs: true, startkey: [username], endkey:[username, {}]}, function(err, body) {
    if(err) {
      console.error('Retrieving all documents by username failed with error: ' + JSON.stringify(err));
      return callback(true, {code: '400', message: 'An error occurred retrieving the text.'});
    }

    var result = [];
    for(var i = 0; i < body.rows.length; i++) {
      result.push({
        id: body.rows[i].doc._id,
        modified: body.rows[i].doc.modified,
        text: body.rows[i].doc.text,
        replies: body.rows[i].doc.replies
      });
    }
    return callback(false, result);
  });

}
