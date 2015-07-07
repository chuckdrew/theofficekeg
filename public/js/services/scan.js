var scanServiceModule = angular.module('app.service.scan',[]);

scanServiceModule.service('scanService', function(inform, $http) {

    var scanService = this;

    scanService.loadOrphansScans = function(limit) {
        return $http.get('/scans/orphans', {params:{page: 1, limit: limit}}).success(function(response){
            if(!response.success) {
                inform.add(response.message, {ttl: 5000, type: 'danger'});
            }
        }).error(function(response) {
            inform.add(response, {ttl: 5000, type: 'danger'});
        });
    }

    scanService.assignScanToUser = function(userId, scanId) {
        return $http.put('/scans/assign-to-user', {userId: userId, scanId:scanId}).success(function(response) {
            if(!response.success) {
                inform.add(response.message, {ttl: 5000, type: 'danger'});
            }
        }).error(function(response) {
            inform.add(response, {ttl: 5000, type: 'danger'});
        });
    }

});