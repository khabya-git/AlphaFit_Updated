// const mongoose = require("mongoose");

// const workoutLogSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//       index: true
//     },

//     exercise: {
//       type: String,
//       required: true,
//       trim: true,
//       index: true
//     },

//     weight: {
//       type: Number,
//       required: true,
//       min: 0
//     },

//     reps: {
//       type: Number,
//       required: true,
//       min: 1
//     },

//     sets: {
//       type: Number,
//       required: true,
//       min: 1
//     },

//     // ⚠️ Backend authoritative field
//     volume: {
//       type: Number,
//       required: true,
//       min: 0
//     },

//     // ⚠️ Backend decides PR
//     isPR: {
//       type: Boolean,
//       default: false,
//       index: true
//     },

//     date: {
//       type: Date,
//       required: true,
//       default: Date.now,
//       index: true
//     }
//   },
//   {
//     timestamps: true
//   }
// );

// // --------------------------------------------------
// // Compound Index for Performance Queries
// // --------------------------------------------------

// // For PR detection & exercise history
// workoutLogSchema.index({ user: 1, exercise: 1, date: -1 });

// // For dashboard aggregations
// workoutLogSchema.index({ user: 1, date: -1 });

// // Prevent duplicate exact log entry (optional strictness)
// // workoutLogSchema.index(
// //   { user: 1, exercise: 1, date: 1, weight: 1, reps: 1, sets: 1 },
// //   { unique: true }
// // );

// const WorkoutLog = mongoose.model("WorkoutLog", workoutLogSchema);

// module.exports = WorkoutLog;






// updated on 10/3/26 - refactored to have sets as a subdocument array, and auto-calculate volume in a pre-save hook. This allows for more flexible logging of different set structures (e.g. drop sets, pyramid sets) while still maintaining accurate volume tracking.


const mongoose = require("mongoose");

/* ------------------ SET SUB-SCHEMA ------------------ */

const setSchema = new mongoose.Schema({
  weight: {
    type: Number,
    required: true,
    min: 0
  },

  reps: {
    type: Number,
    required: true,
    min: 1
  }
});

/* ------------------ WORKOUT LOG ------------------ */

const workoutLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    exercise: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true
    },

    sets: [setSchema], // each set has weight + reps

    volume: {
      type: Number,
      default: 0,
      min: 0
    },

    isPR: {
      type: Boolean,
      default: false,
      index: true
    },

    date: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: true
  }
);

/* ------------------ AUTO CALCULATE VOLUME ------------------ */

workoutLogSchema.pre("save", function (next) {

  let totalVolume = 0;

  this.sets.forEach((set) => {
    totalVolume += set.weight * set.reps;
  });

  this.volume = totalVolume;

  next();
});

/* ------------------ INDEXES ------------------ */

workoutLogSchema.index({ user: 1, exercise: 1, date: -1 });
workoutLogSchema.index({ user: 1, date: -1 });

const WorkoutLog = mongoose.model("WorkoutLog", workoutLogSchema);

module.exports = WorkoutLog;