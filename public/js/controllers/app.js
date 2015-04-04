var theofficekeg = angular.module("app", [
    'ngResource',
    'ngAnimate',
    'ui.router',
    'ngFitText',
    'inform',
    'app.users',
    'app.purchases',
    'app.kegs'
]);

theofficekeg.controller('app', function ($scope, $rootScope, $window, $http, $state, inform, $interval) {

    var app = this;

    app.currentUser = null;

    var getCurrentUser = function() {
        $http.get('/users/current').success(function(response){
            if(response.success) {
                app.currentUser = response.data;
            } else {
                app.currentUser = null;
            }
        }).error(function() {
            $state.go('login');
            app.currentUser = null;
        });
    }

    $scope.$on('USER_LOGGED_IN', function(event, user) {
        app.currentUser = user;
    });

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
        if(toState.requiresAuth == true && !app.getCurrentUser()) {
            $state.go('login');
        }
    });

    app.scrollIntoView = function(elementId) {
        var offset = $(elementId).offset();
        $("body, html").animate({scrollTop: offset.top}, 500, 'swing');
    }

    app.getCurrentUser = function() {
        return app.currentUser;
    }

    app.init = function() {
        getCurrentUser();
        $interval(function(){
            getCurrentUser();
        }, 3000, null, true);
    }

    app.logout = function() {
        $http.get('/users/logout').success(function(response){
            if(response.success) {
                inform.add('Successfully Logged Out.', {ttl: 3000, type: 'success'});
                $state.go('login');
                app.currentUser = null;
            } else {
                inform.add('Error logging out.', {ttl: 5000, type: 'danger'});
            }
        }).error(function() {
            inform.add('Error logging out.', {ttl: 5000, type: 'danger'});
        });
    }

    $rootScope.safeApply = function(fn) {
        var phase = this.$root.$$phase;
        if(phase == '$apply' || phase == '$digest') {
            if(fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

});