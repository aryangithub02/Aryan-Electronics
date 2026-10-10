/**
 * Aryan Electronics - Application Analytics Service
 * Aggregates anonymous metrics for views, searches, comparisons, and sector engagement.
 * Does NOT collect or store sensitive PII.
 */

const mongoose = require('mongoose');
const AnalyticsEvent = require('../models/AnalyticsEvent');

// In-memory event buffer for test/standalone mode
const inMemoryEvents = [];
const MAX_MEMORY_EVENTS = 2000;

const isDbConnected = () => {
  return mongoose.connection && mongoose.connection.readyState === 1;
};

/**
 * Record an analytical event asynchronously
 */
async function recordEvent(eventData = {}) {
  const event = {
    eventType: eventData.eventType || 'product_view',
    productId: eventData.productId ? String(eventData.productId) : undefined,
    productTitle: eventData.productTitle,
    sector: eventData.sector,
    category: eventData.category,
    brand: eventData.brand,
    query: eventData.query ? String(eventData.query).toLowerCase().trim() : undefined,
    sessionId: eventData.sessionId,
    convertedFromSearch: Boolean(eventData.convertedFromSearch),
    metadata: eventData.metadata || {},
    createdAt: new Date()
  };

  // Keep in memory buffer
  inMemoryEvents.push(event);
  if (inMemoryEvents.length > MAX_MEMORY_EVENTS) {
    inMemoryEvents.shift();
  }

  // Persist to MongoDB if connected
  if (isDbConnected()) {
    try {
      await AnalyticsEvent.create(event);
    } catch (err) {
      // Fire-and-forget: do not interrupt user operations for analytics logging
      console.warn('[AnalyticsService] Error saving event to MongoDB:', err.message);
    }
  }

  return event;
}

/**
 * Record a search query event
 */
async function recordSearch(query, resultCount = 0) {
  if (!query || !query.trim()) return null;
  return recordEvent({
    eventType: 'search',
    query: query.trim(),
    metadata: { resultCount }
  });
}

/**
 * Record a product detail view event
 */
async function recordProductView(product, { convertedFromSearch = false, query } = {}) {
  if (!product) return null;
  return recordEvent({
    eventType: 'product_view',
    productId: product.id || product._id,
    productTitle: product.title,
    sector: product.sector,
    category: product.category,
    brand: product.brand,
    convertedFromSearch,
    query
  });
}

/**
 * Record a multi-product comparison event
 */
async function recordComparison(products = []) {
  if (!Array.isArray(products) || products.length === 0) return null;
  const productIds = products.map((p) => p.id || p._id);
  const sectors = Array.from(new Set(products.map((p) => p.sector).filter(Boolean)));
  return recordEvent({
    eventType: 'compare',
    metadata: {
      productIds,
      deviceCount: products.length,
      sectors
    }
  });
}

/**
 * Calculate date boundary from time range filter
 */
function getStartDate(timeRange = '30d') {
  const now = new Date();
  if (timeRange === '24h') {
    return new Date(now.getTime() - 24 * 60 * 60 * 1000);
  }
  if (timeRange === '7d') {
    return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }
  if (timeRange === '90d') {
    return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  }
  if (timeRange === 'all') {
    return new Date(0);
  }
  // Default: 30 days
  return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
}

/**
 * Aggregate metrics from In-Memory buffer (fallback or test mode)
 */
