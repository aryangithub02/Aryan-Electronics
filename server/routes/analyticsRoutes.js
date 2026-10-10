const express = require('express');
const router = express.Router();
const { protect, requireAdmin } = require('../middleware/auth');
const { getOverview, trackEvent } = require('../controllers/analyticsController');

// Public event tracking endpoint
router.post('/event', trackEvent);

// Admin-only analytics overview endpoint
router.get('/overview', protect, requireAdmin, getOverview);

module.exports = router;
