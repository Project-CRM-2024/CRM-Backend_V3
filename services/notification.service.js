const NotificationModel = require('../models/notifications.model');
const { emitMessage } = require('../socket');

const addNotificationFunc = async (user, content) => {
	try {
		return await NotificationModel.create({
			user,
			content
		})
			.then((response) => {
				emitMessage(user);
				return response;
			})
			.catch((error) => {
				throw new Error(error);
			});
	} catch (error) {
		throw new Error(error);
	}
};

const fetchUserNotificationFunc = async (user) => {
	try {
		return await NotificationModel.find({
			user
		})
			.sort({ createdAt: -1 })
			.then((response) => {
				return response;
			})
			.catch((error) => {
				throw new Error(error);
			});
	} catch (error) {
		throw new Error(error);
	}
};

module.exports = { addNotificationFunc, fetchUserNotificationFunc };
