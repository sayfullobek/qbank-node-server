const { Plan } = require("../models");

exports.createPlan = async (data) => {
    return await Plan.create(data);
};

exports.getAllPlans = async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const [plans, total] = await Promise.all([
        Plan.find().skip(skip).limit(limit),
        Plan.countDocuments()
    ]);
    return { items: plans, total };
};

exports.getPlanById = async (id) => {
    return await Plan.findById(id);
};

exports.updatePlan = async (id, data) => {
    return await Plan.findByIdAndUpdate(id, { ...data, updatedAt: Date.now() }, { new: true });
};

exports.deletePlan = async (id) => {
    return await Plan.findByIdAndDelete(id);
};
