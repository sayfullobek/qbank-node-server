const { Flags } = require("../models");

const addFlag = async ({ userId, questionId, testId }) => {
    try {
        console.log('Service - Adding flag:', { userId, questionId, testId });
        
        // Check if flag already exists
        const existingFlag = await Flags.findOne({
            userId,
            questionId
        });
        
        if (existingFlag) {
            console.log('Flag already exists');
            return existingFlag;
        }
        
        // Create new flag
        const newFlag = new Flags({
            userId,
            questionId,
            testId
        });
        
        const savedFlag = await newFlag.save();
        console.log('Flag saved:', savedFlag);
        return savedFlag;
    } catch (error) {
        console.error('Service error:', error);
        throw new Error(`Error adding flag: ${error.message}`);
    }
};

const removeFlag = async (userId, questionId) => {
    try {
        return await Flags.findOneAndDelete({
            userId,
            questionId
        });
    } catch (error) {
        throw new Error(`Error removing flag: ${error.message}`);
    }
};

const getFlagsByUser = async (userId) => {
    try {
        return await Flags.find({
            userId
        }).select('questionId testId').populate('questionId', 'questionBank');
    } catch (error) {
        throw new Error(`Error fetching flags: ${error.message}`);
    }
};

const getFlagsCount = async (userId) => {
    try {
        return await Flags.countDocuments({
            userId
        });
    } catch (error) {
        throw new Error(`Error counting flags: ${error.message}`);
    }
};

module.exports = {
    addFlag,
    removeFlag,
    getFlagsByUser,
    getFlagsCount
};