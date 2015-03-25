module.exports = function(app, passport) {
    var express = require('express');
    var router = express.Router();

    router.get('/test', passport.checkAuth(), function(req, res) {
        res.json(req.user);
    });

    router.get('/logout', function(req, res) {
        req.logout();
        res.apiRes(true,'User successfully logged out', null);
    });

    router.post('/signup', function(req, res) {
        passport.authenticate('local-signup', function(err, user, info) {
            if(err) {
                res.apiRes(false,info,err);
            } else if(user == false) {
                res.apiRes(false,info,null);
            } else {
                req.logIn(user, function (err) {
                    if(err) {
                        res.apiRes(false,info,err);
                    } else {
                        res.apiRes(true,'User successfully added and logged in',{user_id: user._id});
                    }
                });

            }
        })(req, res);
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