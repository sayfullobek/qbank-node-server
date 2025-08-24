const { MarkedQuestions } = require("../models");

const markQuestion = async ({ userId, questionId, testId }) => {
    try {
        console.log('Service - Marking question:', { userId, questionId, testId });
        
        // Check if question already marked
        const existingMark = await MarkedQuestions.findOne({
            userId,
            questionId
        });
        
        if (existingMark) {
            console.log('Question already marked');
            return existingMark;
        }
        
        // Create new mark
        const newMark = new MarkedQuestions({
            userId,
            questionId,
            testId
        });
        
        const savedMark = await newMark.save();
        console.log('Question marked:', savedMark);
        return savedMark;
    } catch (error) {
        console.error('Service error:', error);
        throw new Error(`Error marking question: ${error.message}`);
    }
};

const unmarkQuestion = async (userId, questionId) => {
    try {
        return await MarkedQuestions.findOneAndDelete({
            userId,
            questionId
        });
    } catch (error) {
        throw new Error(`Error unmarking question: ${error.message}`);
    }
};

const getMarkedQuestions = async (userId) => {
    try {
        return await MarkedQuestions.find({
            userId
        }).select('questionId testId').populate('questionId', 'questionBank');
    } catch (error) {
        throw new Error(`Error fetching marked questions: ${error.message}`);
    }
};

const getMarkedQuestionsCount = async (userId) => {
    try {
        return await MarkedQuestions.countDocuments({
            userId
        });
    } catch (error) {
        throw new Error(`Error counting marked questions: ${error.message}`);
    }
};

module.exports = {
    markQuestion,
    unmarkQuestion,
    getMarkedQuestions,
    getMarkedQuestionsCount
};