let express = require('express');
let router = express.Router();

// Require controller modules
let dtController = require('../controllers/dispatchTicketController');


/* GET request for list of all dts 
http://localhost:3000/manage-dt/dts
*/
router.get('/dts', dtController.dtListGet);

/* GET request for each dt detail by id. 
http://localhost:3000/manage-dt/dt-info/[id]
*/
router.get('/dt-info/:id', dtController.dtDetailGet);

/* GET request for technician name list of all tts 
http://localhost:3000/manage-dt/dt-vaulter-list
*/
router.get('/dt-vaulter-list', dtController.dtGetVaulterList);


/* GET request for list of all atms 
http://localhost:3000/manage-dt/atms-by-balance?b=100;
*/
router.get('/atms-by-balance', dtController.atmListByBalanceGet);


/* GET request for list atm only the machine that not present in the open dispatch ticket 
http://localhost:3000/manage-dt/atms-by-balance-not-yet-dispatch?b=100;
http://localhost:3000/manage-dt/atms-by-balance-not-yet-dispatch?b=1000&eid=<edit-dtID>
*/
router.get('/atms-by-balance-not-yet-dispatch', dtController.atmListByBalanceNotinDispatchGet);


/* GET request for list of active dts 
http://localhost:3000/manage-dt/active-dts
*/
router.get('/active-dts', dtController.dtActiveListGet);



/* POST request for creating dt.
http://localhost:3000/manage-dt/create
*/
router.post('/create', dtController.dtCreatePost);


/* POST request for update dt.
http://localhost:3000/manage-dt/update
*/
router.post('/update', dtController.dtUpdatePost);



module.exports = router;