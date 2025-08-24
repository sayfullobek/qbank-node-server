const flagService = require("../services/flagService");

const addFlag = async (req, res) => {
    try {
        const { questionId, testId } = req.body;
        const userId = req.users._id;
        
        console.log('Adding flag:', { questionId, testId, userId });
        
        const flag = await flagService.addFlag({
            userId,
            questionId,
            testId
        });
        
        res.status(200).json({
            success: true,
            data: flag
        });
    } catch (err) {
        console.error('Error in addFlag controller:', err);
        res.status(400).json({ 
            success: false,
            error: err.message 
        });
    }
};

const removeFlag = async (req, res) => {
    try {
        const { questionId } = req.body;
        const userId = req.users._id;
        
        console.log('Removing flag:', { questionId, userId });
        
        const result = await flagService.removeFlag(userId, questionId);
        
        if (!result) {
            return res.status(404).json({ 
                success: false,
                message: "Flag not found" 
            });
        }
        
        res.status(200).json({ 
            success: true,
            message: "Flag removed successfully" 
        });
    } catch (err) {
        console.error('Error in removeFlag controller:', err);
        res.status(500).json({ 
            success: false,
            error: err.message 
        });
    }
};

const getFlagsByUser = async (req, res) => {
    try {
        const userId = req.users._id;
        
        const flags = await flagService.getFlagsByUser(userId);
        
        res.status(200).json({
            success: true,
            data: flags
        });
    } catch (err) {
        console.error('Error in getFlagsByUser controller:', err);
        res.status(500).json({ 
            success: false,
            error: err.message 
        });
    }
};

const getFlagsCount = async (req, res) => {
    try {
        const userId = req.users._id;
        
        const count = await flagService.getFlagsCount(userId);
        
        res.status(200).json({
            success: true,
            count: count
        });
    } catch (err) {
        console.error('Error in getFlagsCount controller:', err);
        res.status(500).json({ 
            success: false,
            error: err.message 
        });
    }
};

module.exports = {
    addFlag,
    removeFlag,
    getFlagsByUser,
    getFlagsCount
};