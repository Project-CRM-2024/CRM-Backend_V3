const { Schema, model } = require('mongoose');

const CampaignSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
		campaignName: { type: String, required: true },
		date: { type: Date, required: true },
		time: { type: Date, required: true },
		isScheduled: { type: Boolean, required: true },
		isSendText: { type: Boolean, required: true },
		isSendEmail: { type: Boolean, required: true },
		email: {
			title: { type: String, required: false },
			body: { type: String, required: false }
		},
		message: { type: String, required: false },
		estimatedCost: { type: Number, required: false, default: 0 },
		totalLeadsReached: { type: Number, required: false, default: 0 },
		totalLeadsResponded: { type: Number, required: false, default: 0 },
		responseRate: { type: Number, required: false, default: 0 },
		totalCarrierViolations: { type: Number, required: false, default: 0 },
		deletedAt: { type: Date, required: false, default: null }
	},
	{ timestamps: true }
);

const CampaignModel = model('campaign', CampaignSchema);

module.exports = CampaignModel;
