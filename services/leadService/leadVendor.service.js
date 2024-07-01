'use strict';

const LeadVendor = require('../../models/leadVendor.model');

const createLeadVendor = async (vendorData) => {
	try {
		const newLeadVendor = new LeadVendor(vendorData);
		const savedLeadVendor = await newLeadVendor.save();
		return savedLeadVendor;
	} catch (error) {
		throw new Error(`Failed to create lead vendor: ${error.message}`);
	}
};

module.exports = {
	createLeadVendor
};