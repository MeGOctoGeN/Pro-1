/**
 * MarketingContentService - Generates marketing content using Grok AI
 * Creates ad copy, product descriptions, and promotional content
 */

const GrokClient = require('../client/GrokClient');

class MarketingContentService {
  constructor(config = {}) {
    this.grokClient = config.grokClient || new GrokClient(config);
    this.brandVoice = config.brandVoice || 'professional';
  }

  /**
   * Generate ad copy for products
   */
  async generateAdCopy(productInfo, options = {}) {
    const {
      platform = 'general',
      tone = this.brandVoice,
      length = 'medium',
      includeEmoji = true,
      callToAction = true
    } = options;

    const systemPrompt = this.buildMarketingSystemPrompt(tone);
    const userMessage = this.buildAdCopyMessage(productInfo, platform, length, includeEmoji, callToAction);

    try {
      const response = await this.grokClient.chat(
        [{ role: 'user', content: userMessage }],
        {
          systemPrompt: systemPrompt,
          temperature: 0.8, // Higher temperature for creative content
          maxTokens: 500
        }
      );

      return {
        success: true,
        adCopy: response.content,
        productName: productInfo.name,
        platform: platform,
        usage: response.usage
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate product description
   */
  async generateProductDescription(productInfo, options = {}) {
    const {
      length = 'medium',
      includeKeyFeatures = true,
      seoOptimized = true
    } = options;

    const systemPrompt = `You are an expert e-commerce copywriter specializing in pharmaceutical and health products. Write compelling, accurate product descriptions that inform and engage customers.`;

    const userMessage = `Create a ${length} product description for:

Product: ${productInfo.name}
Category: ${productInfo.category || 'Health & Wellness'}
Key Information: ${JSON.stringify(productInfo, null, 2)}

Requirements:
${includeKeyFeatures ? '- Include key features and benefits' : ''}
${seoOptimized ? '- Make it SEO-friendly with relevant keywords' : ''}
- Be accurate and professional
- Highlight what makes this product valuable
- Use clear, persuasive language

Write a description that helps customers make informed purchasing decisions.`;

    try {
      const response = await this.grokClient.chat(
        [{ role: 'user', content: userMessage }],
        {
          systemPrompt: systemPrompt,
          temperature: 0.7,
          maxTokens: 600
        }
      );

      return {
        success: true,
        description: response.content,
        productName: productInfo.name,
        usage: response.usage
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate email marketing content
   */
  async generateEmailContent(campaignInfo) {
    const systemPrompt = `You are an email marketing specialist for pharmacy and healthcare businesses. Create engaging email content that drives action while maintaining professionalism and compliance.`;

    const userMessage = `Create email marketing content for:

Campaign: ${campaignInfo.subject}
Target Audience: ${campaignInfo.audience || 'pharmacy customers'}
Goal: ${campaignInfo.goal || 'promote products'}
Key Points: ${JSON.stringify(campaignInfo.keyPoints || [], null, 2)}

Include:
1. Compelling subject line
2. Engaging opening paragraph
3. Main content body
4. Clear call-to-action
5. Professional closing

Make it persuasive yet professional.`;

    try {
      const response = await this.grokClient.chat(
        [{ role: 'user', content: userMessage }],
        {
          systemPrompt: systemPrompt,
          temperature: 0.8,
          maxTokens: 800
        }
      );

      return {
        success: true,
        emailContent: response.content,
        campaign: campaignInfo.subject,
        usage: response.usage
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate social media posts
   */
  async generateSocialMediaPost(content, platform = 'general') {
    const platformSpecs = this.getSocialMediaSpecs(platform);
    
    const systemPrompt = `You are a social media marketing expert for pharmacy and healthcare businesses. Create engaging, platform-appropriate content that resonates with audiences.`;

    const userMessage = `Create a ${platform} post about:

${content}

Platform: ${platform}
Character Limit: ${platformSpecs.charLimit || 'flexible'}
Style: ${platformSpecs.style || 'engaging and informative'}
Hashtags: ${platformSpecs.useHashtags ? 'Yes, include relevant hashtags' : 'No'}
Emojis: ${platformSpecs.useEmojis ? 'Yes, use appropriately' : 'Minimal'}

Make it engaging and shareable while maintaining professionalism.`;

    try {
      const response = await this.grokClient.chat(
        [{ role: 'user', content: userMessage }],
        {
          systemPrompt: systemPrompt,
          temperature: 0.9,
          maxTokens: 300
        }
      );

      return {
        success: true,
        post: response.content,
        platform: platform,
        usage: response.usage
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate promotional banner text
   */
  async generateBannerText(promotion) {
    const systemPrompt = `You are a creative copywriter specializing in concise, impactful promotional text for pharmacy e-commerce platforms.`;

    const userMessage = `Create compelling banner text for this promotion:

${JSON.stringify(promotion, null, 2)}

Requirements:
- Very short and punchy (max 10-15 words)
- Include the key value proposition
- Create urgency if applicable
- Be clear and direct

Provide 3 variations.`;

    try {
      const response = await this.grokClient.chat(
        [{ role: 'user', content: userMessage }],
        {
          systemPrompt: systemPrompt,
          temperature: 0.9,
          maxTokens: 200
        }
      );

      return {
        success: true,
        bannerVariations: response.content,
        usage: response.usage
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate SEO content
   */
  async generateSEOContent(topic, keywords = []) {
    const systemPrompt = `You are an SEO content specialist for healthcare and pharmacy websites. Create optimized content that ranks well while providing genuine value to readers.`;

    const userMessage = `Create SEO-optimized content about: ${topic}

Target Keywords: ${keywords.join(', ')}

Requirements:
- Naturally incorporate keywords
- Provide valuable, informative content
- Use clear structure with headings
- 300-500 words
- Engaging and readable

Create content that serves both search engines and human readers.`;

    try {
      const response = await this.grokClient.chat(
        [{ role: 'user', content: userMessage }],
        {
          systemPrompt: systemPrompt,
          temperature: 0.7,
          maxTokens: 1000
        }
      );

      return {
        success: true,
        content: response.content,
        topic: topic,
        keywords: keywords,
        usage: response.usage
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Build marketing system prompt
   */
  buildMarketingSystemPrompt(tone) {
    return `You are an expert marketing copywriter for pharmacy e-commerce and healthcare platforms.

Your writing style is: ${tone}

GUIDELINES:
1. Create compelling, persuasive content
2. Maintain accuracy - never make false health claims
3. Be clear and concise
4. Focus on benefits, not just features
5. Include strong calls-to-action when appropriate
6. Adapt tone to platform and audience
7. Follow healthcare marketing regulations
8. Be authentic and trustworthy
9. Use power words effectively
10. Make content scannable and engaging

You help pharmacies connect with customers through effective marketing content.`;
  }

  /**
   * Build ad copy message
   */
  buildAdCopyMessage(productInfo, platform, length, includeEmoji, callToAction) {
    let message = `Create ${length}-length ad copy for:\n\n`;
    message += `Product: ${productInfo.name}\n`;
    
    if (productInfo.category) {
      message += `Category: ${productInfo.category}\n`;
    }
    
    if (productInfo.benefits) {
      message += `Key Benefits: ${Array.isArray(productInfo.benefits) ? productInfo.benefits.join(', ') : productInfo.benefits}\n`;
    }
    
    if (productInfo.price) {
      message += `Price: $${productInfo.price}\n`;
    }

    message += `\nPlatform: ${platform}\n`;
    message += `Emojis: ${includeEmoji ? 'Include relevant emojis' : 'No emojis'}\n`;
    message += `Call-to-Action: ${callToAction ? 'Include strong CTA' : 'Informational only'}\n`;

    return message;
  }

  /**
   * Get social media platform specifications
   */
  getSocialMediaSpecs(platform) {
    const specs = {
      twitter: {
        charLimit: 280,
        style: 'concise and engaging',
        useHashtags: true,
        useEmojis: true
      },
      facebook: {
        charLimit: 500,
        style: 'conversational and friendly',
        useHashtags: false,
        useEmojis: true
      },
      instagram: {
        charLimit: 2200,
        style: 'visual and lifestyle-focused',
        useHashtags: true,
        useEmojis: true
      },
      linkedin: {
        charLimit: 3000,
        style: 'professional and informative',
        useHashtags: true,
        useEmojis: false
      },
      general: {
        charLimit: 'flexible',
        style: 'engaging and informative',
        useHashtags: true,
        useEmojis: true
      }
    };

    return specs[platform.toLowerCase()] || specs.general;
  }

  /**
   * Set brand voice
   */
  setBrandVoice(voice) {
    const validVoices = ['professional', 'friendly', 'casual', 'authoritative', 'empathetic'];
    
    if (validVoices.includes(voice)) {
      this.brandVoice = voice;
      return true;
    }
    
    return false;
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MarketingContentService;
}

if (typeof window !== 'undefined') {
  window.MarketingContentService = MarketingContentService;
}
