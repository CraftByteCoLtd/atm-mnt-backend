let express = require('express');
let router = express.Router();

// Require controller modules
let ttController = require('../controllers/technicianTicketController');

// tt Routes



/* GET request for each tt detail by id. 
http://localhost:3000/manage-tt/tt-info/[id]
*/
router.get('/tt-info/:id', ttController.ttDetailGet);


/* GET request for list of all tts 
http://localhost:3000/manage-tt/tts
*/
router.get('/tts', ttController.ttListGet);


/* GET request for technician name list of all tts 
http://localhost:3000/manage-tt/tt-name-list
*/
router.get('/tt-name-list', ttController.ttTechnicianNameListGet);


/* GET request for atm 
http://localhost:3000/manage-tt/tt-atm-list
*/
router.get('/tt-atm-list', ttController.ttAtmListGet);



/* POST request for all part by atm
http://localhost:3000/manage-tt/tt-part-list/
*/
router.post('/tt-part-list', ttController.ttTechnicianPartListByAtmMachineIDPost);


/* POST request for creating tt.
http://localhost:3000/manage-tt/create
*/
router.post('/create', ttController.ttCreatePost);


/* POST request for update tt.
http://localhost:3000/manage-tt/update
*/
router.post('/update', ttController.ttUpdatePost);




module.exports = router;