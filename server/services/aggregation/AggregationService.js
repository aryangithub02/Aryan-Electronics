/**
 * Aryan Electronics - Product Aggregation & Multi-Source Orchestration Service
 * Integrates local MongoDB catalog with external product streams (DummyJSON, eBay Browse API)
 * Provides TTL caching, fault-tolerant parallel querying, deduplication, and multi-seller consolidation
 */

const mongoose = require('mongoose');
const AggregationCache = require('./AggregationCache');
const DummyJsonAdapter = require('./DummyJsonAdapter');
const EbayAdapter = require('./EbayAdapter');
const { deduplicateProducts, areProductsMatching, mergeProductOffers } = require('./deduplication');
const Product = require('../../models/Product');
const sampleProducts = require('../../data/sampleProducts');
const { enrichProductWithInsights } = require('../scoringAndInsights');

class AggregationService {
  constructor(options = {}) {
    this.cache = new AggregationCache(options.cacheTtlMs || 10 * 60 * 1000); // 10 min TTL
    this.adapters = new Map();

    // Register primary adapters
    this.registerAdapter(new DummyJsonAdapter());
    this.registerAdapter(new EbayAdapter());
  }

  /**
   * Register a new external product adapter dynamically
   */
  registerAdapter(adapter) {
    if (!adapter || !adapter.getName) {
      throw new Error('[AggregationService] Invalid adapter instance');
    }
    this.adapters.set(adapter.getName(), adapter);
    console.log(`[AggregationService] Registered external product adapter: "${adapter.getName()}"`);
  }

  getAdapter(name) {
    return this.adapters.get(name);
  }

  getRegisteredAdapters() {
    return Array.from(this.adapters.values());
  }

  /**
   * Status and health report across all external providers
   */
  getProvidersStatus() {
    const statuses = {};
    for (const [name, adapter] of this.adapters.entries()) {
      statuses[name] = adapter.getStatus();
    }
    return {
      cache: this.cache.getStats(),
      providers: statuses
    };
  }

  /**
   * Fetch products from local MongoDB collection with resilient in-memory fallback
   */
  async fetchLocalProducts(query = {}, options = {}) {
    try {
      if (mongoose.connection && mongoose.connection.readyState === 1) {
        const filter = {};
        if (query.sector) {
          filter.sector = new RegExp(query.sector, 'i');
        }
        if (query.category) {
          filter.category = new RegExp(query.category, 'i');
        }
        if (query.brand) {
          filter.brand = new RegExp(`^${query.brand}$`, 'i');
        }
        if (query.search) {
          const s = query.search.trim();
          filter.$or = [
            { title: { $regex: s, $options: 'i' } },
            { description: { $regex: s, $options: 'i' } },
            { brand: { $regex: s, $options: 'i' } },
            { SKU: { $regex: s, $options: 'i' } }
          ];
        }

        const limit = options.limit || 100;
        const skip = options.skip || 0;

        const docs = await Product.find(filter).skip(skip).limit(limit).lean();
        if (docs && docs.length > 0) {
          return docs.map((doc) => ({
            ...doc,
            provider: 'local',
            providers: ['local']
          }));
        }
      }
    } catch (err) {
      console.warn('[AggregationService] Local MongoDB query failed, falling back to local dataset:', err.message);
    }

    // In-memory fallback
    let results = [...sampleProducts];
    if (query.sector) {
      const s = query.sector.toLowerCase();
      results = results.filter((p) => (p.sector || '').toLowerCase().includes(s));
    }
    if (query.category) {
      const c = query.category.toLowerCase();
      results = results.filter((p) => (p.category || '').toLowerCase().includes(c));
    }
    if (query.brand) {
      const b = query.brand.toLowerCase();
      results = results.filter((p) => (p.brand || '').toLowerCase() === b);
    }
    if (query.search) {
      const s = query.search.toLowerCase();
      results = results.filter((p) =>
        (p.title || '').toLowerCase().includes(s) ||
        (p.description || '').toLowerCase().includes(s) ||
        (p.brand || '').toLowerCase().includes(s) ||
        (p.SKU || '').toLowerCase().includes(s)
      );
    }
    const limit = options.limit || 100;
    const skip = options.skip || 0;
    return results.slice(skip, skip + limit).map((doc) => ({
      ...doc,
      provider: 'local',
      providers: ['local']
    }));
  }

  /**
   * Search across all configured external adapters in parallel with fault tolerance
   */
  async searchExternalAdapters(searchTerm, options = {}) {
    if (!searchTerm) {
      return [];
    }

    const tasks = Array.from(this.adapters.values()).map(async (adapter) => {
      try {
        const res = await adapter.search(searchTerm, options);
        return res.items || [];
      } catch (err) {
        console.warn(`[AggregationService] External provider "${adapter.getName()}" search failed:`, err.message);
        return []; // Graceful degradation: never crash the overall aggregation
      }
    });

    const results = await Promise.all(tasks);
    return results.flat();
  }

  /**
   * Unified Aggregated Search (Local + External Providers) with Deduplication & Multi-Seller Matching
   */
  async searchAggregated(searchTerm, options = {}) {
    const cacheKey = this.cache.generateKey('search', { q: searchTerm, ...options });
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return { ...cached, source: 'cache' };
    }

    // Parallel fetch from local database and external streams
    const [localItems, externalItems] = await Promise.all([
      this.fetchLocalProducts({ search: searchTerm }, options),
      this.searchExternalAdapters(searchTerm, options)
    ]);

    const combinedRaw = [...localItems, ...externalItems];

    // Deduplicate and merge seller offers for matching products
    const deduplicated = deduplicateProducts(combinedRaw);

