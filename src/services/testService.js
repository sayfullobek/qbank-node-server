const { Test } = require("../models");

exports.createTest = async (data) => {
    const newTest = await Test.create(data);
    return newTest;
};

exports.getAllTests = async (userId) => {
    return await Test.find({ user: userId })
        .populate('subjects')
        .populate('sytems'); // Note: typo in "sytems" in schema; consider fixing to "systems"
};

exports.getTestById = async (id) => {
    return await Test.findById(id)
        .populate('user')
        .populate('subjects')
        .populate('sytems');
};
