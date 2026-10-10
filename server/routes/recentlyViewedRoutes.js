const express = require('express');
const router = express.Router();
const {
  getRecentlyViewed,
  recordRecentlyViewed
} = require('../controllers/recentlyViewedController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getRecentlyViewed);
router.post('/:productId', recordRecentlyViewed);

module.exports = router;
