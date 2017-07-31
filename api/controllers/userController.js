var moment = require('moment');
var User = require('../models/userModel');

var currentUTC = moment().utc().toDate();

// Get All Users list
exports.userListGet = function(req, res) {
    User.find({})
        .sort('-created')
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


exports.userCreatePost = function(req, res) {
    //Create A new User in the database
    var newUser = User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userName: req.body.userName,
        userPwd: req.body.userPwd,
        userEmails: req.body.userEmails,
        userPhones: req.body.userPhones,
        authRules: req.body.authRules,
        created: currentUTC
    });

    //  Persist the new user into the database
    newUser.save(function(error) {

        if (error)
            if (error.code == 11000) {
                res.json({
                    message: 'Username [' + newUser.userName + '] exists!',
                    success: false
                })
            } else {
                res.json(error);
            }
        else {
            res.json({
                message: 'Save new User: ' + newUser.fullName,
                success: true
            });
        }
    });
};


exports.userDetailGet = function(req, res) {
    var uniqId = req.params.id;
    if (!uniqId) {
        res.json({
            message: 'No parameters provided!',
            success: false
        });
    } else {

        User.findById(uniqId)
            .exec(function(error, user) {
                if (error)
                    res.send(error);
                else
                    res.status(200);
                res.send({
                    user
                });

            });
    }

};


exports.userUpdatePost = function(req, res) {

    User.findById(req.body.id, function(error, userPrevInfo) {

        if (error) throw error;

        userPrevInfo.firstName = req.body.firstName,
            userPrevInfo.lastName = req.body.lastName,
            userPrevInfo.userName = req.body.userName,
            userPrevInfo.userPwd = req.body.userPwd,
            userPrevInfo.userEmails = req.body.userEmails,
            userPrevInfo.userPhones = req.body.userPhones,
            userPrevInfo.authRules = req.body.authRules

        userPrevInfo.save(function(error) {
            if (error) throw error;

            res.json({
                message: 'Update new User: ' + userPrevInfo.firstName + ' ' + userPrevInfo.lastName + ' succesfully',
                success: true
            });


        })

    });

};