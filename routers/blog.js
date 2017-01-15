var database = require('../client/database');
var express = require('express');
var router = express.Router();
var weather = require('weather-js');

router.post('/', function(req, res) {
  if(!req.body || !req.body.text) {
    return res.status(400).send({code: '400', message: 'Missing required parameters.'});
  }

  if(!req.body.username || req.body.username.trim().length === 0) {
    return res.status(400).send({code: '400', message: 'An invalid username was provided.'});
  }

  if(!req.body.location || req.body.location.trim().length === 0) {
    return res.status(400).send({code: '400', message: 'An invalid location was provided.'});
  }

  weather.find({search: req.body.location, degreeType: 'C'}, function(err, result) {
    if(err || !result || result.length === 0) {
      console.error('An error occurred looking up the weather: ' + err);
      return res.status(400).send({code: '400', message:'An error occurred looking up the location.'});
    }

    // The location can be ambiguous, e.g. Rome can be Rome, Italy or Rome, GA. In that case, we take
    // the closest match, however, if an invalid location is passed, e.g. Rome, WY, we return an error
    // to get a more accurate location.
    var city = result[0].location.name;
    var zipcode = result[0].location.zipcode;
    if(!zipcode && city && !city.toLowerCase().includes(req.body.location.toLowerCase())) {
      return res.status(400).send({code: '400', message:'The location could not be determined.'});
    }

    var location = {
      city: result[0].location.name,
      latitude: result[0].location.lat,
      longitude: result[0].location.long,
      temperature: result[0].current.temperature
    };
    database.insert(req.body.text, req.body.username, location, function(err, response) {
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
          location: resGet.location,
          text: resGet.text,
          replies: resGet.replies
        });
        return res.status(200).send({text: result});
      });
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
