const mongoose = require('mongoose');

const dailyProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  questionsCompleted: {
    type: Number,
    required: true,
    default: 0
  },
  questionsCorrect: {
    type: Number,
    default: 0
  },
  questionsIncorrect: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number, // minutes
    default: 0
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  subjects: [{
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject'
    },
    questionsAnswered: {
      type: Number,
      default: 0
    },
    correctAnswers: {
      type: Number,
      default: 0
    }
  }],
  testsSolved: [{
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Test'
    },
    score: {
      type: Number
    },
    completedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Compound index for efficient queries
dailyProgressSchema.index({ userId: 1, date: 1 }, { unique: true });
dailyProgressSchema.index({ userId: 1, completedAt: -1 });

module.exports = mongoose.model('DailyProgress', dailyProgressSchema);