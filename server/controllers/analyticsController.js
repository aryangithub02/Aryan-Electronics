const {
  getAnalyticsOverview,
  recordEvent,
  recordSearch,
  recordProductView,
  recordComparison
} = require('../services/analyticsService');

/**
 * @desc    Get aggregated analytics overview
 * @route   GET /api/analytics/overview
 * @access  Private (Admin)
 */
const getOverview = async (req, res) => {
  try {
    const { range = '30d' } = req.query;
    const analytics = await getAnalyticsOverview(range);

    res.status(200).json({
      success: true,
      range,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to generate analytics overview' }
    });
  }
};

/**
 * @desc    Record client-side analytical event
 * @route   POST /api/analytics/event
 * @access  Public
 */
const trackEvent = async (req, res) => {
  try {
    const { eventType, productId, productTitle, sector, category, brand, query, convertedFromSearch, metadata } = req.body;

    if (!eventType) {
      return res.status(400).json({
        success: false,
        error: { message: 'eventType is required' }
      });
    }

    const recorded = await recordEvent({
      eventType,
      productId,
      productTitle,
      sector,
      category,
      brand,
      query,
      convertedFromSearch,
      metadata
    });

    res.status(201).json({
      success: true,
      message: 'Event logged',
      data: recorded
    });
  } catch (error) {
    // Analytics failure should never break client experience
    res.status(200).json({
      success: false,
      error: { message: error.message }
    });
  }
};

module.exports = {
  getOverview,
  trackEvent
};
