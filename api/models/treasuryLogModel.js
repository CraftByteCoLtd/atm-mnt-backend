/*==================================================================
=            UserSchema : mongo collection name : TreasuryLog            =
==================================================================*/

let mongoose = require('mongoose');
let moment = require('moment');



let Schema = mongoose.Schema;
let treasuryLogSchema = new Schema({
        oldBalance: {
            type: String,
        },
        newBalance: {
            type: Number,
            require: true
        },
        created: Date,
        updated: Date,
        logType: {
            type: String,
            require: true
        },
        updatedBy: {
            type: String,
            require: true
        }
    }, {
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true
        }
    }

);

treasuryLogSchema.pre('save', function(next) {

    let currentDate = moment().utc().toDate();
    this.updated = currentDate;
    next();
});



let TreasuryLogModel = mongoose.model('TreasuryLog', treasuryLogSchema);
module.exports = TreasuryLogModel;