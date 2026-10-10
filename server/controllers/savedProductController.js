const { updateUser } = require('../utils/userStore');
const { resolveProducts } = require('../utils/productResolver');

/**
 * @desc   Get authenticated user's saved products
 * @route  GET /api/saved-products
 * @access Private
 */
const getSavedProducts = async (req, res, next) => {
  try {
    const rawIds = req.user.savedProducts || [];
    const products = await resolveProducts(rawIds);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Save a product for later
 * @route  POST /api/saved-products/:productId
 * @access Private
 */
const addToSavedProducts = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        error: { message: 'Product ID is required', status: 400 }
      });
    }

    const currentIds = req.user.savedProducts || [];

    // Prevent duplicate entries
    if (currentIds.includes(productId)) {
      const resolved = await resolveProducts(currentIds);
      return res.status(200).json({
        success: true,
        message: 'Product is already saved',
        count: resolved.length,
        data: resolved
      });
    }

    const updatedIds = [...currentIds, productId];
    await updateUser(req.user._id || req.user.id, { savedProducts: updatedIds });
    req.user.savedProducts = updatedIds;

    const resolved = await resolveProducts(updatedIds);

    res.status(200).json({
      success: true,
      message: 'Product saved successfully',
      count: resolved.length,
      data: resolved
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Remove a saved product
 * @route  DELETE /api/saved-products/:productId
 * @access Private
 */
const removeFromSavedProducts = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const currentIds = req.user.savedProducts || [];
    const updatedIds = currentIds.filter(id => id !== productId);

    await updateUser(req.user._id || req.user.id, { savedProducts: updatedIds });
    req.user.savedProducts = updatedIds;

    const resolved = await resolveProducts(updatedIds);

    res.status(200).json({
      success: true,
      message: 'Product removed from saved items',
      count: resolved.length,
      data: resolved
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSavedProducts,
  addToSavedProducts,
  removeFromSavedProducts
};
