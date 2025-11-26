// backend/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const weatherRoutes = require("./src/routes/weatherRoutes");

dotenv.config();

const app = express();

// connect to DB
connectDB();

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use("/api/weather", weatherRoutes);

// health check
app.get("/", (req, res) => {
  res.send("Weather backend is running ✅");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
