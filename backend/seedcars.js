
const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Car = require("./models/Car");

const sampleCars = [
  {
    name: "Swift Dzire",
    brand: "Maruti Suzuki",
    model: "Dzire",
    year: 2024,
    category: "Sedan",
    pricePerDay: 1800,
    seats: 5,
    transmission: "Manual",
    fuelType: "Petrol",
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8",
    description: "Comfortable sedan for city trips.",
    isAvailable: true,
  },
  {
    name: "Hyundai Creta",
    brand: "Hyundai",
    model: "Creta",
    year: 2024,
    category: "SUV",
    pricePerDay: 2800,
    seats: 5,
    transmission: "Automatic",
    fuelType: "Petrol",
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b",
    description: "Spacious SUV for family journeys.",
    isAvailable: true,
  },
  {
    name: "Toyota Innova",
    brand: "Toyota",
    model: "Innova",
    year: 2023,
    category: "SUV",
    pricePerDay: 3500,
    seats: 7,
    transmission: "Manual",
    fuelType: "Diesel",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2",
    description: "Roomy vehicle for group travel.",
    isAvailable: true,
  },
];

async function seedCars() {
  try {
    await connectDB();
    await Car.deleteMany({});
    await Car.insertMany(sampleCars);
    console.log("Sample cars added successfully.");
  } catch (error) {
    console.error("Failed to add sample cars:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedCars();
