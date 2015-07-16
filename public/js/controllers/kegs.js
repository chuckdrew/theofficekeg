var kegsModule = angular.module('app.kegs', [
    'app.service.keg'
]);

kegsModule.controller('app.controller.kegs', function($rootScope, $scope, $window, $http, $state, inform, kegService) {

    var kegs = this;
    kegs.kegs = null;

    kegs.getActiveKeg = function() {
        kegService.getActiveKeg().success(function(response){
            if(response.success) {
                kegs.activeKeg = response.data;
            }
        });
    }

});