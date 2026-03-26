const express = require("express");
const router = express.Router();

const { getWorkoutRecommendation } = require("../controllers/recommendationController");
const { protect } = require("../middlewares/authMiddlewares");

router.get("/today", protect, getWorkoutRecommendation);

module.exports = router;