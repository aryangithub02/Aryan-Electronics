const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// In-memory user storage for standalone dev/test mode when MongoDB is offline
const memoryUsers = new Map();

// Pre-seeded demo account password hash for 'DemoPassword123!'
const DEMO_PASSWORD_HASH = bcrypt.hashSync('DemoPassword123!', 10);
const ADMIN_PASSWORD_HASH = bcrypt.hashSync('AdminPass123!', 10);

const seedMemoryUsers = () => {
  const demoId = 'mem-usr-demo-001';
  memoryUsers.set(demoId, {
    _id: demoId,
    id: demoId,
    name: 'Demo Aryan User',
    email: 'demo@aryanelectronics.com',
    password: DEMO_PASSWORD_HASH,
    role: 'user',
    wishlist: ['1', '2'],
    savedProducts: ['1'],
    recentlyViewed: [{ productId: '1', viewedAt: new Date() }],
    comparisonList: ['1', '2'],
    createdAt: new Date(),
    updatedAt: new Date(),
    matchPassword: async function (entered) {
      return bcrypt.compare(entered, this.password);
    }
  });

  const adminId = 'mem-usr-admin-001';
  memoryUsers.set(adminId, {
    _id: adminId,
    id: adminId,
    name: 'System Administrator',
    email: 'admin@aryanelectronics.com',
    password: ADMIN_PASSWORD_HASH,
    role: 'admin',
    wishlist: [],
    savedProducts: [],
    recentlyViewed: [],
    comparisonList: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    matchPassword: async function (entered) {
      return bcrypt.compare(entered, this.password);
    }
  });
};

const seedDemoMemoryUser = seedMemoryUsers;

// Seed demo & admin users on initialization
seedMemoryUsers();

const isDbConnected = () => {
  return mongoose.connection.readyState === 1;
};

/**
 * Find user by ID (password excluded by default)
 */
const findUserById = async (id) => {
  if (isDbConnected()) {
    return User.findById(id);
  }
  const user = memoryUsers.get(id);
  if (!user) return null;
  const clone = { ...user };
  delete clone.password;
  return clone;
};

/**
 * Find user by Email (optionally include password for authentication)
 */
const findUserByEmail = async (email, includePassword = false) => {
  const normalizedEmail = (email || '').toLowerCase().trim();

  if (isDbConnected()) {
    const query = User.findOne({ email: normalizedEmail });
    if (includePassword) {
      query.select('+password');
    }
    return query.exec();
  }

  for (const user of memoryUsers.values()) {
    if (user.email === normalizedEmail) {
      const clone = { ...user };
      if (!includePassword) {
        delete clone.password;
      }
      return clone;
    }
  }
  return null;
};

/**
 * Create a new user
 */
const createUser = async ({ name, email, password, role = 'user' }) => {
  const normalizedEmail = (email || '').toLowerCase().trim();

  if (isDbConnected()) {
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role
    });
    return user;
  }

  // Fallback in-memory user creation
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const id = `mem-usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const newUser = {
    _id: id,
    id,
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role,
    wishlist: [],
    savedProducts: [],
    recentlyViewed: [],
    comparisonList: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    matchPassword: async function (entered) {
      return bcrypt.compare(entered, this.password);
    }
  };

  memoryUsers.set(id, newUser);
  const clone = { ...newUser };
  delete clone.password;
  return clone;
};

/**
 * Update user lists (wishlist, savedProducts, recentlyViewed, comparisonList)
 */
const updateUser = async (id, updateData) => {
  if (isDbConnected()) {
    return User.findByIdAndUpdate(id, updateData, { new: true });
  }

  const user = memoryUsers.get(id);
  if (!user) return null;

  Object.assign(user, updateData, { updatedAt: new Date() });
  memoryUsers.set(id, user);

  const clone = { ...user };
  delete clone.password;
  return clone;
};

/**
 * Clear in-memory users (for test teardowns)
 */
const clearMemoryUsers = (reseed = false) => {
  memoryUsers.clear();
  if (reseed) {
    seedDemoMemoryUser();
  }
};

/**
 * Ensure User collection exists and contains demo and admin users in MongoDB
 */
const ensureAtlasUsers = async () => {
  if (!isDbConnected()) return;
  try {
    const existingDemo = await User.findOne({ email: 'demo@aryanelectronics.com' });
    if (!existingDemo) {
      await User.create({
        name: 'Demo Aryan User',
        email: 'demo@aryanelectronics.com',
        password: 'DemoPassword123!',
        role: 'user',
        wishlist: ['1', '2'],
        savedProducts: ['1'],
        recentlyViewed: [{ productId: '1', viewedAt: new Date() }],
        comparisonList: ['1', '2']
      });
      console.log('[Database] Pre-seeded demo user into MongoDB users collection.');
    }

    const existingAdmin = await User.findOne({ email: 'admin@aryanelectronics.com' });
    if (!existingAdmin) {
      await User.create({
        name: 'System Administrator',
        email: 'admin@aryanelectronics.com',
        password: 'AdminPass123!',
        role: 'admin',
        wishlist: [],
        savedProducts: [],
        recentlyViewed: [],
        comparisonList: []
      });
      console.log('[Database] Pre-seeded admin user into MongoDB users collection.');
    }
  } catch (err) {
    console.warn('[Database] Could not pre-seed users in MongoDB:', err.message);
  }
};

/**
 * Get all users for admin management
 */
const getAllUsers = async ({ page = 1, limit = 20 } = {}) => {
  const p = Math.max(1, parseInt(page, 10) || 1);
  const l = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

  if (isDbConnected()) {
    const total = await User.countDocuments();
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((p - 1) * l)
      .limit(l)
      .lean();
    return {
      users,
      total,
      page: p,
      totalPages: Math.ceil(total / l)
    };
  }

  const all = Array.from(memoryUsers.values()).map(u => {
    const clone = { ...u };
    delete clone.password;
    return clone;
  });
  const total = all.length;
  const start = (p - 1) * l;
  const users = all.slice(start, start + l);

  return {
    users,
    total,
    page: p,
    totalPages: Math.ceil(total / l)
  };
};

/**
 * Update user role
 */
const updateUserRole = async (id, newRole) => {
  if (!['user', 'admin'].includes(newRole)) {
    throw new Error('Invalid role specified');
  }

  if (isDbConnected()) {
    return User.findByIdAndUpdate(id, { role: newRole }, { new: true }).select('-password');
  }

  const user = memoryUsers.get(id);
  if (!user) return null;
  user.role = newRole;
  user.updatedAt = new Date();
  const clone = { ...user };
  delete clone.password;
  return clone;
};

/**
 * Delete a user
 */
const deleteUser = async (id) => {
  if (isDbConnected()) {
    return User.findByIdAndDelete(id);
  }

  const deleted = memoryUsers.delete(id);
  return deleted;
};

module.exports = {
  findUserById,
  findUserByEmail,
  createUser,
  updateUser,
  clearMemoryUsers,
  seedDemoMemoryUser,
  ensureAtlasUsers,
  getAllUsers,
  updateUserRole,
  deleteUser
};
