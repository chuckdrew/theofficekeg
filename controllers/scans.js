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
                                                        to: "joemess21@gmail.com",
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


    router.put('/assign-orphan-scans', passport.checkAuth('admin'), function(req, res) {
        if (req.body.scanned_uuid == null || req.body.user_id == null){
            res.apiRes(false, 'Scanned uuid and user id are required for this request.');
        } else {
            var totalPrice = null;
            User.findById(req.body.user_id, function(err, user) {
                if (err){
                    res.apiRes(false, 'could not find user: ' + req.body.user_id + ', ' + err);
                } else {
                    user.scanner_uuid = req.body.scanned_uuid;
                    Scan.find({'scanned_uuid': req.body.scanned_uuid, user: null}, function (err, scans) {
                        console.log(scans);
                        if (scans.length == 0){
                            res.apiRes(false, 'could not find any orphan scans with uuid: ' + req.body.scanned_uuid + ', ' + err);
                        } else {
                            scans.forEach(function (scan, index) {
                                scan.user = user._id;
                                scan.save(function(err) { if (err) { res.apiRes(false, 'could not update scan:' + scan + ', ' + err); }});
                                Purchase.findOne({'scan': scan._id}, function (err, purchase) {
                                    totalPrice = totalPrice + purchase.price;
                                    purchase.user = req.body.user_id;
                                    purchase.save(function (err) {
                                        if (err) {
                                            res.apiRes(false, 'error updating purchases user', err);
                                        } else if (index === scans.length - 1) {
                                            user.decreaseBalance(totalPrice);
                                            user.save(function (err) {
                                                if (err) {
                                                    res.apiRes(false, 'error updating user balance', err);
                                                } else {
                                                    res.apiRes(true, 'successfully assigned orphan to user and updated users balance');
                                                }
                                            });
                                        }
                                    });
                                });
                            });
                        }
                    });
                }
            });
        }
    });

    return router;
}