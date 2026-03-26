const express = require("express");
const router = express.Router();

const { getUserProgress } = require("../controllers/gamificationController");

const { protect } = require("../middlewares/authMiddlewares");

router.get("/progress", protect, getUserProgress);

module.exports = router;