// backend/src/routes/weatherRoutes.js
const express = require("express");
const router = express.Router();
const { getWeather } = require("../controllers/weatherController");

// GET /api/weather?city=visakhapatnam&date=2025-11-24
router.get("/", getWeather);

module.exports = router;
