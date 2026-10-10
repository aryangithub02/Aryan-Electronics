const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  getFilterOptions,
  getSearchSuggestions,
  getProductRecommendations,
  getPersonalizedRecommendationsHandler,
  getSectors
} = require('../controllers/productController');

// Sector aggregation route
router.get('/sectors', getSectors);

// Dynamic filter bounds route
router.get('/filter-options', getFilterOptions);

// Intelligent search auto-completion and suggestions
router.get('/suggestions', getSearchSuggestions);

// Personalized "For You" recommendations
router.get('/recommendations/for-you', getPersonalizedRecommendationsHandler);

// Specific product recommendations (similar, budget alternatives, related)
router.get('/:id/recommendations', getProductRecommendations);

// List products with filter, search, pagination, and scoring
router.get('/', getAllProducts);

// Single product details route enriched with score, badges, and insights
router.get('/:id', getProductById);

module.exports = router;
