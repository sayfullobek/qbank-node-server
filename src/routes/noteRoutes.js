const express = require("express");
const router = express.Router();
const {noteController} = require("../controller");
const { verifyUsersToken } = require("../config");
const upload = require("../middlewares/upload");

// POST /api/notes
router.post("/", verifyUsersToken, upload.none(), noteController.createNote);

// GET /api/notes
router.get("/", verifyUsersToken, noteController.getAllNotes);

// GET /api/notes/:id
router.get("/:id", noteController.getNoteById);
router.get("/user/:id", noteController.getNoteByIdUser);

// PUT /api/notes/:id
router.put("/:id", verifyUsersToken, upload.none(), noteController.updateNote);

// DELETE /api/notes/:id
router.delete("/:id", noteController.deleteNote);

module.exports = router;

