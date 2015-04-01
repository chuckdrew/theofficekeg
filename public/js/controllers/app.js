var app = angular.module("app", [
    'ngResource',
    'ngRoute',
    'ngFitText',
    'app.users'
]);

app.config(function($routeProvider) {

});

app.controller('app', function ($scope, $rootScope, $window) {

    $scope.userLoggedIn = false;

    $scope.$on('USER_LOGGED_IN', function(event, data) {
        $scope.userLoggedIn = true;
    });

});