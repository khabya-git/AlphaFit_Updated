const express = require("express");
const {
  addMeasurement,
  getMeasurements,
  getLatestMeasurement,
} = require("../controllers/measurementController");
const { protect } = require("../middlewares/authMiddlewares");

const router = express.Router();

router.post("/", protect, addMeasurement);
router.get("/", protect, getMeasurements);
router.get("/latest", protect, getLatestMeasurement);

module.exports = router;
