var assert = require('assert');
var request = require('request');

describe('Test Server', function() {
  describe('#postBlog()', function() {
    var url = process.env.NODE_ENV === 'test' ? 'http://basic-blog-api.mybluemix.net/api' : 'http://localhost:3100/api';
    it('check for error', function(done) {
      var options = {
        uri: url,
        method: 'get',
        json: true,
        gzip: true
      };
      request(options, function(error, response, body) {
        assert.equal(response.statusCode, 404);
        done();
      });
    });
  });
});
