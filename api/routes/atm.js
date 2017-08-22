let express = require('express');
let router = express.Router();

// Require controller modules
let atmController = require('../controllers/atmController');

// atm Routes



/* GET request for each atm detail by id. 
http://localhost:3000/manage-atm/atm-info/[id]
*/
router.get('/atm-info/:id', atmController.atmDetailGet);


/* GET request for list of all atms 
http://localhost:3000/manage-atm/atms
*/
router.get('/atms', atmController.atmListGet);


/* POST request for creating atm.*/
router.post('/create', atmController.atmCreatePost);


/* POST request for update atm.*/
router.post('/update', atmController.atmUpdatePost);




module.exports = router;