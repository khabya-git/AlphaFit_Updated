const mongoose = require("mongoose");
const WorkoutLog = require("../models/WorkoutLog");

const getWorkoutSummary = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const today = new Date();

    const weekStart = new Date();
    weekStart.setDate(today.getDate() - 7);

    const last30Days = new Date();
    last30Days.setDate(today.getDate() - 30);

    // 1️⃣ Weekly Volume + Sessions
    const weeklyData = await WorkoutLog.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: weekStart },
        },
      },
      {
        $group: {
          _id: null,
          totalVolume: { $sum: "$volume" },
          sessions: { $addToSet: "$date" },
        },
      },
    ]);

    const weeklyVolume = weeklyData[0]?.totalVolume || 0;
    const weeklySessions = weeklyData[0]?.sessions?.length || 0;

    // 2️⃣ Exercise Progress (Last 30 Days)
    const exerciseProgress = await WorkoutLog.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: last30Days },
        },
      },
      {
        $group: {
          _id: "$exercise",
          maxWeight: { $max: "$weight" },
          totalVolume: { $sum: "$volume" },
        },
      },
      { $sort: { totalVolume: -1 } },
    ]);

    // 3️⃣ Recent PRs
    const recentPRs = await WorkoutLog.find({
      user: userId,
      isPR: true,
    })
      .sort({ date: -1 })
      .limit(5)
      .lean();

    // 4️⃣ Workout Streak
    const workoutDates = await WorkoutLog.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" },
          },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    let streak = 0;
    let previousDate = null;

    for (const entry of workoutDates) {
      const currentDate = new Date(entry._id);

      if (!previousDate) {
        previousDate = currentDate;
        streak = 1;
        continue;
      }

      const diff = (previousDate - currentDate) / (1000 * 60 * 60 * 24);

      if (diff === 1) {
        streak++;
        previousDate = currentDate;
      } else {
        break;
      }
    }

    res.status(200).json({
      success: true,
      data: {
        weeklyVolume,
        weeklySessions,
        exerciseProgress,
        recentPRs,
        streak,
      },
    });
  } catch (error) {
    console.error("Workout Summary Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch workout summary",
    });
  }
};

const createWorkout = async (req, res) => {
  try {
    const userId = req.user.id;
    const { exercise, sets, date } = req.body;
    const exerciseName = (exercise || "").toLowerCase().trim();

    // 1. Validation
    if (!exercise || !sets || !Array.isArray(sets) || sets.length === 0) {
      return res.status(400).json({ success: false, message: "Exercise and at least one set are required" });
    }

    const invalidSet = sets.find(s => !s.weight || !s.reps || Number(s.weight) <= 0 || Number(s.reps) <= 0);
    if (invalidSet) {
      return res.status(400).json({ success: false, message: "All sets must have valid weight and reps" });
    }

    // 2. PR Detection — compare max set weight vs previous best
    const maxSetWeight = Math.max(...sets.map(s => Number(s.weight)));

    const highest = await WorkoutLog.findOne({ user: userId, exercise: exerciseName })
      .sort({ volume: -1 })
      .lean();

    const prevMaxWeight = highest && highest.sets && highest.sets.length > 0
      ? Math.max(...highest.sets.map(s => s.weight))
      : 0;

    const isPR = maxSetWeight > prevMaxWeight;

    // 3. Create — volume auto-calculated by pre-save hook
    const workout = new WorkoutLog({
      user: userId,
      exercise: exerciseName,
      sets: sets.map(s => ({ weight: Number(s.weight), reps: Number(s.reps) })),
      isPR,
      date: date ? new Date(date) : new Date(),
    });

    await workout.save();

    res.status(201).json({ success: true, data: workout, isPR });
  } catch (error) {
    console.error("Workout Creation Error:", error);
    res.status(500).json({ success: false, message: "Failed to create workout", error: error.message });
  }
};

const getWorkoutHistory = async (req, res) => {
  try {

    const workouts = await WorkoutLog.find({ user: req.user.id })
      .sort({ date: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      data: workouts
    });

  } catch (error) {

    console.error("Workout History Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch workout history"
    });
  }
};   //updated on 10/3/26 - added getWorkoutHistory controller to fetch user's workout logs with exercise details, sorted by most recent.

const getExerciseProgress = async (req, res) => {
  try {

    const { exerciseId } = req.params;

    const progress = await WorkoutLog.find({
      user: req.user.id,
      exercise: exerciseId
    })
      .sort({ date: 1 })
      .select("date sets volume");

    res.status(200).json({
      success: true,
      data: progress
    });

  } catch (error) {

    console.error("Progress Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch exercise progress"
    });
  }
};

const getWorkoutCalendar = async (req, res) => {
  try {

    const workouts = await WorkoutLog.find({
      user: req.user.id
    }).select("date");

    const workoutDates = workouts.map(w =>
      w.date.toISOString().split("T")[0]
    );

    // remove duplicates
    const uniqueDates = [...new Set(workoutDates)];

    // sort ascending
    uniqueDates.sort();

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;

    for (let i = 1; i < uniqueDates.length; i++) {

      const prev = new Date(uniqueDates[i - 1]);
      const curr = new Date(uniqueDates[i]);

      const diff =
        (curr - prev) / (1000 * 60 * 60 * 24);

      if (diff === 1) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }

      longestStreak = Math.max(longestStreak, tempStreak);
    }

    // current streak calculation
    let today = new Date();
    let streak = 0;

    while (true) {

      const dateStr = today.toISOString().split("T")[0];

      if (uniqueDates.includes(dateStr)) {
        streak++;
        today.setDate(today.getDate() - 1);
      } else {
        break;
      }

    }

    currentStreak = streak;

    res.json({
      success: true,
      calendar: uniqueDates,
      currentStreak,
      longestStreak
    });

  } catch (error) {

    console.error("Calendar Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch calendar"
    });

  }
}; //added on 10/3/26 - new controller to fetch all workout dates for the user, used for calendar heatmap visualization of workout frequency.

module.exports = { getWorkoutSummary, createWorkout, getWorkoutHistory, getExerciseProgress, getWorkoutCalendar };
