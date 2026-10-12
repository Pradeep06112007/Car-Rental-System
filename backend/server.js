
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const carRoutes = require("./routes/carRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/bookings", bookingRoutes);

// Root test route
app.get("/", (req, res) => {
  res.json({
    message: "Car Rental System Backend is Running!",
  });
});

// Start server and connect to MongoDB
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);

  try {
    await connectDB();
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    console.log(
      "Backend remains running, but database features may be unavailable."
    );
  }
});
