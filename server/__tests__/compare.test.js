const request = require('supertest');
const app = require('../app');
const { clearMemoryUsers } = require('../utils/userStore');

describe('Compare API Endpoints', () => {
  let token = '';

  beforeEach(async () => {
    clearMemoryUsers();
    const reg = await request(app).post('/api/auth/register').send({
      name: 'Compare Tester',
      email: 'compare@aryan.com',
      password: 'password123'
    });
    token = reg.body.token;
  });

  it('should reject unauthenticated requests with 401', async () => {
    const res = await request(app).get('/api/compare');
    expect(res.statusCode).toBe(401);
  });

  it('should add products to comparison list up to 4 items', async () => {
    const res1 = await request(app)
      .post('/api/compare/prod-001')
      .set('Authorization', `Bearer ${token}`);
    expect(res1.statusCode).toBe(200);
    expect(res1.body.count).toBe(1);

    const res2 = await request(app)
      .post('/api/compare/prod-002')
      .set('Authorization', `Bearer ${token}`);
    expect(res2.statusCode).toBe(200);
    expect(res2.body.count).toBe(2);

    const res3 = await request(app)
      .post('/api/compare/prod-003')
      .set('Authorization', `Bearer ${token}`);
    expect(res3.statusCode).toBe(200);
    expect(res3.body.count).toBe(3);

    const res4 = await request(app)
      .post('/api/compare/prod-004')
      .set('Authorization', `Bearer ${token}`);
    expect(res4.statusCode).toBe(200);
    expect(res4.body.count).toBe(4);
  });

  it('should reject adding a 5th product when comparison matrix is full (max 4)', async () => {
    // Fill with 4 items
    await request(app).post('/api/compare/prod-001').set('Authorization', `Bearer ${token}`);
    await request(app).post('/api/compare/prod-002').set('Authorization', `Bearer ${token}`);
    await request(app).post('/api/compare/prod-003').set('Authorization', `Bearer ${token}`);
    await request(app).post('/api/compare/prod-004').set('Authorization', `Bearer ${token}`);

    // Attempt 5th item
    const res5 = await request(app)
      .post('/api/compare/prod-005')
      .set('Authorization', `Bearer ${token}`);

    expect(res5.statusCode).toBe(400);
    expect(res5.body.success).toBe(false);
    expect(res5.body.error.message).toContain('up to 4 products');
  });

  it('should prevent duplicate items in comparison list', async () => {
    await request(app).post('/api/compare/prod-001').set('Authorization', `Bearer ${token}`);
    const res = await request(app)
      .post('/api/compare/prod-001')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBe(1);
    expect(res.body.message).toContain('already in your comparison matrix');
  });

  it('should return 404 when trying to add a non-existent product ID', async () => {
    const res = await request(app)
      .post('/api/compare/non-existent-product-id-999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('should remove a product from comparison matrix', async () => {
    await request(app).post('/api/compare/prod-001').set('Authorization', `Bearer ${token}`);
    await request(app).post('/api/compare/prod-002').set('Authorization', `Bearer ${token}`);

    const res = await request(app)
      .delete('/api/compare/prod-001')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBe(1);
    expect(res.body.data[0].id).toBe('prod-002');
  });

  it('should clear the entire comparison matrix', async () => {
    await request(app).post('/api/compare/prod-001').set('Authorization', `Bearer ${token}`);
    await request(app).post('/api/compare/prod-002').set('Authorization', `Bearer ${token}`);

    const res = await request(app)
      .delete('/api/compare')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBe(0);
    expect(res.body.data).toEqual([]);
  });
});
