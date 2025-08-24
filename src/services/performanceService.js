const { Result, OneTest, Test, Questions, Subjects, Systems } = require("../models");

// Fanlar bo'yicha performance statistics
exports.getSubjectPerformance = async (userId) => {
    try {
        // 1. User'ning barcha OneTest natijalarini olish
        const userOneTests = await OneTest.find({ user: userId })
            .populate({
                path: 'question',
                populate: {
                    path: 'subject',
                    model: 'subjects'
                }
            });

        // 2. Fanlar bo'yicha grouping
        const subjectGroups = {};
        
        userOneTests.forEach(oneTest => {
            const subject = oneTest.question?.subject;
            if (!subject) return;
            
            const subjectName = subject.name?.uz || subject.name || 'Noma\'lum fan';
            
            if (!subjectGroups[subjectName]) {
                subjectGroups[subjectName] = {
                    name: subjectName,
                    total: 0,
                    answered: 0,
                    correct: 0,
                    incorrect: 0,
                    omitted: 0
                };
            }
            
            subjectGroups[subjectName].answered++;
            
            if (oneTest.isCorrect === true) {
                subjectGroups[subjectName].correct++;
            } else if (oneTest.isCorrect === false) {
                subjectGroups[subjectName].incorrect++;
            } else {
                subjectGroups[subjectName].omitted++;
            }
        });

        // 3. Total questions har bir fan uchun olish
        const allSubjects = await Subjects.find({});
        for (const subject of allSubjects) {
            const subjectName = subject.name?.uz || subject.name || 'Noma\'lum fan';
            const totalQuestions = await Questions.countDocuments({ subject: subject._id });
            
            if (subjectGroups[subjectName]) {
                subjectGroups[subjectName].total = totalQuestions;
            } else if (totalQuestions > 0) {
                // Agar user bu fandan savol ishlamagan bo'lsa ham ko'rsatamiz
                subjectGroups[subjectName] = {
                    name: subjectName,
                    total: totalQuestions,
                    answered: 0,
                    correct: 0,
                    incorrect: 0,
                    omitted: 0
                };
            }
        }

        // 4. Foizlarni hisoblash
        const subjectStats = Object.values(subjectGroups).map(subject => {
            const answeredPercent = subject.total > 0 ? (subject.answered / subject.total * 100) : 0;
            const correctPercent = subject.answered > 0 ? (subject.correct / subject.answered * 100) : 0;
            const incorrectPercent = subject.answered > 0 ? (subject.incorrect / subject.answered * 100) : 0;
            const omittedPercent = subject.answered > 0 ? (subject.omitted / subject.answered * 100) : 0;
            
            return {
                ...subject,
                answeredPercent: Number(answeredPercent.toFixed(1)),
                correctPercent: Number(correctPercent.toFixed(1)),
                incorrectPercent: Number(incorrectPercent.toFixed(1)),
                omittedPercent: Number(omittedPercent.toFixed(1))
            };
        });

        return subjectStats.sort((a, b) => b.answeredPercent - a.answeredPercent);
    } catch (error) {
        console.error('Subject performance service error:', error);
        throw error;
    }
};

