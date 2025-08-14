const mongoose = require('mongoose');

const userQBankProgressSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    questionBank: { type: mongoose.Schema.Types.ObjectId, ref: 'QuestionBank', required: true },
    usedQuestions: { type: Number, default: 0 },
    usedPercentage: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('UserQBankProgress', userQBankProgressSchema);