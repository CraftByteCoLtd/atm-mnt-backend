let moment = require('moment');
let Part = require('../models/partModel');
let Atm = require('../models/atmModel');

let currentUTC = moment().utc().toDate();

// Get All Part list
exports.partListGet = function(req, res) {
    Part.find({})
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

// Get All Part Type
exports.partTypeListGet = function(req, res) {
    Part.distinct('partType')
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


exports.partCreatePost = function(req, res) {
    //Create A new Part in the database
    let newPart = Part({
        partID: req.body.partID,
        partDetail: req.body.partDetail,
        partType: req.body.partType,
        partStock: req.body.partStock,
        partPrice: req.body.partPrice,
        partSerialNumber: req.body.partSerialNumber,
        atmMachineID: req.body.atmMachineID,
        created: currentUTC
    });

    //  Persist the new part into the database
    newPart.save(function(error) {

        if (error)
            if (error.code == 11000) {
                res.json({
                    message: 'Part ID : [' + newPart.partID + '] exists! Please try again',
                    success: false
                })
            } else {
                res.json(error);
            }
        else {
            res.json({
                message: 'Save new part succesfully: ' + newPart.partID,
                success: true
            });
        }
    });
};


exports.partDetailGet = function(req, res) {
    let uniqId = req.params.id;
    if (!uniqId) {
        res.json({
            message: 'No parameters provided!',
            success: false
        });
    } else {

        Part.findById(uniqId)
            .exec(function(error, part) {
                if (error)
                    res.send(error);
                else
                    res.status(200);
                res.send({
                    part
                });

            });
    }

};

exports.partUpdatePost = function(req, res) {

    Part.findById(req.body.id, function(error, partPrevInfo) {

        if (error) throw error;
        partPrevInfo.partID = req.body.partID;
        partPrevInfo.partDetail = req.body.partDetail;
        partPrevInfo.partType = req.body.partType;
        partPrevInfo.partStock = req.body.partStock;
        partPrevInfo.partPrice = req.body.partPrice;
        partPrevInfo.partSerialNumber = req.body.partSerialNumber;
        partPrevInfo.atmMachineID = req.body.atmMachineID;

        partPrevInfo.save(function(error) {
            if (error) {
                res.json({
                    message: 'Error! The record cannot be save! Please try again',
                    success: false
                });

            }

            res.json({
                message: 'Update Part: ' + partPrevInfo.partID + ' succesfully',
                success: true
            });


        })

    });

};