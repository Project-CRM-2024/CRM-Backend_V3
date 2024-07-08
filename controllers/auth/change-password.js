'use strict';
const bcrypt = require('bcrypt');
const UserModel = require('../../models/user.model');

const changePasswordController = async (req, res, next) => {
	const { password } = req.body;
	const user = req.user;
	try {
		const userResponse = await UserModel.findById(user.id);

		if (!userResponse) {
			return res.status(404).json({ message: 'User not found' });
		}

		// Number of rounds hash function will execute
		const salt = await bcrypt.genSalt(10);

		const hashedPassword = await bcrypt.hashSync(password, salt);

		// Update the user's password
		userResponse.password = hashedPassword;
		await userResponse.save();

		return res.status(200).send({
			code: res.statusCode,
			message: 'Password updated successfully'
		});
	} catch (error) {
		console.error(error.message);
		res
			.status(500)
			.send({ code: 500, message: 'Something went wrong', error: { message: error.message } });
	}
};

module.exports = changePasswordController;
