var User = require('../models/user');
var Scan = require('../models/scan');

module.exports = function(app, passport) {
    var express = require('express');
    var router = express.Router();

    router.post('/scan', passport.checkAuth('admin'), function (req, res) {
        User.findOne({'scanner_uuid' :  req.body.scanned_uuid }, function(err, user) {
            var newScan = new Scan();

            newScan.scanned_uuid = req.body.scanned_uuid;
            newScan.scanned_date = new Date();

            if(user) {
                newScan.user_id = user._id;
            }

            newScan.save(function(err) {
                if (err) {
                    res.apiRes(false,'Error Saving Scan',err);
                } else {
                    if(user) {
                        res.apiRes(true,'Successfully Registered Scan',{user:user});
                    } else {
                        res.apiRes(true,'Successfully Registered Scan',{user:null});
                    }
                }
            });
        });
    });

    return router;
}