var express = require('express');
var router = express.Router();

// Require controller modules
var authController = require('../controllers/authController');

// Auth Routes

/* POST request for Login. */
router.post('/login', authController.authLoginPost);

module.exports = router;