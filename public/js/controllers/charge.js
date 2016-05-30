var chargeModule = angular.module('app.charge', [
    'app.service.charge',
    'app.service.payment',
    'stripe.checkout',
    'fiestah.money'
    ]).config(function(StripeCheckoutProvider) {
        StripeCheckoutProvider.defaults({
            key: "pk_test_isAvnRFlwG4pGaafHWMHdyTc"
        });

        StripeCheckoutProvider.load
    });

chargeModule.controller('app.controller.charge', function($rootScope, $scope, $log, chargeService, paymentService, StripeCheckout, inform) {
    var charge = this;
    charge.amount = null;

    var handler = StripeCheckout.configure({
        name: "The Office Keg",
        token: function(token, args) {
            $log.debug("Got stripe token: " + token.id);
        }
    });

    charge.doCheckout = function(token, args) {

        var options = {
            description: "Add Beer Money!",
            amount: charge.amount * 100
        };

        handler.open(options)
            .then(function(result) {
                var token = result[0].id;
                chargeService.processCharge(token, options.amount).success(function(response) {
                    if(response.success) {
                        inform.add(response.message, {ttl: 3000, type: 'success'});
                        paymentService.loadPayments();
                    }
                });
            });
    };
});