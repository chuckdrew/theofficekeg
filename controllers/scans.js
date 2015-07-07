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
                    newScan.user = user._id;
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
                                            app.sendMail({
                                                template: 'purchase',
                                                to: user.email,
                                                subject: 'Enjoy that Beer!',
                                                base_url: process.env.BASE_URL,
                                                purchase: newPurchase,
                                                user: user,
                                                keg: keg
                                            });

                                            user.decreaseBalance(newPurchase.price);
                                            user.save(function (err) {
                                                if (err) {
                                                    res.apiRes(false, 'Error leaving', err);
                                                } else {
                                                    res.apiRes(true, 'Successfully saved scan and debited user balance.', newPurchase);
                                                }
                                            });
                                        } else {
                                            User.getUsersWithRole('admin').then(function(users) {
                                                users.forEach(function(adminUser) {
                                                    app.sendMail({
                                                        template: 'orphanscan',
                                                        to: adminUser.email,
                                                        subject: 'Orphan Scan! Please assign to a user.',
                                                        base_url: process.env.BASE_URL,
                                                        purchase: newPurchase,
                                                        scan: newScan,
                                                        keg: keg
                                                    });
                                                });
                                            });

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

    router.get('/orphans', passport.checkAuth('admin'), function(req, res) {
        Scan.paginate({user: null}, req.query.page, req.query.limit, function(err, pageCount, paginatedResults, itemCount) {
            if (err) {
                res.apiRes(false, 'Error finding scans.', err);
            } else {
                res.apiRes(true, 'Successfully fetched orphan scans.', {
                    page: req.query.page,
                    limit: req.query.limit,
                    page_count: pageCount,
                    item_count: itemCount,
                    results: paginatedResults
                });
            }
        }, {sortBy: {created: -1}});
    });

    router.put('/assign-to-user', passport.checkAuth('admin'), function(req, res) {
        res.apiRes(true, 'Assigned this scan to user and applied to their balance.');
    });

    return router;
}