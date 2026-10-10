/**
 * Aryan Electronics - Intelligent Product Recommendation Service
 * Computes similar products, budget-friendly alternatives, complementary hardware,
 * and personalized discovery with transparent relevance explanations.
 */

const { enrichProductWithInsights } = require('./scoringAndInsights');

/**
 * Complementary category mapping matrix for hardware ecosystems
 */
const COMPLEMENTARY_CATEGORIES = {
  'laptops & workstations': ['mobile & device accessories', 'audiophile headphones', 'development boards & iot', 'monitors'],
  'laptops': ['mobile & device accessories', 'audiophile headphones', 'development boards & iot', 'monitors'],
  'smartphones': ['mobile & device accessories', 'audiophile headphones', 'smart home devices'],
  'gaming consoles': ['audiophile headphones', 'mobile & device accessories', 'laptops & workstations'],
  'development boards & iot': ['sensors & modules', 'sensors', 'modules', 'smart home devices', 'power & batteries'],
  'development boards': ['sensors & modules', 'sensors', 'modules', 'smart home devices', 'power & batteries'],
  'sensors & modules': ['development boards', 'development boards & iot', 'microcontrollers'],
  'smart home devices': ['development boards & iot', 'sensors & modules', 'smartphones'],
  'audiophile headphones': ['smartphones', 'laptops & workstations', 'mobile & device accessories']
};

/**
 * Find Similar Products based on sector, category, brand, and specifications
 */
