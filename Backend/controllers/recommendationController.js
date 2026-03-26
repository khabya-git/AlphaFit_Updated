const mongoose = require("mongoose");
const WorkoutLog = require("../models/WorkoutLog");
const Exercise = require("../models/Exercise");

const getWorkoutRecommendation = async (req, res) => {
  try {

    const userId = new mongoose.Types.ObjectId(req.user.id);

    // Get last 10 workouts
    const recentWorkouts = await WorkoutLog.find({
      user: userId
    })
      .sort({ date: -1 })
      .limit(10)
      .populate("exercise");

    const trainedBodyParts = recentWorkouts.map(
      w => w.exercise.bodyPart
    );

    const bodyPartCount = {};

    trainedBodyParts.forEach(part => {
      bodyPartCount[part] = (bodyPartCount[part] || 0) + 1;
    });

    // Find least trained body part
    let targetBodyPart = null;
    let minCount = Infinity;

    Object.entries(bodyPartCount).forEach(([part, count]) => {
      if (count < minCount) {
        minCount = count;
        targetBodyPart = part;
      }
    });

    // If no workouts yet
    if (!targetBodyPart) {
      targetBodyPart = "chest";
    }

    // Get exercises for that body part
    const exercises = await Exercise.find({
      bodyPart: targetBodyPart
    }).limit(5);

    res.json({
      success: true,
      recommendation: {
        bodyPart: targetBodyPart,
        exercises
      }
    });

  } catch (error) {

    console.error("Recommendation Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate workout recommendation"
    });

  }
};

module.exports = { getWorkoutRecommendation };