var chargeModule = angular.module('app.charge', ['stripe.checkout', 'fiestah.money'])
    .config(function(StripeCheckoutProvider) {
        // You can use the provider to set defaults for all handlers
        // you create. Any of the options you'd pass to
        // StripeCheckout.configure() are valid.
        StripeCheckoutProvider.defaults({
            key: "pk_test_isAvnRFlwG4pGaafHWMHdyTc"
        });

        StripeCheckoutProvider.load
    });

chargeModule.controller('app.controller.charge', function($rootScope, $scope, $log, StripeCheckout) {
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

        // The default handler API is enhanced by having open()
        // return a promise. This promise can be used in lieu of or
        // in addition to the token callback (or you can just ignore
        // it if you like the default API).
        //
        // The rejection callback doesn't work in IE6-7.
        handler.open(options)
            .then(function(result) {
                alert("Got Stripe token: " + result[0].id);
            },function() {
                alert("Stripe Checkout closed without making a sale :(");
            });
    };
});