const request = require('supertest');
const app = require('../app');
const { clearMemoryUsers } = require('../utils/userStore');

describe('Wishlist API Endpoints', () => {
  let token = '';

  beforeEach(async () => {
    clearMemoryUsers();
    const reg = await request(app).post('/api/auth/register').send({
      name: 'Wishlist Tester',
      email: 'wishlist@aryan.com',
      password: 'password123'
    });
    token = reg.body.token;
  });

  it('should reject unauthenticated access with 401', async () => {
    const res = await request(app).get('/api/wishlist');
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should add a product to wishlist', async () => {
    const res = await request(app)
      .post('/api/wishlist/prod-001')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(1);
    expect(res.body.data[0].id).toBe('prod-001');
  });

  it('should prevent duplicate wishlist entries', async () => {
    await request(app)
      .post('/api/wishlist/prod-001')
      .set('Authorization', `Bearer ${token}`);

    const res = await request(app)
      .post('/api/wishlist/prod-001')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBe(1);
    expect(res.body.message).toContain('already in your wishlist');
  });

  it('should get full resolved product objects in wishlist', async () => {
    await request(app)
      .post('/api/wishlist/prod-001')
      .set('Authorization', `Bearer ${token}`);
    await request(app)
      .post('/api/wishlist/prod-002')
      .set('Authorization', `Bearer ${token}`);

    const res = await request(app)
      .get('/api/wishlist')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBe(2);
    expect(res.body.data[0]).toHaveProperty('title');
    expect(res.body.data[0]).toHaveProperty('price');
  });

  it('should remove a product from wishlist', async () => {
    await request(app)
      .post('/api/wishlist/prod-001')
      .set('Authorization', `Bearer ${token}`);

    const res = await request(app)
      .delete('/api/wishlist/prod-001')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBe(0);
  });
});
