
const mongoose = require("mongoose");
require("dotenv").config();

const Car = require("./models/Car");

const cars = [
  {
    name: "Swift",
    brand: "Maruti Suzuki",
    model: "Swift VXi",
    year: 2025,
    category: "Hatchback",
    pricePerDay: 1500,
    seats: 5,
    transmission: "Manual",
    fuelType: "Petrol",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80",
    description: "Compact and economical city car."
  },
  {
    name: "Baleno",
    brand: "Maruti Suzuki",
    model: "Baleno Zeta",
    year: 2025,
    category: "Hatchback",
    pricePerDay: 1800,
    seats: 5,
    transmission: "Automatic",
    fuelType: "Petrol",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=900&q=80",
    description: "Comfortable premium hatchback."
  },
  {
    name: "i20",
    brand: "Hyundai",
    model: "i20 Sportz",
    year: 2024,
    category: "Hatchback",
    pricePerDay: 1900,
    seats: 5,
    transmission: "Manual",
    fuelType: "Petrol",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80",
    description: "Stylish hatchback for everyday trips."
  },
  {
    name: "Dzire",
    brand: "Maruti Suzuki",
    model: "Dzire VXi",
    year: 2025,
    category: "Sedan",
    pricePerDay: 2000,
    seats: 5,
    transmission: "Manual",
    fuelType: "Petrol",
    image: "https://images.unsplash.com/photo-1552519507-88aa2dfa9fdb?auto=format&fit=crop&w=900&q=80",
    description: "Practical sedan for city and highway travel."
  },
  {
    name: "City",
    brand: "Honda",
    model: "City V",
    year: 2024,
    category: "Sedan",
    pricePerDay: 2800,
    seats: 5,
    transmission: "Automatic",
    fuelType: "Petrol",
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=900&q=80",
    description: "Spacious sedan with a comfortable cabin."
  },
  {
    name: "Verna",
    brand: "Hyundai",
    model: "Verna SX",
    year: 2025,
    category: "Sedan",
    pricePerDay: 3000,
    seats: 5,
    transmission: "Automatic",
    fuelType: "Petrol",
    image: "https://images.unsplash.com/photo-1502161254066-6c74afbf07aa?auto=format&fit=crop&w=900&q=80",
    description: "Modern sedan for longer journeys."
  },
  {
    name: "Nexon",
    brand: "Tata",
    model: "Nexon Creative",
    year: 2025,
    category: "SUV",
    pricePerDay: 2500,
    seats: 5,
    transmission: "Manual",
    fuelType: "Diesel",
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80",
    description: "Versatile compact SUV."
  },
  {
    name: "Creta",
    brand: "Hyundai",
    model: "Creta SX",
    year: 2025,
    category: "SUV",
    pricePerDay: 3200,
    seats: 5,
    transmission: "Automatic",
    fuelType: "Diesel",
    image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=900&q=80",
    description: "Comfortable SUV for family travel."
  },
  {
    name: "Seltos",
    brand: "Kia",
    model: "Seltos HTK",
    year: 2024,
    category: "SUV",
    pricePerDay: 3000,
    seats: 5,
    transmission: "Manual",
    fuelType: "Petrol",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80",
    description: "Sporty SUV for city and highway trips."
  },
  {
    name: "Ertiga",
    brand: "Maruti Suzuki",
    model: "Ertiga ZXi",
    year: 2025,
    category: "SUV",
    pricePerDay: 3500,
    seats: 7,
    transmission: "Manual",
    fuelType: "Petrol",
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=900&q=80",
    description: "Seven-seat option for family groups."
  },
  {
    name: "Innova Crysta",
    brand: "Toyota",
    model: "Crysta GX",
    year: 2024,
    category: "SUV",
    pricePerDay: 4500,
    seats: 7,
    transmission: "Manual",
    fuelType: "Diesel",
    image: "https://images.unsplash.com/photo-1517026575980-3e1e2dedeab4?auto=format&fit=crop&w=900&q=80",
    description: "Spacious MPV for group travel."
  },
  {
    name: "Fortuner",
    brand: "Toyota",
    model: "Fortuner 4x2",
    year: 2025,
    category: "Luxury",
    pricePerDay: 7500,
    seats: 7,
    transmission: "Automatic",
    fuelType: "Diesel",
    image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=80",
    description: "Premium SUV for longer road trips."
  },
  {
    name: "Thar",
    brand: "Mahindra",
    model: "Thar LX",
    year: 2025,
    category: "SUV",
    pricePerDay: 5000,
    seats: 4,
    transmission: "Automatic",
    fuelType: "Petrol",
    image: "https://images.unsplash.com/photo-1519245659620-e859806a8d3b?auto=format&fit=crop&w=900&q=80",
    description: "Rugged SUV for adventure-style drives."
  },
  {
    name: "Model 3",
    brand: "Tesla",
    model: "Model 3",
    year: 2025,
    category: "Electric",
    pricePerDay: 8000,
    seats: 5,
    transmission: "Automatic",
    fuelType: "Electric",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=900&q=80",
    description: "Electric sedan concept for demonstration."
  },
  {
    name: "C-Class",
    brand: "Mercedes-Benz",
    model: "C-Class",
    year: 2025,
    category: "Luxury",
    pricePerDay: 9000,
    seats: 5,
    transmission: "Automatic",
    fuelType: "Petrol",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=900&q=80",
    description: "Luxury sedan for premium travel."
  }
];

async function seedCars() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from backend/.env");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected.");

    let added = 0;
    let updated = 0;

    for (const car of cars) {
      const existing = await Car.findOne({
        name: car.name,
        brand: car.brand,
        model: car.model
      });

      if (existing) {
        await Car.updateOne(
          { _id: existing._id },
          { $set: car }
        );
        updated++;
      } else {
        await Car.create(car);
        added++;
      }
    }

    console.log(`Seed complete: ${added} added, ${updated} updated.`);
    console.log(`Total sample vehicles in this script: ${cars.length}`);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedCars();
