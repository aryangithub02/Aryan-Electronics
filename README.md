# Aryan Electronics ⚡

> **Next-Generation Electronics Product Aggregation and Discovery Platform**  
> *Production-Ready Enterprise Platform (Phase 0 — Phase 5 Complete)*

---

## 📖 Platform Overview

**Aryan Electronics** is an enterprise-grade electronics aggregation and discovery engine designed to unify consumer gadgets, computing systems, smart home IoT hardware, development boards, sensors, audio equipment, and industrial automation components into a single, high-fidelity platform.

Users can discover authentic electronics hardware, compare prices and availability across multiple vendors (e.g. Amazon, Best Buy, Adafruit, SparkFun, Newegg), examine deep technical specifications, save items to wishlists, run multi-device comparison matrices, and view intelligent scoring badges and price insights.

Platform administrators have access to an authenticated, role-protected management console (`/admin`) to oversee product catalog lifecycles, taxonomy, seller offers, user accounts, system health, and aggregated usage telemetry.

---

## 🛠️ Technology Stack & Architecture

| Layer | Technology | Key Production Capabilities |
| :--- | :--- | :--- |
| **Frontend UI** | React 18 + Tailwind CSS v3 | Modern dark-slate aesthetic, Lucide Icons, responsive grid layouts, glassmorphism |
| **Routing & Auth** | React Router v6 + JWT Context | Role-Based Access Control (`AdminRoute`, `ProtectedRoute`), guest-to-auth state sync |
| **Bundling & Optimization** | Webpack 5 + Babel | `React.lazy` code splitting, runtime chunking, vendor code separation, compressed assets |
| **Backend API** | Node.js + Express | RESTful API, Helmet security headers, Gzip compression, rate limiting, structured logging |
| **Database & Cache** | MongoDB Atlas / Mongoose | Compound indexes, multi-seller offer models, in-memory aggregation fallback cache |
| **Aggregation Engine** | Adapter Architecture | Pluggable providers (`DummyJsonAdapter`, `EbayAdapter`), deduplication & normalization |
| **Discovery Engine** | Intelligent Ranking | Multi-token search relevance, heuristic discovery scoring, price dispersion analytics |
| **Observability** | Deep Health & Telemetry | `/api/health` system diagnostics, memory metrics, non-PII analytics aggregation |
| **Testing Framework** | Jest + RTL + Supertest | 164 automated unit, integration, RBAC, and UI tests passing at 100% |

---

## 🔐 Credentials & Pre-Seeded Accounts

