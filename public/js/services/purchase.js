var purchaseServiceModule = angular.module('app.service.purchase',[]);

purchaseServiceModule.service('purchaseService', function(inform, $http, $q) {

    var purchaseService = this;
    var purchasesLoadLimit = 20;

    purchaseService.add = function(kegId) {
        return $http.post('/purchases/add',{keg_id: kegId}).success(function(response){
            if(response.success) {
                inform.add('Enjoy your pint!', {ttl: 3000, type: 'success'});
            } else {
                inform.add(response.message, {ttl: 5000, type: 'danger'});
            }
        }).error(function(data, status, headers, config) {
            inform.add('Error recording purchase.', {ttl: 5000, type: 'danger'});
        });
    }

    purchaseService.getLatest = function() {
        return $http.get('/purchases/latest').success(function(response) {
            if(!response.success) {
                inform.add(response.message, {ttl: 5000, type: 'danger'});
            }
        }).error(function() {
            inform.add('Error getting latest purchase', {ttl: 5000, type: 'danger'});
        });
    }

    purchaseService.cancel = function(purchase) {
        return $http.get('/purchases/cancel', {params:{purchase_id: purchase._id}}).success(function(response){
            if(response.success) {
                inform.add(response.message, {ttl: 3000, type: 'success'});
            } else {
                inform.add(response.message, {ttl: 5000, type: 'danger'});
            }
        });
    }

    purchaseService.getList = function() {
        return $http.get('/purchases/list', {params:{page: 1, limit: purchasesLoadLimit}}).success(function(response){
            if(response.success) {
                purchases.list = response.data;
            } else {
                inform.add('Error getting ', {ttl: 5000, type: 'danger'});
            }
        });
    }

});