const AppointmentModel = require('../../../models/appointment.model');
const dynamicRouteModel = require('../../../models/dynamicRoutes.model');
const handler = require('../../../helpers/errorHandleHelpers/index');

const getScheduledMeetingData = async (req, res) => {
	try {
		const identityId = req.user.id;
		const existAppointment = await AppointmentModel.findOne({ identityID: identityId });

		if (existAppointment) {
			handler.successResponseHandler(res, existAppointment, 'Success');
			return;
		}
		handler.notFoundResponseHandler(res, 'Not Found Data!');
	} catch (error) {
		console.log(error);
		handler.unprocessableEntityResponseHandler(res, error.message || 'Unprocessable Entity');
	}
};

const validateExistingPath = async (req, res) => {
	try {
		const path = req.params;
		const existingPath = await dynamicRouteModel.findOne({ pathName: path?.name });

		if (existingPath) {
			const data = await AppointmentModel.findOne({ identityID: existingPath.identityID });
			handler.successResponseHandler(res, data, 'Success');
			return;
		}
		handler.notFoundResponseHandler(res, 'Not Found Data!');
	} catch (error) {
		console.log(error);
		handler.unprocessableEntityResponseHandler(res, error.message || 'Unprocessable Entity');
	}
};

module.exports = {
	getScheduledMeetingData,
	validateExistingPath
};
