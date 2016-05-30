var PaymentService = require('payments');
var Payment = require('../models/payment');
var User = require('../models/user');
var Purchase = require('../models/purchase');

module.exports = function(app, passport) {
    var express = require('express');
    var router = express.Router();
    var stripe = require("stripe")("sk_test_DxRlPfTv2cliE3EgGfKWVSl3");

    router.post('/processCharge', passport.checkAuth('guest'), function(req, res) {
        var stripeToken = req.body.token;
        var userId = req.user._id;
        var amount = req.body.amount;

        var charge = stripe.charges.create({
            amount: amount,
            currency: "usd",
            source: stripeToken,
            description: "Example charge"
        }, function(err, charge) {
            if (err && err.type === 'StripeCardError') {
                res.apiRes(false, 'Your card has been declined.', err);
            }
            else {
                PaymentService.addPayment(userId, (amount/100), res);
            }
        });
    });

    return router;
}
