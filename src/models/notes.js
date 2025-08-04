const mongoose = require("mongoose")

const notesSchema = new mongoose.Schema({
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "questions",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    notes: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Notes", notesSchema)