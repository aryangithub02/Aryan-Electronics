const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const healthRoutes = require('./routes/healthRoutes');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const savedProductRoutes = require('./routes/savedProductRoutes');
const recentlyViewedRoutes = require('./routes/recentlyViewedRoutes');
const compareRoutes = require('./routes/compareRoutes');
const aggregationRoutes = require('./routes/aggregationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const errorHandler = require('./middleware/errorHandler');
const notFoundHandler = require('./middleware/notFoundHandler');

const app = express();

// Security Headers (Helmet)
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows cross-origin image resources and frontend scripts
    crossOriginEmbedderPolicy: false
  })
);

// Compression Middleware for optimized network throughput
app.use(compression());

// Cross-Origin Resource Sharing
const allowedOrigins = process.env.CLIENT_URL
  ? [process.env.CLIENT_URL, 'http://localhost:3000', 'http://127.0.0.1:3000']
  : '*';

app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);

// Request body limits to prevent payload exhaustion attacks
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiting (bypassed in test environment)
const isTestEnv = process.env.NODE_ENV === 'test';

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isTestEnv ? 10000 : 500, // 500 requests per 15 min window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: 'Too many requests from this IP address. Please try again later.',
      status: 429
    }
  },
  skip: () => isTestEnv
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isTestEnv ? 10000 : 30, // 30 auth attempts per 15 min window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: 'Too many authentication attempts. Please try again after 15 minutes.',
      status: 429
    }
  },
  skip: () => isTestEnv
});

app.use('/api', generalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// HTTP Request logging (suppressed during tests)
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// API Root Index
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'Aryan Electronics API',
    tagline: 'Electronics Product Aggregation and Discovery Platform',
    version: '0.5.0',
    phase: 'Phase 5 - Production-Ready Platform',
    status: 'online',
    endpoints: {
      health: '/api/health',
      products: '/api/products',
      sectors: '/api/products/sectors',
      aggregate: {
        products: '/api/aggregate/products',
        search: '/api/aggregate/search',
        providers: '/api/aggregate/providers'
      },
      auth: {
        register: '/api/auth/register',
        login: '/api/auth/login',
        logout: '/api/auth/logout',
        me: '/api/auth/me'
      },
      admin: {
        stats: '/api/admin/stats',
        taxonomy: '/api/admin/taxonomy',
        products: '/api/admin/products',
        users: '/api/admin/users'
      },
      analytics: {
        overview: '/api/analytics/overview',
        event: '/api/analytics/event'
      },
      wishlist: '/api/wishlist',
      savedProducts: '/api/saved-products',
      recentlyViewed: '/api/recently-viewed',
      compare: '/api/compare'
    }
  });
});

// Mount Routes
app.use('/api/health', healthRoutes);
app.use('/api/products', productRoutes);
app.use('/api/aggregate', aggregationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/saved-products', savedProductRoutes);
app.use('/api/recently-viewed', recentlyViewedRoutes);
app.use('/api/compare', compareRoutes);

// 404 Not Found Handling
app.use(notFoundHandler);

// Global Error Handling
app.use(errorHandler);

module.exports = app;
