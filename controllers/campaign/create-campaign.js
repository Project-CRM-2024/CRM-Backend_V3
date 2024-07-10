'use strict';
const dayjs = require('dayjs');
const AWS = require('aws-sdk');
const fs = require('fs');
const { createCampaignFunc } = require('../../services/campaign-service');
const { addCampaign } = require('./dynamoDB');
const { randomUUID } = require('crypto');

const createCampaign = async (req, res, next) => {
	const { campaignName, date, time, isScheduled, isSendText, isSendEmail, message, email } =
		req.body;
	const user = req.user;
	const file = req.file;
	const fileContent = fs.readFileSync(file.path);
	// AWS S3 configuration
	const s3 = new AWS.S3({
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
		region: process.env.AWS_REGION
	});
	const fileName = randomUUID();

	// Configure the S3 upload parameters
	const params = {
		Bucket: "dialwinbucket",
		Key: `${fileName}.xlsx`, // File name to save as in S3
		Body: fileContent
	};

	// Uploading files to the bucket
	await s3.upload(params, (err, data) => {
		if (err) {
			console.error('Error uploading file to S3', err);
			return res.status(500).send('Error uploading file');
		}

		// Delete the file from the server after uploading to S3
		fs.unlinkSync(file.path);

		res.send(`File uploaded successfully. ${data.Location}`);
	});

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
			email,
			fileName
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

