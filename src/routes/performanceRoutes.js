const express = require('express');
const router = express.Router();
const performanceController = require('../controller/performanceController');
const authMiddleware = require('../middlewares/authMiddleware');

// Development uchun vaqtincha auth o'chirilgan
// router.use(authMiddleware);

// GET /api/v1/performance/subjects - fanlar statistikasi
router.get('/subjects', performanceController.getSubjectPerformance);

// GET /api/v1/performance/systems - tizimlar statistikasi  
router.get('/systems', performanceController.getSystemPerformance);

// GET /api/v1/performance/test-results - test natijalari
router.get('/test-results', performanceController.getTestResults);

// GET /api/v1/performance/overall - umumiy statistika
router.get('/overall', performanceController.getOverallStats);

module.exports = router;