/**
 * AI Assistant - Main entry point
 * Grok AI integration for MOST-PHARMA-GRO pharmacy management system
 * 
 * Provides AI-powered features including:
 * - Customer query handling for medications
 * - Inventory prediction based on historical data
 * - Prescription pattern analysis
 * - Health advice with disclaimers
 * - Marketing content generation
 */

// Import core modules
const GrokClient = require('./client/GrokClient');
const CustomerQueryService = require('./services/CustomerQueryService');
const InventoryPredictionService = require('./services/InventoryPredictionService');
const PrescriptionAnalyzerService = require('./services/PrescriptionAnalyzerService');
const HealthAdviceService = require('./services/HealthAdviceService');
const MarketingContentService = require('./services/MarketingContentService');
const defaultConfig = require('./config/defaultConfig');
const helpers = require('./utils/helpers');

// Version
const VERSION = '1.0.0';

/**
 * Initialize AI Assistant with configuration
 */
function init(config = {}) {
  const mergedConfig = helpers.deepMerge(defaultConfig, config);
  
  // Create shared Grok client
  const grokClient = new GrokClient({
    apiKey: mergedConfig.apiKey,
    apiEndpoint: mergedConfig.apiEndpoint,
    model: mergedConfig.model,
    maxRetries: mergedConfig.maxRetries,
    timeout: mergedConfig.timeout,
    debug: mergedConfig.debug
  });

  // Initialize services
  const services = {
    customerQuery: null,
    inventoryPrediction: null,
    prescriptionAnalyzer: null,
    healthAdvice: null,
    marketingContent: null
  };

  // Initialize enabled services
  if (mergedConfig.services.customerQuery.enabled) {
    services.customerQuery = new CustomerQueryService({
      grokClient,
      includeDisclaimer: mergedConfig.services.customerQuery.includeDisclaimer
    });
  }

  if (mergedConfig.services.inventoryPrediction.enabled) {
    services.inventoryPrediction = new InventoryPredictionService({
      grokClient
    });
  }

  if (mergedConfig.services.prescriptionAnalyzer.enabled) {
    services.prescriptionAnalyzer = new PrescriptionAnalyzerService({
      grokClient,
      privacyMode: mergedConfig.services.prescriptionAnalyzer.privacyMode
    });
  }

  if (mergedConfig.services.healthAdvice.enabled) {
    services.healthAdvice = new HealthAdviceService({
      grokClient,
      disclaimerEnabled: mergedConfig.services.healthAdvice.disclaimerEnabled
    });
  }

  if (mergedConfig.services.marketingContent.enabled) {
    services.marketingContent = new MarketingContentService({
      grokClient,
      brandVoice: mergedConfig.services.marketingContent.brandVoice
    });
  }

  return {
    grokClient,
    services,
    config: mergedConfig,
    version: VERSION,
    
    // Convenience methods
    async testConnection() {
      return grokClient.testConnection();
    },
    
    getService(serviceName) {
      return services[serviceName] || null;
    },
    
    isServiceEnabled(serviceName) {
      return services[serviceName] !== null;
    }
  };
}

/**
 * Create AI Assistant instance (alias for init)
 */
function createAssistant(config) {
  return init(config);
}

// Export modules
module.exports = {
  // Main functions
  init,
  createAssistant,
  
  // Core classes
  GrokClient,
  
  // Services
  CustomerQueryService,
  InventoryPredictionService,
  PrescriptionAnalyzerService,
  HealthAdviceService,
  MarketingContentService,
  
  // Utilities
  defaultConfig,
  helpers,
  
  // Version
  VERSION
};

// Browser export
if (typeof window !== 'undefined') {
  window.AIAssistant = {
    init,
    createAssistant,
    GrokClient,
    CustomerQueryService,
    InventoryPredictionService,
    PrescriptionAnalyzerService,
    HealthAdviceService,
    MarketingContentService,
    defaultConfig,
    helpers,
    VERSION
  };
}
