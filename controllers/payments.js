var Payment = require('../models/payment');
var User = require('../models/user');
var Purchase = require('../models/purchase');
var Numeral = require('numeral');

module.exports = function(app, passport) {
    var express = require('express');
    var router = express.Router();

    router.post('/add', passport.checkAuth('admin'), function (req, res) {
        module.exports.addPayment(req.body.user_id, req.body.amount, 'admin', res, app);
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

module.exports.addPayment = function(userId, amount, method, res, app) {
    var newPayment = new Payment();

    newPayment.user = userId;
    newPayment.amount = amount;
    newPayment.method = method;

    newPayment.save(function(err) {
        if (err) {
            res.apiRes(false,'Error Saving Payment',err);
        } else {
            var formattedAmount = Numeral(newPayment.amount).format('$0,0.00');

            User.findOne({'_id': userId}, function(err, user) {
                Purchase.lockPurchasesForUser(user._id);

                app.sendMail({
                    template: 'payment',
                    to: user.email,
                    subject: 'Thanks for your payment!',
                    base_url: process.env.BASE_URL,
                    amount: formattedAmount,
                    user: user
                });

                user.increaseBalance(newPayment.amount)
                user.save(function (err) {
                    if(err) {
                        return res.apiRes(false, 'Error applying payment to users account', err);
                    } else {
                        return res.apiRes(true, 'Successfully Saved Payment', newPayment);
                    }
                });
            });
        }
    });
}