let moment = require('moment');
let async = require('async');
let _ = require('lodash');

let Tt = require('../models/technicianTicketModel');
let User = require('../models/userModel');
let Part = require('../models/partModel');
let Atm = require('../models/atmModel');
let Dispatch = require('../models/dispatchModel');
let Treasury = require('../models/treasuryModel');
let TreasuryLog = require('../models/treasuryLogModel');


let currentUTC = moment().utc().toDate();


exports.dtCreatePost = function(req, res) {

    let newDp = Dispatch({
        dtID: "new",
        dtResponsiblePersons: req.body.dtResponsiblePersons,
        dtAtms: req.body.dtAtms,
        dtTechnicianTickets: req.body.dtTechnicianTickets,
        dtManualTasks:req.body.dtManualTasks,
        dtStatus: req.body.dtStatus,
        dtWithdrawBalance: req.body.dtWithdrawBalance,
        dtAssignmentDate: moment(req.body.dtAssignmentDate),
        created: currentUTC,
        updated: currentUTC
    });

    newDp.save(function(error) {

        if (error)
            if (error.code == 11000) {
                res.json({
                    message: 'The Dispatch ID is duplicated, please try to submit again.',
                    success: false
                })
            } else {
                res.json(error);
            }
        else {
            res.json({
                message: 'Save new Dispatch Ticket',
                success: true
            });
        }
    });
};


exports.dtUpdatePost = function(req, res) {
    console.log(moment(req.body.dtAssignmentDate));


    Dispatch.findById(req.body.id, function(error, dpPrevInfo) {

        if (error) throw error;
        dpPrevInfo.dtID = req.body.dtID;
        dpPrevInfo.dtResponsiblePersons = req.body.dtResponsiblePersons;
        dpPrevInfo.dtAtms = req.body.dtAtms;
        dpPrevInfo.dtTechnicianTickets = req.body.dtTechnicianTickets;
        dpPrevInfo.dtManualTasks = req.body.dtManualTasks;
        dpPrevInfo.dtStatus = req.body.dtStatus;
        dpPrevInfo.dtWithdrawBalance = req.body.dtWithdrawBalance;
        dpPrevInfo.dtAssignmentDate = moment(req.body.dtAssignmentDate);
        created = req.body.created;
        updated = currentUTC;

        dpPrevInfo.save(function(error) {
            if (error) throw error;

            res.json({
                message: 'Update Dispatch Ticket succesfully',
                success: true
            });
        })

    });
};


exports.dtUpdateStatusCompletedPost = function(req, res) {
    let updatedKey = {
        "_id": req.body._id,
        "dtStatus": 'recieved'
    }

    let updatedValue = {
       "dtStatus": 'completed'
    }

    Dispatch.update(updatedKey, updatedValue, function(err) {
        if (err) {
            throw err
        }
        res.json({
            message: 'Mark as Completed Dispatch Ticket succesfully',
                success: true
        });

    });
};


exports.dtUpdateBalancePost = function(req, res) {

    let pramAtm = req.body.updateAtm;
    let updatedKey = {
        "_id": req.body._id,
        "dtAtms.atm._id": pramAtm.atm._id,
        "dtAtms.atm.atmMachineID": pramAtm.atm.atmMachineID
    }

    let updatedValue = {
        "$set": {
            "dtAtms.$.deposit": req.body.deposit,
            "dtAtms.$.badBill": req.body.badBill,
            "dtAtms.$.dtAtmStatus": 'closed',
            "dtAtms.$.atm.atmBalance": req.body.Total,
            "dtAtms.$.actualRemaining": req.body.actualRemaining
        }
    }

    Dispatch.update(updatedKey, updatedValue, function(err) {
        if (err) {
            throw err
        }

        let _idAtm = {
            "_id": pramAtm.atm._id,
            "atmMachineID": pramAtm.atm.atmMachineID
        }

        let _valBalance = {
            "atmBalance": req.body.Total,
            "updated":currentUTC,
            "atmUpdatedBy.fullName":req.body.updatedBy
        }

        Atm.update(_idAtm, _valBalance, function(atmErr) {
            if (atmErr) {
                throw atmErr
            }
            res.json({
                message: 'Update Dispatch Ticket succesfully',
                success: true
            });
        })


    })
};




