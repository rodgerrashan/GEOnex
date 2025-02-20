const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Site Survey Backend is running!" });
});

// Route to fetch IoT data (mock example)
app.get("/iot-data", (req, res) => {
  res.json({
    deviceId: "receiver-123",
    latitude: 12.345678,
    longitude: 98.765432,
    battery: 85,
    lastUpdated: new Date().toISOString(),
  });
});

module.exports = app;
