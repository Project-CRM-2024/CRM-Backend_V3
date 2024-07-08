'use strict';
const UserModel = require('../../models/user.model');
const { createCalendarEventsFunc } = require('../../services/google-api.service');

const createCalendarEvent = async (req, res, next) => {
	const user = req.user;
	const eventDetails = req.body;
	try {
		const userResponse = await UserModel.findById(user.id);
		if (userResponse.googleRefreshToken) {
			await createCalendarEventsFunc(userResponse.googleRefreshToken, eventDetails);
			return res.status(200).send({
				code: res.statusCode,
				message: 'Create calendar event successfully'
			});
		} else {
			return res.status(400).send({
				code: res.statusCode,
				message: 'Not Found google account to this user'
			});
		}
	} catch (error) {
		console.error(error.message);
		res
			.status(500)
			.send({ code: 500, message: 'Something went wrong', error: { message: error.message } });
	}
};

module.exports = {
	createCalendarEvent
};
