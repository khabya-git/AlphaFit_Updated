// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//     },
//     password: {
//       type: String,
//       required: true,
//       minlength: 8,
//     },
//     profileImageUrl: { 
//       type: String, 
//       default: "" 
//     },
//   },
//   { timestamps: true }
// );

// // hash password before saving
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// // method to compare password
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// module.exports = mongoose.model("User", userSchema);


// c

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 12;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,  
    },
    email: {
      type: String,
      required: true,
      // unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"], //updated on 9/3/26- basic email format validation
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false, // Prevent accidental password return
    },
    profileImageUrl: {
      type: String,
      default: "",
    },
    xp: {
      type: Number,
      default: 0,
      min: 0,
    },
    college: {
      type: String,
      default: "College Student",
    },
    // role: {                               updated on 9/3/26 - we can add this later if we want to implement admin features
    //   type: String,
    //   enum: ["user", "admin"],
    //   default: "user",
    // },
  },
  { timestamps: true }
);

/* ------------------ INDEXES ------------------ */

userSchema.index({ email: 1 }, { unique: true });

/* ------------------ PASSWORD HASHING ------------------ */

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  next();
});

/* ------------------ PASSWORD MATCH ------------------ */

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);