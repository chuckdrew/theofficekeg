var mongoose = require('mongoose');

var purchaseSchema = mongoose.Schema({
    user_id: String,
    keg_id: String,
    price: Number,
    created : {type: Date, default: new Date()},
    cancelled: {type: Boolean, default: false},
    cancelled_date: Date
});

module.exports = mongoose.model('Purchase', purchaseSchema);