/*==================================================================
=            UserSchema : mongo collection name : treasuryCsv            =
==================================================================*/

let mongoose = require('mongoose');
let moment = require('moment');



let Schema = mongoose.Schema;
let treasuryCsvSchema = new Schema({
        raw: [],
        sumUp:[],
        created: Date,
        updated: Date,
        originalName:{
            type:String,
            require: true
        },
        fileName: {
            type: String,
            require: true
        },
        filePath: {
            type: String,
            require: true
        },
        status: {
            type: String,
            require: true
        },
        by:{
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

treasuryCsvSchema.pre('save', function(next) {

    let currentDate = moment().utc().toDate();
    this.updated = currentDate;
    next();
});



let TreasuryCsvModel = mongoose.model('TreasuryCsv', treasuryCsvSchema);
module.exports = TreasuryCsvModel;