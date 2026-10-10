const { updateUser } = require('../utils/userStore');
const { resolveProducts } = require('../utils/productResolver');
const { recordComparison } = require('../services/analyticsService');

const MAX_COMPARE_LIMIT = 4;

/**
 * @desc   Get authenticated user's comparison list products
 * @route  GET /api/compare
 * @access Private
 */
const getCompareList = async (req, res, next) => {
  try {
    const rawIds = req.user.comparisonList || [];
    const products = await resolveProducts(rawIds);

    res.status(200).json({
      success: true,
      count: products.length,
      maxLimit: MAX_COMPARE_LIMIT,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Add a product to user's comparison list (max 4)
 * @route  POST /api/compare/:productId
 * @access Private
 */
const addToCompare = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        error: { message: 'Product ID is required', status: 400 }
      });
    }

    const currentIds = req.user.comparisonList || [];

    // Check duplicate
    if (currentIds.includes(productId)) {
      const resolved = await resolveProducts(currentIds);
      return res.status(200).json({
        success: true,
        message: 'Product is already in your comparison matrix',
        count: resolved.length,
        maxLimit: MAX_COMPARE_LIMIT,
        data: resolved
      });
    }

    // Check maximum 4 products limit
    if (currentIds.length >= MAX_COMPARE_LIMIT) {
      return res.status(400).json({
        success: false,
        error: {
          message: `Comparison matrix is full. You can compare up to ${MAX_COMPARE_LIMIT} products at a time. Remove an item to add a new one.`,
          status: 400
        }
      });
    }

    // Verify product exists
    const [existingProduct] = await resolveProducts([productId]);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        error: {
          message: `Product with id "${productId}" not found in catalog`,
          status: 404
        }
      });
    }

    const updatedIds = [...currentIds, productId];
    await updateUser(req.user._id || req.user.id, { comparisonList: updatedIds });
    req.user.comparisonList = updatedIds;

    const resolved = await resolveProducts(updatedIds);

    // Asynchronously record comparison event for analytics
    recordComparison(resolved).catch(() => {});

    res.status(200).json({
      success: true,
      message: 'Product added to comparison matrix',
      count: resolved.length,
      maxLimit: MAX_COMPARE_LIMIT,
      data: resolved
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Remove a product from comparison matrix
 * @route  DELETE /api/compare/:productId
 * @access Private
 */
const removeFromCompare = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const currentIds = req.user.comparisonList || [];
    const updatedIds = currentIds.filter(id => id !== productId);

    await updateUser(req.user._id || req.user.id, { comparisonList: updatedIds });
    req.user.comparisonList = updatedIds;

    const resolved = await resolveProducts(updatedIds);

    res.status(200).json({
      success: true,
      message: 'Product removed from comparison matrix',
      count: resolved.length,
      maxLimit: MAX_COMPARE_LIMIT,
      data: resolved
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Clear entire comparison matrix
 * @route  DELETE /api/compare
 * @access Private
 */
const clearCompareList = async (req, res, next) => {
  try {
    await updateUser(req.user._id || req.user.id, { comparisonList: [] });
    req.user.comparisonList = [];

    res.status(200).json({
      success: true,
      message: 'Comparison matrix cleared',
      count: 0,
      maxLimit: MAX_COMPARE_LIMIT,
      data: []
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCompareList,
  addToCompare,
  removeFromCompare,
  clearCompareList
};
