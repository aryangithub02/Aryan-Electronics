const { findUserByEmail, createUser } = require('../utils/userStore');
const { generateToken } = require('../utils/jwt');

/**
 * @desc   Register a new user
 * @route  POST /api/auth/register
 * @access Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Please provide all required fields (name, email, password)',
          status: 400
        }
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Please provide a valid email address',
          status: 400
        }
      });
    }

    // Validate password requirements
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Password must be at least 6 characters long',
          status: 400
        }
      });
    }

    // Validate password confirmation if provided
    if (confirmPassword !== undefined && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Passwords do not match',
          status: 400
        }
      });
    }

    // Check duplicate email
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'An account with this email address already exists',
          status: 400
        }
      });
    }

    // Create user
    const user = await createUser({
      name,
      email,
      password
    });

    const token = generateToken(user._id || user.id);

    const userResponse = {
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      wishlist: user.wishlist || [],
      savedProducts: user.savedProducts || [],
      recentlyViewed: user.recentlyViewed || [],
      comparisonList: user.comparisonList || []
    };

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: userResponse,
      data: userResponse
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Authenticate user & return token
 * @route  POST /api/auth/login
 * @access Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Please provide email and password',
          status: 400
        }
      });
    }

    // Find user by email including hashed password
    const user = await findUserByEmail(email, true);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Invalid email or password',
          status: 401
        }
      });
    }

    // Compare password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Invalid email or password',
          status: 401
        }
      });
    }

    const token = generateToken(user._id || user.id);

    const userResponse = {
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      wishlist: user.wishlist || [],
      savedProducts: user.savedProducts || [],
      recentlyViewed: user.recentlyViewed || [],
      comparisonList: user.comparisonList || []
    };

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: userResponse,
      data: userResponse
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Logout current user
 * @route  POST /api/auth/logout
 * @access Public
 */
const logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

/**
 * @desc   Get current logged-in user profile & summary metrics
 * @route  GET /api/auth/me
 * @access Private
 */
const getMe = async (req, res, next) => {
  try {
    const user = req.user;

    const userProfile = {
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      wishlist: user.wishlist || [],
      savedProducts: user.savedProducts || [],
      recentlyViewed: user.recentlyViewed || [],
      comparisonList: user.comparisonList || [],
      createdAt: user.createdAt,
      counts: {
        wishlist: (user.wishlist || []).length,
        saved: (user.savedProducts || []).length,
        recentlyViewed: (user.recentlyViewed || []).length,
        compare: (user.comparisonList || []).length
      }
    };

    res.status(200).json({
      success: true,
      user: userProfile,
      data: userProfile
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe
};
