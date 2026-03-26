const mongoose = require("mongoose");

const bodyMetricsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    bodyFat: {
      type: Number,
    },
    muscleMass: {
      type: Number,
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

bodyMetricsSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model("BodyMetrics", bodyMetricsSchema);