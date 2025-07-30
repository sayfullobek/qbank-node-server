const { Schema, model } = require('mongoose')
const { schemaOptions } = require('./ModelOptions') // Noto‘g‘ri yo‘l to‘g‘irlandi

const questionsSchema = new Schema(
	{
		nameEn: {
			type: String,
			required: true,
		},
		nameUz: {
			type: String,
			required: true,
		},
		Subjects: [
			{
				type: Schema.Types.ObjectId,
				ref: 'subjects',
				required: true,
			},
		],
		Systems: [
			{
				type: Schema.Types.ObjectId,
				ref: 'systems',
				required: true,
			},
		],
		questionEn: {
			type: String,
			required: true,
		},
		questionUz: {
			type: String,
			required: true,
		},
		options: [
			{
				//varyantlar
				type: String,
				required: true,
			},
		],
		answerEn: {
			//togri varyanti
			type: String,
			required: true,
		},
		answerUz: {
			//togri varyanti
			type: String,
			required: true,
		},
		step: {
			type: String,
			enum: ['step1', 'step2', 'step3'],
			default: 'step1',
			required: true,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
		updatedAt: {
			type: Date,
			default: Date.now,
		},
	},
	schemaOptions
)

module.exports = model('questions', questionsSchema)
