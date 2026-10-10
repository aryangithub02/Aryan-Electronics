const mongoose = require('mongoose');
const Product = require('../models/Product');
const sampleProducts = require('../data/sampleProducts');

const isDbConnected = () => {
  return mongoose.connection.readyState === 1;
};

/**
 * Resolve an array of product IDs to full product documents, preserving input order
 * and filtering out non-existent/removed products safely.
 */
const resolveProducts = async (productIds = []) => {
  if (!Array.isArray(productIds) || productIds.length === 0) {
    return [];
  }

  let catalog = [];

  const strIds = productIds.map(String);

  if (isDbConnected()) {
    catalog = await Product.find({
      $or: [{ id: { $in: strIds } }, { SKU: { $in: strIds } }]
    });
  } else {
    catalog = sampleProducts.filter(
      (p) =>
        strIds.includes(String(p.id)) ||
        (p.SKU && strIds.includes(p.SKU)) ||
        (p.sku && strIds.includes(p.sku))
    );
  }

  const map = new Map();
  catalog.forEach((item) => {
    map.set(String(item.id), item);
    if (item.SKU) map.set(item.SKU, item);
    if (item.sku) map.set(item.sku, item);
  });

  // Preserve order of incoming productIds and ignore missing
  const results = [];
  productIds.forEach(id => {
    if (map.has(id)) {
      results.push(map.get(id));
    }
  });

  return results;
};

module.exports = {
  resolveProducts
};
