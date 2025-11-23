# AI Assistant Setup Guide

Quick start guide for setting up and using the Grok AI-powered AI Assistant in MOST-PHARMA-GRO.

## 🚀 Quick Setup (5 minutes)

### Step 1: Get Your xAI API Key

1. Visit [https://console.x.ai](https://console.x.ai)
2. Sign up or log in to your xAI account
3. Navigate to API Keys section
4. Click "Create New API Key"
5. Copy your API key (it starts with something like `xai-` or similar)

### Step 2: Configure Environment

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your API key:
   ```bash
   XAI_API_KEY=your_actual_api_key_here
   ```

3. Save the file

### Step 3: Test Your Setup

Run the test connection script:
```bash
node ai-assistant/examples/basic-usage.js
```

If successful, you'll see:
```
✅ Connection successful!
✅ All examples completed successfully!
```

## 📚 Basic Usage

### Initialize the Assistant

```javascript
const AIAssistant = require('./ai-assistant/src/index');

const assistant = AIAssistant.init({
  apiKey: process.env.XAI_API_KEY
});
```

### Use Customer Query Service

```javascript
const queryService = assistant.getService('customerQuery');

const result = await queryService.answerQuery(
  'What are the side effects of Ibuprofen?'
);

console.log(result.answer);
```

### Generate Marketing Content

```javascript
const marketingService = assistant.getService('marketingContent');

const adCopy = await marketingService.generateAdCopy({
  name: 'Vitamin D3',
  category: 'Supplements',
  price: 19.99
}, {
  platform: 'facebook',
  tone: 'friendly'
});

console.log(adCopy.adCopy);
```

### Predict Inventory Needs

```javascript
const inventoryService = assistant.getService('inventoryPrediction');

const prediction = await inventoryService.predictInventoryNeeds({
  products: [
    { name: 'Paracetamol', avgMonthlySales: 250 },
    { name: 'Vitamin C', avgMonthlySales: 200 }
  ]
}, {
  timeframe: '30 days',
  includeSeasonality: true
});

console.log(prediction.prediction);
```

## 🔧 Configuration Options

### Minimal Configuration

```javascript
const assistant = AIAssistant.init({
  apiKey: process.env.XAI_API_KEY
});
```

### Advanced Configuration

```javascript
const assistant = AIAssistant.init({
  // Required
  apiKey: process.env.XAI_API_KEY,
  
  // Optional
  model: 'grok-beta',
  timeout: 30000,
  maxRetries: 3,
  debug: false,
  
  // Service-specific settings
  services: {
    customerQuery: {
      enabled: true,
      includeDisclaimer: true
    },
    marketingContent: {
      enabled: true,
      brandVoice: 'professional'
    }
  }
});
```

## 🔒 Security Best Practices

### 1. Protect Your API Key

✅ **DO:**
- Store API key in `.env` file
- Add `.env` to `.gitignore`
- Use environment variables
- Rotate keys regularly

❌ **DON'T:**
- Commit API keys to git
- Share API keys publicly
- Hardcode keys in source code
- Use the same key for dev and prod

### 2. Environment-Specific Keys

```bash
# Development
XAI_API_KEY=xai-dev-key-here

# Production
XAI_API_KEY=xai-prod-key-here
```

### 3. Validate Input

All services automatically validate and sanitize input:
```javascript
// This is automatically checked for malicious content
const result = await queryService.answerQuery(userInput);
```

## 📊 Rate Limits & Usage

### Default Limits
- 60 requests per minute
- 1000 requests per hour

### Monitor Usage

```javascript
const result = await queryService.answerQuery('question');

console.log('Tokens used:', result.usage.total_tokens);
console.log('Cost estimate:', result.usage.total_tokens * 0.0001); // Example
```

### Optimize Token Usage

```javascript
// Use shorter queries
const result = await queryService.answerQuery(
  'Side effects of aspirin?'  // Short and concise
);

// Adjust max tokens
const result = await grokClient.chat(messages, {
  maxTokens: 500  // Limit response length
});
```

## 🏥 Healthcare Compliance

### HIPAA Compliance

All prescription data is automatically anonymized:
```javascript
const analyzerService = assistant.getService('prescriptionAnalyzer');

// Data is automatically anonymized before sending to API
const analysis = await analyzerService.analyzePrescriptionPatterns(
  prescriptionData  // Contains patient names, etc.
);
```

### Medical Disclaimers

Health advice automatically includes disclaimers:
```javascript
const healthService = assistant.getService('healthAdvice');
const advice = await healthService.provideHealthAdvice(
  'How to maintain healthy blood pressure?'
);

// Response includes disclaimer about consulting healthcare professionals
console.log(advice.advice);
```

### Emergency Detection

The system detects medical emergencies:
```javascript
const healthService = assistant.getService('healthAdvice');

const check = healthService.isAppropriateForAI(
  'I have severe chest pain'
);

if (check.emergencyDetected) {
  console.log('🚨 EMERGENCY - Call 911');
  console.log(healthService.getEmergencyResponseMessage());
}
```

## 🎨 Integration Examples

### With Express.js

```javascript
const express = require('express');
const AIAssistant = require('./ai-assistant/src/index');

const app = express();
const assistant = AIAssistant.init({ apiKey: process.env.XAI_API_KEY });

app.post('/api/query', async (req, res) => {
  const queryService = assistant.getService('customerQuery');
  const result = await queryService.answerQuery(req.body.question);
  
  res.json(result);
});

app.listen(3000);
```

### With Ads Core

```javascript
const AIAssistant = require('./ai-assistant/src/index');
const AdManager = require('./ads-core/src/managers/AdManager');

const assistant = AIAssistant.init({ apiKey: process.env.XAI_API_KEY });
const marketingService = assistant.getService('marketingContent');
const adManager = new AdManager();

// Generate ad content
const adCopy = await marketingService.generateAdCopy(productInfo);

// Display ad
adManager.showAd({
  content: adCopy.adCopy,
  format: 'banner'
});
```

## 🐛 Troubleshooting

### Problem: "XAI API key is required"

**Solution:**
```bash
# Check if .env file exists
cat .env | grep XAI_API_KEY

# If missing, add it
echo "XAI_API_KEY=your-key-here" >> .env
```

### Problem: "Connection timeout"

**Solution:**
```javascript
// Increase timeout
const assistant = AIAssistant.init({
  apiKey: process.env.XAI_API_KEY,
  timeout: 60000  // 60 seconds
});
```

### Problem: "Rate limit exceeded"

**Solution:**
```javascript
// Add delays between requests
const helpers = require('./ai-assistant/src/utils/helpers');
await helpers.sleep(1000);  // Wait 1 second

// Or reduce request frequency
```

### Problem: Module not found

**Solution:**
```bash
# Make sure you're in the correct directory
cd /path/to/MOST-PHARMA-GRO

# Check if ai-assistant exists
ls -la ai-assistant/

# Reinstall if needed
npm install
```

## 📈 Performance Tips

### 1. Use Caching

```javascript
// Cache frequent queries
const cache = new Map();

async function getCachedAnswer(question) {
  if (cache.has(question)) {
    return cache.get(question);
  }
  
  const result = await queryService.answerQuery(question);
  cache.set(question, result);
  return result;
}
```

### 2. Batch Requests

```javascript
// Process multiple items efficiently
const products = [/* ... */];
const results = [];

for (const product of products) {
  const adCopy = await marketingService.generateAdCopy(product);
  results.push(adCopy);
  
  // Small delay to respect rate limits
  await helpers.sleep(100);
}
```

### 3. Use Appropriate Token Limits

```javascript
// For short responses
const result = await grokClient.chat(messages, {
  maxTokens: 200  // Faster and cheaper
});

// For detailed analysis
const result = await grokClient.chat(messages, {
  maxTokens: 1500  // More comprehensive
});
```

## 🆘 Getting Help

### Documentation
- [Main README](README.md)
- [API Documentation](docs/API.md)
- [Examples](examples/)

### Support Channels
- GitHub Issues: [Report a bug](https://github.com/ELMOURABEA/MOST-PHARMA-GRO/issues)
- Email: support@most-pharma-gro.com

### Community
- Check existing issues first
- Provide code examples
- Include error messages
- Describe expected vs actual behavior

## ✅ Checklist

Before going live, make sure:

- [ ] API key is set in production environment
- [ ] `.env` file is in `.gitignore`
- [ ] Rate limiting is configured
- [ ] Error handling is implemented
- [ ] Medical disclaimers are displayed
- [ ] Emergency detection is active
- [ ] Data anonymization is enabled
- [ ] HIPAA compliance is verified
- [ ] Testing is complete
- [ ] Monitoring is set up

## 🎓 Next Steps

1. **Read the full documentation**: [README.md](README.md)
2. **Try all examples**: [examples/basic-usage.js](examples/basic-usage.js)
3. **Integrate into your app**: Use the API reference
4. **Monitor usage**: Track API calls and costs
5. **Provide feedback**: Help us improve!

---

**Happy coding! 🚀**

For detailed API reference, see [API Documentation](docs/API.md)
