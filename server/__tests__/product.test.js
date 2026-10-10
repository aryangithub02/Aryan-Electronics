const request = require('supertest');
const app = require('../app');

describe('Product API Endpoints', () => {
  describe('GET /api/products', () => {
    it('should return a list of products with pagination info', async () => {
      const res = await request(app).get('/api/products');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body).toHaveProperty('pagination');
      expect(res.body.pagination).toHaveProperty('page', 1);
    });

    it('should filter products by search term', async () => {
      const res = await request(app).get('/api/products?search=Apex');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].title).toContain('Apex');
    });

    it('should filter products by sector', async () => {
      const res = await request(app).get('/api/products?sector=Computing');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      res.body.data.forEach(item => {
        expect(item.sector.toLowerCase()).toContain('computing');
      });
    });
  });

  describe('GET /api/products/sectors', () => {
    it('should return aggregated sectors with product counts', async () => {
      const res = await request(app).get('/api/products/sectors');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0]).toHaveProperty('name');
      expect(res.body.data[0]).toHaveProperty('productCount');
      expect(res.body.data[0]).toHaveProperty('categories');
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return a specific product by its id', async () => {
      const res = await request(app).get('/api/products/prod-001');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id', 'prod-001');
      expect(res.body.data).toHaveProperty('title');
      expect(res.body.data).toHaveProperty('brand');
      expect(res.body.data).toHaveProperty('price');
      expect(res.body.data).toHaveProperty('specifications');
      expect(res.body.data).toHaveProperty('sellers');
    });

    it('should return 404 for a non-existent product id', async () => {
      const res = await request(app).get('/api/products/non-existent-id-999');

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toHaveProperty('message');
    });
  });
});
