/**
 * Aryan Electronics - Base External Product Provider Adapter
 * Abstract foundation for all external API integrations
 * Enforces timeout policies, retry backoff, rate-limit awareness, and standardized normalization
 */

class BaseAdapter {
  constructor(name, options = {}) {
    if (!name) throw new Error('Adapter must have a name identifier');
    this.name = name;
    this.timeoutMs = options.timeoutMs || 5000;
    this.maxRetries = options.maxRetries !== undefined ? options.maxRetries : 2;
    this.retryDelayMs = options.retryDelayMs || 500;
    this.rateLimitedUntil = 0;
    this.isHealthy = true;
    this.lastHealthCheck = Date.now();
  }

  getName() {
    return this.name;
  }

  isConfigured() {
    return true;
  }

  isRateLimited() {
    return Date.now() < this.rateLimitedUntil;
  }

  markRateLimited(durationMs = 30000) {
    this.rateLimitedUntil = Date.now() + durationMs;
    console.warn(`[Adapter:${this.name}] Marked rate-limited until ${new Date(this.rateLimitedUntil).toISOString()}`);
  }

  /**
   * Resilient HTTP fetcher with timeout, retry logic, and rate-limit detection
   */
  async fetchWithRetry(url, options = {}, attempt = 1) {
    if (this.isRateLimited()) {
      throw new Error(`[Adapter:${this.name}] Temporarily paused due to rate limiting. Please retry later.`);
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), options.timeoutMs || this.timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'User-Agent': 'AryanElectronics-AggregationEngine/1.0 (+https://aryanelectronics.com)',
          'Accept': 'application/json',
          ...(options.headers || {})
        }
      });

      clearTimeout(timer);

      // Handle Rate Limiting (HTTP 429)
      if (response.status === 429) {
        const retryAfterSec = parseInt(response.headers.get('retry-after'), 10) || 30;
        this.markRateLimited(retryAfterSec * 1000);
        throw new Error(`[Adapter:${this.name}] Rate limit exceeded (HTTP 429)`);
      }

      if (!response.ok) {
        throw new Error(`[Adapter:${this.name}] HTTP Error ${response.status}: ${response.statusText}`);
      }

      this.isHealthy = true;
      this.lastHealthCheck = Date.now();
      return await response.json();
    } catch (err) {
      clearTimeout(timer);

      const isTimeout = err.name === 'AbortError';
      const isRetryable = isTimeout || err.message.includes('ECONNRESET') || err.message.includes('ETIMEDOUT');

      if (isRetryable && attempt <= this.maxRetries) {
        const backoff = this.retryDelayMs * Math.pow(2, attempt - 1);
        console.warn(`[Adapter:${this.name}] Request failed (${err.message}). Retrying attempt ${attempt + 1}/${this.maxRetries} after ${backoff}ms...`);
        await new Promise((resolve) => setTimeout(resolve, backoff));
        return this.fetchWithRetry(url, options, attempt + 1);
      }

      this.isHealthy = false;
      this.lastHealthCheck = Date.now();
      throw err;
    }
  }

  /**
   * Standardized product normalization contract
   */
  normalizeProduct(rawItem) {
    throw new Error('Adapter must implement normalizeProduct(rawItem)');
  }

  /**
   * Search external provider
   */
  async search(query, options = {}) {
    throw new Error('Adapter must implement search(query, options)');
  }

  /**
   * Fetch specific product by provider's external ID
   */
  async getById(externalId) {
    throw new Error('Adapter must implement getById(externalId)');
  }

  /**
   * Fetch general electronics stream
   */
  async fetchElectronics(options = {}) {
    throw new Error('Adapter must implement fetchElectronics(options)');
  }

  getStatus() {
    return {
      name: this.name,
      configured: this.isConfigured(),
      healthy: this.isHealthy,
      rateLimited: this.isRateLimited(),
      lastCheck: new Date(this.lastHealthCheck).toISOString()
    };
  }
}

module.exports = BaseAdapter;
