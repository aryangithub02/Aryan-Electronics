/**
 * Aryan Electronics - API Documentation Routes
 * Serves interactive developer portal at /docs and OpenAPI 3.0 specification.
 */

const express = require('express');
const router = express.Router();
const openapiSpec = require('../docs/openapiSpec');
const { getDocsHtml } = require('../docs/docsHtml');

// Cached HTML representation
let cachedHtml = null;

// GET /docs or /docs/ - Interactive API Documentation
router.get('/', (req, res) => {
  if (!cachedHtml) {
    cachedHtml = getDocsHtml(openapiSpec);
  }
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(cachedHtml);
});

// GET /docs/openapi.json - OpenAPI 3.0.3 JSON Specification
router.get('/openapi.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.status(200).json(openapiSpec);
});

// GET /docs/swagger.json - Alias for Swagger consumers
router.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.status(200).json(openapiSpec);
});

module.exports = router;
