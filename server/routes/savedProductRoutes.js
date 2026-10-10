const express = require('express');
const router = express.Router();
const {
  getSavedProducts,
  addToSavedProducts,
  removeFromSavedProducts
} = require('../controllers/savedProductController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getSavedProducts);
router.post('/:productId', addToSavedProducts);
router.delete('/:productId', removeFromSavedProducts);

module.exports = router;
