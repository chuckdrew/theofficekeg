var Keg = require('../models/keg');

module.exports = function(app, passport) {
    var express = require('express');
    var router = express.Router();

    router.post('/add', passport.checkAuth('admin'), function (req, res) {
        var newKeg = new Keg();

        newKeg.brewery_name = req.body.brewery_name;
        newKeg.beer_name = req.body.beer_name;
        newKeg.pint_price = req.body.pint_price;

        newKeg.save(function(err) {
            if (err) {
                res.apiRes(false,'Error Saving Keg',err);
            } else {
                res.apiRes(true,'Successfully Saved Keg', newKeg);
            }
        });
    });

    router.put('/update', passport.checkAuth('admin'), function(req, res) {
        Keg.findOne({'_id' :  req.query.id }, function(err, keg) {
            if(keg) {
                keg.brewery_name = req.body.brewery_name;
                keg.beer_name = req.body.beer_name;
                keg.pint_price = req.body.pint_price;

                keg.save(function (err) {
                    if (err) {
                        res.apiRes(false, 'Error Saving keg', err);
                    } else {
                        res.apiRes(true, 'Successfully Saved Keg', keg);
                    }
                });
            } else {
                res.apiRes(false,'Could Not Find Keg',keg);
            }
        });
    });

    router.get('/active', function (req, res) {
        Keg.findOne({'is_active' :  true }, function(err, keg) {
            if(keg) {
                res.apiRes(true,'Successfully Retrieved Active Keg',keg);
            } else {
                res.apiRes(false,'Could Not Find Active Keg',keg);
            }
        });
    });

    return router;
}