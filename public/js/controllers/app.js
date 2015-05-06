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

theofficekeg.config(function($interpolateProvider, $stateProvider, $urlRouterProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');

    $stateProvider.state('home', {
        url: "/",
        controller: function($state) {
            $state.go('account.view');
        }
    });

});

theofficekeg.controller('app', function ($scope, $location, $state, inform, userService) {

    var app = this;

    $scope.$watch(function(){
        return userService.getCurrentUser();
    }, function(currentUser) {
        app.currentUser = currentUser;
    });

    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        if (toState.requiresAuth === true && !userService.getCurrentUser()) {
            event.preventDefault();
            $state.go('login');
        } else if (toState.requiresNoAuth === true && userService.getCurrentUser()) {
            event.preventDefault();
            $state.go('account.view');
        } else if (toState.requiresRole && !userService.hasRole(toState.requiresRole)) {
            event.preventDefault();
            $state.go('account.view');
            inform.add('You do not have the privs to access this action son!', {ttl: 5000, type: 'danger'});
        }
    });
    
    app.init = function(currentUser) {
        userService.setCurrentUser(currentUser);

        if($location.path() == "/" || $location.path() == "") {
            $state.go('account.view');
        }
    }

    app.getCurrentUser = function() {
        return app.currentUser;
    }

    app.hasRole = function(role) {
        return userService.hasRole(role)
    }

    app.scrollIntoView = function(elementId) {
        var offset = $(elementId).offset();
        $("body, html").animate({scrollTop: offset.top}, 500, 'swing');
    }

});