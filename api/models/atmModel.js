/*==================================================================
=            UserSchema : mongo collection name : atmMachine            =
==================================================================*/

let mongoose = require('mongoose');
let moment = require('moment');


let Schema = mongoose.Schema;
let atmSchema = new Schema({
        atmMachineID: {
            type: String,
            unique:true,
            require: true
        },
        atmBalance: {
            type: Number,
            require: true
        },
        atmLocation: {
            lat: Number,
            lng: Number,
        },
        atmNote: {
            type: String,
            require: true
        },
        atmStatus:{
            type:Boolean,
            require:true
        },
        created: Date,
        updated: Date,
        atmUpdatedBy:{
            fullName:String
        },
    }, {
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true
        }
    }

);

atmSchema.pre('save', function(next) {

    let currentDate = moment().utc().toDate();

    // change the updated_at field to current date
    this.updated = currentDate;
    next();
});

let AtmModel = mongoose.model('AtmMachine', atmSchema);
module.exports = AtmModel;