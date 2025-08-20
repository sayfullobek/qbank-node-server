const { Schema, model } = require("mongoose");
const { schemaOptions } = require("./ModelOptions");

const oneTestSchema = new Schema({
    question: {
        type: Schema.Types.ObjectId,
        ref: 'questions',
        required: true
    }, 
    user: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
    }, 
    test: {
        type: Schema.Types.ObjectId,
        ref: "Test",
        required: true
    }, 
    isCorrect: {
        type: Boolean,
    }, 
    answer: {
        uz: {
            type: String,
        },
        en: {
            type: String,
        }
    },
    mark: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
    },
    questionBank: { 
        type: String 
    },
    // Statistika uchun yangi maydonlar
    timeSpent: {
        type: Number, // sekundlarda
        default: 0
    },
    answerChanges: [{
        from: String,
        to: String,
        timestamp: { type: Date, default: Date.now }
    }],
    // Answer change tracking
    originalAnswer: {
        uz: String,
        en: String
    },
    finalAnswer: {
        uz: String,
        en: String
    }
}, schemaOptions);

module.exports = model('OneTest', oneTestSchema);