const PurchasePhoneNumbersModel = require('../models/purchase-phonenumbers.model');

const addPurchasePhoneNumberFunc = async (user, phoneNumber, sid, state) => {
	try {
		return await PurchasePhoneNumbersModel.create({
			user,
			phoneNumber,
			sid,
			state
		})
			.then((response) => {
				return response;
			})
			.catch((error) => {
				throw new Error(error);
			});
	} catch (error) {
		throw new Error(error);
	}
};

const fetchPurchasedPhoneNumbersFunc = async (user) => {
	try {
		return await PurchasePhoneNumbersModel.find({
			user,
			deletedAt: null
		})
			.sort({ createdAt: -1 })
			.then((response) => {
				return response;
			})
			.catch((error) => {
				throw new Error(error);
			});
	} catch (error) {
		throw new Error(error);
	}
};

const fetchDeletedPurchasedPhoneNumbersFunc = async (user) => {
	try {
		return await PurchasePhoneNumbersModel.find({
			user,
			deletedAt: { $ne: null }
		})
			.sort({ createdAt: -1 })
			.then((response) => {
				return response;
			})
			.catch((error) => {
				throw new Error(error);
			});
	} catch (error) {
		throw new Error(error);
	}
};

const deletePurchasedPhoneNumbersFunc = async (phoneNumber) => {
	try {
		return await PurchasePhoneNumbersModel.findOneAndUpdate(
			{ phoneNumber: phoneNumber },
			{ $set: { deletedAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } }, // Update to set the new status value
			{ new: true } // Option to return the updated document
		)
			.then((response) => {
				return response;
			})
			.catch((error) => {
				throw new Error(error);
			});
	} catch (error) {
		throw new Error(error);
	}
};

const deletePurchasedPhoneNumbersFromDbFunc = async (phoneNumber) => {
	try {
		return await PurchasePhoneNumbersModel.findOneAndDelete({ phoneNumber: phoneNumber })
			.then(() => {
				return "Delete success";
			})
			.catch((error) => {
				throw new Error(error);
			});
	} catch (error) {
		throw new Error(error);
	}
};

module.exports = {
	addPurchasePhoneNumberFunc,
	fetchPurchasedPhoneNumbersFunc,
	deletePurchasedPhoneNumbersFunc,
	fetchDeletedPurchasedPhoneNumbersFunc,
	deletePurchasedPhoneNumbersFromDbFunc
};

