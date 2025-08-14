const express = require('express');
const { promoCodeController } = require('../controller');
const router = express.Router();

// Admin: promo kod yaratish va ko‘rish
router.post('/', promoCodeController.createPromoCode);
router.get('/', promoCodeController.getAllPromoCodes);

// User: promo kodni qo‘llash
router.post('/apply', promoCodeController.applyPromoCode);

module.exports = router;
