// backend/src/controllers/weatherController.js
const axios = require("axios");
const Weather = require("../models/Weather");

// helper to get YYYY-MM-DD from Date
const getDateString = (d = new Date()) => {
  return d.toISOString().split("T")[0];
};

exports.getWeather = async (req, res) => {
  try {
    let { city, date } = req.query;

    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }

    // normalize city & date
    city = city.trim().toLowerCase();
    const queryDate = date ? date.trim() : getDateString();

    // 1. Check DB
    const existing = await Weather.findOne({ city, date: queryDate });

    if (existing) {
      return res.json({
        source: "database",
        data: existing
      });
    }

    // 2. If not in DB → call OpenWeather API
    const API_KEY = process.env.OPENWEATHER_API_KEY;
    if (!API_KEY) {
      return res
        .status(500)
        .json({ message: "OPENWEATHER_API_KEY is not configured" });
    }

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${API_KEY}&units=metric`;

    const apiRes = await axios.get(apiUrl);

    const apiData = apiRes.data;

    const weatherData = {
      city,
      date: queryDate,
      temperature: apiData.main.temp,
      humidity: apiData.main.humidity,
      windSpeed: apiData.wind.speed,
      condition: apiData.weather[0].description,
      icon: apiData.weather[0].icon
    };

    // 3. Save to DB
    const saved = await Weather.create(weatherData);

    return res.json({
      source: "api",
      data: saved
    });
  } catch (error) {
    console.error("Error in getWeather:", error.message);

    if (error.response && error.response.data) {
      return res.status(error.response.status || 500).json({
        message: "Error from weather API",
        details: error.response.data
      });
    }

    return res.status(500).json({
      message: "Server error while fetching weather",
      error: error.message
    });
  }
};
