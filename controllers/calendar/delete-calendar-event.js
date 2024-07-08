'use strict';
const UserModel = require('../../models/user.model');
const { deleteCalendarEventFunc } = require('../../services/google-api.service');

const deleteCalendarEvent = async (req, res, next) => {
	const user = req.user;
	const { eventId } = req.params;
	try {
		const userResponse = await UserModel.findById(user.id);
		if (userResponse.googleRefreshToken) {
			await deleteCalendarEventFunc(userResponse.googleRefreshToken, eventId);
			return res.status(200).send({
				code: res.statusCode,
				message: 'Delete calendar event successfully'
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
	deleteCalendarEvent
};
