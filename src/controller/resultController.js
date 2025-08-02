const resultService = require("../services/resultService");

exports.createResult = async (req, res) => {
    try {
        const data = req.body
        const payload = {
            users: req.users,
            test: data.test,
            correct: data.correct,
            error: data.error,
            unanswered: data.unanswered,
            score: data.score
        };
        const result = await resultService.createResult(payload);
        res.status(201).json({ success: true, data: result });
    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getAllResults = async (req, res) => {
    try {
        const results = await resultService.getAllResults();
        res.status(200).json({ success: true, data: results });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getResultById = async (req, res) => {
    try {
        const result = await resultService.getResultById(req.params.id);
        if (!result) return res.status(404).json({ success: false, message: "Natija topilmadi" });
        res.status(200).json({ success: true, data: result });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateResult = async (req, res) => {
    try {
        const updated = await resultService.updateResult(req.params.id, req.body);
        if (!updated) return res.status(404).json({ success: false, message: "Natija topilmadi" });
        res.status(200).json({ success: true, data: updated });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteResult = async (req, res) => {
    try {
        const deleted = await resultService.deleteResult(req.params.id);
        if (!deleted) return res.status(404).json({ success: false, message: "Natija topilmadi" });
        res.status(200).json({ success: true, message: "O‘chirildi" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
