var scansModule = angular.module('app.scans', [
    'app.service.scan',
    'app.service.user'
]);

scansModule.config(function($stateProvider) {

    $stateProvider.state('account.admin.orphan-scans', {
        url: "/orphan-scans",
        templateUrl: "/js/views/admin/orphan-scans.html",
        controller: 'app.controller.scans as scans',
        requiresAuth: true,
        requiresRole: 'admin',
        parent: 'account.admin'
    });

});

scansModule.controller('app.controller.scans', function(scanService, userService, inform) {

    var scans = this;
    var scansLoadLimit = 10;

    scans.loadOrphansScans = function() {
        scans.orphans = null;
        scanService.loadOrphansScans(scansLoadLimit).success(function(response){
            if(response.success) {
                scans.orphans = response.data;
            }
        });
    }

    scans.loadMoreOrphanScans = function(count) {
        scansLoadLimit = scansLoadLimit + count;
        scans.loadOrphansScans();
    }

    scans.loadAllUsers = function() {
        userService.getAllUsers().success(function(response){
            if(response.success) {
                scans.users = response.data;
            }
        });
    }

    scans.assignScanToUser = function(userId, scanId) {
        scanService.assignScanToUser(userId, scanId).success(function(response){
            if(response.success) {
                inform.add(response.message, {ttl: 5000, type: 'success'});
            } else {
                inform.add(response.message, {ttl: 5000, type: 'danger'});
            }

            scans.loadOrphansScans();
        });
    }

});