var Purchase = require('../models/purchase');

module.exports = function(app, passport) {
    var express = require('express');
    var router = express.Router();

    router.post('/add', passport.checkAuth('guest'), function (req, res) {
        var newPurchase = new Purchase();

        newPurchase.user_id = req.user._id;
        newPurchase.keg_id = req.body.keg_id;
        newPurchase.price = req.body.price;

        newPurchase.save(function(err) {
            if (err) {
                res.apiRes(false,'Error Saving Purchase',err);
            } else {
                app.mailer.send('../views/emails/purchase', {
                    to: req.user.email,
                    subject: 'Enjoy that Beer!',
                    base_url: process.env.BASE_URL,
                    purchase_id: newPurchase._id
                }, function(err) {
                    console.log(err);
                });

                res.apiRes(true,'Successfully saved purchase',newPurchase);
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
                            if (req.query.redirect == "true") {
                                res.redirect('/#/purchases/cancel-success');
                            } else {
                                res.apiRes(true, 'Successfully Cancelled.', purchase);
                            }
                        }
                    });
                } else {
                    res.apiRes(false, 'Purchase already canceled.', purchase);
                }
            } else {
                res.apiRes(false, 'Could not find purchase.', purchase);
            }
        });
    });

    return router;
}