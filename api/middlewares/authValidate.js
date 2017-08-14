let jwt = require('jsonwebtoken');

// Validate the token 
module.exports = function(req, res, next) {

    let secretKey = req.app.get('superDuperSecret');
    // check header or url parameters or post parameters for token
    let token = req.body.token || req.query.token || req.headers['authorization'];
    // decode token

    if (token) {
    // Token in Bearer format ex: "Bearer " must be extract by 2 spaces
    let bearerToken = token.split(' ')[1];
        // verifies secret and checks expiredate
        jwt.verify(bearerToken, secretKey, function(err, decoded) {
            if (err) {
                  return res.status(403).json({
                        success: false,
                        message: 'Failed to authenticate token.'
                    });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).json({
            success: false,
            message: 'No token provided.'
        });

    }
};