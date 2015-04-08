var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var scanSchema = mongoose.Schema({
    scanned_uuid : String,
    scanned_date : {type: Date, default: Date.now},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

scanSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Scan', scanSchema);