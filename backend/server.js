
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const carRoutes = require("./routes/carRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

// ======================================
// CORS CONFIGURATION
// ======================================

// Read allowed production URLs from Render.
// Multiple URLs can be separated by commas.
const allowedOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((url) => url.trim().replace(/\/+$/, ""))
  .filter(Boolean);

// Allow only deployments belonging to your Vercel project.
const vercelPreviewPattern =
  /^https:\/\/car-rental-system-[a-z0-9-]+-pradeep06112007\.vercel\.app$/i;

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests without an Origin header
    if (!origin) {
      return callback(null, true);
    }

    // Allow configured production domains
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow your project's Vercel preview deployments
    if (vercelPreviewPattern.test(origin)) {
      return callback(null, true);
    }

    // Allow localhost during development only
    if (
      process.env.NODE_ENV !== "production" &&
      /^http:\/\/localhost(:\d+)?$/.test(origin)
    ) {
      return callback(null, true);
    }

    console.log("Blocked CORS origin:", origin);

    return callback(new Error("Origin not allowed by CORS"));
  },

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

  allowedHeaders: ["Content-Type", "Authorization"],

  credentials: false,
};

// Apply CORS middleware.
// This also handles browser preflight OPTIONS requests.
app.use(cors(corsOptions));

// Parse JSON requests
app.use(express.json());

// ======================================
// API ROUTES
// ======================================

app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/bookings", bookingRoutes);

// ======================================
// ROOT TEST ROUTE
// ======================================

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Car Rental System Backend is Running!",
  });
});

// ======================================
// START SERVER
// ======================================

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start backend:", error.message);
    process.exit(1);
  }
}

startServer();
