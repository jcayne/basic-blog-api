var assert = require('assert');
var database = require('../client/database');

describe('Test Database Middleware', function() {
  describe('#insertNoSetup()', function() {
    it('check for error', function(done) {
      database.insert("text", "user", function(err, response) {
        assert.equal(err, true);
        assert.equal(response.code, 500);
        done();
      });
    });
  });

  describe('#insertGetGetAll()', function() {
    it('check for error', function(done) {
      database.setup();
      database.insert("text", "user", function(err, response) {
        assert.equal(err, false);
        assert.ok(response);
        var docId = response.id;
        var docRev = response.rev;

        database.insert("text1", "user", function(err, response) {
          assert.equal(err, false);
          assert.ok(response);
          var doc1Id = response.id;
          var doc1Rev = response.rev;

          // Retrieve the document
          database.get(docId, function(err, response) {
            assert.equal(err, false);
            assert.equal(response.username, "user");
            assert.equal(response.text, "text");
            assert.ok(response.modified);

            // Retrieve all documents by username
            database.getAllDocumentsByUsername("user", function(err, response) {
              assert.equal(err, false);
              assert.equal(response.length, 2);
              assert.equal(response[0].text, "text");
              assert.ok(response[0].modified);
              assert.equal(response[1].text, "text1");
              assert.ok(response[1].modified);

              // Clean up
              database.delete(docId, docRev, function(err, response) {
                assert.equal(err, false);
                assert.ok(response);

                database.delete(doc1Id, doc1Rev, function(err, response) {
                  assert.equal(err, false);
                  assert.ok(response);
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