// Tizimlar bo'yicha performance statistics
exports.getSystemPerformance = async (userId) => {
    try {
        // 1. User'ning barcha OneTest natijalarini olish
        const userOneTests = await OneTest.find({ user: userId })
            .populate({
                path: 'question',
                populate: {
                    path: 'systems',
                    model: 'systems'
                }
            });

        // 2. Tizimlar bo'yicha grouping
        const systemGroups = {};
        
        userOneTests.forEach(oneTest => {
            const system = oneTest.question?.systems;
            if (!system) return;
            
            const systemName = system.name?.uz || system.name || 'Noma\'lum tizim';
            
            if (!systemGroups[systemName]) {
                systemGroups[systemName] = {
                    name: systemName,
                    total: 0,
                    answered: 0,
                    correct: 0,
                    incorrect: 0,
                    omitted: 0,
                    subcategories: [] // Kichik kategoriyalar uchun
                };
            }
            
            systemGroups[systemName].answered++;
            
            if (oneTest.isCorrect === true) {
                systemGroups[systemName].correct++;
            } else if (oneTest.isCorrect === false) {
                systemGroups[systemName].incorrect++;
            } else {
                systemGroups[systemName].omitted++;
            }
        });

        // 3. Total questions har bir tizim uchun olish
        const allSystems = await Systems.find({});
        for (const system of allSystems) {
            const systemName = system.name?.uz || system.name || 'Noma\'lum tizim';
            const totalQuestions = await Questions.countDocuments({ systems: system._id });
            
            if (systemGroups[systemName]) {
                systemGroups[systemName].total = totalQuestions;
            } else if (totalQuestions > 0) {
                systemGroups[systemName] = {
                    name: systemName,
                    total: totalQuestions,
                    answered: 0,
                    correct: 0,
                    incorrect: 0,
                    omitted: 0,
                    subcategories: []
                };
            }
        }

        // 4. Foizlarni hisoblash
        const systemStats = Object.values(systemGroups).map(system => {
            const answeredPercent = system.total > 0 ? (system.answered / system.total * 100) : 0;
            const correctPercent = system.answered > 0 ? (system.correct / system.answered * 100) : 0;
            const incorrectPercent = system.answered > 0 ? (system.incorrect / system.answered * 100) : 0;
            const omittedPercent = system.answered > 0 ? (system.omitted / system.answered * 100) : 0;
            
            return {
                ...system,
                answeredPercent: Number(answeredPercent.toFixed(1)),
                correctPercent: Number(correctPercent.toFixed(1)),
                incorrectPercent: Number(incorrectPercent.toFixed(1)),
                omittedPercent: Number(omittedPercent.toFixed(1))
            };
        });

        return systemStats.sort((a, b) => b.answeredPercent - a.answeredPercent);
    } catch (error) {
        console.error('System performance service error:', error);
        throw error;
    }
};

// Test natijalari (grafiklar uchun)
exports.getTestResults = async (userId) => {
    try {
        // User'ning barcha test natijalarini olish (oxirgi 50 ta)
        const results = await Result.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(50)
            .populate('test', 'name');

        const scores = results.reverse().map(result => result.score);
        const dates = results.map(result => result.createdAt.toISOString().split('T')[0]);

        return {
            scores,
            dates
        };
    } catch (error) {
        console.error('Test results service error:', error);
        throw error;
    }
};

// Umumiy statistika
exports.getOverallStats = async (userId) => {
    try {
        // User'ning barcha OneTest javoblarini olish
        const allOneTests = await OneTest.find({ user: userId });
        
        const totalQuestions = allOneTests.length;
        const correctAnswers = allOneTests.filter(test => test.isCorrect === true).length;
        const incorrectAnswers = allOneTests.filter(test => test.isCorrect === false).length;
        const omittedAnswers = totalQuestions - correctAnswers - incorrectAnswers;

        const correctPercentage = totalQuestions > 0 ? (correctAnswers / totalQuestions * 100) : 0;
        const incorrectPercentage = totalQuestions > 0 ? (incorrectAnswers / totalQuestions * 100) : 0;
        const omittedPercentage = totalQuestions > 0 ? (omittedAnswers / totalQuestions * 100) : 0;

        return {
            totalQuestions,
            correctAnswers,
            incorrectAnswers,
            omittedAnswers,
            correctPercentage: Number(correctPercentage.toFixed(1)),
            incorrectPercentage: Number(incorrectPercentage.toFixed(1)),
            omittedPercentage: Number(omittedPercentage.toFixed(1))
        };
    } catch (error) {
        console.error('Overall stats service error:', error);
        throw error;
    }
};