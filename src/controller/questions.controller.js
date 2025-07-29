const questionService = require('../services/questions.service')

exports.create = async (req, res) => {
	try {
		const question = await questionService.create(req.body)
		res.status(201).json(question)
	} catch (err) {
		res.status(400).json({ error: err.message })
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
		res.json(question)
	} catch (err) {
		res.status(500).json({ error: err.message })
	}
}

exports.update = async (req, res) => {
	try {
		const question = await questionService.update(req.params.id, req.body)
		res.json(question)
	} catch (err) {
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
