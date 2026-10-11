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
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const calculateDiscountPrice = (price, discountPercentage = 0) => {
  if (!discountPercentage || discountPercentage <= 0) return price;
  const discounted = price * (1 - discountPercentage / 100);
  return Math.round(discounted);
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

const SECTOR_FALLBACK_IMAGES = {
  education: '/images/sectors/education.jpg',
  healthcare: '/images/sectors/healthcare.jpg',
  agriculture: '/images/sectors/agriculture.jpg',
  home: '/images/sectors/home.jpg',
  'home automation': '/images/sectors/home.jpg',
  industrial: '/images/sectors/industrial.jpg',
  automotive: '/images/sectors/automotive.jpg',
  office: '/images/sectors/office.jpg',
  entertainment: '/images/sectors/entertainment.jpg'
};

export const FALLBACK_PRODUCT_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300' fill='%23f8fafc'><rect width='400' height='300' fill='%23f8fafc' rx='12'/><rect x='130' y='80' width='140' height='100' rx='12' fill='%23ffffff' stroke='%23e2e8f0' stroke-width='2'/><circle cx='200' cy='120' r='18' fill='%23eff6ff' stroke='%233b82f6' stroke-width='2'/><path d='M194 120 L198 124 L207 115' stroke='%232563eb' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/><text x='50%25' y='72%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui, -apple-system, sans-serif' font-size='13' font-weight='600' fill='%231e293b'>Aryan Electronics</text><text x='50%25' y='82%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui, -apple-system, sans-serif' font-size='11' font-weight='500' fill='%2364748b'>Commercial Hardware Listing</text></svg>";

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