The application automatically provisions demonstration and administrative accounts both in MongoDB Atlas and in the in-memory fallback store:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@aryanelectronics.com` | `AdminPass123!` | Full Admin Console (`/admin`), Analytics Hub, Catalog CRUD, User Management |
| **Standard User** | `demo@aryanelectronics.com` | `DemoPassword123!` | Discovery, Wishlist, Saved Products, Comparison Matrix, Account Dashboard |

---

## 📁 Repository Directory Structure

```text
Aryan Electronics/
├── .env.example                   # Canonical environment reference template
├── .env.production.example        # Hardened production environment template
├── .gitignore                      # Excludes node_modules, build outputs, environment files
├── package.json                    # Workspace scripts (start, dev, test, build, seed)
├── README.md                       # Platform documentation and deployment guide
├── aryan_electronics_products.json # Verified catalog of 188 real commercial electronics products
│
├── client/                         # Frontend Application (React + Webpack + Tailwind)
│   ├── public/                     # index.html with SEO meta tags & favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/             # AdminRoute, ProtectedRoute, SearchAutocomplete, Pagination, Button
│   │   │   ├── layout/             # Navbar with Admin Shield badge, Footer, Layout wrapper
│   │   │   └── product/            # ProductCard, PriceInsightsCard, ProductRecommendations, ProductGrid
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   └── AdminDashboardPage.jsx # Analytics Hub, Product CRUD, User Mgmt, System Observability
│   │   │   ├── HomePage.jsx        # Hero, featured products, category highlights, discovery badges
│   │   │   ├── ProductsPage.jsx    # Advanced search, faceted filters, sort options, pagination
│   │   │   ├── ProductDetailPage.jsx # Real specs, seller comparison table, budget alternatives
│   │   │   ├── ComparePage.jsx     # Side-by-side spec comparison matrix with fair sector matching
│   │   │   ├── SectorsPage.jsx     # Electronics taxonomy breakdown
│   │   │   ├── AccountPage.jsx     # User profile, browsing history, quick links
│   │   │   ├── WishlistPage.jsx    # User & guest wishlist management
│   │   │   ├── SavedProductsPage.jsx # Saved hardware items
│   │   │   └── LoginPage.jsx / RegisterPage.jsx # Authentication screens
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # JWT management, guest-to-user state synchronization
│   │   ├── services/
│   │   │   └── api.js              # HTTP client with Admin, Analytics, and Aggregation methods
│   │   ├── App.jsx                 # Lazy-loaded routes with React.Suspense
│   │   └── webpack.config.js       # Production vendor splitting & runtime chunk optimization
│   └── __tests__/                  # 9 test suites covering UI, RBAC, Auth, Navbar, Routes
│
└── server/                         # Backend API (Node.js + Express + Mongoose)
    ├── config/
    │   └── db.js                   # MongoDB connection with automatic local fallback
    ├── controllers/
    │   ├── adminController.js      # RBAC-guarded Product CRUD, User Role Mgmt, Taxonomy stats
    │   ├── analyticsController.js  # Non-PII analytics aggregation & event ingestion
    │   ├── productController.js    # Catalog search, regex escaping, scoring & insights
    │   ├── aggregationController.js# External provider endpoints with caching
    │   └── healthController.js     # Deep health & memory diagnostics
    ├── middleware/
    │   ├── auth.js                 # JWT verification & requireAdmin RBAC guard
    │   ├── errorHandler.js         # Production-safe error formatter (no stack traces in prod)
    │   └── notFoundHandler.js      # 404 handler
    ├── models/
    │   ├── Product.js              # Schema with compound indexes, sellers, isFeatured, isTrending
    │   ├── User.js                 # User schema with bcrypt hashing and roles ('user', 'admin')
    │   └── AnalyticsEvent.js       # Event schema with compound indexes for fast aggregation
    ├── services/
    │   ├── analyticsService.js     # Telemetry recorder and aggregation engine
    │   ├── scoringAndInsights.js   # Discovery scoring, badge calculation, price insights
    │   ├── searchService.js        # Multi-token relevance ranker and query normalizer
    │   ├── recommendationService.js# Similar products, budget alternatives, personalized picks
    │   └── aggregation/            # External adapters (DummyJsonAdapter, EbayAdapter, AggregationCache)
    ├── app.js                      # Express configuration with Helmet, compression, rate-limiting
    └── __tests__/                  # 12 test suites covering Phase 0–5 endpoints and security
```

---

## 🚀 Local Development Setup

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v20.x, v22.x, v24.x fully supported)
- **npm**: v9.0.0 or higher
- **MongoDB** (Optional): MongoDB Atlas cluster URI or local `mongod` service (automatic in-memory fallback engages if MongoDB is offline)

### 2. Environment Configuration
Create local `.env` files:
```bash
cp .env.example .env
cp server/.env.example server/.env
```

### 3. Install Dependencies
```bash
npm install
cd client && npm install
cd ../server && npm install
cd ..
```

### 4. Seed Product Catalog
Import the 188 verified real commercial electronics products:
```bash
npm run seed
```

### 5. Launch Development Servers
Run both backend (`http://localhost:5000`) and frontend (`http://localhost:3000`) concurrently:
```bash
npm run dev
```

---

## 🔒 Security Hardening

