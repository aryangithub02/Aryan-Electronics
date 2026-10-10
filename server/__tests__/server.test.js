const request = require('supertest');
const app = require('../app');

describe('Server Root and Fallback Route Tests', () => {
  it('GET / should return API information and welcome message', async () => {
    const res = await request(app).get('/');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'Aryan Electronics API');
    expect(res.body).toHaveProperty('endpoints');
  });

  it('GET /api/nonexistent-route should return structured 404 error', async () => {
    const res = await request(app).get('/api/nonexistent-route');

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body.error).toHaveProperty('status', 404);
    expect(res.body.error.message).toContain('Endpoint not found');
  });
});
