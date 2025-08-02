const { Result } = require("../models");

exports.createResult = async (data) => {
    
    const result = new Result(data);
    return await result.save();
};

exports.getAllResults = async () => {
    return await Result.find().populate("users");
};

exports.getResultById = async (id) => {
    return await Result.findById(id).populate("users");
};

exports.updateResult = async (id, data) => {
    return await Result.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteResult = async (id) => {
    return await Result.findByIdAndDelete(id);
};
