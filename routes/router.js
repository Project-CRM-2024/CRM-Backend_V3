'use strict';
const { Router } = require('express');
const indexController = require('../controllers/index.controller');
const authRouter = require('./auth.routes');
const profileRouter = require('./profile.routes');
const phoneNumbersRouter = require('./phoneNumbers.routes');
const myTeamRouter = require('./my-team.routes');
const notificationRouter = require('./notifications-routes');
const calendarRouter = require('./calendar.routes');
const bookingRouter = require('./booking.routes');

const router = Router();

router.use('/auth', authRouter);
router.use('/profile', profileRouter);
router.use('/my-team', myTeamRouter);
router.use('/phone-numbers', phoneNumbersRouter);
router.use('/notifications', notificationRouter);
router.use('/calendars', calendarRouter);
router.use('/bookings', bookingRouter);

router.get('/', indexController);

module.exports = router;
