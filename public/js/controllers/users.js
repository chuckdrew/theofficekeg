var usersModule = angular.module('app.users',[
    'app.service.user'
]);

usersModule.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider.state('login', {
        url: "/users/login",
        templateUrl: "/js/views/login.html",
        controller: 'app.controller.users as users',
        requiresAuth: false,
        requiresRole: false,
        requiresNoAuth: true
    });

    $stateProvider.state('signup', {
        url: "/users/signup",
        templateUrl: "/js/views/signup.html",
        controller: 'app.controller.users as users',
        requiresAuth: false,
        requiresRole: false,
        requiresNoAuth: true
    });

    $stateProvider.state('reset_password', {
        url: "/users/reset-password",
        templateUrl: "/js/views/password-reset.html",
        controller: 'app.controller.users as users',
        requiresAuth: false,
        requiresRole: false,
        requiresNoAuth: true
    });

    $stateProvider.state('account', {
        url: "/users/account",
        templateUrl: "/js/views/account.html",
        controller: 'app.controller.users as users',
        requiresAuth: true,
        requiresRole: 'guest'
    }).state('account.view', {
        url: "/view",
        templateUrl: "/js/views/account.view.html",
        controller: 'app.controller.users as users',
        requiresAuth: true,
        requiresRole: 'guest'
    }).state('account.edit', {
        url: "/edit",
        templateUrl: "/js/views/account.edit.html",
        controller: 'app.controller.users as users',
        requiresAuth: true,
        requiresRole: 'guest'
    }).state('account.admin', {
        url: "/admin",
        templateUrl: "/js/views/account.admin.html",
        controller: 'app.controller.users as users',
        requiresAuth: true,
        requiresRole: 'admin'
    });

});

usersModule.controller('app.controller.users', function($scope, $state, inform, userService) {

    var users = this;

    users.login = function(credentials) {
        userService.login(credentials).success(function(response) {
            if(response.success) {
                $state.go('account.view');
                $scope.$emit('USER_LOGGED_IN', response.data);
            }
        });
    }

    users.signup = function(newUser) {
        userService.signup(newUser).success(function(response) {
            if(response.success) {
                $state.go('account.view');
                $scope.$emit('USER_LOGGED_IN', response.data);
            }
        });
    }

    users.logout = function() {
        userService.logout().success(function(response) {
            if(response.success) {
                $state.go('login');
            }
        });
    }

});