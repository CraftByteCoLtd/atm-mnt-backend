let express = require('express');
let router = express.Router();

// Require controller modules
let userController = require('../controllers/userController');

// User Routes



/* GET request for each user detail by id. 
http://localhost:3000/manage-user/user-info/[id]
*/
router.get('/user-info/:id', userController.userDetailGet);


/* GET request for list of all users 
http://localhost:3000/manage-user/users
*/
router.get('/users', userController.userListGet);


/* POST request for creating user.*/
router.post('/create', userController.userCreatePost);


/* POST request for update user.*/
router.post('/update', userController.userUpdatePost);




module.exports = router;