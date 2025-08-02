const { Subjects, Questions } = require("../models");

exports.createSubject = async (data) => {
    return await Subjects.create(data);
};

exports.getAllSubjects = async ({ page = 1, limit = 10 }) => {
    const skip = (page - 1) * limit;

    const [subjects, total] = await Promise.all([
        Subjects.find().skip(skip).limit(limit),
        Subjects.countDocuments(),
    ]);

    const all = await Questions.find()

    console.log(all)

    // Har bir subjectga tegishli questionlarni olish
    const subjectsWithQuestions = await Promise.all(
        subjects.map(async (subject) => {
            const questions = await Questions.find({
                Subjects: { $in: [subject._id] } // subject key bo‘yicha filter
            });

            console.log(questions)

            return {
                ...subject.toObject(),
                questions,
            };
        })
    );

    return {
        items: subjectsWithQuestions,
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit),
    };
};


exports.getSubjectById = async (id) => {
    return await Subjects.findById(id);
};

exports.updateSubject = async (id, data) => {
    return await Subjects.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteSubject = async (id) => {
    return await Subjects.findByIdAndDelete(id);
};
