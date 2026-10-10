const app = require('../server/app');
const { connectDB } = require('../server/config/db');
const { ensureAtlasUsers } = require('../server/utils/userStore');

let isInitialized = false;

module.exports = async (req, res) => {
  if (!isInitialized) {
    try {
      await connectDB();
      await ensureAtlasUsers();
      isInitialized = true;
    } catch (err) {
      console.error('[Vercel Serverless API] Startup error:', err.message);
    }
  }
  return app(req, res);
};
