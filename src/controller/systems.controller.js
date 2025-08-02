const service = require("../services/systems.service");

exports.create = async (req, res) => {
    try {
        const system = await service.createSystem(req.body);
        res.status(201).json(system);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.getAll = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const result = await service.getAllSystems({ page, limit });
        res.json(result);
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message });
    }
};

exports.getOne = async (req, res) => {
    try {
        const system = await service.getSystemById(req.params.id);
        if (!system) return res.status(404).json({ message: "Not found" });
        res.json(system);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const updated = await service.updateSystem(req.params.id, req.body);
        if (!updated) return res.status(404).json({ message: "Not found" });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.remove = async (req, res) => {
    try {
        const removed = await service.deleteSystem(req.params.id);
        if (!removed) return res.status(404).json({ message: "Not found" });
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
