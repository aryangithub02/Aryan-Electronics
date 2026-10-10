/**
 * Aryan Electronics - eBay Browse API Commercial Provider Adapter
 * Implements eBay OAuth 2.0 Client Credentials token management, item search,
 * and graceful fallback to verified electronics fixtures when credentials are unconfigured or offline
 */

const BaseAdapter = require('./BaseAdapter');
const fixture = require('./ebayElectronicsFixture');

const USD_TO_INR_RATE = 83.5;

class EbayAdapter extends BaseAdapter {
  constructor(options = {}) {
    super('ebay', {
      timeoutMs: options.timeoutMs || 6000,
      maxRetries: options.maxRetries || 1,
      ...options
    });

    this.clientId = process.env.EBAY_CLIENT_ID || options.clientId || '';
    this.clientSecret = process.env.EBAY_CLIENT_SECRET || options.clientSecret || '';
    this.environment = process.env.EBAY_ENVIRONMENT || options.environment || 'SANDBOX';
    this.baseUrl = this.environment === 'PRODUCTION'
      ? 'https://api.ebay.com'
      : 'https://api.sandbox.ebay.com';

    this.token = null;
    this.tokenExpiresAt = 0;
  }

  isConfigured() {
    return Boolean(this.clientId && this.clientSecret);
  }