function getSimilarProducts(targetProduct, catalog = [], limit = 4) {
  if (!targetProduct || !Array.isArray(catalog)) return [];

  const targetId = String(targetProduct.id || targetProduct._id || '');
  const targetSector = (targetProduct.sector || '').toLowerCase();
  const targetCategory = (targetProduct.category || '').toLowerCase();
  const targetBrand = (targetProduct.brand || '').toLowerCase();
  const targetPrice = targetProduct.price || 0;

  const scored = [];

  for (const item of catalog) {
    const itemId = String(item.id || item._id || '');
    if (itemId === targetId) continue; // Exclude self

    let score = 0;
    const reasons = [];

    const itemSector = (item.sector || '').toLowerCase();
    const itemCategory = (item.category || '').toLowerCase();
    const itemBrand = (item.brand || '').toLowerCase();
    const itemPrice = item.price || 0;

    // 1. Same Sector is essential
    if (itemSector === targetSector) {
      score += 40;
    } else {
      continue; // Filter out products from completely unrelated sectors
    }

    // 2. Same Category is strong indicator of similarity
    if (itemCategory === targetCategory) {
      score += 50;
      reasons.push(`Same device category (${item.category})`);
    } else if (itemCategory.includes(targetCategory) || targetCategory.includes(itemCategory)) {
      score += 25;
    }

    // 3. Same Brand boost
    if (itemBrand && itemBrand === targetBrand) {
      score += 20;
      reasons.push(`Same brand ecosystem (${item.brand})`);
    }

    // 4. Price proximity (within 30%)
    if (targetPrice > 0 && itemPrice > 0) {
      const priceDiffRatio = Math.abs(itemPrice - targetPrice) / targetPrice;
      if (priceDiffRatio <= 0.15) {
        score += 20;
        reasons.push('Comparable price tier');
      } else if (priceDiffRatio <= 0.30) {
        score += 10;
      }
    }

    // 5. Specification overlaps
    const targetSpecs = Array.isArray(targetProduct.specifications) ? targetProduct.specifications : [];
    const itemSpecs = Array.isArray(item.specifications) ? item.specifications : [];
    let specOverlap = 0;

    for (const ts of targetSpecs) {
      const tsVal = String(ts.value || '').toLowerCase();
      for (const is of itemSpecs) {
        const isVal = String(is.value || '').toLowerCase();
        if (tsVal && isVal && (tsVal.includes(isVal) || isVal.includes(tsVal))) {
          specOverlap++;
          break;
        }
      }
    }

    if (specOverlap >= 2) {
      score += 15;
      reasons.push('Shared technical specifications');
    }

    if (score >= 40) {
      const explanation = reasons.length > 0
        ? reasons.slice(0, 2).join(' • ')
        : 'Similar electronic hardware in this class.';

      const enriched = enrichProductWithInsights(item);
      scored.push({
        ...enriched,
        product: enriched,
        score,
        recommendationReason: explanation,
        recommendationType: 'similar'
      });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

/**
 * Find Budget-Friendly Alternatives in the same or comparable category
 */
function getBudgetAlternatives(targetProduct, catalog = [], limit = 4) {
  if (!targetProduct || !Array.isArray(catalog)) return [];

  const targetId = String(targetProduct.id || targetProduct._id || '');
  const targetCategory = (targetProduct.category || '').toLowerCase();
  const targetSector = (targetProduct.sector || '').toLowerCase();
  const targetPrice = targetProduct.price;

  if (!targetPrice || targetPrice <= 0) return [];

  const scored = [];

  for (const item of catalog) {
    const itemId = String(item.id || item._id || '');
    if (itemId === targetId) continue;

    const itemPrice = item.price;
    if (!itemPrice || itemPrice >= targetPrice) continue; // Must be strictly lower in price

    const itemCategory = (item.category || '').toLowerCase();
    const itemSector = (item.sector || '').toLowerCase();

    // Must be in the same sector or same category
    if (itemCategory !== targetCategory && itemSector !== targetSector) continue;

    const priceSavings = targetPrice - itemPrice;
    const savingsPercentage = Math.round((priceSavings / targetPrice) * 100);

    // Consider alternatives offering 10% to 65% savings
    if (savingsPercentage < 10 || savingsPercentage > 75) continue;

    let score = 50;
    if (itemCategory === targetCategory) score += 30;
    if (item.rating && item.rating >= 3.8) score += 20;

    const formattedSavings = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(priceSavings);

    const enriched = enrichProductWithInsights(item);
    scored.push({
      ...enriched,
      product: enriched,
      score,
      recommendationReason: `Save ${savingsPercentage}% (${formattedSavings}) with comparable specifications`,
      recommendationType: 'budget_alternative',
      savingsPercentage,
      priceSavings,
      budgetSavings: priceSavings,
      percentageCheaper: savingsPercentage
    });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

/**
 * Find Complementary & Related Hardware
 */
function getRelatedProducts(targetProduct, catalog = [], limit = 4) {
  if (!targetProduct || !Array.isArray(catalog)) return [];

  const targetId = String(targetProduct.id || targetProduct._id || '');
  const targetSector = (targetProduct.sector || '').toLowerCase();
  const targetCategory = (targetProduct.category || '').toLowerCase();

  const matchedKey = Object.keys(COMPLEMENTARY_CATEGORIES).find(
    (k) => targetCategory === k || targetCategory.includes(k) || k.includes(targetCategory)
  );
  const complementaryCats = matchedKey ? COMPLEMENTARY_CATEGORIES[matchedKey] : [];

  const scored = [];

  for (const item of catalog) {
    const itemId = String(item.id || item._id || '');
    if (itemId === targetId) continue;

    const itemCategory = (item.category || '').toLowerCase();
    const itemSector = (item.sector || '').toLowerCase();

    // Don't recommend the exact same category
    if (itemCategory === targetCategory) continue;

    let isMatch = false;
    let reason = 'Complementary hardware';

    if (complementaryCats.some((c) => itemCategory.includes(c) || c.includes(itemCategory))) {
      isMatch = true;
      reason = `Compatible accessory for your ${targetProduct.category}`;
    } else if (itemSector === targetSector) {
      isMatch = true;
      reason = `Related hardware in ${item.sector}`;
    }

    if (isMatch) {
      const enriched = enrichProductWithInsights(item);
      scored.push({
        ...enriched,
        product: enriched,
        score: (item.rating || 4.0) * 10,
        recommendationReason: reason,
        recommendationType: 'related'
      });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

/**
 * Generate Personalized "You May Also Like" Recommendations based on user history
 * Gracefully falls back to top-rated items for new users
 */
function getPersonalizedRecommendations(userContext = {}, catalog = [], limit = 6) {
  if (!Array.isArray(catalog) || catalog.length === 0) return [];

  const { wishlist = [], savedProducts = [], recentlyViewed = [] } = userContext;

  // Collect interacted products
  const interactedItems = [...wishlist, ...savedProducts, ...recentlyViewed].filter(Boolean);
  const interactedIds = new Set(interactedItems.map((p) => String(p.id || p._id || '')));

  // Tally user preferences
  const sectorCounts = {};
  const brandCounts = {};

  for (const p of interactedItems) {
    if (p.sector) sectorCounts[p.sector] = (sectorCounts[p.sector] || 0) + 1;
    if (p.brand) brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
  }

  const topSectors = Object.keys(sectorCounts).sort((a, b) => sectorCounts[b] - sectorCounts[a]);
  const topBrands = Object.keys(brandCounts).sort((a, b) => brandCounts[b] - brandCounts[a]);

  const isNewUser = topSectors.length === 0 && topBrands.length === 0;

  const scored = [];

  for (const item of catalog) {
    const itemId = String(item.id || item._id || '');
    if (interactedIds.has(itemId)) continue; // Don't recommend items already interacted with

    let score = 0;
    let reason = 'Curated electronic discovery';

    if (isNewUser) {
      // New user fallback: score by rating, verified stock, and badge quality
      score = ((item.rating || 3.5) / 5) * 60 + ((item.stock || 0) > 0 ? 20 : 0);
      reason = `Top rated in ${item.sector || 'Electronics'}`;
    } else {
      if (item.sector && topSectors.includes(item.sector)) {
        score += 40;
        reason = `Based on your interest in ${item.sector}`;
      }
      if (item.brand && topBrands.includes(item.brand)) {
        score += 30;
        reason = `From your preferred brand ${item.brand}`;
      }
      score += ((item.rating || 3.5) / 5) * 30;
    }

    const enriched = enrichProductWithInsights(item);
    scored.push({
      ...enriched,
      product: enriched,
      score,
      recommendationReason: reason,
      recommendationType: 'for_you'
    });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

module.exports = {
  COMPLEMENTARY_CATEGORIES,
  getSimilarProducts,
  getBudgetAlternatives,
  getRelatedProducts,
  getPersonalizedRecommendations
};
