const express = require('express');
const router = express.Router();

router.use('/auth', require("./authRoute"));
router.use('/systems', require('./systemsRoute')); // 👉 qo‘shildi
router.use('/subjects', require('./subjectRoute')); // 👉 qo‘shildi
router.use('/level', require('./levelRoute')); // qo‘shilgan qism
router.use('/plan', require('./planRoute')); // qo‘shilgan qism
router.use('/questions', require('./questionRoute')); // qo‘shilgan qism
router.use('/test', require('./testRoutes')); // qo‘shilgan qism
router.use('/result', require('./resultRoutes')); // qo‘shilgan qism
router.use('/notes', require('./noteRoutes')); // qo'shilgan qism
router.use('/highlights', require('./highlightRoutes')); // qo'shilgan qism
router.use('/flags', require('./flagRoutes')); // qo'shilgan qism
router.use('/marked-questions', require('./markedQuestionRoutes')); // qo'shilgan qism
router.use('/flashcard', require('./flashcardRoutes')); // qo'shilgan qism
router.use('/dashboard', require('./dashboard')); // qo‘shilgan qism
router.use('/one-test', require('./oneTestRoute')); // qo'shilgan qism
router.use('/promo-code', require('./promoCodeRoutes')); // qo'shilgan qism
router.use('/performance', require('./performanceRoutes')); // Performance API routes

module.exports = router;
