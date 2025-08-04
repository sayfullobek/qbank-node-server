const express = require('express');
const router = express.Router();
const {flashcardController} = require('../controller');
const upload = require('../middlewares/upload');


// Create a flashcard
router.post('/', upload.fields([
    {name: "photo", maxCount: 1},
    {name: "backPhoto", maxCount: 1},
]), flashcardController.createFlashcard);

// Get all flashcards
router.get('/', flashcardController.getAllFlashcards);

// Get single flashcard
router.get('/:id', flashcardController.getFlashcard);
router.get('/user/:id', flashcardController.getFlashcardUser);

// Update flashcard
router.put('/:id', flashcardController.updateFlashcard);

// Delete flashcard
router.delete('/:id', flashcardController.deleteFlashcard);

// Search flashcards
router.get('/search', flashcardController.searchFlashcards);

module.exports = router;