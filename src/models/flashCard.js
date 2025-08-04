const mongoose = require("mongoose")

const flashCardSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    front: {
        type: String,
        required: true
    },
    photo: {
        type: String,
    },
    back: {
        type: String,
        required: true
    },
    backPhoto: {
        type: String,
    },
    subject: {
        type: String,
    },
    system: {
        type: String,
    },
    subcategory: {
        type: String
    }
})

module.exports = mongoose.model("flashCard", flashCardSchema)