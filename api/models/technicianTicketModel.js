/*==================================================================
=            UserSchema : mongo collection name : technicianTicket            =
==================================================================*/

let mongoose = require('mongoose');
let moment = require('moment');
let Counter = require('../models/counterModel');

let Schema = mongoose.Schema;
let TechnicianTicketSchema = new Schema({

        tTicketID: {
            type: String,
            unique: true
        },
        tTicketCreated: {
            type: Date,
            require: true
        },
        tTicketSymptom: {
            type: String,
            require: true
        },
        tTicketSolution: {
            type: String,
            require: true
        },
        tTicketCreatedBy: {},
        tTicketResponsiblePerson: {},
        tTicketStatus: {
            type: String
        },
        tTicketRepairedParts: [],
        atmMachine:{
            type: String,
            require: true
        },
        updated: {
            type: Date
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


TechnicianTicketSchema.pre('save', function(next) {

    let currentDate = moment().utc().toDate();
    let tTicket = this;

    const PREFIX = "TT";
    const COUNTER_ID = "tTicketID";

    tTicket.updated = currentDate;

    // running new id only the new record. 
    
    if (tTicket.tTicketID === undefined || tTicket.tTicketID === "new") {
        Counter.findByIdAndUpdate({
            _id: COUNTER_ID
        }, {
            $inc: {
                seq: 1
            }
        }, function(error, counter) {
            if (error)
                return next(error);

            tTicket.tTicketID = PREFIX + counter.seq;
            next();
        });
    } else {
        next();
    }

});

let TechnicianTicketModel = mongoose.model('TechnicianTicket', TechnicianTicketSchema);
module.exports = TechnicianTicketModel;