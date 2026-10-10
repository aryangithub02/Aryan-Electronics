const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
const sampleProducts = require('../data/sampleProducts');
const { getAllUsers, updateUserRole: updateRoleInStore, deleteUser: deleteUserInStore } = require('../utils/userStore');

const isDbConnected = () => {
  return mongoose.connection && mongoose.connection.readyState === 1;
};

/**
 * @desc    Get administrative dashboard statistics
 * @route   GET /api/admin/stats
 * @access  Private (Admin)
 */
const getAdminStats = async (req, res) => {
  try {
    let totalProducts = 0;
    let totalFeatured = 0;
    let totalTrending = 0;
    let totalUsers = 0;
    let sectorsCount = 0;
    let categoriesCount = 0;
    let brandsCount = 0;

    if (isDbConnected()) {
      totalProducts = await Product.countDocuments();
      totalFeatured = await Product.countDocuments({ isFeatured: true });
      totalTrending = await Product.countDocuments({ isTrending: true });
      totalUsers = await User.countDocuments();

      const [sectors, categories, brands] = await Promise.all([
        Product.distinct('sector'),
        Product.distinct('category'),
        Product.distinct('brand')
      ]);

      sectorsCount = sectors.length;
      categoriesCount = categories.length;
      brandsCount = brands.length;
    } else {
      totalProducts = sampleProducts.length;
      totalFeatured = sampleProducts.filter((p) => p.isFeatured).length;
      totalTrending = sampleProducts.filter((p) => p.isTrending).length;
      const userRes = await getAllUsers();
      totalUsers = userRes.total || 0;

      const sectors = new Set(sampleProducts.map((p) => p.sector).filter(Boolean));
      const categories = new Set(sampleProducts.map((p) => p.category).filter(Boolean));
      const brands = new Set(sampleProducts.map((p) => p.brand).filter(Boolean));

      sectorsCount = sectors.size;
      categoriesCount = categories.size;
      brandsCount = brands.size;
    }

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalFeatured,
        totalTrending,
        totalUsers,
        sectorsCount,
        categoriesCount,
        brandsCount,
        databaseConnected: isDbConnected(),
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to retrieve administrative statistics' }
    });
  }
};

/**
 * @desc    Get paginated products for admin management
 * @route   GET /api/admin/products
 * @access  Private (Admin)
 */
const getAdminProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      sector,
      category,
      brand,
      isFeatured,
      isTrending
    } = req.query;

    const p = Math.max(1, parseInt(page, 10) || 1);
    const l = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

    if (isDbConnected()) {
      const filter = {};
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { SKU: { $regex: search, $options: 'i' } },
          { brand: { $regex: search, $options: 'i' } }
        ];
      }
      if (sector) filter.sector = new RegExp(`^${sector}$`, 'i');
      if (category) filter.category = new RegExp(`^${category}$`, 'i');
      if (brand) filter.brand = new RegExp(`^${brand}$`, 'i');
      if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true' || isFeatured === true;
      if (isTrending !== undefined) filter.isTrending = isTrending === 'true' || isTrending === true;

      const total = await Product.countDocuments(filter);
      const products = await Product.find(filter)
        .sort({ updatedAt: -1, createdAt: -1 })
        .skip((p - 1) * l)
        .limit(l)
        .lean();

      return res.status(200).json({
        success: true,
        data: products,
        pagination: {
          total,
          page: p,
          limit: l,
          totalPages: Math.ceil(total / l)
        }
      });
    }

    // In-Memory fallback filtering
    let results = [...sampleProducts];
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (prod) =>
          (prod.title || '').toLowerCase().includes(q) ||
          (prod.SKU || '').toLowerCase().includes(q) ||
          (prod.brand || '').toLowerCase().includes(q)
      );
    }
    if (sector) {
      results = results.filter((prod) => (prod.sector || '').toLowerCase() === sector.toLowerCase());
    }
    if (category) {
      results = results.filter((prod) => (prod.category || '').toLowerCase() === category.toLowerCase());
    }
    if (brand) {
      results = results.filter((prod) => (prod.brand || '').toLowerCase() === brand.toLowerCase());
    }
    if (isFeatured !== undefined) {
      const wantFeatured = isFeatured === 'true' || isFeatured === true;
      results = results.filter((prod) => Boolean(prod.isFeatured) === wantFeatured);
    }
    if (isTrending !== undefined) {
      const wantTrending = isTrending === 'true' || isTrending === true;
      results = results.filter((prod) => Boolean(prod.isTrending) === wantTrending);
    }

    const total = results.length;
    const start = (p - 1) * l;
    const paged = results.slice(start, start + l);

    res.status(200).json({
      success: true,
      data: paged,
      pagination: {
        total,
        page: p,
        limit: l,
        totalPages: Math.ceil(total / l)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to retrieve products' }
    });
  }
};

