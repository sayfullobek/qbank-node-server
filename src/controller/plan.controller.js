const service = require("../services/plan.service");

exports.createPlan = async (req, res) => {
    try {
        const plan = await service.createPlan(req.body);
        res.status(201).json(plan);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getAllPlans = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const result = await service.getAllPlans(+page, +limit);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getPlanById = async (req, res) => {
    try {
        const plan = await service.getPlanById(req.params.id);
        if (!plan) return res.status(404).json({ message: "Plan not found" });
        res.json(plan);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updatePlan = async (req, res) => {
    try {
        const updated = await service.updatePlan(req.params.id, req.body);
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deletePlan = async (req, res) => {
    try {
        await service.deletePlan(req.params.id);
        res.json({ message: "Plan deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
