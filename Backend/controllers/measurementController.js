const Measurement = require("../models/Measurement");

// Add measurement
const addMeasurement = async (req, res) => {
  try {
    const {
      age,
      height,
      weight,
      gender,
      activityLevel,
      goal,
      dietaryPreferences,
    } = req.body;

    // Validate all fields
    if (!height || !weight || !age || !gender || !activityLevel || !goal || !dietaryPreferences) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const measurement = await Measurement.create({
      userId: req.user.id, // assuming you have authentication middleware
      age,
      height,
      weight,
      gender,
      activityLevel,
      goal,
      dietaryPreferences,
    });

    // Respond with JSON
    res.status(201).json(measurement);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save measurement", error: err.message });
  }
};


// Get all measurements
const getMeasurements = async (req, res) => {
  try {
    const measurements = await Measurement.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(measurements);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch measurements", error: err.message });
  }
};

// Get latest measurement
const getLatestMeasurement = async (req, res) => {
  try {
    const latest = await Measurement.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(latest);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch latest measurement", error: err.message });
  }
};

module.exports = { addMeasurement, getMeasurements, getLatestMeasurement };
