'use strict';

const { fetchUserDetailsFunc } = require('../../services/auth.service');

const fetchUserDetails = async (req, res, next) => {
	const user = req.user;
	try {
		const data = await fetchUserDetailsFunc(user.id);
		return res.status(200).send({
			code: res.statusCode,
			message: 'Fetch User successfully',
			user: data
		});
	} catch (error) {
		console.error(error.message);
		res
			.status(500)
			.send({ code: 500, message: 'Something went wrong', error: { message: error.message } });
	}
};

module.exports = {
	fetchUserDetails
};

