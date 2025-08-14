const noteService = require("../services/noteService");

const createNote = async (req, res) => {
    try {
        const newNote = await noteService.createNote(req.body);
        res.status(201).json(newNote);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const getAllNotes = async (req, res) => {
    try {
        const notes = await noteService.getAllNotes();
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getNoteById = async (req, res) => {
    try {
        const note = await noteService.getNoteById(req.params.id);
        if (!note) return res.status(404).json({ message: "Note not found" });
        res.json(note);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getNoteByIdUser = async (req, res) => {
    try {
        const note = await noteService.getNoteByIdUser(req.params.id);
        if (!note) return res.status(404).json({ message: "Note not found" });
        res.json(note);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateNote = async (req, res) => {
    try {
        const updated = await noteService.updateNote(req.params.id, req.body);
        if (!updated) return res.status(404).json({ message: "Note not found" });
        res.status(200).json({updated, success: true});
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const deleteNote = async (req, res) => {
    try {
        const deleted = await noteService.deleteNote(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Note not found" });
        res.status(200).json({ message: "Note deleted", success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createNote,
    getAllNotes,
    getNoteById,
    updateNote,
    deleteNote,
    getNoteByIdUser
};
