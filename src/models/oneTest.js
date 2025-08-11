const { Schema, model } = require("mongoose");
const { schemaOptions } = require("./ModelOptions"); // Noto‘g‘ri yo‘l to‘g‘irlandi

const oneTestSchema = new Schema({
    question: {
        type: Schema.Types.ObjectId,
        ref: 'questions',
        required: true
    }, user: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
    }, test: {
        type: Schema.Types.ObjectId,
        ref: "Test",
        required: true
    }, isCorrect: {
        type: Boolean,
    }, answer: {
        uz: {
            type: String,
            // required: true,
        },
        en: {
            type: String,
            // required: true
        }
    },
    mark: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
    }
}, schemaOptions);

module.exports = model('OneTest', oneTestSchema);