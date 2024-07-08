'use strict';
const NotificationModel = require('../../models/notifications.model');
const { fetchUserNotificationFunc } = require('../../services/notification.service');

const changeNotificationStatus = async (req, res, next) => {
	const user = req.user;
	try {
		NotificationModel.updateMany({ user: user.id }, { $set: { read: true } }, { multi: true })
			.exec()
			.then(async () => {
				const data = await fetchUserNotificationFunc(user.id);
				return res.status(200).send({
					code: res.statusCode,
					message: 'Fetch Notifications successfully',
					notifications: data
				});
			})
			.catch((error) => {
				throw new Error(error);
			});
	} catch (error) {
		console.error(error.message);
		res
			.status(500)
			.send({ code: 500, message: 'Something went wrong', error: { message: error.message } });
	}
};

module.exports = {
	changeNotificationStatus
};
