/**
 * Aryan Electronics - Aggregation Cache Manager
 * Provides in-memory TTL caching with configurable expiration, statistics, and automatic pruning
 */

class AggregationCache {
  constructor(defaultTtlMs = 10 * 60 * 1000) { // default 10 minutes
    this.cache = new Map();
    this.defaultTtlMs = defaultTtlMs;
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      evictions: 0
    };
  }

  generateKey(prefix, params = {}) {
    const sortedKeys = Object.keys(params).sort();
    const queryParts = sortedKeys
      .filter((k) => params[k] !== undefined && params[k] !== null && params[k] !== '')
      .map((k) => `${k}=${String(params[k]).toLowerCase().trim()}`);
    return `${prefix}:${queryParts.join('&')}`;
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) {
      this.stats.misses++;
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.stats.evictions++;
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
    return entry.value;
  }

  set(key, value, ttlMs = this.defaultTtlMs) {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
      createdAt: Date.now()
    });
    this.stats.sets++;
    return value;
  }

  has(key) {
    const entry = this.cache.get(key);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.stats.evictions++;
      return false;
    }
    return true;
  }

  invalidate(prefix) {
    let count = 0;
    for (const key of this.cache.keys()) {
      if (!prefix || key.startsWith(prefix)) {
        this.cache.delete(key);
        count++;
      }
    }
    return count;
  }

  clear() {
    const size = this.cache.size;
    this.cache.clear();
    return size;
  }

  getStats() {
    return {
      size: this.cache.size,
      ...this.stats,
      hitRate: this.stats.hits + this.stats.misses > 0
        ? Number(((this.stats.hits / (this.stats.hits + this.stats.misses)) * 100).toFixed(2))
        : 0
    };
  }
}

module.exports = AggregationCache;
