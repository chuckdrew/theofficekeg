var mongoose = require('mongoose');

var tokenSchema = mongoose.Schema({
    created_date : {type: Date, default: Date.now},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    used: {type: Boolean, default: false}
});

module.exports = mongoose.model('Token', tokenSchema);