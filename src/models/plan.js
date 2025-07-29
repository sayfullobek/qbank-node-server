const { Schema, model } = require("mongoose");
const { schemaOptions } = require("./ModelOptions"); // Noto‘g‘ri yo‘l to‘g‘irlandi

const planSchema = new Schema({
    nameEn: {
        type: String,
        required: true,
        unique: true
    }, nameUz: {
        type: String,
        required: true,
        unique: true
    }, price: {
        type: Number,
        required: true,
    }, whenMonth: {
        type: Number,
        required: true,
    }, descriptionEn: {
        type: String,
        required: true,
    }, descriptionUz: {
        type: String,
        required: true,
    }, isActive: {
        type: Boolean,
        default: true,
    }, createdAt: {
        type: Date,
        default: Date.now
    }, updatedAt: {
        type: Date,
        default: Date.now
    }
}, schemaOptions);

module.exports = model('plan', planSchema);