const { Schema, model } = require("mongoose");
const { schemaOptions } = require("./ModelOptions");

const usersSchema = new Schema({
    photo: {
        type: String,
        default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    }, 
    name: {
        type: String,
        required: true,
    }, 
    username: {
        type: String,
        required: true,
        unique: true,
    }, 
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    }, 
    email: {
        type: String,
        required: true,
        unique: true,
    }, 
    country: {
        type: String,
        required: true,
    }, 
    password: {
        type: String,
        required: true,
    }, 
    isActive: {
        type: Boolean,
        default: true,
    }, 
    plan: {
        type: Schema.Types.ObjectId,
        ref: 'plan',
    }, 
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    // Kalendar va imtihon sanasi maydonlari
    examDate: {
        type: Date,
        default: null
    },
    studyGoals: {
        dailyQuestions: {
            type: Number,
            default: 50
        },
        weeklyGoal: {
            type: Number,
            default: 350
        },
        targetScore: {
            type: Number,
            default: 220
        }
    },
    preferences: {
        restDays: [{
            type: Number, // 0-6 (0=Yakshanba, 1=Dushanba, ...)
            default: [0] // Yakshanba dam olish
        }],
        studyHoursPerDay: {
            type: Number,
            default: 4
        },
        reminderTime: {
            type: String,
            default: '09:00'
        },
        language: {
            type: String,
            enum: ['uz', 'en', 'ru'],
            default: 'uz'
        },
        theme: {
            type: String,
            enum: ['light', 'dark'],
            default: 'dark'
        }
    },
    // Statistika maydonlari
    statistics: {
        totalCorrect: { type: Number, default: 0 },
        totalIncorrect: { type: Number, default: 0 },
        totalOmitted: { type: Number, default: 0 },
        usedQuestions: { type: Number, default: 0 },
        testsCompleted: { type: Number, default: 0 },
        testsCreated: { type: Number, default: 0 },
        suspendedTests: { type: Number, default: 0 },
        totalScore: { type: Number, default: 0 },
        currentStreak: { type: Number, default: 0 },
        averageScore: { type: Number, default: 0 },
        rank: { type: Number, default: 0 },
        percentileRank: { type: Number, default: 0 },
        lastTestDate: { type: Date, default: null },
        studyDaysCompleted: { type: Number, default: 0 },
        totalStudyTime: { type: Number, default: 0 }, // minutes
        consecutiveStudyDays: { type: Number, default: 0 },
        lastStudyDate: { type: Date, default: null }
    },
    // Imtihon tayyorgarlik ma'lumotlari
    examPreparation: {
        startDate: { type: Date, default: null },
        targetExamDate: { type: Date, default: null },
        totalQuestionsTarget: { type: Number, default: 3600 },
        questionsCompleted: { type: Number, default: 0 },
        completionPercentage: { type: Number, default: 0 },
        estimatedReadinessDate: { type: Date, default: null },
        preparationStatus: {
            type: String,
            enum: ['not_started', 'in_progress', 'on_track', 'behind_schedule', 'ahead_of_schedule', 'completed'],
            default: 'not_started'
        }
    },
    // Yutuqlar va motivatsiya
    achievements: [{
        type: {
            type: String,
            enum: ['first_test', 'perfect_score', 'streak_3', 'streak_7', 'streak_30', 'complete_100', 'complete_500', 'complete_1000', 'early_bird', 'night_owl']
        },
        earnedAt: { type: Date, default: Date.now },
        title: String,
        description: String
    }],
    // Eslatmalar va bildirishnomalar
    notifications: {
        dailyReminder: { type: Boolean, default: true },
        weeklyProgress: { type: Boolean, default: true },
        achievementNotification: { type: Boolean, default: true },
        examDeadlineReminder: { type: Boolean, default: true },
        emailNotifications: { type: Boolean, default: false },
        smsNotifications: { type: Boolean, default: false }
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }, 
    createdAt: {
        type: Date,
        default: Date.now
    }
}, schemaOptions);

// Indexlar qo'shish
usersSchema.index({ username: 1 });
usersSchema.index({ email: 1 });
usersSchema.index({ phoneNumber: 1 });
usersSchema.index({ examDate: 1 });
usersSchema.index({ 'statistics.rank': -1 });
usersSchema.index({ 'statistics.percentileRank': -1 });

// Virtual fieldlar
usersSchema.virtual('fullName').get(function() {
    return this.name;
});

usersSchema.virtual('questionsRemaining').get(function() {
    return Math.max(0, this.examPreparation.totalQuestionsTarget - this.examPreparation.questionsCompleted);
});

usersSchema.virtual('daysUntilExam').get(function() {
    if (!this.examDate) return null;
    const today = new Date();
    const examDate = new Date(this.examDate);
    const diffTime = examDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Pre-save middleware
usersSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    
    // Completion percentage hisoblash
    if (this.examPreparation.totalQuestionsTarget > 0) {
        this.examPreparation.completionPercentage = Math.round(
            (this.examPreparation.questionsCompleted / this.examPreparation.totalQuestionsTarget) * 100
        );
    }
    
    // Average score hisoblash
    if (this.statistics.testsCompleted > 0) {
        this.statistics.averageScore = Math.round(
            this.statistics.totalScore / this.statistics.testsCompleted
        );
    }
    
    next();
});

// Instance methods
usersSchema.methods.updateStatistics = function(testResult) {
    this.statistics.totalCorrect += testResult.correct || 0;
    this.statistics.totalIncorrect += testResult.incorrect || 0;
    this.statistics.totalOmitted += testResult.omitted || 0;
    this.statistics.usedQuestions += testResult.totalQuestions || 0;
    this.statistics.testsCompleted += 1;
    this.statistics.totalScore += testResult.score || 0;
    this.statistics.lastTestDate = new Date();
    
    // Streak hesablash
    const today = new Date();
    const lastTest = this.statistics.lastTestDate;
    if (lastTest && this.isSameDay(today, lastTest)) {
        // Bugun test yechgan
        this.statistics.currentStreak += 1;
    } else if (!lastTest || !this.isConsecutiveDay(today, lastTest)) {
        // Streak uzilgan
        this.statistics.currentStreak = 1;
    }
    
    return this.save();
};

usersSchema.methods.isSameDay = function(date1, date2) {
    return date1.toDateString() === date2.toDateString();
};

usersSchema.methods.isConsecutiveDay = function(date1, date2) {
    const diffTime = Math.abs(date1 - date2);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1;
};

module.exports = model('users', usersSchema);