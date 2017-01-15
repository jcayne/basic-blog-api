var database = require('../client/database');
var express = require('express');
var router = express.Router();

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
    // response is the doc from the insert.
    return database.get(response.id, function(err, resGet) {
      if(err) {
        return res.status(resGet.code).send(resGet);
      }

      // Make the response similar to a retrieve all to ease the parsing on the UI side.
      var result = [];
      result.push({
        id: resGet._id,
        modified: resGet.modified,
        text: resGet.text,
        replies: resGet.replies
      });
      return res.status(200).send({text: result});
    });
  });
});

router.patch('/:id', function(req, res) {
  if(!req.body || !req.body.text) {
    return res.status(400).send({code: '400', message: 'Missing required parameters.'});
  }

  return database.get(req.params.id, function(err, resGet) {
    if(err) {
      return res.status(resGet.code).send(resGet);
    }
    resGet.replies.push(req.body.text);
    return database.update(resGet, resGet.replies, function(err, resUpdate) {
      if(err) {
        return res.status(resUpdate.code).send(resUpdate);
      }
      return res.status(204).send();
    });
  });


});

module.exports = router;
