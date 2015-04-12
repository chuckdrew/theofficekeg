var theofficekeg = angular.module("app", [
    'ngResource',
    'ngAnimate',
    'ui.router',
    'ngFitText',
    'inform',
    'app.users',
    'app.purchases',
    'app.payments',
    'app.kegs'
]);

theofficekeg.controller('app', function ($scope, $state, inform, $interval, userService) {

    var app = this;

    $scope.$watch(function(){
        return userService.getCurrentUser();
    }, function(newValue) {
        app.currentUser = newValue;
    });

    $scope.$on('$stateChangeStart', function(event, toState){
        if(toState.requiresAuth == true && !userService.getCurrentUser()) {
            $state.go('login');
            event.preventDefault();
        } else if(toState.requiresRole != false && !userService.hasRole(toState.requiresRole)) {
            event.preventDefault();
            $state.go('account.view');
            inform.add('You do not have the privs to access this action son!', {ttl: 5000, type: 'danger'});
        }

        if(toState.name == "cancel_purchase_success") {
            inform.add('Successfully Canceled Purchase.', {ttl: 3000, type: 'success'});
            $state.go('account.view');
        }

        if(toState.name == "cancel_purchase_error") {
            inform.add('Error Canceling Purchase.', {ttl: 5000, type: 'danger'});
            $state.go('account.view');
        }

        if(toState.name == "purchase_already_cancelled") {
            inform.add('Purchase already cancelled.', {ttl: 5000, type: 'danger'});
            $state.go('account.view');
        }
    });

    app.init = function() {
        userService.loadCurrentUser();
        userService.initUserPolling();
    }

    app.getCurrentUser = function() {
        return app.currentUser;
    }

    app.scrollIntoView = function(elementId) {
        var offset = $(elementId).offset();
        $("body, html").animate({scrollTop: offset.top}, 500, 'swing');
    }

});