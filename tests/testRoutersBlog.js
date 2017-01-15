var assert = require('assert');
var request = require('request');

describe('Test Blog Router', function() {
  describe('#apiBlog()', function() {
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

    it('check response and update', function(done) {
      var options = {
        uri: url,
        method: 'post',
        body: {
          username: 'test',
          location: 'Rome, Italy',
          text: 'Some text'
        },
        json: true,
        gzip: true
      };
      request(options, function(error, response, body) {
        assert.equal(response.statusCode, 200);
        assert.equal(body.text.length, 1);
        assert.ok(body.text[0].id);
        assert.ok(body.text[0].modified);
        assert.equal(body.text[0].location.city, 'Rome, Italy');
        assert.ok(body.text[0].location.latitude);
        assert.ok(body.text[0].location.longitude);
        assert.ok(body.text[0].location.temperature);
        assert.equal(body.text[0].text, 'Some text');
        assert.equal(body.text[0].replies.length, 0);
        var updateOptions = {
          uri: url + '/' + body.text[0].id,
          method: 'patch',
          body: {
            text: 'An update'
          },
          json: true,
          gzip: true
        };
        request(updateOptions, function(error, response, body) {
          assert.equal(response.statusCode, 204);
          done();
        });
      });
    });
  });
});
