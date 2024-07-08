'use strict';
const { getAccessRequests } = require('../../../services/myteam.service');

const fetchAccessRequests = async (req, res, next) => {
	const user = req.user;
	try {
		const data = await getAccessRequests(user.id);
		return res.status(200).send({
			code: res.statusCode,
			message: data ? 'Access Requests Found' : 'Access Requests Not Found',
			requests: data
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

module.exports = fetchAccessRequests;
