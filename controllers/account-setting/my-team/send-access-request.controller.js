'use strict';
const UserModel = require('../../../models/user.model');
const MyTeam = require('../../../models/my-team.model');
const { addNotificationFunc } = require('../../../services/notification.service');
const sendAccessRequest = async (req, res, next) => {
	try {
		const { emailList } = req.body;
		const user = req.user;
		//All users should be able to send access requests to add members to their team.
		const currentUserDetails = await UserModel.findById(user.id);

		const myTeam = await MyTeam.findOne({ user: user.id }).populate({
			path: 'team.user',
			select: 'email'
		});

		if (myTeam !== null) {
			const existingEmails = myTeam.team.map((member) => member.user.email);
			let filteredEmailList = [];
			if (existingEmails.length > 0) {
				filteredEmailList = emailList.filter((email) => !existingEmails.includes(email));
			} else {
				filteredEmailList = emailList;
			}

			const userList = await UserModel.find({ email: { $in: filteredEmailList } });

			const refactorTeamObj = userList.map((user) => ({
				user: user,
				status: 'PENDING'
			}));

			if (refactorTeamObj.length) {
				MyTeam.findOneAndUpdate(
					{ user: user.id },
					{ $push: { team: { $each: refactorTeamObj } } },
					{ new: true }
				)
					.then(async (response) => {
						await userList.forEach(async (user) => {
							await addNotificationFunc(user._id, `${currentUserDetails.firstName} ${currentUserDetails.lastName} requested my team access from you`);
						})
						res.status(200).send(response);
					})
					.catch((error) => {
						res.status(400).send({ error: error.message });
					});
			} else {
				res.status(404).send({ message: 'No accounts adding found for email list' });
			}
		} else {
			const userList = await UserModel.find({ email: { $in: emailList } });
			const refactorTeamObj = await userList.map((userItem) => ({
				user: userItem,
				status: 'PENDING'
			}));
			console.log("refactorTeamObj", refactorTeamObj)

			await MyTeam.create({
				user: user.id,
				team: refactorTeamObj
			})
				.then(async (response) => {
					await userList.forEach(async (user) => {
						await addNotificationFunc(user._id, `${currentUserDetails.firstName} ${currentUserDetails.lastName} requested my team access from you`);
					})
					res.status(200).send(response);
				})
				.catch((error) => {
					console.error(error)
					res.status(400).send({ error: error.message });
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
	sendAccessRequest
};
