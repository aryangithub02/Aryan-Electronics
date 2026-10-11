/**
 * Aryan Electronics - OpenAPI 3.0.3 Specification Definition
 */

const openapiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Aryan Electronics API',
    version: '0.5.0',
    description:
      'High-performance REST API for Aryan Electronics - Electronics Product Aggregation & Discovery Platform. Provides access to 688+ electronic products across 8 sectors, real-time multi-provider price aggregation, personalization vectors, telemetry analytics, and admin controls.',
    contact: {
      name: 'Aryan Electronics API Support',
      email: 'support@aryanelectronics.com',
      url: 'https://aryan-electronics.vercel.app'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local Development Environment'
    },
    {
      url: 'https://aryan-electronics.vercel.app',
      description: 'Production Vercel Edge Environment'
    }
  ],
  tags: [
    { name: 'System & Health', description: 'API health checks, system metrics, and service status' },
    { name: 'Products', description: 'Hardware catalog, sector classification, search auto-complete, and recommendation engine' },
    { name: 'Aggregation Engine', description: 'External product feed aggregation, live vendor adapters, and federated search' },
    { name: 'Authentication', description: 'User registration, JWT session issuance, and user profile management' },
    { name: 'Personalization', description: 'User-specific wishlist, saved devices, comparison lists, and browsing history' },
    { name: 'Admin Management', description: 'Telemetry overview, catalog CRUD, taxonomy management, and user governance' },
    { name: 'Analytics', description: 'Platform interaction telemetry, user journey event tracking, and traffic analytics' }
  ],
  paths: {
    // ---------------- SYSTEM & HEALTH ----------------
    '/api/health': {
      get: {
        tags: ['System & Health'],
        summary: 'Check API and Database Health',
        description: 'Returns real-time status of the Express server, MongoDB connection state, process memory usage, and uptime.',
        responses: {
          '200': {
            description: 'System healthy',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/HealthResponse' }
              }
            }
          }
        }
      }
    },
    '/': {
      get: {
        tags: ['System & Health'],
        summary: 'API Discovery Root',
        description: 'Returns API metadata, version info, and full endpoint mapping.',
        responses: {
          '200': {
            description: 'Endpoint map returned successfully'
          }
        }
      }
    },

    // ---------------- PRODUCTS ----------------
    '/api/products': {
      get: {
        tags: ['Products'],
        summary: 'List & Filter Products',
        description: 'Retrieve a paginated, ranked list of electronic devices with multi-facet filtering (sectors, brands, price ranges, rating, stock status).',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 }, description: 'Page number for pagination' },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 12 }, description: 'Items per page (max 100)' },
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Keyword search for title, description, brand, or SKU' },
          { name: 'sector', in: 'query', schema: { type: 'string' }, description: 'Filter by sector (e.g., Home, Education, Industrial, Healthcare, Agriculture, Automotive, Office, Entertainment)' },
          { name: 'category', in: 'query', schema: { type: 'string' }, description: 'Filter by category' },
          { name: 'brand', in: 'query', schema: { type: 'string' }, description: 'Filter by manufacturer/brand name' },
          { name: 'minPrice', in: 'query', schema: { type: 'number' }, description: 'Minimum price threshold in INR' },
          { name: 'maxPrice', in: 'query', schema: { type: 'number' }, description: 'Maximum price threshold in INR' },
          { name: 'minRating', in: 'query', schema: { type: 'number', minimum: 1, maximum: 5 }, description: 'Minimum average rating' },
          { name: 'inStock', in: 'query', schema: { type: 'boolean' }, description: 'Only show in-stock products' },
          { name: 'hasWarranty', in: 'query', schema: { type: 'boolean' }, description: 'Filter products that include manufacturer warranty' },
          { name: 'onSale', in: 'query', schema: { type: 'boolean' }, description: 'Filter products with active discount percentages' },
          { name: 'sortBy', in: 'query', schema: { type: 'string', enum: ['score', 'price', 'rating', 'title', 'createdAt'], default: 'score' }, description: 'Field to sort results by' },
          { name: 'sortOrder', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' }, description: 'Sorting order' }
        ],
        responses: {
          '200': {
            description: 'Paginated product list',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ProductListResponse' }
              }
            }
          }
        }
      }
    },
    '/api/products/sectors': {
      get: {
        tags: ['Products'],
        summary: 'Get Sectors Breakdown',
        description: 'Returns real aggregated counts and representative icons for the 8 core electronics sectors.',
        responses: {
          '200': {
            description: 'Sectors retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/SectorStats' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/products/filter-options': {
      get: {
        tags: ['Products'],
        summary: 'Get Filter Options & Facet Bounds',
        description: 'Returns dynamic min/max prices, available brands, categories, and sectors for search filters.',
        responses: {
          '200': {
            description: 'Dynamic filter bounds',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/FilterOptions' }
              }
            }
          }
        }
      }
    },
    '/api/products/suggestions': {
      get: {
        tags: ['Products'],
        summary: 'Search Auto-completion & Suggestions',
        description: 'Fast prefix search returning matching product titles, brands, and categories for search bars.',
        parameters: [
          { name: 'q', in: 'query', required: true, schema: { type: 'string', example: 'sony' }, description: 'Query search prefix string' }
        ],
        responses: {
          '200': {
            description: 'Matching autocomplete terms and quick product links'
          }
        }
      }
    },
    '/api/products/recommendations/for-you': {
      get: {
        tags: ['Products'],
        summary: 'Personalized "For You" Recommendations',
        description: 'Returns algorithmic recommendation list based on popularity, rating confidence, and sector balance.',
        parameters: [
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 6 }, description: 'Number of recommendations to fetch' }
        ],
        responses: {
          '200': {
            description: 'Personalized product list'
          }
        }
      }
    },
    '/api/products/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Get Product Details by ID',
        description: 'Fetches comprehensive product specifications, seller offers, calculated confidence score, and verified badges.',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', example: '1' }, description: 'Product ID or MongoDB ObjectId' }
        ],
        responses: {
          '200': {
            description: 'Product details retrieved',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Product' }
                  }
                }
              }
            }
          },
          '404': {
            description: 'Product not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/StandardError' }
              }
            }
          }
        }
      }
    },
    '/api/products/{id}/recommendations': {
      get: {
        tags: ['Products'],
        summary: 'Get Similar & Alternative Products',
        description: 'Returns alternative devices within the same sector or brand as the specified product.',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', example: '1' }, description: 'Target product ID' },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 4 }, description: 'Maximum recommendations to return' }
        ],
        responses: {
          '200': {
            description: 'Recommendation recommendations'
          }
        }
      }
    },

    // ---------------- AGGREGATION ENGINE ----------------
    '/api/aggregate/products': {
      get: {
        tags: ['Aggregation Engine'],
        summary: 'Multi-Provider Aggregated Products',
        description: 'Queries aggregated external feeds across third-party hardware provider adapters.',
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search term' },
          { name: 'sector', in: 'query', schema: { type: 'string' }, description: 'Filter by sector' },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 }, description: 'Max items' },
          { name: 'sortBy', in: 'query', schema: { type: 'string', enum: ['price_asc', 'price_desc', 'rating_desc'] } }
        ],
        responses: {
          '200': {
            description: 'Aggregated product listings with provider metadata'
          }
        }
      }
    },
    '/api/aggregate/products/{id}': {
      get: {
        tags: ['Aggregation Engine'],
        summary: 'Get Aggregated Product by ID',
        description: 'Retrieves external provider product metadata and normalized attributes.',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Aggregated product identifier' }
        ],
        responses: {
          '200': { description: 'Aggregated product item' }
        }
      }
    },
    '/api/aggregate/search': {
      get: {
        tags: ['Aggregation Engine'],
        summary: 'Live Federated Provider Search',
        description: 'Runs parallel live search across external integrated marketplace adapters (e.g. DummyJSON, eBay).',
        parameters: [
          { name: 'q', in: 'query', required: true, schema: { type: 'string', example: 'laptop' }, description: 'Search keywords' },
          { name: 'provider', in: 'query', schema: { type: 'string' }, description: 'Optional specific provider adapter name' }
        ],
        responses: {
          '200': { description: 'Federated search results' }
        }
      }
    },
    '/api/aggregate/providers': {
      get: {
        tags: ['Aggregation Engine'],
        summary: 'List Registered Aggregation Providers',
        description: 'Returns health, latency, and status of external provider adapters connected to the aggregation service.',
        responses: {
          '200': { description: 'Provider status array' }
        }
      }
    },
    '/api/aggregate/cache/clear': {
      post: {
        tags: ['Aggregation Engine'],
        summary: 'Clear Aggregation Cache',
        description: 'Flushes cached responses from external provider adapters.',
        responses: {
          '200': { description: 'Cache successfully invalidated' }
        }
      }
    },

    // ---------------- AUTHENTICATION ----------------
    '/api/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Register New User',
        description: 'Creates a new customer or enterprise user account and returns a signed JWT authentication token.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', example: 'Aarav Patel' },
                  email: { type: 'string', format: 'email', example: 'aarav@example.com' },
                  password: { type: 'string', minLength: 6, example: 'SecurePassword123!' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'User registered successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' }
              }
            }
          },
          '400': {
            description: 'Validation failed or email already registered'
          }
        }
      }
    },
    '/api/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'User Login',
        description: 'Authenticates credentials and returns a Bearer JWT token with user profile details.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'demo@aryanelectronics.com' },
                  password: { type: 'string', example: 'DemoPassword123!' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Authentication successful',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' }
              }
            }
          },
          '401': {
            description: 'Invalid credentials provided'
          }
        }
      }
    },
    '/api/auth/logout': {
      post: {
        tags: ['Authentication'],
        summary: 'User Logout',
        description: 'Terminates user session and clears authentication cookies.',
        responses: {
          '200': { description: 'Logged out successfully' }
        }
      }
    },
    '/api/auth/me': {
      get: {
        tags: ['Authentication'],
        summary: 'Get Current Authenticated User',
        description: 'Retrieves profile, role, wishlist count, and preferences for the currently logged-in account.',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'User profile retrieved',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    user: { $ref: '#/components/schemas/User' }
                  }
                }
              }
            }
          },
          '401': { description: 'Not authorized / missing Bearer token' }
        }
      }
    },

    // ---------------- PERSONALIZATION ----------------
    '/api/wishlist': {
      get: {
        tags: ['Personalization'],
        summary: 'Get User Wishlist',
        description: 'Retrieves all items stored in the authenticated user’s wishlist.',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': { description: 'Wishlist product array' },
          '401': { description: 'Unauthorized' }
        }
      }
    },
    '/api/wishlist/{productId}': {
      post: {
        tags: ['Personalization'],
        summary: 'Add Product to Wishlist',
        description: 'Adds target product ID to the user’s wishlist.',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'productId', in: 'path', required: true, schema: { type: 'string', example: '1' } }
        ],
        responses: {
          '200': { description: 'Product added to wishlist' },
          '401': { description: 'Unauthorized' }
        }
      },
      delete: {
        tags: ['Personalization'],
        summary: 'Remove Product from Wishlist',
        description: 'Deletes product ID from user wishlist.',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'productId', in: 'path', required: true, schema: { type: 'string', example: '1' } }
        ],
        responses: {
          '200': { description: 'Product removed from wishlist' }
        }
      }
    },
    '/api/saved-products': {
      get: {
        tags: ['Personalization'],
        summary: 'Get Bookmarked Hardware',
        description: 'Retrieves hardware devices bookmarked by user.',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': { description: 'Saved products array' }
        }
      }
    },
    '/api/saved-products/{productId}': {
      post: {
        tags: ['Personalization'],
        summary: 'Bookmark Product',
        description: 'Saves product to user bookmarked items.',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'productId', in: 'path', required: true, schema: { type: 'string', example: '1' } }
        ],
        responses: {
          '200': { description: 'Product saved' }
        }
      },
      delete: {
        tags: ['Personalization'],
        summary: 'Remove Bookmark',
        description: 'Unsaves product from user bookmarks.',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'productId', in: 'path', required: true, schema: { type: 'string', example: '1' } }
        ],
        responses: {
          '200': { description: 'Product unsaved' }
        }
      }
    },
    '/api/recently-viewed': {
      get: {
        tags: ['Personalization'],
        summary: 'Get Browsing History',
        description: 'Returns products recently inspected by the user, ordered chronologically.',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': { description: 'Recently viewed products list' }
        }
      }
    },
    '/api/recently-viewed/{productId}': {
      post: {
        tags: ['Personalization'],
        summary: 'Log Viewed Product',
        description: 'Appends product ID to user browsing history.',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'productId', in: 'path', required: true, schema: { type: 'string', example: '1' } }
        ],
        responses: {
          '200': { description: 'View history updated' }
        }
      }
    },
    '/api/compare': {
      get: {
        tags: ['Personalization'],
        summary: 'Get Comparison Matrix List',
        description: 'Returns full objects of all devices currently staged for side-by-side comparison.',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': { description: 'List of devices in comparison matrix' }
        }
      },
      delete: {
        tags: ['Personalization'],
        summary: 'Clear Comparison List',
        description: 'Removes all products from the user’s comparison tray.',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': { description: 'Comparison tray emptied' }
        }
      }
    },
    '/api/compare/{productId}': {
      post: {
        tags: ['Personalization'],
        summary: 'Add Product to Compare',
        description: 'Adds product ID into comparison list (max 4 products).',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'productId', in: 'path', required: true, schema: { type: 'string', example: '1' } }
        ],
        responses: {
          '200': { description: 'Product added to comparison' }
        }
      },
      delete: {
        tags: ['Personalization'],
        summary: 'Remove Product from Compare',
        description: 'Removes specific product from comparison tray.',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'productId', in: 'path', required: true, schema: { type: 'string', example: '1' } }
        ],
        responses: {
          '200': { description: 'Product removed from comparison' }
        }
      }
    },

    // ---------------- ADMIN MANAGEMENT ----------------
    '/api/admin/stats': {
      get: {
        tags: ['Admin Management'],
        summary: 'Admin Dashboard Telemetry Overview',
        description: 'Returns top-level metric counters: total products, total users, average rating, sector breakdown, and system mode.',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'Platform metrics',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AdminStats' }
              }
            }
          },
          '403': { description: 'Forbidden - requires admin role' }
        }
      }
    },
    '/api/admin/taxonomy': {
      get: {
        tags: ['Admin Management'],
        summary: 'Get Full Sector & Brand Taxonomy',
        description: 'Returns grouped sectors, sub-categories, and distinct brands.',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': { description: 'Taxonomy object' }
        }
      }
    },
    '/api/admin/products': {
      get: {
        tags: ['Admin Management'],
        summary: 'Admin Product Inventory Management',
        description: 'Returns products with administrative controls, filtering, and seller offer details.',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'sector', in: 'query', schema: { type: 'string' } }
        ],
        responses: {
          '200': { description: 'Admin product listing' }
        }
      },
      post: {
        tags: ['Admin Management'],
        summary: 'Create New Product',
        description: 'Creates a new electronic product in the catalog.',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'sector', 'brand', 'price'],
                properties: {
                  title: { type: 'string', example: 'Smart Industrial Temperature Sensor v2' },
                  sector: { type: 'string', example: 'Industrial' },
                  category: { type: 'string', example: 'Sensors' },
                  brand: { type: 'string', example: 'Bosch Sensortec' },
                  price: { type: 'number', example: 4500 },
                  description: { type: 'string', example: 'High-precision RTD temperature probe with Modbus RTU interface.' },
                  stock: { type: 'integer', example: 120 },
                  thumbnail: { type: 'string', example: '/images/products/industrial_sensor.jpg' },
                  specifications: {
                    type: 'object',
                    example: { 'Operating Voltage': '24V DC', 'Accuracy': '±0.1°C', 'Protocol': 'Modbus RS-488' }
                  }
                }
              }
            }
          }
        },
        responses: {
          '201': { description: 'Product created' }
        }
      }
    },
    '/api/admin/products/{id}': {
      put: {
        tags: ['Admin Management'],
        summary: 'Update Product Details',
        description: 'Updates product specification, pricing, stock, or metadata.',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  price: { type: 'number' },
                  stock: { type: 'integer' },
                  discountPercentage: { type: 'number' },
                  specifications: { type: 'object' }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Product updated successfully' }
        }
      },
      delete: {
        tags: ['Admin Management'],
        summary: 'Delete Product',
        description: 'Removes product from the catalog.',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': { description: 'Product deleted' }
        }
      }
    },
    '/api/admin/products/{id}/featured': {
      patch: {
        tags: ['Admin Management'],
        summary: 'Toggle Featured Status',
        description: 'Toggles product appearance on the home featured carousel.',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': { description: 'Featured status updated' }
        }
      }
    },
    '/api/admin/products/{id}/trending': {
      patch: {
        tags: ['Admin Management'],
        summary: 'Toggle Trending Status',
        description: 'Toggles product appearance in the trending deals showcase.',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': { description: 'Trending status updated' }
        }
      }
    },
    '/api/admin/products/{id}/sellers': {
      post: {
        tags: ['Admin Management'],
        summary: 'Add Seller Offer to Product',
        description: 'Appends a merchant vendor listing and comparative price to a product.',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['sellerName', 'price'],
                properties: {
                  sellerName: { type: 'string', example: 'Robu.in' },
                  price: { type: 'number', example: 4299 },
                  stock: { type: 'integer', example: 45 },
                  rating: { type: 'number', example: 4.8 },
                  url: { type: 'string', example: 'https://robu.in/item' }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Seller offer attached' }
        }
      }
    },
    '/api/admin/products/{id}/sellers/{sellerName}': {
      delete: {
        tags: ['Admin Management'],
        summary: 'Remove Seller Offer',
        description: 'Removes a merchant listing by vendor name.',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'sellerName', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': { description: 'Seller offer removed' }
        }
      }
    },
    '/api/admin/users': {
      get: {
        tags: ['Admin Management'],
        summary: 'List Registered Users',
        description: 'Returns customer and admin accounts directory.',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': { description: 'Users array' }
        }
      }
    },
    '/api/admin/users/{id}/role': {
      patch: {
        tags: ['Admin Management'],
        summary: 'Update User Role',
        description: 'Promotes or demotes user account (e.g., "user" or "admin").',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['role'],
                properties: {
                  role: { type: 'string', enum: ['user', 'admin'], example: 'admin' }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Role modified' }
        }
      }
    },
    '/api/admin/users/{id}': {
      delete: {
        tags: ['Admin Management'],
        summary: 'Delete User Account',
        description: 'Removes account from database.',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': { description: 'User account removed' }
        }
      }
    },

    // ---------------- ANALYTICS ----------------
    '/api/analytics/event': {
      post: {
        tags: ['Analytics'],
        summary: 'Record Telemetry Event',
        description: 'Ingests click, search, product_view, or conversion event for platform analytics.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['eventType'],
                properties: {
                  eventType: { type: 'string', enum: ['view', 'click', 'search', 'add_to_cart', 'compare'], example: 'search' },
                  productId: { type: 'string', example: '1' },
                  metadata: {
                    type: 'object',
                    example: { query: 'raspberry pi 5', sector: 'Education' }
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Event recorded' }
        }
      }
    },
    '/api/analytics/overview': {
      get: {
        tags: ['Analytics'],
        summary: 'Analytics Performance Summary',
        description: 'Returns aggregated event counts, top searches, and popular sectors.',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': { description: 'Analytics telemetry summary' }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token obtained from `/api/auth/login` or use one-click demo credentials in the header.'
      }
    },
    schemas: {
      HealthResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'UP' },
          timestamp: { type: 'string', format: 'date-time' },
          uptime: { type: 'number', example: 3600.42 },
          environment: { type: 'string', example: 'production' },
          mode: { type: 'string', example: 'in-memory-fallback' },
          database: {
            type: 'object',
            properties: {
              status: { type: 'string', example: 'disconnected' },
              name: { type: 'string', example: 'aryan_electronics' }
            }
          },
          memory: {
            type: 'object',
            properties: {
              rss: { type: 'string', example: '45.2 MB' },
              heapTotal: { type: 'string', example: '28.1 MB' },
              heapUsed: { type: 'string', example: '19.4 MB' }
            }
          }
        }
      },
      Product: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '1' },
          title: { type: 'string', example: 'Raspberry Pi 5 (8GB RAM)' },
          brand: { type: 'string', example: 'Raspberry Pi Foundation' },
          sector: { type: 'string', example: 'Education' },
          category: { type: 'string', example: 'Single Board Computers' },
          price: { type: 'number', example: 7999 },
          discountPercentage: { type: 'number', example: 5 },
          rating: { type: 'number', example: 4.9 },
          reviewsCount: { type: 'integer', example: 342 },
          stock: { type: 'integer', example: 54 },
          thumbnail: { type: 'string', example: '/images/products/raspberry_pi_5.jpg' },
          images: {
            type: 'array',
            items: { type: 'string' },
            example: ['/images/products/raspberry_pi_5.jpg']
          },
          description: { type: 'string', example: 'Broadcom BCM2712 quad-core Arm Cortex-A76 processor @ 2.4GHz with PCIe 2.0 interface.' },
          specifications: {
            type: 'object',
            additionalProperties: { type: 'string' },
            example: { 'Processor': 'Broadcom BCM2712 2.4GHz quad-core', 'RAM': '8GB LPDDR4X', 'Video': 'Dual 4Kp60 micro-HDMI' }
          },
          sellerCount: { type: 'integer', example: 3 },
          sellers: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string', example: 'Robu.in' },
                price: { type: 'number', example: 7999 },
                stock: { type: 'integer', example: 20 },
                rating: { type: 'number', example: 4.8 }
              }
            }
          },
          score: { type: 'number', example: 98.4 },
          badges: {
            type: 'array',
            items: { type: 'string' },
            example: ['Best Value', 'Top Rated', 'Verified Hardware']
          }
        }
      },
      ProductListResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          count: { type: 'integer', example: 12 },
          total: { type: 'integer', example: 688 },
          page: { type: 'integer', example: 1 },
          totalPages: { type: 'integer', example: 58 },
          data: {
            type: 'array',
            items: { $ref: '#/components/schemas/Product' }
          }
        }
      },
      SectorStats: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'education' },
          name: { type: 'string', example: 'Education' },
          productCount: { type: 'integer', example: 86 },
          image: { type: 'string', example: '/images/sectors/education.jpg' }
        }
      },
      FilterOptions: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'object',
            properties: {
              sectors: { type: 'array', items: { type: 'string' } },
              categories: { type: 'array', items: { type: 'string' } },
              brands: { type: 'array', items: { type: 'string' } },
              priceRange: {
                type: 'object',
                properties: {
                  min: { type: 'number', example: 149 },
                  max: { type: 'number', example: 299990 }
                }
              }
            }
          }
        }
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'mem-usr-demo-001' },
          name: { type: 'string', example: 'Demo Aryan User' },
          email: { type: 'string', example: 'demo@aryanelectronics.com' },
          role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
          wishlist: { type: 'array', items: { type: 'string' } },
          savedProducts: { type: 'array', items: { type: 'string' } }
        }
      },
      AuthResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          user: { $ref: '#/components/schemas/User' }
        }
      },
      AdminStats: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'object',
            properties: {
              totalProducts: { type: 'integer', example: 688 },
              totalUsers: { type: 'integer', example: 24 },
              totalSectors: { type: 'integer', example: 8 },
              avgRating: { type: 'number', example: 4.62 },
              totalSellers: { type: 'integer', example: 48 }
            }
          }
        }
      },
      StandardError: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              message: { type: 'string', example: 'Resource not found' },
              status: { type: 'integer', example: 404 }
            }
          }
        }
      }
    }
  }
};

module.exports = openapiSpec;
