/*==================================================================
=            UserSchema : mongo collection name : dispatchModel            =
==================================================================*/

let mongoose = require('mongoose');
let moment = require('moment');
let Counter = require('../models/counterModel');



let Schema = mongoose.Schema;
let dispatchSchema = new Schema({
        dtID: {
            type: String,
            unique:true,
            require: true
        },
        dtResponsiblePersons: [],
        dtAtms:[],
        dtTechnicianTickets: [],
        dtStatus:{
            type: String,
            require:true
        },
        dtWithdrawBalance: {
            type: Number,
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


dispatchSchema.virtual('url')
    .get(function() {
        return '/manage-dispatch/dispatch-info/' + this._id;
    });


dispatchSchema.pre('save', function(next) {

    let currentDate = moment().utc().toDate();
    let dTicket = this;


    const PREFIX = "DT";
    const COUNTER_ID = "dtID";

    dTicket.updated = currentDate;

    // running new id only the new record. 
    
    if (dTicket.dtID === undefined || dTicket.dtID === null || dTicket.dtID === "new") {
        Counter.findByIdAndUpdate({
            _id: COUNTER_ID
        }, {
            $inc: {
                seq: 1
            }
        }, function(error, counter) {
            if (error)
                return next(error);

            dTicket.dtID = PREFIX + counter.seq;
            next();
        });
    } else {
        next();
    }
});

let DispatchTicketModel = mongoose.model('DispatchTicket', dispatchSchema);
module.exports = DispatchTicketModel;