const { Schema, model } = require('mongoose')
const { schemaOptions } = require('./ModelOptions') // Noto‘g‘ri yo‘l to‘g‘irlandi

const subjectSchema = new Schema(
	{
		nameEn: {
			type: String,
			required: true,
			unique: true,
		},
		nameUz: {
			type: String,
			required: true,
			unique: true,
		},
	},
	schemaOptions
)

module.exports = model('subjects', subjectSchema)
