// const express = require("express");
// const router = express.Router();
// const { protect } = require("../middlewares/authMiddlewares");
// const User = require("../models/userModel");

// // ✅ Add nutrition item to user dashboard
// router.post("/nutrition", protect, async (req, res) => {
//   try {
//     const { foodName, calories, protein, carbs, fats } = req.body;
//     const user = await User.findById(req.user.id);

//     if (!user) return res.status(404).json({ message: "User not found" });

//     // Push to user's nutrition history
//     user.nutritionHistory.push({ foodName, calories, protein, carbs, fats });

//     await user.save();
//     res.status(200).json({ message: "Food added to dashboard successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const { protect } = require("../middlewares/authMiddlewares");
// const User = require("../models/userModel"); // or "../models/user" if that’s your filename

// // ✅ Add new nutrition item
// router.post("/nutrition", protect, async (req, res) => {
//   try {
//     const { foodName, calories, protein, carbs, fats } = req.body;
//     const user = await User.findById(req.user.id);

//     if (!user) return res.status(404).json({ message: "User not found" });

//     user.nutritionHistory.push({ foodName, calories, protein, carbs, fats });
//     await user.save();

//     res.status(200).json({ message: "Food added successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });

// // ✅ Fetch user nutrition history (for dashboard)
// router.get("/", protect, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("nutritionHistory");

//     if (!user) return res.status(404).json({ message: "User not found" });

//     res.status(200).json({
//       nutritionHistory: user.nutritionHistory,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const { protect } = require("../middlewares/authMiddlewares");
// const NutritionLog = require("../models/NutritionLog");

// /* ---------------- ADD NUTRITION LOG ---------------- */

// router.post("/nutrition", protect, async (req, res, next) => {
//   try {
//     const { foodId, quantity, calories, protein, carbs, fats } = req.body;

//     if (!foodId || !quantity) {
//       return res.status(400).json({
//         success: false,
//         message: "Food and quantity are required",
//       });
//     }

//     const log = await NutritionLog.create({
//       user: req.user.id,
//       food: foodId,
//       quantity,
//       calories,
//       protein,
//       carbs,
//       fats,
//     });

//     res.status(201).json({
//       success: true,
//       data: log,
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// /* ---------------- GET DASHBOARD DATA ---------------- */

// router.get("/", protect, async (req, res, next) => {
//   try {
//     const userId = req.user.id;

//     const thirtyDaysAgo = new Date();
//     thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

//     const logs = await NutritionLog.aggregate([
//       {
//         $match: {
//           user: require("mongoose").Types.ObjectId(userId),
//           date: { $gte: thirtyDaysAgo },
//         },
//       },
//       {
//         $group: {
//           _id: {
//             $dateToString: { format: "%Y-%m-%d", date: "$date" },
//           },
//           totalCalories: { $sum: "$calories" },
//           totalProtein: { $sum: "$protein" },
//           totalCarbs: { $sum: "$carbs" },
//           totalFats: { $sum: "$fats" },
//         },
//       },
//       {
//         $sort: { _id: 1 },
//       },
//     ]);

//     res.json({
//       success: true,
//       data: logs,
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// module.exports = router;

// const express = require("express");
// const mongoose = require("mongoose");
// const router = express.Router();

// const { protect } = require("../middlewares/authMiddlewares");
// const NutritionLog = require("../models/NutritionLog");
// const Food = require("../models/Food");

// /* =======================================================
//    ADD NUTRITION LOG
//    ======================================================= */

// router.post("/nutrition", protect, async (req, res, next) => {
//   try {
//     const { foodId, quantity } = req.body;

//     if (!foodId || !quantity || quantity <= 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Food and valid quantity are required",
//       });
//     }

//     // Always calculate macros from Food collection
//     const food = await Food.findById(foodId).lean();

//     if (!food) {
//       return res.status(404).json({
//         success: false,
//         message: "Food not found",
//       });
//     }

