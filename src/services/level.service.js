const { Level } = require("../models");
const fs = require("fs");
const path = require("path");

exports.createLevel = async (data, file) => {
    const photo = file?.filename || '';
    return await Level.create({ ...data, photo });
};

exports.getAllLevels = async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const total = await Level.countDocuments();
    const levels = await Level.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    return {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
        items: levels
    };
};


exports.getLevelById = async (id) => {
    return await Level.findById(id);
};

exports.updateLevel = async (id, data, file) => {
    const level = await Level.findById(id);
    if (!level) return null;

    if (file) {
        if (level.photo) {
            fs.unlinkSync(path.join('uploads', level.photo));
        }
        level.photo = file.filename;
    }

    level.nameEn = data.nameEn || level.nameEn;
    level.nameUz = data.nameUz || level.nameUz;
    level.preccent = data.preccent || level.preccent;
    level.descriptionEn = data.descriptionEn || level.descriptionEn;
    level.descriptionUz = data.descriptionUz || level.descriptionUz;
    level.updatedAt = Date.now();

    return await level.save();
};

exports.deleteLevel = async (id) => {
    const level = await Level.findById(id);
    if (!level) return null;

    if (level.photo) {
        fs.unlinkSync(path.join('uploads', level.photo));
    }

    return await Level.findByIdAndDelete(id);
};
