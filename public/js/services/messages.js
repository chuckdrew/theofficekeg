var messagesServiceModule = angular.module('app.service.messages',[]);

messagesServiceModule.service('messagesService', function(inform, $http) {
    var chargeService = this;
    chargeService.notifyAllUsers = function (subject, message) {
        return $http.post('/users/notify-all-users',{subject: subject, message: message}).success(function(response) {
            if(!response.success) {
                inform.add(response.message, {ttl: 5000, type: 'danger'});
            }
        }).error(function(response) {
            inform.add(response.message, {ttl: 5000, type: 'danger'});
        });
    };
});