// models/Booking.js

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  leadName: { type: String, required: true },
  leadPhoneNumber: { type: String, required: true },
  leadEmail: { type: String, required: true },
  status: { type: String, enum: ['confirmed', 'pending', 'canceled'], default: 'pending' },
  // Add more fields as needed
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
