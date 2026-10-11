/**
 * Aryan Electronics - Product Controller (Phase 4 Enhanced)
 * Supports advanced multi-attribute filtering, intelligent search, dynamic filter options,
 * product recommendations, scoring, badges, and price comparison insights.
 */

const mongoose = require('mongoose');
const Product = require('../models/Product');
const sampleProducts = require('../data/sampleProducts');
const { enrichProductWithInsights, calculatePriceInsights } = require('../services/scoringAndInsights');
const { searchProductsWithRelevance, generateSearchSuggestions, preprocessSearchQuery } = require('../services/searchService');
const {
  getSimilarProducts,
  getBudgetAlternatives,
  getRelatedProducts,
  getPersonalizedRecommendations
} = require('../services/recommendationService');
const { recordProductView, recordSearch } = require('../services/analyticsService');

/**
 * Escape regular expression special characters to avoid ReDoS or malformed regex injection
 */
const escapeRegex = (text) => {
  return typeof text === 'string' ? text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') : '';
};

/**
 * Check if Mongoose connection is ready
 */
const isDbConnected = () => {
  return mongoose.connection && mongoose.connection.readyState === 1;
};

/**
 * Fetch all available products (database with in-memory fallback)
 */
const getAllAvailableProducts = async () => {
  if (isDbConnected()) {
    try {
      const docs = await Product.find({}).lean();
      if (docs && docs.length > 0) return docs;
    } catch (e) {
      console.warn('[ProductController] Failed to query Mongo, using in-memory dataset:', e.message);
    }
  }
  return [...sampleProducts];
};

/**
 * Advanced query processor for in-memory products
 */
