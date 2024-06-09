'use strict';
const { Router } = require('express');
const appointmentController = require('../controllers/account-setting/appointmentBooking/scheduleMeeting');
const getBookingDetails = require('../controllers/account-setting/appointmentBooking/getScheduled');
const uploads = require('../utils/uploader');
const authenticateJWT = require('../middlewares/auth/authenticate-jwt');

const bookingRouter = Router();

bookingRouter.post(
	'/appointment-details',
	uploads.single('logo'),
	authenticateJWT,
	appointmentController.makeAnAppointmentController
);
bookingRouter.get('/existing-path/:name', getBookingDetails.validateExistingPath);
bookingRouter.get('/get/appointment', authenticateJWT, getBookingDetails.getScheduledMeetingData);
bookingRouter.post('/scheduled/appointment', appointmentController.addAnEventToUserCalender);

module.exports = bookingRouter;
