// backend/src/models/Weather.js
const mongoose = require("mongoose");

const WeatherSchema = new mongoose.Schema(
  {
    city: { type: String, required: true },      // stored in lowercase
    date: { type: String, required: true },      // YYYY-MM-DD
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    windSpeed: { type: Number, required: true },
    condition: { type: String, required: true }, // "clear sky", "light rain"
    icon: { type: String, required: true }       // OpenWeather icon code
  },
  {
    timestamps: true
  }
);

// unique index so city+date combo is unique
WeatherSchema.index({ city: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Weather", WeatherSchema);
