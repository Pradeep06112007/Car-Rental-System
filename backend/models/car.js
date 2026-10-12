
const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      required: true,
      trim: true,
    },

    model: {
      type: String,
      required: true,
      trim: true,
    },

    year: {
      type: Number,
      required: true,
      min: 1900,
    },

    category: {
      type: String,
      enum: [
        "Hatchback",
        "Sedan",
        "SUV",
        "Luxury",
        "Electric",
      ],
      required: true,
    },

    pricePerDay: {
      type: Number,
      required: true,
      min: 0,
    },

    seats: {
      type: Number,
      required: true,
      min: 1,
    },

    transmission: {
      type: String,
      enum: ["Manual", "Automatic"],
      required: true,
    },

    fuelType: {
      type: String,
      enum: ["Petrol", "Diesel", "Electric", "Hybrid", "CNG"],
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Car", carSchema);
