const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Challenge = require("./models/Challenge");

dotenv.config();

const challenges = [
  // DAILY
  {
    title: "10K Step Commander 🚶",
    description: "Hit 10,000 steps today to boost your NEAT.",
    goal: 10000,
    points: 100,
    type: "consistency",
    period: "daily",
    order: 1,
  },
  {
    title: "50 Push-Up Pump 💪",
    description: "Knock out 50 strict push-ups before midnight.",
    goal: 50,
    points: 100,
    type: "strength",
    period: "daily",
    order: 2,
  },
  {
    title: "Core Stability Hold ⏱️",
    description: "Hold a forearm plank for 120 cumulative seconds.",
    goal: 120,
    points: 100,
    type: "strength",
    period: "daily",
    order: 3,
  },
  
  // WEEKLY
  {
    title: "The Iron Routine 🏋️",
    description: "Complete 4 rigorous weight-training sessions this week.",
    goal: 4,
    points: 300,
    type: "strength",
    period: "weekly",
    order: 4,
  },
  {
    title: "Cardio Crusher 🏃‍♂️",
    description: "Accumulate 15 kilometers of running or rowing.",
    goal: 15,
    points: 300,
    type: "consistency",
    period: "weekly",
    order: 5,
  },
  {
    title: "Pull-Up Dominance 🧗",
    description: "Log 100 strict pull-ups throughout the week.",
    goal: 100,
    points: 500,
    type: "strength",
    period: "weekly",
    order: 6,
  },

  // MONTHLY
  {
    title: "1000 Squats Challenge 🦵",
    description: "Complete 1,000 deep squats by the end of the month.",
    goal: 1000,
    points: 1000,
    type: "strength",
    period: "monthly",
    order: 7,
  },
  {
    title: "The Murph Prep 🦅",
    description: "Run 20km and log 500 pushups over 30 days.",
    goal: 20,
    points: 1500,
    type: "consistency",
    period: "monthly",
    order: 8,
  },
  {
    title: "Clean Fuel System 🥗",
    description: "Eat clean (no junk/sugar) for 25 days this month.",
    goal: 25,
    points: 1200,
    type: "nutrition",
    period: "monthly",
    order: 9,
  },
];

const seedChallenges = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to MongoDB");

    await Challenge.deleteMany(); // safe reset for submission mode

    await Challenge.insertMany(challenges);

    console.log("Challenges seeded successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedChallenges();