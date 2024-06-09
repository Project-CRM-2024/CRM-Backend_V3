'use strict';
const { env } = require('process');
const { getLocalNumbersFunc } = require('../../services/twilio.service');

const getLocalNumbers = async (req, res, next) => {
	try {
		const { areaCode, state } = req.body;
		const availablePhoneNumberList = await getLocalNumbersFunc(state, areaCode);
		//Retrieve local phone numbers
		return res.status(200).send({
			code: res.statusCode,
			message: 'Local numbers retrieved successfully',
			availablePhoneNumberList
		});
	} catch (error) {
		console.error(error);
		return res.status(500).send({
			code: 500,
			error: { message: 'An internal server error occurred' }
		});
	}
};

module.exports = getLocalNumbers;
