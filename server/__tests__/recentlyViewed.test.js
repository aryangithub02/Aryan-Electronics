const request = require('supertest');
const app = require('../app');
const { clearMemoryUsers } = require('../utils/userStore');

describe('Recently Viewed API Endpoints', () => {
  let token = '';

  beforeEach(async () => {
    clearMemoryUsers();
    const reg = await request(app).post('/api/auth/register').send({
      name: 'Recent Tester',
      email: 'recent@aryan.com',
      password: 'password123'
    });
    token = reg.body.token;
  });

  it('should reject unauthenticated requests with 401', async () => {
    const res = await request(app).get('/api/recently-viewed');
    expect(res.statusCode).toBe(401);
  });

  it('should record a viewed product and put it first', async () => {
    await request(app)
      .post('/api/recently-viewed/prod-001')
      .set('Authorization', `Bearer ${token}`);

    const res = await request(app)
      .post('/api/recently-viewed/prod-002')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBe(2);
    // Most recent prod-002 should be at index 0
    expect(res.body.data[0].id).toBe('prod-002');
    expect(res.body.data[1].id).toBe('prod-001');
  });

  it('should move an existing product to the front when re-viewed without creating duplicates', async () => {
    await request(app)
      .post('/api/recently-viewed/prod-001')
      .set('Authorization', `Bearer ${token}`);
    await request(app)
      .post('/api/recently-viewed/prod-002')
      .set('Authorization', `Bearer ${token}`);

    // Re-view prod-001
    const res = await request(app)
      .post('/api/recently-viewed/prod-001')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBe(2);
    expect(res.body.data[0].id).toBe('prod-001');
    expect(res.body.data[1].id).toBe('prod-002');
  });
});
