import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import Spinner from '../../components/common/Spinner';

export const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('analytics'); // analytics, products, users, taxonomy, system

  // Stats & System state
  const [stats, setStats] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Analytics state
  const [timeRange, setTimeRange] = useState('30d');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // Product management state
  const [products, setProducts] = useState([]);
  const [productPagination, setProductPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [productSearch, setProductSearch] = useState('');
  const [productSectorFilter, setProductSectorFilter] = useState('');
  const [productsLoading, setProductsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // User management state
  const [users, setUsers] = useState([]);
  const [userPagination, setUserPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [usersLoading, setUsersLoading] = useState(false);
  const [userActionConfirm, setUserActionConfirm] = useState(null);

  // Taxonomy state
  const [taxonomy, setTaxonomy] = useState({ sectors: [], categories: [], brands: [] });
  const [taxonomyLoading, setTaxonomyLoading] = useState(false);

  // Form state for Create / Edit Product
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    sector: '',
    category: '',
    description: '',
    price: '',
    discountPercentage: 0,
    stock: 50,
    SKU: '',
    thumbnail: '',
    imagesText: '',
    isFeatured: false,
    isTrending: false
  });

  // Seller offer form
  const [sellerForm, setSellerForm] = useState({
    name: '',
    price: '',
    rating: 4.5,
    inStock: true,
    url: '#'
  });

  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Fetch overview stats & system health
  const loadPlatformOverview = useCallback(async () => {
    try {
      setStatsLoading(true);
      const [statsRes, healthRes] = await Promise.all([
        api.getAdminStats(),
        api.getHealth()
      ]);

      if (statsRes?.success) setStats(statsRes.data);
      if (healthRes?.success) setSystemHealth(healthRes);
    } catch (err) {
      showNotification('Failed to load system metrics: ' + err.message, 'error');
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Fetch analytics data
  const loadAnalytics = useCallback(async (range = timeRange) => {
    try {
      setAnalyticsLoading(true);
      const res = await api.getAnalyticsOverview(range);
      if (res?.success) {
        setAnalyticsData(res.data);
      }
    } catch (err) {
      showNotification('Failed to load analytics: ' + err.message, 'error');
    } finally {
      setAnalyticsLoading(false);
    }
  }, [timeRange]);

  // Fetch products
  const loadProducts = useCallback(async (page = 1) => {
    try {
      setProductsLoading(true);
      const params = {
        page,
        limit: 10,
        search: productSearch || undefined,
        sector: productSectorFilter || undefined
      };
      const res = await api.getAdminProducts(params);
      if (res?.success) {
        setProducts(res.data || []);
        if (res.pagination) setProductPagination(res.pagination);
      }
    } catch (err) {
      showNotification('Failed to load products: ' + err.message, 'error');
    } finally {
      setProductsLoading(false);
    }
  }, [productSearch, productSectorFilter]);

  // Fetch users
  const loadUsers = useCallback(async (page = 1) => {
    try {
      setUsersLoading(true);
      const res = await api.getAdminUsers({ page, limit: 10 });
      if (res?.success) {
        setUsers(res.data || []);
        if (res.pagination) setUserPagination(res.pagination);
      }
    } catch (err) {
      showNotification('Failed to load users: ' + err.message, 'error');
    } finally {
      setUsersLoading(false);
    }
  }, []);

  // Fetch taxonomy
  const loadTaxonomy = useCallback(async () => {
    try {
      setTaxonomyLoading(true);
      const res = await api.getAdminTaxonomy();
      if (res?.success) {
        setTaxonomy(res.data || { sectors: [], categories: [], brands: [] });
      }
    } catch (err) {
      showNotification('Failed to load taxonomy: ' + err.message, 'error');
    } finally {
      setTaxonomyLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlatformOverview();
    loadAnalytics();
  }, [loadPlatformOverview, loadAnalytics]);

  useEffect(() => {
    if (activeTab === 'products') loadProducts();
    if (activeTab === 'users') loadUsers();
    if (activeTab === 'taxonomy') loadTaxonomy();
  }, [activeTab, loadProducts, loadUsers, loadTaxonomy]);

  // Handle Product Form
  const handleOpenCreateModal = () => {
    setFormData({
      title: '',
      brand: '',
      sector: '',
      category: '',
      description: '',
      price: '',
      discountPercentage: 0,
      stock: 50,
      SKU: `SKU-${Date.now().toString().slice(-6)}`,
      thumbnail: '',
      imagesText: '',
      isFeatured: false,
      isTrending: false
    });
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setSelectedProduct(product);
    setFormData({
      title: product.title || '',
      brand: product.brand || '',
      sector: product.sector || '',
      category: product.category || '',
      description: product.description || '',
      price: product.price ?? '',
      discountPercentage: product.discountPercentage || 0,
      stock: product.stock ?? 50,
      SKU: product.SKU || product.sku || '',
      thumbnail: product.thumbnail || '',
      imagesText: Array.isArray(product.images) ? product.images.join('\n') : '',
      isFeatured: Boolean(product.isFeatured),
      isTrending: Boolean(product.isTrending)
    });
    setIsEditModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.brand.trim() || !formData.sector.trim() || !formData.category.trim()) {
      showNotification('Title, brand, sector, and category are required.', 'error');
      return;
    }

    const images = formData.imagesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      title: formData.title.trim(),
      brand: formData.brand.trim(),
      sector: formData.sector.trim(),
      category: formData.category.trim(),
      description: formData.description.trim(),
      price: formData.price !== '' ? parseFloat(formData.price) : null,
      discountPercentage: Number(formData.discountPercentage) || 0,
      stock: Number(formData.stock) || 0,
      SKU: formData.SKU.trim(),
      thumbnail: formData.thumbnail.trim() || (images.length > 0 ? images[0] : ''),
      images: images.length > 0 ? images : (formData.thumbnail ? [formData.thumbnail] : []),
      isFeatured: Boolean(formData.isFeatured),
      isTrending: Boolean(formData.isTrending)
    };

    try {
      if (isCreateModalOpen) {
        const res = await api.createProduct(payload);
        if (res?.success) {
          showNotification('Product created successfully');
          setIsCreateModalOpen(false);
          loadProducts(1);
          loadPlatformOverview();
        } else {
          showNotification(res?.error?.message || 'Creation failed', 'error');
        }
      } else if (isEditModalOpen && selectedProduct) {
        const res = await api.updateProduct(selectedProduct.id, payload);
        if (res?.success) {
          showNotification('Product updated successfully');
          setIsEditModalOpen(false);
          loadProducts(productPagination.page);
        } else {
          showNotification(res?.error?.message || 'Update failed', 'error');
        }
      }
    } catch (err) {
      showNotification('Error saving product: ' + err.message, 'error');
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const res = await api.deleteProduct(id);
      if (res?.success) {
        showNotification('Product deleted');
        setDeleteConfirmId(null);
        loadProducts(productPagination.page);
        loadPlatformOverview();
      } else {
        showNotification(res?.error?.message || 'Delete failed', 'error');
      }
    } catch (err) {
      showNotification('Error deleting product: ' + err.message, 'error');
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      const res = await api.toggleProductFeatured(id);
      if (res?.success) {
        showNotification(`Featured status: ${res.data.isFeatured ? 'Active' : 'Disabled'}`);
        loadProducts(productPagination.page);
        loadPlatformOverview();
      }
    } catch (err) {
      showNotification('Toggle failed: ' + err.message, 'error');
    }
  };

  const handleToggleTrending = async (id) => {
    try {
      const res = await api.toggleProductTrending(id);
      if (res?.success) {
        showNotification(`Trending status: ${res.data.isTrending ? 'Active' : 'Disabled'}`);
        loadProducts(productPagination.page);
        loadPlatformOverview();
      }
    } catch (err) {
      showNotification('Toggle failed: ' + err.message, 'error');
    }
  };

  // Seller Offer Management
  const handleOpenSellerModal = (product) => {
    setSelectedProduct(product);
    setSellerForm({ name: '', price: product.price || '', rating: 4.5, inStock: true, url: '#' });
    setIsSellerModalOpen(true);
  };

  const handleAddSellerOffer = async (e) => {
    e.preventDefault();
    if (!sellerForm.name.trim()) return;

    try {
      const res = await api.addProductSeller(selectedProduct.id, {
        name: sellerForm.name.trim(),
        price: sellerForm.price !== '' ? parseFloat(sellerForm.price) : null,
        rating: Number(sellerForm.rating) || 4.5,
        inStock: Boolean(sellerForm.inStock),
        url: sellerForm.url.trim() || '#'
      });

      if (res?.success) {
        showNotification('Seller offer added');
        setSelectedProduct({ ...selectedProduct, sellers: res.data });
        setSellerForm({ name: '', price: '', rating: 4.5, inStock: true, url: '#' });
        loadProducts(productPagination.page);
      }
    } catch (err) {
      showNotification('Failed to add seller: ' + err.message, 'error');
    }
  };

  const handleRemoveSellerOffer = async (sellerName) => {
    try {
      const res = await api.deleteProductSeller(selectedProduct.id, sellerName);
      if (res?.success) {
        showNotification(`Seller ${sellerName} removed`);
        setSelectedProduct({ ...selectedProduct, sellers: res.data });
        loadProducts(productPagination.page);
      }
    } catch (err) {
      showNotification('Failed to remove seller: ' + err.message, 'error');
    }
  };

  // User Role Management
  const handleToggleUserRole = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    try {
      const res = await api.updateUserRole(user._id || user.id, newRole);
      if (res?.success) {
        showNotification(`User role updated to ${newRole}`);
        setUserActionConfirm(null);
        loadUsers(userPagination.page);
      } else {
        showNotification(res?.error?.message || 'Update failed', 'error');
      }
    } catch (err) {
      showNotification('Failed to update role: ' + err.message, 'error');
    }
  };

  const handleDeleteUser = async (user) => {
    try {
      const res = await api.deleteUser(user._id || user.id);
      if (res?.success) {
        showNotification('User account deleted');
        setUserActionConfirm(null);
        loadUsers(userPagination.page);
        loadPlatformOverview();
      } else {
        showNotification(res?.error?.message || 'Delete failed', 'error');
      }
    } catch (err) {
      showNotification('Failed to delete user: ' + err.message, 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 text-sm font-medium transition-all ${
            notification.type === 'error'
              ? 'bg-rose-950/90 text-rose-200 border border-rose-500/40'
              : 'bg-emerald-950/90 text-emerald-200 border border-emerald-500/40'
          }`}
        >
          <span>{notification.type === 'error' ? '⚠️' : '✓'}</span>
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Production Dashboard
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Platform Administration & Analytics
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl">
              Real-time monitoring, product catalog lifecycle, external provider aggregation status,
              and anonymous usage analytics for Aryan Electronics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                loadPlatformOverview();
                if (activeTab === 'analytics') loadAnalytics();
                if (activeTab === 'products') loadProducts();
                if (activeTab === 'users') loadUsers();
                if (activeTab === 'taxonomy') loadTaxonomy();
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 transition flex items-center gap-2"
            >
              🔄 Refresh
            </button>
            <div className="px-4 py-2.5 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs font-mono">
              DB: {systemHealth?.database?.mode || 'live'}
            </div>
          </div>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/50">
            <div className="text-xs text-slate-400 font-medium">Total Products</div>
            <div className="text-2xl font-bold text-white mt-1">
              {statsLoading ? '...' : stats?.totalProducts ?? 0}
            </div>
          </div>
          <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/50">
            <div className="text-xs text-slate-400 font-medium">Featured Items</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">
              {statsLoading ? '...' : stats?.totalFeatured ?? 0}
            </div>
          </div>
          <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/50">
            <div className="text-xs text-slate-400 font-medium">Trending Items</div>
            <div className="text-2xl font-bold text-cyan-400 mt-1">
              {statsLoading ? '...' : stats?.totalTrending ?? 0}
            </div>
          </div>
          <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/50">
            <div className="text-xs text-slate-400 font-medium">Total Users</div>
            <div className="text-2xl font-bold text-purple-400 mt-1">
              {statsLoading ? '...' : stats?.totalUsers ?? 0}
            </div>
          </div>
          <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/50">
            <div className="text-xs text-slate-400 font-medium">Sectors</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">
              {statsLoading ? '...' : stats?.sectorsCount ?? 0}
            </div>
          </div>
          <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/50">
            <div className="text-xs text-slate-400 font-medium">Brands</div>
            <div className="text-2xl font-bold text-sky-400 mt-1">
              {statsLoading ? '...' : stats?.brandsCount ?? 0}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-800 space-x-2 overflow-x-auto pb-1">
        {[
          { id: 'analytics', label: '📊 Analytics Hub' },
          { id: 'products', label: '📦 Product Catalog' },
          { id: 'taxonomy', label: '🏷️ Taxonomy & Offers' },
          { id: 'users', label: '👥 User Accounts' },
          { id: 'system', label: '⚙️ System Health' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 rounded-t-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-slate-900 text-cyan-400 border-t-2 border-cyan-400 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: ANALYTICS HUB */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Time range selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white">Aggregated Platform Activity</h2>
              <p className="text-xs text-slate-400">
                Metrics aggregated from genuine user searches, product views, and comparisons.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 mr-1 font-medium">Time Horizon:</span>
              {['24h', '7d', '30d', 'all'].map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setTimeRange(r);
                    loadAnalytics(r);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    timeRange === r
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {r === 'all' ? 'All Time' : `Last ${r}`}
                </button>
              ))}
            </div>
          </div>

          {analyticsLoading ? (
            <div className="py-24 flex flex-col items-center justify-center">
              <Spinner size="lg" />
              <p className="text-xs text-slate-400 mt-3 font-mono">Aggregating telemetry data...</p>
            </div>
          ) : (
            <>
              {/* Analytics Summary Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                  <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Product Views</div>
                  <div className="text-3xl font-extrabold text-cyan-400 mt-2">
                    {analyticsData?.totalViews ?? 0}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Total PDP impressions</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                  <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Search Queries</div>
                  <div className="text-3xl font-extrabold text-indigo-400 mt-2">
                    {analyticsData?.totalSearches ?? 0}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Unique catalog searches</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                  <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Comparisons</div>
                  <div className="text-3xl font-extrabold text-emerald-400 mt-2">
                    {analyticsData?.totalComparisons ?? 0}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Multi-device comparison runs</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                  <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Wishlist Adds</div>
                  <div className="text-3xl font-extrabold text-rose-400 mt-2">
                    {analyticsData?.totalWishlistAdds ?? 0}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Saved products activity</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                  <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Search Conversion</div>
                  <div className="text-3xl font-extrabold text-amber-400 mt-2">
                    {analyticsData?.searchConversionRate ?? 0}%
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Search to product view rate</div>
                </div>
              </div>

              {/* Analytics Tables & Visuals */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top 10 Viewed Products */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-base font-bold text-white mb-4 flex items-center justify-between">
                    <span>🔥 Most-Viewed Products</span>
                    <span className="text-xs font-normal text-slate-400">By distinct views</span>
                  </h3>
                  {analyticsData?.topProducts?.length > 0 ? (
                    <div className="space-y-3">
                      {analyticsData.topProducts.map((prod, idx) => (
                        <div
                          key={prod.productId || idx}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-750 hover:bg-slate-800 transition"
                        >
                          <div className="flex items-center space-x-3 overflow-hidden">
                            <span className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs font-bold flex items-center justify-center">
                              #{idx + 1}
                            </span>
                            <div className="truncate">
                              <div className="text-sm font-semibold text-slate-200 truncate">
                                {prod.title}
                              </div>
                              <div className="text-xs text-slate-400">
                                {prod.brand || 'Brand'} • {prod.sector || 'Sector'}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm font-mono font-bold text-cyan-400 pl-4 whitespace-nowrap">
                            {prod.views} views
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-sm text-slate-500">
                      No product views recorded for this time range yet.
                    </div>
                  )}
                </div>

                {/* Popular Search Keywords */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-base font-bold text-white mb-4 flex items-center justify-between">
                    <span>🔍 Popular Searches</span>
                    <span className="text-xs font-normal text-slate-400">Top customer keywords</span>
                  </h3>
                  {analyticsData?.popularSearches?.length > 0 ? (
                    <div className="space-y-3">
                      {analyticsData.popularSearches.map((item, idx) => (
                        <div
                          key={item.query || idx}
                          className="p-3 rounded-xl bg-slate-800/40 border border-slate-750 flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-xs font-mono text-slate-400">#{idx + 1}</span>
                            <span className="text-sm font-medium text-slate-200 font-mono">
                              "{item.query}"
                            </span>
                          </div>
                          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                            {item.count} searches
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-sm text-slate-500">
                      No search keywords recorded for this time range yet.
                    </div>
                  )}
                </div>

                {/* Sector Popularity */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-base font-bold text-white mb-4">
                    🏢 Sector Engagement Breakdown
                  </h3>
                  {analyticsData?.sectorPopularity?.length > 0 ? (
                    <div className="space-y-3">
                      {analyticsData.sectorPopularity.map((sector) => {
                        const total = analyticsData.totalViews || 1;
                        const pct = Math.min(100, Math.round((sector.count / total) * 100));
                        return (
                          <div key={sector.name} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="font-semibold text-slate-300">{sector.name}</span>
                              <span className="text-slate-400 font-mono">
                                {sector.count} views ({pct}%)
                              </span>
                            </div>
                            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full rounded-full transition-all duration-500"
                                style={{ width: `${Math.max(5, pct)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-sm text-slate-500">
                      No sector engagement logged yet.
                    </div>
                  )}
                </div>

                {/* Brand Popularity */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-base font-bold text-white mb-4">
                    🏷️ Brand Popularity Distribution
                  </h3>
                  {analyticsData?.brandPopularity?.length > 0 ? (
                    <div className="space-y-3">
                      {analyticsData.brandPopularity.map((brand) => {
                        const total = analyticsData.totalViews || 1;
                        const pct = Math.min(100, Math.round((brand.count / total) * 100));
                        return (
                          <div key={brand.name} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="font-semibold text-slate-300">{brand.name}</span>
                              <span className="text-slate-400 font-mono">
                                {brand.count} views ({pct}%)
                              </span>
                            </div>
                            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500"
                                style={{ width: `${Math.max(5, pct)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-sm text-slate-500">
                      No brand popularity logged yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Analytics Source Attribution */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Telemetry source: <strong className="text-slate-200">{analyticsData?.dataSource}</strong></span>
                </div>
                <span>Collected strictly without PII (No sensitive user identity retained)</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* TAB 2: PRODUCT CATALOG MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <div className="flex flex-1 items-center gap-3">
              <input
                type="text"
                placeholder="Search by title, SKU, or brand..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadProducts(1)}
                className="w-full max-w-sm px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={() => loadProducts(1)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-xl border border-slate-700 transition"
              >
                Search
              </button>
            </div>

            <button
              onClick={handleOpenCreateModal}
              className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-cyan-600/20 transition flex items-center justify-center gap-2"
            >
              <span>+</span> Add New Product
            </button>
          </div>

          {/* Products Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            {productsLoading ? (
              <div className="py-20 flex flex-col items-center justify-center">
                <Spinner size="lg" />
                <p className="text-xs text-slate-400 mt-2 font-mono">Loading product inventory...</p>
              </div>
            ) : products.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-950/80 text-xs text-slate-400 uppercase font-semibold border-b border-slate-800">
                    <tr>
                      <th className="py-4 px-4">Item</th>
                      <th className="py-4 px-4">SKU & Category</th>
                      <th className="py-4 px-4">Price</th>
                      <th className="py-4 px-4">Stock</th>
                      <th className="py-4 px-4">Badges</th>
                      <th className="py-4 px-4">Sellers</th>
                      <th className="py-4 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {products.map((prod) => (
                      <tr key={prod.id || prod._id} className="hover:bg-slate-800/30 transition">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={prod.thumbnail || (prod.images && prod.images[0]) || '/placeholder.svg'}
                              alt={prod.title}
                              className="w-12 h-12 rounded-lg object-contain bg-slate-800 border border-slate-750 p-1 flex-shrink-0"
                              onError={(e) => {
                                e.currentTarget.src =
                                  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="100%" height="100%" fill="%231e293b"/></svg>';
                              }}
                            />
                            <div className="max-w-xs">
                              <div className="font-semibold text-white truncate" title={prod.title}>
                                {prod.title}
                              </div>
                              <div className="text-xs text-slate-400">{prod.brand}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-mono text-xs text-cyan-400">{prod.SKU || prod.sku}</div>
                          <div className="text-xs text-slate-400 truncate max-w-xs">{prod.category}</div>
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-white">
                          ${prod.price !== null && prod.price !== undefined ? prod.price.toFixed(2) : 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-semibold ${
                              (prod.stock || 0) > 10
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-rose-500/10 text-rose-400'
                            }`}
                          >
                            {prod.stock ?? 0} in stock
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-1.5 flex-wrap">
                            <button
                              onClick={() => handleToggleFeatured(prod.id)}
                              className={`px-2 py-0.5 rounded text-xs font-semibold transition ${
                                prod.isFeatured
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                              }`}
                              title="Click to toggle Featured status"
                            >
                              ★ Featured
                            </button>
                            <button
                              onClick={() => handleToggleTrending(prod.id)}
                              className={`px-2 py-0.5 rounded text-xs font-semibold transition ${
                                prod.isTrending
                                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                  : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                              }`}
                              title="Click to toggle Trending status"
                            >
                              🔥 Trending
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleOpenSellerModal(prod)}
                            className="text-xs text-indigo-400 hover:text-indigo-300 underline font-medium"
                          >
                            {prod.sellers?.length || 0} offers
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleOpenEditModal(prod)}
                              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(prod.id)}
                              className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-xs font-semibold transition"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-16 text-center text-slate-500">
                No products found matching query.
              </div>
            )}

            {/* Pagination */}
            {productPagination.totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-slate-800 bg-slate-950/40">
                <span className="text-xs text-slate-400">
                  Page {productPagination.page} of {productPagination.totalPages} ({productPagination.total} items)
                </span>
                <div className="flex space-x-2">
                  <button
                    disabled={productPagination.page <= 1}
                    onClick={() => loadProducts(productPagination.page - 1)}
                    className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold disabled:opacity-40 disabled:hover:bg-slate-800"
                  >
                    Previous
                  </button>
                  <button
                    disabled={productPagination.page >= productPagination.totalPages}
                    onClick={() => loadProducts(productPagination.page + 1)}
                    className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold disabled:opacity-40 disabled:hover:bg-slate-800"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: TAXONOMY & OFFERS */}
      {activeTab === 'taxonomy' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sectors */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center justify-between">
              <span>🏢 Sectors ({taxonomy.sectors.length})</span>
            </h3>
            {taxonomyLoading ? (
              <Spinner />
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {taxonomy.sectors.map((s) => (
                  <div
                    key={s.name}
                    className="flex justify-between items-center p-3 rounded-xl bg-slate-800/40 border border-slate-800"
                  >
                    <span className="text-sm font-semibold text-slate-200">{s.name}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-400">
                      {s.count} items
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Categories */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center justify-between">
              <span>📂 Categories ({taxonomy.categories.length})</span>
            </h3>
            {taxonomyLoading ? (
              <Spinner />
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {taxonomy.categories.map((c) => (
                  <div
                    key={c.name}
                    className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex justify-between items-center"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-200">{c.name}</div>
                      {c.sector && <div className="text-xs text-slate-500">{c.sector}</div>}
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-indigo-500/10 text-indigo-400">
                      {c.count} items
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Brands */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center justify-between">
              <span>🏷️ Brands ({taxonomy.brands.length})</span>
            </h3>
            {taxonomyLoading ? (
              <Spinner />
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {taxonomy.brands.map((b) => (
                  <div
                    key={b.name}
                    className="flex justify-between items-center p-3 rounded-xl bg-slate-800/40 border border-slate-800"
                  >
                    <span className="text-sm font-semibold text-slate-200">{b.name}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-purple-500/10 text-purple-400">
                      {b.count} items
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: USER ACCOUNTS */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            {usersLoading ? (
              <div className="py-20 flex flex-col items-center justify-center">
                <Spinner size="lg" />
                <p className="text-xs text-slate-400 mt-2 font-mono">Loading user registry...</p>
              </div>
            ) : users.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-950/80 text-xs text-slate-400 uppercase font-semibold border-b border-slate-800">
                    <tr>
                      <th className="py-4 px-6">User</th>
                      <th className="py-4 px-6">Email</th>
                      <th className="py-4 px-6">Role</th>
                      <th className="py-4 px-6">Created Date</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {users.map((u) => (
                      <tr key={u._id || u.id} className="hover:bg-slate-800/30 transition">
                        <td className="py-4 px-6 font-semibold text-white">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-cyan-600/20 text-cyan-400 flex items-center justify-center font-bold text-xs uppercase">
                              {(u.name || 'U')[0]}
                            </div>
                            <span>{u.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-slate-300 font-mono text-xs">{u.email}</td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                              u.role === 'admin'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {u.role || 'user'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-400">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => setUserActionConfirm({ type: 'toggleRole', user: u })}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition"
                            >
                              {u.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                            </button>
                            <button
                              onClick={() => setUserActionConfirm({ type: 'deleteUser', user: u })}
                              className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold rounded-lg transition"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-16 text-center text-slate-500">No users found.</div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: SYSTEM HEALTH & OBSERVABILITY */}
      {activeTab === 'system' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center justify-between">
              <span>🖥️ System Observability & Metrics</span>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {systemHealth?.status || 'Active'}
              </span>
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <span className="text-slate-400 text-sm">Server Uptime</span>
                <span className="text-white font-mono font-bold text-sm">
                  {systemHealth?.uptime ? `${Math.round(systemHealth.uptime)} seconds` : 'Active'}
                </span>
              </div>

              <div className="flex justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <span className="text-slate-400 text-sm">Node Environment</span>
                <span className="text-cyan-400 font-mono font-bold text-sm">
                  {systemHealth?.environment || 'development'}
                </span>
              </div>

              <div className="flex justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <span className="text-slate-400 text-sm">API Version</span>
                <span className="text-indigo-400 font-mono font-bold text-sm">
                  {systemHealth?.version || '0.5.0'}
                </span>
              </div>

              {systemHealth?.memory && (
                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-slate-300 uppercase">Process Memory Profile</div>
                  <div className="grid grid-cols-3 gap-2 text-center pt-2">
                    <div className="bg-slate-900 p-2 rounded-lg">
                      <div className="text-xs text-slate-400">RSS</div>
                      <div className="text-sm font-mono font-bold text-white">{systemHealth.memory.rssMb} MB</div>
                    </div>
                    <div className="bg-slate-900 p-2 rounded-lg">
                      <div className="text-xs text-slate-400">Heap Used</div>
                      <div className="text-sm font-mono font-bold text-cyan-400">{systemHealth.memory.heapUsedMb} MB</div>
                    </div>
                    <div className="bg-slate-900 p-2 rounded-lg">
                      <div className="text-xs text-slate-400">Heap Total</div>
                      <div className="text-sm font-mono font-bold text-purple-400">{systemHealth.memory.heapTotalMb} MB</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <h3 className="text-lg font-bold text-white">🌐 Database & External Provider Adapters</h3>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-white">MongoDB Atlas Database</span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold ${
                      systemHealth?.database?.connected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    {systemHealth?.database?.state || 'connected'}
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  Host: {systemHealth?.database?.host || 'remote'} | Database: {systemHealth?.database?.database || 'aryan_electronics'}
                </div>
              </div>

              {systemHealth?.providers?.map((prov) => (
                <div
                  key={prov.name}
                  className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex justify-between items-center"
                >
                  <div>
                    <div className="text-sm font-semibold text-white">{prov.name}</div>
                    <div className="text-xs text-slate-400 font-mono">Type: {prov.type}</div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded text-xs font-bold uppercase font-mono ${
                      prov.status === 'live' || prov.status === 'active'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-indigo-500/20 text-indigo-300'
                    }`}
                  >
                    {prov.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT PRODUCT MODAL */}
      {(isCreateModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl my-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                {isCreateModalOpen ? 'Create New Product' : `Edit Product: ${selectedProduct?.title}`}
              </h3>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Brand *</label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">SKU *</label>
                  <input
                    type="text"
                    required
                    value={formData.SKU}
                    onChange={(e) => setFormData({ ...formData, SKU: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Sector *</label>
                  <input
                    type="text"
                    required
                    value={formData.sector}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Discount %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discountPercentage}
                    onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Stock Count</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Thumbnail URL</label>
                <input
                  type="url"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Additional Images (one URL per line)
                </label>
                <textarea
                  rows={2}
                  value={formData.imagesText}
                  onChange={(e) => setFormData({ ...formData, imagesText: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
                  />
                  <span className="text-sm text-slate-300 font-semibold">Featured Product</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isTrending}
                    onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                    className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
                  />
                  <span className="text-sm text-slate-300 font-semibold">Trending Product</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-cyan-600/30"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SELLER OFFERS MODAL */}
      {isSellerModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white">Seller Offers</h3>
                <p className="text-xs text-slate-400">{selectedProduct.title}</p>
              </div>
              <button
                onClick={() => setIsSellerModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            {/* List existing sellers */}
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {selectedProduct.sellers?.length > 0 ? (
                selectedProduct.sellers.map((seller) => (
                  <div
                    key={seller.name}
                    className="flex justify-between items-center p-3 rounded-xl bg-slate-800/40 border border-slate-750"
                  >
                    <div>
                      <div className="text-sm font-bold text-white">{seller.name}</div>
                      <div className="text-xs text-slate-400">
                        ${seller.price?.toFixed(2) || 'N/A'} • Rating: {seller.rating} ★ •{' '}
                        {seller.inStock ? 'In Stock' : 'Out of Stock'}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveSellerOffer(seller.name)}
                      className="px-2.5 py-1 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-lg text-xs font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-slate-500">
                  No aggregated seller offers attached yet.
                </div>
              )}
            </div>

            {/* Add seller form */}
            <form onSubmit={handleAddSellerOffer} className="space-y-3 pt-4 border-t border-slate-800">
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Add New Seller Offer
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Seller / Retailer Name *"
                  value={sellerForm.name}
                  onChange={(e) => setSellerForm({ ...sellerForm, name: e.target.value })}
                  className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Offered Price ($)"
                  value={sellerForm.price}
                  onChange={(e) => setSellerForm({ ...sellerForm, price: e.target.value })}
                  className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="url"
                  placeholder="Product Offer URL"
                  value={sellerForm.url}
                  onChange={(e) => setSellerForm({ ...sellerForm, url: e.target.value })}
                  className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-mono"
                />
                <div className="flex items-center space-x-2">
                  <label className="flex items-center space-x-2 text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={sellerForm.inStock}
                      onChange={(e) => setSellerForm({ ...sellerForm, inStock: e.target.checked })}
                      className="rounded bg-slate-800"
                    />
                    <span>Available / In Stock</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold"
                >
                  + Add Seller Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE PRODUCT CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/30 rounded-3xl max-w-md w-full p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 mx-auto bg-rose-500/10 text-rose-400 rounded-2xl flex items-center justify-center text-2xl">
              🗑️
            </div>
            <h3 className="text-lg font-bold text-white">Confirm Product Deletion</h3>
            <p className="text-xs text-slate-400">
              Are you sure you want to delete this product? This action cannot be undone and will remove it from search and discovery.
            </p>
            <div className="flex justify-center space-x-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(deleteConfirmId)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-600/30"
              >
                Yes, Delete Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* USER ACTION CONFIRMATION MODAL */}
      {userActionConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl text-center space-y-4">
            <h3 className="text-lg font-bold text-white">
              {userActionConfirm.type === 'toggleRole' ? 'Update User Role' : 'Delete User Account'}
            </h3>
            <p className="text-xs text-slate-400">
              {userActionConfirm.type === 'toggleRole'
                ? `Confirm role change for ${userActionConfirm.user.email}?`
                : `Are you sure you want to permanently delete user account ${userActionConfirm.user.email}?`}
            </p>
            <div className="flex justify-center space-x-3 pt-2">
              <button
                onClick={() => setUserActionConfirm(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (userActionConfirm.type === 'toggleRole') {
                    handleToggleUserRole(userActionConfirm.user);
                  } else {
                    handleDeleteUser(userActionConfirm.user);
                  }
                }}
                className={`px-4 py-2 text-white text-xs font-bold rounded-xl ${
                  userActionConfirm.type === 'toggleRole'
                    ? 'bg-cyan-600 hover:bg-cyan-500'
                    : 'bg-rose-600 hover:bg-rose-500'
                }`}
              >
                Confirm Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
