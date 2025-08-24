const markedQuestionService = require("../services/markedQuestionService");

const markQuestion = async (req, res) => {
    try {
        const { questionId, testId, mark } = req.body;
        const userId = req.users._id;
        
        console.log('Marking question:', { questionId, testId, userId, mark });
        
        if (mark) {
            // Add mark
            const markedQuestion = await markedQuestionService.markQuestion({
                userId,
                questionId,
                testId
            });
            
            res.status(200).json({
                success: true,
                data: markedQuestion
            });
        } else {
            // Remove mark
            const result = await markedQuestionService.unmarkQuestion(userId, questionId);
            
            res.status(200).json({ 
                success: true,
                message: "Question unmarked successfully" 
            });
        }
    } catch (err) {
        console.error('Error in markQuestion controller:', err);
        res.status(400).json({ 
            success: false,
            error: err.message 
        });
    }
};

const getMarkedQuestions = async (req, res) => {
    try {
        const userId = req.users._id;
        
        const markedQuestions = await markedQuestionService.getMarkedQuestions(userId);
        
        res.status(200).json({
            success: true,
            data: markedQuestions
        });
    } catch (err) {
        console.error('Error in getMarkedQuestions controller:', err);
        res.status(500).json({ 
            success: false,
            error: err.message 
        });
    }
};

const getMarkedQuestionsCount = async (req, res) => {
    try {
        const userId = req.users._id;
        
        const count = await markedQuestionService.getMarkedQuestionsCount(userId);
        
        res.status(200).json({
            success: true,
            count: count
        });
    } catch (err) {
        console.error('Error in getMarkedQuestionsCount controller:', err);
        res.status(500).json({ 
            success: false,
            error: err.message 
        });
    }
};

module.exports = {
    markQuestion,
    getMarkedQuestions,
    getMarkedQuestionsCount
};