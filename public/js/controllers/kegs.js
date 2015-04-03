var kegsModule = angular.module('app.kegs', []);

kegsModule.controller('app.controller.kegs', function($rootScope, $scope, $window, $http, $state, inform) {

    var kegs = this;

    kegs.getActiveKeg = function() {
        $http.get('/kegs/active').success(function(response){
            if(response.success) {
                kegs.activeKeg = response.data;
            } else {
                inform.add(response.message, {ttl: 5000, type: 'danger'});
            }
        });
    }

});