  /**
   * Acquire or refresh eBay OAuth 2.0 Application Access Token
   */
  async getAccessToken() {
    if (this.token && Date.now() < this.tokenExpiresAt - 60000) {
      return this.token;
    }

    if (!this.isConfigured()) {
      return null;
    }

    const authHeader = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    const tokenUrl = `${this.baseUrl}/identity/v1/oauth2/token`;

    try {
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${authHeader}`
        },
        body: 'grant_type=client_credentials&scope=https%3A%2F%2Fapi.ebay.com%2Foauth%2Fapi_scope'
      });

      if (!response.ok) {
        throw new Error(`OAuth failed with status ${response.status}`);
      }

      const data = await response.json();
      this.token = data.access_token;
      this.tokenExpiresAt = Date.now() + (data.expires_in || 7200) * 1000;
      return this.token;
    } catch (err) {
      console.warn('[EbayAdapter] OAuth token acquisition failed, operating in fixture mode:', err.message);
      return null;
    }
  }

  /**
   * Infer sector and category from eBay item metadata
   */
  mapSectorAndCategory(raw) {
    const title = (raw.title || '').toLowerCase();
    const catName = raw.categories?.[0]?.categoryName?.toLowerCase() || '';

    if (catName.includes('laptop') || title.includes('laptop') || title.includes('macbook') || title.includes('xps')) {
      return { sector: 'Computing & Gaming', category: 'Laptops & Workstations' };
    }
    if (catName.includes('game') || title.includes('playstation') || title.includes('xbox') || title.includes('nintendo')) {
      return { sector: 'Computing & Gaming', category: 'Gaming Consoles' };
    }
    if (catName.includes('phone') || title.includes('iphone') || title.includes('galaxy') || title.includes('pixel')) {
      return { sector: 'Consumer Electronics', category: 'Smartphones' };
    }
    if (catName.includes('headphone') || title.includes('headphone') || title.includes('earbuds') || title.includes('sennheiser')) {
      return { sector: 'Audio & Entertainment', category: 'Audiophile Headphones' };
    }
    if (catName.includes('single board') || title.includes('raspberry pi') || title.includes('arduino')) {
      return { sector: 'Smart Home & IoT', category: 'Development Boards & IoT' };
    }

    return { sector: 'Consumer Electronics', category: 'Consumer Electronics' };
  }

  /**
   * Infer brand from product title
   */
  inferBrand(title = '') {
    const brands = ['Apple', 'Sony', 'Dell', 'Lenovo', 'Samsung', 'Sennheiser', 'Raspberry Pi', 'Bose', 'Microsoft', 'HP', 'Asus', 'Acer'];
    for (const b of brands) {
      if (new RegExp(`\\b${b}\\b`, 'i').test(title)) {
        return b;
      }
    }
    return 'Authentic Electronics';
  }

  /**
   * Normalize eBay item into Aryan Electronics Schema
   */
  normalizeProduct(raw) {
    if (!raw || typeof raw !== 'object') {
      throw new Error('[EbayAdapter] Invalid product payload');
    }

    const { sector, category } = this.mapSectorAndCategory(raw);
    const brand = this.inferBrand(raw.title);
    const usdVal = parseFloat(raw.price?.value || '0');
    const inrPrice = usdVal > 0 ? Math.round(usdVal * USD_TO_INR_RATE) : null;
    const discount = parseInt(raw.marketingPrice?.discountPercentage || '0', 10);
    const sellerFeedback = parseFloat(raw.seller?.feedbackPercentage || '98');
    const rating = Number(((sellerFeedback / 100) * 5).toFixed(1));

    const specifications = [
      { name: 'Item Condition', value: raw.condition || 'Brand New' },
      { name: 'Seller Feedback', value: `${raw.seller?.feedbackPercentage || '98.5'}% Positive` },
      { name: 'Inventory Location', value: raw.itemLocation?.country || 'Global Distributor' },
      { name: 'Provider Network', value: 'eBay Commercial Browse Network' }
    ];

    const sellers = [
      {
        name: raw.seller?.username ? `eBay Verified: ${raw.seller.username}` : 'eBay Marketplace Direct',
        price: inrPrice,
        currency: 'INR',
        availability: raw.condition || 'In Stock',
        inStock: true,
        rating,
        url: raw.itemWebUrl || `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(raw.title)}`,
        source: 'ebay_browse_api',
        lastVerified: new Date().toISOString()
      }
    ];

    const images = [];
    if (raw.image?.imageUrl) images.push(raw.image.imageUrl);
    if (Array.isArray(raw.additionalImages)) {
      raw.additionalImages.forEach((img) => {
        if (img.imageUrl && !images.includes(img.imageUrl)) images.push(img.imageUrl);
      });
    }

    return {
      id: `ext-ebay-${raw.itemId.replace(/[^a-zA-Z0-9]/g, '_')}`,
      externalId: String(raw.itemId),
      SKU: `AE-EBAY-${raw.itemId.slice(-8)}`,
      sku: `AE-EBAY-${raw.itemId.slice(-8)}`,
      title: raw.title.trim(),
      brand,
      sector,
      category,
      description: `Verified commercial listing imported via eBay Browse API. Condition: ${raw.condition || 'Brand New'}. Seller feedback score: ${raw.seller?.feedbackScore || 'Top Rated'}.`,
      price: inrPrice,
      currency: 'INR',
      discountPercentage: discount,
      rating,
      stock: 5,
      availability: raw.condition || 'In Stock',
      thumbnail: images[0] || '',
      images,
      specifications,
      features: ['Certified seller authenticity', 'Buyer protection program', 'Fast direct dispatch'],
      useCases: ['Commercial electronics', 'International hardware sourcing'],
      sellers,
      sources: [
        {
          type: 'ebay_listing',
          url: raw.itemWebUrl || 'https://www.ebay.com'
        }
      ],
      provider: 'ebay',
      originalProductUrl: raw.itemWebUrl || 'https://www.ebay.com',
      lastSynchronized: new Date().toISOString(),
      rawProviderData: raw
    };
  }

  /**
   * Search eBay Browse API or Fixture Fallback
   */
  async search(query, options = {}) {
    const token = await this.getAccessToken();

    if (token) {
      try {
        const limit = options.limit || 20;
        const searchUrl = `${this.baseUrl}/buy/browse/v1/item_summary/search?q=${encodeURIComponent(query)}&category_ids=58058&limit=${limit}`;
        const data = await this.fetchWithRetry(searchUrl, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const items = Array.isArray(data.itemSummaries) ? data.itemSummaries : [];
        return {
          provider: this.name,
          total: data.total || items.length,
          count: items.length,
          items: items.map((item) => this.normalizeProduct(item))
        };
      } catch (err) {
        console.warn('[EbayAdapter] Live search request failed, using fixture fallback:', err.message);
      }
    }

    // Fixture fallback mode
    const q = (query || '').toLowerCase();
    const filtered = fixture.itemSummaries.filter(
      (item) => item.title.toLowerCase().includes(q) || (item.categories || []).some(c => c.categoryName.toLowerCase().includes(q))
    );

    return {
      provider: this.name,
      total: filtered.length,
      count: filtered.length,
      isFixtureFallback: true,
      items: filtered.map((item) => this.normalizeProduct(item))
    };
  }

  /**
   * Fetch item by ID
   */
  async getById(externalId) {
    const cleanId = String(externalId).replace(/^ext-ebay-/, '');
    const token = await this.getAccessToken();

    if (token) {
      try {
        const itemUrl = `${this.baseUrl}/buy/browse/v1/item/${encodeURIComponent(cleanId)}`;
        const data = await this.fetchWithRetry(itemUrl, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        return this.normalizeProduct(data);
      } catch (err) {
        console.warn('[EbayAdapter] Live item fetch failed, checking fixture:', err.message);
      }
    }

    // Check fixture
    const found = fixture.itemSummaries.find(
      (item) =>
        item.itemId === externalId ||
        item.itemId === cleanId ||
        item.itemId.replace(/[^a-zA-Z0-9]/g, '_') === cleanId ||
        item.itemId.replace(/[^a-zA-Z0-9]/g, '_') === externalId.replace(/[^a-zA-Z0-9]/g, '_')
    );

    if (found) {
      return this.normalizeProduct(found);
    }

    throw new Error(`[EbayAdapter] Product ${externalId} not found`);
  }

  /**
   * Fetch standard electronics inventory stream
   */
  async fetchElectronics(options = {}) {
    const token = await this.getAccessToken();

    if (token) {
      try {
        const limit = options.limit || 10;
        const url = `${this.baseUrl}/buy/browse/v1/item_summary/search?category_ids=58058&limit=${limit}`;
        const data = await this.fetchWithRetry(url, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const items = Array.isArray(data.itemSummaries) ? data.itemSummaries : [];
        return {
          provider: this.name,
          total: data.total || items.length,
          count: items.length,
          items: items.map((item) => this.normalizeProduct(item))
        };
      } catch (err) {
        console.warn('[EbayAdapter] Live fetch failed, using fixture fallback:', err.message);
      }
    }

    return {
      provider: this.name,
      total: fixture.itemSummaries.length,
      count: fixture.itemSummaries.length,
      isFixtureFallback: true,
      items: fixture.itemSummaries.map((item) => this.normalizeProduct(item))
    };
  }
}

module.exports = EbayAdapter;