exports.dtUpdateRecievedStatus = function(req, res) {
    Dispatch.findById(req.body.id, function(error, dpPrevInfo) {
        if (error) throw error;
        dpPrevInfo.dtStatus = req.body.dtStatus;
        updated = currentUTC;
        dpPrevInfo.save(function(error) {
            if (error) throw error;

            res.json({
                message: 'Update Dispatch Ticket Status succesfully',
                success: true
            });
        })

    });
}



// Get ATM list by Limit Balance
exports.atmListByBalanceGet = function(req, res) {
    let filterBalance = 0;
    filterBalance = parseInt(req.query.b) || 0;
    Atm.find({})
        .where('atmBalance').lte(filterBalance)
        .sort('-atmBalance')
        .select('atmMachineID id atmBalance atmStatus atmLocation updated')
        .exec(function(error, result) {
            if (error)
                res.send(error);
            else
                res.status(200);
            res.send({
                data: result
            });
        });
};


// Get ATM list by Limit Balance and not include Atm in open dispatch ticket
exports.atmListByBalanceNotinDispatchGet = function(req, res) {
    let filterBalance = 0;
    filterBalance = parseInt(req.query.b) || 0;

    let excludeEditID = req.query.eid;

    let atmsInDispatchProcess = [];
    async.waterfall([

        checkIsAtmExistInDispatch = function(callback) {
            let Dp = Dispatch.find({});
            if (excludeEditID) {
                Dp.where('_id').ne(excludeEditID)
            }

            Dp.where('dtStatus').equals('open')
            Dp.select('dtAtms')
            Dp.exec(function(error, atms) {
                atmsInDispatchProcess = _.map(atms, (o) => {
                    return _.map(o.dtAtms, (i) => {
                        return i.atm.atmMachineID
                    });
                })
                atmsInDispatchProcess = _.flattenDeep(atmsInDispatchProcess);
                callback();
            });
        },
        findAtmOnlyIdNotInDispatch = function(callback) {
            Atm.find({})
                .where('atmBalance').lte(filterBalance)
                .where('atmMachineID').nin(atmsInDispatchProcess)
                .sort('-atmBalance')
                .select('atmMachineID id atmBalance atmStatus atmLocation updated')
                .exec(callback);

        }

    ], function(error, result) {
        if (error)
            res.send(error);
        else
            res.status(200);
        res.send({
            data: result
        });
    });
};



// Get All Vaulter name list
exports.dtGetVaulterList = function(req, res) {
    User.find({})
        .select('firstName lastName userName userPhones userEmails')
        .where('authRules.isAtmVaulter').equals(true)
        .where('isActive').equals(true)
        .sort('fullName')
        .exec(function(error, result) {
            if (error)
                res.send(error);
            else
                res.status(200);
            res.send({
                data: result
            });
        });
};

exports.dtDetailGet = function(req, res) {
    let uniqId = req.params.id;
    if (!uniqId) {
        res.json({
            message: 'No parameters provided!',
            success: false
        });
    } else {

        Dispatch.findById(uniqId)
            .exec(function(error, dt) {
                if (error)
                    res.send(error);
                else
                    res.status(200);
                res.send({
                    dt
                });

            });
    }
};


exports.dtListGet = function(req, res) {
    Dispatch.find({})
        // .select('dtID updated dtStatus')
        .sort('-updated')
        .where('dtStatus').equals('closed')
        .limit(100)
        .exec(function(error, result) {
            if (error)
                res.send(error);
            else
                res.status(200);
            res.send({
                data: result
            });
        });
};


