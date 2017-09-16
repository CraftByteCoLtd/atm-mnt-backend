let express = require('express');
let router = express.Router();

// Require controller modules
let treasuryController = require('../controllers/treasuryController');

// Treasury Routes

/* GET request for list of all treasury 
http://localhost:3000/manage-treasury/treasuries
*/
router.get('/treasuries', treasuryController.treasuryGet);


/* GET request for list of all users 
http://localhost:3000/manage-treasury/treasuries-log
*/
router.get('/treasury-log', treasuryController.treasuryLogLastestGet);


/* POST request for creating treasury.
http://localhost:3000/manage-treasury/create
*/
router.post('/create', treasuryController.treasuryCreate);


/* POST request for update treasury.
http://localhost:3000/manage-treasury/update
*/
router.post('/update', treasuryController.treasuryUpdatePost);





module.exports = router;