var User = require('../models/user');
var JWT = require('jsonwebtoken');

module.exports = function(app, passport) {
    var express = require('express');
    var router = express.Router();

    router.get('/logout', function(req, res) {
        req.session.destroy(function (err) {
            res.apiRes(true,'User successfully logged out', null);
        });
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
                        app.sendMail({
                            template: 'welcome',
                            to: newUser.email,
                            subject: 'Welcome to The Office Keg!',
                            user: newUser
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
        User.findOne({'_id' :  req.body._id }, function(err, user) {
            if(user) {
                user.email = req.body.email;
                user.first_name = req.body.first_name;
                user.last_name = req.body.last_name;
                user.scanner_uuid = req.body.scanner_uuid;

                if(req.body.new_password) {
                    user.password = user.generateHash(req.body.new_password);
                }

                user.save(function (err) {
                    if (err) {
                        res.apiRes(false, 'Error Saving User', err);
                    } else {
                        res.apiRes(true, 'Account successfully saved', user);
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

    router.get('/list', passport.checkAuth('admin'), function(req, res) {
        User.paginate({}, req.query.page, req.query.limit, function(err, pageCount, paginatedResults, itemCount) {
            if (err) {
                res.apiRes(false, 'Error finding users.', err);
            } else {
                res.apiRes(true, 'Successfully fetched users.', {
                    page: req.query.page,
                    limit: req.query.limit,
                    page_count: pageCount,
                    item_count: itemCount,
                    results: paginatedResults
                });
            }
        }, {sortBy: {last_name: 'descending'}});
    });

    router.post('/send-password-reset-email', function(req, res) {
        User.findOne({'email' :  req.body.email }, function(err, user) {
            if(user) {

                var token = JWT.sign({user: user._id}, process.env.JWT_SECRET, {expiresInSeconds:7200});

                app.sendMail({
                    template: 'password',
                    to: user.email,
                    subject: 'Reset Your Password!',
                    base_url: process.env.BASE_URL,
                    user: user,
                    token: token
                });

                res.apiRes(true, 'A password reset link has been emailed to you.', user);
            } else {
                res.apiRes(false,'Could not find user with that email.',user);
            }
        });
    });

    router.get('/password-reset-login', function(req, res) {
        JWT.verify(req.query.token, process.env.JWT_SECRET, function(err, decodedUser) {
            if (!err && decodedUser) {
                User.findById(decodedUser.user, function (err, user) {
                    if(user) {
                        req.logIn(user, function(err, info) {
                            if(err) {
                                res.apiRes(false,info,err);
                            } else {
                                if (req.query.redirect == "true") {
                                    res.redirect('/#/users/password-reset-login');
                                } else {
                                    res.apiRes(true, 'Successfully Logged In. Please Change your password.', user);
                                }
                            }
                        });
                    } else {
                        res.apiRes(false,"Error finding user account.",err);
                    }
                });
            } else {
                if (req.query.redirect == "true") {
                    if(req.user) {
                        res.redirect('/#/users/account/edit');
                    } else {
                        res.redirect('/#/users/invalid-password-reset-token');
                    }
                } else {
                    res.apiRes(false,'Invalid Password Reset Token',err);
                }
            }
        });
    });

    router.post('/notify-all-users', passport.checkAuth('admin'), function(req, res) {
        User.find({status:"active"}, function(err, users) {
            users.forEach(function(user) {
                app.sendMail({
                    template: 'notify',
                    to: user.email,
                    from: "The Office Keg <" + req.user.email + ">",
                    subject: req.body.subject,
                    base_url: process.env.BASE_URL,
                    user: user,
                    message: req.body.message
                });
            });

            res.apiRes(true,'Successfully emailed all active users.',null);
        });
    });

    router.get('/log-headers', function(req, res) {
        console.log(req.headers);
        res.apiRes(true,'Logged Headers to Console.',null);
    });

    return router;
};