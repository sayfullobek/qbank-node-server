const mongoose = require('mongoose');
const { PromoCode, Users } = require('../models');

/**
 * Promo kod yaratish
 */
async function createPromoCode(data) {
    return await PromoCode.create(data);
}

async function updatePromoCode(id, data) {
    return await PromoCode.findByIdAndUpdate(id, data);
}

/**
 * Barcha promo kodlarni olish (admin uchun)
 */
async function getAllPromoCodes() {
    return await PromoCode.find().populate('createdBy', 'fullName email');
}

async function getByIdPromoCodes(id) {
    return await PromoCode.findById(id).populate('createdBy', 'fullName email');
}
/**
 * Promo kodni tekshirish va ishlatish
 */
async function applyPromoCode(code, userId) {
    const promo = await PromoCode.findOne({
        code: code.toUpperCase(),
        isActive: true,
        validUntil: { $gte: new Date() } // Faqat amal muddati tugamagan kodlar
    });

    if (!promo) throw new Error('Promo kod topilmadi, faol emas yoki muddati tugagan');

    // Foydalanuvchi allaqachon bu kodni ishlatganligini tekshirish
    if (promo.usedBy.some(id => id.equals(userId))) {
        throw new Error('Siz bu promo koddan allaqachon foydalangansiz');
    }

    if (promo.usedCount >= promo.maxUsage) {
        throw new Error('Promo kod ishlatilish limiti tugagan');
    }

    // Foydalanuvchini topish va yangilash
    const user = await Users.findById(userId);
    if (!user) throw new Error('Foydalanuvchi topilmadi');

    // Yangi testExpireAt sanasini hisoblash
    let newExpireDate = new Date();

    // Agar avvaldan testExpireAt bo'lsa, undan boshlaymiz
    if (user.testExpireAt && new Date(user.testExpireAt) > newExpireDate) {
        newExpireDate = new Date(user.testExpireAt);
    }

    // Promo kodning discountValue miqdorida kun qo'shamiz
    newExpireDate.setDate(newExpireDate.getDate() + promo.discountValue);

    // Foydalanuvchini yangilash
    user.testExpireAt = newExpireDate;
    await user.save();

    // Promo kodni yangilash (ishlatilganligini belgilash)
    promo.usedBy.push(userId);
    promo.usedCount += 1;
    await promo.save();

    return {
        discountValue: promo.discountValue,
        newExpireDate: newExpireDate,
        message: `Promo kod muvaffaqiyatli qo'llandi! ${promo.discountValue} kun qo'shildi. Yangi test muddati: ${newExpireDate.toLocaleDateString()}`
    };
}

module.exports = {
    createPromoCode,
    getAllPromoCodes,
    applyPromoCode,
    updatePromoCode,
    getByIdPromoCodes
};
