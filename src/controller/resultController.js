const { Result, OneTest, Test } = require("../models");
const resultService = require("../services/resultService");

exports.createResult = async (req, res) => {
    try {
        const { userId, testId, pausedTest } = req.body;

        // Eski natijani o‘chirish
        await Result.deleteOne({ user: userId, test: testId });

        // Test hujjatini olish (umumiy savollar sonini olish uchun)
        const testDoc = await Test.findById(testId);
        if (!testDoc) {
            return res.status(404).json({
                success: false,
                message: "Test topilmadi"
            });
        }

        // 1. Userning ishlagan OneTestlarini olish
        const oneTests = await OneTest.find({ test: testId, user: userId });

        // 2. To‘g‘ri javoblar soni
        const correct = oneTests.filter(item => item.isCorrect).length;

        // 3. Noto‘g‘ri javoblar soni (umumiydan emas, ishlanganlardan)
        const error = oneTests.length - correct;

        // 4. Umumiy savollar soni testdan olinadi
        const totalQuestions = testDoc.questionCount || oneTests.length;

        // 5. Score hisoblash (foiz)
        const score = totalQuestions === 0 ? 0 : Math.round((correct / totalQuestions) * 100);

        // 6. Yangi natija yaratish
        const result = new Result({
            user: userId,
            test: testId,
            correct,
            pausedTest,
            error,
            score
        });

        const savedResult = await result.save();

        res.status(201).json({
            success: true,
            message: "Test natijalari saqlandi",
            result: savedResult
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Natijalarni saqlashda xatolik",
            error: error.message
        });
    }
};



exports.getAllResults = async (req, res) => {
    try {
        const results = await resultService.getAllResults();
        res.status(200).json({ success: true, data: results });
    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getResultById = async (req, res) => {
    try {
        const result = await Result.findById(req.params.id)
            .populate("user")
            .populate({
                path: "test",
                populate: [
                    {
                        path: "subjects",
                        model: "subjects",
                        select: "name code"
                    },
                    {
                        path: "sytems", 
                        model: "systems",
                        select: "name description"
                    },
                    {
                        path: "oneTests",
                        model: "OneTest",
                        populate: {
                            path: "question",
                            model: "questions",
                            populate: [
                                {
                                    path: "Subjects",
                                    model: "subjects",
                                    select: "name code"
                                },
                                {
                                    path: "Systems",
                                    model: "systems", 
                                    select: "name description"
                                }
                            ]
                        }
                    }
                ]
            });

        if (!result) {
            return res.status(404).json({ 
                success: false, 
                message: "Natija topilmadi" 
            });
        }

        // Extract unique subjects and systems from OneTest questions
        const uniqueSubjects = new Map();
        const uniqueSystems = new Map();
        
        if (result.test?.oneTests) {
            result.test.oneTests.forEach(oneTest => {
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

        // Prepare response data with extracted subjects and systems
        const responseData = {
            ...result.toObject(),
            test: {
                ...result.test.toObject(),
                extractedSubjects: Array.from(uniqueSubjects.values()),
                extractedSystems: Array.from(uniqueSystems.values())
            }
        };

        res.status(200).json({ 
            success: true, 
            data: responseData 
        });
        
    } catch (err) {
        console.error("getResultById error:", err);
        res.status(500).json({ 
            success: false, 
            message: err.message 
        });
    }
};

exports.getTestResultData = async (req, res) => {
    try {
        const result = await Result.findById(req.params.id)
            .populate("user")
            .populate({
                path: "test",
                populate: [
                    {
                        path: "subjects",
                        model: "subjects",
                        select: "name code"
                    },
                    {
                        path: "sytems", 
                        model: "systems",
                        select: "name description"
                    },
                    {
                        path: "oneTests",
                        model: "OneTest",
                        populate: {
                            path: "question",
                            model: "questions",
                            populate: [
                                {
                                    path: "Subjects",
                                    model: "subjects",
                                    select: "name code"
                                },
                                {
                                    path: "Systems",
                                    model: "systems", 
                                    select: "name description"
                                }
                            ]
                        }
                    }
                ]
            });

        if (!result) {
            return res.status(404).json({ 
                success: false, 
                message: "Natija topilmadi" 
            });
        }

        // Extract unique subjects and systems from OneTest questions similar to getTestByIdUser
        const uniqueSubjects = new Map();
        const uniqueSystems = new Map();
        
        if (result.test?.oneTests) {
            result.test.oneTests.forEach(oneTest => {
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

        // Prepare response data with extracted subjects and systems
        const responseData = {
            ...result.toObject(),
            test: {
                ...result.test.toObject(),
                extractedSubjects: Array.from(uniqueSubjects.values()),
                extractedSystems: Array.from(uniqueSystems.values())
            }
        };

        res.status(200).json({ 
            success: true, 
            data: responseData 
        });
        
    } catch (err) {
        console.error("getTestResultData error:", err);
        res.status(500).json({ 
            success: false, 
            message: err.message 
        });
    }
};

exports.updateResult = async (req, res) => {
    try {
        const updated = await resultService.updateResult(req.params.id, req.body);
        if (!updated) return res.status(404).json({ success: false, message: "Natija topilmadi" });
        res.status(200).json({ success: true, data: updated });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteResult = async (req, res) => {
    try {
        const deleted = await resultService.deleteResult(req.params.id);
        if (!deleted) return res.status(404).json({ success: false, message: "Natija topilmadi" });
        res.status(200).json({ success: true, message: "O‘chirildi" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
