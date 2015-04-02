var usersModule = angular.module('app.users',[
    'app.model.user'
]);

//usersModule.config(function($routeProvider) {
//    $routeProvider.when('/users/login', {
//        templateUrl : '/js/views/users/login.html',
//        controller  : 'app.controller.users',
//        controllerAs: 'users'
//    });
//
//    $routeProvider.when('/users/signup', {
//        templateUrl : '/js/views/users/signup.html',
//        controller  : 'app.controller.users'
//    });
//
//    $routeProvider.when('/users/reset-password', {
//        templateUrl : '/js/views/users/password-reset.html',
//        controller  : 'app.controller.users'
//    });
//
//    $routeProvider.otherwise({
//        templateUrl : '/js/views/users/login.html',
//        controller  : 'app.controller.users'
//    });
//});

usersModule.controller('app.controller.users', function($scope, $window, $http, User) {

    var users = this;

    users.login = function(credentials) {
        $http.post('/users/login', credentials).success(function(response){
            if(response.success) {
                $scope.$emit('USER_LOGGED_IN', response.data);
            } else {
                // Show Error Message
                alert(response.message);
            }

        }).error(function(data, status, headers, config) {
            $window.alert("Error Logging in");
        });;
    }

});