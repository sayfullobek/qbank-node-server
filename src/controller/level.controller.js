const levelService = require("../services/level.service");

exports.createLevel = async (req, res) => {
    try {
        const level = await levelService.createLevel(req.body, req.file);
        res.status(201).json(level);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAllLevels = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const result = await levelService.getAllLevels(page, limit);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getLevelById = async (req, res) => {
    try {
        const level = await levelService.getLevelById(req.params.id);
        if (!level) return res.status(404).json({ message: "Not found" });
        res.json(level);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateLevel = async (req, res) => {
    try {
        const level = await levelService.updateLevel(req.params.id, req.body, req.file);
        if (!level) return res.status(404).json({ message: "Not found" });
        res.json(level);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteLevel = async (req, res) => {
    try {
        const deleted = await levelService.deleteLevel(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Not found" });
        res.json({ message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
