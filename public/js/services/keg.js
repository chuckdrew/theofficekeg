var kegServiceModule = angular.module('app.service.keg',[]);

kegServiceModule.service('kegService', function(inform, $http) {

    var kegService = this;

    kegService.getActiveKeg = function() {
        return $http.get('/kegs/active').success(function (response) {
            if (!response.success) {
                inform.add(response.message, {ttl: 5000, type: 'danger'});
            }
        }).error(function (response) {
            inform.add(response, {ttl: 5000, type: 'danger'});
        });
    }

    kegService.loadKegs = function(limit) {
        return $http.get('/kegs/list', {params:{page: 1, limit: limit}}).success(function (response) {
            if (!response.success) {
                inform.add(response.message, {ttl: 5000, type: 'danger'});
            }
        }).error(function (response) {
            inform.add(response, {ttl: 5000, type: 'danger'});
        });
    }

});