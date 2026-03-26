const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

/* ------------------ TOKEN GENERATION ------------------ */

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

/* ------------------ SIGNUP ------------------ */

const signup = async (req, res, next) => {
  try {
    let { name, email, password, profileImageUrl } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    name = name?.trim();
    email = email.toLowerCase().trim();
    password = password.trim();

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        // message: "Email already registered",
        message: "Registration failed" //updated on 9/3/26 Generic message to prevent email enumeration
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      profileImageUrl: profileImageUrl || "",
    });

    return res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImageUrl: user.profileImageUrl || null,
      },
    });
  } catch (err) {
    next(err); // let global error handler handle it
  }
};

/* ------------------ LOGIN ------------------ */

const login = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    email = email?.toLowerCase().trim();
    password = password?.trim();

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    // let isValid = false;
    // if (user) {
    //   isValid = await user.matchPassword(password);
    // }

    const isValid = user && (await user.matchPassword(password)); //updated  on 9/3/26 more concise, but still checks password if user exists

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    return res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImageUrl: user.profileImageUrl || null,
      },
    });
  } catch (err) {
    next(err);
  }
};

/* ------------------ GOOGLE AUTH ------------------ */

const googleAuth = async (req, res, next) => {
  try {
    const { email, name, profileImageUrl } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required for Google Auth",
      });
    }

    let user = await User.findOne({ email });
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      // Create new user for Google login with a secure random password
      user = await User.create({
        name: name || "Google User",
        email,
        password: Math.random().toString(36).slice(-10) + "A1!", 
        profileImageUrl: profileImageUrl || "",
      });
    }

    return res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImageUrl: user.profileImageUrl || null,
      },
      isNewUser,
    });
  } catch (err) {
    next(err);
  }
};

/* ------------------ UPDATE PROFILE ------------------ */

const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { name, age, height, weight, college, profileImageUrl } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (college !== undefined) user.college = college;
    if (profileImageUrl !== undefined) user.profileImageUrl = profileImageUrl;
    await user.save();

    const Measurement = require("../models/Measurement");
    let measurement = await Measurement.findOne({ userId });
    
    if (!measurement && (age || height || weight)) {
      measurement = new Measurement({
        userId,
        age: Number(age) || 23,
        height: Number(height) || 170,
        weight: Number(weight) || 70,
        gender: "prefer_not_to_say",
        activityLevel: "moderate",
        goal: "maintain",
        dietaryPreferences: "vegetarian"
      });
    } else if (measurement) {
      if (age) measurement.age = Number(age);
      if (height) measurement.height = Number(height);
      if (weight) measurement.weight = Number(weight);
    }
    
    if (measurement) {
      await measurement.save();
    }

    return res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        profileImageUrl: user.profileImageUrl || null,
        age: measurement?.age || user.age || 23,
        height: measurement?.height || "",
        weight: measurement?.weight || "",
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  googleAuth,
  updateProfile,
};



// const User = require("../models/userModel");
// const jwt = require("jsonwebtoken");

// // generate JWT token
// const generateToken = (id) => {
//   if (!process.env.JWT_SECRET) {
//     throw new Error("JWT_SECRET is not configured");
//   }
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: "7d",
//   });
// };
// // // @desc Register new user

// // // @route POST /api/auth/signup
// // const signup = async (req, res) => {
// //   try {
// //     const { name, email, password } = req.body;

// //     if (!name || !email || !password) {
// //       return res.status(400).json({ message: "All fields are required" });
// //     }

// //     const existingUser = await User.findOne({ email });
// //     if (existingUser) {
// //       return res.status(400).json({ message: "Email already registered" });
// //     }

// //     const user = await User.create({ name, email, password });

// //     return res.status(201).json({
// //       token: generateToken(user._id),
// //       user: {
// //         id: user._id,
// //         name: user.name,
// //         email: user.email,
// //       },
// //     });
// //   } catch (err) {
// //     res.status(500).json({ message: "Server error", error: err.message });
// //   }
// // };


// // @desc Register new user
// // @route POST /api/auth/signup


// const signup = async (req, res) => {
//   try {
//     const { name, email, password, profileImageUrl } = req.body; // ✅ include profileImageUrl

//     if (!name || !email || !password) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "Email already registered" });
//     }

//     const user = await User.create({
//       name,
//       email,
//       password,
//       profileImageUrl: profileImageUrl || "", // ✅ save photo if provided
//     });

//     return res.status(201).json({
//       token: generateToken(user._id),
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         profileImageUrl: user.profileImageUrl || null, // ✅ return photo to frontend
//       },
//     });
//   } catch (err) {
//     console.error("Signup error:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // @desc Login user
// // @route POST /api/auth/login
// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
    
