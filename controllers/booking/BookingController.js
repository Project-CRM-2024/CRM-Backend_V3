
const Booking = require('../../models/Booking');

exports.createBooking = async (req, res) => {
  try {
    const { user, startTime, endTime, leadName, leadPhoneNumber, leadEmail } = req.body;

    if (!user || !startTime || !endTime || !leadName || !leadPhoneNumber || !leadEmail) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if the booking time slot is available
    const existingBooking = await Booking.findOne({
      $and: [
        { user },
        { $or: [
          { $and: [{ startTime: { $gte: startTime } }, { startTime: { $lt: endTime } }] },
          { $and: [{ endTime: { $gt: startTime } }, { endTime: { $lte: endTime } }] },
          { $and: [{ startTime: { $lte: startTime } }, { endTime: { $gte: endTime } }] }
        ]}
      ]
    });

    if (existingBooking) {
      return res.status(409).json({ message: 'Booking conflict: The time slot is not available' });
    }

    const newBooking = new Booking({
      user,
      startTime,
      endTime,
      leadName,
      leadPhoneNumber,
      leadEmail
    });
    await newBooking.save();

    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBookingsForUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const bookings = await Booking.find({ user: userId });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
