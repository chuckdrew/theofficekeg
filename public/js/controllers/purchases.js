var purchasesModule = angular.module('app.purchases', [
    'app.service.purchase'
]);

purchasesModule.config(function($stateProvider) {

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

purchasesModule.controller('app.controller.purchases', function($interval, purchaseService) {

    var purchases = this;
    var purchasesLoadLimit = 20;

    purchases.add = function(kegId) {
        purchaseService.add(kegId).success(function() {
            purchases.loadPurchases();
        });
    }

    purchases.latest = function() {
        purchaseService.getLatest().success(function(response) {
            purchases.latestPour = response.data;
        });

        $interval(function(){
            purchaseService.getLatest().success(function(response) {
                purchases.latestPour = response.data;
            });
        }, 5000, null ,true);
    }

    purchases.loadPurchases = function() {
        purchaseService.getList(purchasesLoadLimit).success(function(response){
            purchases.list = response.data;
        });
    }

    purchases.loadMorePurchases = function(count) {
        purchasesLoadLimit = purchasesLoadLimit + count;
        purchases.loadPurchases();
    }

    purchases.cancel = function(purchase) {
        purchaseService.cancel(purchase).success(function() {
            purchases.loadPurchases();
        })
    }

});