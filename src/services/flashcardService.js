const {Flashcard} = require('../models');

// Create a new flashcard
const createFlashcard = async (data) => {
  try {
    const flashcard = new Flashcard(data);
    await flashcard.save();
    return flashcard;
  } catch (error) {
    throw new Error(`Error creating flashcard: ${error.message}`);
  }
};

// Get all flashcards
const getAllFlashcards = async (filters = {}) => {
  try {
    return await Flashcard.find(filters).sort({ createdAt: -1 });
  } catch (error) {
    throw new Error(`Error fetching flashcards: ${error.message}`);
  }
};

// Get flashcard by ID
const getFlashcardById = async (id) => {
  try {
    const flashcard = await Flashcard.findById(id);
    if (!flashcard) throw new Error('Flashcard not found');
    return flashcard;
  } catch (error) {
    throw new Error(`Error fetching flashcard: ${error.message}`);
  }
};

const getFlashcardByIdUser = async (id) => {
  try {
    const flashcard = await Flashcard.find({user: id});
    if (!flashcard) throw new Error('Flashcard not found');
    return flashcard;
  } catch (error) {
    throw new Error(`Error fetching flashcard: ${error.message}`);
  }
};

// Update flashcard by ID
const updateFlashcard = async (id, data) => {
  try {
    const flashcard = await Flashcard.findByIdAndUpdate(
      id, 
      data, 
      { new: true, runValidators: true }
    );
    if (!flashcard) throw new Error('Flashcard not found');
    return flashcard;
  } catch (error) {
    throw new Error(`Error updating flashcard: ${error.message}`);
  }
};

// Delete flashcard by ID
const deleteFlashcard = async (id) => {
  try {
    const flashcard = await Flashcard.findByIdAndDelete(id);
    if (!flashcard) throw new Error('Flashcard not found');
    return flashcard;
  } catch (error) {
    throw new Error(`Error deleting flashcard: ${error.message}`);
  }
};

// Search flashcards
const searchFlashcards = async (query) => {
  try {
    return await Flashcard.find({
      $or: [
        { front: { $regex: query, $options: 'i' } },
        { back: { $regex: query, $options: 'i' } },
        { subject: { $regex: query, $options: 'i' } },
        { system: { $regex: query, $options: 'i' } },
        { subcategory: { $regex: query, $options: 'i' } }
      ]
    });
  } catch (error) {
    throw new Error(`Error searching flashcards: ${error.message}`);
  }
};

module.exports = {
  createFlashcard,
  getAllFlashcards,
  getFlashcardById,
  updateFlashcard,
  deleteFlashcard,
  searchFlashcards,
  getFlashcardByIdUser
};