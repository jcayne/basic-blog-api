var assert = require('assert');
var database = require('../client/database');

var location = {
  city:'Rome, Italy',
  latitude:'41.903',
  longitude:'12.496',
  temperature:'3'};

describe('Test Database Middleware', function() {
  describe('#insertNoSetup()', function() {
    it('check for error', function(done) {
      database.insert('text', 'user', location, function(err, response) {
        assert.equal(err, true);
        assert.equal(response.code, 500);
        done();
      });
    });
  });

  describe('#insertGetGetAll()', function() {
    this.timeout(6000);
    it('check for error', function(done) {
      database.setup();
      database.insert('text', 'user', location, function(err, response) {
        assert.equal(err, false);
        assert.ok(response);
        var docId = response.id;
        var docRev = response.rev;

        database.insert('text1', 'user', location, function(err, response) {
          assert.equal(err, false);
          assert.ok(response);
          var doc1Id = response.id;
          var doc1Rev = response.rev;

          // Retrieve the document
          database.get(docId, function(err, response) {
            assert.equal(err, false);
            assert.equal(response._id, docId);
            assert.equal(response.text, 'text');
            assert.ok(response.modified);
            assert.equal(response.location.city, location.city);
            assert.equal(response.location.latitude, location.latitude);
            assert.equal(response.location.longitude, location.longitude);
            assert.equal(response.location.temperature, location.temperature);
            assert.equal(response.replies.length, 0);
            // Used to update the doc.
            var doc = response;

            database.update(doc, ['An update'], function(err, response) {
              docRev = response.rev;

              // Retrieve all documents by username
              database.getAllDocumentsByUsername('user', function(err, response) {
                assert.equal(err, false);
                assert.equal(response.length, 2);
                assert.ok(response[0].id);
                assert.equal(response[0].text, 'text');
                assert.ok(response[0].modified);
                assert.equal(response[0].location.city, location.city);
                assert.equal(response[0].location.latitude, location.latitude);
                assert.equal(response[0].location.longitude, location.longitude);
                assert.equal(response[0].location.temperature, location.temperature);
                assert.equal(response[0].replies.length, 1);
                assert.ok(response[1].id);
                assert.equal(response[1].text, 'text1');
                assert.ok(response[1].modified);
                assert.equal(response[1].location.city, location.city);
                assert.equal(response[1].location.latitude, location.latitude);
                assert.equal(response[1].location.longitude, location.longitude);
                assert.equal(response[1].location.temperature, location.temperature);
                assert.equal(response[1].replies.length, 0);

                // Clean up
                database.delete(docId, docRev, function(err, response) {
                  assert.equal(err, false);

                  database.delete(doc1Id, doc1Rev, function(err, response) {
                    assert.equal(err, false);
                    done();
                  });
                });

              });
            });
          });
        });
      });
    });
  });
});
