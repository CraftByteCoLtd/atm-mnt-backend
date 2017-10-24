let moment = require('moment');
let Treasury = require('../models/treasuryModel');
let TreasuryLog = require('../models/treasuryLogModel');

let currentUTC = moment().utc().toDate();

// Get Treasury
exports.treasuryGet = function(req, res) {
    Treasury.find({})
        .sort('-updated')
        .select('treasury treasuryBalance updated')
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


// Get Treasury logs last 10 items
exports.treasuryLogLastestGet = function(req, res) {
    TreasuryLog.find({})
        .sort('-updated')
        .limit(10)
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



exports.treasuryCreate = function(req, res) {
    let newTreasury = Treasury({
        treasuryNote: req.body.treasuryNote,
        treasuryBalance: req.body.treasuryBalance,
        updated: req.body.atmUpdatedBy,
        created: currentUTC
    });

    newTreasury.save(function(error) {

        if (error){
            res.json({
                message: 'Error! ',
                success: false
            });        
        }
        else
        {
            res.json({
                message: 'Save new Treasury successfully: ',
                success: true
            });
        }
    });
};


exports.treasuryUpdatePost = function(req, res) {
    if (!req.body.treasuryBalance) {
           res.json({
                    success: false,
                    message: 'No Balance provided.'
                });
           return 
    }

    Treasury.findOne({},function(error, tsrInfo) {

        if (error) throw error;
        let prevBalance = 0;
        prevBalance = tsrInfo.treasuryBalance;

        let trsLog = TreasuryLog({
            oldBalance: tsrInfo.treasuryBalance,
            newBalance: req.body.treasuryBalance,
            updatedBy: req.body.updatedBy,
            logType: req.body.logType

        });
        trsLog.save(function(error){
            if (!error) console.log('Saved treasury log');
        })


        tsrInfo.treasuryBalance = req.body.treasuryBalance;
        created = req.body.created;
        updated = currentUTC;
        tsrInfo.save(function(error) {
            if (error) throw error;


            res.json({
                message: 'Update Treasury Balance successfully',
                success: true
            });


        });

    });

};
