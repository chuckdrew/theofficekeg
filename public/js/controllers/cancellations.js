var cancellationsModule = angular.module('app.cancellation', [
    'app.service.purchase'
]);

cancellationsModule.config(function($stateProvider) {

    $stateProvider.state('cancel_purchase_success', {
        url: "/purchases/cancel-success",
        requiresAuth: false,
        requiresRole: false
    });

    $stateProvider.state('cancel_purchase_error', {
        url: "/purchases/cancel-error",
        requiresAuth: false,
        requiresRole: false
    });

    $stateProvider.state('purchase_already_cancelled', {
        url: "/purchases/already-canceled",
        requiresAuth: false,
        requiresRole: false
    });

});

cancellationsModule.controller('app.controller.cancellations', function($scope, $state) {

    $scope.$on('$stateChangeStart', function(event, toState){
        if(toState.name == "cancel_purchase_success") {
            inform.add('Successfully Canceled Purchase.', {ttl: 3000, type: 'success'});
            $state.go('account.view');
        }

        if(toState.name == "cancel_purchase_error") {
            inform.add('Error Canceling Purchase.', {ttl: 5000, type: 'danger'});
            $state.go('account.view');
        }

        if(toState.name == "purchase_already_cancelled") {
            inform.add('Purchase already cancelled.', {ttl: 5000, type: 'danger'});
            $state.go('account.view');
        }
    });

});