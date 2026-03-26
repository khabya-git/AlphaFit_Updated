const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    goal: {
      type: Number,
      required: true,
      min: 1,
    },

    points: {
      type: Number,
      required: true,
      min: 1,
    },

    type: {
      type: String,
      enum: ["strength", "consistency", "nutrition"],
      required: true,
    },

    period: {
      type: String,
      enum: ["daily", "weekly", "monthly", "lifetime"],
      default: "lifetime",
    },

    order: {
      type: Number,
      required: true,
      unique: true, // ensures proper sequential flow
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

/* ----------- INDEXES ----------- */

// Fast lookup by order
challengeSchema.index({ isActive:1,order: 1 });

module.exports = mongoose.model("Challenge", challengeSchema);