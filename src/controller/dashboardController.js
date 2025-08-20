// dashboardController.js - to'liq yangilangan kod:

const { Users, Test, OneTest, Questions } = require('../models');
const mongoose = require('mongoose');

exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.users.id;
        
        const user = await Users.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
        }

        const statistics = await calculateUserStatistics(userId);
        const answerChanges = await calculateAnswerChanges(userId);

        console.log('User ID:', userId);
        console.log('Statistics:', statistics);
        console.log('Answer Changes:', answerChanges);

        res.json({
            statistics: {
                correctAnswers: statistics.totalCorrect,
                incorrectAnswers: statistics.totalIncorrect,
                omittedAnswers: statistics.totalOmitted,
                usedQuestions: statistics.usedQuestions,
                unusedQuestions: statistics.unusedQuestions,
                totalQuestions: statistics.totalQuestions,
                rank: statistics.rank,
                totalScore: statistics.totalScore,
                testsCompleted: statistics.testsCompleted,
                averageScore: statistics.averageScore,
                correctPercentage: statistics.correctPercentage,
                qbankUsagePercentage: statistics.qbankUsagePercentage,
                streak: statistics.currentStreak,
                testsCreated: statistics.testsCreated,
                suspendedTests: statistics.suspendedTests,
                percentileRank: statistics.percentileRank,
                medianScore: statistics.medianScore,
                avgTimeSpent: statistics.avgTimeSpent
            },
            answerChanges: {
                correctToIncorrect: answerChanges.correctToIncorrect,
                incorrectToCorrect: answerChanges.incorrectToCorrect,
                incorrectToIncorrect: answerChanges.incorrectToIncorrect
            }
        });
        
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ error: error.message });
    }
};

async function calculateUserStatistics(userId) {
    try {
        const userTests = await Test.find({ user: userId, status: 'finished' });
        const oneTests = await OneTest.find({ user: userId });
        
        let totalCorrect = 0;
        let totalIncorrect = 0;
        let totalOmitted = 0;
        let totalScore = 0;
        
        // Unique savollar ro'yxati
        const uniqueQuestions = new Set();
        
        oneTests.forEach(oneTest => {
            uniqueQuestions.add(oneTest.question.toString());
            
            if (oneTest.isCorrect === true) {
                totalCorrect++;
            } else if (oneTest.isCorrect === false) {
                totalIncorrect++;
            } else if (oneTest.status === 'skip') {
                totalOmitted++;
            }
        });
        
        userTests.forEach(test => {
            totalScore += test.score || 0;
        });
        
        // MUAMMO YECHIMI: Faqat user testlarida ishlatilgan savollar sonini hisoblash
        const userTestQuestions = await Test.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId) } },
            { $unwind: '$randomTest' },
            { $group: { _id: null, totalQuestions: { $addToSet: '$randomTest' } } },
            { $project: { totalQuestionsCount: { $size: '$totalQuestions' } } }
        ]);
        
        const totalQuestionsInUserTests = userTestQuestions.length > 0 ? userTestQuestions[0].totalQuestionsCount : 0;
        
        // REAL ma'lumotlar
        const usedQuestions = uniqueQuestions.size;
        const totalQuestions = totalQuestionsInUserTests; // Bu user testlaridagi jami savollar
        const unusedQuestions = Math.max(0, totalQuestions - usedQuestions);
        const totalAnswered = totalCorrect + totalIncorrect + totalOmitted;
        
        // Foizlar
        const correctPercentage = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
        const averageScore = userTests.length > 0 ? Math.round(totalScore / userTests.length) : 0;
        const qbankUsagePercentage = totalQuestions > 0 ? Math.round((usedQuestions / totalQuestions) * 100) : 0;
        
        // Percentile rank
        const allUsersScores = await Users.aggregate([
            {
                $lookup: {
                    from: 'tests',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'userTests'
                }
            },
            {
                $addFields: {
                    totalScore: {
                        $sum: {
                            $map: {
                                input: '$userTests',
                                as: 'test',
                                in: { $ifNull: ['$$test.score', 0] }
                            }
                        }
                    }
                }
            },
            { $sort: { totalScore: 1 } }
        ]);
        
        const currentUserScore = totalScore;
        const lowerScoreCount = allUsersScores.filter(user => user.totalScore < currentUserScore).length;
        const percentileRank = allUsersScores.length > 0 ? 
            Math.round((lowerScoreCount / allUsersScores.length) * 100) : 50;
        
        // Rank
        const allUsersRanked = await Users.aggregate([
            {
                $lookup: {
                    from: 'tests',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'userTests'
                }
            },
            {
                $addFields: {
                    totalScore: {
                        $sum: {
                            $map: {
                                input: '$userTests',
                                as: 'test',
                                in: { $ifNull: ['$$test.score', 0] }
                            }
                        }
                    }
                }
            },
            { $sort: { totalScore: -1 } }
        ]);
        
        const rank = allUsersRanked.findIndex(user => user._id.toString() === userId) + 1;
        
        console.log('REAL calculation details:', {
            oneTestsCount: oneTests.length,
            uniqueQuestionsCount: usedQuestions,
            totalQuestionsInUserTests: totalQuestions,
            unusedQuestions: unusedQuestions,
            totalAnswered,
            correctPercentage,
            qbankUsagePercentage,
            currentUserScore,
            percentileRank,
            rank
        });
        
        return {
            totalCorrect,
            totalIncorrect,
            totalOmitted,
            usedQuestions,
            unusedQuestions,
            totalQuestions, // Bu endi user testlaridagi jami savollar
            rank: rank || 1,
            totalScore,
            testsCompleted: userTests.length,
            averageScore,
            correctPercentage,
            qbankUsagePercentage,
            currentStreak: await calculateStreak(userId),
            testsCreated: await Test.countDocuments({ user: userId }),
            suspendedTests: await Test.countDocuments({ user: userId, status: 'suspended' }),
            percentileRank,
            medianScore: 65,
            avgTimeSpent: 60
        };
    } catch (error) {
        console.error('Calculate statistics error:', error);
        throw error;
    }
}

