'use strict';
const { env } = require('process');
const { google } = require('googleapis');
const moment = require('moment');

const googleClientId =
	process.env.GOOGLE_CLIENT_ID ||
	'21936870861-mf5qdjouvkkpn2fnh0nj5vemm5jp2rl4.apps.googleusercontent.com';
const googleClientSecret =
	process.env.GOOGLE_CLIENT_SECRET || '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';

const oauth2Client = new google.auth.OAuth2(
	googleClientId,
	googleClientSecret,
	'http://localhost:5173'
);

const generateTokenFunc = async (code) => {
	console.log({ code, googleClientId, googleClientSecret });
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

const getCalendarEventsFunc = async (refresh_token, selectedDate) => {
	oauth2Client.setCredentials({
		refresh_token
	});
	const startDate = moment(selectedDate).subtract(60, 'days').startOf('day').toISOString();
	const endDate = moment(selectedDate).add(60, 'days').endOf('day').toISOString();

	const calendarEvents = await google.calendar({ version: 'v3', auth: oauth2Client }).events.list({
		calendarId: 'primary',
		timeMin: startDate,
		timeMax: endDate,
		// maxResults: 20,
		singleEvents: true,
		orderBy: 'startTime'
	});
	await google
		.calendar({ version: 'v3', auth: oauth2Client })
		.calendarList.list({}, (err, result) => console.log('Output: ' + result));
	return calendarEvents.data.items;
};

const createCalendarEventsFunc = async (refresh_token, eventDetails) => {
	const { title, description, startDateTime, endDateTime } = eventDetails;
	oauth2Client.setCredentials({
		refresh_token
	});

	const event = {
		summary: title,
		location: '800 Howard St., San Francisco, CA 94103',
		description: description,
		start: {
			dateTime: new Date(startDateTime).toISOString(),
			timeZone: 'GMT+05:30'
		},
		end: {
			dateTime: new Date(endDateTime).toISOString(),
			timeZone: 'GMT+05:30'
		},
		// recurrence: ['RRULE:FREQ=DAILY;COUNT=2'],
		// attendees: [{ email: 'lpage@example.com' }, { email: 'sbrin@example.com' }],
		reminders: {
			useDefault: false,
			overrides: [
				{ method: 'email', minutes: 24 * 60 },
				{ method: 'popup', minutes: 10 }
			]
		}
	};
	console.log(event);
	google.calendar({ version: 'v3', auth: oauth2Client }).events.insert(
		{
			calendarId: 'primary',
			resource: event
		},
		function (err, event) {
			if (err) {
				console.log('There was an error contacting the Calendar service: ' + err);
				return;
			}
			console.log('Event created');
		}
	);
};

const deleteCalendarEventFunc = async (refresh_token, eventId) => {
	oauth2Client.setCredentials({
		refresh_token
	});

	google.calendar({ version: 'v3', auth: oauth2Client }).events.delete(
		{
			calendarId: 'primary',
			eventId: eventId
		},
		function (err, event) {
			if (err) {
				console.log('There was an error contacting the Calendar service: ' + err);
				return;
			}
			console.log('Event deleted');
		}
	);
};

module.exports = {
	getCalendarEventsFunc,
	generateTokenFunc,
	createCalendarEventsFunc,
	deleteCalendarEventFunc
};
