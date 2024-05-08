'use strict';
const UserModel = require('../../models/user.model');
const { getCalendarEventsFunc } = require('../../services/google-api.service');

const getCalendarEvents = async (req, res, next) => {
	const user = req.user;
	try {
		const userResponse = await UserModel.findById(user.id);
		console.log(userResponse)
		if (userResponse.googleRefreshToken) {
			const data = await getCalendarEventsFunc(userResponse.googleRefreshToken);
			return res.status(200).send({
				code: res.statusCode,
				message: 'Fetch Calendar events successfully',
				events: data
			});
		} else {
			return res.status(400).send({
				code: res.statusCode,
				message: 'Not Found google account to this user',
				events: []
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
	getCalendarEvents
};

