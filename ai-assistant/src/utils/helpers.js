/**
 * Helper utilities for AI Assistant module
 */

/**
 * Deep merge two objects
 */
function deepMerge(target, source) {
  const output = Object.assign({}, target);
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  
  return output;
}

/**
 * Check if value is an object
 */
function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Validate email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitize text for safe display
 */
function sanitizeText(text) {
  if (typeof text !== 'string') return '';
  
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Format date to ISO string
 */
function formatDate(date) {
  if (date instanceof Date) {
    return date.toISOString();
  }
  
  if (typeof date === 'string' || typeof date === 'number') {
    return new Date(date).toISOString();
  }
  
  return new Date().toISOString();
}

/**
 * Truncate text to specified length
 */
function truncateText(text, maxLength, suffix = '...') {
  if (!text || text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Parse JSON safely
 */
function safeJsonParse(jsonString, defaultValue = null) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return defaultValue;
  }
}

/**
 * Generate unique ID
 */
function generateId(prefix = '') {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`;
}

/**
 * Retry function with exponential backoff
 */
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt < maxRetries) {
        const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), 10000);
        await sleep(delay);
      }
    }
  }
  
  throw lastError;
}

/**
 * Sleep helper
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if running in Node.js environment
 */
function isNodeEnvironment() {
  return typeof process !== 'undefined' && 
         process.versions != null && 
         process.versions.node != null;
}

/**
 * Check if running in browser environment
 */
function isBrowserEnvironment() {
  return typeof window !== 'undefined' && 
         typeof document !== 'undefined';
}

/**
 * Get environment variable (works in both Node and browser with bundlers)
 */
function getEnvVar(key, defaultValue = '') {
  if (isNodeEnvironment()) {
    return process.env[key] || defaultValue;
  }
  
  // In browser, environment variables might be injected by bundler
  if (isBrowserEnvironment() && typeof process !== 'undefined' && process.env) {
    return process.env[key] || defaultValue;
  }
  
  return defaultValue;
}

/**
 * Validate API key format
 */
function isValidApiKey(apiKey) {
  if (!apiKey || typeof apiKey !== 'string') {
    return false;
  }
  
  const trimmed = apiKey.trim();
  
  // More robust validation for xAI API keys
  // Typical API key format: alphanumeric with hyphens/underscores
  // Reasonable length range: 20-200 characters
  if (trimmed.length < 20 || trimmed.length > 200) {
    return false;
  }
  
  // Check for valid characters (alphanumeric, hyphens, underscores)
  const validPattern = /^[a-zA-Z0-9_-]+$/;
  if (!validPattern.test(trimmed)) {
    return false;
  }
  
  // Prevent obviously invalid keys
  const invalidPatterns = ['test', 'example', 'demo', 'placeholder'];
  const lowerKey = trimmed.toLowerCase();
  for (const pattern of invalidPatterns) {
    if (lowerKey === pattern || lowerKey.startsWith(pattern + '-')) {
      return false;
    }
  }
  
  return true;
}

/**
 * Rate limiter
 */
class RateLimiter {
  constructor(maxRequests, windowMs) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = [];
  }
  
  canMakeRequest() {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    
    if (this.requests.length >= this.maxRequests) {
      return false;
    }
    
    this.requests.push(now);
    return true;
  }
  
  getTimeUntilNextRequest() {
    if (this.requests.length < this.maxRequests) {
      return 0;
    }
    
    const oldestRequest = Math.min(...this.requests);
    const timeToWait = this.windowMs - (Date.now() - oldestRequest);
    return Math.max(0, timeToWait);
  }
}

// Export all helpers
const helpers = {
  deepMerge,
  isObject,
  isValidEmail,
  sanitizeText,
  formatDate,
  truncateText,
  safeJsonParse,
  generateId,
  retryWithBackoff,
  sleep,
  isNodeEnvironment,
  isBrowserEnvironment,
  getEnvVar,
  isValidApiKey,
  RateLimiter
};

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = helpers;
}

// Export for browser
if (typeof window !== 'undefined') {
  window.AIAssistantHelpers = helpers;
}