// TO'G'RILANGAN Answer changes hisoblash
async function calculateAnswerChanges(userId) {
    try {
        const oneTests = await OneTest.find({ 
            user: userId,
            answerChanges: { $exists: true, $not: { $size: 0 } }
        }).populate('question', 'answerUz answerEn');
        
        let correctToIncorrect = 0;
        let incorrectToCorrect = 0;
        let incorrectToIncorrect = 0;
        
        console.log(`Found ${oneTests.length} tests with answer changes`);
        
        for (const oneTest of oneTests) {
            if (oneTest.answerChanges && oneTest.answerChanges.length > 0 && oneTest.question) {
                const correctAnswer = oneTest.question.answerUz || oneTest.question.answerEn;
                
                console.log(`Processing question ${oneTest.question._id}:`, {
                    correctAnswer,
                    answerChangesCount: oneTest.answerChanges.length,
                    finalAnswer: oneTest.answer
                });
                
                oneTest.answerChanges.forEach((change, index) => {
                    const isFromCorrect = change.from === correctAnswer;
                    const isToCorrect = change.to === correctAnswer;
                    
                    console.log(`Change ${index + 1}:`, {
                        from: change.from,
                        to: change.to,
                        isFromCorrect,
                        isToCorrect
                    });
                    
                    if (isFromCorrect && !isToCorrect) {
                        correctToIncorrect++;
                        console.log('Counted as correctToIncorrect');
                    } else if (!isFromCorrect && isToCorrect) {
                        incorrectToCorrect++;
                        console.log('Counted as incorrectToCorrect');
                    } else if (!isFromCorrect && !isToCorrect) {
                        incorrectToIncorrect++;
                        console.log('Counted as incorrectToIncorrect');
                    }
                });
            }
        }
        
        console.log('Final answer changes:', {
            correctToIncorrect,
            incorrectToCorrect,
            incorrectToIncorrect
        });
        
        return { correctToIncorrect, incorrectToCorrect, incorrectToIncorrect };
    } catch (error) {
        console.error('Calculate answer changes error:', error);
        return { correctToIncorrect: 0, incorrectToCorrect: 0, incorrectToIncorrect: 0 };
    }
}

// Streak hisoblash
async function calculateStreak(userId) {
    try {
        const last30Days = await Test.find({
            user: userId,
            status: 'finished',
            completedAt: {
                $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
        }).sort({ completedAt: -1 });

        if (last30Days.length === 0) return 0;

        const dailyTests = {};
        last30Days.forEach(test => {
            const date = test.completedAt.toISOString().split('T')[0];
            if (!dailyTests[date]) {
                dailyTests[date] = [];
            }
            dailyTests[date].push(test);
        });

        const completedDates = Object.keys(dailyTests).sort().reverse();
        
        let streak = 0;
        const today = new Date().toISOString().split('T')[0];
        
        for (let i = 0; i < 30; i++) {
            const checkDate = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
                .toISOString()
                .split('T')[0];

            if (completedDates.includes(checkDate)) {
                streak++;
            } else if (checkDate !== today) {
                break;
            }
        }

        return streak;
    } catch (error) {
        console.error('Calculate streak error:', error);
        return 0;
    }
}