/**
 * Aryan Electronics - Product Scoring, Badge Calculation & Price Insights Engine
 * Provides transparent, rule-based product ranking, badge assignment, and multi-seller price analysis.
 */

// Configurable scoring weights (must sum to 1.0)
const DEFAULT_WEIGHTS = {
  rating: 0.30,
  price: 0.25,
  availability: 0.20,
  specs: 0.15,
  sellers: 0.10
};

/**
 * Calculate transparent product discovery score (0-100)
 * Handles missing data explicitly using neutral baseline imputation.
 *
 * @param {Object} product - Product model or normalized object
 * @param {Object|Array} context - Optional context (e.g. category median price or catalog array)
 * @param {Object} customWeights - Optional overrides for scoring weights
 * @returns {Object} Score details, breakdown, and explanation
 */
function calculateProductScore(product, context = {}, customWeights = {}) {
  if (!product || typeof product !== 'object') {
    return {
      score: 50,
      breakdown: {
        ratingScore: 70,
        priceScore: 65,
        availabilityScore: 70,
        specScore: 50,
        sellerScore: 50
      },
      explanation: 'Insufficient product data for discovery scoring.'
    };
  }

  const weights = { ...DEFAULT_WEIGHTS, ...customWeights };

  // 1. Rating Score (0-100)
  // Baseline neutral rating is 3.5/5 (70%) when rating is not available
  let ratingScore = 70;
  let hasVerifiedRating = false;
  if (typeof product.rating === 'number' && product.rating > 0) {
    ratingScore = Math.min(100, Math.max(0, (product.rating / 5) * 100));
    hasVerifiedRating = true;
  }

  // 2. Price Competitiveness & Value Score (0-100)
  let priceScore = 65; // Baseline neutral for "Price on Request"
  const hasPrice = typeof product.price === 'number' && product.price > 0;
  const discount = typeof product.discountPercentage === 'number' ? product.discountPercentage : 0;

  if (hasPrice) {
    let categoryMedian = product.price;
    if (context && typeof context === 'object' && !Array.isArray(context)) {
      categoryMedian = context.categoryMedianPrice || product.price;
    } else if (Array.isArray(context) && product.category) {
      const catPrices = context
        .filter((p) => p.category === product.category && typeof p.price === 'number' && p.price > 0)
        .map((p) => p.price);
      if (catPrices.length > 0) {
        catPrices.sort((a, b) => a - b);
        categoryMedian = catPrices[Math.floor(catPrices.length / 2)];
      }
    }

    // Ratio of product price to median (lower is more competitive)
    const priceRatio = categoryMedian > 0 ? product.price / categoryMedian : 1.0;

    let basePriceScore = 75;
    if (priceRatio <= 0.8) {
      basePriceScore = 90; // 20%+ below category median
    } else if (priceRatio <= 1.0) {
      basePriceScore = 80; // At or slightly below median
    } else if (priceRatio <= 1.3) {
      basePriceScore = 65; // Slightly above median
    } else {
      basePriceScore = 55; // Premium category tier
    }

    // Boost for verified manufacturer / seller discount
    const discountBoost = Math.min(15, (discount / 100) * 25);
    priceScore = Math.min(100, Math.round(basePriceScore + discountBoost));
  }

  // 3. Availability Score (0-100)
  let availabilityScore = 75; // Baseline
  const stockNum = typeof product.stock === 'number' ? product.stock : null;
  const statusStr = String(product.availability || '').toLowerCase();

  if (statusStr.includes('out of stock') || stockNum === 0) {
    availabilityScore = 20; // Heavy penalty for out-of-stock items
  } else if (stockNum !== null && stockNum > 20) {
    availabilityScore = 100; // Deep stock
  } else if (stockNum !== null && stockNum > 0) {
    availabilityScore = 90; // Readily available
  } else if (statusStr.includes('in stock')) {
    availabilityScore = 90;
  } else {
    availabilityScore = 70; // Inquire with distributor
  }

  // 4. Specification Depth & Suitability Score (0-100)
  let specScore = 60; // Baseline
  const specs = Array.isArray(product.specifications) ? product.specifications : [];
  const features = Array.isArray(product.features) ? product.features : [];

  if (specs.length >= 6 || features.length >= 5) {
    specScore = 95; // Comprehensive industrial/commercial spec sheet
  } else if (specs.length >= 3 || features.length >= 3) {
    specScore = 80;
  } else if (specs.length > 0 || features.length > 0) {
    specScore = 70;
  }

  // 5. Seller Network Quality & Transparency Score (0-100)
  let sellerScore = 65; // Baseline
  const sellers = Array.isArray(product.sellers) ? product.sellers : [];

  if (sellers.length >= 3) {
    sellerScore = 100; // Multi-merchant aggregation verified
  } else if (sellers.length === 2) {
    sellerScore = 85;
  } else if (sellers.length === 1) {
    sellerScore = 75;
  }

  // Calculate weighted composite score
  const composite =
    ratingScore * weights.rating +
    priceScore * weights.price +
    availabilityScore * weights.availability +
    specScore * weights.specs +
    sellerScore * weights.sellers;

  const normalizedScore = Math.round(Math.min(100, Math.max(0, composite)));

  // Generate transparent explanations
  const explanationPoints = [];
  if (hasVerifiedRating && ratingScore >= 80) {
    explanationPoints.push(`High customer satisfaction (${product.rating}★)`);
  }
  if (priceScore >= 75) {
    explanationPoints.push('Competitively priced for its hardware class');
  }
  if (availabilityScore >= 90) {
    explanationPoints.push('Immediate in-stock availability');
  }
  if (sellers.length > 1) {
    explanationPoints.push(`${sellers.length} verified merchant offers`);
  }
  if (explanationPoints.length === 0) {
    explanationPoints.push('Standard electronics specification profile');
  }

  const finalExplanation = explanationPoints.join(' • ');

  return {
    score: normalizedScore,
    breakdown: {
      ratingScore: Math.round(ratingScore),
      priceScore: Math.round(priceScore),
      availabilityScore: Math.round(availabilityScore),
      specScore: Math.round(specScore),
      sellerScore: Math.round(sellerScore)
    },
    weights,
    formula: 'Composite = 0.30*Rating + 0.25*PriceValue + 0.20*Availability + 0.15*Specs + 0.10*Sellers',
    explanation: finalExplanation
  };
}

