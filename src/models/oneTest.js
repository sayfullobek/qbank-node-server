const { Schema, model } = require("mongoose");
const { schemaOptions } = require("./ModelOptions"); // Noto‘g‘ri yo‘l to‘g‘irlandi

const oneTestSchema = new Schema({
    question: {
        type: Schema.Types.ObjectId,
        ref: 'questions',
        required: true
    }, test: {
        type: Schema.Types.ObjectId,
        ref: "Test",
        required: true
    }, isCorrect: {
        type: Boolean,
        required: true,
    }, answer: {
        uz: {
            type: String,
            required: true,
        },
        en: {
            type: String,
            required: true
        }
    },
}, schemaOptions);

module.exports = model('OneTest', oneTestSchema);