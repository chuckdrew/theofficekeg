var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var paymentSchema = mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: Number,
    method: String,
    created : {type: Date, default: Date.now}
});

paymentSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Payment', paymentSchema);
