/**
 * Aryan Electronics - Phase 3 External API Integration & Product Aggregation Test Suite
 * Tests AggregationCache, deduplication & multi-seller matching, provider adapters,
 * AggregationService fault tolerance, and Express aggregation endpoints.
 */

const request = require('supertest');
const app = require('../app');
const AggregationCache = require('../services/aggregation/AggregationCache');
const {
  extractModelIdentifiers,
  areProductsMatching,
  mergeProductOffers,
  deduplicateProducts
} = require('../services/aggregation/deduplication');
const BaseAdapter = require('../services/aggregation/BaseAdapter');
const DummyJsonAdapter = require('../services/aggregation/DummyJsonAdapter');
const EbayAdapter = require('../services/aggregation/EbayAdapter');
const { AggregationService } = require('../services/aggregation/AggregationService');

describe('Phase 3 - Product Aggregation & External Integration', () => {

  describe('1. AggregationCache', () => {
    let cache;

    beforeEach(() => {
      cache = new AggregationCache(100); // 100ms TTL for testing
    });

    it('should generate deterministic cache keys regardless of parameter ordering', () => {
      const key1 = cache.generateKey('search', { q: 'laptop', page: 1, limit: 10 });
      const key2 = cache.generateKey('search', { limit: 10, q: 'laptop', page: 1 });
      expect(key1).toBe(key2);
      expect(key1).toBe('search:limit=10&page=1&q=laptop');
    });

    it('should store, retrieve, and track cache hits and misses', () => {
      expect(cache.get('missing-key')).toBeNull();
      cache.set('item:1', { name: 'Test Product' });
      expect(cache.get('item:1')).toEqual({ name: 'Test Product' });

      const stats = cache.getStats();
      expect(stats.sets).toBe(1);
      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(1);
      expect(stats.hitRate).toBe(50);
    });

    it('should expire entries after TTL', async () => {
      cache.set('short-lived', { val: 42 }, 50); // 50ms TTL
      expect(cache.get('short-lived')).toEqual({ val: 42 });

      await new Promise((res) => setTimeout(res, 70));
      expect(cache.get('short-lived')).toBeNull();
      expect(cache.has('short-lived')).toBe(false);
    });

    it('should clear and invalidate by prefix', () => {
      cache.set('search:1', 'res1');
      cache.set('search:2', 'res2');
      cache.set('detail:1', 'res3');

      const invalidated = cache.invalidate('search:');
      expect(invalidated).toBe(2);
      expect(cache.get('search:1')).toBeNull();
      expect(cache.get('detail:1')).toBe('res3');

      cache.clear();
      expect(cache.getStats().size).toBe(0);
    });
  });

  describe('2. Deduplication & Multi-Seller Matching Engine', () => {
    it('should extract alphanumeric model codes from titles', () => {
      const codes1 = extractModelIdentifiers('Sony WH-1000XM4 Wireless Headphones');
      expect(codes1).toContain('wh1000xm4');

      const codes2 = extractModelIdentifiers('Apple MacBook Pro 16-inch M3 Max 32GB RAM');
      expect(codes2).toContain('m3');

      const codes3 = extractModelIdentifiers('Generic Cable');
      expect(codes3.length).toBe(0);
    });

    it('should identify matching products by identical ID or SKU', () => {
      const prodA = { id: 'AE-101', title: 'Product One', brand: 'Sony' };
      const prodB = { id: 'AE-101', title: 'Product Different Title', brand: 'Sony' };
      expect(areProductsMatching(prodA, prodB)).toBe(true);

      const prodC = { SKU: 'SKU-999', title: 'Widget', brand: 'BrandX' };
      const prodD = { SKU: 'SKU-999', title: 'Other Widget', brand: 'BrandX' };
      expect(areProductsMatching(prodC, prodD)).toBe(true);
    });

    it('should match products with identical brand and shared hardware model identifiers', () => {
      const prodA = {
        title: 'Sony WH-1000XM4 Noise Canceling Headphones - Black',
        brand: 'Sony',
        sector: 'Audio & Entertainment'
      };
      const prodB = {
        title: 'Sony WH-1000XM4 Over-Ear Bluetooth Headset Silver',
        brand: 'Sony',
        sector: 'Audio & Entertainment'
      };
      expect(areProductsMatching(prodA, prodB)).toBe(true);
    });

    it('should NOT match products from different brands or completely different models', () => {
      const prodA = {
        title: 'Sony WH-1000XM4 Noise Canceling Headphones',
        brand: 'Sony',
        sector: 'Audio & Entertainment'
      };
      const prodB = {
        title: 'Bose QuietComfort 45 Headphones',
        brand: 'Bose',
        sector: 'Audio & Entertainment'
      };
      expect(areProductsMatching(prodA, prodB)).toBe(false);

      const prodC = {
        title: 'Sony WH-1000XM5 Headphones',
        brand: 'Sony',
        sector: 'Audio & Entertainment'
      };
      // XM4 vs XM5 are different hardware generations
      expect(areProductsMatching(prodA, prodC)).toBe(false);
    });

    it('should merge multi-seller offers without duplicating offer URLs', () => {
      const target = {
        id: '1',
        title: 'Raspberry Pi 5',
        brand: 'Raspberry Pi',
        price: 8500,
        sellers: [
          { name: 'Amazon India', price: 8500, url: 'https://amazon.in/rpi5' }
        ],
        providers: ['local']
      };

      const incoming = {
        id: 'ext-ebay-99',
        title: 'Raspberry Pi 5',
        brand: 'Raspberry Pi',
        price: 8200,
        sellers: [
          { name: 'eBay Seller', price: 8200, url: 'https://ebay.com/rpi5' },
          { name: 'Amazon India', price: 8500, url: 'https://amazon.in/rpi5' } // Duplicate URL
        ],
        provider: 'ebay'
      };

      const merged = mergeProductOffers(target, incoming);
      expect(merged.sellers.length).toBe(2);
      expect(merged.sellers[1].name).toBe('eBay Seller');
      expect(merged.providers).toContain('local');
      expect(merged.providers).toContain('ebay');
    });

    it('should deduplicate an array of products consolidating offers', () => {
      const list = [
        {
          id: '1',
          title: 'Sony WH-1000XM4 Headphones Black',
          brand: 'Sony',
          sector: 'Audio',
          sellers: [{ name: 'Store A', url: 'http://a.com' }],
          provider: 'local'
        },
        {
          id: 'ext-dj-2',
          title: 'Sony WH-1000XM4 Headphones Silver Edition',
          brand: 'Sony',
          sector: 'Audio',
          sellers: [{ name: 'Store B', url: 'http://b.com' }],
          provider: 'dummyjson'
        },
        {
          id: '3',
          title: 'Apple iPad Pro 11-inch',
          brand: 'Apple',
          sector: 'Consumer Electronics',
          sellers: [{ name: 'Store C', url: 'http://c.com' }],
          provider: 'local'
        }
      ];

      const deduplicated = deduplicateProducts(list);
      expect(deduplicated.length).toBe(2); // 2 distinct products
      const sony = deduplicated.find((p) => p.brand === 'Sony');
      expect(sony.sellers.length).toBe(2);
      expect(sony.providers).toContain('dummyjson');
    });
  });

  describe('3. BaseAdapter & Resilience Mechanics', () => {
    class MockAdapter extends BaseAdapter {
      constructor(opts) {
        super('mock-provider', opts);
      }
    }

    it('should initialize with status and health flags', () => {
      const adapter = new MockAdapter({ timeoutMs: 1000 });
      expect(adapter.getName()).toBe('mock-provider');
      const status = adapter.getStatus();
      expect(status.healthy).toBe(true);
      expect(status.rateLimited).toBe(false);
      expect(status.configured).toBe(true);
    });

    it('should mark adapter rate-limited and reject calls until cooldown', async () => {
      const adapter = new MockAdapter();
      adapter.markRateLimited(500); // 500ms
      expect(adapter.isRateLimited()).toBe(true);

      await expect(adapter.fetchWithRetry('http://example.com')).rejects.toThrow(/rate limiting/i);
    });
  });

  describe('4. DummyJsonAdapter', () => {
    let adapter;

    beforeEach(() => {
      adapter = new DummyJsonAdapter();
    });

    it('should normalize DummyJSON product into Aryan Electronics schema with INR conversion', () => {
      const raw = {
        id: 78,
        title: 'Apple MacBook Pro 14 Inch Space Grey',
        description: 'Powerful laptop with M1 Pro chip',
        category: 'laptops',
        price: 1999.99,
        discountPercentage: 5,
        rating: 4.7,
        stock: 15,
        brand: 'Apple',
        sku: 'LAP-APP-078',
        thumbnail: 'https://cdn.dummyjson.com/thumb.jpg',
        images: ['https://cdn.dummyjson.com/1.jpg']
      };

      const normalized = adapter.normalizeProduct(raw);
      expect(normalized.id).toBe('ext-dj-78');
      expect(normalized.brand).toBe('Apple');
      expect(normalized.sector).toBe('Computing & Gaming');
      expect(normalized.category).toBe('Laptops & Workstations');
      expect(normalized.currency).toBe('INR');
      expect(normalized.price).toBe(Math.round(1999.99 * 83.5));
      expect(normalized.sellers.length).toBe(2); // Amazon India + Croma
      expect(normalized.provider).toBe('dummyjson');
      expect(normalized.originalProductUrl).toContain('dummyjson.com/products/78');
    });

    it('should handle missing and null fields gracefully during normalization', () => {
      const rawMinimal = {
        id: 999
      };

      const normalized = adapter.normalizeProduct(rawMinimal);
      expect(normalized.id).toBe('ext-dj-999');
      expect(normalized.brand).toBe('Generic Electronics');
      expect(normalized.price).toBeNull();
      expect(normalized.stock).toBe(10);
      expect(normalized.images).toEqual([]);
    });

    it('should reject invalid raw payload', () => {
      expect(() => adapter.normalizeProduct(null)).toThrow(/Invalid product payload/);
      expect(() => adapter.normalizeProduct('string-not-object')).toThrow(/Invalid product payload/);
    });
  });

  describe('5. EbayAdapter', () => {
    let adapter;

    beforeEach(() => {
      adapter = new EbayAdapter();
    });

    it('should operate in verified fixture mode when OAuth credentials are not configured', async () => {
      expect(adapter.isConfigured()).toBe(false);
      const result = await adapter.search('laptop');
      expect(result.provider).toBe('ebay');
      expect(result.isFixtureFallback).toBe(true);
      expect(result.items.length).toBeGreaterThan(0);
      expect(result.items[0].provider).toBe('ebay');
      expect(result.items[0].currency).toBe('INR');
    });

    it('should resolve items by external ID in fixture mode', async () => {
      const item = await adapter.getById('v1_385920192831_0');
      expect(item).toBeDefined();
      expect(item.brand).toBe('Apple');
      expect(item.sellers.length).toBeGreaterThanOrEqual(1);
    });

    it('should throw error when item ID is not found', async () => {
      await expect(adapter.getById('non-existent-ebay-item-000')).rejects.toThrow(/not found/);
    });
  });

  describe('6. AggregationService Fault Tolerance & Orchestration', () => {
    it('should gracefully degrade and not crash when an external adapter fails', async () => {
      const service = new AggregationService();

      // Register a faulty adapter that always throws
      const faultyAdapter = {
        getName: () => 'faulty-stream',
        getStatus: () => ({ name: 'faulty-stream', healthy: false }),
        search: async () => {
          throw new Error('Connection reset by remote host');
        },
        fetchElectronics: async () => {
          throw new Error('Downstream network outage');
        }
      };
      service.registerAdapter(faultyAdapter);

      // Search should succeed with local items and working adapters without throwing
      const result = await service.searchAggregated('MacBook');
      expect(result.items).toBeDefined();
      expect(result.items.length).toBeGreaterThan(0);
    });

    it('should return providers status report including cache statistics', () => {
      const service = new AggregationService();
      const status = service.getProvidersStatus();
      expect(status.cache).toBeDefined();
      expect(status.providers.dummyjson).toBeDefined();
      expect(status.providers.ebay).toBeDefined();
    });

    it('should resolve product by external prefixed ID and local MongoDB ID', async () => {
      const service = new AggregationService();

      // Local product lookup
      const localProd = await service.getProductById('1');
      expect(localProd).toBeDefined();
      expect(localProd.title).toContain('Acer Chromebook 314');

      // External eBay item lookup
      const ebayProd = await service.getProductById('ext-ebay-v1_385920192831_0');
      expect(ebayProd).toBeDefined();
      expect(ebayProd.provider).toBe('ebay');
    });
  });

  describe('7. Aggregation API Endpoints (Integration)', () => {
    it('GET /api/aggregate/providers - should return provider statuses and cache metrics', async () => {
      const res = await request(app)
        .get('/api/aggregate/providers')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.providers).toBeDefined();
      expect(res.body.data.providers.dummyjson).toBeDefined();
      expect(res.body.data.providers.ebay).toBeDefined();
      expect(res.body.data.cache).toBeDefined();
    });

    it('GET /api/aggregate/products - should return aggregated catalog with breakdown', async () => {
      const res = await request(app)
        .get('/api/aggregate/products?limit=5')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBeLessThanOrEqual(5);
      expect(res.body.providerBreakdown).toBeDefined();
      expect(res.body.providerBreakdown.local).toBeGreaterThanOrEqual(100);
      expect(res.body.pagination).toBeDefined();
    });

    it('GET /api/aggregate/products?provider=dummyjson - should filter by specific provider', async () => {
      const res = await request(app)
        .get('/api/aggregate/products?provider=dummyjson&limit=5')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.every((p) => p.provider === 'dummyjson')).toBe(true);
    });

    it('GET /api/aggregate/products/:id - should return single aggregated product', async () => {
      const res = await request(app)
        .get('/api/aggregate/products/1')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe('1');
      expect(res.body.data.sellers).toBeInstanceOf(Array);
    });

    it('GET /api/aggregate/products/:id - should return 404 for non-existent item', async () => {
      const res = await request(app)
        .get('/api/aggregate/products/non-existent-product-id-999999')
        .expect(404);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('PRODUCT_NOT_FOUND');
    });

    it('GET /api/aggregate/search - should perform multi-provider search', async () => {
      const res = await request(app)
        .get('/api/aggregate/search?q=laptop')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.items).toBeInstanceOf(Array);
      expect(res.body.items.length).toBeGreaterThan(0);
      expect(res.body.providerBreakdown).toBeDefined();
    });

    it('GET /api/aggregate/search - should return 400 when query parameter is missing', async () => {
      const res = await request(app)
        .get('/api/aggregate/search')
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('QUERY_REQUIRED');
    });

    it('POST /api/aggregate/cache/clear - should evict all cached aggregation entries', async () => {
      const res = await request(app)
        .post('/api/aggregate/cache/clear')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('Aggregation cache cleared successfully');
    });
  });
});
