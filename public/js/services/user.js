var userModel = angular.module('app.model.user',[]);

userModel.factory('User', function($resource) {
    return $resource('/users/',{},{
        update: {method: 'PUT'}
    });
});