//     const log = await NutritionLog.create({
//       user: req.user.id,
//       food: food._id,
//       quantity,
//       calories: food.calories * quantity,
//       protein: food.protein * quantity,
//       carbs: food.carbs * quantity,
//       fats: food.fats * quantity,
//     });

//     res.status(201).json({
//       success: true,
//       data: log,
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// /* =======================================================
//    DASHBOARD SUMMARY (LAST 30 DAYS + TODAY TOTAL)
//    ======================================================= */

// router.get("/", protect, async (req, res, next) => {
//   try {
//     res.set("Cache-Control", "no-store");
//     const userId = new mongoose.Types.ObjectId(req.user.id);

//     const now = new Date();
//     const thirtyDaysAgo = new Date();
//     thirtyDaysAgo.setDate(now.getDate() - 30);

//     const todayStart = new Date();
//     todayStart.setHours(0, 0, 0, 0);

//     const aggregation = await NutritionLog.aggregate([
//       {
//         $match: {
//           user: userId,
//           date: { $gte: thirtyDaysAgo },
//         },
//       },
//       {
//         $facet: {
//           /* ---------- Daily Totals (30 Days) ---------- */
//           daily: [
//             {
//               $group: {
//                 _id: {
//                   $dateToString: {
//                     format: "%Y-%m-%d",
//                     date: "$date",
//                   },
//                 },
//                 totalCalories: { $sum: "$calories" },
//                 totalProtein: { $sum: "$protein" },
//                 totalCarbs: { $sum: "$carbs" },
//                 totalFats: { $sum: "$fats" },
//               },
//             },
//             { $sort: { _id: 1 } },
//           ],

//           /* ---------- Today's Total ---------- */
//           today: [
//             {
//               $match: {
//                 date: { $gte: todayStart },
//               },
//             },
//             {
//               $group: {
//                 _id: null,
//                 totalCalories: { $sum: "$calories" },
//                 totalProtein: { $sum: "$protein" },
//                 totalCarbs: { $sum: "$carbs" },
//                 totalFats: { $sum: "$fats" },
//               },
//             },
//           ],
//         },
//       },
//     ]);

//     const daily = aggregation[0].daily;
//     const today = aggregation[0].today[0] || {
//       totalCalories: 0,
//       totalProtein: 0,
//       totalCarbs: 0,
//       totalFats: 0,
//     };

//     res.json({
//       success: true,
//       data: {
//         daily,
//         today,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// module.exports = router;

const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const { protect } = require("../middlewares/authMiddlewares");
const NutritionLog = require("../models/NutritionLog");
const BodyMetrics = require("../models/BodyMetrics");
const Food = require("../models/Food");

/* =======================================================
   ADD NUTRITION LOG
   ======================================================= */

router.post("/nutrition", protect, async (req, res, next) => {
  try {
    const { foodId, quantity } = req.body;

    if (!foodId || !quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Food and valid quantity are required",
      });
    }

    const food = await Food.findById(foodId).lean();

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    const log = await NutritionLog.create({
      user: req.user.id,
      food: food._id,
      quantity,
      calories: food.calories * quantity,
      protein: food.protein * quantity,
      carbs: food.carbs * quantity,
      fats: food.fats * quantity,
    });

    res.status(201).json({
      success: true,
      data: log,
    });
  } catch (error) {
    next(error);
  }
});

/* =======================================================
   DASHBOARD ANALYTICS (30 DAYS + TODAY + WEEKLY)
   ======================================================= */

