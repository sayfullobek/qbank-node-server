const express = require('express');
const { promoCodeController } = require('../controller');
const { verifyUsersToken } = require('../config');
const upload = require('../middlewares/upload');
const router = express.Router();

// Admin: promo kod yaratish va ko‘rish
router.post('/', verifyUsersToken, upload.none(), promoCodeController.createPromoCode);
router.get('/', verifyUsersToken, promoCodeController.getAllPromoCodes);
router.get('/:id', verifyUsersToken, promoCodeController.getByIdPromoCodes);

// User: promo kodni qo‘llash
router.post('/apply', verifyUsersToken, upload.none(), promoCodeController.applyPromoCode);
router.put('/:id', verifyUsersToken, upload.none(), promoCodeController.updatePromoCode);

module.exports = router;
