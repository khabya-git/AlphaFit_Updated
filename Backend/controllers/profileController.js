// const User = require("../models/User");

// const getFitnessProfile = async (req, res) => {
//   try {
//     if (!req.userId) return res.status(401).json({ message: "Unauthorized" });
//     const user = await User.findById(req.userId).select("fitnessProfile");
//     if (!user) return res.status(404).json({ message: "User not found" });

//     return res.json(user.fitnessProfile || {});
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: "Server error", error: error.message });
//   }
// };

// const updateFitnessProfile = async (req, res) => {
//   try {
//     if (!req.userId) return res.status(401).json({ message: "Unauthorized" });
//     const {
//       age,
//       height, // { value, unit }
//       weight, // { value, unit }
//       gender,
//       activityLevel,
//       goal,
//       dietaryPreferences,
//     } = req.body || {};

//     const user = await User.findById(req.userId).select("fitnessProfile");
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // Initialize if missing
//     if (!user.fitnessProfile) user.fitnessProfile = {};

//     // Update with validation
//     if (typeof age === "number") {
//       if (age < 10 || age > 120)
//         return res.status(400).json({ message: "Invalid age" });
//       user.fitnessProfile.age = age;
//     }

//     if (height && typeof height === "object") {
//       const { value, unit } = height;
//       if (typeof value === "number" && value > 0)
//         user.fitnessProfile.height = user.fitnessProfile.height || {};
//       if (typeof value === "number" && value > 0)
//         user.fitnessProfile.height.value = value;
//       if (unit && ["cm", "in"].includes(unit))
//         user.fitnessProfile.height.unit = unit;
//     }

//     if (weight && typeof weight === "object") {
//       const { value, unit } = weight;
//       if (typeof value === "number" && value > 0)
//         user.fitnessProfile.weight = user.fitnessProfile.weight || {};
//       if (typeof value === "number" && value > 0)
//         user.fitnessProfile.weight.value = value;
//       if (unit && ["kg", "lb"].includes(unit))
//         user.fitnessProfile.weight.unit = unit;
//     }

//     if (
//       gender &&
//       ["male", "female", "other", "prefer_not_to_say"].includes(gender)
//     ) {
//       user.fitnessProfile.gender = gender;
//     }

//     if (
//       activityLevel &&
//       ["sedentary", "light", "moderate", "active", "very_active"].includes(
//         activityLevel
//       )
//     ) {
//       user.fitnessProfile.activityLevel = activityLevel;
//     }

//     if (goal && ["lose", "maintain", "gain"].includes(goal)) {
//       user.fitnessProfile.goal = goal;
//     }

//     if (
//       typeof dietaryPreferences === "string" &&
//       ["vegetarian", "non-vegetarian", "vegan", "eggetarian"].includes(
//         dietaryPreference
//       )
//     ) {
//       user.fitnessProfile.dietaryPreference = dietaryPreference;
//     }

//     await user.save();

//     return res.json(user.fitnessProfile);
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: "Server error", error: error.message });
//   }
// };

// module.exports = { getFitnessProfile, updateFitnessProfile };

// const User = require("../models/User");
// const { deepClean } = require("../helpers/clean");
// const getFitnessProfile = async (req, res) => {
//   try {
//     const userId = req.user?.id || req.userId; // support both [14]
//     if (!userId) return res.status(401).json({ message: "Unauthorized" });

//     const user = await User.findById(userId).select("fitnessProfile");
//     if (!user) return res.status(404).json({ message: "User not found" });

//     return res.json(user.fitnessProfile || {});
//   } catch (error) {
//     return res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// const updateFitnessProfile = async (req, res) => {
//   try {
//     const userId = req.user?.id || req.userId; // support both [14]
//     if (!userId) return res.status(401).json({ message: "Unauthorized" });

//     const {
//       age,
//       height, // { value, unit }
//       weight, // { value, unit }
//       gender,
//       activityLevel,
//       goal,
//       dietaryPreferences, // keep consistent naming
//     } = req.body || {};

//     const user = await User.findById(userId).select("fitnessProfile");
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // Ensure container exists
//     if (!user.fitnessProfile) user.fitnessProfile = {};

//     // Age
//     if (typeof age === "number") {
//       if (age < 10 || age > 120) {
//         return res.status(400).json({ message: "Invalid age" });
//       }
//       user.fitnessProfile.age = age;
//     }

//     // Height
//     if (height && typeof height === "object") {
//       const { value, unit } = height;
//       if (typeof value === "number" && value > 0) {
//         user.fitnessProfile.height = user.fitnessProfile.height || {};
//         user.fitnessProfile.height.value = value;
//       }
//       if (unit && ["cm", "in"].includes(unit)) {
//         user.fitnessProfile.height = user.fitnessProfile.height || {};
//         user.fitnessProfile.height.unit = unit;
//       }
//     }

//     // Weight
//     if (weight && typeof weight === "object") {
//       const { value, unit } = weight;
//       if (typeof value === "number" && value > 0) {
//         user.fitnessProfile.weight = user.fitnessProfile.weight || {};
//         user.fitnessProfile.weight.value = value;
//       }
//       if (unit && ["kg", "lb"].includes(unit)) {
//         user.fitnessProfile.weight = user.fitnessProfile.weight || {};
//         user.fitnessProfile.weight.unit = unit;
//       }
//     }

//     // Gender
//     if (gender && ["male", "female", "other", "prefer_not_to_say"].includes(gender)) {
//       user.fitnessProfile.gender = gender;
//     }

//     // Activity level
//     if (
//       activityLevel &&
//       ["sedentary", "light", "moderate", "active", "very_active"].includes(activityLevel)
//     ) {
//       user.fitnessProfile.activityLevel = activityLevel;
//     }

