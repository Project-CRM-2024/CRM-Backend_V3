'use strict';
const { createCampaignFunc } = require('../../services/campaign-service');
const smsHandler = require('./awsHandler');
const sendSms = require('./send-sms');

const createCampaign = async (req, res, next) => {
	const { campaignName, date, time, isScheduled, isSendText, isSendEmail, message, email } =
		req.body;
	const user = req.user;
	try {
		// const data = await createCampaignFunc(
		// 	user.id,
		// 	campaignName,
		// 	date,
		// 	time,
		// 	isScheduled,
		// 	isSendText,
		// 	isSendEmail,
		// 	message,
		// 	email
		// );

		//Need to implement cron job for send emails or sms for a specific time
		smsHandler();

		return res.status(200).send({
			code: res.statusCode,
			message: 'Campaign Created',
			campaign: data
		});
	} catch (error) {
		res
			.status(500)
			.send({ code: 500, message: 'Something went wrong', error: { message: error.message } });
	}
};

module.exports = {
	createCampaign
};

