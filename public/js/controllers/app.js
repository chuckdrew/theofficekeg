var app = angular.module("app", [
    'ngResource',
    'ngRoute',
    'ngFitText',
    'app.users'
]);

app.config(function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl : '/js/views/login.html',
        controller  : 'app.controller.users'
    });

    $routeProvider.when('/signup', {
        templateUrl : '/js/views/signup.html',
        controller  : 'app.controller.users'
    });
});

app.controller('app', function ($scope, $rootScope, $window) {

    $scope.userLoggedIn = false;

    $scope.$on('USER_LOGGED_IN', function(event, data) {
        $scope.userLoggedIn = true;
    });

});