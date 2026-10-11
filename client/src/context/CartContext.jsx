import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { calculateDiscountPrice } from '../utils/formatters';

const CART_STORAGE_KEY = 'aryan_electronics_cart';

export const CartContext = createContext({
  cart: [],
  cartCount: 0,
  subtotal: 0,
  totalSavings: 0,
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  isInCart: () => false
});

export const CartProvider = ({ children }) => {
  // Initialize purely from localStorage without any mock or simulated defaults
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('[Cart] Error reading stored cart:', err.message);
    }
    return [];
  });

  // Sync to localStorage whenever cart state changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (err) {
      console.warn('[Cart] Error persisting cart to storage:', err.message);
    }
  }, [cart]);

  // Add real product to cart
  const addToCart = useCallback((product, quantity = 1) => {
    if (!product) return;
    const prodId = String(product.id || product._id || '');
    if (!prodId) return;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => String(item.product?.id || item.product?._id || item.id) === prodId
      );

      if (existingIndex > -1) {
        const next = [...prevCart];
        const existing = next[existingIndex];
        const newQty = (existing.quantity || 1) + quantity;
        next[existingIndex] = {
          ...existing,
          quantity: Math.max(1, newQty)
        };
        return next;
      }

      return [
        ...prevCart,
        {
          id: prodId,
          product,
          quantity: Math.max(1, quantity),
          addedAt: new Date().toISOString()
        }
      ];
    });
  }, []);

  // Remove product from cart
  const removeFromCart = useCallback((productId) => {
    if (!productId) return;
    const targetId = String(productId);
    setCart((prevCart) =>
      prevCart.filter(
        (item) => String(item.product?.id || item.product?._id || item.id) !== targetId
      )
    );
  }, []);

  // Update item quantity
  const updateQuantity = useCallback((productId, quantity) => {
    if (!productId) return;
    const targetId = String(productId);
    const newQty = parseInt(quantity, 10);

    if (isNaN(newQty) || newQty <= 0) {
      setCart((prev) =>
        prev.filter(
          (item) => String(item.product?.id || item.product?._id || item.id) !== targetId
        )
      );
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (String(item.product?.id || item.product?._id || item.id) === targetId) {
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  }, []);

  // Clear entire cart
  const clearCart = useCallback(() => {
    setCart([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (e) {
      // ignore
    }
  }, []);

  // Check if item is in cart
  const isInCart = useCallback(
    (productId) => {
      if (!productId) return false;
      const targetId = String(productId);
      return cart.some(
        (item) => String(item.product?.id || item.product?._id || item.id) === targetId
      );
    },
    [cart]
  );

  // Real aggregate calculations
  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }, [cart]);

  const { subtotal, totalSavings } = useMemo(() => {
    let sub = 0;
    let savings = 0;

    cart.forEach((item) => {
      const p = item.product || {};
      const qty = item.quantity || 1;
      const originalPrice = typeof p.price === 'number' ? p.price : 0;
      const effectivePrice =
        p.discountPercentage > 0
          ? calculateDiscountPrice(originalPrice, p.discountPercentage)
          : originalPrice;

      sub += effectivePrice * qty;
      if (p.discountPercentage > 0) {
        savings += (originalPrice - effectivePrice) * qty;
      }
    });

    return {
      subtotal: Math.round(sub * 100) / 100,
      totalSavings: Math.round(savings * 100) / 100
    };
  }, [cart]);

  const value = {
    cart,
    cartCount,
    subtotal,
    totalSavings,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);

export default CartContext;
