const mongoose = require("mongoose");

const userChallengeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    challenge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenge",
      required: true,
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

/* ------------------ INDEXES ------------------ */

// Prevent duplicate challenge assignment to same user
userChallengeSchema.index({ user: 1, challenge: 1 }, { unique: true });

// Fast lookup for user challenges
userChallengeSchema.index({ user: 1 });

userChallengeSchema.index({ user: 1, status: 1 }); // added on 10/3/26 - index to optimize queries filtering by user and challenge status (active/completed) for dashboard and progress tracking.

module.exports = mongoose.model("UserChallenge", userChallengeSchema);