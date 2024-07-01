'use strict';

const leadService = require('../../services/leadService/leadService');

const searchLeads = async (req, res) => {
	try {
		const filters = req.query;
		const leads = await leadService.searchLeads(filters);
		res.status(200).json(leads);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const createLead = async (req, res) => {
	try {
		const leadData = req.body;
		const newLead = await leadService.createLead(leadData);
		res.status(201).json(newLead);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const displayLeadInformation = async (req, res) => {
	try {
		const { _id } = req.params;

		// Ensure _id is a valid ObjectId before attempting to fetch the lead
		if (!mongoose.Types.ObjectId.isValid(_id)) {
			return res.status(400).json({ error: 'Invalid ID format.' });
		}

		// Call the service method to retrieve the lead by _id
		const lead = await leadService.getLeadById(_id);

		// If lead is found, send it in the response
		res.status(200).json(lead);
	} catch (error) {
		// Handle any errors that occur during lead retrieval or processing
		res.status(500).json({ error: error.message });
	}
};



const displayAllLeads = async (req, res) => {
	try {
		const lead = await leadService.getAllLeads();
		res.status(200).json(lead);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

module.exports = {
	searchLeads,
	createLead,
	displayLeadInformation,
	displayAllLeads
};
