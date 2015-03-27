var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    email : String,
    password : String,
    scanner_uuid : String,
    first_name : String,
    last_name : String,
    balance: Number,
    roles: {type: Array, default: new Array('guest')}
});

userSchema.methods.hasRole = function(role) {
    if(this.roles.indexOf(role) != -1) {
        return true;
    } else {
        return false
    }
}

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);