const express = require("express");
const router = express.Router();
const {highlightController} = require("../controller");
const { verifyUsersToken } = require("../config");
const upload = require("../middlewares/upload");

// POST /api/highlights - Create or update highlights for a question
router.post("/", verifyUsersToken, upload.none(), highlightController.saveHighlights);

// GET /api/highlights/:testId - Get all highlights for a test
router.get("/:testId", verifyUsersToken, highlightController.getHighlightsByTest);

// GET /api/highlights/:testId/:questionId - Get highlights for specific question
router.get("/:testId/:questionId", verifyUsersToken, highlightController.getHighlightsByQuestion);

// DELETE /api/highlights/:testId/:questionId - Delete highlights for specific question
router.delete("/:testId/:questionId", verifyUsersToken, highlightController.deleteHighlights);

module.exports = router;