var User = require('../models/user');

module.exports = function(app, passport) {
    var express = require('express');
    var router = express.Router();

    router.get('/logout', function(req, res) {
        req.logout();
        res.apiRes(true,'User successfully logged out', null);
    });

    router.post('/signup', function(req, res) {
        User.findOne({'local.email' :  req.body.email }, function(err, user) {
            if (err) {
                res.apiRes(false,info,err);
            }

            if (user) {
                return res.apiRes(false,'User with that email address already exists',null);
            } else {
                var newUser = new User();

                newUser.local.email    = req.body.email;
                newUser.local.password = newUser.generateHash(req.body.password);

                newUser.save(function(err) {
                    if (err) {
                        res.apiRes(false,'Error Saving User',err);
                    } else {
                        req.logIn(newUser, function (err) {
                            if(err) {
                                res.apiRes(false,'Error Logging User In',err);
                            } else {
                                res.apiRes(true,'User successfully added and logged in',{user_id: newUser._id});
                            }
                        });
                    }
                });
            }
        });
    });

    router.post('/login', function(req, res) {
        passport.authenticate('local-login', function(err, user, info) {
            if(err) {
                res.apiRes(false,info,err);
            } else if(user == false) {
                res.apiRes(false,info,null);
            } else {
                req.logIn(user, function(err) {
                    if(err) {
                        res.apiRes(false,info,err);
                    } else {
                        res.apiRes(true,'User successfully logged in',{user_id: user._id});
                    }
                });
            }
        })(req, res);
    });

    return router;
};