var mongoose = require('mongoose');

var purchaseSchema = mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    keg: {type: mongoose.Schema.Types.ObjectId, ref: 'Keg' },
    scan: {type: mongoose.Schema.Types.ObjectId, ref: 'Scan' },
    price: Number,
    created : {type: Date, default: new Date()},
    cancelled: {type: Boolean, default: false},
    cancelled_date: Date
});

module.exports = mongoose.model('Purchase', purchaseSchema);