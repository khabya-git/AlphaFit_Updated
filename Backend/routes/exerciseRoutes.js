const express = require("express");
const router = express.Router();

const {
  getBodyParts,
  getExercisesByBodyPart,
  getExerciseDetails,
  searchExercises
} = require("../controllers/exerciseController");

const { protect } = require("../middlewares/authMiddlewares");

/* ------------------ EXERCISE ROUTES ------------------ */

/* Get all body parts (Chest, Back, Legs, Shoulders, Arms, Core) */
router.get("/bodyparts", protect, getBodyParts);

/* Get exercises by body part */
router.get("/bodypart/:bodyPart", protect, getExercisesByBodyPart);

/* Search exercises */
router.get("/search", protect, searchExercises);

/* Get exercise details */
router.get("/:id", protect, getExerciseDetails);

module.exports = router;