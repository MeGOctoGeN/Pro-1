/**
 * Grok AI Ad Generator Example
 * Demonstrates integration between ads-core and ai-assistant for generating ad content
 */

// Import AI Assistant
const AIAssistant = require('../../ai-assistant/src/index');

/**
 * Example: Generate ad copy using Grok AI
 */
async function generateAdCopyExample() {
  console.log('='.repeat(60));
  console.log('Grok AI Ad Copy Generator Example');
  console.log('='.repeat(60));
  console.log();

  try {
    // Initialize AI Assistant
    const assistant = AIAssistant.init({
      apiKey: process.env.XAI_API_KEY,
      debug: true
    });

    // Check if marketing content service is available
    if (!assistant.isServiceEnabled('marketingContent')) {
      console.error('❌ Marketing content service is not enabled');
      return;
    }

    const marketingService = assistant.getService('marketingContent');

    // Example 1: Generate ad copy for a product
    console.log('📝 Example 1: Generating Ad Copy for Product...\n');
    
    const productInfo = {
      name: 'Vitamin D3 5000 IU',
      category: 'Supplements',
      benefits: ['Supports bone health', 'Boosts immune system', 'Improves mood'],
      price: 19.99
    };

    const adCopyResult = await marketingService.generateAdCopy(productInfo, {
      platform: 'facebook',
      tone: 'friendly',
      length: 'medium',
      includeEmoji: true,
      callToAction: true
    });

    if (adCopyResult.success) {
      console.log('✅ Ad Copy Generated:');
      console.log('-'.repeat(60));
      console.log(adCopyResult.adCopy);
      console.log('-'.repeat(60));
      console.log(`Platform: ${adCopyResult.platform}`);
      console.log(`Tokens Used: ${adCopyResult.usage.total_tokens}`);
      console.log();
    } else {
      console.error(`❌ Failed to generate ad copy: ${adCopyResult.error}`);
      console.log();
    }

    // Example 2: Generate product description
    console.log('📝 Example 2: Generating Product Description...\n');

    const productForDescription = {
      name: 'Blood Pressure Monitor Digital',
      category: 'Medical Devices',
      features: ['LCD display', 'Memory for 2 users', 'Irregular heartbeat detection', 'WHO indicator'],
      price: 49.99
    };

    const descriptionResult = await marketingService.generateProductDescription(
      productForDescription,
      {
        length: 'medium',
        includeKeyFeatures: true,
        seoOptimized: true
      }
    );

    if (descriptionResult.success) {
      console.log('✅ Product Description Generated:');
      console.log('-'.repeat(60));
      console.log(descriptionResult.description);
      console.log('-'.repeat(60));
      console.log(`Tokens Used: ${descriptionResult.usage.total_tokens}`);
      console.log();
    } else {
      console.error(`❌ Failed to generate description: ${descriptionResult.error}`);
      console.log();
    }

    // Example 3: Generate promotional banner text
    console.log('📝 Example 3: Generating Banner Text...\n');

    const promotion = {
      title: 'Summer Sale',
      discount: '25% OFF',
      category: 'Vitamins & Supplements',
      duration: 'Limited Time'
    };

    const bannerResult = await marketingService.generateBannerText(promotion);

    if (bannerResult.success) {
      console.log('✅ Banner Text Variations Generated:');
      console.log('-'.repeat(60));
      console.log(bannerResult.bannerVariations);
      console.log('-'.repeat(60));
      console.log();
    } else {
      console.error(`❌ Failed to generate banner text: ${bannerResult.error}`);
      console.log();
    }

    // Example 4: Generate social media post
    console.log('📝 Example 4: Generating Social Media Post...\n');

    const socialContent = `New arrival: Advanced Omega-3 Fish Oil with EPA & DHA. 
Support heart health, brain function, and joint mobility. 
Premium quality, sustainably sourced. Shop now!`;

    const socialPost = await marketingService.generateSocialMediaPost(
      socialContent,
      'instagram'
    );

    if (socialPost.success) {
      console.log('✅ Instagram Post Generated:');
      console.log('-'.repeat(60));
      console.log(socialPost.post);
      console.log('-'.repeat(60));
      console.log(`Platform: ${socialPost.platform}`);
      console.log();
    } else {
      console.error(`❌ Failed to generate social post: ${socialPost.error}`);
      console.log();
    }

    console.log('='.repeat(60));
    console.log('✅ All examples completed!');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

/**
 * Example: Integrate with AdManager for dynamic ad content
 */
async function integrateWithAdManager() {
  console.log('\n');
  console.log('='.repeat(60));
  console.log('Integration with AdManager Example');
  console.log('='.repeat(60));
  console.log();

  try {
    // Import AdManager
    const AdManager = require('../src/managers/AdManager');

    // Initialize AI Assistant
    const assistant = AIAssistant.init({
      apiKey: process.env.XAI_API_KEY
    });

    const marketingService = assistant.getService('marketingContent');

    // Initialize AdManager
    const adManager = new AdManager({
      debug: true
    });

    console.log('📢 Generating dynamic ad content for multiple products...\n');

    const products = [
      { name: 'Multivitamin Complex', category: 'Supplements', price: 24.99 },
      { name: 'Pain Relief Cream', category: 'Pain Management', price: 15.99 },
      { name: 'Probiotic 50 Billion CFU', category: 'Digestive Health', price: 34.99 }
    ];

    for (const product of products) {
      console.log(`Generating ad for: ${product.name}`);
      
      const adCopy = await marketingService.generateAdCopy(product, {
        platform: 'general',
        length: 'short',
        callToAction: true
      });

      if (adCopy.success) {
        console.log(`✅ ${product.name}:`);
        console.log(`   ${adCopy.adCopy.substring(0, 100)}...`);
        console.log();
      }
    }

    console.log('='.repeat(60));
    console.log('✅ Integration example completed!');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting Grok AI Ad Generator Examples\n');

  // Check for API key
  if (!process.env.XAI_API_KEY) {
    console.error('❌ Error: XAI_API_KEY environment variable is not set');
    console.error('Please set your xAI API key in .env file or environment variables');
    console.error('Example: export XAI_API_KEY="your-api-key-here"\n');
    process.exit(1);
  }

  try {
    await generateAdCopyExample();
    await integrateWithAdManager();
    
    console.log('\n✅ All examples completed successfully!');
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

// Export functions for use in other modules
module.exports = {
  generateAdCopyExample,
  integrateWithAdManager
};
