var mongoose = require('mongoose');

var activitySchema = mongoose.Schema({
    user_id: String,
    associated_id: String,
    type: String,
    beer_name : String,
    brewery_name: String,
    amount: Number,
    balance: Number,
    created : {type: Date, default: new Date()}
});

module.exports = mongoose.model('Activity', activitySchema);