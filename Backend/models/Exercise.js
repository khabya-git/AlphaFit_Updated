const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true
  },

  bodyPart: {
    type: String,
    required: true,
    enum: [
      "chest",
      "back",
      "legs",
      "shoulders",
      "arms",
      "core"
    ],
    index: true
  },

  muscleGroup: {
    type: String,
    required: true
  },

  equipment: {
    type: String,
    default: "bodyweight"
  },

  difficulty: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    default: "beginner"
  },

  imageUrl: {
    type: String,
    default: ""
  },

  videoUrl: {
    type: String,
    default: ""
  },

  description: {
    type: String,
    default: ""
  },

  // alternative exercises for substitution
  alternatives: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exercise"
    }
  ]
},
{
  timestamps: true
}
);

/* ------------------ INDEXES ------------------ */

// Quickly fetch exercises by body part
exerciseSchema.index({ bodyPart: 1 });

// For searching exercises
exerciseSchema.index({ name: "text" });

const Exercise = mongoose.model("Exercise", exerciseSchema);

module.exports = Exercise;