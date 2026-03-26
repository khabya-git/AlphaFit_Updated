// controllers/userController.js
// Handles user-related routes (requires authentication)

const User = require("../models/userModel");

const getDashboard = async (req, res) => {
  try {
    res.json({
      message: "Welcome to the User Dashboard!",
      user: req.user, // user info from protect middleware
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getPoseDetection = async (req, res) => {
  try {
    res.json({ message: "Pose Detection page", user: req.user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getGamification = async (req, res) => {
  try {
    res.json({ message: "Gamification page", user: req.user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getDietChart = async (req, res) => {
  try {
    res.json({ message: "Diet Chart page", user: req.user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getWorkoutPlan = async (req, res) => {
  try {
    res.json({ message: "Workout Plan page", user: req.user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getMealPrep = async (req, res) => {
  try {
    res.json({ message: "Meal Prep page", user: req.user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 👇 NEW: Upload or update avatar
// const uploadAvatar = async (req, res) => {
//   try {
//     const { imageUrl } = req.body;
//     if (!imageUrl) {
//       return res.status(400).json({ message: "Image URL is required" });
//     }

//     const user = await User.findByIdAndUpdate(
//       req.user.id,
//       { profileImageUrl: imageUrl }, // assumes User model has an `avatar` field
//       { new: true }
//     ).select("-password");

//     res.json({ message: "Avatar updated successfully",imageUrl, user });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };


// Upload or update avatar
// const uploadAvatar = async (req, res) => {
//   try {
//     // The upload route already puts the file on disk
//     // Now we take the uploaded file and save its URL in the DB

//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     // File URL served via static /uploads route
//     const imageUrl = `/uploads/${req.file.filename}`;

//     const user = await User.findByIdAndUpdate(
//       req.user.id,
//       { profileImageUrl: imageUrl }, // Make sure User model has this field
//       { new: true }
//     ).select("-password");

//     res.json({
//       message: "Avatar uploaded successfully",
//       imageUrl,
//       user,
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// controllers/userController.js
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // if (!req.user || !req.user.id) {
    //   return res.status(401).json({ message: "Unauthorized: user not found" });
    // }

    const avatarUrl = `http://localhost:8000/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profileImageUrl: avatarUrl },
      { new: true }
    ).select("-password");

    // if (!user) {
    //   return res.status(404).json({ message: "User not found" });
    // }

    res.json({
      message: "Avatar uploaded and saved",
      avatarUrl,
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// const uploadAvatar = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     if (!req.user) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const avatarUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

//     const user = await User.findByIdAndUpdate(
//       req.user.id,
//       { profileImageUrl: avatarUrl },
//       { new: true }
//     ).select("-password");

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json({
//       message: "Avatar uploaded successfully",
//       avatarUrl,
//       user,
//     });

//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };



module.exports = {
  getDashboard,
  getPoseDetection,
  getGamification,
  getDietChart,
  getWorkoutPlan,
  getMealPrep,
  uploadAvatar,
};
