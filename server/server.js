const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
require("dotenv").config();

const app = express();

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://brew-and-bloom-omega.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
  })
);

app.use(express.json({ limit: "1mb" }));

// MySQL connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "brew_bloom",
  waitForConnections: true,
  connectionLimit: 10,
});

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Brew & Bloom API is running!",
  });
});

// Database test route
app.get("/api/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 AS connected");

    res.json({
      message: "MySQL connected successfully!",
      result: rows[0],
    });
  } catch (error) {
    console.error("MySQL error:", error.message);

    res.status(500).json({
      message: "MySQL connection failed",
    });
  }
});

// Table booking routes
app.use("/api/bookings", require("./routes/bookings")(db));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", async () => {
  console.log(`Brew & Bloom API running on port ${PORT}`);

  try {
    await db.query("SELECT 1");
    console.log("MySQL connected successfully");
  } catch (error) {
    console.error("MySQL connection failed:", error.message);
  }
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  await db.end();
  process.exit(0);
});