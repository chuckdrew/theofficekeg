var purchasesModule = angular.module('app.purchases', [
    'app.service.purchase'
]);

purchasesModule.config(function($stateProvider) {

    $stateProvider.state('cancel_purchase_success', {
        url: "/purchases/cancel-success",
        requiresAuth: false,
        requiresRole: false,
        controller: function($state, inform) {
            $state.go('account.view');
            inform.add('Purchase successfully cancelled.', {ttl: 3000, type: 'success'});
        }
    });

    $stateProvider.state('cancel_purchase_error', {
        url: "/purchases/cancel-error",
        requiresAuth: false,
        requiresRole: false,
        controller: function($state, inform) {
            $state.go('account.view');
            inform.add('Error Cancelling Purchase.', {ttl: 5000, type: 'danger'});
        }
    });

    $stateProvider.state('purchase_already_cancelled', {
        url: "/purchases/already-canceled",
        requiresAuth: false,
        requiresRole: false,
        controller: function($state, inform) {
            $state.go('account.view');
            inform.add('Purchase was already cancelled.', {ttl: 5000, type: 'danger'});
        }
    });

    $stateProvider.state('purchase_locked', {
        url: "/purchases/locked",
        requiresAuth: false,
        requiresRole: false,
        controller: function($state, inform) {
            $state.go('account.view');
            inform.add('Purchase is locked and can no longer be cancelled.', {ttl: 5000, type: 'danger'});
        }
    });

});

purchasesModule.controller('app.controller.purchases', function($scope, $interval, purchaseService) {

    var purchases = this;
    var purchasesLoadLimit = 10;
    purchases.list = null;
    purchases.latestPour = null;

    $scope.$watch(function(){
        return purchaseService.purchasesList;
    }, function(newValue) {
        purchases.list = newValue;
    });

    $scope.$watch(function(){
        return purchaseService.latestPour;
    }, function(newValue) {
        purchases.latestPour = newValue;
    });

    purchases.add = function(kegId) {
        purchaseService.add(kegId).success(function() {
            purchases.loadPurchases();
        });
    }

    purchases.latest = function() {
        purchaseService.loadLatest();
        purchaseService.initLatestPolling();
    }

    purchases.loadPurchases = function() {
        purchaseService.loadPurchases(purchasesLoadLimit);
    }

    purchases.loadMorePurchases = function(count) {
        purchasesLoadLimit = purchasesLoadLimit + count;
        purchases.loadPurchases();
    }

    purchases.cancel = function(purchase) {
        purchaseService.cancel(purchase).success(function() {
            purchases.loadPurchases();
        });
    }

});