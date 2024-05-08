'use strict';

const { fetchUserNotificationFunc } = require('../../services/notification.service');

const fetchUserNotification = async (req, res, next) => {
	const user = req.user;
	try {
		const data = await fetchUserNotificationFunc(user.id);
		return res.status(200).send({
			code: res.statusCode,
			message: 'Fetch Notifications successfully',
			notifications: data
		});
	} catch (error) {
		console.error(error.message);
		res
			.status(500)
			.send({ code: 500, message: 'Something went wrong', error: { message: error.message } });
	}
};

module.exports = {
	fetchUserNotification
};

