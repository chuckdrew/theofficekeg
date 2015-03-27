var User = require('../models/user');

module.exports = function(app, passport) {
    var express = require('express');
    var router = express.Router();

    router.get('/logout', function(req, res) {
        req.logout();
        res.apiRes(true,'User successfully logged out', null);
    });

    router.get('/test', passport.checkAuth(), function(req, res) {
        res.json(req.user);
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
                newUser.scanner_uuid = req.body.scanner_uuid;
                newUser.first_name = req.body.first_name;
                newUser.last_name = req.body.last_name;

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

    router.get('/', passport.checkAuth(), function(req, res) {
        User.findOne({'_id' :  req.query.id }, function(err, user) {
            res.apiRes(true,'Successfully Retrieved User',user);
        });
    });

    router.post('/update', passport.checkAuth(), function(req, res) {
        User.findOne({'_id' :  req.query.id }, function(err, user) {
            user.local.email    = req.body.email;
            user.scanner_uuid = req.body.scanner_uuid;
            user.first_name = req.body.first_name;
            user.last_name = req.body.last_name;
            user.is_admin = req.body.is_admin;

            user.save(function(err) {
                if (err) {
                    res.apiRes(false,'Error Saving User',err);
                } else {
                    res.apiRes(true,'User Successfully Saved',user);
                }
            });
        });
    });

    return router;
};