var mongoose = require('mongoose');

var kegSchema = mongoose.Schema({
    beer_name : String,
    brewery_name: String,
    pint_price: Number,
    is_active: {type: Boolean, default: false},
    created : {type: Date, default: new Date()}
});

module.exports = mongoose.model('Keg', kegSchema);