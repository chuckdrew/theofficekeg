var paymentServiceModule = angular.module('app.service.payment',[]);

paymentServiceModule.service('paymentService', function(inform, $http) {

    var paymentService = this;
    paymentService.paymentList = null;

    paymentService.loadPayments = function(limit) {
        return $http.get('/payments/list', {params:{page: 1, limit: limit}}).success(function(response){
            if(response.success) {
                paymentService.paymentList = response.data;
            } else {
                inform.add('Error loading purchases.', {ttl: 5000, type: 'danger'});
            }
        }).error(function(response) {
            inform.add(response, {ttl: 5000, type: 'danger'});
        });
    }

    paymentService.addPayment = function(userId, amount) {
        return $http.post('/payments/add',{user_id:userId,amount:amount}).success(function(response){
            if(!response.success) {
                inform.add(response.message, {ttl: 5000, type: 'danger'});
            }
        }).error(function(response) {
            inform.add(response.message, {ttl: 5000, type: 'danger'});
        });
    }

});