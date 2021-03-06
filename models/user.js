var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var mongoosePaginate = require('mongoose-paginate');

var userSchema = mongoose.Schema({
    email : String,
    password : String,
    scanner_uuid : {type: String, default: ""},
    first_name : String,
    last_name : String,
    balance: {type: Number, default: 0},
    roles: {type: Array, default: new Array('guest')},
    status:  {type: String, default: "active"},
    created : {type: Date, default: Date.now}
});

userSchema.methods.hasRole = function(role) {
    if(this.roles.indexOf(role) != -1) {
        return true;
    } else {
        return false;
    }
};

userSchema.methods.increaseBalance = function(paymentAmount) {
    this.balance = this.balance + paymentAmount;
};

userSchema.methods.decreaseBalance = function(purchaseAmount) {
    this.balance = this.balance - purchaseAmount;
};

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.statics.findWithNegativeBalance = function(callback) {
    this.where('balance').lt(0).exec(callback);
};

userSchema.statics.getUsersWithRole = function(role) {
    return this.find({'roles': role }).exec();
};

userSchema.statics.getTotalOutstandingBalance = function() {
    return this.aggregate([
        {
            $project: {
                outstandingBalance: {$cond: [{$lt: ['$balance', 0]}, '$balance', 0]},
                totalLiabilities: {$cond: [{$gt: ['$balance', 0]}, '$balance', 0]},
                balance: 1
            }
        },
        {
            $group: {
                _id: null,
                totalOutstandingBalance: {$sum: '$outstandingBalance'},
                totalLiabilities: {$sum: '$totalLiabilities'},
                totalBalance: {$sum: '$balance'},
                userCount: {$sum: 1}
            }
        }
    ]).exec();
};

userSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('User', userSchema);