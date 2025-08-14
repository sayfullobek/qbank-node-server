const { Systems, Questions, Result } = require("../models");

exports.createSystem = async (data) => {
    return await Systems.create(data);
};

exports.getAllSystems = async ({ page = 1, limit = 10, userId }) => {
    const skip = (page - 1) * limit;

    // 1. Barcha systemlarni olish
    const [systems, total] = await Promise.all([
        Systems.find().skip(skip).limit(limit),
        Systems.countDocuments()
    ]);

    // 2. User ishlagan test natijalarini olish
    const results = await Result.find({ user: userId })
        .populate({
            path: "test",
            populate: {
                path: "oneTests",
                populate: { path: "question" }
            }
        });

    // 3. User ishlagan savollarni Map qilib olish
    const userQuestionStatus = new Map(); // questionId => { isCorrect: bool }

    results.forEach(result => {
        if (result.test?.oneTests) {
            result.test.oneTests.forEach(oneTest => {
                console.log(oneTest.question)
                userQuestionStatus.set(
                    oneTest.question?._id?.toString(),
                    { isCorrect: oneTest.isCorrect }
                );
            });
        }
    });

    // 4. Har bir system uchun savollarni va flaglarni tayyorlash
    const systemsWithQuestions = await Promise.all(
        systems.map(async (system) => {
            const questions = await Questions.find({
                Systems: { $in: [system._id] }
            });

            const questionsWithFlags = questions.map(q => {
                const status = userQuestionStatus.get(q._id.toString());

                return {
                    ...q.toObject(),
                    scoringOptions: {
                        all: true,
                        correct: status?.isCorrect === true,
                        incorrect: status?.isCorrect === false,
                        unprocessed: !status, // ishlanmagan
                    }
                };
            });

            return {
                ...system.toObject(),
                questions: questionsWithFlags
            };
        })
    );

    return {
        items: systemsWithQuestions,
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit),
    };
};
// exports.getAllSystems = async ({ page = 1, limit = 10, userId }) => {
//     const skip = (page - 1) * limit;

//     // 1. Barcha systemlarni olish
//     const [systems, total] = await Promise.all([
//         Systems.find().skip(skip).limit(limit),
//         Systems.countDocuments()
//     ]);

//     // 2. User ishlagan test natijalarini olish
//     const results = await Result.find({ user: userId })
//         .populate({
//             path: "test",
//             populate: {
//                 path: "oneTests",
//                 populate: { path: "question" }
//             }
//         });



//     // 3. User ishlagan savollarni Map qilib olish
//     const userQuestionStatus = new Map(); // questionId => { isCorrect: bool }

//     results.forEach(result => {
//         // console.log(result.test.oneTests)
//         if (result.test?.oneTests) {
//             result.test.oneTests.forEach(oneTest => {
//                 userQuestionStatus.set(
//                     oneTest.question._id.toString(),
//                     { isCorrect: oneTest.isCorrect }
//                 );
//             });
//         }
//     });

//     // 4. Har bir system uchun savollarni va flaglarni tayyorlash
//     const systemsWithQuestions = await Promise.all(
//         systems.map(async (system) => {
//             const questions = await Questions.find({
//                 Systems: { $in: [system._id] }
//             });

//             const questionsWithFlags = questions.map(q => {
//                 const status = userQuestionStatus.get(q._id.toString());

//                 return {
//                     ...q.toObject(),
//                     scoringOptions: {
//                         all: true,
//                         correct: status?.isCorrect === true,
//                         incorrect: status?.isCorrect === false,
//                         unprocessed: !status, // ishlanmagan
//                     }
//                 };
//             });


//             return {
//                 ...system.toObject(),
//                 questions: questionsWithFlags
//             };
//         })
//     );


//     return {
//         items: systemsWithQuestions,
//         total,
//         page: Number(page),
//         limit: Number(limit),
//         pages: Math.ceil(total / limit),
//     };
// };


exports.getSystemById = async (id) => {
    return await Systems.findById(id);
};

exports.updateSystem = async (id, data) => {
    return await Systems.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteSystem = async (id) => {
    return await Systems.findByIdAndDelete(id);
};
