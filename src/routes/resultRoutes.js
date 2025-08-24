const express = require("express");
const { resultController } = require("../controller");
const upload = require("../middlewares/upload");
const { verifyUsersToken } = require("../config");
const router = express.Router();

// POST: Yangi natija yaratish
router.post("/", verifyUsersToken, upload.none(), resultController.createResult);

// GET: Barcha natijalarni olish
router.get("/", resultController.getAllResults);

// GET: Bitta natijani olish
router.get("/:id", resultController.getResultById);

// GET: Test result data with full population (for Test Results page)
router.get("/:id/full", resultController.getTestResultData);

// PUT: Natijani yangilash
router.put("/:id", resultController.updateResult);

// DELETE: Natijani o‘chirish
router.delete("/:id", resultController.deleteResult);

module.exports = router;
