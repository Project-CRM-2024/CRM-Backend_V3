'use strict';
const { env } = require('process');
const { google } = require('googleapis');

const googleClientId = process.env.GOOGLE_CLIENT_ID || "21936870861-mf5qdjouvkkpn2fnh0nj5vemm5jp2rl4.apps.googleusercontent.com";
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || "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";

const oauth2Client = new google.auth.OAuth2(
	googleClientId,
	googleClientSecret,
	'http://localhost:5173'
);

const generateTokenFunc = async (code) => {
	console.log({code, googleClientId, googleClientSecret})
	try {
		const oauth2Client = new google.auth.OAuth2(
			googleClientId,
			googleClientSecret,
			'http://localhost:5173'
		);
		const response = await oauth2Client.getToken(code);
		return response;
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
};

const getCalendarEventsFunc = async (refresh_token) => { 
	oauth2Client.setCredentials({
		refresh_token
	});
    
    const calendarEvents = await google.calendar({ version: "v3", auth: oauth2Client }).events.list({
		calendarId: 'primary',
		timeMin: new Date().toISOString(),
		// maxResults: 20,
		singleEvents: true,
		orderBy: 'startTime',
	  });
	console.log(calendarEvents.data.items)
    return calendarEvents.data.items
};

module.exports = {
    getCalendarEventsFunc,
    generateTokenFunc
};