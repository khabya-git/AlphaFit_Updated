// const mongoose = require('mongoose');

// const foodSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     index: true, // Regular index for exact matches
//   },
//   nameLower: {
//     type: String,
//     index: true, // Lowercase for case-insensitive search
//   },
//   brand: {
//     type: String,
//     index: true,
//   },
//   category: {
//     type: String,
//     index: true,
//     enum: ['Protein', 'Carbs', 'Vegetables', 'Fruits', 'Dairy', 'Snacks', 'Beverages', 'Other']
//   },
  
//   // Nutrition data
//   servingSize: String,
//   servingUnit: String,
  
//   calories: { type: Number, required: true, index: true },
//   protein: { type: Number, required: true },
//   carbs: { type: Number, required: true },
//   fats: { type: Number, required: true },
  
//   // Micronutrients
//   fiber: { type: Number, default: 0 },
//   sugar: { type: Number, default: 0 },
//   sodium: { type: Number, default: 0 },
//   cholesterol: { type: Number, default: 0 },
  
//   // Vitamins & Minerals
//   vitaminA: { type: Number, default: 0 },
//   vitaminC: { type: Number, default: 0 },
//   calcium: { type: Number, default: 0 },
//   iron: { type: Number, default: 0 },
  
//   // Metadata
//   barcode: String,
//   verified: { type: Boolean, default: false },
//   popularity: { type: Number, default: 0, index: true }, // Track popular items
  
//   createdAt: { type: Date, default: Date.now },
// }, {
//   timestamps: true
// });

// // Create text index for full-text search
// foodSchema.index({ 
//   name: 'text', 
//   brand: 'text', 
//   category: 'text' 
// }, {
//   weights: {
//     name: 10,
//     brand: 5,
//     category: 1
//   }
// });

// // Compound index for efficient filtering
// foodSchema.index({ category: 1, popularity: -1 });
// foodSchema.index({ calories: 1 });

// // Pre-save hook to create lowercase name
// foodSchema.pre('save', function(next) {
//   this.nameLower = this.name.toLowerCase();
//   next();
// });

// module.exports = mongoose.model('Food', foodSchema);


const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    nameLower: {
      type: String,
      index: true,
    },

    brand: {
      type: String,
      trim: true,
      index: true,
    },

    category: {
      type: String,
      enum: [
        "Protein",
        "Carbs",
        "Vegetables",
        "Fruits",
        "Dairy",
        "Snacks",
        "Beverages",
        "Other",
      ],
      index: true,
    },

    servingSize: String,
    servingUnit: String,

    calories: { type: Number, required: true, index: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fats: { type: Number, required: true },

    fiber: { type: Number, default: 0 },
    sugar: { type: Number, default: 0 },
    sodium: { type: Number, default: 0 },
    cholesterol: { type: Number, default: 0 },

    vitaminA: { type: Number, default: 0 },
    vitaminC: { type: Number, default: 0 },
    calcium: { type: Number, default: 0 },
    iron: { type: Number, default: 0 },

    barcode: {
      type: String,
      index: true,
    },

    verified: { type: Boolean, default: false },

    popularity: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  { timestamps: true }
);

/* ---------- Auto Lowercase Name ---------- */
foodSchema.pre("save", function (next) {
  if (this.name) {
    this.nameLower = this.name.toLowerCase();
  }
  next();
});

/* ---------- Weighted Text Search ---------- */
foodSchema.index(
  {
    name: "text",
    brand: "text",
    category: "text",
  },
  {
    weights: {
      name: 10,
      brand: 5,
      category: 1,
    },
  }
);

module.exports = mongoose.model("Food", foodSchema);