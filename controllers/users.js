var User = require('../models/user');

module.exports = function(app, passport) {
    var express = require('express');
    var router = express.Router();

    router.get('/logout', function(req, res) {
        req.logout();
        res.apiRes(true,'User successfully logged out', null);
    });

    router.post('/signup', function(req, res) {
        User.findOne({'email' :  req.body.email }, function(err, user) {
            if (err) {
                res.apiRes(false,info,err);
            }

            if (user) {
                return res.apiRes(false,'User with that email address already exists',null);
            } else {
                var newUser = new User();

                newUser.email    = req.body.email;
                newUser.password = newUser.generateHash(req.body.password);
                newUser.scanner_uuid = req.body.scanner_uuid;
                newUser.first_name = req.body.first_name;
                newUser.last_name = req.body.last_name;

                newUser.save(function(err) {
                    if (err) {
                        res.apiRes(false,'Error Saving User',err);
                    } else {
                        //Send Welcome Email
                        app.mailer.send('../views/emails/welcome', {
                            to: newUser.email,
                            subject: 'Welcome to The Office Keg!',
                            user: newUser
                        }, function(err) {
                            console.log(err);
                        });

                        //Log User In
                        req.logIn(newUser, function (err) {
                            if(err) {
                                res.apiRes(false,'Error Logging User In',err);
                            } else {
                                res.apiRes(true,'User successfully added and logged in',newUser);
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
                        res.apiRes(true,'User successfully logged in',user);
                    }
                });
            }
        })(req, res);
    });

    router.get('/current', function(req, res) {
        if(req.user) {
            res.apiRes(true, 'User Logged In', req.user)
        } else {
            res.apiRes(false, 'No user logged in.', req.user)
        }
    });

    router.get('/', passport.checkAuth('guest'), function(req, res) {
        User.findOne({'_id' :  req.query.id }, function(err, user) {
            if(user) {
                res.apiRes(true,'Successfully Retrieved User',user);
            } else {
                res.apiRes(false,'Could Not Find User',user);
            }
        });
    });

    router.get('/all', passport.checkAuth('admin'), function(req, res) {
        User.find(function(err, users) {
            if(users) {
                res.apiRes(true,'Successfully Retrieved Users',users);
            } else {
                res.apiRes(false,'Could Not Find Users',users);
            }
        });
    });

    router.put('/update', passport.checkAuth('guest'), function(req, res) {
        User.findOne({'_id' :  req.query.id }, function(err, user) {
            if(user) {
                user.email = req.body.email;
                user.scanner_uuid = req.body.scanner_uuid;
                user.first_name = req.body.first_name;
                user.last_name = req.body.last_name;

                user.save(function (err) {
                    if (err) {
                        res.apiRes(false, 'Error Saving User', err);
                    } else {
                        res.apiRes(true, 'User Successfully Saved', user);
                    }
                });
            } else {
                res.apiRes(false,'Could Not Find User',user);
            }
        });
    });

    router.delete('/delete', passport.checkAuth('admin'), function(req, res) {
        User.findOne({'_id' :  req.query.id }, function(err, user) {
            if(user) {
                user.remove(function (err) {
                    if (err) {
                        res.apiRes(false, 'Error Deleting User', err);
                    } else {
                        res.apiRes(true, 'User Successfully Deleted', user);
                    }
                });
            } else {
                res.apiRes(false,'Could Not Find User',user);
            }
        });
    });

    return router;
};