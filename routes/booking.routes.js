'use strict';

const { Router } = require('express');
const bookingController = require('../controllers/booking/BookingController');

const router = Router();

router.post('/create', bookingController.createBooking);
router.get('/user/:userId', bookingController.getBookingsForUser);


module.exports = router;
