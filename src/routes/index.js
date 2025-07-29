const express = require('express');
const router = express.Router();

router.use('/auth', require("./authRoute"));
router.use('/systems', require('./systemsRoute')); // 👉 qo‘shildi
router.use('/subjects', require('./subjectRoute')); // 👉 qo‘shildi
router.use('/level', require('./levelRoute')); // qo‘shilgan qism
router.use('/plan', require('./planRoute')); // qo‘shilgan qism
router.use('/questions', require('./questionRoute')); // qo‘shilgan qism

module.exports = router;
