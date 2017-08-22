/*==================================================================
=            UserSchema : mongo collection name : partModel            =
==================================================================*/

let mongoose = require('mongoose');
let moment = require('moment');
let Counter = require('../models/counterModel');

let Schema = mongoose.Schema;
let partSchema = new Schema({
        partID: {
            type: String,
            unique: true,
            require: true
        },
        partDetail: {
            type: String,
            require: true
        },
        partType: {
            type: String,
            require: true
        },
        partStock: {
            type: Number,
            require: true
        },
        partPrice: {
            type: Number,
            require: true
        },
        partSerialNumber: {
            type: String,
            require: true
        },
        atmMachineID: {
            type: String,
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

partSchema.pre('save', function(next) {
    const PREFIX = "PRT";
    const COUNTER_ID = "partID";

    let currentDate = moment().utc().toDate();
    let newPart = this;
    newPart.updated = currentDate;

    // running new id only the new record. 
    
    if (newPart.partID === undefined || newPart.partID === "new") {
        Counter.findByIdAndUpdate({
            _id: COUNTER_ID
        }, {
            $inc: {
                seq: 1
            }
        }, function(error, counter) {
            if (error)
                return next(error);
            newPart.partID = PREFIX + counter.seq;
            next();
        });
    } else {
        next();
    }
});

let PartModel = mongoose.model('Part', partSchema);
module.exports = PartModel;