let express = require('express');
let router = express.Router();

// Require controller modules
let companyProfileController = require('../controllers/companyProfileController');

// User Routes


/* GET request for each user detail by id. 
http://localhost:3000/manage-company/company/[id]
*/
router.get('/company/:id', companyProfileController.companyDetailByIdGet);


/* GET request for list of all users 
http://localhost:3000/manage-company/companies
*/
router.get('/companies', companyProfileController.companyListGet);


/* POST request for creating company.
http://localhost:3000/manage-company/create
*/
router.post('/create', companyProfileController.companyProfileCreatePost);


/* POST request for update company.
http://localhost:3000/manage-company/update
*/
router.post('/update', companyProfileController.companyUpdatePost);


module.exports = router;