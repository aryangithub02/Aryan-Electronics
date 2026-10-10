const request = require('supertest');
const app = require('../app');
const { clearMemoryUsers } = require('../utils/userStore');

describe('Saved Products API Endpoints', () => {
  let token = '';

  beforeEach(async () => {
    clearMemoryUsers();
    const reg = await request(app).post('/api/auth/register').send({
      name: 'Saved Tester',
      email: 'saved@aryan.com',
      password: 'password123'
    });
    token = reg.body.token;
  });

  it('should reject unauthenticated requests with 401', async () => {
    const res = await request(app).get('/api/saved-products');
    expect(res.statusCode).toBe(401);
  });

  it('should save a product for later', async () => {
    const res = await request(app)
      .post('/api/saved-products/prod-003')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(1);
    expect(res.body.data[0].id).toBe('prod-003');
  });

  it('should prevent duplicate saved product entries', async () => {
    await request(app)
      .post('/api/saved-products/prod-003')
      .set('Authorization', `Bearer ${token}`);

    const res = await request(app)
      .post('/api/saved-products/prod-003')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBe(1);
  });

  it('should remove a saved product', async () => {
    await request(app)
      .post('/api/saved-products/prod-003')
      .set('Authorization', `Bearer ${token}`);

    const res = await request(app)
      .delete('/api/saved-products/prod-003')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBe(0);
  });
});
