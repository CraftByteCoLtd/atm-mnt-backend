/*==================================================================
=            UserSchema : mongo collection name : treasury            =
==================================================================*/

let mongoose = require('mongoose');
let moment = require('moment');



let Schema = mongoose.Schema;
let treasurySchema = new Schema({
        treasuryNote: {
            type: String,
        },
        treasuryBalance: {
            type: Number,
            require: true
        },
        created: Date,
        updated: Date,
    }, {
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true
        }
    }

);

treasurySchema.pre('save', function(next) {
    let currentDate = moment().utc().toDate();
    this.updated = currentDate;
    next();
});



let TreasuryModel = mongoose.model('Treasury', treasurySchema);
module.exports = TreasuryModel;