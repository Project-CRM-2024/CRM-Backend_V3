const { Schema, model } = require('mongoose');

const tagSchema = new Schema(
	{
		name: { type: String, required: true },
		colorHex: { type: String, default: 'null' },
		addedBy: { type: Schema.Types.ObjectId, ref: 'user' }
	},
	{ timestamps: true }
);

const tagModel = model('tag', tagSchema);

module.exports = tagModel;
