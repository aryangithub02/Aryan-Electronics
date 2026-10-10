/**
 * Aryan Electronics - Aggregation Controller
 * Exposes endpoints for multi-source product aggregation, provider health, and multi-seller comparison
 */

const { aggregationService } = require('../services/aggregation/AggregationService');

/**
 * @desc   Get aggregated products across local MongoDB and active external providers
 * @route  GET /api/aggregate/products
 * @access Public
 */
const getAggregatedProducts = async (req, res, next) => {
  try {
    const result = await aggregationService.getAggregatedCatalog(req.query);
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Resolve single aggregated product by ID or SKU with multi-seller offers
 * @route  GET /api/aggregate/products/:id
 * @access Public
 */
const getAggregatedProductById = async (req, res, next) => {
  try {
    const product = await aggregationService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: `Product with ID '${req.params.id}' was not found in aggregated sources.`
        }
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Perform aggregated search across all providers with deduplication
 * @route  GET /api/aggregate/search
 * @access Public
 */
const searchAggregated = async (req, res, next) => {
  try {
    const query = req.query.q || req.query.query || '';
    if (!query) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'QUERY_REQUIRED',
          message: 'Search query parameter (q) is required.'
        }
      });
    }

    const result = await aggregationService.searchAggregated(query, req.query);
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get status, health, and cache statistics of all external providers
 * @route  GET /api/aggregate/providers
 * @access Public
 */
const getProvidersStatus = (req, res) => {
  const status = aggregationService.getProvidersStatus();
  res.status(200).json({
    success: true,
    data: status
  });
};

/**
 * @desc   Clear aggregation cache
 * @route  POST /api/aggregate/cache/clear
 * @access Public
 */
const clearAggregationCache = (req, res) => {
  const evicted = aggregationService.cache.clear();
  res.status(200).json({
    success: true,
    message: `Aggregation cache cleared successfully (${evicted} entries removed).`
  });
};

module.exports = {
  getAggregatedProducts,
  getAggregatedProductById,
  searchAggregated,
  getProvidersStatus,
  clearAggregationCache
};
