const { Schema, model } = require('mongoose')
const { schemaOptions } = require('./ModelOptions') // Noto‘g‘ri yo‘l to‘g‘irlandi

const questionsSchema = new Schema(
	{
		questionId: {
			type: Number,
			required: true
		},
		
		Subjects: [
			{
				type: Schema.Types.ObjectId,
				ref: 'subjects',
				required: true,
			},
		],
		topic: {
			type: String,
		},
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
				// type: String,
				// required: true,
				uz: {
					type: String,
					required: true,
				},
				en: {
					type: String,
					required: true
				}
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
		photos: [{
			filename: String,
			path: String,
			mimetype: String,
			size: Number
		}],
		explainEn: {
			type: String,
			required: true,
		},
		explainUz: {
			type: String,
			required: true,
		},
		step: {
			type: String,
			enum: ['step1', 'step2', 'step3'],
			default: 'step1',
			required: true,
		},
		questionBank: { type: String },
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
