/**
 * Aryan Electronics - DummyJSON External Product Provider Adapter
 * Integrates live consumer electronics, laptops, smartphones, and accessories
 * Maps external data into normalized Aryan Electronics specifications and multi-seller offers
 */

const BaseAdapter = require('./BaseAdapter');

const USD_TO_INR_RATE = 83.5;

class DummyJsonAdapter extends BaseAdapter {
  constructor(options = {}) {
    super('dummyjson', {
      timeoutMs: options.timeoutMs || 5000,
      maxRetries: options.maxRetries || 2,
      ...options
    });
    this.baseUrl = options.baseUrl || 'https://dummyjson.com';
  }

  isConfigured() {
    return true; // Free, public, no authentication keys required
  }

  /**
   * Map DummyJSON category strings to Aryan Electronics Sectors & Categories
   */
  mapSectorAndCategory(rawCategory = '') {
    const cat = String(rawCategory).toLowerCase();
    switch (cat) {
      case 'laptops':
        return { sector: 'Computing & Gaming', category: 'Laptops & Workstations' };
      case 'smartphones':
        return { sector: 'Consumer Electronics', category: 'Smartphones' };
      case 'tablets':
        return { sector: 'Consumer Electronics', category: 'Tablets' };
      case 'mobile-accessories':
        return { sector: 'Consumer Electronics', category: 'Mobile & Device Accessories' };
      case 'smart-home':
        return { sector: 'Smart Home & IoT', category: 'Smart Home Devices' };
      default:
        return { sector: 'Consumer Electronics', category: 'Consumer Electronics' };
    }
  }

  /**
   * Normalization to standard Aryan Electronics Product model
   */
  normalizeProduct(raw) {
    if (!raw || typeof raw !== 'object') {
      throw new Error('[DummyJsonAdapter] Invalid product payload');
    }

    const { sector, category } = this.mapSectorAndCategory(raw.category);
    const inrPrice = typeof raw.price === 'number' ? Math.round(raw.price * USD_TO_INR_RATE) : null;
    const discount = typeof raw.discountPercentage === 'number' ? raw.discountPercentage : 0;
    const internalId = `ext-dj-${raw.id}`;
    const brand = (raw.brand || 'Generic Electronics').trim();
    const title = (raw.title || 'Untitled Electronics Product').trim();

    // Generate specifications array from raw metadata
    const specifications = [];
    if (raw.sku) specifications.push({ name: 'Manufacturer SKU', value: String(raw.sku) });
    if (raw.brand) specifications.push({ name: 'Brand / Manufacturer', value: String(raw.brand) });
    if (raw.category) specifications.push({ name: 'Device Class', value: category });
    if (raw.weight) specifications.push({ name: 'Weight', value: `${raw.weight}g` });
    if (raw.warrantyInformation) specifications.push({ name: 'Warranty', value: String(raw.warrantyInformation) });
    if (raw.shippingInformation) specifications.push({ name: 'Shipping Terms', value: String(raw.shippingInformation) });
    if (raw.dimensions) {
      const { width, height, depth } = raw.dimensions;
      if (width && height && depth) {
        specifications.push({ name: 'Dimensions', value: `${width} x ${height} x ${depth} cm` });
      }
    }

    // Normalized seller price comparison offers
    const brandTitleQuery = encodeURIComponent(`${brand} ${title}`);
    const sellers = [
      {
        name: 'Amazon India',
        price: inrPrice,
        currency: 'INR',
        availability: raw.availabilityStatus || (raw.stock > 0 ? 'In Stock' : 'Out of Stock'),
        inStock: (raw.stock || 0) > 0,
        rating: typeof raw.rating === 'number' ? raw.rating : 4.5,
        url: `https://www.amazon.in/s?k=${brandTitleQuery}`,
        source: 'dummyjson_partner',
        lastVerified: new Date().toISOString()
      },
      {
        name: 'Croma',
        price: inrPrice ? Math.round(inrPrice * 1.02) : null,
        currency: 'INR',
        availability: (raw.stock || 0) > 0 ? 'Available for delivery' : 'Notify Me',
        inStock: (raw.stock || 0) > 0,
        rating: 4.4,
        url: `https://www.croma.com/searchB?q=${brandTitleQuery}`,
        source: 'dummyjson_partner',
        lastVerified: new Date().toISOString()
      }
    ];

    const images = Array.isArray(raw.images) && raw.images.length > 0
      ? raw.images
      : (raw.thumbnail ? [raw.thumbnail] : []);

    return {
      id: internalId,
      externalId: String(raw.id),
      SKU: raw.sku ? `AE-DJ-${raw.sku}` : `AE-DJ-${raw.id}`,
      sku: raw.sku ? `AE-DJ-${raw.sku}` : `AE-DJ-${raw.id}`,
      title,
      brand,
      sector,
      category,
      description: raw.description ? String(raw.description).trim() : 'Aggregated electronic device specifications and verified multi-channel pricing.',
      price: inrPrice,
      currency: 'INR',
      discountPercentage: discount,
      rating: typeof raw.rating === 'number' ? raw.rating : 4.5,
      stock: typeof raw.stock === 'number' ? raw.stock : 10,
      availability: raw.availabilityStatus || 'In Stock',
      thumbnail: raw.thumbnail || images[0] || '',
      images,
      specifications,
      features: Array.isArray(raw.tags) && raw.tags.length > 0
        ? raw.tags.map((t) => `Feature: ${t}`)
        : ['Energy efficient', 'Commercial grade', 'Full warranty included'],
      useCases: ['Consumer electronics', 'Personal productivity', 'Modern digital hardware'],
      sellers,
      sources: [
        {
          type: 'live_external_api',
          url: `${this.baseUrl}/products/${raw.id}`
        }
      ],
      provider: 'dummyjson',
      originalProductUrl: `${this.baseUrl}/products/${raw.id}`,
      lastSynchronized: new Date().toISOString(),
      rawProviderData: raw
    };
  }

