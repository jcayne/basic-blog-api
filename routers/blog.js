var database = require('../client/database');
var express = require('express');
var router = express.Router();

var origin = process.env.NODE_ENV === 'production' ? 'http://basic-blog-ui.mybluemix.net' : 'http://localhost:3000';

router.all('/', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

router.post('/', function(req, res) {
  if(!req.body || !req.body.text) {
    return res.status(400).send({code: '400', message: 'Missing required parameters.'});
  }

  if(!req.body.username) {
    return res.status(400).send({code: '400', message: 'An invalid username was provided.'});
  }

  database.insert(req.body.text, req.body.username, function(err, response) {
    if(err) {
      return res.status(response.code).send(response);
    }
    if(req.body.displayAll) {
      return database.getAllDocumentsByUsername(req.body.username, function(err, resGet) {

        // Return the array of text.
        return res.status(200).send({text: resGet});
      });

    }
    // response is the doc._id from the insert.
    return database.get(response.id, function(err, resGet) {
      if(err) {
        return res.status(response.code).send(response);
      }

      // Make the response similar to a retrieve all to ease the parsing on the UI side.
      var result = [];
      result.push({
        modified: resGet.modified,
        text: resGet.text
      });
      return res.status(200).send({text: result});
    });
  });


});

module.exports = router;
