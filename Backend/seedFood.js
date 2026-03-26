require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const csv = require("csv-parser");

const connectDB = require("./config/db");
const Food = require("./models/Food");

const seedFood = async () => {
  try {
    await connectDB();
    console.log("MongoDB Connected...");

    const foods = [];

    fs.createReadStream("./data/nutrition_data.csv")
      .pipe(csv())
      .on("data", (row) => {
        foods.push({
          name: row.Name,
          nameLower: row.Name?.toLowerCase(),
          calories: Number(row.Calories) || 0,
          protein: Number(row.Protein) || 0,
          carbs: Number(row.Carbs || row.Carbohydrates) || 0,
          fats: Number(row.Fat || row.Fats) || 0,
          category: row.Category || "Other",
        });
      })
      .on("end", async () => {
        await Food.deleteMany(); // Optional: clears old data
        await Food.insertMany(foods);

        console.log("Food data inserted successfully!");
        process.exit();
      });

  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedFood();