const express = require("express");
const { getWorkoutSummary ,createWorkout ,getWorkoutHistory,getExerciseProgress,getWorkoutCalendar} = require("../controllers/workoutController");
const {protect} = require("../middlewares/authMiddlewares");

const router = express.Router();

router.post("/", protect, createWorkout);
router.get("/summary", protect, getWorkoutSummary);
router.get("/history", protect, getWorkoutHistory); //updated on 10/3/26 - added route for fetching user's workout history with exercise details, sorted by most recent.
router.get("/progress/:exerciseId", protect, getExerciseProgress); //added on 10/3/26 - new route to fetch progress of a specific exercise for the user, showing date, sets, and volume over time.
router.get("/calendar", protect, getWorkoutCalendar); //added on 10/3/26 - new route to fetch all workout dates for the user to display on a calendar view in the frontend.
module.exports = router;