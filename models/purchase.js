var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var purchaseSchema = mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    keg: {type: mongoose.Schema.Types.ObjectId, ref: 'Keg' },
    scan: {type: mongoose.Schema.Types.ObjectId, ref: 'Scan' },
    price: Number,
    created : {type: Date, default: Date.now},
    cancelled: {type: Boolean, default: false},
    cancelled_date: Date,
    locked: {type: Boolean, default: false},
    locked_date: Date
});

purchaseSchema.statics.lockPurchasesForUser = function(userId, callback) {
    this.update({'user' : userId},{'locked' : true},null,callback);
}

purchaseSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Purchase', purchaseSchema);