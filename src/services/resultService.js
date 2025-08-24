const { Result } = require("../models");

exports.createResult = async (data) => {
    
    const result = new Result(data);
    return await result.save();
};

exports.getAllResults = async () => {
    return await Result.find().populate("user");
};

exports.getResultById = async (id) => {
    return await Result.findById(id)
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
};

exports.updateResult = async (id, data) => {
    return await Result.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteResult = async (id) => {
    return await Result.findByIdAndDelete(id);
};
