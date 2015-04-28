var Payment = require('../models/payment');
var User = require('../models/user');
var Purchase = require('../models/purchase');

module.exports = function(app, passport) {
    var express = require('express');
    var router = express.Router();

    router.post('/add', passport.checkAuth('admin'), function (req, res) {
        var newPayment = new Payment();

        newPayment.user = req.body.user_id;
        newPayment.amount = req.body.amount;

        newPayment.save(function(err) {
            if (err) {
                res.apiRes(false,'Error Saving Payment',err);
            } else {
                User.findOne({'_id': req.body.user_id}, function(err, user) {
                    Purchase.lockPurchasesForUser(req.body.user_id, function(err) {
                        if(err) {
                            console.log(err);
                        }
                    });

                    app.mailer.send('../views/emails/payment', {
                        to: user.email,
                        subject: 'Thanks for your payment!',
                        base_url: process.env.BASE_URL,
                        payment: newPayment,
                        user: user
                    }, function (err) {
                        console.log(err);
                    });

                    user.increaseBalance(newPayment.amount)
                    user.save(function (err) {
                        if(err) {
                            res.apiRes(false, 'Error applying payment to users account', err);
                        } else {
                            res.apiRes(true, 'Successfully Saved Payment', newPayment);
                        }
                    });
                });
            }
        });
    });

    router.get('/list', passport.checkAuth('guest'), function(req, res) {
        Payment.paginate({user: req.user._id}, req.query.page, req.query.limit, function(err, pageCount, paginatedResults, itemCount) {
            if (err) {
                res.apiRes(false, 'Error finding payments.', err);
            } else {
                res.apiRes(true, 'Successfully fetched payments.', {
                    page: req.query.page,
                    limit: req.query.limit,
                    page_count: pageCount,
                    item_count: itemCount,
                    results: paginatedResults
                });
            }
        }, {sortBy: {created: -1}});
    });

    return router;
}