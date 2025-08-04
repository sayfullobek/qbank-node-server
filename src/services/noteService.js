const { Notes } = require("../models");

const createNote = async (data) => {
  return await Notes.create(data);
};

const getAllNotes = async () => {
  return await Notes.find().populate("question").populate("user");
};

const getNoteById = async (id) => {
  return await Notes.findById(id).populate("question");
};

const getNoteByIdUser = async (id) => {
  return await Notes.find({user: id}).populate("question");
};

const updateNote = async (id, data) => {
  return await Notes.findByIdAndUpdate(id, data, { new: true });
};

const deleteNote = async (id) => {
  return await Notes.findByIdAndDelete(id);
};

module.exports = {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
  getNoteByIdUser
};
