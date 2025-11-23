# 🤖 AI Assistant Module

**Grok AI Integration for MOST-PHARMA-GRO**

Powered by xAI's Grok API, this module provides intelligent AI-powered features for pharmacy management, including medication queries, inventory predictions, prescription analysis, health advice, and marketing content generation.

## 📋 Overview

The AI Assistant module seamlessly integrates xAI's Grok API into the MOST-PHARMA-GRO pharmacy management system, enabling:

- 💊 **Customer Query Handler** - Answer medication questions accurately
- 📦 **Inventory Prediction** - Forecast inventory needs using historical data
- 📋 **Prescription Pattern Analyzer** - Analyze prescription trends and detect issues
- 🏥 **Health Advice Service** - Provide general health guidance with disclaimers
- 📢 **Marketing Content Generator** - Create compelling ad copy and product descriptions

## ✨ Key Features

### Intelligent Customer Support
- Answer medication questions in real-time
- Provide drug interaction information
- Explain dosage guidelines
- All responses include appropriate medical disclaimers

### Predictive Inventory Management
- Forecast product demand based on historical data
- Identify seasonal trends
- Generate smart reorder recommendations
- Detect inventory anomalies

### Prescription Analytics
- Analyze prescription patterns
- Identify trending medications
- Detect potential safety issues
- Privacy-compliant with automatic data anonymization

### AI-Powered Marketing
- Generate ad copy for multiple platforms
- Create SEO-optimized product descriptions
- Write email marketing content
- Generate social media posts
- Create promotional banners

### Health & Wellness
- Provide general health information
- Offer wellness tips
- Answer nutrition questions
- Emergency detection and appropriate responses

## 🚀 Quick Start

### Installation

The AI Assistant module is included in MOST-PHARMA-GRO. No separate installation required.

### Setup

