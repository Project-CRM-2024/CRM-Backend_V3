'use strict';
const mongoose = require('mongoose');
const Lead = require('../../models/lead.model');

const searchLeads = async (filters) => {
	try {
		const query = {};

		if (filters.startDate && filters.endDate) {
			const startDate = new Date(filters.startDate);
			const endDate = new Date(filters.endDate);
			if (!isNaN(startDate) && !isNaN(endDate)) {
				query.receivedOn = { $gte: startDate, $lte: endDate };
			}
		}

		if (filters.transferredOnStartDate && filters.transferredOnEndDate) {
			const transferredOnStartDate = new Date(filters.transferredOnStartDate);
			const transferredOnEndDate = new Date(filters.transferredOnEndDate);
			if (!isNaN(transferredOnStartDate) && !isNaN(transferredOnEndDate)) {
				query.transferredOn = { $gte: transferredOnStartDate, $lte: transferredOnEndDate };
			}
		}

		if (filters.markedSoldOnStartDate && filters.markedSoldOnEndDate) {
			const markedSoldOnStartDate = new Date(filters.markedSoldOnStartDate);
			const markedSoldOnEndDate = new Date(filters.markedSoldOnEndDate);
			if (!isNaN(markedSoldOnStartDate) && !isNaN(markedSoldOnEndDate)) {
				query.markedSoldOn = { $gte: markedSoldOnStartDate, $lte: markedSoldOnEndDate };
			}
		}

		// Simple Filters
		if (filters.leadVendor) query.leadVendor = filters.leadVendor;
		if (filters.state) query.state = filters.state;
		if (filters.timezone) query.timezone = filters.timezone;
		if (filters.status) query.status = filters.status;
		if (filters.notesPresence !== undefined) query.notes = filters.notesPresence ? { $ne: null } : null;
		if (filters.numTimesCalled !== undefined) query.numTimesCalled = { $gte: filters.numTimesCalled };
		if (filters.numTimesEmailOpened !== undefined) query.numTimesEmailOpened = { $gte: filters.numTimesEmailOpened };
		if (filters.isExcludedFromDrips !== undefined) query.isExcludedFromDrips = filters.isExcludedFromDrips;

		if (filters.birthdayStart && filters.birthdayEnd) {
			const birthdayStart = new Date(filters.birthdayStart);
			const birthdayEnd = new Date(filters.birthdayEnd);
			if (!isNaN(birthdayStart) && !isNaN(birthdayEnd)) {
				query.birthday = { $gte: birthdayStart, $lte: birthdayEnd };
			}
		}

		// Disposition Tags
		if (filters.dispositionTags) query.dispositionTags = { $in: filters.dispositionTags };

		// Search by Name, Phone, Email with case insensitive regex
		if (filters.name) query.name = new RegExp(filters.name, 'i');
		if (filters.phoneNumber) query.phoneNumber = new RegExp(filters.phoneNumber, 'i');
		if (filters.email) query.email = new RegExp(filters.email, 'i');

		// Company Lead Status
		if (filters.companyLeadStatus) query['details.leadResultName'] = filters.companyLeadStatus;

		// Additional Filters
		if (filters.isBlocked !== undefined) query.isBlocked = filters.isBlocked;
		if (filters.isSmsOptOut !== undefined) query.isSmsOptOut = filters.isSmsOptOut;
		if (filters.optOutOfFollowupsToday !== undefined) query.optOutOfFollowupsToday = filters.optOutOfFollowupsToday;
		if (filters.deletedAt !== undefined) query.deletedAt = { $exists: filters.deletedAt };

		const limit = parseInt(filters.limit, 10) || 10;
		const skip = parseInt(filters.skip, 10) || 0;

		const leads = await Lead.find(query)
			.limit(limit)
			.skip(skip);

		return leads.map(formatLead);
	} catch (error) {
		throw new Error(`Failed to search leads: ${error.message}`);
	}
};

module.exports = {
	searchLeads
};


const createLead = async (leadData) => {
	try {
		const newLead = new Lead(leadData);
		const savedLead = await newLead.save();
		return savedLead;
	} catch (error) {
		let errorMessage = 'Failed to create lead';
		if (error.code === 11000) {
			errorMessage = 'Duplicate key error: Lead with this email or phone number already exists.';
		} else if (error.name === 'ValidationError') {
			errorMessage = error.message;
		}
		throw new Error(errorMessage);
	}
};

const getAllLeads = async (page = 1, limit = 100) => {
	try {
		// Ensure the limit does not exceed 100
		limit = Math.min(limit, 100);

		// Calculate the skip value
		const skip = (page - 1) * limit;

		// Retrieve leads using cursor for efficient pagination
		const cursor = Lead.find()
			.sort({ receivedOn: -1 }) // Ensure proper indexing on the 'receivedOn' field
			.skip(skip)
			.limit(limit)
			.cursor();

		const leads = [];
		for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
			leads.push(doc);
		}

		// Get the total count of leads
		const totalLeads = await Lead.countDocuments().exec();

		const totalPages = Math.ceil(totalLeads / limit);

		return {
			leads,
			totalLeads,
			totalPages,
			currentPage: page
		};
	} catch (error) {
		if (error instanceof mongoose.Error.CastError) {
			throw new Error('Invalid data format.');
		} else if (error instanceof mongoose.Error.ValidationError) {
			throw new Error('Validation error.');
		} else if (error instanceof mongoose.Error.DocumentNotFoundError) {
			throw new Error('Document not found.');
		} else {
			console.error(`Unexpected error: ${error.message}`);
			throw new Error('An unexpected error occurred while retrieving leads.');
		}
	}
};

