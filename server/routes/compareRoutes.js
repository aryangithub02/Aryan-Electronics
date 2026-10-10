const express = require('express');
const router = express.Router();
const {
  getCompareList,
  addToCompare,
  removeFromCompare,
  clearCompareList
} = require('../controllers/compareController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getCompareList);
router.post('/:productId', addToCompare);
router.delete('/:productId', removeFromCompare);
router.delete('/', clearCompareList);

module.exports = router;
