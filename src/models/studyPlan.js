const mongoose = require('mongoose');

const studyPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  dayNumber: {
    type: Number,
    required: true
  },
  questionsTarget: {
    type: Number,
    required: true,
    default: 0
  },
  questionsCompleted: {
    type: Number,
    default: 0
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  isRestDay: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
studyPlanSchema.index({ userId: 1, date: 1 }, { unique: true });
studyPlanSchema.index({ userId: 1, isCompleted: 1 });

module.exports = mongoose.model('StudyPlan', studyPlanSchema);