let moment = require('moment');
let Tt = require('../models/technicianTicketModel');
let User = require('../models/userModel');
let Part = require('../models/partModel');
let Atm = require('../models/atmModel');

let currentUTC = moment().utc().toDate();

// Get All Technician Ticket list
exports.ttListGet = function(req, res) {
    Tt.find({})
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


exports.ttCreatePost = function(req, res) {
    let newTt = Tt({
        tTicketID: "new",
        tTicketCreated: currentUTC,
        tTicketSymptom: req.body.tTicketSymptom,
        tTicketSolution: req.body.tTicketSolution,
        tTicketCreatedBy: req.body.tTicketCreatedBy,
        tTicketResponsiblePerson: req.body.tTicketResponsiblePerson,
        tTicketStatus: req.body.tTicketStatus,
        tTicketRepairedPart: req.body.tTicketRepairedPart,
        atmMachineID: req.body.atmMachineID,
        updated: currentUTC
    });

    newTt.save(function(error) {

        if (error)
            if (error.code == 11000) {
                res.json({
                    message: 'The ticket ID is duplicated, please try submit again.',
                    success: false
                })
            } else {
                res.json(error);
            }
        else {
            res.json({
                message: 'Save new Technician Ticket',
                success: true
            });
        }
    });
};


exports.ttDetailGet = function(req, res) {
    let uniqId = req.params.id;
    if (!uniqId) {
        res.json({
            message: 'No parameters provided!',
            success: false
        });
    } else {

        Tt.findById(uniqId)
            .exec(function(error, tt) {
                if (error)
                    res.send(error);
                else
                    res.status(200);
                res.send({
                    tt
                });

            });
    }

};


exports.ttUpdatePost = function(req, res) {

    Tt.findById(req.body.id, function(error, ttPrevInfo) {

        console.log(JSON.stringify(req.body));

        if (error) throw error;

        ttPrevInfo.tTicketID = req.body.tTicketID;
        ttPrevInfo.tTicketSymptom = req.body.tTicketSymptom;
        ttPrevInfo.tTicketSolution = req.body.tTicketSolution;
        ttPrevInfo.tTicketCreatedBy = req.body.tTicketCreatedBy;
        ttPrevInfo.tTicketResponsiblePerson = req.body.tTicketResponsiblePerson;
        ttPrevInfo.tTicketStatus = req.body.tTicketStatus;
        ttPrevInfo.tTicketRepairedPart = req.body.tTicketRepairedPart;
        ttPrevInfo.atmMachineID = req.body.atmMachineID;
        ttPrevInfo.updated = currentUTC

        ttPrevInfo.save(function(error) {
            if (error) throw error;

            res.json({
                message: 'Update Technician Ticket succesfully',
                success: true
            });


        })

    });

};

// Get All ATM  list
exports.ttTechnicianNameListGet = function(req, res) {
    User.find({})
        .select('firstName lastName userName ')
        .where('authRules.isAtmTechnician').equals(true)
        .where('isActive').equals(true)
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

// Get All ATM  list
exports.ttAtmListGet = function(req, res) {
    Atm.find({})
        .select('atmMachineID _id')
        .sort('atmMachineID')
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


// Get All Technician name list
exports.ttTechnicianNameListGet = function(req, res) {
    User.find({})
        .select('firstName lastName userName ')
        .where('authRules.isAtmTechnician').equals(true)
        .where('isActive').equals(true)
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

// Post All Part by atmMachineID
exports.ttTechnicianPartListByAtmMachineIDPost = function(req, res) {

    let atmMachineID = req.body.atmMachineID;

    Part.find({})
        .select('partID partDetail partPrice partStock partType partSerialNumber')
        .where('atmMachineID').equals(atmMachineID)
        .sort('partDetail')
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