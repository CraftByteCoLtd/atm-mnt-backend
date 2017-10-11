let moment = require('moment');
let Atm = require('../models/atmModel');

let currentUTC = moment().utc().toDate();

// Get All ATM list
exports.atmListGet = function(req, res) {
    Atm.find({})
        .sort('-updated')
        .select('atmMachineID id atmBalance atmStatus updated atmLocation atmNote')
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


exports.atmCreatePost = function(req, res) {
    //Create A new ATM in the database
    let newAtm = Atm({
        atmMachineID: req.body.atmMachineID,
        atmBalance: req.body.atmBalance,
        atmLocation: req.body.atmLocation,
        atmNote: req.body.atmNote,
        atmStatus: req.body.atmStatus ? "online" : "offline",
        atmUpdatedBy: req.body.atmUpdatedBy,
        created: currentUTC
    });

    //  Persist the new atm into the database
    newAtm.save(function(error) {

        if (error)
            if (error.code == 11000) {
                res.json({
                    message: 'Atm Machine ID : [' + newAtm.atmMachineID + '] exists! Please make sure the Machine ID is uniqe',
                    success: false
                })
            } else {
                res.json(error);
            }
        else {
            res.json({
                message: 'Save new atm succesfully: ' + newAtm.atmMachineID,
                success: true
            });
        }
    });
};


exports.atmDetailGet = function(req, res) {
    let uniqId = req.params.id;
    if (!uniqId) {
        res.json({
            message: 'No parameters provided!',
            success: false
        });
    } else {

        Atm.findById(uniqId)
            .exec(function(error, atm) {
                if (error)
                    res.send(error);
                else
                    res.status(200);
                res.send({
                    atm
                });

            });
    }

};

exports.atmUpdatePost = function(req, res) {

    Atm.findById(req.body.id, function(error, atmPrevInfo) {

        if (error) throw error;
        atmPrevInfo.atmMachineID = req.body.atmMachineID,
            atmPrevInfo.atmBalance = req.body.atmBalance,
            atmPrevInfo.atmLocation = req.body.atmLocation,
            atmPrevInfo.atmNote = req.body.atmNote,
            atmPrevInfo.atmStatus = req.body.atmStatus ? "online": "offline",
            atmPrevInfo.atmUpdatedBy = req.body.atmUpdatedBy,

            atmPrevInfo.save(function(error) {
                if (error) {
                    res.json({
                        message: 'Error! The record cannot be save!',
                        success: false
                    });

                }

                res.json({
                    message: 'Update ATM: ' + atmPrevInfo.atmMachineID + ' succesfully',
                    success: true
                });


            })

    });

};