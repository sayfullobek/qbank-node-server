const mongoose = require("mongoose");

const markedQuestionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "questions",
        required: true
    },
    testId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "test",
        required: false
    }
}, {
    timestamps: true
});

// Create compound index for better performance and uniqueness
markedQuestionSchema.index({ userId: 1, questionId: 1 }, { unique: true });

module.exports = mongoose.model("MarkedQuestions", markedQuestionSchema);