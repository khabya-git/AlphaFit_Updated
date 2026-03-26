const express = require("express");
const router = express.Router();

const { getStrengthIntel } = require("../controllers/analyticsController");
const { protect } = require("../middlewares/authMiddlewares");

router.get("/strength-intel", protect, getStrengthIntel);

module.exports = router;