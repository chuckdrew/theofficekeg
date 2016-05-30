var chargeServiceModule = angular.module('app.service.charge',[]);

chargeServiceModule.service('chargeService', function(inform, $http) {
    var chargeService = this;
    chargeService.processCharge = function (token, amount) {
        return $http.post('/charge/processCharge',{token: token, amount: amount}).success(function(response) {
            if(!response.success) {
                inform.add(response.message, {ttl: 5000, type: 'danger'});
            }
        }).error(function(response) {
            inform.add(response.message, {ttl: 5000, type: 'danger'});
        });
    };
});