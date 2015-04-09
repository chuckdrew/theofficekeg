var purchasesModule = angular.module('app.purchases', []);

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

purchasesModule.controller('app.controller.purchases', function($rootScope, $scope, $window, $http, $state, inform, $interval) {

    var purchases = this;

    var getLatest = function() {
        $http.get('/purchases/latest').success(function(response){
            if(response.success) {
                purchases.latestPour = response.data;
            }
        });
    }

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

    purchases.latest = function() {
        getLatest();
        $interval(function(){
            getLatest();
        }, 5000, null ,true);
    }

    purchases.list = function(page, limit) {
        $http.get('/purchases/list', {params:{page: page, limit: limit}}).success(function(response){
            if(response.success) {
                purchases.list = response.data;
            }
        });
    }

    purchases.cancel = function(purchase) {
        $http.get('/purchases/cancel', {params:{purchase_id: purchase._id}}).success(function(response){
            if(response.success) {
                inform.add(response.message, {ttl: 3000, type: 'success'});
            } else {
                inform.add(response.message, {ttl: 5000, type: 'danger'});
            }
        });
    }

});