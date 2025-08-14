const { Test, Questions, OneTest, Result, UserQBankProgress } = require('../models');
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

        // Random 10 ta tanlash
        const randomQuestions = allQuestions
            .sort(() => Math.random() - 0.5)
            .slice(0, req.body.questionCount);

        const randomQuestionIds = randomQuestions.map(q => q._id);

        // Agar keyin test yaratilsa, shuni saqlang
        const data = {
            user: req.users.id, // auth middleware orqali keladi
            randomTest: randomQuestionIds,
            ...req.body
        };

        const createdTest = await testService.createTest(data);
        // console.log(createdTest)
        res.status(201).json({ success: true, data: createdTest, firstTest: randomQuestionIds[0] });
    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: err.message });
    }
};


exports.createOneTestAndPushToTest = async (req, res) => {
    try {
        const { questionId, isCorrect, answer, status, mark } = req.body;
        const { testId } = req.params;
        const userId = req.users;

        // Test hujjatini olish
        const test = await Test.findById(testId)
            .populate("oneTests")
            .populate({
                path: "randomTest", // randomTest ichidagi savollar
                select: "questionBank", // questionBank fieldini olish
            });

        if (!test) {
            return res.status(404).json({ message: "Test topilmadi" });
        }

        // Savol hujjatini olish (questionBank aniqlash uchun)
        const question = await Questions.findById(questionId).select("questionBank");
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
            // Mavjud bo‘lsa yangilash
            oneTest.isCorrect = isCorrect;
            oneTest.answer = answer;
            oneTest.status = status;
            oneTest.questionBank = question.questionBank; // yangi maydon
            await oneTest.save();
        } else {
            // Yangi OneTest yaratish
            const newOneTest = await OneTest.create({
                question: questionId,
                user: userId,
                test: testId,
                questionBank: question.questionBank, // yangi maydon
                isCorrect,
                answer,
                mark,
                status
            });

            test.oneTests.push(newOneTest._id);
            await test.save();
        }

        /**
         * Agar status 'finished' bo'lsa -> ishlanmagan savollarga skip beramiz
         */
        if (status === "finished") {
            const allQuestionIds = test.randomTest?.map(q => q._id.toString()) || [];
            const answeredQuestionIds = await OneTest.find({
                test: testId,
                user: userId
            }).distinct("question");

            const skippedQuestions = allQuestionIds.filter(qId => !answeredQuestionIds.includes(qId));

            if (skippedQuestions.length > 0) {
                const skipDocs = [];
                for (let qId of skippedQuestions) {
                    const q = test.randomTest.find(q => q._id.toString() === qId);
                    skipDocs.push({
                        question: qId,
                        user: userId,
                        test: testId,
                        status: "skip",
                        questionBank: q.questionBank // yangi maydon
                    });
                }
                await OneTest.insertMany(skipDocs);
            }
        }

        /**
         * Progress yangilash
         */
        const qbId = question.questionBank;
        const totalQuestionsInBank = await Questions.countDocuments({ questionBank: qbId });
        const usedQuestions = await OneTest.distinct("question", {
            user: userId,
            questionBank: qbId
        });

        const usedPercentage = (usedQuestions.length / totalQuestionsInBank) * 100;

        // await UserQBankProgress.findOneAndUpdate(
        //     { user: userId, questionBank: qbId },
        //     {
        //         user: userId,
        //         questionBank: qbId,
        //         usedQuestions: usedQuestions.length,
        //         usedPercentage
        //     },
        //     { upsert: true, new: true }
        // );

        res.status(200).json({
            success: true,
            message: "OneTest yaratildi/yangilandi",
            updatedTest: test
        });

    } catch (error) {
        console.error("Xatolik:", error);
        res.status(500).json({ message: "Server xatoligi", error });
    }
};





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
                // questions: processedQuestions
            }
        });

    } catch (err) {
        console.error("Xatolik:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getTestByIdUser = async (req, res) => {
    try {
        // 1. Foydalanuvchiga tegishli barcha testlarni topish
        const tests = await Test.find({ user: req.params.id })
            .populate({
                path: 'oneTests',
                populate: {
                    path: 'question',
                    model: 'questions', // to‘g‘ri model nomi (ko‘plikda, `questions`)
                    populate: [
                        {
                            path: 'Subjects',
                            model: 'subjects'
                        },
                        {
                            path: 'Systems',
                            model: 'systems'
                        }
                    ]
                }
            })
            .populate('subjects') // bu Test modelidagi field bo‘lsa
            .populate('sytems') // agar to‘g‘ri nomlangan bo‘lsa
            .lean();

        if (!tests || tests.length === 0) {
            return res.status(404).json({ success: false, message: "Test topilmadi" });
        }

        // 2. Har bir test uchun resultlarni olish va testga biriktirish
        const testsWithResults = await Promise.all(
            tests.map(async (test) => {
                const results = await Result.find({ test: test._id }).lean();
                return { ...test, results };
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
                // questions: processedQuestions
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
        console.log(status)
        console.log(id)

        await Test.findByIdAndUpdate(id, { status })

        res.json({ success: true, message: "Test status yangilandi" });
    } catch (error) {
        console.error("Status update xatolik:", error);
        res.status(500).json({ message: "Server xatoligi", error });
    }
};

exports.updateMarkStatus = async (req, res) => {
    try {
        const { testId, questionId } = req.params;
        const { mark } = req.body;

        const update = await OneTest.findOneAndUpdate({ test: testId }, { mark: mark })

        res.status(200).json({
            success: true,
            message: `Question ${mark ? 'marked' : 'unmarked'} successfully`,
        });
    } catch (error) {
        console.error('Mark update error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};