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

    $stateProvider.state('password_reset_login', {
        url: "/users/password-reset-login",
        requiresAuth: true,
        requiresRole: 'guest',
        controller: function($state, inform) {
            $state.go('account.edit');
            inform.add('Successfully Logged In. Please Change your password.', {ttl: 3000, type: 'success'});
        }
    });

    $stateProvider.state('invalid_password_reset_token', {
        url: "/users/invalid-password-reset-token",
        requiresAuth: false,
        requiresRole: false,
        controller: function($state, inform) {
            $state.go('reset_password');
            inform.add('Invalid password reset token. Please use the password reset form again.', {ttl: 5000, type: 'danger'});
        }
    });

});

usersModule.controller('app.controller.users', function($scope, $state, inform, userService) {

    var users = this;
    users.user = userService.getCurrentUser();

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

    users.sendPasswordResetEmail = function(email) {
        userService.sendPasswordResetEmail(email).success(function(response){
            if(response.success) {
                $state.go('login');
            }
        });
    }

    users.update = function(user) {
        userService.update(user);
    }

});