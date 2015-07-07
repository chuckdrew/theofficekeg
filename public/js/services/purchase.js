var purchaseServiceModule = angular.module('app.service.purchase',[]);

purchaseServiceModule.service('purchaseService', function(inform, $http, $interval) {

    var purchaseService = this;
    purchaseService.purchasesList = null;
    purchaseService.latestPour = null;
    purchaseService.latestPurchasePollingPromise = null;

    purchaseService.add = function(kegId) {
        return $http.post('/purchases/add',{keg_id: kegId}).success(function(response){
            if(response.success) {
                inform.add('Enjoy your pint!', {ttl: 3000, type: 'success'});
            } else {
                inform.add(response.message, {ttl: 5000, type: 'danger'});
            }
        }).error(function(response) {
            inform.add(response.message, {ttl: 5000, type: 'danger'});
        });
    }

    purchaseService.loadLatest = function() {
        return $http.get('/purchases/latest').success(function(response) {
            if(response.success) {
                purchaseService.latestPour = response.data;
            } else {
                inform.add(response.message, {ttl: 5000, type: 'danger'});
            }
        }).error(function(response) {
            inform.add(response.message, {ttl: 5000, type: 'danger'});
        });
    }

    purchaseService.initLatestPolling = function() {
        purchaseService.latestPurchasePollingPromise = $interval(function(){
            purchaseService.loadLatest();
        }, 5000, null ,true);
    }

    purchaseService.cancel = function(purchase) {
        return $http.get('/purchases/cancel', {params:{purchase_id: purchase._id}}).success(function(response){
            if(response.success) {
                inform.add(response.message, {ttl: 3000, type: 'success'});
            } else {
                inform.add(response.message, {ttl: 5000, type: 'danger'});
            }
        }).error(function(response) {
            inform.add(response, {ttl: 5000, type: 'danger'});
        });
    }

    purchaseService.loadPurchases = function(limit) {
        return $http.get('/purchases/list', {params:{page: 1, limit: limit}}).success(function(response){
            if(response.success) {
                purchaseService.purchasesList = response.data;
            } else {
                inform.add('Error loading purchases.', {ttl: 5000, type: 'danger'});
            }
        }).error(function(response) {
            inform.add(response, {ttl: 5000, type: 'danger'});
        });
    }

});