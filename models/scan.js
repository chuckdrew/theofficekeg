var mongoose = require('mongoose');

var scanSchema = mongoose.Schema({
    scanned_uuid : String,
    scanned_date : {type: Date, default: Date.now},
    user_id: String
});

module.exports = mongoose.model('Scan', scanSchema);