exports.dtActiveListGet = function(req, res) {
    Dispatch.find({})
        .where('dtStatus').ne('closed')
        .sort('-updated')
        .exec(function(error, result) {
            if (error)
                res.send(error);
            else
                res.status(200);
            res.send({
                data: result
            });
        });
};


exports.dtDoWithdrawPost = function(req, res) {

    Dispatch.findById(req.body.id, function(error, dpPrevInfo) {

        if (error) throw error;

        dpPrevInfo.dtStatus = req.body.dtStatus;
        dpPrevInfo.dtWithdrawBalance = req.body.dtWithdrawBalance;
        updated = currentUTC;

        dpPrevInfo.save(function(error) {

            if (error) throw error;


            Treasury.findOne({}, function(error, tsrInfo) {

                if (error) throw error;

                let prevBalance = 0;
                prevBalance = tsrInfo.treasuryBalance;

                let changedBalance = tsrInfo.treasuryBalance - req.body.dtWithdrawBalance;

                let trsLog = TreasuryLog({
                    oldBalance: tsrInfo.treasuryBalance,
                    newBalance: changedBalance,
                    updatedBy: req.body.updatedBy,
                    logType: req.body.logType
                });

                trsLog.save(function(error) {
                    if (!error) console.log('Saved treasury log');
                })

                tsrInfo.treasuryBalance = changedBalance;
                created = req.body.created;
                updated = currentUTC;
                tsrInfo.save(function(error) {
                    if (!error) {
                        res.json({
                            message: 'Dispatch Ticket status change to withdraw succesfully',
                            success: true,
                        });
                    }
                });

            });

        });
    });

};

exports.dtDoClosedPost = function(req, res) {

    Dispatch.findById(req.body.id, function(error, dpPrevInfo) {

        if (error) throw error;

        dpPrevInfo.dtStatus = req.body.dtStatus;
        dpPrevInfo.dtReturnBalance = req.body.dtReturnBalance;
        updated = currentUTC;

        dpPrevInfo.save(function(error) {

            if (error) throw error;


            Treasury.findOne({}, function(error, tsrInfo) {

                if (error) throw error;

                let prevBalance = 0;
                prevBalance = tsrInfo.treasuryBalance;

                let changedBalance = tsrInfo.treasuryBalance + req.body.dtReturnBalance;

                let trsLog = TreasuryLog({
                    oldBalance: tsrInfo.treasuryBalance,
                    newBalance: changedBalance,
                    updatedBy: req.body.updatedBy,
                    logType: req.body.logType
                });

                trsLog.save(function(error) {
                    if (!error) console.log('Saved treasury log');
                })

                tsrInfo.treasuryBalance = changedBalance;
                created = req.body.created;
                updated = currentUTC;
                tsrInfo.save(function(error) {
                    if (!error) {
                        res.json({
                            message: 'Dispatch Ticket status change to closed succesfully',
                            success: true,
                        });
                    }
                });

            });

        });
    });

};


exports.dtUpdateTtSolution = function(req, res) {

    let pramTt = req.body;
    let updatedKey = {
        "_id": req.body._id,
        "dtTechnicianTickets._id": pramTt.tt_id,
        "dtTechnicianTickets.tTicketID": pramTt.tTicketID
    }

    let updatedValue = {
        "$set": {
            "dtTechnicianTickets.$.tTicketSolution": req.body.tTicketSolution,
            "dtTechnicianTickets.$.tTicketStatus": 'closed'
        }
    }

    Dispatch.update(updatedKey, updatedValue, function(err) {
        if (err) {
            throw err
        }

        let _idTt = {
            "_id": pramTt.tt_id,
            "tTicketID": pramTt.tTicketID
        }

        let _valSolution = {
            "updated":currentUTC,
            "tTicketSolution": req.body.tTicketSolution,
            "tTicketStatus": 'closed'
        }

        Tt.update(_idTt, _valSolution, function(ttErr) {
            if (ttErr) {
                throw ttErr
            }
            res.json({
                message: 'Update Technician Ticket succesfully',
                success: true
            });
        })

    })
};
