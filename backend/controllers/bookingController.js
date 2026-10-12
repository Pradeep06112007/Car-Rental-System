
const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Car = require("../models/Car");

// POST /api/bookings - Create a booking
const createBooking = async (req, res) => {
  try {
    const { carId, startDate, endDate } = req.body;

    if (!carId || !startDate || !endDate) {
      return res.status(400).json({
        message: "Please provide carId, startDate, and endDate",
      });
    }

    if (!mongoose.isValidObjectId(carId)) {
      return res.status(400).json({
        message: "Invalid car ID",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      start < today ||
      end <= start
    ) {
      return res.status(400).json({
        message: "Please provide valid future rental dates",
      });
    }

    const car = await Car.findById(carId);

    if (!car || !car.isAvailable) {
      return res.status(404).json({
        message: "Car not found or unavailable",
      });
    }

    // Calculate rental days and total amount
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const days = Math.ceil(
      (end.getTime() - start.getTime()) / millisecondsPerDay
    );
    const totalAmount = days * car.pricePerDay;

    // Prevent overlapping active bookings
    const overlappingBooking = await Booking.findOne({
      car: carId,
      bookingStatus: { $in: ["Pending", "Confirmed"] },
      startDate: { $lt: end },
      endDate: { $gt: start },
    });

    if (overlappingBooking) {
      return res.status(409).json({
        message: "Car is already booked for those dates",
      });
    }

    // Save the booking
    const booking = await Booking.create({
      user: req.user.id,
      car: car._id,
      startDate: start,
      endDate: end,
      totalAmount,
    });

    // Explicitly return the amount and booking details
    return res.status(201).json({
      message: "Booking created successfully",
      booking: {
        _id: booking._id,
        user: booking.user,
        car: booking.car,
        startDate: booking.startDate,
        endDate: booking.endDate,
        totalAmount: booking.totalAmount,
        bookingStatus: booking.bookingStatus,
        paymentStatus: booking.paymentStatus,
        createdAt: booking.createdAt,
      },
    });
  } catch (error) {
    console.error("Create booking error:", error);

    return res.status(500).json({
      message: error.message || "Failed to create booking",
    });
  }
};

// GET /api/bookings/my - Get current user's bookings
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user.id,
    })
      .populate("car")
      .sort({ createdAt: -1 });

    return res.status(200).json(bookings);
  } catch (error) {
    console.error("Get bookings error:", error);

    return res.status(500).json({
      message: "Failed to retrieve bookings",
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
};
