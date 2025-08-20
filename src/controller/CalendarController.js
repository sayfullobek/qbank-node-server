// To'g'ri import yo'li - users.js fayli uchun
const User = require('../models/users');

// StudyPlan va DailyProgress modellarini vaqtincha comment qilamiz
// const StudyPlan = require('../models/StudyPlan');
// const DailyProgress = require('../models/DailyProgress');

class CalendarController {
  // Imtihon sanasini saqlash
  static async saveExamDate(req, res) {
    try {
      const { exam_date } = req.body;
      const userId = req.user.id;

      if (!exam_date) {
        return res.status(400).json({
          success: false,
          message: 'Imtihon sanasi kiritilmagan'
        });
      }

      // Sanani validatsiya qilish
      const examDate = new Date(exam_date);
      const today = new Date();
      
      if (examDate <= today) {
        return res.status(400).json({
          success: false,
          message: 'Imtihon sanasi bugundan keyin bo\'lishi kerak'
        });
      }

      // User modelini yangilash
      const updatedUser = await User.findByIdAndUpdate(userId, {
        examDate: examDate,
        'examPreparation.targetExamDate': examDate,
        'examPreparation.startDate': new Date(),
        'examPreparation.preparationStatus': 'in_progress',
        updatedAt: new Date()
      }, { new: true });

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: 'Foydalanuvchi topilmadi'
        });
      }

      res.json({
        success: true,
        message: 'Imtihon sanasi muvaffaqiyatli saqlandi',
        examDate: examDate,
        examPreparation: updatedUser.examPreparation
      });

    } catch (error) {
      console.error('Save exam date error:', error);
      res.status(500).json({
        success: false,
        message: 'Server xatosi: ' + error.message
      });
    }
  }

  // Imtihon sanasini olish
  static async getExamDate(req, res) {
    try {
      const userId = req.user.id;
      
      const user = await User.findById(userId).select('examDate examPreparation');
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Foydalanuvchi topilmadi'
        });
      }

      res.json({
        success: true,
        examDate: user.examDate,
        examPreparation: user.examPreparation
      });

    } catch (error) {
      console.error('Get exam date error:', error);
      res.status(500).json({
        success: false,
        message: 'Server xatosi: ' + error.message
      });
    }
  }

  // O'quv rejasini olish (StudyPlan modeli yo'q paytda oddiy versiya)
  static async getStudyPlan(req, res) {
    try {
      const userId = req.user.id;
      
      const user = await User.findById(userId).select('examDate examPreparation statistics');
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Foydalanuvchi topilmadi'
        });
      }

      if (!user.examDate) {
        return res.json({
          success: false,
          message: 'Imtihon sanasi belgilanmagan'
        });
      }

      // Oddiy plan yaratish
      const today = new Date();
      const examDate = new Date(user.examDate);
      const daysUntilExam = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
      const TOTAL_QUESTIONS = user.examPreparation?.totalQuestionsTarget || 3600;
      const questionsCompleted = user.examPreparation?.questionsCompleted || 0;
      const questionsRemaining = TOTAL_QUESTIONS - questionsCompleted;
      const questionsPerDay = daysUntilExam > 0 ? Math.ceil(questionsRemaining / daysUntilExam) : 0;

      // Kunlik reja yaratish
      const dailyPlan = [];
      const planDate = new Date(today);
      
      for (let i = 0; i < Math.min(daysUntilExam, 30); i++) { // 30 kun uchun plan
        const isRestDay = planDate.getDay() === 0; // Yakshanba
        dailyPlan.push({
          date: new Date(planDate),
          day: planDate.getDate(),
          month: planDate.getMonth(),
          year: planDate.getFullYear(),
          isRestDay,
          questionsTarget: isRestDay ? 0 : questionsPerDay,
          isCompleted: false
        });
        planDate.setDate(planDate.getDate() + 1);
      }

      res.json({
        success: true,
        studyPlan: {
          daysUntilExam,
          questionsPerDay,
          totalQuestions: TOTAL_QUESTIONS,
          questionsCompleted,
          questionsRemaining,
          examDate: user.examDate,
          dailyPlan
        },
        examPreparation: user.examPreparation
      });

    } catch (error) {
      console.error('Get study plan error:', error);
      res.status(500).json({
        success: false,
        message: 'Server xatosi: ' + error.message
      });
    }
  }

  // Foydalanuvchi harakatlarini olish
  static async getProgress(req, res) {
    try {
      const userId = req.user.id;
      
      const user = await User.findById(userId).select('statistics examPreparation examDate name');
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Foydalanuvchi topilmadi'
        });
      }

      // Hisob-kitoblar
      const completionPercentage = user.examPreparation?.totalQuestionsTarget > 0 ? 
        Math.round((user.examPreparation.questionsCompleted / user.examPreparation.totalQuestionsTarget) * 100) : 0;

      res.json({
        success: true,
        user: {
          name: user.name,
          examDate: user.examDate
        },
        statistics: user.statistics,
        examPreparation: {
          ...user.examPreparation,
          completionPercentage
        }
      });

    } catch (error) {
      console.error('Get progress error:', error);
      res.status(500).json({
        success: false,
        message: 'Server xatosi: ' + error.message
      });
    }
  }

  // Kunlik vazifani tugatish
  static async completeDailyTask(req, res) {
    try {
      const userId = req.user.id;
      const { date, questionsCompleted, timeSpent = 0 } = req.body;

      if (!date || questionsCompleted === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Sana va savol soni kiritilmagan'
        });
      }

      // User ni topish va yangilash
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Foydalanuvchi topilmadi'
        });
      }

      // Statistikalarni yangilash
      user.statistics.studyDaysCompleted += 1;
      user.statistics.totalStudyTime += timeSpent;
      user.statistics.lastStudyDate = new Date();
      
      // Exam preparation ni yangilash
      user.examPreparation.questionsCompleted += questionsCompleted;
      
      // Completion percentage hisoblash
      if (user.examPreparation.totalQuestionsTarget > 0) {
        user.examPreparation.completionPercentage = Math.round(
          (user.examPreparation.questionsCompleted / user.examPreparation.totalQuestionsTarget) * 100
        );
      }

      await user.save();

      res.json({
        success: true,
        message: 'Kunlik vazifa muvaffaqiyatli tugallandi',
        data: {
          questionsCompleted,
          totalCompleted: user.examPreparation.questionsCompleted,
          completionPercentage: user.examPreparation.completionPercentage,
          studyDaysCompleted: user.statistics.studyDaysCompleted
        }
      });

    } catch (error) {
      console.error('Complete daily task error:', error);
      res.status(500).json({
        success: false,
        message: 'Server xatosi: ' + error.message
      });
    }
  }

  // Haftalik hisobot olish
  static async getWeeklyReport(req, res) {
    try {
      const userId = req.user.id;
      
      const user = await User.findById(userId).select('statistics examPreparation examDate name');
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Foydalanuvchi topilmadi'
        });
      }

      // Hafta boshlang'ich va oxirgi sanalarini hisoblash
      const today = new Date();
      const currentDay = today.getDay();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - currentDay);
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      res.json({
        success: true,
        weeklyReport: {
          weekStart,
          weekEnd,
          userStatistics: user.statistics,
          examPreparation: user.examPreparation,
          user: {
            name: user.name,
            examDate: user.examDate
          }
        }
      });

    } catch (error) {
      console.error('Get weekly report error:', error);
      res.status(500).json({
        success: false,
        message: 'Server xatosi: ' + error.message
      });
    }
  }
}

module.exports = CalendarController;