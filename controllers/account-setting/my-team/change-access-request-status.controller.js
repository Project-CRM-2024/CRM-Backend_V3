'use strict';
const MyTeamModel = require('../../../models/my-team.model');
const { getAccessRequests } = require('../../../services/myteam.service');
const { addNotificationFunc } = require('../../../services/notification.service');

const changeAccessRequestStatus = async (req, res, next) => {
	const user = req.user;

	try {

		MyTeamModel.findOneAndUpdate(
			{ 'team._id': req.params.id },
			{ $set: { 'team.$.status': req.body.status } }, // Update to set the new status value
			{ new: true } // Option to return the updated document
		)
			.exec()
			.then(async (response) => {
				console.log('Updated response:', response);
				req.body.status && await addNotificationFunc(response.user._id, `${user.username}  ${req.body.status.toLowerCase()} your my team access request`);
				const data = await getAccessRequests(user.id);
				return res.status(200).send({
					code: res.statusCode,
					message: data ? 'Updated status successful' : 'Updated status unsuccessful',
					requests: data
				});
			})
			.catch((error) => {
				console.error('Error occurred:', error);
				return res.status(500).send({
					code: res.statusCode,
					message: 'Something went wrong',
					error: { message: error.message }
				});
			});
	} catch (error) {
		console.error('Error occurred:', error);
		return res.status(500).send({
			code: res.statusCode,
			message: 'Something went wrong',
			error: { message: error.message }
		});
	}
};

module.exports = changeAccessRequestStatus;
