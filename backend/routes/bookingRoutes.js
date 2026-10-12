
const express = require("express");
const {
  createBooking,
  getMyBookings,
} = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Both booking routes require a logged-in user
router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);

module.exports = router;
