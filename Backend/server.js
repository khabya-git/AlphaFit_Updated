require("dotenv").config();

const connectDB = require("./config/db");
const app = require("./app");

(async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 8000;

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(
        `✅ CORS enabled for ${process.env.FRONTEND_URL || "http://localhost:5173"}`
      );
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
})();


// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const connectDB = require("./config/db");
// const errorHandler = require("./middlewares/errorHandler");
// const challengeRoutes = require("./routes/challengeRoutes");
// const workoutRoutes = require("./routes/workoutRoutes");

// const app = express();
// app.set("etag", false); 

// // ✅ CORS Configuration
// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL || "http://localhost:5173", // Frontend URL for local or deployed app
//     credentials: true, // Allow cookies / auth headers
//   }),
// );

// // ✅ Middleware
// app.use(express.json({ limit: "1mb" }));

// (async () => {
//   try {
//     await connectDB();

//     // ✅ Routes
//     app.use("/api/auth", require("./routes/authRoutes"));
//     app.use("/api/measurements", require("./routes/measurementRoutes"));
//     app.use("/api/user", require("./routes/userRoutes"));
//     app.use("/api/upload", require("./routes/uploadRoutes"));
//     app.use("/api/dashboard", require("./routes/dashboardRoutes")); // 👈 add this line if not already added
//     app.use("/api/food", require("./routes/foodRoutes"));
//     app.use("/uploads", express.static("uploads"));
//     app.use("/api/challenges", challengeRoutes);
//     app.use("/api/workout", workoutRoutes);

//     // ✅ Default route
//     app.get("/", (req, res) => {
//       res.send("Alpha-Fit API is Running...");
//     });

//     // 404 handler (MUST come before error handler)
//     app.use((req, res, next) => {
//       res.status(404).json({
//         success: false,
//         message: "Route not found",
//       });
//     });

//     // Global error handler (ABSOLUTELY LAST)
//     app.use(errorHandler);

//     // ✅ Start server
//     const PORT = process.env.PORT || 8000;
//     app.listen(PORT, () => {
//       console.log(`✅ Server running on port ${PORT}`);
//       console.log(
//         `✅ CORS enabled for ${process.env.FRONTEND_URL || "http://localhost:5173"}`,
//       );
//     });
//   } catch (error) {
//     console.error("❌ Failed to start server:", error);
//     process.exit(1);
//   }
// })();

// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// // Database connection
// const connectDB = require("./config/db");

// const app = express();
// // Middleware
// app.use(cors());
// // app.use(express.json());
// app.use(express.json({ limit: '1mb' }));

// (async () => {
//   try {
//     await connectDB();

//     // Routes
//     app.use("/api/auth", require("./routes/authRoutes"));
//     app.use("/api/measurements", require("./routes/measurementRoutes"));
//     app.use("/api/user", require("./routes/userRoutes"));
//     app.use("/api/upload", require("./routes/uploadRoutes"));
//     app.use("/uploads", express.static("uploads"));

//     // Default route
//     app.get("/", (req, res) => {
//       res.send("Alpha-Fit API is Running...");
//     });

//     // Start server
//     const PORT = process.env.PORT || 8000;
//     app.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//     });
//   } catch (error) {
//     console.error('Failed to start server:', error);
//     process.exit(1);
//   }
// })();

// import dotenv from "dotenv";
// // import authRoutes from "./routes/authRoutes.js";

// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const connectDB = require("./config/db");
// const authRoutes = require("./routes/authRoutes");

// dotenv.config();
// connectDB();

// const app = express();

// app.use(cors());
// app.use(express.json());

// // Routes
// app.use("/api/auth", authRoutes);

// // Health check
// app.get("/", (req, res) => {
//   res.send("API is running...");
// });

// const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const path = require("path");
// const connectDB = require("./config/db");

// const profileRoutes = require("./routes/profileRoutes");
// const authRoutes = require("./routes/authRoutes");
// // const userRoutes = require("./routes/userRoutes");
// // const taskRoutes = require("./routes/taskRoutes");
// // const reportRoutes = require("./routes/reportRoutes");
// // const mediaRoutes = require("./routes/mediaRoutes");

// const app = express();

// // app.use(
// //     cors({
// //   origin: process.env.CLIENT_URL || "*",
// //   methods: ["GET","POST","PUT","PATCH","DELETE"],
// //   allowedHeaders: ["Content-Type","Authorization"],
// //  })
// // );

// const allowlist = [
//   "http://localhost:5173",
//   process.env.CLIENT_URL,           // e.g. https://app.example.com
//   process.env.CLIENT_URL_2           // optional: add more origins
// ].filter(Boolean);

// const corsOptions = {
//   origin: function (origin, callback) {
//     // Allow no-origin requests (curl, mobile apps) or allowlisted origins
//     if (!origin || allowlist.includes(origin) || allowlist.length === 0) {
//       return callback(null, true);
//     }
//     return callback(new Error("Not allowed by CORS"));
//   },
//   methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: false // set to true only if using cookies; also configure `origin` accordingly
// };

// app.use(cors(corsOptions));
// // app.use(express.json());
// app.use(express.json({ limit: '1mb' }));             //changes
// app.use(express.urlencoded({ extended: true }));

// app.use("/static",express.static(path.join(__dirname, "public")));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// connectDB();

// app.use("/api/auth",authRoutes);
// app.use("/api/profile", profileRoutes);
// // app.use("/api/users",userRoutes);
// // app.use("/api/tasks",taskRoutes);
// // app.use("/api/reports",reportRoutes);
// // app.use("/api/media",mediaRoutes);

// app.get('/test', (req, res) => {
//   res.json({ message: 'Server is working!' });
// });

// // Centralized error handler to surface insert/validation errors as 4xx/5xx
// // This prevents "200 OK but nothing saved" by catching thrown errors in routes.
// app.use((err, req, res, next) => {                                     //changes
//   console.error('Unhandled error:', err?.message || err);
//   const status = err.status || 500;
//   res.status(status).json({ error: err.message || 'Server error' });
// });

// const PORT = process.env.PORT || 8000;
// // app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
// app.listen(PORT, () => {
//   console.log(`✅ Server is running on port ${PORT}`);
//   // console.log(`🌍 Access at: http://localhost:${PORT}`);
// });
