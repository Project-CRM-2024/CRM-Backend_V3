'use strict';
const { env } = require('process');
const { addPurchasePhoneNumberFunc } = require('../../services/purchase-phone-number.service');
const { purchasePhoneNumberFuncTwilio } = require('../../services/twilio.service');

const purchaseSelectedPhoneNumber = async (req, res, next) => {
	try {
		const { phoneNumber, state } = req.body;
		const user = req.user;

		if (user && phoneNumber && state) {
			const phoneNumberDetails = await purchasePhoneNumberFuncTwilio(phoneNumber);

			const response = await addPurchasePhoneNumberFunc(
				user.id,
				phoneNumberDetails.phoneNumber,
				phoneNumberDetails.sid,
				state
			);
			return res.status(200).send({
				code: res.statusCode,
				message: 'Phone number purchased successfully',
				phoneNumberDetails: response
			});
		} else {
			return res.status(500).send({
				code: 500,
				error: { message: 'Something went wrong' }
			});
		}
	} catch (error) {
		return res.status(500).send({
			code: 500,
			error: { message: error.message }
		});
	}
};

module.exports = purchaseSelectedPhoneNumber;
