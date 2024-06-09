'use strict';
const { env } = require('process');
const { deletePurchasedPhoneNumbersFunc } = require('../../services/purchase-phone-number.service');
const { deletePhoneNumberFuncTwilio } = require('../../services/twilio.service');

const removePhoneNumber = async (req, res, next) => {
	try {
		const { phoneNumber } = req.params;

		// await deletePhoneNumberFuncTwilio(phoneNumber);
		const responseUpdated = await deletePurchasedPhoneNumbersFunc(phoneNumber);
		return res.status(200).send({
			code: res.statusCode,
			message: 'Phone number removed successfully',
			response: responseUpdated
		});
	} catch (error) {
		console.error(error);
		return res.status(500).send({
			code: 500,
			error: { message: 'An internal server error occurred' }
		});
	}
};

module.exports = removePhoneNumber;
