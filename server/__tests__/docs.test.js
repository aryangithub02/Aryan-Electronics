const request = require('supertest');
const app = require('../app');

describe('API Documentation Endpoints (/docs)', () => {
  it('GET /docs returns 200 with HTML documentation portal', async () => {
    const res = await request(app).get('/docs');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\/html/);
    expect(res.text).toContain('Aryan Electronics');
    expect(res.text).toContain('Developer API Documentation');
    expect(res.text).toContain('Interactive Explorer');
    expect(res.text).toContain('Swagger UI');
  });

  it('GET /docs/openapi.json returns 200 with valid OpenAPI 3.0 specification', async () => {
    const res = await request(app).get('/docs/openapi.json');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/json/);
    expect(res.body.openapi).toBe('3.0.3');
    expect(res.body.info.title).toBe('Aryan Electronics API');
    expect(res.body.paths).toHaveProperty('/api/products');
    expect(res.body.paths).toHaveProperty('/api/health');
    expect(res.body.paths).toHaveProperty('/api/auth/login');
    expect(res.body.paths).toHaveProperty('/api/admin/stats');
    expect(res.body.paths).toHaveProperty('/api/aggregate/products');
    expect(res.body.components.securitySchemes).toHaveProperty('BearerAuth');
  });

  it('GET /docs/swagger.json returns 200 alias for OpenAPI spec', async () => {
    const res = await request(app).get('/docs/swagger.json');
    expect(res.statusCode).toBe(200);
    expect(res.body.openapi).toBe('3.0.3');
  });

  it('GET /api/docs returns 200 via secondary mount', async () => {
    const res = await request(app).get('/api/docs');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\/html/);
  });

  it('GET / root endpoint includes docs and openapi references', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.endpoints).toHaveProperty('docs', '/docs');
    expect(res.body.endpoints).toHaveProperty('openapi', '/docs/openapi.json');
  });
});
