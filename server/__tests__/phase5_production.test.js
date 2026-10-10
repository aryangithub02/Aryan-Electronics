const request = require('supertest');
const app = require('../app');
const { generateToken } = require('../utils/jwt');
const { clearMemoryUsers, seedDemoMemoryUser, findUserByEmail } = require('../utils/userStore');

describe('PHASE 5 — Production-Ready Platform & Security / Admin Suite', () => {
  let adminToken;
  let userToken;
  let adminUser;
  let regularUser;

  beforeAll(async () => {
    clearMemoryUsers(true);
    adminUser = await findUserByEmail('admin@aryanelectronics.com');
    regularUser = await findUserByEmail('demo@aryanelectronics.com');

    adminToken = generateToken(adminUser._id || adminUser.id);
    userToken = generateToken(regularUser._id || regularUser.id);
  });

  describe('1. Security Hardening & Headers', () => {
    it('should include Helmet security headers on responses', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toBe(200);
      expect(res.headers).toHaveProperty('x-content-type-options', 'nosniff');
      expect(res.headers).toHaveProperty('x-dns-prefetch-control');
    });

    it('should report deep health metrics and provider availability', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('status', 'healthy');
      expect(res.body).toHaveProperty('uptime');
      expect(res.body).toHaveProperty('memory');
      expect(res.body.memory).toHaveProperty('rssMb');
      expect(res.body.memory).toHaveProperty('heapUsedMb');
      expect(res.body).toHaveProperty('providers');
      expect(Array.isArray(res.body.providers)).toBe(true);
    });
  });

  describe('2. Role-Based Access Control (RBAC)', () => {
    it('should reject unauthenticated requests to /api/admin/stats with 401', async () => {
      const res = await request(app).get('/api/admin/stats');
      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject regular non-admin users with 403 Forbidden', async () => {
      const res = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toMatch(/administrator/i);
    });

    it('should allow authorized admin users with 200 OK', async () => {
      const res = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('totalProducts');
      expect(res.body.data).toHaveProperty('totalUsers');
      expect(res.body.data).toHaveProperty('sectorsCount');
    });
  });

  describe('3. Admin Product Management CRUD', () => {
    const testProductSku = `TEST-SKU-${Date.now()}`;
    let createdProductId = null;

    it('should fail creating product with missing required fields (400)', async () => {
      const res = await request(app)
        .post('/api/admin/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Incomplete Device'
          // missing brand, sector, category, description
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should create a new product when payload is valid (201)', async () => {
      const res = await request(app)
        .post('/api/admin/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Quantum Sensor Pro X',
          brand: 'Aryan Dynamics',
          sector: 'Sensors & Transducers',
          category: 'Environmental Sensors',
          description: 'High-precision multi-gas and atmospheric pressure sensor designed for IoT integration.',
          price: 89.99,
          stock: 40,
          SKU: testProductSku,
          isFeatured: false,
          isTrending: false
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      createdProductId = res.body.data.id;
    });

    it('should update the product (200)', async () => {
      const res = await request(app)
        .put(`/api/admin/products/${createdProductId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          price: 99.99,
          stock: 55
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Number(res.body.data.price)).toBe(99.99);
    });

    it('should toggle featured status of the product (200)', async () => {
      const res = await request(app)
        .patch(`/api/admin/products/${createdProductId}/featured`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.isFeatured).toBe(true);
    });

    it('should toggle trending status of the product (200)', async () => {
      const res = await request(app)
        .patch(`/api/admin/products/${createdProductId}/trending`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.isTrending).toBe(true);
    });

    it('should add a seller offer to the product (201)', async () => {
      const res = await request(app)
        .post(`/api/admin/products/${createdProductId}/sellers`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Apex Robotics Hub',
          price: 94.5,
          rating: 4.8,
          inStock: true
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should remove a seller offer from the product (200)', async () => {
      const res = await request(app)
        .delete(`/api/admin/products/${createdProductId}/sellers/Apex%20Robotics%20Hub`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should delete the product (200)', async () => {
      const res = await request(app)
        .delete(`/api/admin/products/${createdProductId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('4. Admin User Management & Safeguards', () => {
    it('should retrieve list of users for administration (200)', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should reject invalid role update (400)', async () => {
      const res = await request(app)
        .patch(`/api/admin/users/${regularUser._id || regularUser.id}/role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'super-god-mode' });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should prevent admin from self-demoting (400)', async () => {
      const adminId = adminUser._id || adminUser.id;
      const res = await request(app)
        .patch(`/api/admin/users/${adminId}/role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'user' });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toMatch(/revoke/i);
    });

    it('should prevent admin from self-deleting (400)', async () => {
      const adminId = adminUser._id || adminUser.id;
      const res = await request(app)
        .delete(`/api/admin/users/${adminId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toMatch(/delete your own/i);
    });
  });

  describe('5. Application Analytics Endpoints', () => {
    it('should allow public client-side event tracking (201)', async () => {
      const res = await request(app)
        .post('/api/analytics/event')
        .send({
          eventType: 'product_view',
          productId: '1',
          productTitle: 'Raspberry Pi 5 8GB',
          sector: 'Development Boards & Microcontrollers',
          category: 'Single Board Computers',
          brand: 'Raspberry Pi'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('should reject analytics overview for unauthenticated users (401)', async () => {
      const res = await request(app).get('/api/analytics/overview');
      expect(res.statusCode).toBe(401);
    });

    it('should reject analytics overview for regular users (403)', async () => {
      const res = await request(app)
        .get('/api/analytics/overview')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toBe(403);
    });

    it('should provide aggregated analytics overview to admin (200)', async () => {
      const res = await request(app)
        .get('/api/analytics/overview?range=30d')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('totalViews');
      expect(res.body.data).toHaveProperty('topProducts');
      expect(res.body.data).toHaveProperty('sectorPopularity');
      expect(res.body.data).toHaveProperty('searchConversionRate');
    });
  });
});
