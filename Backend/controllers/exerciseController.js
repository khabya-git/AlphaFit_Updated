const Exercise = require("../models/Exercise");

/* ------------------ GET ALL BODY PARTS ------------------ */
/* Used to render the body part cards on the workout page */

const getBodyParts = async (req, res) => {
  try {
    const bodyParts = await Exercise.distinct("bodyPart");

    res.status(200).json({
      success: true,
      data: bodyParts
    });

  } catch (error) {
    console.error("BodyParts Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch body parts"
    });
  }
};


/* ------------------ GET EXERCISES BY BODY PART ------------------ */
/* Example: /api/exercises/bodypart/chest */

const getExercisesByBodyPart = async (req, res) => {
  try {
    const { bodyPart } = req.params;

    const exercises = await Exercise.find({
      bodyPart: bodyPart.toLowerCase()
    })
      .select("name imageUrl videoUrl difficulty equipment")
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: exercises
    });

  } catch (error) {
    console.error("Exercises Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch exercises"
    });
  }
};


/* ------------------ GET EXERCISE DETAILS ------------------ */
/* Used when user clicks an exercise card */

const getExerciseDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const exercise = await Exercise.findById(id)
      .populate("alternatives", "name imageUrl");

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: "Exercise not found"
      });
    }

    res.status(200).json({
      success: true,
      data: exercise
    });

  } catch (error) {
    console.error("Exercise Details Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch exercise details"
    });
  }
};


/* ------------------ SEARCH EXERCISES ------------------ */
/* Used for search bar in workout page */

const searchExercises = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query required"
      });
    }

    const exercises = await Exercise.find({
      $text: { $search: q }
    })
      .limit(10)
      .select("name bodyPart imageUrl");

    res.status(200).json({
      success: true,
      data: exercises
    });

  } catch (error) {
    console.error("Search Error:", error);

    res.status(500).json({
      success: false,
      message: "Exercise search failed"
    });
  }
};


module.exports = {
  getBodyParts,
  getExercisesByBodyPart,
  getExerciseDetails,
  searchExercises
};