//     // Always check password even if user doesn't exist (prevent timing attacks)
//     let isValid = false;
//     if (user) {
//       isValid = await user.matchPassword(password);
//     }
    
//     if (!isValid) {
//       return res.status(400).json({ message: "Invalid email or password" });
//     }
//     return res.json({
//       token: generateToken(user._id),
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };


// module.exports = {
//   login,signup
// };





















































// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// // Generate JWT
// const generateToken = (userId) => {
//   return jwt.sign({
//     id: userId
//   }, process.env.JWT_SECRET, {
//     expiresIn: "1d",
//   });
// };



// //@desc  Register a new user
// //@route POST /api/auth/register
// //@access Public
// // const registerUser = async (req, res) => {
// //     try{
// //     const { name, email, password, profileImageUrl} = 
// //     req.body;
// //     // Check if user already exists
// //     const userExists = await User.findOne({ email });
// //     if (userExists) {
// //       return res.status(400).json({ message: "User already exists" });
// //     }

// //     //Hash password
// //     const salt = await bcrypt.genSalt(10);
// //     const hashedPassword = await bcrypt.hash(password, salt);

// //     //Create new user
// //     const user = await User.create({
// //       name,
// //       email,
// //       password: hashedPassword,
// //       profileImageUrl,
// //     });

// //     //Return user data with JWT
// //     res.status(201).json({
// //       _id: user._id,
// //       name: user.name,
// //       email: user.email,
// //       profileImageUrl: user.profileImageUrl, 
// //       token: generateToken(user._id),
// //     });
// //     }catch(error) {
// //     res.status(500).json({ message: "Server error", error: error.message });
// //   }
// // };
// const registerUser = async (req, res) => {
//   try {
//     let {
//       name,
//       email,
//       password,
//       profileImageUrl
//     } = req.body;

//     // Basic validation
//     if (!name || !email || !password) {
//       return res.status(400).json({
//         message: "Name, email and password are required"
//       });
//     }

//     // Normalize inputs
//     email = String(email).trim().toLowerCase();
//     name = String(name).trim();

//     // Password policy
//     // - Min 8 chars
//     // - At least 1 uppercase, 1 lowercase, 1 digit, 1 special char
//     // - No leading/trailing spaces
//     const trimmedPassword = String(password);
//     if (trimmedPassword !== password) {
//       return res.status(400).json({
//         message: "Password cannot start or end with spaces"
//       });
//     }

//     const passwordPolicy =
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/; // \W includes special chars; _ included separately

//     if (!passwordPolicy.test(password)) {
//       return res.status(400).json({
//         message: "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
//       });
//     }

//     // Optional: Disallow very common passwords (add a small blacklist)
//     const commonBlackList = new Set([
//       "Password123!",
//       "Qwerty123!",
//       "Welcome123!",
//       "Admin123!",
//       "Passw0rd!",
//     ]);
//     if (commonBlackList.has(password)) {
//       return res.status(400).json({
//         message: "Please choose a stronger password"
//       });
//     }


//     // Check env for JWT secret (optional guard)
//     if (!process.env.JWT_SECRET) {
//       return res.status(500).json({
//         message: "Server misconfiguration: JWT_SECRET missing"
//       });
//     }

//     // Check if user already exists (case-insensitive)
//     const userExists = await User.findOne({
//       email
//     });
//     if (userExists) {
//       return res.status(400).json({
//         message: "User already exists"
//       });
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Optional: default avatar
//     if (!profileImageUrl) {
//       profileImageUrl = null; // or set a default path/URL
//     }

//     // Create new user
//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       profileImageUrl,
//     });

//     // Return user data with JWT
//     return res.status(201).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       profileImageUrl: user.profileImageUrl,
//       token: generateToken(user._id),
//     });
//   } catch (error) {
//     // Handle duplicate key race condition if unique index on email is present
//     if (error && error.code === 11000 && error.keyPattern && error.keyPattern.email) {
//       return res.status(400).json({
//         message: "User already exists"
//       });
//     }
//     return res.status(500).json({
//       message: "Server error",
//       error: error.message
//     });
//   }
// };



// //@desc  Login a user
// //@route POST /api/auth/login
// //@access Public
// const loginUser = async (req, res) => {
//   try {
//     const {
//       email,
//       password
//     } = req.body;

//     // Validate inputs
//     if (!email || !password) {
//       return res.status(400).json({
//         message: "Email and password are required"
//       });
//     }

//     // Normalize email without reassigning const
//     const normalizedEmail = String(email).trim().toLowerCase();

//     // Check if user exists (select password if excluded by schema)
//     const user = await User.findOne({
//       email: normalizedEmail
//     }).select("+password");
//     if (!user) {
//       return res.status(401).json({
//         message: "Invalid email or password"
//       });
//     }

