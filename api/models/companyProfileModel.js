/*==================================================================
=            CompanyProfileSchema : mongo collection name : company-profile            =
==================================================================*/

let mongoose = require('mongoose');
let moment = require('moment');

let Schema = mongoose.Schema;
let companyProfileSchema = new Schema({
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
        companyEmail: {
            type: String,
            require: true
        },
        companyPhone: {
            type: String,
            require: true
        },
        companyLogo: {
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


companyProfileSchema.pre('save', function(next) {

    let currentDate = moment().utc().toDate();

    // change the updated_at field to current date
    this.updated = currentDate;
    next();
});

let companyProfileModel = mongoose.model('CompanyProfile', companyProfileSchema);
module.exports = companyProfileModel;