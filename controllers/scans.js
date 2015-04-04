var User = require('../models/user');
var Scan = require('../models/scan');
var Purchase = require('../models/purchase');
var Keg = require('../models/keg');

module.exports = function(app, passport) {
    var express = require('express');
    var router = express.Router();

    router.post('/scan', passport.checkAuth('admin'), function (req, res) {
        if(req.body.scanned_uuid == null || req.body.scanned_uuid == "") {
            res.apiRes(false, 'scanned_uuid is a required', null);
        } else {
            User.findOne({scanner_uuid: req.body.scanned_uuid}, function (err, user) {
                console.log(user);
                var newScan = new Scan();

                newScan.scanned_uuid = req.body.scanned_uuid;
                newScan.scanned_date = new Date();

                if (user) {
                    newScan.user_id = user._id;
                }

                newScan.save(function (err) {
                    if (err) {
                        res.apiRes(false, 'Error Saving Scan', err);
                    } else {
                        Keg.findOne({'is_active': true}, function (err, keg) {
                            if (keg) {
                                var newPurchase = new Purchase();

                                if (user) {
                                    newPurchase.user = user._id;
                                } else {
                                    newPurchase.user = null;
                                }

                                newPurchase.keg = keg._id;
                                newPurchase.price = keg.pint_price;
                                newPurchase.scan = newScan._id;

                                newPurchase.save(function (err) {
                                    if (err) {
                                        res.apiRes(false, 'Error Saving Purchase', err);
                                    } else {
                                        if (user) {
                                            app.mailer.send('../views/emails/purchase', {
                                                to: user.email,
                                                subject: 'Enjoy that Beer!',
                                                base_url: process.env.BASE_URL,
                                                purchase_id: newPurchase._id
                                            }, function (err) {
                                                console.log(err);
                                            });

                                            user.balance = user.balance + newPurchase.price;
                                            user.save(function (err) {
                                                if (err) {
                                                    res.apiRes(false, 'Error leaving', err);
                                                } else {
                                                    res.apiRes(true, 'Successfully saved scan and debited user balance.', newPurchase);
                                                }
                                            });
                                        } else {
                                            res.apiRes(true, 'Successfully saved scan, but could not link to a user.', newPurchase);
                                        }
                                    }
                                });
                            } else {
                                res.apiRes(false, 'Could Not Find Keg.', err);
                            }
                        });
                    }
                });
            });
        }
    });

    return router;
}