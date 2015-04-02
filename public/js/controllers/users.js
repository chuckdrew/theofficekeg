var usersModule = angular.module('app.users',[
    'app.model.user'
]);

usersModule.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/");

    $stateProvider.state('login', {
        url: "/users/login",
        templateUrl: "/js/views/users/login.html",
        controller: 'app.controller.users as users'
    });

    $stateProvider.state('signup', {
        url: "/users/signup",
        templateUrl: "/js/views/users/signup.html",
        controller: 'app.controller.users as users'
    });

    $stateProvider.state('reset_password', {
        url: "/users/reset-password",
        templateUrl: "/js/views/users/password-reset.html",
        controller: 'app.controller.users as users'
    });

    $stateProvider.state('account', {
        url: "/users/account",
        templateUrl: "/js/views/users/account.html",
        controller: 'app.controller.users as users'
    });

});

usersModule.controller('app.controller.users', function($scope, $window, $http, $state, User) {

    var users = this;

    users.login = function(credentials) {
        $http.post('/users/login', credentials).success(function(response){
            if(response.success) {
                $state.go('account');
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