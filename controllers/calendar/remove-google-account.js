'use strict';
const UserModel = require('../../models/user.model');

const removeGoogleAccount = async (req, res, next) => {
	const user = req.user;
	try {
		UserModel.updateOne({ _id: user.id }, { $set: { googleRefreshToken: null } }, { multi: true })
			.exec()
			.then(async () => {
				return res.status(200).send({
					code: res.statusCode,
					message: 'Removed google account successfully'
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
	removeGoogleAccount
};
