const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
	DynamoDBDocumentClient,
	PutCommand,
	GetCommand,
	ScanCommand
} = require('@aws-sdk/lib-dynamodb');
const { randomUUID } = require('crypto');
require('dotenv').config();

const client = new DynamoDBClient({
	region: 'us-east-1',
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
	}
});

const dynamoClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = 'crm-campaign';

const addCampaign = async (schedule) => {
	
	const params = {
		TableName: TABLE_NAME,
		Item: {
			id: randomUUID(),
			user: schedule?.id.toString(),
			date: schedule?.date,
			time: schedule?.time,
			email: schedule?.isSendEmail,
			sms: schedule?.isSendText,
			message: schedule?.message,
			emailBody: schedule?.email?.body,
			emailTitle: schedule?.email?.title
		}
	};

	try {
		return await dynamoClient.send(new PutCommand(params));
	} catch (error) {
		console.error('Error adding campaign:', error);
		throw new Error('Could not add campaign');
	}
};

const getCampaignById = async (id) => {
	const params = {
		TableName: TABLE_NAME,
		Key: {
			id
		}
	};

	try {
		return await dynamoClient.send(new GetCommand(params));
	} catch (error) {
		console.error('Error retrieving campaign by ID:', error);
		throw new Error('Could not retrieve campaign');
	}
};

const getCampaigns = async () => {
	const params = {
		TableName: TABLE_NAME
	};

	try {
		const data = await dynamoClient.send(new ScanCommand(params));
		return data.Items;
	} catch (error) {
		console.error('Error retrieving campaigns:', error);
		throw new Error('Could not retrieve campaigns');
	}
};

module.exports = {
	dynamoClient,
	addCampaign,
	getCampaigns,
	getCampaignById
};
