const { Subjects } = require("../models");

exports.createSubject = async (data) => {
    return await Subjects.create(data);
};

exports.getAllSubjects = async ({ page = 1, limit = 10 }) => {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
        Subjects.find().skip(skip).limit(limit),
        Subjects.countDocuments(),
    ]);

    return {
        items,
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
