var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    uuid: Number,
    name: String,
    fullname: String,
    email: String,
    address: String,
    // requests: Array,
    token: String
});

UserSchema.index({
    name: 1
}, {
    unique: true
});

var User = mongoose.model('User', UserSchema);

module.exports = {
    User: User
};
