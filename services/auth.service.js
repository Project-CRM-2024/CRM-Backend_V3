const UserModel = require('../models/user.model');

const fetchUserDetailsFunc = async (userId) => {
	try {
		return await UserModel.findById(userId).select("-password")
			.then((response) => {
				console.log(response)
				const user = response;

				const userResponse = {
					...user._doc,
					googleAccountExist : response.googleRefreshToken ? true : false
				}

				delete userResponse.googleRefreshToken;
				return userResponse;
			})
			.catch((error) => {
				throw new Error(error);
			});
	} catch (error) {
		throw new Error(error);
	}
};

const saveRefreshTokenFunc = async (userId, googleRefreshToken) => {
	UserModel.updateMany(
		{ _id: userId },
		{ $set: { googleRefreshToken: googleRefreshToken } },
		{ multi: true }
	)
		.exec()
		.then(() => {
			return 'Refresh token updated successfully';
		})
		.catch((error) => {
			throw new Error(error);
		});
};

module.exports = { fetchUserDetailsFunc, saveRefreshTokenFunc };
