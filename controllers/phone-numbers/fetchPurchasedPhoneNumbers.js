'use strict';

const { fetchPurchasedPhoneNumbersFunc } = require("../../services/purchase-phone-number.service");

const fetchPurchasedPhoneNumbers = async (req, res, next) => {
	const user = req.user;
	try {
		const purchasedPhoneNumberList = await fetchPurchasedPhoneNumbersFunc(user.id);
		//Retrieve local phone numbers
		return res.status(200).send({
			code: res.statusCode,
			message: 'Purchased numbers retrieved successfully',
			purchasedPhoneNumberList
		});
	} catch (error) {
		console.error(error);
		return res.status(500).send({
			code: 500,
			error: { message: 'An internal server error occurred' }
		});
	}
};

module.exports = fetchPurchasedPhoneNumbers;