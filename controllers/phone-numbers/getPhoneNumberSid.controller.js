'use strict';
const { env } = require('process');
const { getPhoneNumberDetailsFunc } = require('../../services/twilio.service');

const getPhoneNumberSid = async (req, res, next) => {
	try {
		const { phoneNumber } = req.params;

		//Create a Twilio client
		const phoneNumberDetails = await getPhoneNumberDetailsFunc(phoneNumber);

		return res.status(200).send({
			code: res.statusCode,
			message: 'Phone number details retrieved successfully',
			phoneNumberDetails
		});
	} catch (error) {
		console.error(error);
		return res.status(500).send({
			code: 500,
			error: { message: 'An internal server error occurred' }
		});
	}
};

module.exports = getPhoneNumberSid;
