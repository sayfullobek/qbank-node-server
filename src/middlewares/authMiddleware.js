const User = require('../models/users');

const authMiddleware = async (req, res, next) => {
  try {
    // 1. Session dan user ID olish (agar session ishlatilsa)
    let userId = req.session?.userId;
    
    // 2. Yoki cookie dan user ID olish
    if (!userId) {
      userId = req.cookies?.userId;
    }
    
    // 3. Yoki header dan user ID olish (development uchun)
    if (!userId) {
      userId = req.headers['x-user-id'];
    }

    // 4. Agar hech qaysi yo'l bilan user ID topilmasa
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Tizimga kirish talab qilinadi'
      });
    }

    // 5. Database dan foydalanuvchini topish
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Foydalanuvchi topilmadi'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Hisobingiz faol emas'
      });
    }

    // 6. req.user ga foydalanuvchi ma'lumotlarini qo'shish
    req.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
};

module.exports = authMiddleware;