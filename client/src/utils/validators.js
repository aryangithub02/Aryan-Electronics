/**
 * Aryan Electronics - Form & Input Validation Utilities
 */

export const validateSearchQuery = (query) => {
  if (typeof query !== 'string') return '';
  // Trim and strip suspicious control characters
  return query.trim().replace(/[<>]/g, '');
};

export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
};

export const validatePriceRange = (min, max) => {
  const minNum = parseFloat(min);
  const maxNum = parseFloat(max);

  if (!isNaN(minNum) && minNum < 0) {
    return { valid: false, error: 'Minimum price cannot be negative' };
  }
  if (!isNaN(maxNum) && maxNum < 0) {
    return { valid: false, error: 'Maximum price cannot be negative' };
  }
  if (!isNaN(minNum) && !isNaN(maxNum) && minNum > maxNum) {
    return { valid: false, error: 'Minimum price cannot exceed maximum price' };
  }
  return { valid: true, error: null };
};
