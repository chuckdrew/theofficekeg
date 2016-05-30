var PaymentService = require('./payments');

module.exports = function(app, passport) {
    var express = require('express');
    var router = express.Router();
    var stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

    router.post('/processCharge', passport.checkAuth('guest'), function(req, res) {
        var stripeToken = req.body.token;
        var userId = req.user._id;
        var amount = req.body.amount;

        var charge = stripe.charges.create({
            amount: amount,
            currency: "usd",
            source: stripeToken,
            description: "Office Keg Payment",
            metadata: { 'User Id': req.user._id.toString(),
                        'Email': req.user.email,
                        'First Name': req.user.first_name,
                        'Last Name': req.user.last_name}
        }, function(err, charge) {
            if (err && err.type === 'StripeCardError') {
                res.apiRes(false, 'Your card has been declined.', err);
            }
            else {
                PaymentService.addPayment(userId, (amount/100), res, app);
            }
        });
    });

    return router;
}
