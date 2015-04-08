var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var kegSchema = mongoose.Schema({
    beer_name : String,
    brewery_name: String,
    pint_price: Number,
    is_active: {type: Boolean, default: false},
    created : {type: Date, default: Date.now}
});

kegSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Keg', kegSchema);