const { updateUser } = require('../utils/userStore');
const { resolveProducts } = require('../utils/productResolver');

const RECENTLY_VIEWED_LIMIT = parseInt(process.env.RECENTLY_VIEWED_LIMIT || '20', 10);

/**
 * @desc   Get user's recently viewed products (most recent first)
 * @route  GET /api/recently-viewed
 * @access Private
 */
const getRecentlyViewed = async (req, res, next) => {
  try {
    const rawItems = req.user.recentlyViewed || [];

    // Extract product IDs in the stored order (most recent first)
    const productIds = rawItems.map(item =>
      typeof item === 'string' ? item : item.productId
    );

    const products = await resolveProducts(productIds);

    res.status(200).json({
      success: true,
      count: products.length,
      limit: RECENTLY_VIEWED_LIMIT,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Record a product as recently viewed
 * @route  POST /api/recently-viewed/:productId
 * @access Private
 */
const recordRecentlyViewed = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        error: { message: 'Product ID is required', status: 400 }
      });
    }

    const currentItems = req.user.recentlyViewed || [];

    // Filter out existing occurrence to avoid duplicates
    const filtered = currentItems.filter(item => {
      const id = typeof item === 'string' ? item : item.productId;
      return id !== productId;
    });

    // Unshift the newly viewed item to the front
    const newItem = {
      productId,
      viewedAt: new Date()
    };
    filtered.unshift(newItem);

    // Enforce configured limit
    const capped = filtered.slice(0, RECENTLY_VIEWED_LIMIT);

    await updateUser(req.user._id || req.user.id, { recentlyViewed: capped });
    req.user.recentlyViewed = capped;

    const productIds = capped.map(item =>
      typeof item === 'string' ? item : item.productId
    );
    const resolved = await resolveProducts(productIds);

    res.status(200).json({
      success: true,
      message: 'Recently viewed record updated',
      count: resolved.length,
      limit: RECENTLY_VIEWED_LIMIT,
      data: resolved
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecentlyViewed,
  recordRecentlyViewed
};
