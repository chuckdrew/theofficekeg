module.exports = function(app, passport) {

    var express = require('express');
    var router = express.Router();
    passport.checkAuth = require('../middlewares/auth')

    //router.use('/payments', require('./payments'))
    router.use('/users', require('./users')(app, passport));

    return router;
};