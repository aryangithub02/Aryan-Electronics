import { formatCurrency, calculateDiscountPrice, formatRating, truncateText } from '../src/utils/formatters';
import { validateEmail, validateSearchQuery, validatePriceRange } from '../src/utils/validators';

describe('Utility Functions Tests', () => {
  describe('Formatters', () => {
    it('formatCurrency formats INR and USD correctly', () => {
      expect(formatCurrency(1499.99)).toMatch(/₹\s?1,499\.99/);
      expect(formatCurrency(0)).toMatch(/₹\s?0\.00/);
      expect(formatCurrency(null)).toMatch(/₹\s?0\.00/);
      expect(formatCurrency(1499.99, 'USD')).toBe('$1,499.99');
    });

    it('calculateDiscountPrice computes discounted price', () => {
      expect(calculateDiscountPrice(100, 10)).toBe(90);
      expect(calculateDiscountPrice(200, 0)).toBe(200);
      expect(calculateDiscountPrice(100, null)).toBe(100);
    });

    it('formatRating formats numbers to 1 decimal place', () => {
      expect(formatRating(4.85)).toBe('4.8');
      expect(formatRating(5)).toBe('5.0');
      expect(formatRating(null)).toBe('0.0');
    });

    it('truncateText trims text longer than limit', () => {
      expect(truncateText('Hello World', 5)).toBe('Hello...');
      expect(truncateText('Short', 10)).toBe('Short');
    });
  });

  describe('Validators', () => {
    it('validateEmail checks standard email patterns', () => {
      expect(validateEmail('test@aryan.com')).toBe(true);
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });

    it('validateSearchQuery strips tags and trims whitespace', () => {
      expect(validateSearchQuery('  laptop  ')).toBe('laptop');
      expect(validateSearchQuery('<script>alert</script>')).toBe('scriptalert/script');
    });

    it('validatePriceRange validates range bounds', () => {
      expect(validatePriceRange(10, 50).valid).toBe(true);
      expect(validatePriceRange(-5, 50).valid).toBe(false);
      expect(validatePriceRange(100, 50).valid).toBe(false);
    });
  });
});
