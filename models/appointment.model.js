const { Schema, model, default: mongoose } = require('mongoose');

const appointmentSchema = new Schema({
	identityID: { type: mongoose.Schema.Types.ObjectId, required: true },
	pageLogo: { type: String, required: false },
	initialDetails: {
		bookingPageLink: { type: String, required: true },
		bookingPageTitle: { type: String, required: true },
		instructions: { type: String, required: true },
		redirectUrl: { type: String, required: false }
	},
	appointmentDetails: {
		duration: { type: String, required: true },
		availableFrom: { type: String, required: true },
		availableTill: { type: String, required: true },
		maximumBookingDate: { type: Number, required: false, default: 180 }
	},
	additionalFields: {
		type: [
			{
				id: { type: Number, required: true },
				value: { type: String, required: true },
				required: { type: Boolean, required: true }
			}
		],
		required: false
	},
	appearanceDetails: {
		type: {
			backgroundColor: { type: String, required: false },
			pageFontColor: { type: String, required: false },
			timeSlotBackgroundColor: { type: String, required: false },
			timeSlotFontColor: { type: String, required: false },
			timeSlotBorderColor: { type: String, required: false }
		},
		required: false
	},
	availability: {
		slots: {
			type: Object,
			dynamic: true,
			properties: {
				timeSlot: {
					type: Object,
					dynamic: true,
					properties: {
						type: Boolean
					}
				}
			}
		},
		selectedDays: {
			type: [String],
			required: false
		}
	},
	notifications: {
		confirmationEmailMessage: { type: String, required: false },
		notifyVia: {
			type: {
				SMS: { type: Boolean, required: false, default: false },
				Email: { type: Boolean, required: false, default: false }
			}
		},
		sendConfirmationEmail: { type: Boolean, required: false, default: false },
		triggerAutomatedAction: { type: Boolean, required: false, default: false },
		
	}
});

const appointmentModel = model('appointment', appointmentSchema);

module.exports = appointmentModel;
