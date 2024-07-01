'use strict';

const leadVendorService = require('../../services/leadService/leadVendor.service');

const createLeadVendor = async (req, res) => {
	try {
		const vendorData = req.body;
		const createdLeadVendor = await leadVendorService.createLeadVendor(vendorData);
		res.status(201).json(createdLeadVendor);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

module.exports = {
	createLeadVendor
}