const flashcardService = require('../services/flashcardService');

// Create flashcard
exports.createFlashcard = async (req, res) => {
    try {
        const body = req.body
        console.log(req.files.photo[0].filename)
        const data = {
            user: body.user,
            front: body.front,
            photo: req.files ? `${process.env.PHOTO_URL}/${req.files.photo[0].filename}` : null,
            back: body.back,
            backPhoto: req.files ? `${process.env.PHOTO_URL}/${req.files.backPhoto[0].filename}` : null,
            subject: body.subject,
            system: body.system,
            subcategory: body.subcategory
        }
        const flashcard = await flashcardService.createFlashcard(data);
        res.status(201).json({
            success: true,
            message: 'Flashcard created successfully',
            data: flashcard
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get all flashcards
exports.getAllFlashcards = async (req, res) => {
    try {
        const filters = req.query;
        const flashcards = await flashcardService.getAllFlashcards(filters);
        res.status(200).json({
            success: true,
            count: flashcards.length,
            data: flashcards
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get single flashcard
exports.getFlashcard = async (req, res) => {
    try {
        const flashcard = await flashcardService.getFlashcardById(req.params.id);
        res.status(200).json({
            success: true,
            data: flashcard
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

exports.getFlashcardUser = async (req, res) => {
    try {
        const flashcard = await flashcardService.getFlashcardByIdUser(req.params.id);
        res.status(200).json({
            success: true,
            data: flashcard
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// Update flashcard
exports.updateFlashcard = async (req, res) => {
    try {
        const body = req.body
        console.log(req.files)
        const data = {
            user: body.user,
            front: body.front,
            photo: req.files?.photo?.[0]
                ? `${process.env.PHOTO_URL}/${req.files.photo[0].filename}`
                : body.photo,
            back: body.back,
            backPhoto: req.files?.backPhoto?.[0]
                ? `${process.env.PHOTO_URL}/${req.files.backPhoto[0].filename}`
                : body.backPhoto,
            subject: body.subject,
            system: body.system,
            subcategory: body.subcategory
        };

        const flashcard = await flashcardService.updateFlashcard(req.params.id, data);
        res.status(200).json({
            success: true,
            message: 'Flashcard updated successfully',
            data: flashcard
        });
    } catch (error) {
        console.log(error)
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Delete flashcard
exports.deleteFlashcard = async (req, res) => {
    try {
        await flashcardService.deleteFlashcard(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Flashcard deleted successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Search flashcards
exports.searchFlashcards = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const results = await flashcardService.searchFlashcards(query);
        res.status(200).json({
            success: true,
            count: results.length,
            data: results
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};