function aggregateInMemory(startDate) {
  const filtered = inMemoryEvents.filter((e) => new Date(e.createdAt) >= startDate);

  const views = filtered.filter((e) => e.eventType === 'product_view');
  const searches = filtered.filter((e) => e.eventType === 'search');
  const comparisons = filtered.filter((e) => e.eventType === 'compare');
  const wishlistAdds = filtered.filter((e) => e.eventType === 'wishlist_add');

  // Top products
  const productMap = {};
  views.forEach((v) => {
    const key = v.productId || v.productTitle || 'Unknown';
    if (!productMap[key]) {
      productMap[key] = {
        productId: v.productId,
        title: v.productTitle || key,
        sector: v.sector,
        brand: v.brand,
        views: 0
      };
    }
    productMap[key].views++;
  });
  const topProducts = Object.values(productMap)
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  // Popular searches
  const searchMap = {};
  searches.forEach((s) => {
    if (s.query) {
      searchMap[s.query] = (searchMap[s.query] || 0) + 1;
    }
  });
  const popularSearches = Object.entries(searchMap)
    .map(([query, count]) => ({ query, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Sector breakdown
  const sectorMap = {};
  views.forEach((v) => {
    if (v.sector) {
      sectorMap[v.sector] = (sectorMap[v.sector] || 0) + 1;
    }
  });
  const sectorPopularity = Object.entries(sectorMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // Brand breakdown
  const brandMap = {};
  views.forEach((v) => {
    if (v.brand) {
      brandMap[v.brand] = (brandMap[v.brand] || 0) + 1;
    }
  });
  const brandPopularity = Object.entries(brandMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const convertedViews = views.filter((v) => v.convertedFromSearch).length;
  const conversionRate = searches.length > 0 ? Math.round((convertedViews / searches.length) * 100) : 0;

  return {
    totalViews: views.length,
    totalSearches: searches.length,
    totalComparisons: comparisons.length,
    totalWishlistAdds: wishlistAdds.length,
    searchConversionRate: conversionRate,
    topProducts,
    popularSearches,
    sectorPopularity,
    brandPopularity,
    dataSource: 'in-memory-buffer',
    isRealData: true
  };
}

/**
 * Get comprehensive analytics overview
 */
async function getAnalyticsOverview(timeRange = '30d') {
  const startDate = getStartDate(timeRange);

  if (!isDbConnected()) {
    return aggregateInMemory(startDate);
  }

  try {
    const matchTime = { createdAt: { $gte: startDate } };

    // 1. Event Counts by Type
    const counts = await AnalyticsEvent.aggregate([
      { $match: matchTime },
      { $group: { _id: '$eventType', count: { $sum: 1 } } }
    ]);

    const countsMap = {};
    counts.forEach((c) => {
      countsMap[c._id] = c.count;
    });

    // 2. Top Viewed Products
    const topProducts = await AnalyticsEvent.aggregate([
      { $match: { ...matchTime, eventType: 'product_view', productId: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: '$productId',
          title: { $first: '$productTitle' },
          sector: { $first: '$sector' },
          brand: { $first: '$brand' },
          views: { $sum: 1 }
        }
      },
      { $sort: { views: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          productId: '$_id',
          title: 1,
          sector: 1,
          brand: 1,
          views: 1
        }
      }
    ]);

    // 3. Popular Searches
    const popularSearches = await AnalyticsEvent.aggregate([
      { $match: { ...matchTime, eventType: 'search', query: { $exists: true, $ne: null } } },
      { $group: { _id: '$query', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { _id: 0, query: '$_id', count: 1 } }
    ]);

    // 4. Sector Popularity
    const sectorPopularity = await AnalyticsEvent.aggregate([
      { $match: { ...matchTime, sector: { $exists: true, $ne: null } } },
      { $group: { _id: '$sector', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { _id: 0, name: '$_id', count: 1 } }
    ]);

    // 5. Brand Popularity
    const brandPopularity = await AnalyticsEvent.aggregate([
      { $match: { ...matchTime, brand: { $exists: true, $ne: null } } },
      { $group: { _id: '$brand', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { _id: 0, name: '$_id', count: 1 } }
    ]);

    // 6. Search to View Conversions
    const convertedCount = await AnalyticsEvent.countDocuments({
      ...matchTime,
      eventType: 'product_view',
      convertedFromSearch: true
    });
    const totalSearches = countsMap.search || 0;
    const searchConversionRate =
      totalSearches > 0 ? Math.round((convertedCount / totalSearches) * 100) : 0;

    return {
      totalViews: countsMap.product_view || 0,
      totalSearches,
      totalComparisons: countsMap.compare || 0,
      totalWishlistAdds: countsMap.wishlist_add || 0,
      searchConversionRate,
      topProducts,
      popularSearches,
      sectorPopularity,
      brandPopularity,
      dataSource: 'mongodb-live',
      isRealData: true
    };
  } catch (err) {
    console.warn('[AnalyticsService] Error querying MongoDB analytics, falling back to memory:', err.message);
    return aggregateInMemory(startDate);
  }
}

module.exports = {
  recordEvent,
  recordSearch,
  recordProductView,
  recordComparison,
  getAnalyticsOverview
};
