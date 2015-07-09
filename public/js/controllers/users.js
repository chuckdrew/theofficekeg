var usersModule = angular.module('app.users',[
    'app.service.user'
]);

usersModule.config(function($stateProvider) {

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

    $stateProvider.state('logout', {
        url: "/users/logout",
        templateUrl: "/js/views/account.logout.html",
        controller: function($state, userService) {
            userService.logout().success(function(response) {
                if(response.success) {
                    $state.go('login');
                }
            });
        },
        requiresAuth: true,
        requiresRole: false
    });

    $stateProvider.state('reset_password', {
        url: "/users/reset-password",
        templateUrl: "/js/views/password-reset.html",
        controller: 'app.controller.users as users',
        requiresAuth: false,
        requiresRole: false,
        requiresNoAuth: true
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

    $stateProvider.state('account', {
        url: "/users/account",
        redirectTo: 'account.view',
        templateUrl: "/js/views/account.html",
        requiresAuth: true,
        requiresRole: false
    })

    $stateProvider.state('account.view', {
        url: "/view",
        templateUrl: "/js/views/account.view.html",
        controller: 'app.controller.users as users',
        requiresAuth: true,
        requiresRole: false,
        parent: 'account'
    });

    $stateProvider.state('account.edit', {
        url: "/edit",
        templateUrl: "/js/views/account.edit.html",
        controller: 'app.controller.users as users',
        requiresAuth: true,
        requiresRole: false,
        parent: 'account'
    });

    $stateProvider.state('account.admin', {
        url: '/admin',
        redirectTo: 'account.admin.overview',
        templateUrl: "/js/views/account.admin.html",
        requiresAuth: true,
        requiresRole: 'admin',
        parent: 'account'
    });

    $stateProvider.state('account.admin.overview', {
        url: "/overview",
        templateUrl: "/js/views/admin/overview.html",
        controller: 'app.controller.users as overview',
        requiresAuth: true,
        requiresRole: 'admin',
        parent: 'account.admin'
    });

    $stateProvider.state('account.admin.users', {
        url: "/users",
        redirectTo: 'account.admin.users.list',
        templateUrl: "/js/views/admin/users.html",
        controller: 'app.controller.users as users',
        requiresAuth: true,
        requiresRole: 'admin',
        parent: 'account.admin'
    });

    $stateProvider.state('account.admin.users.edit', {
        url: "/edit/{id}",
        templateUrl: "/js/views/admin/users/edit.html",
        controller: 'app.controller.users as users',
        requiresAuth: true,
        requiresRole: 'admin',
        parent: 'account.admin.users'
    });

    $stateProvider.state('account.admin.users.list', {
        url: "/list",
        templateUrl: "/js/views/admin/users/list.html",
        controller: 'app.controller.users as users',
        requiresAuth: true,
        requiresRole: 'admin',
        parent: 'account.admin.users'
    });

    $stateProvider.state('account.admin.kegs', {
        url: "/kegs",
        templateUrl: "/js/views/admin/kegs.html",
        controller: 'app.controller.kegs as kegs',
        requiresAuth: true,
        requiresRole: 'admin',
        parent: 'account.admin'
    });

    $stateProvider.state('account.admin.messages', {
        url: "/messages",
        templateUrl: "/js/views/admin/messages.html",
        controller: 'app.controller.users as users',
        requiresAuth: true,
        requiresRole: 'admin',
        parent: 'account.admin'
    });
});

usersModule.controller('app.controller.users', function($scope, $state, inform, userService, $stateParams) {

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
        $state.go('logout');
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

    users.getProfilePicUrl = function(user) {
        return userService.getProfilePicUrl(user);
    }

    users.loadAllUsers = function() {
        userService.getAllUsers().success(function(response){
            if(response.success) {
                users.users = response.data;
            }
        });
    }

    users.loadUser = function() {
        userService.getUser($stateParams.id).success(function(response){
            if(response.success) {
                users.user = response.data;
            }
        });
    }
});