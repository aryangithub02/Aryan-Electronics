/**
 * Aryan Electronics - Formatting Utilities
 */

export const formatCurrency = (amount, currency = 'INR') => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return currency === 'USD' ? '$0.00' : '₹0.00';
  }

  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(amount);
};

export const calculateDiscountPrice = (price, discountPercentage = 0) => {
  if (!discountPercentage || discountPercentage <= 0) return price;
  const discounted = price * (1 - discountPercentage / 100);
  return Math.round(discounted * 100) / 100;
};

export const formatRating = (rating) => {
  if (rating === undefined || rating === null || isNaN(rating)) return '0.0';
  return Number(rating).toFixed(1);
};

export const truncateText = (text, maxLength = 120) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
};

export const FALLBACK_PRODUCT_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300' fill='%230f172a'><rect width='400' height='300' fill='%230f172a'/><rect x='150' y='110' width='100' height='50' rx='8' fill='%231e293b' stroke='%23334155' stroke-width='2'/><text x='50%25' y='46%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='13' font-weight='700' fill='%2338bdf8'>Aryan Electronics</text><text x='50%25' y='65%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='11' fill='%2364748b'>Product Preview</text></svg>";

export const handleImageError = (e) => {
  if (e && e.currentTarget) {
    e.currentTarget.onerror = null;
    e.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
  }
};

export const formatProductPrice = (price, discountPercentage = 0) => {
  if (price === null || price === undefined) {
    return 'Price on Request';
  }
  const discounted = calculateDiscountPrice(price, discountPercentage);
  return formatCurrency(discounted);
};