const getLeadById = async (id) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid ID format.');
        }

        const lead = await Lead.findById(id).exec();

        if (!lead) {
            throw new Error('Lead not found.');
        }

        return lead;
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            throw new Error('Invalid data format.');
        } else if (error instanceof mongoose.Error.ValidationError) {
            throw new Error('Validation error.');
        } else if (error instanceof mongoose.Error.DocumentNotFoundError) {
            throw new Error('Lead not found.');
        } else {
            console.error(`Unexpected error: ${error.message}`);
            throw new Error('An unexpected error occurred while retrieving the lead.');
        }
    }
};


const generateCSV = async () => {
	try {
		const leads = await getAllLeads();

		if (leads.length === 0) {
			throw new Error('No leads found to export.');
		}

		const csvWriter = createObjectCsvWriter({
			path: 'leads.csv',
			header: [
				{ id: 'leadId', title: 'Lead ID' },
				{ id: 'vendorId', title: 'Vendor ID' },
				{ id: 'companyId', title: 'Company ID' },
				{ id: 'userId', title: 'User ID' },
				{ id: 'leadVendor', title: 'Lead Vendor' },
				{ id: 'phoneNumber', title: 'Phone Number' },
				{ id: 'name', title: 'Name' },
				{ id: 'email', title: 'Email' },
				{ id: 'streetAddress', title: 'Street Address' },
				{ id: 'city', title: 'City' },
				{ id: 'state', title: 'State' },
				{ id: 'zipCode', title: 'Zip Code' },
				{ id: 'birthday', title: 'Birthday' },
				{ id: 'receivedOn', title: 'Received On' },
				{ id: 'status', title: 'Status' },
				{ id: 'notes', title: 'Notes' },
				{ id: 'assignedTo', title: 'Assigned To' },
				{ id: 'contactPreferences.email', title: 'Contact Email' }, //nested field
				{ id: 'isExcludedFromDrips', title: 'Excluded From Drips' },
				{ id: 'campaigns', title: 'Campaigns' },
				{ id: 'appointments', title: 'Appointments' },
				{ id: 'dispositionTags', title: 'Disposition Tags' },
				{ id: 'lastOutboundCall', title: 'Last Outbound Call' },
				{ id: 'lastOutboundText', title: 'Last Outbound Text' },
				{ id: 'verificationCallOn', title: 'Verification Call On' },
				{ id: 'numTimesCalled', title: 'Number of Times Called' },
				{ id: 'numTimesEmailOpened', title: 'Number of Times Email Opened' },
				{ id: 'isBlocked', title: 'Blocked' },
				{ id: 'isSmsOptOut', title: 'SMS Opt Out' },
				{ id: 'optOutOfFollowupsToday', title: 'Opt Out of Follow-ups Today' },
				{ id: 'details.leadResultName', title: 'Lead Result Name' }
			]
		});

		await csvWriter.writeRecords(leads);

		console.log('CSV file generated successfully.');

	} catch (error) {
		throw new Error(`Failed to generate CSV: ${error.message}`);
	}
};

const formatLead = (lead) => {
	return {
		leadId: lead.leadId,
		vendorId: lead.vendorId,
		companyId: lead.companyId,
		userId: lead.userId,
		leadVendor: lead.leadVendor,
		phoneNumber: lead.phoneNumber,
		name: lead.name,
		email: lead.email,
		streetAddress: lead.streetAddress,
		city: lead.city,
		state: lead.state,
		zipCode: lead.zipCode,
		birthday: lead.birthday,
		receivedOn: lead.receivedOn.toISOString(), // ISO format
		status: lead.status,
		notes: lead.notes,
		assignedTo: lead.assignedTo,
		contactPreferences: {
			email: lead.contactPreferences.email, //nested fields
			phone: lead.contactPreferences.phone,
			sms: lead.contactPreferences.sms
		},
		isExcludedFromDrips: lead.isExcludedFromDrips,
		campaigns: lead.campaigns,
		appointments: lead.appointments,
		dispositionTags: lead.dispositionTags,
		lastOutboundCall: lead.lastOutboundCall ? lead.lastOutboundCall.toISOString() : null,
		lastOutboundText: lead.lastOutboundText ? lead.lastOutboundText.toISOString() : null,
		verificationCallOn: lead.verificationCallOn ? lead.verificationCallOn.toISOString() : null,
		numTimesCalled: lead.numTimesCalled,
		numTimesEmailOpened: lead.numTimesEmailOpened,
		isBlocked: lead.isBlocked,
		isSmsOptOut: lead.isSmsOptOut,
		optOutOfFollowupsToday: lead.optOutOfFollowupsToday,
		details: {
			leadResultName: lead.details.leadResultName
		}
	};
};


module.exports = {
	searchLeads,
	createLead,
	getAllLeads,
	getLeadById,
	generateCSV

};
