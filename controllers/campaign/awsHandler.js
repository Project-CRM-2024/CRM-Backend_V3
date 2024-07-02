const express = require('express');
require('dotenv').config();
const { CloudWatchEventsClient, PutRuleCommand, PutTargetsCommand } = require('@aws-sdk/client-cloudwatch-events');
const { LambdaClient, AddPermissionCommand } = require('@aws-sdk/client-lambda');
const { fromIni } = require('@aws-sdk/credential-providers');
const { MongoClient } = require('mongodb');

// MongoDB connection string
const uri = 'mongodb+srv://crm2024sl:crm2024sl@cluster0.mnrwik1.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Your AWS account ID
const accountId = '637423616167';

// Create a CloudWatchEventsClient with the "dialwin-scheduler" profile
const cloudWatchEvent = new CloudWatchEventsClient({
    region: 'us-east-1',
    credentials: fromIni({ profile: 'dialwin-scheduler' })
});

const lambda = new LambdaClient({
    region: 'us-east-1',
    credentials: fromIni({ profile: 'dialwin-scheduler' })
});

const retry = async (fn, retries = 5, delay = 1000) => {
    try {
        return await fn();
    } catch (error) {
        if (retries === 0 || error.name !== 'ConcurrentModificationException') {
            throw error;
        }
        console.log(`Retrying due to ConcurrentModificationException... (${retries} retries left)`);
        await new Promise(res => setTimeout(res, delay));
        return retry(fn, retries - 1, delay * 2); // Exponential backoff
    }
};

const smsHandler = async () => {
    try {
        await client.connect();
        const database = client.db('test'); // Replace with your database name
        const collection = database.collection('campaigns'); // Replace with your collection name

        // Fetch all documents where isScheduled is true
        const cursor = collection.find({ isScheduled: true });
        await cursor.forEach(async (doc) => {
            const adminId = doc.user; // Assuming user field contains adminId
            const scheduleTime = new Date(doc.time); // Assuming time field contains schedule time
            const scheduleDate = new Date(doc.date); // Assuming date field contains schedule date

            const ruleName = `${adminId}-schedule-rule`;
            const cronExpression = `cron(${scheduleTime.getUTCMinutes()} ${scheduleTime.getUTCHours()} ${scheduleDate.getUTCDate()} ${scheduleDate.getUTCMonth() + 1} ? ${scheduleDate.getUTCFullYear()})`; // Cron expression
            const ruleParams = {
                Name: ruleName,
                ScheduleExpression: cronExpression,
                State: 'ENABLED',
            };

            const targetParams = {
                Rule: ruleName,
                Targets: [
                    {
                        Arn: process.env.LAMBDA_ARN || 'arn:aws:lambda:us-east-1:637423616167:function:dialwin-sms', // Replace with your Lambda ARN
                        Id: '1', // Unique identifier for the target
                    },
                ],
            };

            // Create or update the CloudWatch Events rule
            await retry(() => cloudWatchEvent.send(new PutRuleCommand(ruleParams)));

            // Add Lambda function as the target of the rule
            await retry(() => cloudWatchEvent.send(new PutTargetsCommand(targetParams)));

            // Add permission for CloudWatch Events to invoke the Lambda function
            const addPermissionParams = {
                Action: 'lambda:InvokeFunction',
                FunctionName: process.env.LAMBDA_ARN || 'arn:aws:lambda:us-east-1:637423616167:function:dialwin-sms',
                Principal: 'events.amazonaws.com',
                StatementId: `AllowExecutionFromCloudWatch-${ruleName}-${new Date().getTime()}`,
                SourceArn: `arn:aws:events:us-east-1:${accountId}:rule/${ruleName}`
            };

            await retry(() => lambda.send(new AddPermissionCommand(addPermissionParams)));
        });
        console.log("Schedules set successfully");
    } catch (err) {
        console.error('Error setting schedules:', err);
    } finally {
        console.log("Schedules set successfully finally");
        await client.close();
    }
}

smsHandler();
