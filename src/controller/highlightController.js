const highlightService = require("../services/highlightService");

const saveHighlights = async (req, res) => {
    try {
        let { testId, questionId, highlights } = req.body;
        const userId = req.users._id;
        
        // Parse highlights if it's a string
        if (typeof highlights === 'string') {
            highlights = JSON.parse(highlights);
        }
        
        console.log('Saving highlights:', { testId, questionId, userId, highlights });
        
        const savedHighlights = await highlightService.saveHighlights({
            testId,
            questionId,
            userId,
            highlights
        });
        
        res.status(200).json({
            success: true,
            data: savedHighlights
        });
    } catch (err) {
        console.error('Error in saveHighlights controller:', err);
        res.status(400).json({ 
            success: false,
            error: err.message 
        });
    }
};

const getHighlightsByTest = async (req, res) => {
    try {
        const { testId } = req.params;
        const userId = req.users._id;
        
        const highlights = await highlightService.getHighlightsByTest(testId, userId);
        
        res.status(200).json({
            success: true,
            data: highlights
        });
    } catch (err) {
        res.status(500).json({ 
            success: false,
            error: err.message 
        });
    }
};

const getHighlightsByQuestion = async (req, res) => {
    try {
        const { testId, questionId } = req.params;
        const userId = req.users._id;
        
        const highlights = await highlightService.getHighlightsByQuestion(testId, questionId, userId);
        
        res.status(200).json({
            success: true,
            data: highlights
        });
    } catch (err) {
        res.status(500).json({ 
            success: false,
            error: err.message 
        });
    }
};

const deleteHighlights = async (req, res) => {
    try {
        const { testId, questionId } = req.params;
        const userId = req.users._id;
        
        const deleted = await highlightService.deleteHighlights(testId, questionId, userId);
        
        if (!deleted) {
            return res.status(404).json({ 
                success: false,
                message: "Highlights not found" 
            });
        }
        
        res.status(200).json({ 
            success: true,
            message: "Highlights deleted successfully" 
        });
    } catch (err) {
        res.status(500).json({ 
            success: false,
            error: err.message 
        });
    }
};

module.exports = {
    saveHighlights,
    getHighlightsByTest,
    getHighlightsByQuestion,
    deleteHighlights
};