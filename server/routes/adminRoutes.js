const express = require('express');
const router = express.Router();
const { protect, requireAdmin } = require('../middleware/auth');
const {
  getAdminStats,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleFeatured,
  toggleTrending,
  addSellerOffer,
  removeSellerOffer,
  addProductSource,
  getTaxonomy,
  getUsers,
  updateUserRole,
  deleteUser
} = require('../controllers/adminController');

// All admin routes require authentication and admin role
router.use(protect);
router.use(requireAdmin);

// Dashboard overview & stats
router.get('/stats', getAdminStats);
router.get('/taxonomy', getTaxonomy);

// Product management
router.get('/products', getAdminProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.patch('/products/:id/featured', toggleFeatured);
router.patch('/products/:id/trending', toggleTrending);

// Seller & source management
router.post('/products/:id/sellers', addSellerOffer);
router.delete('/products/:id/sellers/:sellerName', removeSellerOffer);
router.post('/products/:id/sources', addProductSource);

// User management
router.get('/users', getUsers);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

module.exports = router;
