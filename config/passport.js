var LocalStrategy   = require('passport-local').Strategy;
var BasicStrategy   = require('passport-http').BasicStrategy;
var User            = require('../models/user');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true
        }, function(req, email, password, done) {

            process.nextTick(function() {

                User.findOne({'local.email' :  email }, function(err, user) {
                    if (err) {
                        return done(err);
                    }

                    if (user) {
                        return done(null, false, 'User with that email address already exists');
                    } else {
                        var newUser = new User();

                        newUser.local.email    = email;
                        newUser.local.password = newUser.generateHash(password);

                        newUser.save(function(err) {
                            if (err) {
                                throw err;
                            } else {
                                return done(null, newUser);
                            }
                        });
                    }
                });
            });
        })
    );

    passport.use('local-login', new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true
        }, function(req, email, password, done) {
            User.findOne({ 'local.email' :  email }, function(err, user) {
                if (err) {
                    return done(err);
                } else {
                    if(!user) {
                        return done(null, false, 'Username or Password Incorrect');
                    } else {
                        if(!user.validPassword(password)) {
                            return done(null, false, 'Username or Password Incorrect');
                        } else {
                            return done(null, user);
                        }
                    }
                }
            });
        })
    );

    passport.use('basic', new BasicStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true
        }, function(req, email, password, done) {
            User.findOne({ 'local.email' :  email }, function(err, user) {
                if (err) {
                    return done(err);
                } else {
                    if(!user) {
                        return done(null, false, 'Username or Password Incorrect');
                    } else {
                        if(!user.validPassword(password)) {
                            return done(null, false, 'Username or Password Incorrect');
                        } else {
                            return done(null, user);
                        }
                    }
                }
            });
        })
    );
};
