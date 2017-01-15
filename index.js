// Based on the Express JS tutorial
var blogRouter = require('./routers/blog');
var bodyParser = require('body-parser');
// Compression will decrease the size of the request body, if used
var compression = require('compression');
var express = require('express');
var path = require('path');

// Configure the database.
require('./client/database').setup();

var app = express();

// Allow cross origin communication.
app.use((req, res, next) => {
  var origin = process.env.NODE_ENV === 'production' ? 'http://basic-blog-ui.mybluemix.net' : 'http://localhost:3000';
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Methods', 'POST,OPTIONS,PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(compression());
app.use(bodyParser.json()); // for parsing application/json
app.use('/api/blog', blogRouter); // Use the blog router to handle these requests
app.use('/swagger', express.static(path.join(__dirname, '/swagger'), {index: false, redirect: false}));

var PORT = process.env.PORT ? process.env.PORT : 3100;
app.listen(PORT, function(){
  console.log('The server has started.');
});
