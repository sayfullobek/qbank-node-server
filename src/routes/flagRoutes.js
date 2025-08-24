const express = require('express');
const router = express.Router();
const flagController = require('../controller/flagController');
const { verifyUsersToken } = require('../config');

// All routes are protected
router.use(verifyUsersToken);

// Add flag
router.post('/add', flagController.addFlag);

// Remove flag
router.post('/remove', flagController.removeFlag);

// Get user's flags
router.get('/', flagController.getFlagsByUser);

// Get flags count
router.get('/count', flagController.getFlagsCount);

module.exports = router;