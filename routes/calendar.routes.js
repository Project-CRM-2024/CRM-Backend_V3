const { Router } = require('express');
const { createCalendarEvent } = require('../controllers/calendar/create-calendar-event');
const { deleteCalendarEvent } = require('../controllers/calendar/delete-calendar-event');
const { generateRefreshToken } = require('../controllers/calendar/generate-refresh-token');
const { getCalendarEvents } = require('../controllers/calendar/get-calendar-events');
const { removeGoogleAccount } = require('../controllers/calendar/remove-google-account');
const authenticateJWT = require('../middlewares/auth/authenticate-jwt');

const calendarRouter = Router();

calendarRouter.post('/generate-refresh-token', authenticateJWT, generateRefreshToken);
calendarRouter.post('/fetch-calendar-events', authenticateJWT, getCalendarEvents);
calendarRouter.post('/create-calendar-event', authenticateJWT, createCalendarEvent);
calendarRouter.delete('/delete-calendar-event/:eventId', authenticateJWT, deleteCalendarEvent);
calendarRouter.delete('/remove-google-account', authenticateJWT, removeGoogleAccount);

module.exports = calendarRouter;
