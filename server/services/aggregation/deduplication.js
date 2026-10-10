/**
 * Aryan Electronics - Product Deduplication & Multi-Seller Matching Engine
 * Safely compares products using model identifiers, brand matching, and spec tokens
 * Consolidates multiple seller offers into unified comparison records
 */

/**
 * Clean and normalize product title for token comparison
 */
function normalizeString(str) {
  if (!str) return '';
  return String(str)
    .toLowerCase()
    .replace(/[^\w\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extract model numbers, chipsets, or alphanumeric hardware codes from titles
 * e.g., "M3 Max", "RTX 4070", "WH-1000XM4", "A15", "SM7B", "87V"
 */
function extractModelIdentifiers(title) {
  if (!title) return [];
  const text = String(title);
  // Match patterns like WH-1000XM4, M3, RTX-4070, A15, 87V, etc.
  const regex = /\b([A-Za-z0-9]+[-/][A-Za-z0-9]+|[A-Za-z]+[0-9]+[A-Za-z0-9]*|[0-9]+[A-Za-z]+[0-9]*)\b/g;
  const matches = text.match(regex) || [];
  return Array.from(new Set(matches.map((m) => m.toLowerCase().replace(/[-/]/g, ''))));
}

/**
 * Determine if two products are identical models eligible for multi-seller offer consolidation
 */
function areProductsMatching(prodA, prodB) {
  if (!prodA || !prodB) return false;

  // 1. Check exact ID or SKU match
  const idA = String(prodA.id || prodA.externalId || '').toLowerCase();
  const idB = String(prodB.id || prodB.externalId || '').toLowerCase();
  if (idA && idB && idA === idB) return true;

  const skuA = String(prodA.SKU || prodA.sku || '').toLowerCase();
  const skuB = String(prodB.SKU || prodB.sku || '').toLowerCase();
  if (skuA && skuB && skuA === skuB) return true;

  // 2. Brand must match (if both specify brand)
  const brandA = normalizeString(prodA.brand);
  const brandB = normalizeString(prodB.brand);
  if (brandA && brandB && brandA !== brandB) {
    return false;
  }

  // 3. Sector must match (or one is General)
  const secA = normalizeString(prodA.sector);
  const secB = normalizeString(prodB.sector);
  if (secA && secB && secA !== secB) {
    return false;
  }

  // 4. Model Identifier comparison
  const titleA = normalizeString(prodA.title);
  const titleB = normalizeString(prodB.title);

  // Exact normalized title match
  if (titleA === titleB) return true;

  // Check hardware model codes (e.g. WH-1000XM4, SM7B)
  const modelsA = extractModelIdentifiers(prodA.title);
  const modelsB = extractModelIdentifiers(prodB.title);

  if (modelsA.length > 0 && modelsB.length > 0) {
    const hasSharedModel = modelsA.some((mA) => modelsB.includes(mA));
    if (hasSharedModel) {
      // Shared model code + same brand = verified match!
      if (brandA && brandB && brandA === brandB) {
        return true;
      }
    }
  }

  // High token overlap (Jaccard similarity > 0.8) for titles of the same brand
  if (brandA && brandB && brandA === brandB) {
    const tokensA = new Set(titleA.split(' ').filter((t) => t.length > 2));
    const tokensB = new Set(titleB.split(' ').filter((t) => t.length > 2));
    const intersection = new Set([...tokensA].filter((x) => tokensB.has(x)));
    const union = new Set([...tokensA, ...tokensB]);
    const jaccard = union.size > 0 ? intersection.size / union.size : 0;
    if (jaccard >= 0.8) {
      return true;
    }
  }

  return false;
}

/**
 * Merge multiple seller offers from secondary product into target product
 */
function mergeProductOffers(target, incoming) {
  const existingOfferUrls = new Set(
    (target.sellers || []).map((s) => s.url?.toLowerCase().trim())
  );

  const incomingOffers = (incoming.sellers || []).filter(
    (s) => s && s.name && (!s.url || !existingOfferUrls.has(s.url.toLowerCase().trim()))
  );

  target.sellers = [...(target.sellers || []), ...incomingOffers];

  // If target has no price or incoming offer has better price, maintain reference
  if ((target.price === null || target.price === undefined) && incoming.price) {
    target.price = incoming.price;
  }

  // Merge sources
  const existingSourceUrls = new Set((target.sources || []).map((src) => src.url));
  const newSources = (incoming.sources || []).filter(
    (src) => src && src.url && !existingSourceUrls.has(src.url)
  );
  target.sources = [...(target.sources || []), ...newSources];

  // Mark as multi-source aggregated
  if (!target.providers) {
    target.providers = [target.provider || 'local'];
  }
  if (incoming.provider && !target.providers.includes(incoming.provider)) {
    target.providers.push(incoming.provider);
  }

  return target;
}

/**
 * Deduplicate an array of products and consolidate multi-seller offers
 * Preserves local catalog items as the canonical base records
 */
function deduplicateProducts(products = []) {
  if (!Array.isArray(products) || products.length <= 1) {
    return products;
  }

  const consolidated = [];

  for (const item of products) {
    let matchedIndex = -1;

    for (let i = 0; i < consolidated.length; i++) {
      if (areProductsMatching(consolidated[i], item)) {
        matchedIndex = i;
        break;
      }
    }

    if (matchedIndex !== -1) {
      // Consolidate into existing product
      mergeProductOffers(consolidated[matchedIndex], item);
    } else {
      // Add as new unique product record
      consolidated.push({
        ...item,
        providers: [item.provider || 'local']
      });
    }
  }

  return consolidated;
}

module.exports = {
  normalizeString,
  extractModelIdentifiers,
  areProductsMatching,
  mergeProductOffers,
  deduplicateProducts
};
