const { Schema, model } = require("mongoose");
const { schemaOptions } = require("./ModelOptions"); // Noto‘g‘ri yo‘l to‘g‘irlandi

const usersSchema = new Schema({
    photo: {
        type: String,
        default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    }, name: {
        type: String,
        required: true,
    }, username: {
        type: String,
        required: true,
        unique: true,
    }, phoneNumber: {
        type: String,
        required: true,
        unique: true,
    }, email: {
        type: String,
        required: true,
        unique: true,
    }, country: {
        type: String,
        required: true,
    }, password: {
        type: String,
        required: true,
    }, isActive: {
        type: Boolean,
        default: true,
    }, plan: {
        type: Schema.Types.ObjectId,
        ref: 'plan',
    }, role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }, updatedAt: {
        type: Date,
        default: Date.now
    }, createdAt: {
        type: Date,
        default: Date.now
    }
}, schemaOptions);

module.exports = model('users', usersSchema);