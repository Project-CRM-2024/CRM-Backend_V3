'use strict';

const { fetchCampaignsByUserFunc } = require('../../services/campaign-service');

const fetchCampaignsByUser = async (req, res, next) => {
	const user = req.user;
	try {
		const data = await fetchCampaignsByUserFunc(user.id);
		return res.status(200).send({
			code: res.statusCode,
			message: 'Fetch Campaigns successfully',
			campaigns: data
		});
	} catch (error) {
		console.error(error.message);
		res
			.status(500)
			.send({ code: 500, message: 'Something went wrong', error: { message: error.message } });
	}
};

module.exports = {
	fetchCampaignsByUser
};
