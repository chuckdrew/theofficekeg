var usersModule = angular.module('app.users',[
    'app.model.user'
]);

usersModule.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/users/account");

    $stateProvider.state('login', {
        url: "/users/login",
        templateUrl: "/js/views/users/login.html",
        controller: 'app.controller.users as users',
        requiresAuth: false
    });

    $stateProvider.state('signup', {
        url: "/users/signup",
        templateUrl: "/js/views/users/signup.html",
        controller: 'app.controller.users as users',
        requiresAuth: false
    });

    $stateProvider.state('reset_password', {
        url: "/users/reset-password",
        templateUrl: "/js/views/users/password-reset.html",
        controller: 'app.controller.users as users',
        requiresAuth: false
    });

    $stateProvider.state('account', {
        url: "/users/account",
        templateUrl: "/js/views/users/account.html",
        controller: 'app.controller.users as users',
        requiresAuth: true
    });

});

usersModule.controller('app.controller.users', function($scope, $window, $http, $state, inform) {

    var users = this;

    users.login = function(credentials) {
        $http.post('/users/login', credentials).success(function(response){
            if(response.success) {
                $state.go('account');
                $scope.$emit('USER_LOGGED_IN', response.data);
            } else {
                inform.add(response.message, {ttl: 5000, type: 'danger'});
            }

        }).error(function(data, status, headers, config) {
            $window.alert("Error Logging in");
        });;
    }

    users.signup = function(newUser) {
        $http.post('/users/signup', newUser).success(function(response){
            if(response.success) {
                $state.go('account');
                $scope.$emit('USER_LOGGED_IN', response.data);
            } else {
                inform.add(response.message, {ttl: 5000, type: 'danger'});
            }

        }).error(function(data, status, headers, config) {
            $window.alert("Error Creating Account");
        });;
    }

});