const mongoose = require('mongoose');

let isConnected = false;
let connectionMode = 'disconnected';

/**
 * Connect to MongoDB with graceful fallback to in-memory store
 * when no local or remote MongoDB service is running.
 */
const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return { status: 'already_connected', mode: connectionMode };
  }

  // In test environment without explicit MONGODB_URI, skip timeout and use fast in-memory store
  if (process.env.NODE_ENV === 'test' && !process.env.TEST_MONGODB_URI) {
    isConnected = false;
    connectionMode = 'in-memory-fallback';
    return { status: 'mock_mode', mode: 'in-memory-fallback' };
  }

  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aryan_electronics';

  try {
    console.log(`[Database] Attempting connection to MongoDB at: ${uri}`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000
    });

    isConnected = true;
    connectionMode = 'live';
    console.log(`[Database] Connected to live MongoDB: ${mongoose.connection.host}/${mongoose.connection.name}`);
    return { status: 'connected', mode: 'live' };
  } catch (err) {
    console.warn(`[Database] Live MongoDB connection unavailable (${err.message}).`);
    console.log('[Database] Active fallback mode: In-Memory Product Repository activated for development/testing.');
    isConnected = false;
    connectionMode = 'in-memory-fallback';
    return { status: 'mock_mode', mode: 'in-memory-fallback' };
  }
};

/**
 * Disconnect from database (clean teardown for tests)
 */
const disconnectDB = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    isConnected = false;
    connectionMode = 'disconnected';
    console.log('[Database] Disconnected successfully.');
  } catch (err) {
    console.error('[Database] Error disconnecting:', err.message);
  }
};

/**
 * Get current database status summary
 */
const getDbStatus = () => {
  const readyStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const stateNumber = mongoose.connection.readyState;
  const isReady = stateNumber === 1;

  return {
    connected: isReady || connectionMode === 'in-memory-fallback',
    state: isReady ? 'connected' : (connectionMode === 'in-memory-fallback' ? 'in-memory-active' : readyStates[stateNumber] || 'disconnected'),
    mode: connectionMode,
    host: isReady ? mongoose.connection.host : 'local-memory',
    database: isReady ? mongoose.connection.name : 'aryan_electronics'
  };
};

module.exports = {
  connectDB,
  disconnectDB,
  getDbStatus
};
