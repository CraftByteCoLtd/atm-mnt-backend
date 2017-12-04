let moment = require('moment');
let _ = require('lodash');
let CompanyProfile = require('../models/companyProfileModel');

let currentUTC = moment().utc().toDate();


exports.companyDetailByIdGet = function(req, res) {
    let uniqId = req.params.id;
    if (!uniqId) {
        res.json({
            message: 'No parameters provided!',
            success: false
        });
    } else {

        CompanyProfile.findById(uniqId)
            .exec(function(error, doc) {
                if (error)
                    res.send(error);
                else
                    res.status(200);
                res.send({
                    doc
                });

            });
    }

};


exports.companyListGet = function(req, res) {
    CompanyProfile.find({})
        .sort('-created')
        .limit(1)
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


exports.companyProfileCreatePost = function(req, res) {
    //Create A new User in the database

     CompanyProfile.remove({}, function(error) {
                console.log('removed');
            });

    let newCompanyProfile = new CompanyProfile({
        companyId: req.body.companyId,
        companyName: req.body.companyName,
        companyDetail: req.body.companyDetail,
        companyOwner: req.body.companyOwner,
        companyPhone: req.body.companyPhone,
        companyEmail: req.body.companyEmail,
        companyLogo: req.body.companyLogo,
        companyIsActive: req.body.companyIsActive,
        created: currentUTC
    });

   

    //  Persist the new user into the database
    newCompanyProfile.save(function(error) {

        if (error)
            if (error.code == 11000) {

                // there are two errors items that need to be declare
                // 1: companyAdminUsername
                // 2: companyId
                errorDupDesc = [];
                (_.includes(error.errmsg, 'companyId')) ? errorDupDesc.push('CompanyId'): '';
                (_.includes(error.errmsg, 'companyAdminUsername')) ? errorDupDesc.push('Company Admin Username'): '';

                res.json({
                    message: 'The selected ' + _.join(errorDupDesc, ',') + ' is duplicated!',
                    success: false
                })
            } else {
                res.json(error);
            }
        else {
            res.json({
                message: 'Saved  a new Company Profile: ' + newCompanyProfile.companyName,
                success: true
            });
        }
    });
};



exports.companyUpdatePost = function(req, res) {

    CompanyProfile.findById(req.body.id, function(error, companyPrevInfo) {
        if (error) throw error;

        // Due to the uniqe We do not allow to change company ID and companyUserName
        // companyPrevInfo.companyId =  req.body.companyId;            
        // companyPrevInfo.companyAdminPwd = req.body.companyAdminPwd;

        companyPrevInfo.companyName = req.body.companyName;
        companyPrevInfo.companyDetail = req.body.companyDetail;
        companyPrevInfo.companyOwner = req.body.companyOwner;
        companyPrevInfo.companyPhone = req.body.companyPhone;
        companyPrevInfo.companyEmail = req.body.companyEmail;
        companyPrevInfo.companyLogo = req.body.companyLogo;
        companyPrevInfo.companyIsActive = req.body.companyIsActive;

        companyPrevInfo.save(function(error) {
            if (error) {
                res.json(error.errmsg);
            } else {
                res.json({
                    message: 'Updated : ' + companyPrevInfo.companyName + ' information succesfully',
                    success: true
                });
            }

        })

    });

};