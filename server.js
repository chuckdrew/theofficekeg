var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var configDB = require('./config/database.js');

mongoose.connect(configDB.url);

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({ secret: 'mysecurekey' }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/', require('./controllers/index'));

app.get('*', function(req, res) {
    res.sendfile('./public/index.html');
});

app.listen(port);