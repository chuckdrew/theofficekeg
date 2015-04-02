var app = angular.module("app", [
    'ngResource',
    'ui.router',
    'ngFitText',
    'app.users'
]);

app.controller('app', function ($scope, $rootScope, $window, $http) {

    var app = this;

    app.currentUser = null;

    $scope.$on('USER_LOGGED_IN', function(event, user) {
        app.currentUser = user;
    });

    app.getCurrentUser = function() {
        return app.currentUser;
    }

    app.init = function() {
        $http.get('/users/current').success(function(response){
            if(response.success) {
                app.currentUser = response.data;
            } else {
                app.currentUser = null;
            }
        }).error(function() {
            app.currentUser = null;
        });
    }

    app.logout = function() {
        $http.get('/users/logout').success(function(response){
            if(response.success) {
                app.currentUser = null;
            } else {
                alert("Error logging out");
            }
        }).error(function() {
            alert("Error logging out");
        });
    }

});