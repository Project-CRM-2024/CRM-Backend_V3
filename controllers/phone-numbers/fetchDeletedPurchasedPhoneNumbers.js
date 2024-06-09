'use strict';

const {
	fetchDeletedPurchasedPhoneNumbersFunc
} = require('../../services/purchase-phone-number.service');

const fetchDeletedPurchasedPhoneNumbers = async (req, res, next) => {
	const user = req.user;
	try {
		const deletedPurchasedPhoneNumberList = await fetchDeletedPurchasedPhoneNumbersFunc(user.id);
		return res.status(200).send({
			code: res.statusCode,
			message: 'Deleted Purchased numbers retrieved successfully',
			deletedPurchasedPhoneNumberList
		});
	} catch (error) {
		console.error(error);
		return res.status(500).send({
			code: 500,
			error: { message: 'An internal server error occurred' }
		});
	}
};

module.exports = fetchDeletedPurchasedPhoneNumbers;