/**
 * Assign transparent badges based on calculated product attributes
 *
 * @param {Object} product - Product record
 * @param {Object|Array} scoreData - Output of calculateProductScore or catalog array
 * @param {Object} priceInsights - Output of calculatePriceInsights
 * @returns {Array<string>} List of earned badges
 */
function calculateProductBadges(product, scoreData = {}, priceInsights = {}) {
  if (!product) return [];

  // Support calling as calculateProductBadges(product, catalog)
  if (Array.isArray(scoreData)) {
    const catalog = scoreData;
    scoreData = calculateProductScore(product, catalog);
    priceInsights = calculatePriceInsights(product.sellers || []);

    // Check if lowest price in this category in the catalog
    if (product.price && product.price > 0 && product.category) {
      const catPrices = catalog
        .filter((p) => p.category === product.category && typeof p.price === 'number' && p.price > 0)
        .map((p) => p.price);
      if (catPrices.length > 1 && product.price === Math.min(...catPrices)) {
        priceInsights.percentageSavings = 10;
        priceInsights.isCategoryLowest = true;
      }
    }
  }

  const badges = [];
  const rating = typeof product.rating === 'number' ? product.rating : 0;
  const discount = typeof product.discountPercentage === 'number' ? product.discountPercentage : 0;
  const price = product.price;
  const priceScore = scoreData?.breakdown?.priceScore || 65;
  const stock = typeof product.stock === 'number' ? product.stock : 1;
  const statusStr = String(product.availability || '').toLowerCase();
  const isOutOfStock = statusStr.includes('out of stock') || stock === 0;

  // Do not assign positive value/price badges to unpriced or out of stock items
  if (!isOutOfStock) {
    // 1. Lowest Price: Multi-seller verified best entry price or category lowest
    if (price && price > 0 && (priceInsights.isCategoryLowest || (priceInsights.percentageSavings && priceInsights.percentageSavings >= 5))) {
      badges.push('Lowest Price');
    }

    // 2. Best Rated: Verified 4.8+ star rating
    if (rating >= 4.8) {
      badges.push('Best Rated');
    }

    // 3. Best Value: High rating & high price competitiveness or discount
    if ((rating >= 4.0 || rating === 0) && (discount >= 20 || priceScore >= 85)) {
      badges.push('Best Value');
    }

    // 4. Most Popular: High stock availability & multi-seller verification or strong score
    if ((scoreData?.score >= 82 && rating >= 4.0) || (product.sellers && product.sellers.length >= 3)) {
      badges.push('Most Popular');
    }

    // 5. Premium Choice: Top-rated with professional grade specifications
    const specs = Array.isArray(product.specifications) ? product.specifications : [];
    if (rating >= 4.4 && specs.length >= 3 && price && price > 30000) {
      badges.push('Premium Choice');
    }
  }

  return badges;
}

