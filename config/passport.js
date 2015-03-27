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

    passport.use('local-login', new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true
        }, function(req, email, password, done) {
            User.findOne({ 'email' :  email }, function(err, user) {
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
            User.findOne({ 'email' :  email }, function(err, user) {
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
