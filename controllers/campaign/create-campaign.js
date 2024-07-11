'use strict';
const dayjs = require('dayjs');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const { createCampaignFunc } = require('../../services/campaign-service');
const { addCampaign } = require('./dynamoDB');
const { v4: uuidv4 } = require('uuid');

// AWS S3 client configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});



const createCampaign = async (req, res, next) => {
	const { campaignName, date, time, isScheduled, isSendText, isSendEmail, message, email } = req.body;
	const user = req.user;
	const file = req.file;
	const fileContent = fs.readFileSync(file.path);
  
	const fileName = `${uuidv4()}.xlsx`; // Generate a unique filename
  
	// Configure S3 upload parameters
	const params = {
	  Bucket: "dialwinbucket",
	  Key: fileName,
	  Body: fileContent
	};
  
	try {
	  // Upload file to S3 bucket
	 await s3Client.send(new PutObjectCommand(params));
  
	  // Delete the file from the server after uploading to S3
	  fs.unlinkSync(file.path);
  
	  // Parse date and time into a single formatted date
	  const dateTimeString = `${date} ${time}`;
	  const format = 'MM/DD/YYYY HH:mm:ss';
	  const formattedDate = dayjs(dateTimeString, format, true).toDate();
  
	  // Create campaign using createCampaignFunc
	  const campaignData = await createCampaignFunc(
		user.id,
		campaignName,
		formattedDate,
		formattedDate,
		isScheduled,
		isSendText,
		isSendEmail,
		message,
		email,
		fileName // Pass fileName to store in database or use later
	  );
  
	  // Format campaign data for storage or further processing
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
  
	  // Store campaign data in DynamoDB or other database
	  addCampaign(formattedCampaignData);
  
	  // Return success response
	  return res.status(200).send({
		code: res.statusCode,
		message: 'Campaign Created',
		campaign: campaignData
	  });
	} catch (error) {
	  console.error('Error uploading file to S3 or creating campaign:', error);
	  return res.status(500).send({
		code: 500,
		message: 'Error creating campaign',
		error: { message: error.message }
	  });
	}
  };
  
  module.exports = {
	createCampaign
  };
  