const queryInMemoryProducts = (query) => {
  let results = [...sampleProducts];

  // Sector filter
  if (query.sector) {
    const s = query.sector.toLowerCase();
    results = results.filter((p) => (p.sector || '').toLowerCase().includes(s));
  }

  // Category filter
  if (query.category) {
    const c = query.category.toLowerCase();
    results = results.filter((p) => (p.category || '').toLowerCase().includes(c));
  }

  // Brand filter (supports comma-separated list e.g. "Apple,Sony")
  if (query.brand) {
    const brands = query.brand.split(',').map((b) => b.trim().toLowerCase());
    results = results.filter((p) => p.brand && brands.includes(p.brand.toLowerCase()));
  }

  // Price range filter
  if (query.minPrice !== undefined && query.minPrice !== '') {
    const min = parseFloat(query.minPrice);
    if (!isNaN(min)) {
      results = results.filter((p) => typeof p.price === 'number' && p.price >= min);
    }
  }
  if (query.maxPrice !== undefined && query.maxPrice !== '') {
    const max = parseFloat(query.maxPrice);
    if (!isNaN(max)) {
      results = results.filter((p) => typeof p.price === 'number' && p.price <= max);
    }
  }

  // Minimum rating filter
  if (query.minRating !== undefined && query.minRating !== '') {
    const r = parseFloat(query.minRating);
    if (!isNaN(r)) {
      results = results.filter((p) => typeof p.rating === 'number' && p.rating >= r);
    }
  }

  // Availability filter
  if (query.availability === 'in_stock') {
    results = results.filter((p) => {
      const inStock = p.stock !== null && p.stock !== undefined ? p.stock > 0 : true;
      const status = String(p.availability || '').toLowerCase();
      return inStock && !status.includes('out of stock');
    });
  }

  // Seller filter
  if (query.seller) {
    const s = query.seller.toLowerCase().trim();
    results = results.filter((p) =>
      Array.isArray(p.sellers) && p.sellers.some((sel) => (sel.name || '').toLowerCase().includes(s))
    );
  }

  // Search keyword (using intelligent relevance if query present)
  if (query.search) {
    results = searchProductsWithRelevance(results, query.search);
  }

  // Enrich with Phase 4 Scoring & Badges
  let enrichedResults = results.map((p) => enrichProductWithInsights(p));

  // Sorting
  if (query.sort === 'price_asc') {
    enrichedResults.sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (query.sort === 'price_desc') {
    enrichedResults.sort((a, b) => (b.price || 0) - (a.price || 0));
  } else if (query.sort === 'rating_desc') {
    enrichedResults.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (query.sort === 'score_desc') {
    enrichedResults.sort((a, b) => (b.discoveryScore || 0) - (a.discoveryScore || 0));
  }

  const total = enrichedResults.length;
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 12;
  const startIndex = (page - 1) * limit;
  const paginatedResults = enrichedResults.slice(startIndex, startIndex + limit);

  return {
    items: paginatedResults,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
};

/**
 * @desc   Get all products with advanced filtering, intelligent search, and pagination
 * @route  GET /api/products
 * @access Public
 */
const getAllProducts = async (req, res, next) => {
  try {
    const {
      sector,
      category,
      brand,
      search,
      sort,
      minPrice,
      maxPrice,
      minRating,
      availability,
      seller,
      page = 1,
      limit = 12
    } = req.query;

    if (!isDbConnected()) {
      const memoryResult = queryInMemoryProducts(req.query);
      return res.status(200).json({
        success: true,
        source: 'in-memory-fallback',
        count: memoryResult.items.length,
        total: memoryResult.total,
        pagination: {
          page: memoryResult.page,
          limit: memoryResult.limit,
          totalPages: memoryResult.totalPages,
          total: memoryResult.total
        },
        data: memoryResult.items
      });
    }

    // Build Mongoose Filter
    const filter = {};

    if (sector) {
      filter.sector = new RegExp(escapeRegex(sector), 'i');
    }
    if (category) {
      filter.category = new RegExp(escapeRegex(category), 'i');
    }
    if (brand) {
      const brandList = brand.split(',').map((b) => b.trim());
      if (brandList.length > 1) {
        filter.brand = { $in: brandList.map((b) => new RegExp(`^${escapeRegex(b)}$`, 'i')) };
      } else {
        filter.brand = new RegExp(`^${escapeRegex(brand)}$`, 'i');
      }
    }
    if (minPrice !== undefined && minPrice !== '') {
      filter.price = { ...(filter.price || {}), $gte: parseFloat(minPrice) };
    }
    if (maxPrice !== undefined && maxPrice !== '') {
      filter.price = { ...(filter.price || {}), $lte: parseFloat(maxPrice) };
    }
    if (minRating !== undefined && minRating !== '') {
      filter.rating = { $gte: parseFloat(minRating) };
    }
    if (availability === 'in_stock') {
      filter.$and = [
        ...(filter.$and || []),
        {
          $or: [
            { stock: { $gt: 0 } },
            { availability: { $regex: /in stock/i } }
          ]
        }
      ];
    }
    if (seller) {
      filter['sellers.name'] = new RegExp(escapeRegex(seller), 'i');
    }

    if (search) {
      const processed = preprocessSearchQuery(search);
      const searchTerms = Array.from(new Set([search, processed.normalized, ...processed.tokens])).filter(Boolean);
      const regexes = searchTerms.map((t) => new RegExp(escapeRegex(t), 'i'));

      filter.$or = [
        { title: { $in: regexes } },
        { description: { $in: regexes } },
        { brand: { $in: regexes } },
        { SKU: { $in: regexes } },
        { 'specifications.value': { $in: regexes } },
        { features: { $in: regexes } }
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    // Fetch and count
    const total = await Product.countDocuments(filter);
    let docs = await Product.find(filter).lean();

    // If search keyword provided, apply intelligent multi-token ranking
    if (search) {
      docs = searchProductsWithRelevance(docs, search);
    }

    // Enrich with Phase 4 Scoring & Badges
    let enriched = docs.map((doc) => enrichProductWithInsights(doc));

    // Sorting
    if (sort === 'price_asc') {
      enriched.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sort === 'price_desc') {
      enriched.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sort === 'rating_desc') {
      enriched.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sort === 'score_desc') {
      enriched.sort((a, b) => (b.discoveryScore || 0) - (a.discoveryScore || 0));
    }

    const paginatedProducts = enriched.slice(skip, skip + limitNum);

    // Asynchronously record search event for analytics
    if (search && search.trim()) {
      recordSearch(search.trim(), paginatedProducts.length).catch(() => {});
    }

    res.status(200).json({
      success: true,
      source: 'database',
      count: paginatedProducts.length,
      total,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        total
      },
      data: paginatedProducts
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get single product by ID enriched with Discovery Score, Badges, and Price Insights
 * @route  GET /api/products/:id
 * @access Public
 */
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let product = null;

    if (!isDbConnected()) {
      product = sampleProducts.find(
        (p) =>
          String(p.id) === String(id) ||
          (p.SKU && p.SKU.toLowerCase() === id.toLowerCase()) ||
          (p.sku && p.sku.toLowerCase() === id.toLowerCase())
      );
    } else {
      product = await Product.findOne({
        $or: [{ id: String(id) }, { SKU: id }, { sku: id }]
      }).lean();

      if (!product && mongoose.Types.ObjectId.isValid(id)) {
        product = await Product.findById(id).lean();
      }

      if (!product) {
        // Fallback to sampleProducts
        product = sampleProducts.find(
          (p) =>
            String(p.id) === String(id) ||
            (p.SKU && p.SKU.toLowerCase() === id.toLowerCase())
        );
      }
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        error: {
          message: `Product not found with id: ${id}`,
          status: 404
        }
      });
    }

    // Enrich with Phase 4 Scoring, Badges, and Price Insights
    const enrichedProduct = enrichProductWithInsights(product);

    // Asynchronously record product view event for analytics
    recordProductView(enrichedProduct, {
      convertedFromSearch: Boolean(req.query.fromSearch === 'true' || req.query.fromSearch === true),
      query: req.query.query
    }).catch(() => {});

    res.status(200).json({
      success: true,
      source: isDbConnected() ? 'database' : 'in-memory-fallback',
      data: enrichedProduct
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get dynamic filter options based on available product catalog
 * @route  GET /api/products/filter-options
 * @access Public
 */
const getFilterOptions = async (req, res, next) => {
  try {
    const catalog = await getAllAvailableProducts();

    const brandCounts = {};
    const sellerCounts = {};
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    let inStockCount = 0;
    let totalWithPrice = 0;

    catalog.forEach((item) => {
      // Brands
      if (item.brand) {
        brandCounts[item.brand] = (brandCounts[item.brand] || 0) + 1;
      }

      // Sellers
      if (Array.isArray(item.sellers)) {
        item.sellers.forEach((s) => {
          if (s && s.name) {
            sellerCounts[s.name] = (sellerCounts[s.name] || 0) + 1;
          }
        });
      }

      // Price range
      if (typeof item.price === 'number' && item.price > 0) {
        totalWithPrice++;
        if (item.price < minPrice) minPrice = item.price;
        if (item.price > maxPrice) maxPrice = item.price;
      }

      // Stock
      if (item.stock > 0 || String(item.availability || '').toLowerCase().includes('in stock')) {
        inStockCount++;
      }
    });

    const sortedBrands = Object.entries(brandCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const sortedSellers = Object.entries(sellerCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    res.status(200).json({
      success: true,
      data: {
        totalProducts: catalog.length,
        priceRange: {
          min: minPrice === Infinity ? 0 : minPrice,
          max: maxPrice === -Infinity ? 300000 : maxPrice
        },
        brands: sortedBrands,
        sellers: sortedSellers,
        availability: {
          inStock: inStockCount,
          total: catalog.length
        },
        ratingTiers: [
          { min: 4.5, label: '4.5★ and above' },
          { min: 4.0, label: '4.0★ and above' },
          { min: 3.5, label: '3.5★ and above' }
        ]
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get instant search suggestions and matching entities
 * @route  GET /api/products/suggestions
 * @access Public
 */
const getSearchSuggestions = async (req, res, next) => {
  try {
    const query = req.query.q || req.query.query || '';
    const catalog = await getAllAvailableProducts();
    const suggestions = generateSearchSuggestions(catalog, query);

    res.status(200).json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get product recommendations (similar, budget alternatives, related)
 * @route  GET /api/products/:id/recommendations
 * @access Public
 */
const getProductRecommendations = async (req, res, next) => {
  try {
    const { id } = req.params;
    const catalog = await getAllAvailableProducts();

    const targetProduct = catalog.find(
      (p) => String(p.id) === String(id) || String(p.SKU).toLowerCase() === String(id).toLowerCase()
    );

    if (!targetProduct) {
      return res.status(404).json({
        success: false,
        error: {
          message: `Product not found with id: ${id}`,
          status: 404
        }
      });
    }

    const similar = getSimilarProducts(targetProduct, catalog, 4);
    const budgetAlternatives = getBudgetAlternatives(targetProduct, catalog, 4);
    const related = getRelatedProducts(targetProduct, catalog, 4);

    res.status(200).json({
      success: true,
      productId: targetProduct.id,
      productTitle: targetProduct.title,
      data: {
        similar,
        budgetAlternatives,
        related
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get personalized recommendations ("You May Also Like") for user context
 * @route  GET /api/products/recommendations/for-you
 * @access Public
 */
const getPersonalizedRecommendationsHandler = async (req, res, next) => {
  try {
    const catalog = await getAllAvailableProducts();
    const limit = parseInt(req.query.limit, 10) || 6;

    // Optional context passed via query (e.g. sectors or ids)
    const context = {};
    if (req.query.sectors) {
      const sList = req.query.sectors.split(',');
      context.wishlist = sList.map((s) => ({ sector: s }));
    }

    const recommendations = getPersonalizedRecommendations(context, catalog, limit);

    res.status(200).json({
      success: true,
      count: recommendations.length,
      data: recommendations
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get list of all electronic sectors with counts and categories
 * @route  GET /api/products/sectors
 * @access Public
 */
const getSectors = async (req, res, next) => {
  try {
    let productsList = [];

    if (isDbConnected()) {
      productsList = await Product.find({}, 'sector category');
    } else {
      productsList = sampleProducts;
    }

    const sectorMap = {};

    productsList.forEach((item) => {
      if (!sectorMap[item.sector]) {
        sectorMap[item.sector] = {
          name: item.sector,
          productCount: 0,
          categories: new Set()
        };
      }
      sectorMap[item.sector].productCount += 1;
      if (item.category) {
        sectorMap[item.sector].categories.add(item.category);
      }
    });

    const sectors = Object.values(sectorMap).map((s) => ({
      name: s.name,
      productCount: s.productCount,
      categories: Array.from(s.categories)
    }));

    res.status(200).json({
      success: true,
      count: sectors.length,
      data: sectors
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getFilterOptions,
  getSearchSuggestions,
  getProductRecommendations,
  getPersonalizedRecommendationsHandler,
  getSectors
};
