var mongoose = require('mongoose');

var paymentSchema = mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: Number,
    created : {type: Date, default: Date.now}
});

module.exports = mongoose.model('Payment', paymentSchema);
