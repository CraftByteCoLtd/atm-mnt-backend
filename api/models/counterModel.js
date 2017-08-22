/*==================================================================
=            UserSchema : mongo collection name : counterModel            =
==================================================================*/

let mongoose = require('mongoose');
let moment = require('moment');
let Schema = mongoose.Schema;

let CounterSchema = new Schema({

	_id: { type: String, required: true},
    seq: { type: Number, default: 0 }
    }
);

let CounterModel = mongoose.model('counter', CounterSchema);
module.exports = CounterModel;