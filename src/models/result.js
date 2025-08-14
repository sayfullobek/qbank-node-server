const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'users', 
    required: true 
  },
  test: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Test', 
    required: true 
  },
  correct: { 
    type: Number, 
    required: true 
  },
  pausedTest: {
    type: String,
  },
  error: { 
    type: Number, 
    required: true 
  },
  score: { 
    type: Number, 
    required: true 
  },
  questionBank: { type: mongoose.Schema.Types.ObjectId, ref: 'QuestionBank' },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('result', resultSchema);