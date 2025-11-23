/**
 * Default Configuration for AI Assistant Module
 */

const defaultConfig = {
  // API Configuration
  apiKey: process.env.XAI_API_KEY || '',
  apiEndpoint: 'https://api.x.ai/v1/chat/completions',
  model: 'grok-beta',
  
  // Request Settings
  timeout: 30000, // 30 seconds
  maxRetries: 3,
  
  // Rate Limiting
  rateLimit: {
    enabled: true,
    maxRequestsPerMinute: 60,
    maxRequestsPerHour: 1000
  },
  
  // Privacy & Compliance
  privacy: {
    anonymizeData: true,
    respectDoNotTrack: true,
    gdprCompliant: true,
    hipaaCompliant: true
  },
  
  // Service Settings
  services: {
    customerQuery: {
      enabled: true,
      includeDisclaimer: true,
      maxQueryLength: 5000
    },
    inventoryPrediction: {
      enabled: true,
      defaultTimeframe: '30 days',
      includeSeasonality: true
    },
    prescriptionAnalyzer: {
      enabled: true,
      privacyMode: true,
      requirePharmacistReview: true
    },
    healthAdvice: {
      enabled: true,
      disclaimerEnabled: true,
      emergencyDetection: true
    },
    marketingContent: {
      enabled: true,
      brandVoice: 'professional',
      seoOptimization: true
    }
  },
  
  // Logging & Debugging
  debug: false,
  logLevel: 'info', // 'debug', 'info', 'warn', 'error'
  
  // Cache Settings
  cache: {
    enabled: false,
    ttl: 3600 // 1 hour in seconds
  }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = defaultConfig;
}

if (typeof window !== 'undefined') {
  window.AIAssistantDefaultConfig = defaultConfig;
}
