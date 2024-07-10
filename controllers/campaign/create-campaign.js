'use strict';
const dayjs = require('dayjs');
const { createCampaignFunc } = require('../../services/campaign-service');
const { addCampaign } = require('./dynamoDB');

const createCampaign = async (req, res, next) => {
	const { campaignName, date, time, isScheduled, isSendText, isSendEmail, message, email } =
		req.body;
	const user = req.user;

	try {
		const dateTimeString = `${date} ${time}`;
		const format = 'MM/DD/YYYY HH:mm:ss';
		const formattedDate = dayjs(dateTimeString, format, true).toDate();
		const data = await createCampaignFunc(
			user.id,
			campaignName,
			formattedDate,
			formattedDate, // Date time has merged
			isScheduled,
			isSendText,
			isSendEmail,
			message,
			email
		);

		//Need to implement cron job for send emails or sms for a specific time
		const formattedCampaignData = {
			id: user.id,
			campaignName,
			date,
			time,
			isScheduled,
			isSendText,
			isSendEmail,
			message,
			email
		};
		addCampaign(formattedCampaignData);

		return res.status(200).send({
			code: res.statusCode,
			message: 'Campaign Created',
			campaign: data
		});
	} catch (error) {
		console.log(error);
		res
			.status(500)
			.send({ code: 500, message: 'Something went wrong', error: { message: error.message } });
	}
};

module.exports = {
	createCampaign
};
