var PaymentService = require('./payments');
var User = require('../models/user');
var Numeral = require('numeral');

module.exports = function(app, passport) {
    var express = require('express');
    var router = express.Router();
    var stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

    router.post('/processCharge', passport.checkAuth('guest'), function(req, res) {
        var stripeToken = req.body.token;
        var userId = req.user._id;
        var amount = req.body.amount;

        if(amount/100 < 10) {
            res.apiRes(false, 'Please add at least $10.00.');
        }
        else {
            var charge = stripe.charges.create({
                amount: amount,
                currency: "usd",
                source: stripeToken,
                description: "Office Keg Payment",
                metadata: {
                    'User Id': req.user._id.toString(),
                    'Email': req.user.email,
                    'First Name': req.user.first_name,
                    'Last Name': req.user.last_name
                }
            }, function (err, charge) {
                if (err && err.type === 'StripeCardError') {
                    res.apiRes(false, 'Your card has been declined.', err);
                }
                else {

                    User.findOne({'_id': userId}, function(err, user) {
                        var formattedAmount = Numeral(amount/100).format('$0,0.00');
                        var formattedBalance = Numeral(user.balance).format('$0,0.00');
                        User.getUsersWithRole('admin').then(function (users) {
                            users.forEach(function (adminUser) {
                                app.sendMail({
                                    template: 'creditCardCharged',
                                    to: adminUser.email,
                                    subject: user.first_name + " " + user.last_name + " just added " + formattedAmount + ".",
                                    base_url: process.env.BASE_URL,
                                    amount: formattedAmount,
                                    balance: formattedBalance,
                                    user: user,
                                    admin_user: adminUser
                                });
                            });
                        });
                    });

                    PaymentService.addPayment(userId, (amount / 100), 'creditcard', res, app);
                }
            });
        }
    });

    return router;
}
