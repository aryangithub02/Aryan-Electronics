import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const TOKEN_KEY = 'aryan_auth_token';
const GUEST_WISHLIST_KEY = 'aryan_guest_wishlist';
const GUEST_SAVED_KEY = 'aryan_guest_saved';
const GUEST_COMPARE_KEY = 'aryan_guest_compare';
const GUEST_RECENT_KEY = 'aryan_guest_recent';

const defaultContextValue = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  wishlist: [],
  savedProducts: [],
  recentlyViewed: [],
  comparisonList: [],
  login: async () => {},
  register: async () => {},
  logout: () => {},
  toggleWishlist: async () => {},
  isInWishlist: () => false,
  toggleSaved: async () => {},
  isSaved: () => false,
  recordRecentlyViewed: async () => {},
  addToCompare: async () => {},
  removeFromCompare: async () => {},
  clearCompare: async () => {},
  isInCompare: () => false,
  refreshUserData: async () => {}
};

export const AuthContext = createContext(defaultContextValue);

const safeGetJson = (key, fallback = []) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
};

const safeSetJson = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    // ignore
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem(TOKEN_KEY) || null;
    } catch (e) {
      return null;
    }
  });
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Personalized collections (contain resolved product objects or objects with {id})
  const [wishlist, setWishlist] = useState([]);
  const [savedProducts, setSavedProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [comparisonList, setComparisonList] = useState([]);

  // Load server lists when logged in, or local guest lists when guest
  const refreshUserData = useCallback(async () => {
    const currentToken = localStorage.getItem(TOKEN_KEY);
    if (!currentToken) {
      setUser(null);
      // Load guest state from localStorage
      setWishlist(safeGetJson(GUEST_WISHLIST_KEY, []));
      setSavedProducts(safeGetJson(GUEST_SAVED_KEY, []));
      setComparisonList(safeGetJson(GUEST_COMPARE_KEY, []));
      setRecentlyViewed(safeGetJson(GUEST_RECENT_KEY, []));
      setIsLoading(false);
      return;
    }

    try {
      // Fetch authenticated user info
      const meRes = await api.getMe();
      const resolvedUser = meRes?.user || meRes?.data;
      if (resolvedUser) {
        setUser(resolvedUser);
      }

      // Fetch lists in parallel
      const [wishRes, saveRes, compRes, recRes] = await Promise.allSettled([
        api.getWishlist(),
        api.getSavedProducts(),
        api.getCompareList(),
        api.getRecentlyViewed()
      ]);

      if (wishRes.status === 'fulfilled' && (wishRes.value?.data || wishRes.value?.wishlist)) {
        setWishlist(wishRes.value.data || wishRes.value.wishlist);
      }
      if (saveRes.status === 'fulfilled' && (saveRes.value?.data || saveRes.value?.savedProducts)) {
        setSavedProducts(saveRes.value.data || saveRes.value.savedProducts);
      }
      if (compRes.status === 'fulfilled' && (compRes.value?.data || compRes.value?.comparisonList)) {
        setComparisonList(compRes.value.data || compRes.value.comparisonList);
      }
      if (recRes.status === 'fulfilled' && (recRes.value?.data || recRes.value?.recentlyViewed)) {
        setRecentlyViewed(recRes.value.data || recRes.value.recentlyViewed);
      }
    } catch (err) {
      console.warn('Failed to load user profile or collections:', err.message);
      // If 401 unauthorized, clear token
      if (err.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUserData();
  }, [refreshUserData]);

  // Auth actions
  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const res = await api.login(credentials);
      if (res?.token) {
        const resolvedUser = res.user || res.data;
        localStorage.setItem(TOKEN_KEY, res.token);
        setToken(res.token);
        if (resolvedUser) {
          setUser(resolvedUser);
        }
        await refreshUserData();
        return { success: true, user: resolvedUser };
      }
      throw new Error(res?.message || 'Login failed');
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      const res = await api.register(userData);
      if (res?.token) {
        const resolvedUser = res.user || res.data;
        localStorage.setItem(TOKEN_KEY, res.token);
        setToken(res.token);
        if (resolvedUser) {
          setUser(resolvedUser);
        }
        await refreshUserData();
        return { success: true, user: resolvedUser };
      }
      throw new Error(res?.message || 'Registration failed');
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout().catch(() => {});
    } catch (e) {
      // ignore
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
      // Fallback back to guest lists
      setWishlist(safeGetJson(GUEST_WISHLIST_KEY, []));
      setSavedProducts(safeGetJson(GUEST_SAVED_KEY, []));
      setComparisonList(safeGetJson(GUEST_COMPARE_KEY, []));
      setRecentlyViewed(safeGetJson(GUEST_RECENT_KEY, []));
    }
  };

  // Helper ID extractor
  const getId = (item) => (typeof item === 'string' ? item : item?.id || item?._id);

  // Wishlist actions
  const isInWishlist = useCallback(
    (productId) => {
      const id = getId(productId);
      return wishlist.some((item) => getId(item) === id);
    },
    [wishlist]
  );

  const toggleWishlist = async (product) => {
    const id = getId(product);
    if (!id) return;
    const currentlyIn = isInWishlist(id);

    if (token) {
      try {
        if (currentlyIn) {
          const res = await api.removeFromWishlist(id);
          if (res?.data) setWishlist(res.data);
        } else {
          const res = await api.addToWishlist(id);
          if (res?.data) setWishlist(res.data);
        }
      } catch (err) {
        console.error('Wishlist update failed:', err);
        throw err;
      }
    } else {
      // Guest local state
      let updated;
      if (currentlyIn) {
        updated = wishlist.filter((item) => getId(item) !== id);
      } else {
        const itemToAdd = typeof product === 'object' ? product : { id };
        updated = [...wishlist, itemToAdd];
      }
      setWishlist(updated);
      safeSetJson(GUEST_WISHLIST_KEY, updated);
    }
  };

  // Saved Products actions
  const isSaved = useCallback(
    (productId) => {
      const id = getId(productId);
      return savedProducts.some((item) => getId(item) === id);
    },
    [savedProducts]
  );

  const toggleSaved = async (product) => {
    const id = getId(product);
    if (!id) return;
    const currentlyIn = isSaved(id);

    if (token) {
      try {
        if (currentlyIn) {
          const res = await api.removeFromSavedProducts(id);
          if (res?.data) setSavedProducts(res.data);
        } else {
          const res = await api.addToSavedProducts(id);
          if (res?.data) setSavedProducts(res.data);
        }
      } catch (err) {
        console.error('Saved products update failed:', err);
        throw err;
      }
    } else {
      // Guest local state
      let updated;
      if (currentlyIn) {
        updated = savedProducts.filter((item) => getId(item) !== id);
      } else {
        const itemToAdd = typeof product === 'object' ? product : { id };
        updated = [...savedProducts, itemToAdd];
      }
      setSavedProducts(updated);
      safeSetJson(GUEST_SAVED_KEY, updated);
    }
  };

  // Recently Viewed actions
  const recordRecentlyViewed = async (product) => {
    const id = getId(product);
    if (!id) return;

    if (token) {
      try {
        const res = await api.recordRecentlyViewed(id);
        if (res?.data) setRecentlyViewed(res.data);
      } catch (err) {
        // Silently tolerate recently-viewed telemetry failures
      }
    } else {
      const itemToAdd = typeof product === 'object' ? product : { id };
      const filtered = (wishlist || []).filter ? recentlyViewed.filter((item) => getId(item) !== id) : [];
      const updated = [itemToAdd, ...filtered].slice(0, 20);
      setRecentlyViewed(updated);
      safeSetJson(GUEST_RECENT_KEY, updated);
    }
  };

  // Compare actions (Max 4 items)
  const isInCompare = useCallback(
    (productId) => {
      const id = getId(productId);
      return comparisonList.some((item) => getId(item) === id);
    },
    [comparisonList]
  );

  const addToCompare = async (product) => {
    const id = getId(product);
    if (!id) return { success: false, message: 'Invalid product' };

    if (isInCompare(id)) {
      return { success: false, message: 'Product is already in comparison list' };
    }

    if (comparisonList.length >= 4) {
      return {
        success: false,
        message: 'Comparison limit reached (Maximum 4 products). Remove an item first.'
      };
    }

    if (token) {
      try {
        const res = await api.addToCompare(id);
        if (res?.data) setComparisonList(res.data);
        return { success: true };
      } catch (err) {
        return { success: false, message: err.message || 'Failed to add to compare' };
      }
    } else {
      const itemToAdd = typeof product === 'object' ? product : { id };
      const updated = [...comparisonList, itemToAdd];
      setComparisonList(updated);
      safeSetJson(GUEST_COMPARE_KEY, updated);
      return { success: true };
    }
  };

  const removeFromCompare = async (product) => {
    const id = getId(product);
    if (!id) return;

    if (token) {
      try {
        const res = await api.removeFromCompare(id);
        if (res?.data) setComparisonList(res.data);
      } catch (err) {
        console.error('Failed to remove from compare:', err);
      }
    } else {
      const updated = comparisonList.filter((item) => getId(item) !== id);
      setComparisonList(updated);
      safeSetJson(GUEST_COMPARE_KEY, updated);
    }
  };

  const clearCompare = async () => {
    if (token) {
      try {
        const res = await api.clearCompareList();
        if (res?.data) setComparisonList(res.data);
      } catch (err) {
        console.error('Failed to clear compare:', err);
      }
    } else {
      setComparisonList([]);
      safeSetJson(GUEST_COMPARE_KEY, []);
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    wishlist,
    savedProducts,
    recentlyViewed,
    comparisonList,
    login,
    register,
    logout,
    toggleWishlist,
    isInWishlist,
    toggleSaved,
    isSaved,
    recordRecentlyViewed,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isInCompare,
    refreshUserData
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context || defaultContextValue;
};

export default AuthContext;
