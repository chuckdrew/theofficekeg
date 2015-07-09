var userServiceModule = angular.module('app.service.user',[]);

userServiceModule.service('userService', function(inform, $http, $interval) {

    var userService = this;
    userService.currentUser = null;
    userService.currentUserPollingPromise = null;


    userService.login = function(credentials) {
        return $http.post('/users/login', credentials).success(function(response) {
            if(response.success) {
                userService.setCurrentUser(response.data);
            } else {
                inform.add(response.message, {ttl: 5000, type: 'danger'});
            }
        }).error(function() {
            inform.add("Error Logging in", {ttl: 5000, type: 'danger'});
        });
    }

    userService.signup = function(newUser) {
        return $http.post('/users/signup', newUser).success(function(response) {
            if(response.success) {
                userService.setCurrentUser(response.data);
            } else {
                inform.add(response.message, {ttl: 5000, type: 'danger'});
            }
        }).error(function(data, status, headers, config) {
            inform.add("Error Creating Account", {ttl: 5000, type: 'danger'});
        });
    }

    userService.logout = function() {
        userService.setCurrentUser(null);
        return $http.get('/users/logout').success(function(response) {
            if(response.success) {
                inform.add('Successfully Logged Out.', {ttl: 3000, type: 'success'});
            } else {
                inform.add(response.message, {ttl: 5000, type: 'danger'});
            }
        }).error(function() {
            inform.add('Error logging out.', {ttl: 5000, type: 'danger'});
        });
    }

    userService.sendPasswordResetEmail = function(email) {
        return $http.post('/users/send-password-reset-email', {email:email}).success(function(response) {
            inform.add(response.message, {ttl: 5000, type: 'danger'});
        }).error(function(response) {
            inform.add(response.message, {ttl: 5000, type: 'danger'});
        });
    }

    userService.loadCurrentUser = function() {
        return $http.get('/users/current').success(function(response){
            if(response.success) {
                userService.setCurrentUser(response.data);
            } else {
                userService.setCurrentUser(null);
            }
        }).error(function() {
            userService.setCurrentUser(null);
        });
    }

    userService.getAllUsers = function() {
        return $http.get('/users/all').success(function(response){
            if(!response.success) {
                inform.add(response.message, {ttl: 5000, type: 'danger'});
            }
        }).error(function(response) {
            inform.add(response.message, {ttl: 5000, type: 'danger'});
        });
    }

    userService.getUser = function(id) {
        return $http.get('/users',{params:{id:id}}).success(function(response){
            if(!response.success) {
                inform.add(response.message, {ttl: 5000, type: 'danger'});
            }
        }).error(function(response) {
            inform.add(response.message, {ttl: 5000, type: 'danger'});
        });
    }

    userService.initUserPolling = function() {
        if(userService.currentUserPollingPromise == null) {
            userService.currentUserPollingPromise = $interval(function(){
                userService.loadCurrentUser();
            }, 5000, null, true);
        }
    }

    userService.stopUserPolling = function() {
        if(userService.currentUserPollingPromise) {
            $interval.cancel(userService.currentUserPollingPromise);
            userService.currentUserPollingPromise = null;
        }
    }

    userService.getCurrentUser = function() {
        return userService.currentUser;
    }

    userService.setCurrentUser = function(currentUser) {
        if(currentUser) {
            userService.currentUser = currentUser;
            userService.initUserPolling();
        } else {
            userService.currentUser = null
            userService.stopUserPolling();
        }
    }

    userService.update = function(user) {
        return $http.put('/users/update', user).success(function(response) {
            if(response.success) {
                userService.setCurrentUser(response.data);
                inform.add(response.message, {ttl: 3000, type: 'success'});
            } else {
                inform.add(response.message, {ttl: 5000, type: 'danger'});
            }
        }).error(function(data, status, headers, config) {
            inform.add("Error updating your account", {ttl: 5000, type: 'danger'});
        });
    }

    userService.hasRole = function(role) {
        if(userService.getCurrentUser()) {
            if(userService.getCurrentUser().roles.indexOf(role) > -1) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    userService.getProfilePicUrl = function(user) {
        var emailMd5 = md5(user.email);
        return "https://www.gravatar.com/avatar/" + emailMd5 + ".jpg?s=200&r=x&d=identicon";
    }

});