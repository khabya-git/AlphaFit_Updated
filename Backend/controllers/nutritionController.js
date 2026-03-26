// const Food = require('../models/Food');

// // Search food with pagination and caching
// exports.searchFood = async (req, res) => {
//   try {
//     const { 
//       q: query, 
//       page = 1, 
//       limit = 20, 
//       category,
//       sortBy = 'relevance' 
//     } = req.query;

//     if (!query || query.trim().length < 2) {
//       return res.status(400).json({ 
//         message: 'Query must be at least 2 characters' 
//       });
//     }

//     const skip = (page - 1) * limit;
    
//     // Build search query
//     let searchQuery = {};
//     let sortOptions = {};

//     // MongoDB Full-Text Search
//     if (query.trim().length >= 2) {
//       searchQuery = {
//         $or: [
//           { $text: { $search: query } }, // Full-text search
//           { nameLower: { $regex: query.toLowerCase(), $options: 'i' } }, // Regex fallback
//           { brand: { $regex: query, $options: 'i' } }
//         ]
//       };
//     }

//     // Filter by category if provided
//     if (category && category !== 'all') {
//       searchQuery.category = category;
//     }

//     // Sort options
//     switch (sortBy) {
//       case 'popularity':
//         sortOptions = { popularity: -1, name: 1 };
//         break;
//       case 'calories':
//         sortOptions = { calories: 1 };
//         break;
//       case 'protein':
//         sortOptions = { protein: -1 };
//         break;
//       case 'name':
//         sortOptions = { name: 1 };
//         break;
//       default: // relevance
//         if (searchQuery.$text) {
//           sortOptions = { score: { $meta: 'textScore' } };
//         } else {
//           sortOptions = { popularity: -1 };
//         }
//     }

//     // Execute search with projection (only return needed fields)
//     const foods = await Food.find(
//       searchQuery,
//       searchQuery.$text ? { score: { $meta: 'textScore' } } : null
//     )
//       .select('name brand category servingSize calories protein carbs fats fiber sugar sodium')
//       .sort(sortOptions)
//       .limit(parseInt(limit))
//       .skip(skip)
//       .lean(); // Convert to plain JavaScript objects for better performance

//     // Get total count for pagination
//     const total = await Food.countDocuments(searchQuery);

//     // Update popularity for returned items (async, don't wait)
//     if (foods.length > 0) {
//       Food.updateMany(
//         { _id: { $in: foods.map(f => f._id) } },
//         { $inc: { popularity: 1 } }
//       ).exec(); // Fire and forget
//     }

//     res.json({
//       success: true,
//       data: foods,
//       pagination: {
//         page: parseInt(page),
//         limit: parseInt(limit),
//         total,
//         pages: Math.ceil(total / limit),
//         hasMore: skip + foods.length < total
//       }
//     });

//   } catch (error) {
//     console.error('Search food error:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Error searching food database',
//       error: error.message 
//     });
//   }
// };

// // Get food details by ID
// exports.getFoodById = async (req, res) => {
//   try {
//     const food = await Food.findById(req.params.id).lean();
    
//     if (!food) {
//       return res.status(404).json({ 
//         success: false,
//         message: 'Food not found' 
//       });
//     }

//     // Increment popularity
//     Food.findByIdAndUpdate(req.params.id, { $inc: { popularity: 1 } }).exec();

//     res.json({
//       success: true,
//       data: food
//     });

//   } catch (error) {
//     console.error('Get food error:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Error fetching food details' 
//     });
//   }
// };

// // Get popular foods (for quick suggestions)
// exports.getPopularFoods = async (req, res) => {
//   try {
//     const { limit = 10, category } = req.query;
    
//     const query = category && category !== 'all' ? { category } : {};
    
//     const foods = await Food.find(query)
//       .select('name brand category calories protein carbs fats')
//       .sort({ popularity: -1 })
//       .limit(parseInt(limit))
//       .lean();

//     res.json({
//       success: true,
//       data: foods
//     });

//   } catch (error) {
//     console.error('Get popular foods error:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Error fetching popular foods' 
//     });
//   }
// };

// // Get categories
// exports.getCategories = async (req, res) => {
//   try {
//     const categories = await Food.distinct('category');
    
