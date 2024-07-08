'use strict';

const { saveRefreshTokenFunc } = require('../../services/auth.service');
const { generateTokenFunc } = require('../../services/google-api.service');

const generateRefreshToken = async (req, res, next) => {
	const user = req.user;
	const { code } = req.body;
	try {
		const response = await generateTokenFunc(code);
		console.log(response.tokens.refresh_token);
		saveRefreshTokenFunc(user.id, response.tokens.refresh_token);
		return res.status(200).send({
			code: res.statusCode,
			message: 'Fetch Calendar events successfully',
			events: response
		});
	} catch (error) {
		console.error(error.message);
		res
			.status(500)
			.send({ code: 500, message: 'Something went wrong', error: { message: error.message } });
	}
};

module.exports = {
	generateRefreshToken
};
