/**
 * Aryan Electronics - External Aggregation Routes
 */

const express = require('express');
const router = express.Router();
const {
  getAggregatedProducts,
  getAggregatedProductById,
  searchAggregated,
  getProvidersStatus,
  clearAggregationCache
} = require('../controllers/aggregationController');

router.get('/products', getAggregatedProducts);
router.get('/products/:id', getAggregatedProductById);
router.get('/search', searchAggregated);
router.get('/providers', getProvidersStatus);
router.post('/cache/clear', clearAggregationCache);

module.exports = router;