The application implements defense-in-depth security best practices:

1. **Role-Based Access Control (RBAC)**: All administrative endpoints (`/api/admin/*`, `/api/analytics/overview`) enforce both `protect` (JWT validation) and `requireAdmin` (`role === 'admin'`). Standard users receive HTTP `403 Forbidden`.
2. **Administrative Self-Protection**: Admins cannot demote or delete their own accounts, preventing accidental platform lockout.
3. **HTTP Security Headers (Helmet)**: Strict `X-Content-Type-Options: nosniff`, `X-Frame-Options`, `X-DNS-Prefetch-Control`, and referrer policies applied to all routes.
4. **Rate Limiting**:
   - General API limiter: 500 requests per 15-minute window.
   - Authentication limiter: 30 login/register attempts per 15-minute window to mitigate brute-force attacks.
5. **Request Body Size Limits**: Restricted to `10mb` to protect against denial-of-service memory exhaustion.
6. **NoSQL Query Sanitization**: All regex inputs from search queries and facet filters are escaped against metacharacter injection (`escapeRegex`).
7. **Production Error Masking**: Stack traces and internal environment configurations are suppressed in production mode (`process.env.NODE_ENV === 'production'`).
8. **Credential Protection**: Passwords hashed using `bcrypt` with salt rounds = 10. `select: false` prevents accidental password leakage in queries.

---

## ⚡ Performance Optimizations

1. **MongoDB Compound Indexes**:
   - `{ sector: 1, category: 1 }`
   - `{ category: 1, price: 1 }`
   - `{ brand: 1, rating: -1 }`
   - `{ isFeatured: 1, rating: -1 }`
   - `{ isTrending: 1, rating: -1 }`
   - `{ eventType: 1, createdAt: -1 }` (Analytics)
2. **HTTP Response Compression**: `compression` middleware reduces JSON payload size across all API responses.
3. **Frontend Bundle Splitting**:
   - `React.lazy` and `React.Suspense` split application pages into individual on-demand chunks.
   - Initial entrypoint bundle reduced from **485 KiB** down to **136 KiB**.
   - Vendor dependencies isolated in `vendors.js` (178 KiB) for long-term browser cacheability.
4. **Aggregated Provider Caching**: External responses cached via `AggregationCache` with configurable TTL to avoid rate-limit exhaustion.

---

## 📊 Analytics Telemetry Hub

Accessible at `/admin` (Analytics tab):
- **Date Range Filters**: `24h`, `7d`, `30d`, and `all`.
- **KPI Metrics**: Total Product Impressions, Catalog Search Queries, Multi-Device Comparisons, Wishlist Activity, and Search-to-View Conversion Rate.
- **Top 10 Most-Viewed Products**: Real aggregated view frequencies.
- **Popular Search Terms**: Track customer demand patterns.
- **Sector & Brand Popularity**: Visual breakdown of engagement across electronics categories.
- **Privacy First**: Zero PII collected or stored. Telemetry is purely anonymous aggregated event counters.

---

## 🚢 Production Deployment Guide

### A. MongoDB Atlas Requirements
1. Create a MongoDB Atlas cluster (M0 free tier or M10+ dedicated).
2. Create an Atlas database user with readWrite permissions on `aryan_electronics`.
3. In **Network Access**, whitelist your production server/container IP addresses (or `0.0.0.0/0` if deploying to serverless/PaaS with secure credentials).
4. Copy the connection string to `MONGODB_URI` in `.env.production`.

### B. Backend Deployment (Node.js / Docker / PaaS)
1. Set environment variables from `.env.production.example`.
2. Start the production server:
   ```bash
   NODE_ENV=production PORT=5000 node server/server.js
   ```
3. Verify health endpoint:
   ```bash
   curl -I https://your-backend-domain.com/api/health
   ```

### C. Frontend Deployment (Static Hosting / CDN / Nginx / Vercel / Netlify)
1. Build the optimized production bundle:
   ```bash
   cd client
   REACT_APP_API_URL=https://your-backend-domain.com/api npm run build
   ```