/**
 * @desc    Create a new product
 * @route   POST /api/admin/products
 * @access  Private (Admin)
 */
const createProduct = async (req, res) => {
  try {
    const {
      title,
      brand,
      sector,
      category,
      description,
      price,
      discountPercentage = 0,
      rating = 4.5,
      stock = 50,
      SKU,
      thumbnail,
      images = [],
      specifications = [],
      features = [],
      useCases = [],
      sellers = [],
      sources = [],
      isFeatured = false,
      isTrending = false
    } = req.body;

    // Validation
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, error: { message: 'Product title is required' } });
    }
    if (!brand || !brand.trim()) {
      return res.status(400).json({ success: false, error: { message: 'Brand is required' } });
    }
    if (!sector || !sector.trim()) {
      return res.status(400).json({ success: false, error: { message: 'Sector is required' } });
    }
    if (!category || !category.trim()) {
      return res.status(400).json({ success: false, error: { message: 'Category is required' } });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ success: false, error: { message: 'Description is required' } });
    }

    const generatedId = `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const finalSKU = SKU && SKU.trim() ? SKU.trim() : `SKU-${Date.now()}`;
    const parsedPrice = price !== undefined && price !== null ? parseFloat(price) : null;

    const newProductData = {
      id: req.body.id || generatedId,
      title: title.trim(),
      brand: brand.trim(),
      sector: sector.trim(),
      category: category.trim(),
      description: description.trim(),
      price: parsedPrice,
      discountPercentage: Number(discountPercentage) || 0,
      rating: Math.min(5, Math.max(0, Number(rating) || 4.5)),
      stock: stock !== null && stock !== undefined ? Number(stock) : 50,
      SKU: finalSKU,
      sku: finalSKU,
      thumbnail: thumbnail || (images.length > 0 ? images[0] : ''),
      images: Array.isArray(images) ? images : [],
      specifications: Array.isArray(specifications) ? specifications : [],
      features: Array.isArray(features) ? features : [],
      useCases: Array.isArray(useCases) ? useCases : [],
      sellers: Array.isArray(sellers) ? sellers : [],
      sources: Array.isArray(sources) ? sources : [],
      isFeatured: Boolean(isFeatured),
      isTrending: Boolean(isTrending)
    };

    if (isDbConnected()) {
      // Check for SKU conflict
      const existing = await Product.findOne({ SKU: finalSKU });
      if (existing) {
        return res.status(400).json({
          success: false,
          error: { message: `A product with SKU "${finalSKU}" already exists` }
        });
      }

      const created = await Product.create(newProductData);
      return res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: created
      });
    }

    // In-Memory store insertion
    sampleProducts.unshift(newProductData);

    res.status(201).json({
      success: true,
      message: 'Product created successfully (in-memory mode)',
      data: newProductData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to create product' }
    });
  }
};

/**
 * @desc    Update an existing product
 * @route   PUT /api/admin/products/:id
 * @access  Private (Admin)
 */
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData._id; // Never overwrite MongoDB _id

    if (updateData.price !== undefined && updateData.price !== null) {
      updateData.price = parseFloat(updateData.price);
    }
    if (updateData.discountPercentage !== undefined) {
      updateData.discountPercentage = Number(updateData.discountPercentage);
    }
    if (updateData.rating !== undefined) {
      updateData.rating = Number(updateData.rating);
    }
    if (updateData.stock !== undefined && updateData.stock !== null) {
      updateData.stock = Number(updateData.stock);
    }

    if (isDbConnected()) {
      const updated = await Product.findOneAndUpdate(
        { $or: [{ id }, { _id: mongoose.isValidObjectId(id) ? id : null }] },
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!updated) {
        return res.status(404).json({
          success: false,
          error: { message: `Product with ID "${id}" not found` }
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: updated
      });
    }

    // In-Memory update
    const index = sampleProducts.findIndex((p) => p.id === id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: { message: `Product with ID "${id}" not found` }
      });
    }

    sampleProducts[index] = { ...sampleProducts[index], ...updateData };

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: sampleProducts[index]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to update product' }
    });
  }
};

/**
 * @desc    Delete a product (requires confirmation)
 * @route   DELETE /api/admin/products/:id
 * @access  Private (Admin)
 */
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const deleted = await Product.findOneAndDelete({
        $or: [{ id }, { _id: mongoose.isValidObjectId(id) ? id : null }]
      });

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: { message: `Product with ID "${id}" not found` }
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Product deleted successfully',
        data: { id }
      });
    }

    // In-Memory deletion
    const index = sampleProducts.findIndex((p) => p.id === id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: { message: `Product with ID "${id}" not found` }
      });
    }

    const removed = sampleProducts.splice(index, 1)[0];

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: { id: removed.id }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to delete product' }
    });
  }
};

/**
 * @desc    Toggle Featured status
 * @route   PATCH /api/admin/products/:id/featured
 * @access  Private (Admin)
 */
const toggleFeatured = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const prod = await Product.findOne({
        $or: [{ id }, { _id: mongoose.isValidObjectId(id) ? id : null }]
      });
      if (!prod) {
        return res.status(404).json({ success: false, error: { message: 'Product not found' } });
      }

      prod.isFeatured = !prod.isFeatured;
      await prod.save();

      return res.status(200).json({
        success: true,
        message: `Product featured status updated to ${prod.isFeatured}`,
        data: { id: prod.id, isFeatured: prod.isFeatured }
      });
    }

    const prod = sampleProducts.find((p) => p.id === id);
    if (!prod) {
      return res.status(404).json({ success: false, error: { message: 'Product not found' } });
    }

    prod.isFeatured = !prod.isFeatured;
    res.status(200).json({
      success: true,
      message: `Product featured status updated to ${prod.isFeatured}`,
      data: { id: prod.id, isFeatured: prod.isFeatured }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to toggle featured status' }
    });
  }
};

/**
 * @desc    Toggle Trending status
 * @route   PATCH /api/admin/products/:id/trending
 * @access  Private (Admin)
 */
const toggleTrending = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const prod = await Product.findOne({
        $or: [{ id }, { _id: mongoose.isValidObjectId(id) ? id : null }]
      });
      if (!prod) {
        return res.status(404).json({ success: false, error: { message: 'Product not found' } });
      }

      prod.isTrending = !prod.isTrending;
      await prod.save();

      return res.status(200).json({
        success: true,
        message: `Product trending status updated to ${prod.isTrending}`,
        data: { id: prod.id, isTrending: prod.isTrending }
      });
    }

    const prod = sampleProducts.find((p) => p.id === id);
    if (!prod) {
      return res.status(404).json({ success: false, error: { message: 'Product not found' } });
    }

    prod.isTrending = !prod.isTrending;
    res.status(200).json({
      success: true,
      message: `Product trending status updated to ${prod.isTrending}`,
      data: { id: prod.id, isTrending: prod.isTrending }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to toggle trending status' }
    });
  }
};

/**
 * @desc    Add a seller offer to a product
 * @route   POST /api/admin/products/:id/sellers
 * @access  Private (Admin)
 */
const addSellerOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, rating = 4.5, availability, inStock = true, url = '#' } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: { message: 'Seller name is required' } });
    }

    const sellerOffer = {
      name: name.trim(),
      price: price !== undefined && price !== null ? parseFloat(price) : null,
      rating: Number(rating) || 4.5,
      availability: availability || (inStock ? 'In Stock' : 'Out of Stock'),
      inStock: Boolean(inStock),
      url: url.trim()
    };

    if (isDbConnected()) {
      const prod = await Product.findOne({
        $or: [{ id }, { _id: mongoose.isValidObjectId(id) ? id : null }]
      });
      if (!prod) {
        return res.status(404).json({ success: false, error: { message: 'Product not found' } });
      }

      prod.sellers.push(sellerOffer);
      await prod.save();

      return res.status(201).json({
        success: true,
        message: 'Seller offer added successfully',
        data: prod.sellers
      });
    }

    const prod = sampleProducts.find((p) => p.id === id);
    if (!prod) {
      return res.status(404).json({ success: false, error: { message: 'Product not found' } });
    }

    if (!prod.sellers) prod.sellers = [];
    prod.sellers.push(sellerOffer);

    res.status(201).json({
      success: true,
      message: 'Seller offer added successfully',
      data: prod.sellers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to add seller offer' }
    });
  }
};

/**
 * @desc    Remove a seller offer from a product
 * @route   DELETE /api/admin/products/:id/sellers/:sellerName
 * @access  Private (Admin)
 */
const removeSellerOffer = async (req, res) => {
  try {
    const { id, sellerName } = req.params;

    if (isDbConnected()) {
      const prod = await Product.findOne({
        $or: [{ id }, { _id: mongoose.isValidObjectId(id) ? id : null }]
      });
      if (!prod) {
        return res.status(404).json({ success: false, error: { message: 'Product not found' } });
      }

      prod.sellers = prod.sellers.filter(
        (s) => s.name.toLowerCase() !== decodeURIComponent(sellerName).toLowerCase()
      );
      await prod.save();

      return res.status(200).json({
        success: true,
        message: 'Seller offer removed successfully',
        data: prod.sellers
      });
    }

    const prod = sampleProducts.find((p) => p.id === id);
    if (!prod) {
      return res.status(404).json({ success: false, error: { message: 'Product not found' } });
    }

    if (prod.sellers) {
      prod.sellers = prod.sellers.filter(
        (s) => s.name.toLowerCase() !== decodeURIComponent(sellerName).toLowerCase()
      );
    }

    res.status(200).json({
      success: true,
      message: 'Seller offer removed successfully',
      data: prod.sellers || []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to remove seller offer' }
    });
  }
};

/**
 * @desc    Add a product source reference
 * @route   POST /api/admin/products/:id/sources
 * @access  Private (Admin)
 */
const addProductSource = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, url } = req.body;

    if (!type || !type.trim() || !url || !url.trim()) {
      return res.status(400).json({
        success: false,
        error: { message: 'Source type and URL are both required' }
      });
    }

    const sourceData = { type: type.trim(), url: url.trim() };

    if (isDbConnected()) {
      const prod = await Product.findOne({
        $or: [{ id }, { _id: mongoose.isValidObjectId(id) ? id : null }]
      });
      if (!prod) {
        return res.status(404).json({ success: false, error: { message: 'Product not found' } });
      }

      prod.sources.push(sourceData);
      await prod.save();

      return res.status(201).json({
        success: true,
        message: 'Product source added successfully',
        data: prod.sources
      });
    }

    const prod = sampleProducts.find((p) => p.id === id);
    if (!prod) {
      return res.status(404).json({ success: false, error: { message: 'Product not found' } });
    }

    if (!prod.sources) prod.sources = [];
    prod.sources.push(sourceData);

    res.status(201).json({
      success: true,
      message: 'Product source added successfully',
      data: prod.sources
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to add source' }
    });
  }
};

/**
 * @desc    Get taxonomy breakdown (sectors, categories, brands)
 * @route   GET /api/admin/taxonomy
 * @access  Private (Admin)
 */
const getTaxonomy = async (req, res) => {
  try {
    if (isDbConnected()) {
      const [sectors, categories, brands] = await Promise.all([
        Product.aggregate([
          { $group: { _id: '$sector', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]),
        Product.aggregate([
          { $group: { _id: '$category', sector: { $first: '$sector' }, count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]),
        Product.aggregate([
          { $group: { _id: '$brand', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ])
      ]);

      return res.status(200).json({
        success: true,
        data: {
          sectors: sectors.map((s) => ({ name: s._id, count: s.count })),
          categories: categories.map((c) => ({ name: c._id, sector: c.sector, count: c.count })),
          brands: brands.map((b) => ({ name: b._id, count: b.count }))
        }
      });
    }

    // In-Memory taxonomy
    const sectorMap = {};
    const categoryMap = {};
    const brandMap = {};

    sampleProducts.forEach((p) => {
      if (p.sector) sectorMap[p.sector] = (sectorMap[p.sector] || 0) + 1;
      if (p.category) {
        if (!categoryMap[p.category]) categoryMap[p.category] = { count: 0, sector: p.sector };
        categoryMap[p.category].count++;
      }
      if (p.brand) brandMap[p.brand] = (brandMap[p.brand] || 0) + 1;
    });

    res.status(200).json({
      success: true,
      data: {
        sectors: Object.entries(sectorMap).map(([name, count]) => ({ name, count })),
        categories: Object.entries(categoryMap).map(([name, data]) => ({
          name,
          sector: data.sector,
          count: data.count
        })),
        brands: Object.entries(brandMap).map(([name, count]) => ({ name, count }))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to retrieve taxonomy' }
    });
  }
};

/**
 * @desc    Get all users for management
 * @route   GET /api/admin/users
 * @access  Private (Admin)
 */
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const result = await getAllUsers({ page, limit });

    res.status(200).json({
      success: true,
      data: result.users,
      pagination: {
        total: result.total,
        page: result.page,
        totalPages: result.totalPages
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to retrieve users' }
    });
  }
};

/**
 * @desc    Update a user role (admin cannot demote self)
 * @route   PATCH /api/admin/users/:id/role
 * @access  Private (Admin)
 */
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid role specified. Must be "user" or "admin".' }
      });
    }

    // Protect against self-demotion
    if ((req.user.id === id || req.user._id?.toString() === id) && role !== 'admin') {
      return res.status(400).json({
        success: false,
        error: { message: 'You cannot revoke your own administrator privileges.' }
      });
    }

    const updated = await updateRoleInStore(id, role);
    if (!updated) {
      return res.status(404).json({
        success: false,
        error: { message: `User with ID "${id}" not found` }
      });
    }

    res.status(200).json({
      success: true,
      message: `User role successfully updated to ${role}`,
      data: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to update user role' }
    });
  }
};

/**
 * @desc    Delete a user (admin cannot delete self)
 * @route   DELETE /api/admin/users/:id
 * @access  Private (Admin)
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Protect against self-deletion
    if (req.user.id === id || req.user._id?.toString() === id) {
      return res.status(400).json({
        success: false,
        error: { message: 'You cannot delete your own active administrator account.' }
      });
    }

    const result = await deleteUserInStore(id);
    if (!result) {
      return res.status(404).json({
        success: false,
        error: { message: `User with ID "${id}" not found` }
      });
    }

    res.status(200).json({
      success: true,
      message: 'User successfully deleted',
      data: { id }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to delete user' }
    });
  }
};

module.exports = {
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
};
