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
    status:  {type: String, default: "active"}
});

userSchema.methods.hasRole = function(role) {
    if(this.roles.indexOf(role) != -1) {
        return true;
    } else {
        return false;
    }
}

userSchema.methods.increaseBalance = function(paymentAmount) {
    this.balance = this.balance + paymentAmount;
}

userSchema.methods.decreaseBalance = function(purchaseAmount) {
    this.balance = this.balance - purchaseAmount;
}

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.statics.findWithNegativeBalance = function(callback) {
    this.where('balance').lt(0).exec(callback);
};

userSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('User', userSchema);