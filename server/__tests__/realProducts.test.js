const request = require('supertest');
const app = require('../app');
const path = require('path');
const fs = require('fs');
const { loadAndValidateProducts } = require('../data/importProducts');

describe('Real Product Dataset Integration Tests', () => {
  const jsonPath = path.resolve(__dirname, '../../aryan_electronics_products.json');

  it('aryan_electronics_products.json exists and contains 188 verified products', () => {
    expect(fs.existsSync(jsonPath)).toBe(true);
    const content = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    const prods = Array.isArray(content.products) ? content.products : content;
    expect(Array.isArray(prods)).toBe(true);
    expect(prods.length).toBe(188);
  });

  it('validates dataset integrity: no duplicates, no placeholder services, valid schemas', () => {
    const content = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    const rawProducts = Array.isArray(content.products) ? content.products : content;
    const idSet = new Set();
    const skuSet = new Set();

    rawProducts.forEach((p) => {
      // Required core fields
      expect(p.id).toBeDefined();
      expect(p.title).toBeDefined();
      expect(typeof p.title).toBe('string');
      expect(p.brand).toBeDefined();
      expect(p.sector).toBeDefined();
      expect(p.category).toBeDefined();
      expect(p.description).toBeDefined();
      expect(p.thumbnail).toBeDefined();
      expect(Array.isArray(p.images)).toBe(true);
      expect(p.images.length).toBeGreaterThan(0);
      expect(typeof p.specifications).toBe('object');
      expect(Array.isArray(p.features)).toBe(true);
      expect(Array.isArray(p.useCases)).toBe(true);
      expect(Array.isArray(p.sellers)).toBe(true);
      expect(Array.isArray(p.sources)).toBe(true);

      // No placehold.co or Unsplash images in the real dataset
      expect(p.thumbnail).not.toContain('placehold.co');
      expect(p.thumbnail).not.toContain('unsplash.com');

      // Unique identifiers
      expect(idSet.has(p.id)).toBe(false);
      idSet.add(p.id);

      const sku = p.SKU || p.sku;
      expect(sku).toBeDefined();
      expect(skuSet.has(sku)).toBe(false);
      skuSet.add(sku);
    });

    expect(idSet.size).toBe(188);
    expect(skuSet.size).toBe(188);
  });

  it('loadAndValidateProducts transforms specifications into name-value pairs while preserving rawSpecifications', () => {
    const { products, summary } = loadAndValidateProducts();

    expect(summary.totalRecords).toBe(188);
    expect(summary.successfullyImported).toBe(188);
    expect(summary.failed).toBe(0);
    expect(summary.duplicateRecords).toBe(0);
    expect(products.length).toBe(188);

    const first = products[0];
    expect(Array.isArray(first.specifications)).toBe(true);
    expect(first.specifications.length).toBeGreaterThan(0);
    expect(first.specifications[0]).toHaveProperty('name');
    expect(first.specifications[0]).toHaveProperty('value');
    expect(first.rawSpecifications).toBeDefined();
    expect(typeof first.rawSpecifications).toBe('object');
  });

  it('GET /api/products returns real products with pagination', async () => {
    const res = await request(app).get('/api/products?limit=10');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(10);
    expect(res.body.total).toBeGreaterThanOrEqual(100);
  });

  it('GET /api/products?search searches across real commercial electronics (e.g. Acer, Lenovo, Dell, Samsung)', async () => {
    const res = await request(app).get('/api/products?search=Acer');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    const hasAcer = res.body.data.some(p => p.brand.toLowerCase() === 'acer' || p.title.toLowerCase().includes('acer'));
    expect(hasAcer).toBe(true);
  });

  it('GET /api/products?sector filters across real catalog sectors', async () => {
    const res = await request(app).get('/api/products?sector=Education');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    res.body.data.forEach(p => {
      expect(p.sector.toLowerCase()).toContain('education');
    });
  });

  it('GET /api/products/sectors returns aggregated real sectors with counts and categories', async () => {
    const res = await request(app).get('/api/products/sectors');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);

    const sectorNames = res.body.data.map(s => s.name);
    expect(sectorNames).toContain('Education');
    expect(sectorNames).toContain('Healthcare');
    expect(sectorNames).toContain('Industrial');
  });

  it('GET /api/products/:id resolves real product by string id or SKU with sellers and sources', async () => {
    // Product 1 is Acer Chromebook 314
    const res = await request(app).get('/api/products/1');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(String(res.body.data.id)).toBe('1');
    expect(res.body.data.brand).toBe('Acer');
    expect(res.body.data.SKU).toBe('AE-EDU-PRD-001');
    expect(Array.isArray(res.body.data.sellers)).toBe(true);
    expect(res.body.data.sellers.length).toBeGreaterThan(0);
    expect(Array.isArray(res.body.data.sources)).toBe(true);
    expect(res.body.data.sources.length).toBeGreaterThan(0);

    // Also resolvable by SKU
    const resSku = await request(app).get('/api/products/AE-EDU-PRD-001');
    expect(resSku.statusCode).toBe(200);
    expect(resSku.body.success).toBe(true);
    expect(String(resSku.body.data.id)).toBe('1');
  });

  it('GET /api/products/:id resolves products with null prices (Price on Request)', async () => {
    // Product 15 is Mindray BeneVision N15 which has price: null
    const res = await request(app).get('/api/products/15');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(String(res.body.data.id)).toBe('15');
    expect(res.body.data.price).toBeNull();
    expect(res.body.data.stock).toBeNull();
  });
});
