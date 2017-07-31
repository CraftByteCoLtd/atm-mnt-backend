/*==================================================================
=            CompanyProfileSchema : mongo collection name : company-profile            =
==================================================================*/

var mongoose = require('mongoose');
var moment = require('moment');


var crypto = require('crypto');

var Schema = mongoose.Schema;
var companyProfileSchema = new Schema({
        companyId: {
            type: String,
            require: true,
            unique: true

        },
        companyName: {
            type: String,
            require: true
        },
        companyDetail: {
            type: String,
            require: true,
        },
        companyOwner: {
            type: String,
            require: true
        },
        companyEmails: [{
            desc: String,
            email: String
        }],
        companyPhones: [{
            desc: String,
            number: String
        }],
        companyLogo: {
            type: String,
            require: true
        },
        companyAdminUsername: {
            type: String,
            require: true,
            unique: true

        },
        companyAdminPwd: {
            type: String,
            require: true
        },
        companyIsActive: {
            type: Boolean,
            require: true
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


companyProfileSchema.virtual('url')
    .get(function() {
        return '/manage-company/company/' + this._id;
    });

companyProfileSchema.methods.hash = function(inputText) {
    return crypto.createHash('sha1').update(inputText).digest('base64');
}

companyProfileSchema.pre('save', function(next) {

    var currentDate = moment().utc().toDate();

    // change the updated_at field to current date
    this.updated = currentDate;

    // update the hash password
    this.companyAdminPwd = this.hash(this.companyAdminPwd);
    next();
});

var companyProfileModel = mongoose.model('CompanyProfile', companyProfileSchema);
module.exports = companyProfileModel;