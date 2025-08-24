const { Test, Questions, OneTest, Result, UserQBankProgress, Users } = require('../models');
const testService = require('../services/testService');

exports.createTest = async (req, res) => {
    try {
        const allQuestions = await Questions.find({
            $or: [
                { Subjects: { $in: req.body.subjects } },
                { Systems: { $in: req.body.sytems } }
            ],
            isActive: true
        }).lean();

        // Random savollar tanlash
        const randomQuestions = allQuestions
            .sort(() => Math.random() - 0.5)
            .slice(0, req.body.questionCount);

        const randomQuestionIds = randomQuestions.map(q => q._id);

        // Test yaratish
        const data = {
            user: req.users.id,
            randomTest: randomQuestionIds,
            ...req.body
        };

        const createdTest = await testService.createTest(data);
        
        // User statistics da testsCreated ni yangilash
        await Users.findByIdAndUpdate(req.users.id, {
            $inc: { 'statistics.testsCreated': 1 }
        });

        res.status(201).json({ 
            success: true, 
            data: createdTest, 
            firstTest: randomQuestionIds[0] 
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// testController.js da createOneTestAndPushToTest funksiyasini yangilang:

exports.createOneTestAndPushToTest = async (req, res) => {
    try {
        const { questionId, isCorrect, answer, status, mark } = req.body;
        const { testId } = req.params;
        const userId = req.users;

        console.log('Answer received:', { questionId, isCorrect, answer, status });

        // Test hujjatini olish
        const test = await Test.findById(testId)
            .populate("oneTests")
            .populate({
                path: "randomTest",
                select: "questionBank",
            });

        if (!test) {
            return res.status(404).json({ message: "Test topilmadi" });
        }

        // Savol hujjatini olish
        const question = await Questions.findById(questionId).select("questionBank answerUz answerEn");
        if (!question) {
            return res.status(404).json({ message: "Savol topilmadi" });
        }

        // Avval mavjud bo'lganini tekshirish
        let oneTest = await OneTest.findOne({
            _id: { $in: test.oneTests },
            question: questionId,
            user: userId
        });

        if (oneTest) {
            // Answer change tracking
            if (oneTest.answer && answer && (oneTest.answer.uz !== answer.uz || oneTest.answer.en !== answer.en)) {
                const oldAnswer = oneTest.answer.uz || oneTest.answer.en;
                const newAnswer = answer.uz || answer.en;
                const correctAnswer = question.answerUz || question.answerEn;
                
                console.log('Answer change detected:', {
                    oldAnswer,
                    newAnswer,
                    correctAnswer
                });
                
                oneTest.answerChanges.push({
                    from: oldAnswer,
                    to: newAnswer,
                    timestamp: new Date()
                });
            }
            
            // Mavjud bo'lsa yangilash
            oneTest.isCorrect = isCorrect;
            oneTest.answer = answer;
            oneTest.status = status;
            oneTest.questionBank = question.questionBank;
            oneTest.finalAnswer = answer;
            await oneTest.save();
        } else {
            // Yangi OneTest yaratish
            const newOneTest = await OneTest.create({
                question: questionId,
                user: userId,
                test: testId,
                questionBank: question.questionBank,
                isCorrect,
                answer,
                mark,
                status,
                originalAnswer: answer,
                finalAnswer: answer
            });

            test.oneTests.push(newOneTest._id);
            await test.save();
        }

        // Agar status 'finished' bo'lsa
        if (status === "finished") {
            const allQuestionIds = test.randomTest?.map(q => q._id?.toString() || q.toString()) || [];
            const answeredQuestionIds = await OneTest.find({
                test: testId,
                user: userId
            }).distinct("question");

            const answeredQuestionIdsStr = answeredQuestionIds.map(id => id.toString());
            const skippedQuestions = allQuestionIds.filter(qId => 
                !answeredQuestionIdsStr.includes(qId.toString())
            );

            if (skippedQuestions.length > 0) {
                const skipDocs = [];
                for (let qId of skippedQuestions) {
                    skipDocs.push({
                        question: qId,
                        user: userId,
                        test: testId,
                        status: "skip",
                        questionBank: question.questionBank,
                        isCorrect: null
                    });
                }
                await OneTest.insertMany(skipDocs);
            }

            // Test yakunlanganda statistikalarni yangilash
            await updateTestStatistics(testId, userId);
        }

        res.status(200).json({
            success: true,
            updatedTest: test
        });

    } catch (error) {
        console.error("Xatolik:", error);
        res.status(500).json({ error: error.message });
    }
};

// Test statistikalarini yangilash funksiyasi
async function updateTestStatistics(testId, userId) {
    try {
        const test = await Test.findById(testId);
        const oneTests = await OneTest.find({ test: testId, user: userId });
        
        let correctAnswers = 0;
        let incorrectAnswers = 0;
        let omittedAnswers = 0;
        let totalAnswerChanges = 0;
        
        oneTests.forEach(oneTest => {
            if (oneTest.isCorrect === true) {
                correctAnswers++;
            } else if (oneTest.isCorrect === false) {
                incorrectAnswers++;
            } else if (oneTest.status === 'skip' || oneTest.isCorrect === null) {
                omittedAnswers++;
            }
            
            // Answer changes count
            if (oneTest.answerChanges && oneTest.answerChanges.length > 0) {
                totalAnswerChanges += oneTest.answerChanges.length;
            }
        });
        
        const totalQuestions = oneTests.length;
        const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
        
        // Test modelini yangilash
        await Test.findByIdAndUpdate(testId, {
            status: 'finished',
            completedAt: new Date(),
            score: score,
            maxScore: 100,
            'results.correctAnswers': correctAnswers,
            'results.incorrectAnswers': incorrectAnswers,
            'results.omittedAnswers': omittedAnswers,
            'results.totalQuestions': totalQuestions,
            'results.answerChanges': oneTests.filter(ot => ot.answerChanges && ot.answerChanges.length > 0)
                .map(ot => ot.answerChanges).flat()
        });
        
        // User statistikalarini yangilash
        const user = await Users.findById(userId);
        if (user) {
            user.statistics.totalCorrect += correctAnswers;
            user.statistics.totalIncorrect += incorrectAnswers;
            user.statistics.totalOmitted += omittedAnswers;
            user.statistics.usedQuestions += totalQuestions;
            user.statistics.testsCompleted += 1;
            user.statistics.totalScore += score;
            user.statistics.lastTestDate = new Date();
            
            // Average score yangilash
            if (user.statistics.testsCompleted > 0) {
                user.statistics.averageScore = Math.round(
                    user.statistics.totalScore / user.statistics.testsCompleted
                );
            }
            
            // Streak yangilash
            user.statistics.currentStreak = await calculateUserStreak(userId);
            
            await user.save();
        }
        
        console.log(`Test ${testId} statistikalari yangilandi`);
        
    } catch (error) {
        console.error('Test statistikalarini yangilashda xato:', error);
    }
}

// User streak hisoblash
async function calculateUserStreak(userId) {
    try {
        const last7Days = await Test.find({
            user: userId,
            status: 'finished',
            completedAt: {
                $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            }
        }).sort({ completedAt: -1 });

        const completedDates = last7Days.map(test => 
            test.completedAt.toISOString().split('T')[0]
        );

        let streak = 0;
        for (let i = 0; i < 7; i++) {
            const checkDate = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
                .toISOString()
                .split('T')[0];

            if (completedDates.includes(checkDate)) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    } catch (error) {
        console.error('Streak hisoblashda xato:', error);
        return 0;
    }
}

exports.getAllTests = async (req, res) => {
    try {
        const tests = await testService.getAllTests(req.user.id);
        res.status(200).json({ success: true, data: tests });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getTestById = async (req, res) => {
    try {
        const test = await Test.findById(req.params.id)
            .populate("subjects")
            .populate("sytems")
            .lean();

        if (!test) {
            return res.status(404).json({ success: false, message: "Test topilmadi" });
        }

        res.status(200).json({
            success: true,
            data: {
                test,
            }
        });

    } catch (err) {
        console.error("Xatolik:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getTestByIdUser = async (req, res) => {
    try {
        console.log('🔍 getTestByIdUser called with userId:', req.params.id);
        const tests = await Test.find({ user: req.params.id })
            .populate({
                path: 'oneTests',
                populate: {
                    path: 'question',
                    model: 'questions',
                    populate: [
                        {
                            path: 'Subjects',
                            model: 'subjects',
                            select: 'name code'
                        },
                        {
                            path: 'Systems',
                            model: 'systems',
                            select: 'name description'
                        }
                    ]
                }
            })
            .populate('subjects', 'name code')
            .populate('sytems', 'name description')
            .lean();

        console.log('📊 Tests found:', tests ? tests.length : 0);
        
        if (!tests || tests.length === 0) {
            console.log('❌ No tests found for user');
            return res.status(404).json({ success: false, message: "Test topilmadi" });
        }

        const testsWithResults = await Promise.all(
            tests.map(async (test) => {
                const results = await Result.find({ test: test._id }).lean();
                
                // Extract unique subjects and systems from OneTest questions
                const uniqueSubjects = new Map();
                const uniqueSystems = new Map();
                
                if (test.oneTests) {
                    test.oneTests.forEach(oneTest => {
                        if (oneTest.question?.Subjects && oneTest.question.Subjects._id) {
                            const subject = oneTest.question.Subjects;
                            uniqueSubjects.set(subject._id.toString(), subject);
                        }
                        if (oneTest.question?.Systems && oneTest.question.Systems._id) {
                            const system = oneTest.question.Systems;
                            uniqueSystems.set(system._id.toString(), system);
                        }
                    });
                }
                
                return { 
                    ...test, 
                    results,
                    // Add extracted subjects and systems for frontend display
                    extractedSubjects: Array.from(uniqueSubjects.values()),
                    extractedSystems: Array.from(uniqueSystems.values())
                };
            })
        );

        res.status(200).json({
            success: true,
            data: testsWithResults
        });

    } catch (err) {
        console.error("Xatolik:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.checkIsActiveTest = async (req, res) => {
    try {
        const test = await Test.findById(req.params.id)
            .populate("subjects")
            .populate("sytems")
            .lean();

        const isExist = await OneTest.findOne({
            _id: { $in: test.oneTests },
            question: req.params.questionId
        });

        res.status(200).json({
            success: true,
            data: {
                isExist,
            }
        });

    } catch (err) {
        console.error("Xatolik:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateTestStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const id = req.params.id;
        const userId = req.users;

        await Test.findByIdAndUpdate(id, { status });

        // Agar test suspended bo'lsa, user statistics da suspendedTests ni yangilash
        if (status === 'suspended') {
            await Users.findByIdAndUpdate(userId, {
                $inc: { 'statistics.suspendedTests': 1 }
            });
        }

        res.json({ success: true });
    } catch (error) {
        console.error("Status update xatolik:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.updateMarkStatus = async (req, res) => {
    try {
        const { testId, questionId } = req.params;
        const { mark } = req.body;

        const update = await OneTest.findOneAndUpdate(
            { test: testId, question: questionId }, 
            { mark: mark },
            { new: true }
        );

        res.status(200).json({
            success: true,
            data: update
        });
    } catch (error) {
        console.error('Mark update error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Delete test and reset OneTest records
exports.deleteTest = async (req, res) => {
    try {
        const testId = req.params.id;
        
        // Find the test to get user info
        const test = await Test.findById(testId);
        if (!test) {
            return res.status(404).json({
                success: false,
                message: 'Test topilmadi'
            });
        }

        // Delete all OneTest records for this test (marks questions as unanswered)
        await OneTest.deleteMany({ test: testId });
        
        // Delete the Result record for this test
        await Result.deleteOne({ test: testId });
        
        // Delete the test itself
        await Test.findByIdAndDelete(testId);
        
        // Update user statistics - decrement testsCompleted if test was completed
        if (test.completedAt) {
            await Users.findByIdAndUpdate(test.user, {
                $inc: { 
                    'statistics.testsCompleted': -1,
                    'statistics.testsCreated': -1
                }
            });
        } else {
            await Users.findByIdAndUpdate(test.user, {
                $inc: { 'statistics.testsCreated': -1 }
            });
        }

        res.status(200).json({
            success: true,
            message: 'Test va tegishli ma\'lumotlar muvaffaqiyatli o\'chirildi'
        });
        
    } catch (error) {
        console.error('Delete test error:', error);
        res.status(500).json({
            success: false,
            message: 'Testni o\'chirishda xatolik yuz berdi',
            error: error.message
        });
    }
};