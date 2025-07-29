const { Schema, model } = require("mongoose");
const { schemaOptions } = require("./ModelOptions"); // Noto‘g‘ri yo‘l to‘g‘irlandi

const levelSchema = new Schema({
    photo: { //ramkasi pubgnikiday
        type: String,
        required: true,
    }, nameEn: {
        type: String,
        required: true,
        unique: true
    }, nameUz: {
        type: String,
        required: true,
        unique: true
    }, preccent: { //foizi
        type: Number,
        required: true,
    }, descriptionEn: {
        type: String,
        required: true,
    }, descriptionUz: {
        type: String,
        required: true,
    }, createdAt: {
        type: Date,
        default: Date.now
    }, updatedAt: {
        type: Date,
        default: Date.now
    }
}, schemaOptions);

module.exports = model('level', levelSchema);