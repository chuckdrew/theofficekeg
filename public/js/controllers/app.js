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

theofficekeg.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

theofficekeg.controller('app', function ($scope, $state, inform, userService) {

    var app = this;

    $scope.$watch(function(){
        return userService.getCurrentUser();
    }, function(currentUser) {
        app.currentUser = currentUser;
    });

    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        if (toState.requiresAuth === true && !userService.getCurrentUser()) {
            $state.go('login');
            event.preventDefault();
        } else if (toState.requriesNoAuth === true && userService.getCurrentUser()) {
            $state.go('account.view');
            event.preventDefault();
        } else if (toState.requiresRole && !userService.hasRole(toState.requiresRole)) {
            $state.go('account.view');
            inform.add('You do not have the privs to access this action son!', {ttl: 5000, type: 'danger'});
            event.preventDefault();
        }
    });

    app.init = function(currentUser) {
        userService.setCurrentUser(currentUser);
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