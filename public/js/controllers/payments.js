var paymentsModule = angular.module('app.payments', []);

paymentsModule.controller('app.controller.payments', function($rootScope, $scope, $window, $http, $state, inform, $interval) {

    var payments = this;
    var paymentLoadLimit = 10;

    payments.loadPayments = function() {
        $http.get('/payments/list', {params:{page: 1, limit: paymentLoadLimit}}).success(function(response){
            if(response.success) {
                payments.list = response.data;
            }
        });
    }

    payments.loadMorePayments = function(count) {
        paymentLoadLimit = paymentLoadLimit + count;
        payments.loadPayments();
    }

    payments.add = function(userId, amount) {
        alert("This needs to be wired up! " + amount);
    }

});