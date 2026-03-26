const mongoose = require("mongoose");
const WorkoutLog = require("../models/WorkoutLog");

const getStrengthIntel = async (req, res) => {
  try {

    const userId = new mongoose.Types.ObjectId(req.user.id);

    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const stats = await WorkoutLog.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: last30Days }
        }
      },
      {
        $group: {
          _id: "$exercise",
          totalVolume: { $sum: "$volume" },
          maxWeight: { $max: "$weight" },
          sessions: { $sum: 1 }
        }
      },
      { $sort: { totalVolume: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {

    console.error("Strength Intel Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch strength analytics"
    });

  }
};

module.exports = { getStrengthIntel };