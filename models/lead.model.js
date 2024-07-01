const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LeadSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	phoneNumber: {
		type: String,
		required: true,
		unique: true,
		validate: {
			validator: function (v) {
				return /\d{10}/.test(v);
			},
			message: props => `${props.value} is not a valid phone number!`
		}
	},
	email: {
		type: String,
		required: true,
		unique: true,
		validate: {
			validator: function (v) {
				return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
			},
			message: props => `${props.value} is not a valid email!`
		}
	},
	city: {
		type: String
	},
	state: {
		type: String
	},
	zipCode: {
		type: String
	},
	otherInfo: {
		fields: {
			type: [],
			default: []
		},
		leadVendor: {
			type: String,
			required: true
		}
	},
	notes: {
		type: String,
		default: null
	},
	markedSoldOn: {
		type: Date,
		default: null
	},
	verificationCallOn: {
		type: Date,
		default: null
	},
	lastOutboundText: {
		type: Date,
		default: null
	},
	streetAddress: {
		type: String
	},
	userId: {
		type: Number,
		required: true
	},
	leadVendorId: {
		type: Number,
		required: true
	},
	isSmsOptOut: {
		type: Boolean,
		default: false
	},
	receivedOn: {
		type: Date,
		default: Date.now
	},
	numTimesEmailOpened: {
		type: Number,
		default: 0
	},
	isBlocked: {
		type: Boolean,
		default: false
	},
	timeZone: {
		type: Date,
		default: null
	},
	ownerUserId: {
		type: Number,
		required: true
	},
	lastOutboundCall: {
		type: Date,
		default: null
	},
	LeadVendor: {
		name: {
			type: String,
			required: true
		},
		id: {
			type: Number,
			required: true
		},
		presetLeadVendorLeadResultGroupId: {
			type: Number,
			default: null
		}
	},
	LeadResult: {
		type: Schema.Types.Mixed,
		default: null
	},
	Appointments: [{
		type: Schema.Types.ObjectId,
		ref: 'appointment',
		required: false
	}],
	AdditionalLeadPhoneNumbers: [],
	LeadDispositions: [],
	dialerCampaignId: {
		type: Number,
		default: null
	},
	isLeadResultFinal: {
		type: Boolean,
		default: false
	},
	claimedFromPowerDialer: {
		type: Boolean,
		default: false
	},
	id: {
		type: Number,
		required: true
	},
	folderId: {
		type: Number,
		default: null
	},
	leadResultId: {
		type: Number,
		default: null
	},
	leadResultGroupId: {
		type: Number,
		default: null
	},
	LeadSale: {
		type: Schema.Types.Mixed,
		default: null
	},
	LeadCommission: {
		type: Schema.Types.Mixed,
		default: null
	},
	LeadCost: {
		type: Schema.Types.Mixed,
		default: null
	},
	LeadsPedia_Lead: {
		type: Schema.Types.Mixed,
		default: null
	}
}, { timestamps: true });

LeadSchema.virtual('fullName').get(function () {
	return this.name;
});

LeadSchema.pre('save', function (next) {
	if (!this.leadSource) {
		this.leadSource = 'Unknown';
	}
	next();
});

LeadSchema.pre('findOneAndUpdate', function (next) {
	const update = this.getUpdate();
	if (update.totalLeadsReached && update.totalLeadsResponded) {
		update.responseRate = (update.totalLeadsResponded / update.totalLeadsReached) * 100;
	}
	next();
});

LeadSchema.index({ leadId: 1 });
LeadSchema.index({ phoneNumber: 1 });
LeadSchema.index({ email: 1 });
LeadSchema.index({ receivedOn: -1 });
LeadSchema.index({ state: 1 });
LeadSchema.index({ dispositionTags: 1 });

const Lead = mongoose.model('Lead', LeadSchema);

module.exports = Lead;
