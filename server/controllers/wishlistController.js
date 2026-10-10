const { updateUser } = require('../utils/userStore');
const { resolveProducts } = require('../utils/productResolver');

/**
 * @desc   Get authenticated user's wishlist products
 * @route  GET /api/wishlist
 * @access Private
 */
const getWishlist = async (req, res, next) => {
  try {
    const rawIds = req.user.wishlist || [];
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
 * @desc   Add a product to wishlist
 * @route  POST /api/wishlist/:productId
 * @access Private
 */
const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        error: { message: 'Product ID is required', status: 400 }
      });
    }

    const currentIds = req.user.wishlist || [];

    // Prevent duplicate entries
    if (currentIds.includes(productId)) {
      const resolved = await resolveProducts(currentIds);
      return res.status(200).json({
        success: true,
        message: 'Product is already in your wishlist',
        count: resolved.length,
        data: resolved
      });
    }

    const updatedIds = [...currentIds, productId];
    await updateUser(req.user._id || req.user.id, { wishlist: updatedIds });
    req.user.wishlist = updatedIds;

    const resolved = await resolveProducts(updatedIds);

    res.status(200).json({
      success: true,
      message: 'Product added to wishlist',
      count: resolved.length,
      data: resolved
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Remove a product from wishlist
 * @route  DELETE /api/wishlist/:productId
 * @access Private
 */
const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const currentIds = req.user.wishlist || [];
    const updatedIds = currentIds.filter(id => id !== productId);

    await updateUser(req.user._id || req.user.id, { wishlist: updatedIds });
    req.user.wishlist = updatedIds;

    const resolved = await resolveProducts(updatedIds);

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist',
      count: resolved.length,
      data: resolved
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist
};
