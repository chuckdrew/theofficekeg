var paymentsModule = angular.module('app.payments', [
    'app.service.payment'
]);

paymentsModule.controller('app.controller.payments', function($rootScope, $scope, paymentService, inform) {

    var payments = this;
    var paymentLoadLimit = 10;
    payments.list = null;

    $scope.$watch(function(){
        return paymentService.paymentList;
    }, function(newValue) {
        payments.list = newValue;
    });

    payments.loadPayments = function() {
        paymentService.loadPayments(paymentLoadLimit);
    }

    payments.loadMorePayments = function(count) {
        paymentLoadLimit = paymentLoadLimit + count;
        payments.loadPayments();
    }

    payments.add = function(userId, amount, successCallback) {
        paymentService.addPayment(userId,amount).success(function(response) {
            if(response.success) {
                inform.add(response.message, {ttl: 3000, type: 'success'});
                payments.loadPayments();
                payments.amount = null;
                successCallback.call();
            }
        });
    }

});