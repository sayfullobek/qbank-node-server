const mongoose = require('mongoose');
const { PromoCode } = require('../models');

/**
 * Promo kod yaratish
 */
async function createPromoCode(data) {
    return await PromoCode.create(data);
}

/**
 * Barcha promo kodlarni olish (admin uchun)
 */
async function getAllPromoCodes() {
    return await PromoCode.find().populate('createdBy', 'fullName email');
}

/**
 * Promo kodni tekshirish va ishlatish
 */
async function applyPromoCode(code, userId) {
    const promo = await PromoCode.findOne({ code: code.toUpperCase(), isActive: true });

    if (!promo) throw new Error('Promo kod topilmadi yoki faol emas');

    const now = new Date();
    if (now < promo.validFrom || now > promo.validUntil) {
        throw new Error('Promo kod muddati tugagan yoki hali boshlanmagan');
    }

    if (promo.usedBy.includes(new mongoose.Types.ObjectId(userId))) {
        throw new Error('Siz bu promo koddan allaqachon foydalangansiz');
    }

    if (promo.usedCount >= promo.maxUsage) {
        throw new Error('Promo kod ishlatilish limiti tugagan');
    }

    // Ishlatish
    promo.usedBy.push(userId);
    promo.usedCount += 1;
    await promo.save();

    return {
        discountType: promo.discountType,
        discountValue: promo.discountValue,
        message: 'Promo kod muvaffaqiyatli qo‘llandi'
    };
}

module.exports = {
    createPromoCode,
    getAllPromoCodes,
    applyPromoCode
};
