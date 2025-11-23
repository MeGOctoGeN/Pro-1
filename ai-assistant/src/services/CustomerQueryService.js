/**
 * CustomerQueryService - Handles customer queries about medications using Grok AI
 * Provides intelligent responses to medication-related questions
 */

const GrokClient = require('../client/GrokClient');

class CustomerQueryService {
  constructor(config = {}) {
    this.grokClient = config.grokClient || new GrokClient(config);
    this.includeDisclaimer = config.includeDisclaimer !== false;
  }

  /**
   * Answer customer query about medications
   */
  async answerQuery(query, context = {}) {
    const systemPrompt = this.buildSystemPrompt();
    const userMessage = this.buildUserMessage(query, context);

    try {
      const response = await this.grokClient.chat(
        [{ role: 'user', content: userMessage }],
        {
          systemPrompt: systemPrompt,
          temperature: 0.7,
          maxTokens: 800
        }
      );

      let answer = response.content;

      // Add disclaimer if enabled
      if (this.includeDisclaimer) {
        answer = this.addDisclaimer(answer);
      }

      return {
        success: true,
        answer: answer,
        query: query,
        usage: response.usage
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        query: query
      };
    }
  }

  /**
   * Get medication information
   */
  async getMedicationInfo(medicationName) {
    const query = `Please provide detailed information about ${medicationName}, including:
- What it's used for
- Common dosages
- Potential side effects
- Important warnings
- Storage instructions`;

    return this.answerQuery(query, { type: 'medication_info' });
  }

  /**
   * Check drug interactions
   */
  async checkInteractions(medications) {
    const medicationList = Array.isArray(medications) ? medications.join(', ') : medications;
    
    const query = `Can you check for potential drug interactions between the following medications: ${medicationList}?`;

    return this.answerQuery(query, { type: 'drug_interactions' });
  }

  /**
   * Answer dosage questions
   */
  async answerDosageQuestion(medication, patientInfo = {}) {
    const patientContext = patientInfo.age ? ` for a ${patientInfo.age}-year-old patient` : '';
    
    const query = `What is the typical dosage for ${medication}${patientContext}?`;

    return this.answerQuery(query, { type: 'dosage', patientInfo });
  }

  /**
   * Build system prompt for customer queries
   */
  buildSystemPrompt() {
    return `You are a helpful pharmacy assistant AI for MOST-PHARMA-GRO pharmacy management system. 

Your role is to provide accurate, helpful information about medications, their uses, side effects, and general health guidance.

IMPORTANT GUIDELINES:
1. Always provide accurate, evidence-based information
2. Be clear and concise in your responses
3. Use simple language that patients can understand
4. Emphasize when patients should consult healthcare professionals
5. Never diagnose conditions or prescribe medications
6. Always recommend consulting a pharmacist or doctor for personalized medical advice
7. Be empathetic and professional in tone
8. If you're unsure about something, admit it and recommend professional consultation
9. Prioritize patient safety above all else

Remember: You are an informational assistant, not a replacement for professional medical advice.`;
  }

  /**
   * Build user message with context
   */
  buildUserMessage(query, context) {
    let message = query;

    if (context.type) {
      message = `[Query Type: ${context.type}]\n${message}`;
    }

    if (context.patientInfo) {
      message += `\n\nPatient Context: ${JSON.stringify(context.patientInfo, null, 2)}`;
    }

    return message;
  }

  /**
   * Add medical disclaimer to response
   */
  addDisclaimer(answer) {
    const disclaimer = `\n\n⚠️ DISCLAIMER: This information is provided by AI for educational purposes only and should not be considered medical advice. Always consult with a licensed pharmacist or healthcare provider before making any decisions about medications or health treatments.`;

    return answer + disclaimer;
  }

  /**
   * Validate query before processing
   */
  validateQuery(query) {
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      throw new Error('Query must be a non-empty string');
    }

    if (query.length > 5000) {
      throw new Error('Query is too long. Maximum length is 5000 characters');
    }

    // Sanitize and check for suspicious patterns
    const suspiciousPatterns = [
      /<script[^>]*>.*?<\/script>/gi,  // Script tags
      /javascript:/gi,                  // JavaScript protocol
      /on\w+\s*=/gi,                   // Event handlers
      /<iframe[^>]*>/gi,               // iframes
      /eval\(/gi,                       // eval calls
      /expression\(/gi                  // CSS expressions
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(query)) {
        throw new Error('Query contains potentially malicious content');
      }
    }

    return true;
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CustomerQueryService;
}

if (typeof window !== 'undefined') {
  window.CustomerQueryService = CustomerQueryService;
}
