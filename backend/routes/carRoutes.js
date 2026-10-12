
const express = require("express");
const {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
} = require("../controllers/carController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", getCars);
router.get("/:id", getCarById);

// Admin-only routes
router.post("/", protect, adminOnly, createCar);
router.put("/:id", protect, adminOnly, updateCar);
router.delete("/:id", protect, adminOnly, deleteCar);

module.exports = router;
