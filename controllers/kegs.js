var Keg = require('../models/keg');
var Purchase = require('../models/purchase');

module.exports = function(app, passport) {
    var express = require('express');
    var router = express.Router();

    router.post('/add', passport.checkAuth('admin'), function (req, res) {
        var newKeg = new Keg();

        newKeg.brewery_name = req.body.brewery_name;
        newKeg.beer_name = req.body.beer_name;
        newKeg.pint_price = req.body.pint_price;
        newKeg.total_price = req.body.total_price;
        newKeg.volume_oz = req.body.volume_oz;

        newKeg.save(function(err) {
            if (err) {
                res.apiRes(false,'Error Saving Keg',err);
            } else {
                res.apiRes(true,'Successfully Saved Keg', newKeg);
            }
        });
    });

    router.put('/update', passport.checkAuth('admin'), function(req, res) {
        Keg.findOne({'_id' :  req.body._id }, function(err, keg) {
            if(keg) {
                keg.brewery_name = req.body.brewery_name;
                keg.beer_name = req.body.beer_name;
                keg.pint_price = req.body.pint_price;
                keg.total_price = req.body.total_price;
                keg.volume_oz = req.body.volume_oz;

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

    router.post('/activate', passport.checkAuth('admin'), function(req, res){
        Keg.update({'is_active' : true},{'is_active' : false},null, function(){
            Keg.update({_id : req.body._id },{'is_active' : true},null, function(err){
                if(err) {
                    res.apiRes(false, 'Error Activating Keg', err);
                } else {
                    res.apiRes(true, 'Successfully Activated Keg', null);
                }
            });
        });
    });

    router.get('/', function (req, res) {
        Keg.findOne({'_id' :  req.query._id }, function(err, keg) {
            if(keg) {
                res.apiRes(true,'Successfully Retrieved Keg',keg);
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

    router.get('/active/stats', function(req, res) {
        Keg.findOne({'is_active' : true}, function(err, keg) {
            Purchase.find({'keg' : keg.id,'cancelled' : true}, function(err, purchases) {
                if(purchases) {
                    var kegStats = {};
                    var collected = 0;
                    purchases.forEach(function(purchase) {
                        collected += purchase.price;
                    });

                    kegStats['total'] = keg.total_price;
                    kegStats['collected'] = collected;
                    kegStats['debt'] = keg.total_price - collected;

                    res.apiRes(true, 'Succesfully generated keg stats', kegStats);
                }
            });
        });
    });

    router.get('/list', function(req, res) {
        Keg.paginate({}, req.query.page, req.query.limit, function(err, pageCount, paginatedResults, itemCount) {
            if (err) {
                res.apiRes(false, 'Error finding kegs.', err);
            } else {
                res.apiRes(true, 'Successfully fetched kegs.', {
                    page: req.query.page,
                    limit: req.query.limit,
                    page_count: pageCount,
                    item_count: itemCount,
                    results: paginatedResults
                });
            }
        }, {sortBy: {created: -1}});
    });

    return router;
}