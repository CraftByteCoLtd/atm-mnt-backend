let express = require('express');
let router = express.Router();

// Require controller modules
let uploadFileController = require('../controllers/uploadFileController');


/* POST request for upload.
http://localhost:3000/manage-upload/upload-file
*/
router.post('/upload-file', uploadFileController.uploadFile);
router.post('/update-balance', uploadFileController.updateAtmBalance);
router.post('/upload-photo', uploadFileController.uploadPhoto);

module.exports = router;