1. **Get your xAI API Key**
   - Visit [https://console.x.ai](https://console.x.ai)
   - Sign up or log in
   - Generate an API key

2. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your API key:
   XAI_API_KEY=your_xai_api_key_here
   ```

3. **Basic Usage**
   ```javascript
   const AIAssistant = require('./ai-assistant/src/index');

   // Initialize the assistant
   const assistant = AIAssistant.init({
     apiKey: process.env.XAI_API_KEY
   });

   // Use a service
   const queryService = assistant.getService('customerQuery');
   const result = await queryService.answerQuery(
     'What is Metformin used for?'
   );

   console.log(result.answer);
   ```

## 📖 Services Documentation

### Customer Query Service

Answer customer questions about medications:

```javascript
const queryService = assistant.getService('customerQuery');

// Answer general medication query
const result = await queryService.answerQuery(
  'What are the side effects of Ibuprofen?'
);

// Get detailed medication information
const info = await queryService.getMedicationInfo('Aspirin');

// Check drug interactions
const interactions = await queryService.checkInteractions([
  'Warfarin',
  'Aspirin'
]);

// Answer dosage questions
const dosage = await queryService.answerDosageQuestion(
  'Amoxicillin',
  { age: 8 }
);
```

### Inventory Prediction Service

Predict inventory needs and optimize stock:

```javascript
const inventoryService = assistant.getService('inventoryPrediction');

// Predict inventory needs
const historicalData = {
  products: [
    { name: 'Paracetamol', avgMonthlySales: 250 },
    { name: 'Vitamin C', avgMonthlySales: 200 }
  ]
};

const prediction = await inventoryService.predictInventoryNeeds(
  historicalData,
  { timeframe: '30 days', includeSeasonality: true }
);

// Analyze stock trends
const trends = await inventoryService.analyzeStockTrends(inventoryHistory);

// Generate reorder recommendations
const recommendations = await inventoryService.generateReorderRecommendations(
  currentStock,
  salesData
);

// Detect anomalies
const anomalies = await inventoryService.detectAnomalies(inventoryData);
```

### Prescription Analyzer Service

Analyze prescription patterns (HIPAA-compliant):

```javascript
const analyzerService = assistant.getService('prescriptionAnalyzer');

// Analyze prescription patterns
const analysis = await analyzerService.analyzePrescriptionPatterns(
  prescriptionData,
  { timeframe: '30 days', focusAreas: ['trends', 'frequency'] }
);

// Identify trends
const trends = await analyzerService.identifyTrends(prescriptionHistory);

// Detect potential issues (requires pharmacist review)
const issues = await analyzerService.detectPotentialIssues(prescriptionData);

// Generate insights report
const report = await analyzerService.generateInsightsReport(
  prescriptionData,
  'monthly'
);
```

### Health Advice Service

Provide general health information with disclaimers:

```javascript
const healthService = assistant.getService('healthAdvice');

// Provide health advice
const advice = await healthService.provideHealthAdvice(
  'How can I maintain healthy blood pressure?'
);

// Get wellness tips
const tips = await healthService.getWellnessTips('nutrition');

// Answer nutrition questions
const nutrition = await healthService.answerNutritionQuestion(
  'What foods are high in Vitamin D?'
);

// Get preventive care information
const preventive = await healthService.getPreventiveCareInfo(
  'annual health screenings'
);
```

### Marketing Content Service

Generate marketing content:

```javascript
const marketingService = assistant.getService('marketingContent');

// Generate ad copy
const adCopy = await marketingService.generateAdCopy(
  {
    name: 'Vitamin D3',
    category: 'Supplements',
    benefits: ['Bone health', 'Immune support'],
    price: 19.99
  },
  {
    platform: 'facebook',
    tone: 'friendly',
    callToAction: true
  }
);

// Generate product description
const description = await marketingService.generateProductDescription(
  productInfo,
  { length: 'medium', seoOptimized: true }
);

// Generate email content
const email = await marketingService.generateEmailContent({
  subject: 'Summer Wellness Sale',
  audience: 'existing customers',
  goal: 'drive sales'
});

// Generate social media post
const post = await marketingService.generateSocialMediaPost(
  'New product launch: Premium Omega-3',
  'instagram'
);

// Generate banner text
const banner = await marketingService.generateBannerText({
  title: 'Flash Sale',
  discount: '30% OFF',
  category: 'Vitamins'
});
```

## 🔒 Privacy & Compliance

### Automatic Data Anonymization

The AI Assistant automatically anonymizes sensitive data:
- Patient names and IDs removed
- Personal identifiable information (PII) stripped
- Only aggregated, anonymized data sent to API

### Medical Disclaimers

All health-related responses include appropriate disclaimers:
- AI advice is not medical advice
- Users encouraged to consult healthcare professionals
- Emergency situations detected and handled appropriately

### HIPAA Compliance

- Privacy mode enabled by default
- Data anonymization before API calls
- No patient data stored or logged
- Pharmacist review required for critical decisions

### GDPR Compliance

- User consent respected
- Data processing transparency
- Right to be forgotten supported
- Privacy by design principles

## 🛡️ Security Best Practices

1. **API Key Security**
   - Never commit API keys to version control
   - Use environment variables
   - Rotate keys regularly
   - Use different keys for dev/prod

2. **Rate Limiting**
   - Built-in rate limiting (60 requests/minute)
   - Configurable limits
   - Prevents API abuse

3. **Error Handling**
   - Comprehensive error handling
   - Graceful degradation
   - Retry logic with exponential backoff

4. **Input Validation**
   - All inputs validated
   - Query length limits enforced
   - Malicious input detection

## ⚙️ Configuration

### Environment Variables

```bash
# Required
XAI_API_KEY=your_api_key_here

# Optional
XAI_API_ENDPOINT=https://api.x.ai/v1/chat/completions
XAI_MODEL=grok-beta
AI_DEBUG=false
AI_MAX_REQUESTS_PER_MINUTE=60
AI_PRIVACY_MODE=true
```

### Programmatic Configuration

```javascript
const assistant = AIAssistant.init({
  apiKey: 'your-api-key',
  apiEndpoint: 'https://api.x.ai/v1/chat/completions',
  model: 'grok-beta',
  timeout: 30000,
  maxRetries: 3,
  debug: false,
  services: {
    customerQuery: {
      enabled: true,
      includeDisclaimer: true
    },
    inventoryPrediction: {
      enabled: true,
      defaultTimeframe: '30 days'
    },
    prescriptionAnalyzer: {
      enabled: true,
      privacyMode: true
    },
    healthAdvice: {
      enabled: true,
      disclaimerEnabled: true
    },
    marketingContent: {
      enabled: true,
      brandVoice: 'professional'
    }
  }
});
```

## 📊 Usage Examples

See the [examples directory](examples/) for complete usage examples:

- `basic-usage.js` - Basic examples for all services
- Integration with ads-core in `/ads-core/examples/grok-ad-generator.js`

Run examples:
```bash
# Set your API key
export XAI_API_KEY="your-api-key"

# Run basic examples
node ai-assistant/examples/basic-usage.js

# Run ad generator example
node ads-core/examples/grok-ad-generator.js
```

## 🔧 API Reference

### Main Functions

#### `init(config)`
Initialize the AI Assistant with configuration.

#### `createAssistant(config)`
Alias for `init()`.

#### `testConnection()`
Test connection to Grok API.

#### `getService(serviceName)`
Get a specific service instance.

#### `isServiceEnabled(serviceName)`
Check if a service is enabled.

## 🚨 Error Handling

All services return results in a consistent format:

```javascript
{
  success: true,        // or false
  // ... service-specific data
  usage: {              // API usage stats
    prompt_tokens: 100,
    completion_tokens: 200,
    total_tokens: 300
  },
  error: 'error message' // only if success is false
}
```

## 📈 Performance Considerations

- **Response Times**: Average 2-5 seconds per request
- **Token Usage**: Optimized prompts to minimize token consumption
- **Rate Limits**: 60 requests/minute default (configurable)
- **Caching**: Optional caching for repeated queries

## 🤝 Integration with ads-core

The AI Assistant integrates seamlessly with the ads-core module:

```javascript
const AIAssistant = require('./ai-assistant/src/index');
const AdManager = require('./ads-core/src/managers/AdManager');

const assistant = AIAssistant.init({ apiKey: process.env.XAI_API_KEY });
const adManager = new AdManager();

// Generate ad copy for products
const marketingService = assistant.getService('marketingContent');
const adCopy = await marketingService.generateAdCopy(productInfo);

// Use with ad manager
adManager.showAd({
  content: adCopy.adCopy,
  format: 'banner'
});
```

## 🐛 Troubleshooting

### Common Issues

**API Key Error**
```
Error: XAI API key is required
```
Solution: Set `XAI_API_KEY` environment variable

**Connection Timeout**
```
Error: Request timeout after 30000ms
```
Solution: Check internet connection or increase timeout in config

**Rate Limit Exceeded**
```
Error: Too many requests
```
Solution: Reduce request frequency or increase rate limits

## 📚 Additional Resources

- [xAI Developer Documentation](https://docs.x.ai)
- [Grok API Reference](https://docs.x.ai/api)
- [MOST-PHARMA-GRO Main Documentation](../README.md)
- [Ads Core Documentation](../ads-core/README.md)

## 📝 License

This module is part of MOST-PHARMA-GRO and is licensed under the Boost Software License 1.0.

## 👥 Support

For questions, issues, or contributions:
- GitHub Issues: [Report an issue](https://github.com/ELMOURABEA/MOST-PHARMA-GRO/issues)
- Email: support@most-pharma-gro.com

---

**Built with ❤️ by ELMOURABEA**
**Powered by xAI's Grok**
