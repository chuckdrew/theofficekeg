var purchasesModule = angular.module('app.purchases', []);

purchasesModule.config(function($stateProvider) {

    $stateProvider.state('cancel_purchase_success', {
        url: "/purchases/cancel-success"
    });

    $stateProvider.state('cancel_purchase_error', {
        url: "/purchases/cancel-error"
    });

});

purchasesModule.controller('app.controller.purchases', function($rootScope, $scope, $window, $http, $state, inform) {

    var purchases = this;

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
        if(toState.name == "cancel_purchase_success") {
            inform.add('Successfully Canceled Purchase.', {ttl: 3000, type: 'success'});
            $state.go('account');
        }

        if(toState.name == "cancel_purchase_error") {
            inform.add('Error Canceling Purchase.', {ttl: 5000, type: 'danger'});
            $state.go('account');
        }
    });

    purchases.add = function(keg_id) {
        $http.post('/purchases/add',{keg_id: keg_id}).success(function(response){
            if(response.success) {
                inform.add('Enjoy your pint!', {ttl: 3000, type: 'success'});
            } else {
                inform.add(response.message, {ttl: 5000, type: 'danger'});
            }

        }).error(function(data, status, headers, config) {
            inform.add('Error recording purchase.', {ttl: 5000, type: 'danger'});
        });;
    }

});