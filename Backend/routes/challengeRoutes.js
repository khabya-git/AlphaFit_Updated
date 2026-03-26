const express = require("express");
const mongoose = require("mongoose");
const Challenge = require("../models/Challenge");
const UserChallenge = require("../models/UserChallenge");
const User = require("../models/userModel");
const {protect} = require("../middlewares/authMiddlewares");

const router = express.Router();

/* ---------------------------------------------
   GET USER CHALLENGES
----------------------------------------------*/
router.get("/", protect, async (req, res) => {
  try {
    res.set("Cache-Control", "no-store");
    const userId = req.user._id;

    // Find all active challenges in the master database
    const allActiveChalls = await Challenge.find({ isActive: true }).sort({ order: 1 });

    let userChallenges = await UserChallenge.find({ user: userId }).populate("challenge");

    // Clean up orphans caused by DB resets
    const orphans = userChallenges.filter(uc => !uc.challenge);
    if (orphans.length > 0) {
      await UserChallenge.deleteMany({ _id: { $in: orphans.map(o => o._id) } });
      userChallenges = userChallenges.filter(uc => uc.challenge);
    }

    // Check which challenges the user doesn't have yet
    const existingChallengeIds = userChallenges.map(uc => uc.challenge?._id?.toString());
    const missingChalls = allActiveChalls.filter(ch => !existingChallengeIds.includes(ch._id.toString()));

    // Auto-enroll user in any newly added or missing challenges
    if (missingChalls.length > 0) {
      const newDocs = missingChalls.map(ch => ({
        user: userId,
        challenge: ch._id,
      }));
      await UserChallenge.insertMany(newDocs);

      // Refetch
      userChallenges = await UserChallenge.find({ user: userId }).populate("challenge");
    }

    // Sort heavily on JS side just in case sorting by populated ref didn't stick
    userChallenges.sort((a, b) => (a.challenge?.order || 0) - (b.challenge?.order || 0));

    const user = await User.findById(userId);

    const level = Math.floor(user.xp / 1000) + 1;

    res.json({
      success: true,
      xp: user.xp,
      level,
      challenges: userChallenges,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ---------------------------------------------
   UPDATE CHALLENGE PROGRESS
----------------------------------------------*/
router.post("/progress", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const { challengeId, increment = 1 } = req.body;

    const userChallenge = await UserChallenge.findOne({
      user: userId,
      challenge: challengeId,
    });

    if (!userChallenge || userChallenge.status === "completed") {
      throw new Error("Invalid challenge");
    }

    const challenge = await Challenge.findById(challengeId);

    userChallenge.progress += increment;

    // If completed
    if (userChallenge.progress >= challenge.goal) {
      userChallenge.status = "completed";
      userChallenge.completedAt = new Date();

      // Add XP to user
      await User.findByIdAndUpdate(
        userId,
        { $inc: { xp: challenge.points } }
      );

    }

    await userChallenge.save();

    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;