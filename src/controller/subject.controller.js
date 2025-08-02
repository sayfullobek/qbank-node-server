const service = require("../services/subject.service");

exports.create = async (req, res) => {
    try {
        const subject = await service.createSubject(req.body);
        res.status(201).json(subject);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getAll = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const result = await service.getAllSubjects({ page, limit });
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getOne = async (req, res) => {
    try {
        const subject = await service.getSubjectById(req.params.id);
        if (!subject) return res.status(404).json({ message: "Not found" });
        res.json(subject);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const updated = await service.updateSubject(req.params.id, req.body);
        if (!updated) return res.status(404).json({ message: "Not found" });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.remove = async (req, res) => {
    try {
        const removed = await service.deleteSubject(req.params.id);
        if (!removed) return res.status(404).json({ message: "Not found" });
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
