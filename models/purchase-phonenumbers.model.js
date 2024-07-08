const { Schema, model } = require('mongoose');

const PurchasePhoneNumbersSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
		phoneNumber: { type: String, required: true },
		sid: { type: String, required: true },
		state: { type: String, required: true },
		renewalDate: { type: Date, required: false, default: null },
		status: { type: String, required: true, default: 'ACTIVE' },
		carrierViolation: { type: Number, required: true, default: 0 },
		deletedAt: { type: Date, required: false, default: null }
	},
	{ timestamps: true }
);

const PurchasePhoneNumbersModel = model('PurchasePhoneNumber', PurchasePhoneNumbersSchema);

module.exports = PurchasePhoneNumbersModel;
