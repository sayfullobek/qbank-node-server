const { Subjects } = require('../models')
const questionService = require('../services/questions.service')

exports.create = async (req, res) => {
	try {
		if (typeof req.body.Subjects === 'string') {
			try {
				req.body.Subjects = JSON.parse(req.body.Subjects);
			} catch (err) {
				// Agar bu string bo‘lsa va vergul bor bo‘lsa
				if (req.body.Subjects.includes(',')) {
					req.body.Subjects = req.body.Subjects.split(',').map(s => s.trim());
				} else {
					req.body.Subjects = [req.body.Subjects];
				}
			}
		}
		if (!Array.isArray(req.body.Subjects)) {
			req.body.Subjects = [req.body.Subjects];
		}

		if (typeof req.body.Systems === 'string') {
			try {
				req.body.Systems = JSON.parse(req.body.Systems);
			} catch (err) {
				// Agar bu string bo‘lsa va vergul bor bo‘lsa
				if (req.body.Systems.includes(',')) {
					req.body.Systems = req.body.Systems.split(',').map(s => s.trim());
				} else {
					req.body.Systems = [req.body.Systems];
				}
			}
		}
		if (!Array.isArray(req.body.Systems)) {
			req.body.Systems = [req.body.Systems];
		}

		// Options
		if (typeof req.body.options === 'string') {
			try {
				req.body.options = JSON.parse(req.body.options);
			} catch (err) {
				console.error('Options JSON.parse xato:', err);
				req.body.options = [];
			}
		}
		if (!Array.isArray(req.body.options)) {
			req.body.options = [req.body.options];
		}




		const question = await questionService.create(req.body);
		res.status(201).json(question);
	} catch (error) {
		console.error("Error creating question:", error);
		res.status(500).json({ error: "Server error" });
	}

}



exports.getAll = async (req, res) => {
	try {
		const data = await questionService.getAll(req.query)
		res.json(data)
	} catch (err) {
		res.status(500).json({ error: err.message })
	}
}

exports.getById = async (req, res) => {
	try {
		const question = await questionService.getById(req.params.id)
		if (!question) return res.status(404).json({ error: 'Not found' })
		res.json({ data: question, success: true })
	} catch (err) {
		console.log(err)
		res.status(500).json({ error: err.message })
	}
}

exports.update = async (req, res) => {
	try {
		if (typeof req.body.Subjects === 'string') {
			req.body.Subjects = JSON.parse(req.body.Subjects)
		}
		if (!Array.isArray(req.body.Subjects)) {
			req.body.Subjects = [req.body.Subjects]
		}

		if (typeof req.body.Systems === 'string') {
			req.body.Systems = JSON.parse(req.body.Systems)
		}
		if (!Array.isArray(req.body.Systems)) {
			req.body.Systems = [req.body.Systems]
		}

		if (typeof req.body.options === 'string') {
			req.body.options = JSON.parse(req.body.options)
		}
		if (!Array.isArray(req.body.options)) {
			req.body.options = [req.body.options]
		}

		const question = await questionService.update(req.params.id, req.body)
		res.json(question)
	} catch (err) {
		console.log(err)
		res.status(400).json({ error: err.message })
	}
}


exports.delete = async (req, res) => {
	try {
		await questionService.delete(req.params.id)
		res.json({ success: true })
	} catch (err) {
		res.status(400).json({ error: err.message })
	}
}
