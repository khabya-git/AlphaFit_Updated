const express = require("express");
const rateLimit = require("express-rate-limit");
const { login, signup, googleAuth, updateProfile } = require("../controllers/authController");

const router = express.Router();

/* ------------------ RATE LIMITER ------------------ */
// Prevent brute-force login attacks
const signupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 100 requests per window
  message: {
    success: false,
    message: "Too many signup attempts. Please try again later.",
  },
});

// Stricter limiter for login to prevent brute force attacks  // updated on 9/3/26 - increased limits to accommodate testing, can adjust later if needed
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 login attempts
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});

const { protect } = require("../middlewares/authMiddlewares");

/* ------------------ ROUTES ------------------ */

router.post("/signup", signupLimiter, signup);
router.post("/login", loginLimiter, login);
router.post("/google", googleAuth);
router.put("/update-profile", protect, updateProfile);

module.exports = router;



// const express = require("express");
// const { login,signup } = require("../controllers/authController")

// const router = express.Router();

// // const rateLimit = require('express-rate-limit');

// // const authLimiter = rateLimit({
// //   windowMs: 15 * 60 * 1000, // 15 minutes
// //   max: 5, // limit each IP to 5 requests per windowMs
// //   message: 'Too many attempts, please try again later'
// // });

// // router.post("/signup", authLimiter, signup);
// // router.post("/login", authLimiter, login);

// router.post("/signup", signup);
// router.post("/login", login);

// module.exports = router

// router.get("/profile", protect, getUserProfile); // Get user profile
// router.put("/profile",protect, updateUserProfile); // Update profile
