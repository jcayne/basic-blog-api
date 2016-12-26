var assert = require('assert');
var request = require('request');

describe('Test Blog Router', function() {
  describe('#postBlog()', function() {
    var url = process.env.NODE_ENV === 'test' ? 'http://basic-blog-api.mybluemix.net/api/blog' : 'http://localhost:3100/api/blog';
    it('check for error with no body', function(done) {
      var options = {
        uri: url,
        method: 'post',
        json: true,
        gzip: true
      };
      request(options, function(error, response, body) {
        assert.equal(response.statusCode, 400);
        assert.equal(body.code, 400);
        assert.equal(body.message, 'Missing required parameters.');
        done();
      });
    });

    it('check for error with invalid body', function(done) {
      var options = {
        uri: url,
        method: 'post',
        body: {
          words: 'Some text'
        },
        json: true,
        gzip: true
      };
      request(options, function(error, response, body) {
        assert.equal(response.statusCode, 400);
        assert.equal(body.code, 400);
        assert.equal(body.message, 'Missing required parameters.');
        done();
      });
    });

    it('check response', function(done) {
      var options = {
        uri: url,
        method: 'post',
        body: {
          text: 'Some text'
        },
        json: true,
        gzip: true
      };
      request(options, function(error, response, body) {
        assert.equal(response.statusCode, 200);
        assert.equal(body.text, 'Some text');
        done();
      });
    });
  });
});
