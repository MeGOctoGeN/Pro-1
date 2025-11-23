/**
 * Basic Usage Examples for AI Assistant
 * Demonstrates how to use different AI-powered features
 */

const AIAssistant = require('../src/index');

/**
 * Example 1: Answer customer queries about medications
 */
async function exampleCustomerQuery() {
  console.log('\n' + '='.repeat(60));
  console.log('Example 1: Customer Query Service');
  console.log('='.repeat(60) + '\n');

  try {
    const assistant = AIAssistant.init({
      apiKey: process.env.XAI_API_KEY,
      debug: false
    });

    const queryService = assistant.getService('customerQuery');

    // Example query
    const result = await queryService.answerQuery(
      'What is Metformin used for and what are the common side effects?'
    );

    if (result.success) {
      console.log('✅ Query answered successfully:\n');
      console.log(result.answer);
      console.log(`\nTokens used: ${result.usage.total_tokens}`);
    } else {
      console.error('❌ Error:', result.error);
    }
  } catch (error) {
    console.error('❌ Exception:', error.message);
  }
}

/**
 * Example 2: Predict inventory needs
 */
async function exampleInventoryPrediction() {
  console.log('\n' + '='.repeat(60));
  console.log('Example 2: Inventory Prediction Service');
  console.log('='.repeat(60) + '\n');

  try {
    const assistant = AIAssistant.init({
      apiKey: process.env.XAI_API_KEY
    });

    const inventoryService = assistant.getService('inventoryPrediction');

    // Sample historical data
    const historicalData = {
      products: [
        { name: 'Paracetamol 500mg', avgMonthlySales: 250, lastMonthSales: 280 },
        { name: 'Amoxicillin 500mg', avgMonthlySales: 150, lastMonthSales: 140 },
        { name: 'Vitamin C 1000mg', avgMonthlySales: 200, lastMonthSales: 350 }
      ],
      seasonalTrends: 'Winter season approaching - expect increase in cold/flu medications'
    };

    const result = await inventoryService.predictInventoryNeeds(historicalData, {
      timeframe: '30 days',
      includeSeasonality: true
    });

    if (result.success) {
      console.log('✅ Inventory prediction generated:\n');
      console.log(result.prediction);
      console.log(`\nTimeframe: ${result.timeframe}`);
      console.log(`Confidence: ${result.confidence * 100}%`);
    } else {
      console.error('❌ Error:', result.error);
    }
  } catch (error) {
    console.error('❌ Exception:', error.message);
  }
}

/**
 * Example 3: Analyze prescription patterns
 */
async function examplePrescriptionAnalysis() {
  console.log('\n' + '='.repeat(60));
  console.log('Example 3: Prescription Analyzer Service');
  console.log('='.repeat(60) + '\n');

  try {
    const assistant = AIAssistant.init({
      apiKey: process.env.XAI_API_KEY
    });

    const analyzerService = assistant.getService('prescriptionAnalyzer');

    // Sample anonymized prescription data
    const prescriptionData = [
      { medication: 'Metformin 500mg', count: 45, category: 'Diabetes' },
      { medication: 'Lisinopril 10mg', count: 38, category: 'Cardiovascular' },
      { medication: 'Atorvastatin 20mg', count: 32, category: 'Cholesterol' },
      { medication: 'Omeprazole 20mg', count: 28, category: 'GI' }
    ];

    const result = await analyzerService.identifyTrends(prescriptionData);

    if (result.success) {
      console.log('✅ Prescription trends identified:\n');
      console.log(result.trends);
    } else {
      console.error('❌ Error:', result.error);
    }
  } catch (error) {
    console.error('❌ Exception:', error.message);
  }
}

/**
 * Example 4: Provide health advice
 */
async function exampleHealthAdvice() {
  console.log('\n' + '='.repeat(60));
  console.log('Example 4: Health Advice Service');
  console.log('='.repeat(60) + '\n');

  try {
    const assistant = AIAssistant.init({
      apiKey: process.env.XAI_API_KEY
    });

    const healthService = assistant.getService('healthAdvice');

    const result = await healthService.provideHealthAdvice(
      'What are some ways to maintain healthy blood pressure naturally?'
    );

    if (result.success) {
      console.log('✅ Health advice provided:\n');
      console.log(result.advice);
    } else {
      console.error('❌ Error:', result.error);
    }
  } catch (error) {
    console.error('❌ Exception:', error.message);
  }
}

/**
 * Example 5: Generate marketing content
 */
async function exampleMarketingContent() {
  console.log('\n' + '='.repeat(60));
  console.log('Example 5: Marketing Content Service');
  console.log('='.repeat(60) + '\n');

  try {
    const assistant = AIAssistant.init({
      apiKey: process.env.XAI_API_KEY
    });

    const marketingService = assistant.getService('marketingContent');

    const productInfo = {
      name: 'Omega-3 Fish Oil Premium',
      category: 'Supplements',
      benefits: ['Heart health', 'Brain function', 'Joint support'],
      price: 29.99
    };

    const result = await marketingService.generateAdCopy(productInfo, {
      platform: 'social',
      tone: 'friendly',
      length: 'short'
    });

    if (result.success) {
      console.log('✅ Marketing content generated:\n');
      console.log(result.adCopy);
      console.log(`\nPlatform: ${result.platform}`);
    } else {
      console.error('❌ Error:', result.error);
    }
  } catch (error) {
    console.error('❌ Exception:', error.message);
  }
}

/**
 * Example 6: Test API connection
 */
async function exampleTestConnection() {
  console.log('\n' + '='.repeat(60));
  console.log('Example 6: Test API Connection');
  console.log('='.repeat(60) + '\n');

  try {
    const assistant = AIAssistant.init({
      apiKey: process.env.XAI_API_KEY
    });

    console.log('Testing connection to Grok API...');
    const result = await assistant.testConnection();

    if (result.success) {
      console.log('✅ Connection successful!');
      console.log('Response:', result.response);
    } else {
      console.error('❌ Connection failed:', result.message);
    }
  } catch (error) {
    console.error('❌ Exception:', error.message);
  }
}

/**
 * Main function to run all examples
 */
async function main() {
  console.log('🚀 AI Assistant - Basic Usage Examples');
  console.log('Using Grok AI by xAI for MOST-PHARMA-GRO');

  // Check for API key
  if (!process.env.XAI_API_KEY) {
    console.error('\n❌ Error: XAI_API_KEY environment variable is not set');
    console.error('Please set your xAI API key:');
    console.error('  export XAI_API_KEY="your-api-key-here"');
    console.error('Or create a .env file in the project root\n');
    process.exit(1);
  }

  try {
    // Run examples
    await exampleTestConnection();
    await exampleCustomerQuery();
    await exampleInventoryPrediction();
    await examplePrescriptionAnalysis();
    await exampleHealthAdvice();
    await exampleMarketingContent();

    console.log('\n' + '='.repeat(60));
    console.log('✅ All examples completed successfully!');
    console.log('='.repeat(60) + '\n');
  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

// Export examples
module.exports = {
  exampleCustomerQuery,
  exampleInventoryPrediction,
  examplePrescriptionAnalysis,
  exampleHealthAdvice,
  exampleMarketingContent,
  exampleTestConnection
};
