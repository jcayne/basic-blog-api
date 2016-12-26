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

  res.status(200).send({text: req.body.text});
});

module.exports = router;
