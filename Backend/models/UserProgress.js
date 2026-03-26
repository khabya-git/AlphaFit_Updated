const mongoose = require("mongoose");

const userProgressSchema = new mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },

  xp: {
    type: Number,
    default: 0
  },

  level: {
    type: Number,
    default: 1
  },

  badges: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Badge"
    }
  ]

},
{ timestamps: true }
);

module.exports = mongoose.model("UserProgress", userProgressSchema);