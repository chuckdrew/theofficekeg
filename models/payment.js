var mongoose = require('mongoose');

var paymentSchema = mongoose.Schema({
    user_id: String,
    amount: Number,
    created : {type: Date, default: new Date()}
});

module.exports = mongoose.model('Cancelation', cancelationSchema);
