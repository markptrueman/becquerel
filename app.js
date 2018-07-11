var express = require('express');
var path = require('path');
var session = require('express-session');

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var bearerToken = require('express-bearer-token');

var utils = require('./routes/utils');
var posts = require('./routes/posts');
var users = require('./routes/users');
var auth = require('./routes/auth');
var accounts = require('./routes/accounts')
var mongoose = require('mongoose');
var enforce = require('express-sslify');


var config = require('./config')





var app = express();

app.use(session({
  secret: config.session.secret,
  saveUninitialized: true,
  resave: false
}));

app.use(bearerToken());
if (config.production) {
  console.log("Enforcing https");
  app.use(enforce.HTTPS({ trustProtoHeader: true }))
}

app.use(logger('dev'));

var dburl = 'mongodb://localhost:27017/curie'

if (config.db_user)
{
  dburl = 'mongodb://' + config.db_user + ':' + config.db_pwd + '@'  + config.db_url + '/' + config.db_name
}

console.log("connecting to db " + dburl); 
mongoose.set('debug', config.mongodebug);
mongoose.connect(dburl, {
  useMongoClient: true,
  /* other options */
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/utils', utils);
app.use('/posts', posts);
app.use('/users', users);
app.use('/authorize', auth);
app.use('/accounts', accounts);

app.use(express.static(path.resolve(__dirname, './client/build')));

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
});

module.exports = app;
