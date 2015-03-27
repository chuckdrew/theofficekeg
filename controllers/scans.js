var User = require('../models/user');

module.exports = function(app, passport) {
    var express = require('express');
    var router = express.Router();

    router.get('/scan', passport.checkAuth(), function (req, res) {
        User.findOne({'scanner_uuid' :  req.query.scanner_uuid }, function(err, user) {
            res.apiRes(true,'Successfully Registered Scan',{
                user:user
            });
        });
    });

    return router;
}