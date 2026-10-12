
const mongoose = require("mongoose");
const Car = require("../models/Car");

// GET /api/cars - Get all cars
const getCars = async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    return res.status(200).json(cars);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to retrieve cars",
    });
  }
};

// GET /api/cars/:id - Get one car
const getCarById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid car ID" });
    }

    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    return res.status(200).json(car);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to retrieve car",
    });
  }
};

// POST /api/cars - Add a car (admin only)
const createCar = async (req, res) => {
  try {
    const {
      name,
      brand,
      model,
      year,
      category,
      pricePerDay,
      seats,
      transmission,
      fuelType,
      image,
      description,
    } = req.body;

    if (
      !name ||
      !brand ||
      !model ||
      !year ||
      !category ||
      pricePerDay == null ||
      seats == null ||
      !transmission ||
      !fuelType
    ) {
      return res.status(400).json({
        message: "Please provide all required car details",
      });
    }

    const car = await Car.create({
      name,
      brand,
      model,
      year,
      category,
      pricePerDay,
      seats,
      transmission,
      fuelType,
      image,
      description,
    });

    return res.status(201).json(car);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create car",
    });
  }
};

// PUT /api/cars/:id - Update a car (admin only)
const updateCar = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid car ID" });
    }

    const car = await Car.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    return res.status(200).json(car);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update car",
    });
  }
};

// DELETE /api/cars/:id - Delete a car (admin only)
const deleteCar = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid car ID" });
    }

    const car = await Car.findByIdAndDelete(req.params.id);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    return res.status(200).json({
      message: "Car deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete car",
    });
  }
};

module.exports = {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
};
