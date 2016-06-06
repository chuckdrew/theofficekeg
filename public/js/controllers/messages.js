var messagesModule = angular.module('app.messages',[
    'app.service.messages'
]);

messagesModule.controller('app.controller.messages', function($rootScope, $scope, $log, messagesService, inform) {
    var messages = this;
    messages.subject = null;
    messages.message = null;

    messages.notifyAllUsers = function() {
        if(!messages.subject) {
            inform.add("Please enter in a subject.", {ttl: 5000, type: 'danger'});
        }

        if(!messages.message) {
            inform.add("Please enter in a message.", {ttl: 5000, type: 'danger'});
        }

        messagesService.notifyAllUsers(messages.subject, messages.message).success(function(response) {
            if(response.success) {
                messages.subject = null;
                messages.message = null;
                
                inform.add(response.message, {ttl: 5000, type: 'success'});
            }
        }).error(function(response) {
            inform.add(response.message, {ttl: 5000, type: 'danger'});
        });
    };
});