const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddlewares");
const upload = require("../middlewares/uploadMiddlewares");
const { getFitnessProfile, updateFitnessProfile, createFitnessProfile, uploadAvatar } = require("../controllers/profileController");

// First-time create (if no profile exists)
router.post("/fitness-create", protect, createFitnessProfile);

// GET current fitness profile
router.get("/fitness-get", protect, getFitnessProfile);

// PUT update fitness profile
router.put("/fitness-update", protect, updateFitnessProfile);

router.post("/fitness/avatar",protect,upload.single("avatar"),uploadAvatar);

module.exports = router;