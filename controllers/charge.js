module.exports = function(app, passport) {
    var express = require('express');
    var router = express.Router();
    var stripe = require("stripe")("sk_test_DxRlPfTv2cliE3EgGfKWVSl3");

    router.post('/processCharge', passport.checkAuth('guest'), function(req, res) {
        var stripeToken = req.body.token;

        var charge = stripe.charges.create({
            amount: req.body.amount,
            currency: "usd",
            source: stripeToken,
            description: "Example charge"
        }, function(err, charge) {
            if (err && err.type === 'StripeCardError') {
                res.apiRes(false, 'Your card has been declined.', err);
            }
        });
    });

    return router;
}
