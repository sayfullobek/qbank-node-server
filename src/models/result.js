const { Schema, model } = require("mongoose");
const { schemaOptions } = require("./ModelOptions"); // Noto‘g‘ri yo‘l to‘g‘irlandi

const resultSchema = new Schema({
    users: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }, correct: {
        type: Number,
        required: true,
    }, error: {
        type: Number,
        required: true,
    }, score: {
        type: Number,
        required: true,
    }, createdAt: {
        type: Date,
        default: Date.now
    }, updatedAt: {
        type: Date,
        default: Date.now
    }
}, schemaOptions);

module.exports = model('result', resultSchema);