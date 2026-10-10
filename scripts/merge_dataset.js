/**
 * Aryan Electronics - Merge 100 Verified Products into Master Dataset
 */

const fs = require('fs');
const path = require('path');
const { loadAndValidateProducts } = require('../server/data/importProducts');

const masterJsonPath = path.resolve(__dirname, '../aryan_electronics_products.json');
const newProductsPath = path.resolve(__dirname, 'verified_100_progress.json');

const masterRaw = JSON.parse(fs.readFileSync(masterJsonPath, 'utf8'));
const baseProducts = Array.isArray(masterRaw.products) ? masterRaw.products : masterRaw;

console.log(`Original products in master dataset: ${baseProducts.length}`);

const newProducts = JSON.parse(fs.readFileSync(newProductsPath, 'utf8'));
console.log(`New verified products to append: ${newProducts.length}`);

// Ensure base products only contain IDs 1-100
const cleanBaseProducts = baseProducts.filter(p => Number(p.id) <= 100);
console.log(`Base products after ensuring IDs <= 100: ${cleanBaseProducts.length}`);

// Combine
const mergedProducts = [...cleanBaseProducts, ...newProducts];
console.log(`Total merged products: ${mergedProducts.length}`);

// Write to aryan_electronics_products.json
masterRaw.products = mergedProducts;
fs.writeFileSync(masterJsonPath, JSON.stringify(masterRaw, null, 2), 'utf8');
console.log(`Successfully written ${mergedProducts.length} products to aryan_electronics_products.json.`);

// Validate with importProducts validation engine
const { products, summary } = loadAndValidateProducts(masterJsonPath);
console.log('\n--- Validation Engine Report ---');
console.log(`Total records analyzed: ${summary.totalRecords}`);
console.log(`Successfully imported:  ${summary.successfullyImported}`);
console.log(`Failed / Invalid:       ${summary.failed}`);
console.log(`Duplicate records:      ${summary.duplicateRecords}`);
console.log(`Missing images:         ${summary.missingImages}`);

if (summary.failed > 0 || summary.duplicateRecords > 0 || summary.missingImages > 0) {
  console.error('Validation errors:', summary.errors);
  process.exit(1);
} else {
  console.log('✓ Master dataset passes 100% of validation rules with 0 errors!');
}
