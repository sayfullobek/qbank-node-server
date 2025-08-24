const mongoose = require("mongoose")

const highlightSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    color: {
        type: String,
        enum: ['yellow', 'green', 'cyan', 'red'],
        default: 'yellow'
    },
    containerId: {
        type: String,
        required: true
    }
})

const highlightsSchema = new mongoose.Schema({
    testId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "test",
        required: true
    },
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "questions",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    highlights: [highlightSchema]
}, {
    timestamps: true
})

// Create compound index for better performance
highlightsSchema.index({ testId: 1, questionId: 1, userId: 1 }, { unique: true })

module.exports = mongoose.model("Highlights", highlightsSchema)