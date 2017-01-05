var assert = require('assert');
var database = require('../middleware/database');

describe('Test Database Middleware', function() {
  describe('#insertNoSetup()', function() {
    it('check for error', function(done) {
      database.insert("text", function(err, response) {
        assert.equal(err, true);
        assert.equal(response.code, 500);
        done();
      });
    });
  });

  describe('#insert()', function() {
    it('check for error', function(done) {
      database.setup();
      database.insert("text", function(err, response) {
        assert.equal(err, false);
        assert.ok(response);
        done();
      });
    });
  });
});
