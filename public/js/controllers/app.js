var app = angular.module("app", [
    'ngResource',
    'ui.router',
    'ngFitText',
    'app.users'
]);

app.controller('app', function ($scope, $rootScope, $window, $http, $state) {

    var app = this;

    app.currentUser = null;

    $scope.$on('USER_LOGGED_IN', function(event, user) {
        app.currentUser = user;
    });

    app.scrollIntoView = function(elementId) {
        var offset = $(elementId).offset();
        $("body, html").animate({scrollTop: offset.top}, 500, 'swing');
    }

    app.getCurrentUser = function() {
        return app.currentUser;
    }

    app.init = function() {
        $http.get('/users/current').success(function(response){
            if(response.success) {
                $state.go('account');
                app.currentUser = response.data;
            } else {
                $state.go('login');
                app.currentUser = null;
            }
        }).error(function() {
            $state.go('login');
            app.currentUser = null;
        });
    }

    app.logout = function() {
        $http.get('/users/logout').success(function(response){
            if(response.success) {
                $state.go('login');
                app.currentUser = null;
            } else {
                alert("Error logging out");
            }
        }).error(function() {
            alert("Error logging out");
        });
    }

});