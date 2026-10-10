/**
 * Aryan Electronics - Intelligent Search & Suggestions Engine
 * Multi-token weighted relevance ranking, spelling tolerance, and auto-complete suggestions.
 */

// Common electronics terminology spelling correction dictionary
const COMMON_TYPO_CORRECTIONS = {
  'samusng': 'samsung',
  'samsng': 'samsung',
  'macbok': 'macbook',
  'macbk': 'macbook',
  'croebook': 'chromebook',
  'chrombok': 'chromebook',
  'rasperry': 'raspberry',
  'rasberry': 'raspberry',
  'audino': 'arduino',
  'ardunio': 'arduino',
  'ipone': 'iphone',
  'hedphone': 'headphone',
  'headfone': 'headphone',
  'erabuds': 'earbuds',
  'earbud': 'earbuds',
  'blutooth': 'bluetooth',
  'lapotp': 'laptop',
  'laptp': 'laptop',
  'moniter': 'monitor',
  'keybord': 'keyboard',
  'camra': 'camera',
  'senser': 'sensor'
};

/**
 * Calculate Levenshtein edit distance between two strings
 */
function levenshteinDistance(a, b) {
  if (!a || !b) return (a || '').length + (b || '').length;
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

/**
 * Normalize and correct search query using common electronics dictionary
 */
function preprocessSearchQuery(query = '') {
  const clean = String(query).toLowerCase().trim().replace(/[^\w\s-]/g, ' ');
  const tokens = clean.split(/\s+/).filter(Boolean);

  const correctedTokens = tokens.map((token) => {
    if (COMMON_TYPO_CORRECTIONS[token]) {
      return COMMON_TYPO_CORRECTIONS[token];
    }
    return token;
  });

  return {
    raw: query,
    cleaned: clean,
    normalized: correctedTokens.join(' '),
    tokens: correctedTokens
  };
}

/**
 * Calculate relevance score for a product against a search query
 */
function calculateRelevanceScore(product, processedQuery) {
  const { normalized, tokens } = processedQuery;
  if (!normalized || tokens.length === 0) return 0;

  let score = 0;
  const title = (product.title || '').toLowerCase();
  const brand = (product.brand || '').toLowerCase();
  const category = (product.category || '').toLowerCase();
  const sector = (product.sector || '').toLowerCase();
  const description = (product.description || '').toLowerCase();
  const sku = (product.SKU || product.sku || '').toLowerCase();

  // Specs text
  const specsText = Array.isArray(product.specifications)
    ? product.specifications.map((s) => `${s.name || ''} ${s.value || ''}`.toLowerCase()).join(' ')
    : '';

  // Features text
  const featuresText = Array.isArray(product.features)
    ? product.features.map((f) => String(f).toLowerCase()).join(' ')
    : '';

  // Exact full query match boosts
  if (title === normalized) score += 120;
  else if (title.startsWith(normalized)) score += 90;
  else if (title.includes(normalized)) score += 70;

  if (sku === normalized) score += 110;
  if (brand === normalized) score += 60;
  else if (brand.includes(normalized)) score += 40;

  if (category.includes(normalized)) score += 45;
  if (sector.includes(normalized)) score += 30;

  // Multi-token evaluation
  let matchedTokensCount = 0;
  for (const token of tokens) {
    let tokenMatched = false;

    if (title.includes(token)) {
      score += 25;
      tokenMatched = true;
    }
    if (brand.includes(token)) {
      score += 20;
      tokenMatched = true;
    }
    if (category.includes(token)) {
      score += 15;
      tokenMatched = true;
    }
    if (specsText.includes(token)) {
      score += 12;
      tokenMatched = true;
    }
    if (featuresText.includes(token)) {
      score += 10;
      tokenMatched = true;
    }
    if (description.includes(token)) {
      score += 5;
      tokenMatched = true;
    }

    // Fuzzy matching for longer tokens if not directly matched
    if (!tokenMatched && token.length >= 4) {
      // Check title words
      const titleWords = title.split(/\s+/);
      for (const tw of titleWords) {
        if (tw.length >= 4 && Math.abs(tw.length - token.length) <= 1) {
          if (levenshteinDistance(tw, token) <= 1) {
            score += 15;
            tokenMatched = true;
            break;
          }
        }
      }
    }

    if (tokenMatched) matchedTokensCount++;
  }

  // Bonus if ALL query tokens matched somewhere in product
  if (matchedTokensCount === tokens.length && tokens.length > 1) {
    score += 35;
  }

  return score;
}

/**
 * Filter and sort products using intelligent relevance ranking
 */
function searchProductsWithRelevance(products = [], query = '') {
  if (!query || !query.trim()) {
    return products;
  }

  const processed = preprocessSearchQuery(query);
  const scored = [];

  for (const product of products) {
    const relevance = calculateRelevanceScore(product, processed);
    if (relevance > 0) {
      scored.push({ product, relevance });
    }
  }

  // Sort by highest relevance score descending
  scored.sort((a, b) => b.relevance - a.relevance);

  return scored.map((s) => s.product);
}

/**
 * Generate instant search auto-completions, suggestions, and matched entities
 */
function generateSearchSuggestions(products = [], query = '', limit = 6) {
  if (!query || query.trim().length < 2) {
    return {
      query: '',
      correctedQuery: null,
      suggestions: [],
      categories: [],
      brands: [],
      instantProducts: []
    };
  }

  const processed = preprocessSearchQuery(query);
  const qClean = processed.normalized;

  const matchedSuggestions = new Set();
  const matchedCategories = new Set();
  const matchedBrands = new Set();
  const instantProducts = [];

  // Identify corrected query if typos were detected
  const correctedQuery = processed.raw.toLowerCase() !== qClean ? qClean : null;

  for (const prod of products) {
    const title = (prod.title || '').trim();
    const brand = (prod.brand || '').trim();
    const category = (prod.category || '').trim();

    // Brand matching
    if (brand.toLowerCase().includes(qClean)) {
      matchedBrands.add(brand);
      matchedSuggestions.add(`${brand}`);
    }

    // Category matching
    if (category.toLowerCase().includes(qClean)) {
      matchedCategories.add(category);
      matchedSuggestions.add(`${category}`);
    }

    // Title / Model matching
    if (title.toLowerCase().includes(qClean)) {
      matchedSuggestions.add(title);
      if (instantProducts.length < 4) {
        instantProducts.push({
          id: prod.id || prod._id,
          title: prod.title,
          brand: prod.brand,
          sector: prod.sector,
          category: prod.category,
          price: prod.price,
          thumbnail: prod.thumbnail || prod.images?.[0] || '',
          rating: prod.rating
        });
      }
    }
  }

  return {
    query: processed.raw,
    correctedQuery,
    suggestions: Array.from(matchedSuggestions).slice(0, limit),
    categories: Array.from(matchedCategories).slice(0, 4),
    brands: Array.from(matchedBrands).slice(0, 4),
    instantProducts
  };
}

/**
 * Correct spelling of a single electronics word or query
 */
function correctSpelling(word = '') {
  const clean = String(word).toLowerCase().trim();
  if (COMMON_TYPO_CORRECTIONS[clean]) {
    return COMMON_TYPO_CORRECTIONS[clean];
  }
  for (const [typo, fixed] of Object.entries(COMMON_TYPO_CORRECTIONS)) {
    if (levenshteinDistance(clean, typo) <= 1) {
      return fixed;
    }
  }
  return clean;
}

module.exports = {
  COMMON_TYPO_CORRECTIONS,
  levenshteinDistance,
  preprocessSearchQuery,
  calculateRelevanceScore,
  searchProductsWithRelevance,
  generateSearchSuggestions,
  correctSpelling
};
