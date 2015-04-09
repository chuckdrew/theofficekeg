var Purchase = require('../models/purchase');
var Keg = require('../models/keg');
var User = require('../models/user');


module.exports = function(app, passport) {
    var express = require('express');
    var router = express.Router();

    router.post('/add', passport.checkAuth('guest'), function (req, res) {
        Keg.findOne({'_id' :  req.body.keg_id }, function(err, keg) {
            if(keg) {
                var newPurchase = new Purchase();

                newPurchase.user = req.user._id;
                newPurchase.keg = keg._id;
                newPurchase.price = keg.pint_price;

                newPurchase.save(function (err) {
                    if (err) {
                        res.apiRes(false, 'Error Saving Purchase', err);
                    } else {
                        app.mailer.send('../views/emails/purchase', {
                            to: req.user.email,
                            subject: 'Enjoy that Beer!',
                            base_url: process.env.BASE_URL,
                            purchase: newPurchase,
                            user: req.user,
                            keg: keg
                        }, function (err) {
                            console.log(err);
                        });

                        User.findOne({'_id': req.user._id}, function(err, user) {
                            user.decreaseBalance(newPurchase.price)
                            user.save(function (err) {
                                if(err) {
                                    res.apiRes(false, 'Error saving purchase', err);
                                } else {
                                    res.apiRes(true, 'Successfully saved purchase', newPurchase);
                                }
                            });
                        });
                    }
                });
            } else {
                res.apiRes(false, 'Could Not Find Keg.', err);
            }
        });
    });

    router.get('/cancel', function(req, res) {
        Purchase.findOne({'_id' :  req.query.purchase_id}, function(err, purchase) {
            if(purchase) {
                if(purchase.cancelled == false) {
                    purchase.cancelled = true;
                    purchase.cancelled_date = new Date();

                    purchase.save(function (err) {
                        if (err) {
                            res.apiRes(false, 'Error cancelling purchase.', purchase);
                        } else {
                            User.findOne({'_id': purchase.user}, function(err, user) {
                                if(user) {
                                    user.increaseBalance(purchase.price);
                                    user.save(function(err) {
                                        if(err) {
                                            res.apiRes(false, 'Error cancelling purchase.', err);
                                        } else {
                                            app.mailer.send('../views/emails/cancel', {
                                                to: user.email,
                                                subject: 'Purchase Cancelled',
                                                base_url: process.env.BASE_URL,
                                                purchase: purchase,
                                                user: user
                                            }, function (err) {
                                                console.log(err);
                                            });

                                            if (req.query.redirect == "true") {
                                                res.redirect('/#/purchases/cancel-success');
                                            } else {
                                                res.apiRes(true, 'Successfully Cancelled and Refunded.', purchase);
                                            }
                                        }
                                    });
                                } else {
                                    res.apiRes(false, 'Error cancelling purchase.', purchase);
                                }
                            });
                        }
                    });
                } else {
                    if (req.query.redirect == "true") {
                        res.redirect('/#/purchases/already-canceled');
                    } else {
                        res.apiRes(false, 'Purchase already canceled.', purchase);
                    }
                }
            } else {
                if (req.query.redirect == "true") {
                    res.redirect('/#/purchases/could-not-find-purchase.');
                } else {
                    res.apiRes(false, 'Could not find purchase.', purchase);
                }
            }
        });
    });

    router.get('/latest', function(req, res) {
        Purchase.findOne({'cancelled': false, 'user': {'$ne':null}}, {}, { sort: { 'created' : -1 } }).populate('user').populate('keg').exec(function(err, purchase) {
            if(purchase) {
                res.apiRes(true, 'Latest Purchase.', purchase);
            } else {
                res.apiRes(false, 'Could not find latest purchase.', purchase);
            }
        });
    });

    router.get('/list', passport.checkAuth('guest'), function(req, res) {
        Purchase.paginate({user: req.user._id}, req.query.page, req.query.limit, function(err, pageCount, paginatedResults, itemCount) {
            if (err) {
                res.apiRes(false, 'Error finding purchases.', err);
            } else {
                res.apiRes(true, 'Successfully fetched purchases.', {
                    page: req.query.page,
                    limit: req.query.limit,
                    page_count: pageCount,
                    item_count: itemCount,
                    results: paginatedResults
                });
            }
        }, {populate: 'keg', sortBy: {created: -1}});
    });

    return router;
}