//     // Goal
//     if (goal && ["lose", "maintain", "gain"].includes(goal)) {
//       user.fitnessProfile.goal = goal;
//     }

//     // Dietary preferences (string)
//     if (
//       typeof dietaryPreferences === "string" &&
//       ["vegetarian", "non-vegetarian", "vegan", "eggetarian"].includes(dietaryPreferences)
//     ) {
//       user.fitnessProfile.dietaryPreferences = dietaryPreferences; // consistent key
//     }

//     await user.save(); // run validators/middleware [3]

//     return res.json(user.fitnessProfile);
//   } catch (error) {
//     return res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// module.exports = { getFitnessProfile, updateFitnessProfile };

// controllers/profileController.js
const User = require("../models/User");
const { deepClean } = require("../helpers/clean");
const path = require("path"); 
const fs = require("fs");

const getFitnessProfile = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId).select("fitnessProfile");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json(user.fitnessProfile || {});
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const createFitnessProfile = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const input = deepClean(req.body || {});
    const user = await User.findById(userId).select("fitnessProfile");
    if (!user) return res.status(404).json({ message: "User not found" });

    if (
      user.fitnessProfile &&
      Object.keys(
        user.fitnessProfile.toObject
          ? user.fitnessProfile.toObject()
          : user.fitnessProfile
      ).length
    ) {
      return res
        .status(409)
        .json({ message: "Fitness profile already exists" });
    }

    user.fitnessProfile = {};
    applyProfileUpdates(user.fitnessProfile, input);
    await user.save();
    return res.status(201).json(user.fitnessProfile);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const updateFitnessProfile = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // Remove null/undefined/empty strings from input
    const cleaned = deepClean(req.body || {});
    const {
      age,
      height,
      weight,
      gender,
      activityLevel,
      goal,
      dietaryPreferences,
    } = cleaned;

    const user = await User.findById(userId).select("fitnessProfile");
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.fitnessProfile) user.fitnessProfile = {};

    // Age
    if (typeof age === "number") {
      if (age < 10 || age > 120)
        return res.status(400).json({ message: "Invalid age" });
      user.fitnessProfile.age = age;
    }

    // Height
    if (height && typeof height === "object") {
      const { value, unit } = height;

      // Reject negatives and NaN
      if (typeof value === "number") {
        if (Number.isNaN(value) || value < 0) {
          throw new Error(
            "Invalid height: value must be a non-negative number"
          );
        }
        if (value > 0) {
          user.fitnessProfile.height = user.fitnessProfile.height || {};
          user.fitnessProfile.height.value = value;
        }
      }

      if (unit && ["cm", "in"].includes(unit)) {
        user.fitnessProfile.height =user.fitnessProfile.height || {};
        user.fitnessProfile.height.unit = unit;
      }
    }

    // Weight
    if (weight && typeof weight === "object") {
      const { value, unit } = weight;

      if (typeof value === "number") {
        if (Number.isNaN(value) || value < 0) {
          return res
            .status(400)
            .json({ message: "Weight must be a non-negative number" }); // reject negatives
        }
        // zero or positive allowed
        if (value > 0) {
          user.fitnessProfile.weight = user.fitnessProfile.weight || {};
          user.fitnessProfile.weight.value = value;
        }
      }

      if (unit && ["kg", "lb"].includes(unit)) {
        user.fitnessProfile.weight = user.fitnessProfile.weight || {};
        user.fitnessProfile.weight.unit = unit;
      }
    }

    // Gender
    if (
      typeof gender === "string" &&
      ["male", "female", "other", "prefer_not_to_say"].includes(gender)
    ) {
      user.fitnessProfile.gender = gender;
    }

    // Activity Level
    if (
      typeof activityLevel === "string" &&
      ["sedentary", "light", "moderate", "active", "very_active"].includes(
        activityLevel
      )
    ) {
      user.fitnessProfile.activityLevel = activityLevel;
    }

    // Goal
    if (
      typeof goal === "string" &&
      ["lose", "maintain", "gain"].includes(goal)
    ) {
      user.fitnessProfile.goal = goal;
    }

    // Dietary Preferences
    if (
      typeof dietaryPreferences === "string" &&
      ["vegetarian", "non-vegetarian", "vegan", "eggetarian"].includes(
        dietaryPreferences
      )
    ) {
      user.fitnessProfile.dietaryPreferences = dietaryPreferences;
    }

    await user.save();
    return res.json(user.fitnessProfile);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const uploadAvatar = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    if (!(req.file.mimetype && req.file.mimetype.startsWith("image/"))) {
      return res.status(415).json({ message: "Unsupported media type" });
    }

    // Save to public/avatars and return a public URL
    const ext = path.extname(req.file.originalname || "").toLowerCase() ||
                (req.file.mimetype === "image/jpeg" ? ".jpg" :
                 req.file.mimetype === "image/png" ? ".png" :
                 req.file.mimetype === "image/webp" ? ".webp" : "");
    const filename = `${userId}-${Date.now()}${ext}`;
    const finalDir = path.join(__dirname, "..", "public", "avatars");
    await fs.promises.mkdir(finalDir, { recursive: true });
    await fs.promises.rename(req.file.path, path.join(finalDir, filename));

    const url = `/static/avatars/${filename}`;
    await User.updateOne({ _id: userId }, { $set: { profileImageUrl: url } });

    return res.json({ url });
  } catch (error) {
    return res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

module.exports = {
  getFitnessProfile,
  createFitnessProfile,
  updateFitnessProfile,
  uploadAvatar
};
