var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var configDB = require('./config/database.js');

//Configure Passport
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

//Create Standard Response Object
express.response.apiRes = function(status, message, data) {
    this.json({
        success: status,
        message: message,
        data: data
    });
}

//Logging
app.use(morgan('dev')); // log every request to the console

//Cookie Parser
app.use(cookieParser());

//Read in the body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Open Mongo Connection
mongoose.connect(configDB.url);

//Store Sessions in Mongo
app.use(session({
    secret: 'mysecurekey',
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

//Base Route to Index Controllers
app.use('/', require('./controllers/index')(app, passport));

//API Route that uses Basic auth
app.use('/api', passport.authenticate('basic', { session: false }), require('./controllers/index')(app, passport));

//Set public directory
app.use(express.static(__dirname + '/public'));

//Set index.html
app.get('/', function(req, res) {
    res.sendfile('./public/index.html');
});

//404 Error Pages
app.use(function(req, res) {
    res.send('404: Page not Found', 404);
});

////500 Error Pages
//app.use(function(error, req, res, next) {
//    res.send('500: Internal Server Error', 500);
//});

app.listen(port);