module.exports = function(app, passport) {

    var express = require('express');
    var router = express.Router();
    passport.checkAuth = require('../middlewares/auth');

    router.use('/scans', require('./scans')(app, passport));
    router.use('/users', require('./users')(app, passport));
    router.use('/kegs', require('./kegs')(app, passport));
    router.use('/purchases', require('./purchases')(app, passport));
    router.use('/payments', require('./payments')(app, passport));
    router.use('/charge', require('./charge')(app, passport));
    return router;
};