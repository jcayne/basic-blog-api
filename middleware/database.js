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
}

exports.insert = function(text, callback) {
  if(!db) {
    return callback(true, {code: '500', message: 'An internal error occurred.'});
  }
  db.insert({
    modified: Date.now(),
    text: text
  }, function(err, body) {
    if(err) {
      console.err('Insert failed with error: ' + JSON.stringify(err));
      return callback(true, {code: '400', message: 'An error occurred storing the text.'});
    }
    return callback(false, body.id);
  })
}
