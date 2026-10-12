
const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema(
  {
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },

    maintenanceType: {
      type: String,
      enum: [
        "Oil Change",
        "Tire Replacement",
        "Engine Repair",
        "General Service",
        "Other",
      ],
      required: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    serviceDate: {
      type: Date,
      required: true,
    },

    nextServiceDate: {
      type: Date,
      default: null,
    },

    cost: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["Scheduled", "In Progress", "Completed"],
      default: "Scheduled",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Maintenance",
  maintenanceSchema
);