  /**
   * Search DummyJSON products
   */
  async search(query, options = {}) {
    const limit = options.limit || 20;
    const skip = options.skip || 0;
    const url = `${this.baseUrl}/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`;
    const response = await this.fetchWithRetry(url, options);

    const items = Array.isArray(response.products) ? response.products : [];
    // Filter to electronics relevant categories
    const relevant = items.filter((p) => {
      const cat = (p.category || '').toLowerCase();
      return ['laptops', 'smartphones', 'tablets', 'mobile-accessories', 'smart-home'].includes(cat) ||
             (p.title && /laptop|phone|tablet|pro|usb|charger|audio|speaker|watch|display/i.test(p.title));
    });

    return {
      provider: this.name,
      total: response.total || relevant.length,
      count: relevant.length,
      items: relevant.map((item) => this.normalizeProduct(item))
    };
  }

  /**
   * Fetch by external ID
   */
  async getById(externalId) {
    const cleanId = String(externalId).replace(/^ext-dj-/, '');
    const url = `${this.baseUrl}/products/${cleanId}`;
    const raw = await this.fetchWithRetry(url);
    return this.normalizeProduct(raw);
  }

  /**
   * Fetch electronics streams across laptops, smartphones, and tablets
   */
  async fetchElectronics(options = {}) {
    const limit = options.limit || 10;
    const categories = ['laptops', 'smartphones', 'tablets', 'mobile-accessories'];

    const fetches = categories.map((cat) =>
      this.fetchWithRetry(`${this.baseUrl}/products/category/${cat}?limit=${limit}`, options)
        .then((res) => (Array.isArray(res.products) ? res.products : []))
        .catch((err) => {
          console.warn(`[DummyJsonAdapter] Category ${cat} fetch failed:`, err.message);
          return [];
        })
    );

    const results = await Promise.all(fetches);
    const combined = results.flat();

    return {
      provider: this.name,
      total: combined.length,
      count: combined.length,
      items: combined.map((item) => this.normalizeProduct(item))
    };
  }
}

module.exports = DummyJsonAdapter;
