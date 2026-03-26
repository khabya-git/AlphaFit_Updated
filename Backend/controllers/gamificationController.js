const UserProgress = require("../models/UserProgress");

/* ------------------ GET USER PROGRESS ------------------ */

const getUserProgress = async (req, res) => {
  try {

    const progress = await UserProgress
      .findOne({ user: req.user.id })
      .populate("badges");

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "User progress not found"
      });
    }

    res.status(200).json({
      success: true,
      data: progress
    });

  } catch (error) {

    console.error("User Progress Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch progress"
    });
  }
};

/* ------------------ ADD XP ------------------ */

const addXP = async (userId, xpAmount) => {

  const progress = await UserProgress.findOne({ user: userId });

  if (!progress) return;

  progress.xp += xpAmount;

  // Level calculation
  progress.level = Math.floor(progress.xp / 500) + 1;

  await progress.save();
};

module.exports = {
  getUserProgress,
  addXP
};