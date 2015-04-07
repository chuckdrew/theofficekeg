var Payment = require('../models/payment');
var User = require('../models/user');

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

    return router;
}