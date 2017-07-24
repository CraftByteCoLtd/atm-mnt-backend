/*==================================================================
=            UserSchema : mongo collection name : users            =
==================================================================*/

var mongoose = require('mongoose');
var moment = require('moment');

var crypto = require('crypto');

var Schema = mongoose.Schema;
var userSchema = new Schema({
        firstName: {
            type: String,
            require: true
        },
        lastName: {
            type: String,
            require: true
        },
        userName: {
            type: String,
            require: true,
            unique: true
        },
        userPwd: {
            type: String,
            require: true
        },
        userEmails: [{
            desc: String,
            email: String
        }],
        userPhones: [{
            desc: String,
            number: String
        }],
        authRules: {
            isAdmin: Boolean,
            isWareHouseManager: Boolean,
            isDispatcherManager: Boolean,
            isAtmTechnician: Boolean,
            isAtmVaulter: Boolean
        },
        created: Date,
        updated: Date
    }, {
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true
        }
    }

);


userSchema.virtual('url')
    .get(function() {
        return '/manage-user/user-info/' + this._id;
    });

userSchema.virtual('fullName')
    .get(function() {
        return this.firstName + ' ' + this.lastName;
    });


userSchema.methods.hash = function(inputText) {
    return crypto.createHash('sha1').update(inputText).digest('base64');
}

userSchema.pre('save', function(next) {

    var currentDate = moment().utc().toDate();

    // change the updated_at field to current date
    this.updated = currentDate;

    // update the hash password
    this.userPwd = this.hash(this.userPwd);
    next();
});

var UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;