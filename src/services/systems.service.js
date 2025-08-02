const { Systems, Questions } = require("../models");

exports.createSystem = async (data) => {
    return await Systems.create(data);
};

exports.getAllSystems = async ({ page = 1, limit = 10 }) => {
    const skip = (page - 1) * limit;

    const [systems, total] = await Promise.all([
        Systems.find().skip(skip).limit(limit),
        Systems.countDocuments()
    ]);
    const que = await Questions.find()

    console.log(que)


    // Har bir systemga tegishli questionlarni olish
    const systemsWithQuestions = await Promise.all(
        systems.map(async (system) => {
            const questions = await Questions.find({
                Systems: { $in: [system._id] }
            });


            console.log(questions)
            return {
                ...system.toObject(),
                questions
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

exports.getSystemById = async (id) => {
    return await Systems.findById(id);
};

exports.updateSystem = async (id, data) => {
    return await Systems.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteSystem = async (id) => {
    return await Systems.findByIdAndDelete(id);
};
