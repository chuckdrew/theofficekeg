var usersModule = angular.module('app.users',[
    'app.model.user'
]);

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