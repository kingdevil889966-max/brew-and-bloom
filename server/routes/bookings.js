const express = require("express");

module.exports = (db) => {
  const router = express.Router();

  router.post("/", async (req, res) => {
    try {
      const { name, email, date, time, guests } = req.body;

      const cleanName = typeof name === "string" ? name.trim() : "";
      const cleanEmail = typeof email === "string" ? email.trim() : "";
      const today = new Date().toLocaleDateString("en-CA", {
        timeZone: "Asia/Kolkata",
      });

      if (
        !cleanName ||
        cleanName.length > 80 ||
        cleanEmail.length > 254 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) ||
        typeof date !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
        date < today ||
        typeof time !== "string" ||
        !/^\d{2}:\d{2}$/.test(time) ||
        time < "09:00" ||
        time > "21:59" ||
        !Number.isInteger(guests) ||
        guests < 1 ||
        guests > 12
      ) {
        return res.status(400).json({
          message: "Please enter valid booking details.",
        });
      }

      const [result] = await db.execute(
        `INSERT INTO bookings
        (name, email, booking_date, booking_time, guests)
        VALUES (?, ?, ?, ?, ?)`,
        [cleanName, cleanEmail, date, time, guests]
      );

      res.status(201).json({
        message: "Table booking saved successfully!",
        bookingId: result.insertId,
      });
    } catch (error) {
      console.error("Booking error:", error.message);
      res.status(500).json({
        message: "Unable to save booking.",
      });
    }
  });

  return router;
};