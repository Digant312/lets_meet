require('module-alias/register');

var express = require("express");
var bodyParser = require("body-parser");
var app = express();

// Body Parser Middleware
app.use(bodyParser.json());

//CORS Middleware
app.use(function (req, res, next) {
  //Enabling CORS 
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
  next();
});

//Setting up server
var server = app.listen(process.env.PORT || 8080, function () {
  var port = server.address().port;
  console.log("App now running on port", port);
});

//GET API
// app.get("/api/user", function (req, res) {
//   var query = "select * from [user]";
//   executeQuery(res, query);
// });

require('./routes')(app);