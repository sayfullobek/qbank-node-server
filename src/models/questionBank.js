const mongoose = require('mongoose');

const questionBankSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Masalan: UWorld
    step: { type: Number, enum: [1, 2, 3], required: true }, // Step 1, Step 2, Step 3
    totalQuestions: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('QuestionBank', questionBankSchema);