//     // Compare password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({
//         message: "Invalid email or password"
//       });
//     }

//     // Return user data with JWT
//     return res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       profileImageUrl: user.profileImageUrl || null,
//       token: generateToken(user._id),
//     });
//   } catch (error) {
//     // Log error.stack in development to locate exact line if needed
//     return res.status(500).json({
//       message: "Server error",
//       error: error.message
//     });
//   }
// };



// //@desc  Get user profile
// //@route GET /api/auth/profile
// //@access Private (Requires Jwt)
// const getUserProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password");  //Id->id
//     if (!user) {
//       return res.status(404).json({
//         message: "User not found"
//       });
//     }
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({
//       message: "Server error",
//       error: error.message
//     });
//   }
// };



// //@desc  Update user profile
// //@route PUT /api/auth/profile
// //@access Private (Requires Jwt)
// // const updateUserProfile = async (req, res) => {
// //   try{
// //     const user = await User.findById(req.userId);
// //     if (!user) {
// //       return res.status(404).json({ message: "User not found" });
// //     }

// //     user.name = req.body.name || user.name;
// //     user.email = req.body.email || user.email;

// //     if (req.body.password) {
// //       //Hash new password
// //       const salt = await bcrypt.genSalt(10);
// //       user.password = await bcrypt.hash(req.body.password, salt);
// //     }

// //     const updatedUser = await user.save();

// //     res.json({
// //       _id: updatedUser._id,
// //       name: updatedUser.name,
// //       email: updatedUser.email,
// //       token: generateToken(updatedUser._id),
// //     });
// //   } catch(error) {
// //     res.status(500).json({ message: "Server error", error: error.message });
// //   }
// // };
// const updateUserProfile = async (req, res) => {
//   try {
//     if (!req.userId) {
//       return res.status(401).json({
//         message: "Unauthorized"
//       });
//     }

//     const user = await User.findById(req.userId).select("+password");
//     if (!user) {
//       return res.status(404).json({
//         message: "User not found"
//       });
//     }

//     // Incoming fields
//     let {
//       name,
//       email,
//       password,
//       profileImageUrl
//     } = req.body || {};

//     // Update name (ignore empty strings)
//     if (typeof name === "string" && name.trim().length > 0) {
//       user.name = name.trim();
//     }

//     // Update email with normalization and collision check
//     if (typeof email === "string" && email.trim().length > 0) {
//       const normalizedEmail = email.trim().toLowerCase();
//       if (normalizedEmail !== user.email) {
//         // Check for existing account with this email
//         const exists = await User.findOne({
//           email: normalizedEmail
//         }).select("_id");
//         if (exists) {
//           return res.status(400).json({
//             message: "Email is already in use"
//           });
//         }
//         user.email = normalizedEmail;
//         // Optional: if you enforce verification on email change
//         // user.emailVerified = false;
//         // trigger email verification flow here (send token)
//       }
//     }

//     // Update profile image URL (if you let users change it directly)
//     if (typeof profileImageUrl === "string" && profileImageUrl.trim().length > 0) {
//       user.profileImageUrl = profileImageUrl.trim();
//     }

//     // Update password (optional)
//     if (typeof password === "string" && password.length > 0) {
//       // Disallow leading/trailing spaces
//       if (password !== String(password)) {
//         return res.status(400).json({
//           message: "Invalid password"
//         });
//       }
//       if (password.trim() !== password) {
//         return res.status(400).json({
//           message: "Password cannot start or end with spaces"
//         });
//       }

//       // Basic policy: min 8 chars, 1 upper, 1 lower, 1 digit, 1 special
//       const policy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
//       if (!policy.test(password)) {
//         return res.status(400).json({
//           message: "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
//         });
//       }

//       const salt = await bcrypt.genSalt(10);
//       user.password = await bcrypt.hash(password, salt);
//     }

//     const updatedUser = await user.save();

//     // Re-issue JWT (optional). If your token only contains userId, it’s unchanged;
//     // still returning a fresh token is common after credential changes.
//     return res.json({
//       _id: updatedUser._id,
//       name: updatedUser.name,
//       email: updatedUser.email,
//       profileImageUrl: updatedUser.profileImageUrl || null,
//       token: generateToken(updatedUser._id),
//     });
//   } catch (error) {
//     // Handle duplicate key race condition on email (unique index)
//     if (error && error.code === 11000 && error.keyPattern && error.keyPattern.email) {
//       return res.status(400).json({
//         message: "Email is already in use"
//       });
//     }
//     return res.status(500).json({
//       message: "Server error",
//       error: error.message
//     });
//   }
// };


// module.exports = {
//   registerUser,
//   loginUser,
//   getUserProfile,
//   updateUserProfile
// };