require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const errorHandler = require("./middlewares/errorHandler");
const challengeRoutes = require("./routes/challengeRoutes");
const workoutRoutes = require("./routes/workoutRoutes");

const app = express();

app.set("etag", false);

app.use(morgan("dev"));

// CORS - Allow both local development and live Vercel production UI automatically
app.use(
  cors({
    origin: [
      "http://localhost:5173", 
      "https://alpha-fit-updated.vercel.app",
      process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/measurements", require("./routes/measurementRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/food", require("./routes/foodRoutes"));
app.use("/api/exercises", require("./routes/exerciseRoutes")); // updated on 10/3/26 - added exercise routes
app.use("/api/gamification", require("./routes/gamificationRoutes")); // added on 10/3/26 - new route for gamification features like user progress and rewards
app.use("/api/analytics", require("./routes/analyticsRoutes")); // added on 10/3/26 - new route for analytics features
app.use("/api/recommendations", require("./routes/recommendationRoutes")); // added on 10/3/26 - new route for workout recommendations
app.use("/uploads", express.static("uploads"));
app.use("/api/challenges", challengeRoutes);
app.use("/api/workout", workoutRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Alpha-Fit API is Running...");
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;