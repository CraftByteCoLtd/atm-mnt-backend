let crypto = require('crypto');
module.exports = {
    'hash': ((inputText) => {
        return crypto.createHash('sha1').update(inputText).digest('base64');
    })

};