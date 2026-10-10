const request = require('supertest');
const app = require('../app');
const {
  calculateProductScore,
  calculateProductBadges,
  calculatePriceInsights,
  enrichProductWithInsights,
  DEFAULT_SCORING_WEIGHTS
} = require('../services/scoringAndInsights');
const {
  searchProductsWithRelevance,
  generateSearchSuggestions,
  correctSpelling,
  levenshteinDistance
} = require('../services/searchService');
const {
  getSimilarProducts,
  getBudgetAlternatives,
  getRelatedProducts,
  getPersonalizedRecommendations
} = require('../services/recommendationService');

describe('PHASE 4: Intelligent Product Discovery, Recommendations, and Scoring', () => {
  // Mock dataset for deterministic testing
  const sampleHardwareCatalog = [
    {
      id: 'mock-laptop-1',
      title: 'Apple MacBook Pro 14 M3',
      brand: 'Apple',
      sector: 'Computing & Gaming',
      category: 'Laptops',
      price: 169900,
      rating: 4.9,
      stock: 12,
      availability: 'In Stock',
      specifications: [
        { name: 'Processor', value: 'Apple M3 Pro' },
        { name: 'RAM', value: '18GB' },
        { name: 'Storage', value: '512GB SSD' }
      ],
      features: ['Liquid Retina XDR', 'Up to 18 hours battery', 'MagSafe 3'],
      sellers: [
        { name: 'Apple Direct', price: 169900, rating: 4.9, availability: 'In Stock', lastVerified: '2026-10-01' },
        { name: 'Amazon India', price: 164900, rating: 4.7, availability: 'In Stock', lastVerified: '2026-10-01' },
        { name: 'Croma', price: 172000, rating: 4.6, availability: 'In Stock', lastVerified: '2026-10-01' }
      ]
    },
    {
      id: 'mock-laptop-2',
      title: 'Apple MacBook Air 13 M2',
      brand: 'Apple',
      sector: 'Computing & Gaming',
      category: 'Laptops',
      price: 99900,
      rating: 4.8,
      stock: 25,
      availability: 'In Stock',
      specifications: [
        { name: 'Processor', value: 'Apple M2' },
        { name: 'RAM', value: '8GB' },
        { name: 'Storage', value: '256GB SSD' }
      ],
      features: ['Fanless design', 'MagSafe charging'],
      sellers: [
        { name: 'Amazon India', price: 94900, rating: 4.8, availability: 'In Stock' },
        { name: 'Apple Direct', price: 99900, rating: 4.9, availability: 'In Stock' }
      ]
    },
    {
      id: 'mock-laptop-3',
      title: 'Dell XPS 13 Plus Core i7',
      brand: 'Dell',
      sector: 'Computing & Gaming',
      category: 'Laptops',
      price: 135000,
      rating: 4.5,
      stock: 0,
      availability: 'Out of Stock',
      specifications: [
        { name: 'Processor', value: 'Intel Core i7-1360P' },
        { name: 'RAM', value: '16GB' }
      ],
      features: ['OLED InfinityEdge', 'Capacitive touch row'],
      sellers: [
        { name: 'Dell Official', price: 135000, rating: 4.5 }
      ]
    },
    {
      id: 'mock-iot-1',
      title: 'Arduino Uno R4 WiFi',
      brand: 'Arduino',
      sector: 'Robotics & IoT',
      category: 'Development Boards',
      price: 2450,
      rating: 4.9,
      stock: 40,
      availability: 'In Stock',
      specifications: [
        { name: 'Microcontroller', value: 'Renesas RA4M1 32-bit' },
        { name: 'Wireless', value: 'ESP32-S3 WiFi & Bluetooth' },
        { name: 'Operating Voltage', value: '5V' }
      ],
      features: ['12x8 LED Matrix', 'HID support', 'Qwiic connector'],
      sellers: [
        { name: 'Robu.in', price: 2450, rating: 4.9, inStock: true },
        { name: 'ElectronicsComp', price: 2350, rating: 4.8, inStock: true }
      ]
    },
    {
      id: 'mock-iot-2',
      title: 'Arduino Nano ESP32',
      brand: 'Arduino',
      sector: 'Robotics & IoT',
      category: 'Development Boards',
      price: 1850,
      rating: 4.7,
      stock: 15,
      availability: 'In Stock',
      specifications: [
        { name: 'Microcontroller', value: 'u-blox NORA-W106 (ESP32-S3)' },
        { name: 'Clock Speed', value: '240 MHz' }
      ],
      sellers: [
        { name: 'Robu.in', price: 1850, rating: 4.8 }
      ]
    },
    {
      id: 'mock-sensor-1',
      title: 'BME280 Environmental Sensor Module',
      brand: 'Bosch Sensortec',
      sector: 'Robotics & IoT',
      category: 'Sensors & Modules',
      price: 380,
      rating: 4.8,
      stock: 50,
      availability: 'In Stock',
      specifications: [
        { name: 'Parameters', value: 'Temperature, Humidity, Pressure' },
        { name: 'Interface', value: 'I2C, SPI' }
      ]
    },
    {
      id: 'mock-commercial-1',
      title: 'Industrial PLC Gateway Pro',
      brand: 'Siemens',
      sector: 'Industrial Automation',
      category: 'Controllers & PLC',
      price: null, // Commercial Price on Request
      rating: null, // Missing rating
      stock: 5,
      availability: 'Contact Distributor'
    }
  ];

  /* -------------------------------------------------------------
   * 1. PRODUCT SCORING ALGORITHM & WEIGHT NORMALIZATION
   * ------------------------------------------------------------- */
  describe('1. Product Scoring Algorithm & Weight Normalization', () => {
    it('should calculate normalized 0-100 scores within bounds', () => {
      sampleHardwareCatalog.forEach((product) => {
        const { score, breakdown } = calculateProductScore(product, sampleHardwareCatalog);
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(100);
        expect(typeof score).toBe('number');
        expect(breakdown).toHaveProperty('ratingScore');
        expect(breakdown).toHaveProperty('priceScore');
        expect(breakdown).toHaveProperty('availabilityScore');
        expect(breakdown).toHaveProperty('specScore');
        expect(breakdown).toHaveProperty('sellerScore');
      });
    });

    it('should respect configured mathematical weights summing to 1.0', () => {
      const sum =
        DEFAULT_SCORING_WEIGHTS.rating +
        DEFAULT_SCORING_WEIGHTS.price +
        DEFAULT_SCORING_WEIGHTS.availability +
        DEFAULT_SCORING_WEIGHTS.specs +
        DEFAULT_SCORING_WEIGHTS.sellers;
      expect(Math.round(sum * 100) / 100).toBe(1.0);
    });

    it('should impute neutral baselines for products with missing price and rating (no zero degradation)', () => {
      const commercialItem = sampleHardwareCatalog.find((p) => p.id === 'mock-commercial-1');
      const { score, breakdown } = calculateProductScore(commercialItem, sampleHardwareCatalog);

      // Rating baseline is 70, price baseline is 65
      expect(breakdown.ratingScore).toBe(70);
      expect(breakdown.priceScore).toBe(65);
      // Overall score must not crash or be zero
      expect(score).toBeGreaterThan(50);
    });
  });

  /* -------------------------------------------------------------
   * 2. PRODUCT BADGE ASSIGNMENT RULES
   * ------------------------------------------------------------- */
  describe('2. Product Badge Assignment Rules', () => {
    it('should assign "Best Rated" to high-rated products (>= 4.8★)', () => {
      const macbook = sampleHardwareCatalog.find((p) => p.id === 'mock-laptop-1');
      const badges = calculateProductBadges(macbook, sampleHardwareCatalog);
      expect(badges).toContain('Best Rated');
    });

    it('should assign "Lowest Price" to category budget leader', () => {
      const air = sampleHardwareCatalog.find((p) => p.id === 'mock-laptop-2');
      const badges = calculateProductBadges(air, sampleHardwareCatalog);
      expect(badges).toContain('Lowest Price');
    });

    it('should not assign misleading badges to unpriced or low-stock items', () => {
      const commercial = sampleHardwareCatalog.find((p) => p.id === 'mock-commercial-1');
      const badges = calculateProductBadges(commercial, sampleHardwareCatalog);
      expect(badges).not.toContain('Lowest Price');
      expect(badges).not.toContain('Best Rated');
    });
  });

  /* -------------------------------------------------------------
   * 3. MULTI-SELLER PRICE COMPARISON INSIGHTS
   * ------------------------------------------------------------- */
  describe('3. Multi-Seller Price Comparison Insights', () => {
    it('should compute lowest, highest, average, and spread across merchants', () => {
      const macbook = sampleHardwareCatalog.find((p) => p.id === 'mock-laptop-1');
      const insights = calculatePriceInsights(macbook);

      expect(insights.hasComparison).toBe(true);
      expect(insights.sellerCount).toBe(3);
      expect(insights.lowestPrice).toBe(164900); // Amazon India
      expect(insights.highestPrice).toBe(172000); // Croma
      expect(insights.bestSeller).toBe('Amazon India');
      expect(insights.priceDifference).toBe(7100); // 172000 - 164900
      expect(insights.percentageSavings).toBeGreaterThan(0);
      expect(insights.averagePrice).toBe(168933);
    });

    it('should handle products without multi-seller spreads gracefully', () => {
      const singleSellerItem = sampleHardwareCatalog.find((p) => p.id === 'mock-laptop-3');
      const insights = calculatePriceInsights(singleSellerItem);

      expect(insights.hasComparison).toBe(false);
      expect(insights.sellerCount).toBe(1);
      expect(insights.lowestPrice).toBe(135000);
      expect(insights.highestPrice).toBe(135000);
      expect(insights.priceDifference).toBe(0);
      expect(insights.percentageSavings).toBe(0);
    });
  });

  /* -------------------------------------------------------------
   * 4. INTELLIGENT SEARCH & SPELLING CORRECTION
   * ------------------------------------------------------------- */
  describe('4. Intelligent Search & Spelling Correction', () => {
    it('should correctly fix common electronics typos', () => {
      expect(correctSpelling('samusng')).toBe('samsung');
      expect(correctSpelling('macbok')).toBe('macbook');
      expect(correctSpelling('croebook')).toBe('chromebook');
      expect(correctSpelling('ardunio')).toBe('arduino');
      expect(correctSpelling('rasberry')).toBe('raspberry');
    });

    it('should find partial matches across title, specs, and features', () => {
      // Search by chip spec "M3"
      const results = searchProductsWithRelevance(sampleHardwareCatalog, 'M3');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].title).toContain('M3');

      // Search by feature "Retina"
      const retinaResults = searchProductsWithRelevance(sampleHardwareCatalog, 'Retina');
      expect(retinaResults.length).toBeGreaterThan(0);
      expect(retinaResults[0].title).toContain('MacBook Pro');
    });

    it('should generate rich search suggestions with categories and brands', () => {
      const suggestions = generateSearchSuggestions(sampleHardwareCatalog, 'app');
      expect(suggestions).toHaveProperty('suggestions');
      expect(suggestions).toHaveProperty('brands');
      expect(suggestions.brands).toContain('Apple');
    });
  });

  /* -------------------------------------------------------------
   * 5. PRODUCT RECOMMENDATIONS ENGINE
   * ------------------------------------------------------------- */
  describe('5. Product Recommendations Engine', () => {
    it('should recommend similar items in same category and price tier', () => {
      const macbook = sampleHardwareCatalog.find((p) => p.id === 'mock-laptop-1');
      const similar = getSimilarProducts(macbook, sampleHardwareCatalog, 2);

      expect(similar.length).toBeGreaterThan(0);
      expect(similar[0].category).toBe('Laptops');
      expect(similar.some((p) => p.id === macbook.id)).toBe(false); // excludes self
    });

    it('should identify budget-friendly alternatives with calculated savings', () => {
      const macbookPro = sampleHardwareCatalog.find((p) => p.id === 'mock-laptop-1');
      const budgetOptions = getBudgetAlternatives(macbookPro, sampleHardwareCatalog, 2);

      expect(budgetOptions.length).toBeGreaterThan(0);
      const air = budgetOptions[0];
      expect(air.price).toBeLessThan(macbookPro.price);
      expect(air.budgetSavings).toBeGreaterThan(0);
      expect(air.percentageCheaper).toBeGreaterThan(0);
    });

    it('should recommend complementary hardware (microcontrollers -> sensors)', () => {
      const arduino = sampleHardwareCatalog.find((p) => p.id === 'mock-iot-1');
      const related = getRelatedProducts(arduino, sampleHardwareCatalog, 2);

      expect(related.length).toBeGreaterThan(0);
      expect(related.some((p) => p.category === 'Sensors & Modules')).toBe(true);
    });

    it('should provide personalized recommendations for new users (fallback to highest score)', () => {
      const newContext = {};
      const recs = getPersonalizedRecommendations(newContext, sampleHardwareCatalog, 3);

      expect(recs.length).toBeGreaterThan(0);
      // Items should be enriched with discoveryScore
      expect(recs[0]).toHaveProperty('discoveryScore');
    });
  });

  /* -------------------------------------------------------------
   * 6. LIVE API ENDPOINTS INTEGRATION
   * ------------------------------------------------------------- */
  describe('6. Live API Endpoints Integration', () => {
    it('GET /api/products/filter-options returns dynamic catalog bounds', async () => {
      const res = await request(app).get('/api/products/filter-options');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('priceRange');
      expect(res.body.data).toHaveProperty('brands');
      expect(res.body.data).toHaveProperty('sellers');
      expect(res.body.data).toHaveProperty('ratingTiers');
    });

    it('GET /api/products/suggestions?q=... returns multi-entity suggestions', async () => {
      const res = await request(app).get('/api/products/suggestions?q=ard');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('suggestions');
      expect(res.body.data).toHaveProperty('brands');
      expect(res.body.data).toHaveProperty('categories');
    });

    it('GET /api/products supports combined multi-attribute filters', async () => {
      const res = await request(app).get('/api/products?minPrice=1000&maxPrice=100000&minRating=4.0&availability=in_stock');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      res.body.data.forEach((item) => {
        if (item.price !== null && item.price !== undefined) {
          expect(item.price).toBeGreaterThanOrEqual(1000);
          expect(item.price).toBeLessThanOrEqual(100000);
        }
        if (item.rating) {
          expect(item.rating).toBeGreaterThanOrEqual(4.0);
        }
        // Enriched with Phase 4 Discovery Score
        expect(item).toHaveProperty('discoveryScore');
        expect(item).toHaveProperty('badges');
      });
    });

    it('GET /api/products supports sorting by Discovery Score (score_desc)', async () => {
      const res = await request(app).get('/api/products?sort=score_desc&limit=6');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(1);
      // Validate descending discoveryScore order
      for (let i = 0; i < res.body.data.length - 1; i++) {
        expect(res.body.data[i].discoveryScore).toBeGreaterThanOrEqual(
          res.body.data[i + 1].discoveryScore
        );
      }
    });

    it('GET /api/products/recommendations/for-you returns recommendations', async () => {
      const res = await request(app).get('/api/products/recommendations/for-you?limit=4');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });
});
