const express = require('express');
const router = express.Router();
const markedQuestionController = require('../controller/markedQuestionController');
const { verifyUsersToken } = require('../config');

// All routes are protected
router.use(verifyUsersToken);

// Mark/unmark question
router.post('/mark', markedQuestionController.markQuestion);

// Get user's marked questions
router.get('/', markedQuestionController.getMarkedQuestions);

// Get marked questions count
router.get('/count', markedQuestionController.getMarkedQuestionsCount);

module.exports = router;