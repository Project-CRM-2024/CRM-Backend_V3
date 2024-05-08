'use strict';
const jwt = require('jsonwebtoken');
const UserModel = require('../../models/user.model');
const bcrypt = require('bcrypt');

const loginController = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await UserModel.findOne({ email });

		if (!user || !bcrypt.compareSync(password, user.password)) {
			return res
				.status(401)
				.json({ message: 'Authentication failed: Invalid username or password' });
		}

		const token = jwt.sign(
			{
				user: {
					id: user._id,
					username: `${user.firstName} ${user.lastName}`,
					email: email,
					role: user.role
				}
			},
			'your_secret_key',
			{ expiresIn: '1h' }
		);

		return res.status(201).json({
			code: res.statusCode,
			message: 'Successfully logged in 😁',
			token: token,
			userId: user._id,
			role: user.role
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
};

module.exports = loginController;
