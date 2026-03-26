const mongoose = require("mongoose");

const measurementSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    age: { type: Number, required: true }, // years

    // Height with unit
    height: { type: Number, required: true },
    heightUnit: { type: String, enum: ["cm", "in"], default: "cm" },

    // Weight with unit
    weight: { type: Number, required: true },
    weightUnit: { type: String, enum: ["kg", "lb"], default: "kg" },

    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer_not_to_say"],
      required: true,
    },
    activityLevel: {
      type: String,
      enum: ["sedentary", "light", "moderate", "active", "very_active"],
      required: true,
    },
    goal: {
      type: String,
      enum: ["lose", "maintain", "gain"],
      required: true,
    },
    dietaryPreferences: {
      type: String,
      enum: ["vegetarian", "non-vegetarian", "vegan", "eggetarian"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Measurement", measurementSchema);

