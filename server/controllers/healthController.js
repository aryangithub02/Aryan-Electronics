const { getDbStatus } = require('../config/db');
const DummyJsonAdapter = require('../services/aggregation/DummyJsonAdapter');
const EbayAdapter = require('../services/aggregation/EbayAdapter');

/**
 * @desc   Check API server and database health with deep observability
 * @route  GET /api/health
 * @access Public
 */
const getHealth = (req, res) => {
  const dbStatus = getDbStatus();
  const memUsage = process.memoryUsage();

  const providers = [
    {
      name: 'DummyJson',
      type: 'REST',
      status: 'active',
      configured: true
    },
    {
      name: 'eBay Open API',
      type: 'Aggregator',
      status: process.env.EBAY_APP_ID ? 'live' : 'mock-fallback',
      configured: Boolean(process.env.EBAY_APP_ID)
    }
  ];

  res.status(200).json({
    success: true,
    status: 'healthy',
    name: 'Aryan Electronics API',
    version: '0.5.0',
    phase: 'Phase 5 - Production-Ready Platform',
    environment: process.env.NODE_ENV || 'development',
    uptime: Math.round(process.uptime() * 100) / 100,
    timestamp: new Date().toISOString(),
    database: dbStatus,
    providers,
    memory: {
      rssMb: Math.round((memUsage.rss / 1024 / 1024) * 100) / 100,
      heapUsedMb: Math.round((memUsage.heapUsed / 1024 / 1024) * 100) / 100,
      heapTotalMb: Math.round((memUsage.heapTotal / 1024 / 1024) * 100) / 100
    }
  });
};

module.exports = {
  getHealth
};
