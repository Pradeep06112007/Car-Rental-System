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

// Read optional extra URLs from Render's FRONTEND_URL variable
// (multiple URLs can be separated by commas).
const envOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((url) => url.trim().replace(/\/+$/, ""))
  .filter(Boolean);

// Include your main Vercel domain plus any extra URLs from FRONTEND_URL.
const allowedOrigins = [
  "https://car-rental-system-rxkd.vercel.app",
  ...envOrigins,
];

// Allow preview deployments belonging to your Vercel project.
const vercelPreviewPattern =
  /^https:\/\/car-rental-system-[a-z0-9-]+-pradeep06112007\.vercel\.app$/i;

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests without an Origin header (such as curl, Postman, or direct server calls)
    if (!origin) {
      return callback(null, true);
    }

    const cleanOrigin = origin.trim().replace(/\/+$/, "");

    // Allow your main Vercel domain and any configured FRONTEND_URLs
    if (allowedOrigins.includes(cleanOrigin)) {
      return callback(null, true);
    }

    // Allow your project's Vercel preview deployments
    if (vercelPreviewPattern.test(cleanOrigin)) {
      return callback(null, true);
    }

    // Allow localhost during local development
    if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(cleanOrigin)) {
      return callback(null, true);
    }

    console.log("Blocked CORS origin:", cleanOrigin);

    return callback(new Error("Origin not allowed by CORS"));
  },

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

  allowedHeaders: ["Content-Type", "Authorization"],

  credentials: false,
};

// Apply CORS middleware and handle preflight OPTIONS requests
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

// Parse incoming JSON request bodies
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