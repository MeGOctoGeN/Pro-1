# AI Assistant API Documentation

Complete API reference for the Grok AI-powered AI Assistant module.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Core API](#core-api)
- [Services](#services)
  - [Customer Query Service](#customer-query-service)
  - [Inventory Prediction Service](#inventory-prediction-service)
  - [Prescription Analyzer Service](#prescription-analyzer-service)
  - [Health Advice Service](#health-advice-service)
  - [Marketing Content Service](#marketing-content-service)
- [Configuration](#configuration)
- [Error Handling](#error-handling)
- [Types & Interfaces](#types--interfaces)

## Installation

```javascript
const AIAssistant = require('./ai-assistant/src/index');
```

## Quick Start

```javascript
// Initialize with API key
const assistant = AIAssistant.init({
  apiKey: process.env.XAI_API_KEY
});

// Use a service
const queryService = assistant.getService('customerQuery');
const result = await queryService.answerQuery('What is aspirin used for?');
console.log(result.answer);
```

## Core API

### `init(config)`

Initialize the AI Assistant.

**Parameters:**
- `config` (Object): Configuration object
  - `apiKey` (string): xAI API key (required)
  - `apiEndpoint` (string): API endpoint URL (optional)
  - `model` (string): Grok model name (optional)
  - `timeout` (number): Request timeout in ms (optional)
  - `maxRetries` (number): Max retry attempts (optional)
  - `debug` (boolean): Enable debug logging (optional)

**Returns:** Assistant instance with:
- `grokClient`: GrokClient instance
- `services`: Object containing initialized services
- `config`: Merged configuration
- `version`: Module version
- `testConnection()`: Test API connection
- `getService(name)`: Get service by name
- `isServiceEnabled(name)`: Check if service is enabled

**Example:**
```javascript
const assistant = AIAssistant.init({
  apiKey: 'your-api-key',
  model: 'grok-beta',
  timeout: 30000,
  debug: false
});
```

### `createAssistant(config)`

Alias for `init()`. Creates a new assistant instance.

### `testConnection()`

Test connection to xAI API.

**Returns:** Promise<Object>
```javascript
{
  success: boolean,
  message: string,
  response?: string,
  error?: Error
}
```

## Services

### Customer Query Service

Answers customer queries about medications.

#### `answerQuery(query, context)`

Answer a customer query about medications.

**Parameters:**
- `query` (string): Customer question
- `context` (Object): Optional context
  - `type` (string): Query type
  - `patientInfo` (Object): Patient information

**Returns:** Promise<Object>
```javascript
{
  success: boolean,
  answer: string,
  query: string,
  usage: {
    prompt_tokens: number,
    completion_tokens: number,
    total_tokens: number
  },
  error?: string
}
```

**Example:**
```javascript
const result = await queryService.answerQuery(
  'What are the side effects of Ibuprofen?'
);
```

#### `getMedicationInfo(medicationName)`

Get detailed medication information.

**Parameters:**
- `medicationName` (string): Name of medication

**Returns:** Promise<Object> (same as answerQuery)

#### `checkInteractions(medications)`

Check for potential drug interactions.

**Parameters:**
- `medications` (string[] | string): Array of medication names or comma-separated string

**Returns:** Promise<Object>

#### `answerDosageQuestion(medication, patientInfo)`

Answer dosage-related questions.

**Parameters:**
- `medication` (string): Medication name
- `patientInfo` (Object): Patient information
  - `age` (number): Patient age

**Returns:** Promise<Object>

### Inventory Prediction Service

Predicts inventory needs based on historical data.

#### `predictInventoryNeeds(historicalData, options)`

Predict inventory needs.

**Parameters:**
- `historicalData` (Object): Historical sales and inventory data
  - `products` (Array): Product data
  - `salesByMonth` (Array): Monthly sales data
- `options` (Object): Prediction options
  - `timeframe` (string): Prediction timeframe (default: '30 days')
  - `includeSeasonality` (boolean): Include seasonal factors
  - `confidenceLevel` (number): Confidence level (0-1)

**Returns:** Promise<Object>
```javascript
{
  success: boolean,
  prediction: string,
  timeframe: string,
  confidence: number,
  usage: Object,
  error?: string
}
```

#### `analyzeStockTrends(inventoryHistory)`

Analyze stock trends and patterns.

**Parameters:**
- `inventoryHistory` (Object): Historical inventory data

**Returns:** Promise<Object>

#### `generateReorderRecommendations(currentStock, salesData)`

Generate smart reorder recommendations.

**Parameters:**
- `currentStock` (Array): Current stock levels
- `salesData` (Array): Recent sales data

**Returns:** Promise<Object>

#### `detectAnomalies(inventoryData)`

Detect anomalies in inventory patterns.

**Parameters:**
- `inventoryData` (Object): Inventory data to analyze

**Returns:** Promise<Object>

### Prescription Analyzer Service

Analyzes prescription patterns (HIPAA-compliant).

#### `analyzePrescriptionPatterns(prescriptionData, options)`

Analyze prescription patterns.

**Parameters:**
- `prescriptionData` (Array): Prescription data (automatically anonymized)
- `options` (Object):
  - `timeframe` (string): Analysis timeframe
  - `focusAreas` (Array): Areas to focus on

**Returns:** Promise<Object>
```javascript
{
  success: boolean,
  analysis: string,
  timeframe: string,
  privacyCompliant: boolean,
  usage: Object,
  error?: string
}
```

#### `identifyTrends(prescriptionHistory)`

Identify prescription trends.

**Parameters:**
- `prescriptionHistory` (Array): Historical prescription data

**Returns:** Promise<Object>

#### `detectPotentialIssues(prescriptionData)`

Detect potential prescription issues.

**Parameters:**
- `prescriptionData` (Object): Prescription data to analyze

**Returns:** Promise<Object>
```javascript
{
  success: boolean,
  issues: string,
  requiresPharmacistReview: true,
  usage: Object
}
```

#### `generateInsightsReport(prescriptionData, period)`

Generate comprehensive insights report.

**Parameters:**
- `prescriptionData` (Object): Prescription data
- `period` (string): Report period ('daily', 'weekly', 'monthly')

**Returns:** Promise<Object>

### Health Advice Service

Provides general health advice with disclaimers.

#### `provideHealthAdvice(question, context)`

Provide general health advice.

**Parameters:**
- `question` (string): Health question
- `context` (Object): Optional context
  - `userAge` (number): User's age
  - `specificConcern` (string): Specific concern

**Returns:** Promise<Object>
```javascript
{
  success: boolean,
  advice: string,
  question: string,
  isGeneralAdvice: true,
  usage: Object,
  error?: string
}
```

**Note:** All responses include medical disclaimers.

#### `getWellnessTips(category)`

Get wellness tips for a category.

**Parameters:**
- `category` (string): Category ('general', 'nutrition', 'exercise', etc.)

**Returns:** Promise<Object>

#### `answerNutritionQuestion(question)`

Answer nutrition-related questions.

**Parameters:**
- `question` (string): Nutrition question

**Returns:** Promise<Object>

#### `getPreventiveCareInfo(topic)`

Get preventive care information.

**Parameters:**
- `topic` (string): Preventive care topic

**Returns:** Promise<Object>

#### `isAppropriateForAI(question)`

Check if a question is appropriate for AI handling.

**Parameters:**
- `question` (string): Question to check

**Returns:** Object
```javascript
{
  appropriate: boolean,
  reason: string | null,
  emergencyDetected: boolean
}
```

### Marketing Content Service

Generates marketing content using AI.

#### `generateAdCopy(productInfo, options)`

Generate ad copy for products.

**Parameters:**
- `productInfo` (Object):
  - `name` (string): Product name
  - `category` (string): Product category
  - `benefits` (Array): Key benefits
  - `price` (number): Product price
- `options` (Object):
  - `platform` (string): Platform ('facebook', 'google', 'instagram', etc.)
  - `tone` (string): Brand voice tone
  - `length` (string): Content length ('short', 'medium', 'long')
  - `includeEmoji` (boolean): Include emojis
  - `callToAction` (boolean): Include CTA

**Returns:** Promise<Object>
```javascript
{
  success: boolean,
  adCopy: string,
  productName: string,
  platform: string,
  usage: Object,
  error?: string
}
```

#### `generateProductDescription(productInfo, options)`

Generate product description.

**Parameters:**
- `productInfo` (Object): Product information
- `options` (Object):
  - `length` (string): Description length
  - `includeKeyFeatures` (boolean): Include features
  - `seoOptimized` (boolean): Optimize for SEO

**Returns:** Promise<Object>

#### `generateEmailContent(campaignInfo)`

Generate email marketing content.

**Parameters:**
- `campaignInfo` (Object):
  - `subject` (string): Email subject
  - `audience` (string): Target audience
  - `goal` (string): Campaign goal
  - `keyPoints` (Array): Key points to include

**Returns:** Promise<Object>

#### `generateSocialMediaPost(content, platform)`

Generate social media post.

**Parameters:**
- `content` (string): Post content/topic
- `platform` (string): Social platform ('twitter', 'facebook', 'instagram', 'linkedin')

**Returns:** Promise<Object>

#### `generateBannerText(promotion)`

Generate promotional banner text.

**Parameters:**
- `promotion` (Object):
  - `title` (string): Promotion title
  - `discount` (string): Discount amount
  - `category` (string): Product category
  - `duration` (string): Time limit

**Returns:** Promise<Object>

#### `generateSEOContent(topic, keywords)`

Generate SEO-optimized content.

**Parameters:**
- `topic` (string): Content topic
- `keywords` (Array): Target keywords

**Returns:** Promise<Object>

#### `setBrandVoice(voice)`

Set the brand voice for content generation.

**Parameters:**
- `voice` (string): Brand voice ('professional', 'friendly', 'casual', 'authoritative', 'empathetic')

**Returns:** boolean

## Configuration

### Default Configuration

```javascript
{
  apiKey: process.env.XAI_API_KEY || '',
  apiEndpoint: 'https://api.x.ai/v1/chat/completions',
  model: 'grok-beta',
  timeout: 30000,
  maxRetries: 3,
  rateLimit: {
    enabled: true,
    maxRequestsPerMinute: 60,
    maxRequestsPerHour: 1000
  },
  privacy: {
    anonymizeData: true,
    respectDoNotTrack: true,
    gdprCompliant: true,
    hipaaCompliant: true
  },
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
  debug: false
}
```

## Error Handling

All service methods return a consistent response format:

### Success Response
```javascript
{
  success: true,
  // ... service-specific data
  usage: {
    prompt_tokens: number,
    completion_tokens: number,
    total_tokens: number
  }
}
```

### Error Response
```javascript
{
  success: false,
  error: string,
  // ... partial data if available
}
```

### Common Errors

- **Missing API Key**: `XAI API key is required`
- **Invalid Request**: `Invalid response format from Grok API`
- **Rate Limit**: `Too many requests`
- **Timeout**: `Request timeout after Xms`
- **Network Error**: Connection issues

## Types & Interfaces

### Assistant Instance
```typescript
interface AssistantInstance {
  grokClient: GrokClient;
  services: {
    customerQuery: CustomerQueryService | null;
    inventoryPrediction: InventoryPredictionService | null;
    prescriptionAnalyzer: PrescriptionAnalyzerService | null;
    healthAdvice: HealthAdviceService | null;
    marketingContent: MarketingContentService | null;
  };
  config: Config;
  version: string;
  testConnection(): Promise<ConnectionResult>;
  getService(name: string): Service | null;
  isServiceEnabled(name: string): boolean;
}
```

### Usage Stats
```typescript
interface UsageStats {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}
```

### Service Response
```typescript
interface ServiceResponse<T = any> {
  success: boolean;
  usage?: UsageStats;
  error?: string;
  // ... additional service-specific fields
}
```

## Best Practices

1. **Always handle errors**: Check `success` field in responses
2. **Use disclaimers**: Health and medical advice includes disclaimers
3. **Respect privacy**: Data is automatically anonymized
4. **Rate limiting**: Built-in rate limiting prevents abuse
5. **API key security**: Never expose API keys in client code
6. **Emergency detection**: Health service detects emergencies
7. **Pharmacist review**: Critical decisions require human review

## Support

For issues or questions:
- GitHub: [Report an issue](https://github.com/ELMOURABEA/MOST-PHARMA-GRO/issues)
- Documentation: [Full Docs](../README.md)
- Email: support@most-pharma-gro.com

---

**Version:** 1.0.0  
**Last Updated:** November 2025
