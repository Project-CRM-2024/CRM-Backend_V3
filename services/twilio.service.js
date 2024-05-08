'use strict';
const { env } = require('process');

const getLocalNumbersFunc = async (state, areaCode) => {
	try {
		const client = require('twilio')(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
		//Retrieve local phone numbers
		let availablePhoneNumberList = [];
		if (state) {
			availablePhoneNumberList = await client
				.availablePhoneNumbers('US')
				.local.list({ InRegion: state });
		} else {
			availablePhoneNumberList = await client
				.availablePhoneNumbers('US')
				.local.list({ areaCode: areaCode });
		}
		return availablePhoneNumberList;
	} catch (error) {
		throw new Error(error);
	}
};

const getPhoneNumberDetailsFunc = async (phoneNumber) => {
	try {
		const client = require('twilio')(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

		//Retrieve phone number SID
		const phoneNumberDetails = await client.incomingPhoneNumbers.list({ phoneNumber: phoneNumber });
		return phoneNumberDetails[0];
	} catch (error) {
		throw new Error(error);
	}
};

const deletePhoneNumberFuncTwilio = async (phoneNumber) => {
	try {
		const client = require('twilio')(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
		const phoneNumberDetails = await getPhoneNumberDetailsFunc(phoneNumber);
		console.log(phoneNumber);
		console.log(phoneNumberDetails.sid);
		const response = await client.incomingPhoneNumbers(phoneNumberDetails.sid).remove();
		console.log(response);
		return response;
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
};

const purchasePhoneNumberFuncTwilio = async (phoneNumber) => {
	try {
		const client = require('twilio')(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
		const response = await client.incomingPhoneNumbers.create({
			phoneNumber
		});
		return response;
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
};

module.exports = {
	getLocalNumbersFunc,
	getPhoneNumberDetailsFunc,
	deletePhoneNumberFuncTwilio,
	purchasePhoneNumberFuncTwilio
};