    const result = {
      source: 'live_aggregated',
      total: deduplicated.length,
      count: deduplicated.length,
      providerBreakdown: {
        local: localItems.length,
        external: externalItems.length
      },
      items: deduplicated
    };

    this.cache.set(cacheKey, result);
    return result;
  }

  /**
   * Get complete aggregated catalog with pagination, filters, and multi-seller enrichment
   */
  async getAggregatedCatalog(query = {}, options = {}) {
    const cacheKey = this.cache.generateKey('catalog', { ...query, ...options });
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return { ...cached, source: 'cache' };
    }

    const {
      page = 1,
      limit = 12,
      sector,
      category,
      brand,
      search,
      sort,
      includeExternal = true,
      provider
    } = query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;

    // Fetch local products
    const localProducts = await this.fetchLocalProducts(
      { sector, category, brand, search },
      { limit: 250 }
    );

    let externalProducts = [];
    if (includeExternal !== false && includeExternal !== 'false') {
      if (search) {
        externalProducts = await this.searchExternalAdapters(search, { limit: 30 });
      } else {
        // Fetch baseline streams from adapters
        const streamTasks = Array.from(this.adapters.values()).map(async (adapter) => {
          try {
            const res = await adapter.fetchElectronics({ limit: 15 });
            return res.items || [];
          } catch (err) {
            console.warn(`[AggregationService] Stream fetch failed for "${adapter.getName()}":`, err.message);
            return [];
          }
        });
        const streams = await Promise.all(streamTasks);
        externalProducts = streams.flat();

        // Filter external products by sector/category if specified
        if (sector) {
          const s = sector.toLowerCase();
          externalProducts = externalProducts.filter((p) => (p.sector || '').toLowerCase().includes(s));
        }
        if (category) {
          const c = category.toLowerCase();
          externalProducts = externalProducts.filter((p) => (p.category || '').toLowerCase().includes(c));
        }
      }
    }

    // Deduplicate and consolidate multi-seller offers
    const allAggregated = deduplicateProducts([...localProducts, ...externalProducts]);

    // Apply provider filter if requested
    let filteredAggregated = allAggregated;
    if (provider) {
      const p = provider.toLowerCase();
      filteredAggregated = allAggregated.filter((item) =>
        (item.provider && item.provider.toLowerCase() === p) ||
        (Array.isArray(item.providers) && item.providers.some(pr => pr.toLowerCase() === p))
      );
    }

    // Sorting
    if (sort === 'price_asc') {
      filteredAggregated.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sort === 'price_desc') {
      filteredAggregated.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sort === 'rating_desc') {
      filteredAggregated.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    const total = filteredAggregated.length;
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedItems = filteredAggregated.slice(startIndex, startIndex + limitNum);
    const enrichedItems = paginatedItems.map((p) => enrichProductWithInsights(p));

    const result = {
      source: 'aggregation_service',
      count: enrichedItems.length,
      total,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        total
      },
      providerBreakdown: {
        local: localProducts.length,
        external: externalProducts.length
      },
      data: enrichedItems
    };

    this.cache.set(cacheKey, result);
    return result;
  }

  /**
   * Resolve product by ID (handles internal numeric/string IDs or external provider prefixes)
   * Enriches the product with any matching external seller offers
   */
  async getProductById(id) {
    if (!id) return null;
    const cleanId = String(id).trim();

    const cacheKey = `product:${cleanId}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    let product = null;

    // 1. If prefixed with ext-dj- (DummyJSON)
    if (cleanId.startsWith('ext-dj-')) {
      const dj = this.getAdapter('dummyjson');
      if (dj) {
        product = await dj.getById(cleanId);
      }
    } else if (cleanId.startsWith('ext-ebay-')) {
      // 2. If prefixed with ext-ebay- (eBay)
      const ebay = this.getAdapter('ebay');
      if (ebay) {
        product = await ebay.getById(cleanId);
      }
    } else {
      // 3. Check MongoDB local catalog by id, _id, or SKU
      try {
        if (mongoose.connection && mongoose.connection.readyState === 1) {
          const isObjectId = /^[0-9a-fA-F]{24}$/.test(cleanId);
          const query = {
            $or: [
              { id: cleanId },
              { SKU: cleanId },
              ...(isObjectId ? [{ _id: cleanId }] : [])
            ]
          };
          const doc = await Product.findOne(query).lean();
          if (doc) {
            product = {
              ...doc,
              provider: 'local',
              providers: ['local']
            };
          }
        }
      } catch (err) {
        console.warn('[AggregationService] Local DB findOne failed:', err.message);
      }

      // Check in-memory sampleProducts fallback
      if (!product) {
        const fallbackDoc = sampleProducts.find(
          (p) => String(p.id) === cleanId || String(p.SKU).toLowerCase() === cleanId.toLowerCase()
        );
        if (fallbackDoc) {
          product = {
            ...fallbackDoc,
            provider: 'local',
            providers: ['local']
          };
        }
      }
    }

    if (!product) {
      return null;
    }

    // Try to enrich this product with secondary seller offers from external search
    try {
      const externalMatches = await this.searchExternalAdapters(product.title, { limit: 3 });
      for (const ext of externalMatches) {
        if (areProductsMatching(product, ext)) {
          mergeProductOffers(product, ext);
        }
      }
    } catch (err) {
      // enrichment is non-fatal
    }

    const enriched = enrichProductWithInsights(product);
    this.cache.set(cacheKey, enriched);
    return enriched;
  }
}

// Singleton instance for the application
const aggregationServiceInstance = new AggregationService();

module.exports = {
  AggregationService,
  aggregationService: aggregationServiceInstance
};
