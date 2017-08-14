/*==================================================================
=            UserSchema : mongo collection name : users            =
==================================================================*/

let mongoose = require('mongoose');
let moment = require('moment');

let crypto = require('crypto');

let Schema = mongoose.Schema;
let userSchema = new Schema({
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
        isActive:{
            type:Boolean,
            require:true
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

    let currentDate = moment().utc().toDate();

    // change the updated_at field to current date
    this.updated = currentDate;

    // update the hash password
    this.userPwd = this.hash(this.userPwd);
    next();
});

let UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;