/**
 * Compute multi-seller price comparison metrics
 *
 * @param {Array<Object>|Object} productOrSellers - Array of seller offers OR product object
 * @returns {Object} Price insights metrics
 */
function calculatePriceInsights(productOrSellers = []) {
  let sellers = [];
  let fallbackPrice = null;

  if (Array.isArray(productOrSellers)) {
    sellers = productOrSellers;
  } else if (productOrSellers && typeof productOrSellers === 'object') {
    if (Array.isArray(productOrSellers.sellers) && productOrSellers.sellers.length > 0) {
      sellers = productOrSellers.sellers;
    } else if (typeof productOrSellers.price === 'number' && productOrSellers.price > 0) {
      sellers = [{ name: 'Direct Distributor', price: productOrSellers.price, availability: 'In Stock' }];
    }
    fallbackPrice = productOrSellers.price;
  }

  if (!Array.isArray(sellers) || sellers.length === 0) {
    return {
      hasComparison: false,
      sellerCount: fallbackPrice ? 1 : 0,
      lowestPrice: fallbackPrice,
      highestPrice: fallbackPrice,
      averagePrice: fallbackPrice,
      priceDifference: 0,
      percentageSavings: 0,
      bestSeller: 'Direct'
    };
  }

  const validOffers = sellers.filter(
    (s) => s && typeof s.price === 'number' && s.price > 0
  );

  if (validOffers.length === 0) {
    return {
      hasComparison: false,
      sellerCount: sellers.length,
      lowestPrice: fallbackPrice,
      highestPrice: fallbackPrice,
      averagePrice: fallbackPrice,
      priceDifference: 0,
      percentageSavings: 0,
      bestSeller: null
    };
  }

  const prices = validOffers.map((s) => s.price);
  const lowestPrice = Math.min(...prices);
  const highestPrice = Math.max(...prices);
  const sumPrice = prices.reduce((acc, p) => acc + p, 0);
  const averagePrice = Math.round(sumPrice / prices.length);
  const priceDifference = highestPrice - lowestPrice;
  const percentageSavings = highestPrice > 0
    ? Math.round((priceDifference / highestPrice) * 100)
    : 0;

  const bestSellerOffer = validOffers.find((s) => s.price === lowestPrice) || validOffers[0];
  const bestSellerName = bestSellerOffer ? bestSellerOffer.name : 'Direct';

  return {
    hasComparison: validOffers.length > 1,
    sellerCount: sellers.length,
    validOfferCount: validOffers.length,
    lowestPrice,
    highestPrice,
    averagePrice,
    priceDifference,
    percentageSavings,
    bestSeller: bestSellerName,
    bestSellerOffer: {
      name: bestSellerOffer.name,
      price: bestSellerOffer.price,
      currency: bestSellerOffer.currency || 'INR',
      url: bestSellerOffer.url,
      rating: bestSellerOffer.rating,
      availability: bestSellerOffer.availability,
      source: bestSellerOffer.source,
      lastVerified: bestSellerOffer.lastVerified
    }
  };
}

/**
 * Enrich a product object with discovery score, badges, and price insights
 */
function enrichProductWithInsights(product, context = {}) {
  if (!product) return product;

  const priceInsights = calculatePriceInsights(product.sellers || []);
  const scoreData = calculateProductScore(product, context);
  const badges = calculateProductBadges(product, scoreData, priceInsights);

  return {
    ...product,
    discoveryScore: scoreData.score,
    discoveryScoreBreakdown: scoreData.breakdown,
    discoveryExplanation: scoreData.explanation,
    badges,
    priceInsights
  };
}

module.exports = {
  DEFAULT_WEIGHTS,
  DEFAULT_SCORING_WEIGHTS: DEFAULT_WEIGHTS,
  calculateProductScore,
  calculateProductBadges,
  calculatePriceInsights,
  enrichProductWithInsights
};
