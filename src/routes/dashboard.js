// routes/dashboard.js
const express = require('express');
const router = express.Router();
const { dashboardController } = require('../controller');
const { verifyUsersToken } = require('../config');

router.get('/', verifyUsersToken, dashboardController.getDashboardData);

module.exports = router;