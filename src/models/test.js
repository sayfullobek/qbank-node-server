const mongoose = require("mongoose")

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
    }
})

module.exports = mongoose.model("Test", testSchema)