/**
 * Aryan Electronics - Database Seeding Runner
 * Seeds MongoDB with the real product catalog from aryan_electronics_products.json
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { seedDatabase } = require('./importProducts');

if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('[Seed] Seeding sequence finished.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Seed] Seeding sequence failed:', err.message);
      process.exit(1);
    });
}

module.exports = seedDatabase;
