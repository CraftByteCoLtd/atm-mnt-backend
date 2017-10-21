let moment = require('moment');
let multer = require('multer')
let path = require('path')
let fs = require("fs");
let csv = require("fast-csv");
let _ = require("lodash");
let async = require('async');

let TreasuryCsv = require('../models/treasuryCsvModel');
let Atm = require('../models/atmModel');



let currentUTC = moment().utc().toDate();

let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads')
    },
    filename: function(req, file, cb) {
        let datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    }
});


let upload = multer({ //multer settings
    storage: storage,
    fileFilter: function(req, file, callback) {
        let ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg' && ext !== '.csv') {
            return callback(new Error('Only image,csv are allowed'))
        }
        callback(null, true)
    },
    limits: {
        fileSize: 1024 * 1024 * 10
    }
}).single('file');


//  Sum the DispensedAmount group by Machine ID
let sumDispensedAmount = function(items) {
    const ans = _(items)
        .groupBy('TerminalID')
        .map((DispensedAmount, id) => ({
            TerminalID: id,
            TotalDispensed: _.sumBy(DispensedAmount, 'DispensedAmount')
        }))
        .value()
    return ans;
}


let processCsv = function(inputFilePath, req, res) {

    // CSV required Fields
    // - DispensedAmount,
    // - Date, formated : MM/DD/YYYY
    // - TerminalID, as ATM ID

    let stream = fs.createReadStream(inputFilePath);
    let records = [];
    let result = {};

    //Using stream to create the csv 
    //Add Headers option to convert each line the be the object.
    //Transform Date to DateType and DateID
    //Convert DispensedAmount to Float

    csv
        .fromStream(stream, {
            headers: true
        })
        .on("data", function(data) {
            records.push(data);
        })
        .transform(function(obj) {
            //Convert the floate values
            obj.DispensedAmount = parseFloat(obj.DispensedAmount);
            //Create the dateTime Object from date string
            //moment.utc : to ignore the timezone 
            obj.onDate = moment.utc(obj.Date, 'MM/DD/YYYY').toDate();
            obj.onDateID = moment.utc(obj.Date, 'MM/DD/YYYY').format("YYYYMMDD");
            return obj;
        })
        .on("end", function() {
            let sumResult = [];
            sumResult = sumDispensedAmount(records);
            result.raw = records;
            result.sumUp = sumResult;
            result.originalName = req.file.originalname;
            result.fileName = inputFilePath.split('/')[1];
            result.filePath = inputFilePath;
            result.status = 'new';
            result.by = req.decoded.fullName;
            populateData(result, req, res);
        });
};

let populateData = function(data, req, res) {

    let newCsv = TreasuryCsv({
        raw: data.raw,
        sumUp: data.sumUp,
        originalName: data.originalName,
        fileName: data.fileName,
        filePath: data.filePath,
        status: data.status,
        by: data.by,
        created: currentUTC
    });


    async.waterfall([
        // remove the uploaded csv but not use
        removeTempUploaded = function(callback) {
            TreasuryCsv.remove({
                "status": "new"
            }, function(error) {
                callback();
            });
        },
        insertNewUpload = function(callback) {
            newCsv.save(function(error) {
                if (error) {
                    console.log(error);
                } else {
                    callback();
                }
            });
        },
        findTheLastUploadedRecord = function(callback) {
            TreasuryCsv.findOne({})
                .sort('-updated')
                .exec(callback)
        }
    ], function(error, result) {
        if (error)
            res.sendStatus(error);
        else
            res.status(200);

        res.json({
            message: 'Upload file succesfully',
            success: true,
            data: result
        });
    }); //end-async
}

exports.uploadFile = function(req, res) {

    upload(req, res, function(err) {
        if (err) {
            console.log(err);
            res.json({
                message: err,
                success: false
            });

        } else {
            processCsv(req.file.path, req, res);
        }
    });
};

exports.updateAtmBalance = function(req, res){

	// find the upload file by id
	let pramUploadID = req.body.id;
	TreasuryCsv.findById(pramUploadID,function(err,csvDoc){
		if (err || !csvDoc ) {
            console.log(err);
            res.json({
                message: err,
                success: false
            });		
        }

	// loop through sumUp by machineID
		let csvSumUp = [];
		csvSumUp = csvDoc.sumUp;
		_.forEach(csvSumUp,function(csvSumItem){
			// find AtM by atmMachineID
			Atm.findOne({"atmMachineID": csvSumItem.TerminalID},function(err, atmDoc){
				if (err) {
					throw err;						
		        }
		        if (atmDoc) {
			        // minus the atmBalance by totalDispensed
			        let currAtmBalance = 0;
			        let newAtmBalance = 0;

			     	currAtmBalance = atmDoc.atmBalance;
			     	newAtmBalance = currAtmBalance - csvSumItem.TotalDispensed;

			     	// update Each atmBalance to newAtmBalance
			     	let _idAtm = {"atmMachineID": atmDoc.atmMachineID }

					// balance
			        let _valBalance = {
			            "atmBalance": newAtmBalance,
			            "updated":currentUTC,
			            "atmUpdatedBy.fullName":req.decoded.fullName
			        }
			        // update atm
			        Atm.update(_idAtm, _valBalance, function(atmErr) {
			            if (atmErr) {
			                throw atmErr;
			            }
			        });
		    	}
			})
		});


	// update the status to done
	let _id_csv = {"_id": pramUploadID};
	let _status_csv  = {"status": "done"};

	TreasuryCsv.update(_id_csv, _status_csv, function(csvStatusErr){
		if (csvStatusErr) {

			throw csvStatusErr;

		} else {

			res.json({
			    message: 'Update the Atm Balance succesfully',
			    success: true
			});
		}
	});

	
	})
}

