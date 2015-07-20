var kegsModule = angular.module('app.kegs', [
    'app.service.keg'
]);

kegsModule.config(function($stateProvider) {

    $stateProvider.state('account.admin.kegs', {
        url: "/kegs",
        redirectTo: 'account.admin.kegs.list',
        templateUrl: "/js/views/admin/kegs.html",
        controller: 'app.controller.kegs as kegs',
        requiresAuth: true,
        requiresRole: 'admin',
        parent: 'account.admin'
    });

    $stateProvider.state('account.admin.kegs.list', {
        url: "/list",
        templateUrl: "/js/views/admin/kegs/list.html",
        controller: 'app.controller.kegs as kegs',
        requiresAuth: true,
        requiresRole: 'admin',
        parent: 'account.admin.kegs'
    });

    $stateProvider.state('account.admin.kegs.edit', {
        url: "/edit/{id}",
        templateUrl: "/js/views/admin/kegs/edit.html",
        controller: 'app.controller.kegs as kegs',
        requiresAuth: true,
        requiresRole: 'admin',
        parent: 'account.admin.kegs'
    });

    $stateProvider.state('account.admin.kegs.add', {
        url: "/add",
        templateUrl: "/js/views/admin/kegs/add.html",
        controller: 'app.controller.kegs as kegs',
        requiresAuth: true,
        requiresRole: 'admin',
        parent: 'account.admin.kegs'
    });

});

kegsModule.controller('app.controller.kegs', function($rootScope, $scope, $window, $http, $state, inform, kegService, $stateParams) {

    var kegs = this;
    kegs.kegs = null;

    kegs.getActiveKeg = function() {
        kegService.getActiveKeg().success(function(response){
            if(response.success) {
                kegs.activeKeg = response.data;
            }
        });
    }

    kegs.loadKegs = function(limit) {
        kegService.loadKegs(limit).success(function(response){
            if(response.success) {
                kegs.kegs = response.data;
            }
        });
    }

    kegs.loadKeg = function() {
        kegService.loadKeg($stateParams.id).success(function(response){
            if(response.success) {
                kegs.keg = response.data;
            }
        });
    }

    kegs.add = function(keg) {
        kegService.add(keg).success(function(response){
            if(response.success) {
                inform.add(response.message, {ttl: 3000, type: 'success'});
                $state.go('account.admin.kegs.list');
            }
        });
    }

    kegs.update = function(keg) {
        kegService.update(keg).success(function(response){
            if(response.success) {
                inform.add(response.message, {ttl: 3000, type: 'success'});
            }
        });
    }

    kegs.activate = function(keg) {
        kegService.activate(keg).success(function(response) {
            if(response.success) {
                kegs.loadKeg();
                inform.add(response.message, {ttl: 3000, type: 'success'});
            }
        });
    }

});