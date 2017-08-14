let jwt = require('jsonwebtoken');
let helper = require('../helpers/hashText');

let User = require('../models/userModel');

exports.authLoginPost = function(req, res) {

    let pram = {
        userName: req.body.userName,
        userPwd: req.body.userPwd
    }

    // find the user
    User.findOne({
        userName: pram.userName,
        isActive: true
    }, function(err, user) {

        let cryptPassword = helper.hash(pram.userPwd);


        if (err) throw err;

        if (!user) {
            res.json({
                success: false,
                message: 'Authentication failed. User not found.'
            });
        } else if (user) {

            // check if password matches
            if (user.userPwd != cryptPassword) {
                res.json({
                    success: false,
                    message: 'Authentication failed. Wrong credentials.'
                });
            } else {

                // if user is found and password is right
                // create a token

                var signObject = {
                    "authRules": user.authRules,
                    "userPwd": user.userPwd,
                    "userName": user.userName,
                    "fullName":user.fullName,
                    "id":user.id
                }

                var token = jwt.sign(signObject, req.app.get('superDuperSecret'), {
                    expiresIn: 60 * 60 * 24 // expires in 24 hours
                });

                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'expires in 24 hours',
                    token: token
                });
            }

        }

    });
};