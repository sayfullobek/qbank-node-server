const { Test, Questions, OneTest, Result } = require('../models');
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
        const { questionId, isCorrect, answer } = req.body;
        const { testId } = req.params
        // 2. Test hujjatini olish
        const test = await Test.findById(testId).populate("oneTests");

        if (!test) {
            return res.status(404).json({ message: "Test topilmadi" });
        }

        const isExist = await OneTest.findOne({
            _id: { $in: test.oneTests },
            question: questionId
        });

        if (isExist) {
            return res.status(400).json({ message: "Bu OneTest allaqachon testga qo‘shilgan" });
        }
        const newOneTest = await OneTest.create({
            question: questionId,
            test: testId,
            isCorrect: isCorrect,
            answer
        });

        // 4. oneTests massiviga yangi OneTest `_id` ni qo‘shish
        test.oneTests.push(newOneTest._id);
        await test.save();

        res.status(201).json({
            success: true,
            message: "OneTest yaratildi va Testga muvaffaqiyatli qo‘shildi",
            oneTest: newOneTest,
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
            .populate("subjects")
            .populate("sytems") // Ehtimol sizda typo: sytems -> systems?
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

        console.log(testsWithResults)

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

        console.log(isExist)

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

