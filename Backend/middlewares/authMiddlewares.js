// const jwt = require("jsonwebtoken");
// // const User = require("../models/User");

// //middleware to protect routes 
// const protect =async (req ,res, next)=> {
//     try{
//         let token =req.headers.authorization;

//         if(token && token.startsWith("Bearer")){
//             token = token.split(" ") [1]; // Extract Token
//             const decoded = jwt.verify(token ,process.env.JWT_SECRET);
//             // req.userId = await User.findById(decoded.id).select("-password");
//             req.userId = decoded.id;
//             return next();

//         }
//         else {
//             return res.status(401).json({message:"Not authorized.no token"});
//         }
//     } catch (error){
//         res.status(401).json({message:"Token failed",error:error.message});
//     }
// };

// module.exports ={protect};

// const jwt = require("jsonwebtoken");

// const protect = async (req, res, next) => {
//     try {
//         let auth = req.headers.authorization || "";
//         // Expect "Bearer <token>"
//         if (!auth.startsWith("Bearer ")) {
//             return res.status(401).json({
//                 message: "Not authorized, no token"
//             });
//         }
//         const token = auth.slice(7); // after "Bearer "
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.userId = decoded.id;
//         return next();
//     } catch (error) {
//         return res.status(401).json({
//             message: "Not authorized, token invalid"
//         });
//     }
// };

// module.exports = {protect};

// middlewares/authMiddlewares.js
// const jwt = require("jsonwebtoken");

// const protect = (req, res, next) => {
//   const auth = req.headers.authorization || "";

//   // Expect "Bearer <token>"
//   if (!auth.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "Not authorized, no token" }); // 401: missing token [7][2]
//   }

//   const token = auth.split(" ")[1];
//   if (!process.env.JWT_SECRET) {
//     return res.status(500).json({ message: "Server misconfiguration: JWT secret missing" }); // guardrail [10]
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET); // may throw on invalid/expired [7]
//     // Normalize user attachment so controllers can rely on it
//     req.user = { id: decoded.id, ...decoded }; // keep original payload too [7][2]
//     return next();
//   } catch (err) {
//     // Differentiate invalid vs expired if desired
//     if (err.name === "TokenExpiredError") {
//       return res.status(401).json({ message: "Token expired" }); // 401 for expired [7]
//     }
//     return res.status(403).json({ message: "Not authorized, token invalid" }); // 403 for invalid [2]
//   }
// };

// module.exports = { protect };



// const jwt = require("jsonwebtoken");
// const User = require("../models/userModel");

// const protect = async (req, res, next) => {
//   let token;

//   // Check for token in headers
//   if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
//     try {
//       // Extract token
//       token = req.headers.authorization.split(" ")[1];

//       // Validate JWT_SECRET exists
//       if (!process.env.JWT_SECRET) {
//         console.error("JWT_SECRET is not configured");
//         return res.status(500).json({ message: "Server configuration error" });
//       }

//       // Verify token
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       // Attach user (without password) to request
//       req.user = await User.findById(decoded.id).select("-password");

//       if (!req.user) {
//         return res.status(401).json({ message: "User not found" });
//       }

//       next();
//     } catch (err) {
//       console.error("Token verification failed:", err.message);
//       return res.status(401).json({ message: "Not authorized, invalid token" });
//     }
//   }

//   if (!token) {
//     return res.status(401).json({ message: "Not authorized, no token provided" });
//   }
// };

// module.exports = { protect };


const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // ✅ Make sure path matches your file (user.js, not userModel.js)

const protect = async (req, res, next) => {
  try {
    let token;

    // ✅ 1. Check if Authorization header exists and starts with "Bearer"
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // ❌ No token provided
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, no token provided" });
    }

    // ✅ 2. Verify token
    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET is missing in .env file");
      return res
        .status(500)
        .json({ success: false, message: "Server configuration error" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ 3. Find user and attach to request
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found or deleted" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("🔒 Auth error:", err.message);

    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, message: "Token expired, please login again" });
    }

    return res
      .status(401)
      .json({ success: false, message: "Not authorized, invalid token" });
  }
};

module.exports = { protect };
