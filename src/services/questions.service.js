const { Questions } = require('../models')

exports.create = async data => {
	return await Questions.create(data)
}

exports.getAll = async (page = 1, limit = 10, search = '') => {
	const query = search
		? {
				$or: [
					{ nameUz: new RegExp(search, 'i') },
					{ nameEn: new RegExp(search, 'i') },
				],
		  }
		: {}

	const skip = (page - 1) * limit
	const [items, total] = await Promise.all([
		Questions.find(query)
			.populate('Subjects')
			.populate('Systems')
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.lean(),
		Questions.countDocuments(query),
	])

	return {
		total,
		page,
		limit,
		pages: Math.ceil(total / limit),
		items,
	}
}

exports.getById = async id => {
	return await Questions.findById(id)
		.populate('Subjects')
		.populate('Systems')
		.lean()
}

exports.update = async (id, data) => {
	return await Questions.findByIdAndUpdate(id, data, {
		new: true,
		runValidators: true,
	})
}

exports.delete = async id => {
	return await Questions.findByIdAndDelete(id)
}
