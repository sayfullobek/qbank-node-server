const { Result, OneTest, Test, Questions, Subjects, Systems } = require("../models");
const performanceService = require("../services/performanceService");

// GET /api/v1/performance/subjects - fanlar statistikasi
exports.getSubjectPerformance = async (req, res) => {
    try {
        // Development uchun default user ID
        const userId = req.user?.id || '675f4b91c6b5eb5c6b6b9c8a'; // Default test user
        const subjectStats = await performanceService.getSubjectPerformance(userId);
        
        res.status(200).json({
            success: true,
            data: subjectStats
        });
    } catch (error) {
        console.error('Subject performance error:', error);
        res.status(500).json({
            success: false,
            message: 'Fanlar statistikasini olishda xatolik',
            error: error.message
        });
    }
};

// GET /api/v1/performance/systems - tizimlar statistikasi  
exports.getSystemPerformance = async (req, res) => {
    try {
        const userId = req.user?.id || '675f4b91c6b5eb5c6b6b9c8a';
        const systemStats = await performanceService.getSystemPerformance(userId);
        
        res.status(200).json({
            success: true,
            data: systemStats
        });
    } catch (error) {
        console.error('System performance error:', error);
        res.status(500).json({
            success: false,
            message: 'Tizimlar statistikasini olishda xatolik',
            error: error.message
        });
    }
};

// GET /api/v1/performance/test-results - test natijalari
exports.getTestResults = async (req, res) => {
    try {
        const userId = req.user?.id || '675f4b91c6b5eb5c6b6b9c8a';
        const testResults = await performanceService.getTestResults(userId);
        
        res.status(200).json({
            success: true,
            data: testResults
        });
    } catch (error) {
        console.error('Test results error:', error);
        res.status(500).json({
            success: false,
            message: 'Test natijalarini olishda xatolik',
            error: error.message
        });
    }
};

// GET /api/v1/performance/overall - umumiy statistika
exports.getOverallStats = async (req, res) => {
    try {
        const userId = req.user?.id || '675f4b91c6b5eb5c6b6b9c8a';
        const overallStats = await performanceService.getOverallStats(userId);
        
        res.status(200).json({
            success: true,
            data: overallStats
        });
    } catch (error) {
        console.error('Overall stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Umumiy statistikani olishda xatolik',
            error: error.message
        });
    }
};