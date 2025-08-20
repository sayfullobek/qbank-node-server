const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "Users"
    },
    testName: {
        type: String,
        required: true
    },
    subjects: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "subjects"
        }
    ],
    sytems: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "systems"
        }
    ],
    questionCount: {
        type: Number,
        required: true
    },
    randomTest: [
        {
            type: String
        }
    ],
    oneTests: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "OneTest"
        }
    ],
    minutes: {
        type: Number,
        required: true,
        default: 29,
    },
    seconds: {
        type: Number,
        required: true,
        default: 60,
    },
    // Oldingi pausedTest o'rniga status
    status: {
        type: String,
        enum: ["in-progress", "paused", "finished", "suspended"],
        default: "in-progress"
    },
    // Statistika uchun yangi maydonlar
    score: {
        type: Number,
        default: 0
    },
    maxScore: {
        type: Number,
        default: 0
    },
    duration: {
        type: String,
        default: function() {
            return `${this.minutes} daqiqa`;
        }
    },
    completedAt: {
        type: Date,
        default: null
    },
    // Test natijalarini saqlash uchun
    results: {
        correctAnswers: { type: Number, default: 0 },
        incorrectAnswers: { type: Number, default: 0 },
        omittedAnswers: { type: Number, default: 0 },
        totalQuestions: { type: Number, default: 0 },
        timeSpent: { type: Number, default: 0 }, // sekundlarda
        answerChanges: [{
            questionId: String,
            from: String,
            to: String,
            timestamp: { type: Date, default: Date.now }
        }]
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Test", testSchema);