const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  searchFood,
  getFoodById,
  getPopularFoods,
  getCategories
} = require('../controllers/nutritionController');

// Search with pagination
router.get('/search', protect, searchFood);

// Get food details
router.get('/foods/:id', protect, getFoodById);

// Get popular foods
router.get('/foods/popular', protect, getPopularFoods);

// Get categories
router.get('/categories', protect, getCategories);

module.exports = router;