//     res.json({
//       success: true,
//       data: categories.sort()
//     });

//   } catch (error) {
//     console.error('Get categories error:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Error fetching categories' 
//     });
//   }
// };


const Food = require("../models/Food");

/* ---------------- SEARCH FOOD ---------------- */

exports.searchFood = async (req, res) => {
  try {
    const rawQuery = req.query.q?.trim();
    if (!rawQuery || rawQuery.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Query must be at least 2 characters",
      });
    }

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20); // cap limit to prevent abuse
    const skip = (page - 1) * limit;

    const category =
      req.query.category && req.query.category !== "all"
        ? req.query.category
        : null;

    const sortBy = req.query.sortBy || "relevance";

    let searchQuery = {};
    let projection = null;
    let sortOptions = {};

    /* ---------- TEXT SEARCH PRIMARY ---------- */

    searchQuery = { $text: { $search: rawQuery } };

    if (category) {
      searchQuery.category = category;
    }

    if (sortBy === "relevance") {
      projection = { score: { $meta: "textScore" } };
      sortOptions = { score: { $meta: "textScore" } };
    } else if (sortBy === "popularity") {
      sortOptions = { popularity: -1 };
    } else if (sortBy === "calories") {
      sortOptions = { calories: 1 };
    } else if (sortBy === "protein") {
      sortOptions = { protein: -1 };
    } else if (sortBy === "name") {
      sortOptions = { name: 1 };
    }

    let foods = await Food.find(searchQuery, projection)
      .select(
        "name brand category servingSize calories protein carbs fats fiber sugar sodium popularity"
      )
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean()
      .maxTimeMS(2000); // prevent runaway queries

    /* ---------- REGEX FALLBACK IF TEXT RETURNS EMPTY ---------- */

    if (foods.length === 0) {
      searchQuery = {
        nameLower: { $regex: rawQuery.toLowerCase(), $options: "i" },
      };

      if (category) {
        searchQuery.category = category;
      }

      foods = await Food.find(searchQuery)
        .select(
          "name brand category servingSize calories protein carbs fats fiber sugar sodium popularity"
        )
        .sort({ popularity: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .maxTimeMS(2000);
    }

    /* ---------- COUNT FOR PAGINATION ---------- */

    const total = await Food.countDocuments(searchQuery).maxTimeMS(2000);

    res.json({
      success: true,
      data: foods,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasMore: skip + foods.length < total,
      },
    });
  } catch (error) {
    console.error("Search food error:", error);

    res.status(500).json({
      success: false,
      message: "Error searching food database",
    });
  }
};

/* ---------------- GET FOOD BY ID ---------------- */

exports.getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id)
      .select(
        "name brand category servingSize servingUnit calories protein carbs fats fiber sugar sodium vitaminA vitaminC calcium iron popularity"
      )
      .lean();

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    // Increment popularity only when user views details
    Food.findByIdAndUpdate(req.params.id, {
      $inc: { popularity: 1 },
    }).exec();

    res.json({
      success: true,
      data: food,
    });
  } catch (error) {
    console.error("Get food error:", error);

    res.status(500).json({
      success: false,
      message: "Error fetching food details",
    });
  }
};

/* ---------------- GET POPULAR FOODS ---------------- */

exports.getPopularFoods = async (req, res) => {
  try {
    const limit = Math.min(20, parseInt(req.query.limit) || 10);
    const category =
      req.query.category && req.query.category !== "all"
        ? req.query.category
        : null;

    const query = category ? { category } : {};

    const foods = await Food.find(query)
      .select("name brand category calories protein carbs fats popularity")
      .sort({ popularity: -1 })
      .limit(limit)
      .lean()
      .maxTimeMS(2000);

    res.json({
      success: true,
      data: foods,
    });
  } catch (error) {
    console.error("Get popular foods error:", error);

    res.status(500).json({
      success: false,
      message: "Error fetching popular foods",
    });
  }
};

/* ---------------- GET CATEGORIES ---------------- */

exports.getCategories = async (req, res) => {
  try {
    const categories = await Food.distinct("category");

    res.json({
      success: true,
      data: categories.sort(),
    });
  } catch (error) {
    console.error("Get categories error:", error);

    res.status(500).json({
      success: false,
      message: "Error fetching categories",
    });
  }
};