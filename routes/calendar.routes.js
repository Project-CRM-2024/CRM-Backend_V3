const { Router } = require('express');
const { generateRefreshToken } = require('../controllers/calendar/generate-refresh-token');
const {getCalendarEvents} = require('../controllers/calendar/get-calendar-events');
const authenticateJWT = require('../middlewares/auth/authenticate-jwt');

const calendarRouter = Router();

calendarRouter.post('/generate-refresh-token', authenticateJWT, generateRefreshToken);
calendarRouter.get('/fetch-calendar-events', authenticateJWT, getCalendarEvents);

module.exports = calendarRouter;