2. Deploy the generated `client/dist/` directory to your static web server or CDN.
3. Configure your server (e.g. Nginx `try_files $uri /index.html;`) to support React Router HTML5 client-side routing.

---

## 🧪 Comprehensive Automated Test Suite

Run the full automated test suite (164 tests):
```bash
# Run all server tests (121 tests across 12 suites)
cd server && npm test

# Run all client tests (43 tests across 9 suites)
cd ../client && npm test
```

### Verified Test Suites Breakdown:
```text
Backend Tests (12 Suites | 121 Tests Passing):
  ✓ __tests__/phase5_production.test.js    (21 tests: RBAC, Admin CRUD, Analytics, Security headers)
  ✓ __tests__/phase4_discovery.test.js     (14 tests: Search relevance, Scoring, Badges, Recommendations)
  ✓ __tests__/auth.test.js                 (11 tests: Registration, Login, Token validation, Profiling)
  ✓ __tests__/product.test.js              (14 tests: Filtering, Sorting, Pagination, Detail)
  ✓ __tests__/realProducts.test.js         (9 tests: 188 dataset validation, images, vendors)
  ✓ __tests__/compare.test.js              (9 tests: Comparison list, add/remove, limits)
  ✓ __tests__/wishlist.test.js             (9 tests: Wishlist persistence, toggling)
  ✓ __tests__/savedProducts.test.js        (9 tests: Saved hardware items)
  ✓ __tests__/recentlyViewed.test.js       (9 tests: History logging, duplicates, limits)
  ✓ __tests__/health.test.js               (1 test: System diagnostics, memory, status)
  ✓ __tests__/server.test.js               (4 tests: Root endpoint, 404 handling)

Frontend Tests (9 Suites | 43 Tests Passing):
  ✓ __tests__/AdminPhase5.test.jsx         (6 tests: AdminRoute RBAC, Navbar admin badge, Dashboard tabs)
  ✓ __tests__/Auth.test.jsx                (6 tests: Login & Register UI flows, validations)
  ✓ __tests__/Personalization.test.jsx     (5 tests: Wishlist, Saved, History pages)
  ✓ __tests__/Compare.test.jsx             (4 tests: Comparison table, removal, limits)
  ✓ __tests__/RealProductsIntegration.test.jsx (5 tests: Real images, authentic prices, links)
  ✓ __tests__/Navbar.test.jsx              (2 tests: Brand logo, links, dynamic badges)
  ✓ __tests__/Routes.test.jsx              (6 tests: Page navigation, 404 fallback)
  ✓ __tests__/App.test.jsx                 (3 tests: App rendering, layout shell)
  ✓ __tests__/utils.test.js                (6 tests: Formatters and input validators)
```

---

## 🏆 Phase 5 Completion Status

- [x] **Pre-Phase Verification**: All previous phases (0–4) verified stable.
- [x] **Admin Dashboard**: RBAC protected `/admin` console with Product CRUD, Sector/Category/Brand taxonomy, and User Management.
- [x] **Analytics Dashboard**: Aggregated metrics for views, searches, comparisons, wishlist activity, and conversion with date-range filters.
- [x] **Security Hardening**: Helmet security headers, rate limiters, request body limits, NoSQL injection escaping, error sanitization.
- [x] **Performance Optimization**: Compound MongoDB indexes, gzip compression, Webpack vendor splitting, React.lazy code splitting (entrypoint bundle reduced to 136 KiB).
- [x] **Observability**: Deep `/api/health` diagnostics with uptime, memory usage, database state, and provider availability.
- [x] **Production Configuration**: `.env.example`, `.env.production.example`, and deployment guides.
- [x] **Comprehensive Testing**: 164 total tests passing cleanly across server and client.
- [x] **Production Build**: Webpack production build verified functional and optimized.
