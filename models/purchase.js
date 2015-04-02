var mongoose = require('mongoose');

var purchaseSchema = mongoose.Schema({
    user_id: String,
    keg_id: String,
    created : {type: Date, default: new Date()}
});

module.exports = mongoose.model('Purchase', purchaseSchema);