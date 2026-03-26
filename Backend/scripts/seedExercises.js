const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Exercise = require("../models/Exercise");

dotenv.config();

/* ------------------ EXERCISE DATASET ------------------ */

const exercises = [

/* ---------------- CHEST ---------------- */

{ name: "bench press", bodyPart: "chest", muscleGroup: "pectorals", equipment: "barbell", difficulty: "intermediate" },
{ name: "incline bench press", bodyPart: "chest", muscleGroup: "upper chest", equipment: "barbell", difficulty: "intermediate" },
{ name: "decline bench press", bodyPart: "chest", muscleGroup: "lower chest", equipment: "barbell", difficulty: "intermediate" },
{ name: "dumbbell bench press", bodyPart: "chest", muscleGroup: "pectorals", equipment: "dumbbell", difficulty: "beginner" },
{ name: "incline dumbbell press", bodyPart: "chest", muscleGroup: "upper chest", equipment: "dumbbell", difficulty: "beginner" },
{ name: "decline dumbbell press", bodyPart: "chest", muscleGroup: "lower chest", equipment: "dumbbell", difficulty: "intermediate" },
{ name: "push ups", bodyPart: "chest", muscleGroup: "pectorals", equipment: "bodyweight", difficulty: "beginner" },
{ name: "wide push ups", bodyPart: "chest", muscleGroup: "pectorals", equipment: "bodyweight", difficulty: "beginner" },
{ name: "diamond push ups", bodyPart: "chest", muscleGroup: "inner chest", equipment: "bodyweight", difficulty: "intermediate" },
{ name: "decline push ups", bodyPart: "chest", muscleGroup: "upper chest", equipment: "bodyweight", difficulty: "intermediate" },
{ name: "chest dips", bodyPart: "chest", muscleGroup: "lower chest", equipment: "bodyweight", difficulty: "intermediate" },
{ name: "machine chest press", bodyPart: "chest", muscleGroup: "pectorals", equipment: "machine", difficulty: "beginner" },
{ name: "cable chest fly", bodyPart: "chest", muscleGroup: "pectorals", equipment: "cable", difficulty: "beginner" },
{ name: "dumbbell chest fly", bodyPart: "chest", muscleGroup: "pectorals", equipment: "dumbbell", difficulty: "beginner" },
{ name: "pec deck fly", bodyPart: "chest", muscleGroup: "pectorals", equipment: "machine", difficulty: "beginner" },
{ name: "incline cable fly", bodyPart: "chest", muscleGroup: "upper chest", equipment: "cable", difficulty: "intermediate" },
{ name: "decline cable fly", bodyPart: "chest", muscleGroup: "lower chest", equipment: "cable", difficulty: "intermediate" },
{ name: "single arm cable press", bodyPart: "chest", muscleGroup: "pectorals", equipment: "cable", difficulty: "intermediate" },
{ name: "medicine ball push ups", bodyPart: "chest", muscleGroup: "pectorals", equipment: "medicine ball", difficulty: "intermediate" },
{ name: "explosive push ups", bodyPart: "chest", muscleGroup: "pectorals", equipment: "bodyweight", difficulty: "advanced" },

/* ---------------- BACK ---------------- */

{ name: "deadlift", bodyPart: "back", muscleGroup: "lower back", equipment: "barbell", difficulty: "advanced" },
{ name: "pull ups", bodyPart: "back", muscleGroup: "lats", equipment: "bodyweight", difficulty: "intermediate" },
{ name: "chin ups", bodyPart: "back", muscleGroup: "lats", equipment: "bodyweight", difficulty: "intermediate" },
{ name: "lat pulldown", bodyPart: "back", muscleGroup: "lats", equipment: "machine", difficulty: "beginner" },
{ name: "wide grip lat pulldown", bodyPart: "back", muscleGroup: "lats", equipment: "machine", difficulty: "beginner" },
{ name: "close grip pulldown", bodyPart: "back", muscleGroup: "lats", equipment: "machine", difficulty: "beginner" },
{ name: "barbell row", bodyPart: "back", muscleGroup: "mid back", equipment: "barbell", difficulty: "intermediate" },
{ name: "t bar row", bodyPart: "back", muscleGroup: "mid back", equipment: "barbell", difficulty: "intermediate" },
{ name: "dumbbell row", bodyPart: "back", muscleGroup: "lats", equipment: "dumbbell", difficulty: "beginner" },
{ name: "seated cable row", bodyPart: "back", muscleGroup: "mid back", equipment: "cable", difficulty: "beginner" },
{ name: "single arm cable row", bodyPart: "back", muscleGroup: "lats", equipment: "cable", difficulty: "beginner" },
{ name: "machine row", bodyPart: "back", muscleGroup: "mid back", equipment: "machine", difficulty: "beginner" },
{ name: "reverse fly", bodyPart: "back", muscleGroup: "rear delts", equipment: "dumbbell", difficulty: "beginner" },
{ name: "face pull", bodyPart: "back", muscleGroup: "rear delts", equipment: "cable", difficulty: "beginner" },
{ name: "rack pull", bodyPart: "back", muscleGroup: "lower back", equipment: "barbell", difficulty: "advanced" },
{ name: "hyperextensions", bodyPart: "back", muscleGroup: "lower back", equipment: "bodyweight", difficulty: "beginner" },
{ name: "superman", bodyPart: "back", muscleGroup: "lower back", equipment: "bodyweight", difficulty: "beginner" },
{ name: "inverted row", bodyPart: "back", muscleGroup: "lats", equipment: "bodyweight", difficulty: "intermediate" },
{ name: "band pull apart", bodyPart: "back", muscleGroup: "rear delts", equipment: "band", difficulty: "beginner" },
{ name: "renegade row", bodyPart: "back", muscleGroup: "lats", equipment: "dumbbell", difficulty: "advanced" },

/* ---------------- LEGS ---------------- */

{ name: "squat", bodyPart: "legs", muscleGroup: "quadriceps", equipment: "barbell", difficulty: "intermediate" },
{ name: "front squat", bodyPart: "legs", muscleGroup: "quadriceps", equipment: "barbell", difficulty: "advanced" },
{ name: "goblet squat", bodyPart: "legs", muscleGroup: "quadriceps", equipment: "dumbbell", difficulty: "beginner" },
{ name: "bulgarian split squat", bodyPart: "legs", muscleGroup: "quadriceps", equipment: "dumbbell", difficulty: "intermediate" },
{ name: "lunges", bodyPart: "legs", muscleGroup: "quadriceps", equipment: "bodyweight", difficulty: "beginner" },
{ name: "walking lunges", bodyPart: "legs", muscleGroup: "quadriceps", equipment: "dumbbell", difficulty: "intermediate" },
{ name: "leg press", bodyPart: "legs", muscleGroup: "quadriceps", equipment: "machine", difficulty: "beginner" },
{ name: "hack squat", bodyPart: "legs", muscleGroup: "quadriceps", equipment: "machine", difficulty: "intermediate" },
{ name: "leg extension", bodyPart: "legs", muscleGroup: "quadriceps", equipment: "machine", difficulty: "beginner" },
{ name: "romanian deadlift", bodyPart: "legs", muscleGroup: "hamstrings", equipment: "barbell", difficulty: "intermediate" },
{ name: "hamstring curl", bodyPart: "legs", muscleGroup: "hamstrings", equipment: "machine", difficulty: "beginner" },
{ name: "glute bridge", bodyPart: "legs", muscleGroup: "glutes", equipment: "bodyweight", difficulty: "beginner" },
{ name: "hip thrust", bodyPart: "legs", muscleGroup: "glutes", equipment: "barbell", difficulty: "intermediate" },
{ name: "step ups", bodyPart: "legs", muscleGroup: "quadriceps", equipment: "dumbbell", difficulty: "beginner" },
{ name: "box jumps", bodyPart: "legs", muscleGroup: "quadriceps", equipment: "bodyweight", difficulty: "advanced" },
{ name: "calf raises", bodyPart: "legs", muscleGroup: "calves", equipment: "bodyweight", difficulty: "beginner" },
{ name: "seated calf raise", bodyPart: "legs", muscleGroup: "calves", equipment: "machine", difficulty: "beginner" },
{ name: "donkey calf raise", bodyPart: "legs", muscleGroup: "calves", equipment: "machine", difficulty: "intermediate" },

/* ---------------- SHOULDERS ---------------- */

{ name: "shoulder press", bodyPart: "shoulders", muscleGroup: "deltoids", equipment: "dumbbell", difficulty: "beginner" },
{ name: "barbell overhead press", bodyPart: "shoulders", muscleGroup: "deltoids", equipment: "barbell", difficulty: "intermediate" },
{ name: "arnold press", bodyPart: "shoulders", muscleGroup: "deltoids", equipment: "dumbbell", difficulty: "intermediate" },
{ name: "lateral raise", bodyPart: "shoulders", muscleGroup: "deltoids", equipment: "dumbbell", difficulty: "beginner" },
{ name: "front raise", bodyPart: "shoulders", muscleGroup: "deltoids", equipment: "dumbbell", difficulty: "beginner" },
{ name: "rear delt fly", bodyPart: "shoulders", muscleGroup: "rear delts", equipment: "dumbbell", difficulty: "beginner" },
{ name: "cable lateral raise", bodyPart: "shoulders", muscleGroup: "deltoids", equipment: "cable", difficulty: "beginner" },
{ name: "upright row", bodyPart: "shoulders", muscleGroup: "traps", equipment: "barbell", difficulty: "intermediate" },
{ name: "shrugs", bodyPart: "shoulders", muscleGroup: "traps", equipment: "dumbbell", difficulty: "beginner" },

/* ---------------- ARMS ---------------- */

{ name: "barbell curl", bodyPart: "arms", muscleGroup: "biceps", equipment: "barbell", difficulty: "beginner" },
{ name: "dumbbell curl", bodyPart: "arms", muscleGroup: "biceps", equipment: "dumbbell", difficulty: "beginner" },
{ name: "hammer curl", bodyPart: "arms", muscleGroup: "biceps", equipment: "dumbbell", difficulty: "beginner" },
{ name: "preacher curl", bodyPart: "arms", muscleGroup: "biceps", equipment: "machine", difficulty: "beginner" },
{ name: "concentration curl", bodyPart: "arms", muscleGroup: "biceps", equipment: "dumbbell", difficulty: "beginner" },
{ name: "tricep pushdown", bodyPart: "arms", muscleGroup: "triceps", equipment: "cable", difficulty: "beginner" },
{ name: "overhead tricep extension", bodyPart: "arms", muscleGroup: "triceps", equipment: "dumbbell", difficulty: "beginner" },
{ name: "skull crushers", bodyPart: "arms", muscleGroup: "triceps", equipment: "barbell", difficulty: "intermediate" },
{ name: "close grip bench press", bodyPart: "arms", muscleGroup: "triceps", equipment: "barbell", difficulty: "intermediate" },
{ name: "bench dips", bodyPart: "arms", muscleGroup: "triceps", equipment: "bodyweight", difficulty: "beginner" },

/* ---------------- CORE ---------------- */

{ name: "plank", bodyPart: "core", muscleGroup: "abs", equipment: "bodyweight", difficulty: "beginner" },
{ name: "side plank", bodyPart: "core", muscleGroup: "obliques", equipment: "bodyweight", difficulty: "beginner" },
{ name: "russian twist", bodyPart: "core", muscleGroup: "obliques", equipment: "dumbbell", difficulty: "beginner" },
{ name: "hanging leg raise", bodyPart: "core", muscleGroup: "abs", equipment: "bodyweight", difficulty: "intermediate" },
{ name: "lying leg raise", bodyPart: "core", muscleGroup: "abs", equipment: "bodyweight", difficulty: "beginner" },
{ name: "bicycle crunch", bodyPart: "core", muscleGroup: "abs", equipment: "bodyweight", difficulty: "beginner" },
{ name: "mountain climbers", bodyPart: "core", muscleGroup: "abs", equipment: "bodyweight", difficulty: "intermediate" },
{ name: "ab wheel rollout", bodyPart: "core", muscleGroup: "abs", equipment: "ab wheel", difficulty: "advanced" },
{ name: "v sit ups", bodyPart: "core", muscleGroup: "abs", equipment: "bodyweight", difficulty: "intermediate" }

];

/* ------------------ SEED FUNCTION ------------------ */

const seedExercises = async () => {

  try {

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    // remove existing exercises
    await Exercise.deleteMany();

    console.log("Old Exercises Deleted");

    // insert new exercises
    await Exercise.insertMany(exercises);

    console.log("Exercises Seeded Successfully");

    process.exit();

  } catch (error) {

    console.error("Seeding Error:", error);
    process.exit(1);
  }

};

seedExercises();