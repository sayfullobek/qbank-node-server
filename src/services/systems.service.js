const { Systems } = require("../models");

exports.createSystem = async (data) => {
    return await Systems.create(data);
};

exports.getAllSystems = async ({ page = 1, limit = 10 }) => {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
        Systems.find().skip(skip).limit(limit),
        Systems.countDocuments(),
    ]);

    return {
        items,
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
