'use strict';
const MyTeamModel = require('../models/my-team.model');

const getSupervisorsListForMyTeam = async (user) => {
	try {
		const myTeams = await MyTeamModel.findOne({ user }).populate({
			path: 'team.user'
		});

		if (myTeams) {
			const supervisorList = myTeams.team.map((item) => {
				//Until implement user roles and status
				if (item.user.role === 'user' || true) {
					return {
						_id: item.user._id,
						firstName: item.user.firstName,
						lastName: item.user.lastName,
						email: item.user.email
					};
				}
			});
			return supervisorList;
		} else {
			return [];
		}
	} catch (error) {
		throw new Error(error);
	}
};

const getAgentsListForMyTeam = async (user) => {
	try {
		const myTeams = await MyTeamModel.findOne({ user }).populate({
			path: 'team.user'
		});

		if (myTeams) {
			const agentList = myTeams.team.map((item) => {
				//Until implement user roles and status
				if (item.user.role === 'user' || true) {
					return {
						_id: item.user._id,
						firstName: item.user.firstName,
						lastName: item.user.lastName,
						email: item.user.email
					};
				}
			});
			return agentList;
		} else {
			return [];
		}
	} catch (error) {
		throw new Error(error);
	}
};

const getAccessRequests = async (user) => {
	try {
		const teams = await MyTeamModel.find({ 'team.user': user })
			.populate({
				path: 'team.user'
			})
			.populate({
				path: 'user'
			})
			.exec()
			.catch((error) => {
				throw new Error(error);
			});

		if (teams.length) {
			const data = teams.map((team) => ({
				documentId: team._id,
				requestId: team.team.find((member) => member.user._id.toString() === user)._id,
				email: team.user.email,
				firstName: team.user.firstName,
				lastName: team.user.lastName,
				userIdForAccess: team.user._id,
				status: team.team.find((member) => member.user._id.toString() === user).status
			}));
			console.log('data ss', data);
			return data;
		} else {
			return [];
		}
	} catch (error) {
		throw new Error(error);
	}
};

module.exports = { getSupervisorsListForMyTeam, getAgentsListForMyTeam, getAccessRequests };
