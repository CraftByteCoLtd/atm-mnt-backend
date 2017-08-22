/*==================================================================
=            UserSchema : mongo collection name : dispatchModel            =
==================================================================*/

let mongoose = require('mongoose');
let moment = require('moment');



/*

TODO ::  REVISED THIS AGAIN

*/

let Schema = mongoose.Schema;
let dispatchSchema = new Schema({
        dtID: {
            type: String,
            unique:true,
            require: true
        },
        dtResponsiblePersons: [],
        dtAtms:[]
        dtTechincianTickets: [],
        dtStatus:{
            type:Boolean,
            require:true
        },
        dtWithdrawStatus: {
            type:Boolean,
            require:true
        },
        dtWithdrawBalance: {
            type: Number,
            require: true
        }
        created: Date,
        updated: Date
// TODO cannot continutes because need some depending data from Technician ticker and Partinventory , PartType
// Will ba back


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

    // change the updated_at field to current date
    this.updated = currentDate;
    next();
});

let DispatchTicketModel = mongoose.model('DispatchTicket', dispatchSchema);
module.exports = DispatchTicketModel;