router.get("/", protect, async (req, res, next) => {
  try {
    res.set("Cache-Control", "no-store");

    const userId = new mongoose.Types.ObjectId(req.user.id);

    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    /* ===============================
       DAILY (30 DAYS) + TODAY
    =============================== */

    const aggregation = await NutritionLog.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: thirtyDaysAgo },
        },
      },
      {
        $facet: {
          daily: [
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$date",
                  },
                },
                totalCalories: { $sum: "$calories" },
                totalProtein: { $sum: "$protein" },
                totalCarbs: { $sum: "$carbs" },
                totalFats: { $sum: "$fats" },
              },
            },
            { $sort: { _id: 1 } },
          ],
          today: [
            {
              $match: {
                date: { $gte: todayStart },
              },
            },
            {
              $group: {
                _id: null,
                totalCalories: { $sum: "$calories" },
                totalProtein: { $sum: "$protein" },
                totalCarbs: { $sum: "$carbs" },
                totalFats: { $sum: "$fats" },
              },
            },
          ],
        },
      },
    ]);

    const daily = aggregation[0].daily || [];

    const today = aggregation[0].today[0] || {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFats: 0,
    };

    /* ===============================
       WEEKLY CALORIES (LAST 30 DAYS)
    =============================== */
    /* ===============================
   WEEKLY MACRO AGGREGATION
=============================== */

    /* ===============================
   LAST 7 DAYS MACRO DATA
=============================== */

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const weeklyAgg = await NutritionLog.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" },
          },
          calories: { $sum: "$calories" },
          protein: { $sum: "$protein" },
          carbs: { $sum: "$carbs" },
          fats: { $sum: "$fats" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const weeklyMap = {};

    weeklyAgg.forEach((d) => {
      weeklyMap[d._id] = d;
    });

    const weekly = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const key = date.toISOString().slice(0, 10);

      const formattedDate = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      }); // 07 Mar

      const day = date.toLocaleDateString("en-US", {
        weekday: "short",
      }); // Sat

      if (weeklyMap[key]) {
        weekly.push({
          period: formattedDate,
          day,
          calories: weeklyMap[key].calories,
          protein: weeklyMap[key].protein,
          carbs: weeklyMap[key].carbs,
          fats: weeklyMap[key].fats,
        });
      } else {
        weekly.push({
          period: formattedDate,
          day,
          calories: 0,
          protein: 0,
          carbs: 0,
          fats: 0,
        });
      }
    }

    // const weekly = [];

    // for (let i = 6; i >= 0; i--) {
    //   const date = new Date();
    //   date.setDate(date.getDate() - i);

    //   const key = date.toISOString().slice(0, 10);

    //   const formattedDate = date.toLocaleDateString("en-GB", {
    //     day: "2-digit",
    //     month: "short",
    //   }); // 07 Mar

    //   if (weeklyMap[key]) {
    //     weekly.push({
    //       period: formattedDate,
    //       day,
    //       // period: key,
    //       calories: weeklyMap[key].calories,
    //       protein: weeklyMap[key].protein,
    //       carbs: weeklyMap[key].carbs,
    //       fats: weeklyMap[key].fats,
    //     });
    //   } else {
    //     weekly.push({
    //       period: formattedDate,
    //       day,
    //       // period: key,
    //       calories: 0,
    //       protein: 0,
    //       carbs: 0,
    //       fats: 0,
    //     });
    //   }
    // }
    // const weeklyAgg = await NutritionLog.aggregate([
    //   {
    //     $match: {
    //       user: userId,
    //       date: { $gte: thirtyDaysAgo },
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: {
    //         year: { $year: "$date" },
    //         week: { $week: "$date" },
    //       },
    //       totalCalories: { $sum: "$calories" },
    //     },
    //   },
    //   {
    //     $sort: { "_id.year": 1, "_id.week": 1 },
    //   },
    // ]);

    // const weekly = weeklyAgg.map((w) => ({
    //   period: `${w._id.year}-W${w._id.week}`,
    //   calories: w.totalCalories,
    // }));

    /* ===============================
   MONTHLY MACRO AGGREGATION
=============================== */

    const monthlyAgg = await NutritionLog.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $isoWeekYear: "$date" },
            week: { $isoWeek: "$date" },
          },
          totalCalories: { $sum: "$calories" },
          totalProtein: { $sum: "$protein" },
          totalCarbs: { $sum: "$carbs" },
          totalFats: { $sum: "$fats" },
          minDate: { $min: "$date" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.week": 1 },
      },
    ]);

    // Label each weekly bucket relative to this month (Week 1, Week 2...)
    const monthly = monthlyAgg.map((m, index) => {
      const weekDate = new Date(m.minDate);
      const weekLabel = weekDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      });
      return {
        period: `W${index + 1} (${weekLabel})`,
        calories: Math.round(m.totalCalories),
        protein: Math.round(m.totalProtein),
        carbs: Math.round(m.totalCarbs),
        fats: Math.round(m.totalFats),
      };
    });

    /* ===============================
       CALORIE GOAL + PERCENTAGE
    =============================== */

    const calorieGoal = 2000;

    const caloriePercentage = Number(
      ((today.totalCalories / calorieGoal) * 100).toFixed(1),
    );

    /* ===============================
   WEIGHT ANALYTICS
=============================== */

    const weightData = await BodyMetrics.find({
      user: userId,
      date: { $gte: thirtyDaysAgo },
    })
      .sort({ date: 1 })
      .lean();

    const weightTrend = weightData.map((item, index, arr) => {
      const slice = arr.slice(Math.max(0, index - 6), index + 1);
      const avg =
        slice.reduce((sum, val) => sum + val.weight, 0) / slice.length;

      return {
        date: item.date,
        weight: item.weight,
        movingAvg: Number(avg.toFixed(2)),
      };
    });

    let weeklyChange = 0;

    if (weightData.length >= 14) {
      const thisWeek =
        weightData.slice(-7).reduce((sum, w) => sum + w.weight, 0) / 7;

      const lastWeek =
        weightData.slice(-14, -7).reduce((sum, w) => sum + w.weight, 0) / 7;

      weeklyChange = Number(
        (((thisWeek - lastWeek) / lastWeek) * 100).toFixed(2),
      );
    }

    const goalWeight = 70;

    const startWeight = weightData[0]?.weight || 0;
    const currentWeight = weightData[weightData.length - 1]?.weight || 0;

    const goalProgress =
      startWeight && goalWeight !== startWeight
        ? Number(
            (
              ((startWeight - currentWeight) / (startWeight - goalWeight)) *
              100
            ).toFixed(1),
          )
        : 0;

    //  res.json({
    // success: true,
    // data: {
    //   nutrition: {
    //     daily,
    //     weekly,
    //     todayCalories: today.totalCalories,
    //     calorieGoal,
    //     caloriePercentage,
    //     macros: {
    //       protein: today.totalProtein,
    //       carbs: today.totalCarbs,
    //       fats: today.totalFats,
    //     },
    //   },
    res.json({
      success: true,
      data: {
        nutrition: {
          daily,
          weekly,
          monthly,

          todayCalories: today.totalCalories,
          todayProtein: today.totalProtein,
          todayCarbs: today.totalCarbs,
          todayFat: today.totalFats,

          calorieGoal,
          caloriePercentage,
        },
        weight: {
          trend: weightTrend,
          weeklyChange,
          goalWeight,
          goalProgress,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

/* =======================================================
   ADD BODY METRIC (WEIGHT ENTRY)
   ======================================================= */

router.post("/weight", protect, async (req, res, next) => {
  try {
    const { weight } = req.body;

    if (!weight || weight <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid weight is required",
      });
    }

    const entry = await BodyMetrics.create({
      user: req.user.id,
      weight,
    });

    res.status(201).json({
      success: true,
      data: entry,
    });
  } catch (error) {
    next(error);
  }
});

/* =======================================================
   RESET TODAY'S NUTRITION LOG
   ======================================================= */

router.delete("/nutrition/today", protect, async (req, res, next) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    await NutritionLog.deleteMany({
      user: req.user.id,
      date: { $gte: todayStart },
    });

    res.json({
      success: true,
      message: "Today's nutrition log has been reset.",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
