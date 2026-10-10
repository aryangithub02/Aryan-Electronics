/**
 * Aryan Electronics - API Service Communication Layer
 * Handles public endpoints and authenticated Phase 2 routes
 */

const getApiBaseUrl = () => {
  try {
    if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) {
      return process.env.REACT_APP_API_URL;
    }
  } catch (e) {
    // browser environment
  }
  return '/api';
};

const API_BASE_URL = getApiBaseUrl();

/**
 * Retrieve active JWT token from storage
 */
const getToken = () => {
  try {
    return localStorage.getItem('aryan_auth_token');
  } catch (e) {
    return null;
  }
};

/**
 * Generic fetch wrapper with timeout, token injection, and standardized error handling
 */
const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout || 10000);

  const token = getToken();
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        ...defaultHeaders,
        ...options.headers
      }
    });

    clearTimeout(timeoutId);

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage = data?.error?.message || data?.message || `API Error: ${response.status} ${response.statusText}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      const timeoutError = new Error(`Request timed out while connecting to ${endpoint}`);
      timeoutError.status = 408;
      throw timeoutError;
    }
    throw err;
  }
};

export const api = {
  // --- Public Endpoints ---
  getHealth: async () => {
    return request('/health');
  },

  getProducts: async (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, value);
      }
    });
    const queryString = query.toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
    return request(endpoint);
  },

  getProductById: async (id) => {
    return request(`/products/${encodeURIComponent(id)}`);
  },

  getSectors: async () => {
    return request('/products/sectors');
  },

  // --- Authentication Endpoints (Phase 2) ---
  register: async (userData) => {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  login: async (credentials) => {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  logout: async () => {
    return request('/auth/logout', {
      method: 'POST'
    });
  },

  getMe: async () => {
    return request('/auth/me');
  },

  // --- Wishlist Endpoints (Phase 2) ---
  getWishlist: async () => {
    return request('/wishlist');
  },

  addToWishlist: async (productId) => {
    return request(`/wishlist/${encodeURIComponent(productId)}`, {
      method: 'POST'
    });
  },

  removeFromWishlist: async (productId) => {
    return request(`/wishlist/${encodeURIComponent(productId)}`, {
      method: 'DELETE'
    });
  },

  // --- Saved Products Endpoints (Phase 2) ---
  getSavedProducts: async () => {
    return request('/saved-products');
  },

  addToSavedProducts: async (productId) => {
    return request(`/saved-products/${encodeURIComponent(productId)}`, {
      method: 'POST'
    });
  },

  removeFromSavedProducts: async (productId) => {
    return request(`/saved-products/${encodeURIComponent(productId)}`, {
      method: 'DELETE'
    });
  },

  // --- Recently Viewed Endpoints (Phase 2) ---
  getRecentlyViewed: async () => {
    return request('/recently-viewed');
  },

  recordRecentlyViewed: async (productId) => {
    return request(`/recently-viewed/${encodeURIComponent(productId)}`, {
      method: 'POST'
    });
  },

  // --- Comparison Endpoints (Phase 2) ---
  getCompareList: async () => {
    return request('/compare');
  },

  addToCompare: async (productId) => {
    return request(`/compare/${encodeURIComponent(productId)}`, {
      method: 'POST'
    });
  },

  removeFromCompare: async (productId) => {
    return request(`/compare/${encodeURIComponent(productId)}`, {
      method: 'DELETE'
    });
  },

  clearCompareList: async () => {
    return request('/compare', {
      method: 'DELETE'
    });
  },

  // --- External Aggregation Endpoints (Phase 3) ---
  getAggregatedProducts: async (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, value);
      }
    });
    const queryString = query.toString();
    const endpoint = `/aggregate/products${queryString ? `?${queryString}` : ''}`;
    return request(endpoint);
  },

  getAggregatedProductById: async (id) => {
    return request(`/aggregate/products/${encodeURIComponent(id)}`);
  },

  searchAggregated: async (searchTerm, params = {}) => {
    const query = new URLSearchParams({ q: searchTerm });
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, value);
      }
    });
    return request(`/aggregate/search?${query.toString()}`);
  },

  getAggregationProviders: async () => {
    return request('/aggregate/providers');
  },

  clearAggregationCache: async () => {
    return request('/aggregate/cache/clear', {
      method: 'POST'
    });
  },

  // --- Phase 4 Intelligent Discovery & Recommendations ---
  getFilterOptions: async () => {
    return request('/products/filter-options');
  },

  getSearchSuggestions: async (query) => {
    if (!query || !query.trim()) {
      return { success: true, data: { suggestions: [], categories: [], brands: [], instantProducts: [] } };
    }
    return request(`/products/suggestions?q=${encodeURIComponent(query.trim())}`);
  },

  getProductRecommendations: async (id) => {
    return request(`/products/${encodeURIComponent(id)}/recommendations`);
  },

  getPersonalizedRecommendations: async (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, value);
      }
    });
    const queryString = query.toString();
    return request(`/products/recommendations/for-you${queryString ? `?${queryString}` : ''}`);
  },

  // --- Phase 5 Administration & Analytics ---
  getAdminStats: async () => {
    return request('/admin/stats');
  },

  getAdminTaxonomy: async () => {
    return request('/admin/taxonomy');
  },

  getAdminProducts: async (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, value);
      }
    });
    const queryString = query.toString();
    return request(`/admin/products${queryString ? `?${queryString}` : ''}`);
  },

  createProduct: async (productData) => {
    return request('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  },

  updateProduct: async (id, productData) => {
    return request(`/admin/products/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
  },

  deleteProduct: async (id) => {
    return request(`/admin/products/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  },

  toggleProductFeatured: async (id) => {
    return request(`/admin/products/${encodeURIComponent(id)}/featured`, {
      method: 'PATCH'
    });
  },

  toggleProductTrending: async (id) => {
    return request(`/admin/products/${encodeURIComponent(id)}/trending`, {
      method: 'PATCH'
    });
  },

  addProductSeller: async (id, sellerData) => {
    return request(`/admin/products/${encodeURIComponent(id)}/sellers`, {
      method: 'POST',
      body: JSON.stringify(sellerData)
    });
  },

  deleteProductSeller: async (id, sellerName) => {
    return request(`/admin/products/${encodeURIComponent(id)}/sellers/${encodeURIComponent(sellerName)}`, {
      method: 'DELETE'
    });
  },

  addProductSource: async (id, sourceData) => {
    return request(`/admin/products/${encodeURIComponent(id)}/sources`, {
      method: 'POST',
      body: JSON.stringify(sourceData)
    });
  },

  getAdminUsers: async (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, value);
      }
    });
    const queryString = query.toString();
    return request(`/admin/users${queryString ? `?${queryString}` : ''}`);
  },

  updateUserRole: async (id, role) => {
    return request(`/admin/users/${encodeURIComponent(id)}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role })
    });
  },

  deleteUser: async (id) => {
    return request(`/admin/users/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  },

  getAnalyticsOverview: async (range = '30d') => {
    return request(`/analytics/overview?range=${encodeURIComponent(range)}`);
  },

  trackAnalyticsEvent: async (eventData) => {
    return request('/analytics/event', {
      method: 'POST',
      body: JSON.stringify(eventData)
    });
  }
};

export default api;
