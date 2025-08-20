const express = require('express');
const router = express.Router();
const CalendarController = require('../controller/CalendarController');
const authMiddleware = require('../middlewares/authMiddleware');

// Imtihon sanasini saqlash
router.post('/save-exam-date', authMiddleware, CalendarController.saveExamDate);

// Imtihon sanasini olish
router.get('/get-exam-date', authMiddleware, CalendarController.getExamDate);

// Foydalanuvchi rejasini olish
router.get('/get-study-plan', authMiddleware, CalendarController.getStudyPlan);

// Kunlik vazifani tugatish
router.post('/complete-daily-task', authMiddleware, CalendarController.completeDailyTask);

// Foydalanuvchi harakatlarini olish
router.get('/get-progress', authMiddleware, CalendarController.getProgress);

// Haftalik hisobot
router.get('/get-weekly-report', authMiddleware, CalendarController.getWeeklyReport);

// Test endpoint (middleware siz)
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Calendar API ishlayapti!',
    timestamp: new Date()
  });
});

module.exports = router;