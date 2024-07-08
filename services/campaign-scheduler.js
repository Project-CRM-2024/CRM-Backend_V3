const cron = require('node-cron');
const moment = require('moment');
const CampaignModel = require('../models/campaign.model');

const scheduleCampaigns = async () => {
	try {
		const campaigns = await CampaignModel.find({ isScheduled: true, deletedAt: null });

		campaigns.forEach((campaign) => {
			const dateTime = moment(campaign.date).set({
				hour: moment(campaign.time).hour(),
				minute: moment(campaign.time).minute(),
				second: 0
			});

			const cronTime = dateTime.format('m H D M *'); // Format: minute hour day month

			if (campaign.isSendEmail) {
				cron.schedule(cronTime, () => {
					//sendEmail('recipient@example.com', campaign.name, campaign.message);
				});
			}

			if (campaign.isSendText) {
				cron.schedule(cronTime, () => {
					//sendSMS('+1234567890', campaign.message);
				});
			}

			console.log(
				`Scheduled campaign "${campaign.name}" for ${dateTime.format('YYYY-MM-DD HH:mm')}`
			);
		});
	} catch (error) {
		console.error('Error scheduling campaigns:', error);
	}
};

module.exports = scheduleCampaigns;
