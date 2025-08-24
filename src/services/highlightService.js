const { Highlights } = require("../models");

const saveHighlights = async ({ testId, questionId, userId, highlights }) => {
    try {
        console.log('Service - Saving highlights:', { testId, questionId, userId, highlights });
        
        // Find existing highlights or create new one
        const existingHighlights = await Highlights.findOne({
            testId,
            questionId,
            userId
        });

        if (existingHighlights) {
            // Update existing highlights
            console.log('Updating existing highlights');
            existingHighlights.highlights = highlights;
            const saved = await existingHighlights.save();
            console.log('Updated highlights saved:', saved);
            return saved;
        } else {
            // Create new highlights
            console.log('Creating new highlights');
            const newHighlights = new Highlights({
                testId,
                questionId,
                userId,
                highlights
            });
            const saved = await newHighlights.save();
            console.log('New highlights saved:', saved);
            return saved;
        }
    } catch (error) {
        console.error('Service error:', error);
        throw new Error(`Error saving highlights: ${error.message}`);
    }
};

const getHighlightsByTest = async (testId, userId) => {
    try {
        return await Highlights.find({
            testId,
            userId
        }).select('questionId highlights');
    } catch (error) {
        throw new Error(`Error fetching highlights by test: ${error.message}`);
    }
};

const getHighlightsByQuestion = async (testId, questionId, userId) => {
    try {
        return await Highlights.findOne({
            testId,
            questionId,
            userId
        });
    } catch (error) {
        throw new Error(`Error fetching highlights by question: ${error.message}`);
    }
};

const deleteHighlights = async (testId, questionId, userId) => {
    try {
        return await Highlights.findOneAndDelete({
            testId,
            questionId,
            userId
        });
    } catch (error) {
        throw new Error(`Error deleting highlights: ${error.message}`);
    }
};

module.exports = {
    saveHighlights,
    getHighlightsByTest,
    getHighlightsByQuestion,
    deleteHighlights
};