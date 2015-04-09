var usersModule = angular.module('app.users',[
    'app.model.user'
]);

usersModule.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/users/account/view");

    $stateProvider.state('login', {
        url: "/users/login",
        templateUrl: "/js/views/login.html",
        controller: 'app.controller.users as users',
        requiresAuth: false,
        requiresRole: false
    });

    $stateProvider.state('signup', {
        url: "/users/signup",
        templateUrl: "/js/views/signup.html",
        controller: 'app.controller.users as users',
        requiresAuth: false,
        requiresRole: false
    });

    $stateProvider.state('reset_password', {
        url: "/users/reset-password",
        templateUrl: "/js/views/password-reset.html",
        controller: 'app.controller.users as users',
        requiresAuth: false,
        requiresRole: false
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

usersModule.controller('app.controller.users', function($scope, $window, $http, $state, inform) {

    var users = this;

    users.login = function(credentials) {
        $http.post('/users/login', credentials).success(function(response){
            if(response.success) {
                $state.go('account.view');
                $scope.$emit('USER_LOGGED_IN', response.data);
            } else {
                inform.add(response.message, {ttl: 5000, type: 'danger'});
            }

        }).error(function(data, status, headers, config) {
            inform.add("Error Logging in", {ttl: 5000, type: 'danger'});
        });;
    }

    users.signup = function(newUser) {
        $http.post('/users/signup', newUser).success(function(response){
            if(response.success) {
                $state.go('account.view');
                $scope.$emit('USER_LOGGED_IN', response.data);
            } else {
                inform.add(response.message, {ttl: 5000, type: 'danger'});
            }

        }).error(function(data, status, headers, config) {
            inform.add("Error Creating Account", {ttl: 5000, type: 'danger'});
        });;
    }

    users.logout = function() {
        $http.get('/users/logout').success(function(response){
            if(response.success) {
                inform.add('Successfully Logged Out.', {ttl: 3000, type: 'success'});
                $state.go('login');
                $scope.$emit('USER_LOGGED_OUT', response.data);
            } else {
                inform.add('Error logging out.', {ttl: 5000, type: 'danger'});
            }
        }).error(function() {
            inform.add('Error logging out.', {ttl: 5000, type: 'danger'});
        });
    }

});