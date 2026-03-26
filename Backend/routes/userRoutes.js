const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddlewares");

const {
  getDashboard,
  getPoseDetection,
  getGamification,
  getDietChart,
  getWorkoutPlan,
  getMealPrep,
  uploadAvatar,
} = require("../controllers/userController");

/* -------- DASHBOARD -------- */
router.get("/dashboard", protect, getDashboard);

/* -------- AI / POSE DETECTION -------- */
router.get("/pose-detection", protect, getPoseDetection);

/* -------- GAMIFICATION -------- */
router.get("/gamification", protect, getGamification);

/* -------- FITNESS PLANS -------- */
router.get("/diet-chart", protect, getDietChart);
router.get("/workout-plan", protect, getWorkoutPlan);
router.get("/meal-prep", protect, getMealPrep);

/* -------- USER PROFILE -------- */
router.post("/me/avatar", protect, uploadAvatar);

module.exports = router;

// const express = require("express");
// const router = express.Router();
// const { protect } = require("../middlewares/authMiddlewares");
// const {
//   getDashboard,
//   getPoseDetection,
//   getGamification,
//   getDietChart,
//   getWorkoutPlan,
//   getMealPrep,
//   uploadAvatar,
// } = require("../controllers/userController");

// router.get("/dashboard", protect, getDashboard);
// router.get("/pose-detection", protect, getPoseDetection);
// router.get("/gamification", protect, getGamification);
// router.get("/diet-chart", protect, getDietChart);
// router.get("/workout-plan", protect, getWorkoutPlan);
// router.get("/meal-prep", protect, getMealPrep);
// router.post("/me/avatar", protect, uploadAvatar);

// module.exports = router;

