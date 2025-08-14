const promoCodeService = require('../services/promoCodeService');

/**
 * Promo kod yaratish (admin)
 */
exports.createPromoCode = async (req, res) => {
    try {
        const data = {
            ...req.body,
            createdBy: req.user._id // middleware orqali kelgan admin user
        };
        const promoCode = await promoCodeService.createPromoCode(data);
        res.status(201).json({ success: true, data: promoCode });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

/**
 * Barcha promo kodlarni olish
 */
exports.getAllPromoCodes = async (req, res) => {
    try {
        const promoCodes = await promoCodeService.getAllPromoCodes();
        res.status(200).json({ success: true, data: promoCodes });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

/**
 * Promo kodni ishlatish (user)
 */
exports.applyPromoCode = async (req, res) => {
    try {
        const { code } = req.body;
        const userId = req.user._id; // user login bo‘lishi kerak
        const result = await promoCodeService.applyPromoCode(code, userId);
        res.status(200).json({ success: true, ...result });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
