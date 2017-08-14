let express = require('express');
let router = express.Router();

// Require controller modules
let authController = require('../controllers/authController');

// Auth Routes

/* POST request for Login. */
router.post('/login', authController.authLoginPost);

module.exports = router;