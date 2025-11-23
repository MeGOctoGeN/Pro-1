/**
 * HealthAdviceService - Provides AI-powered health advice with proper disclaimers
 * Uses Grok AI to answer general health questions (not medical diagnosis)
 */

const GrokClient = require('../client/GrokClient');

class HealthAdviceService {
  constructor(config = {}) {
    this.grokClient = config.grokClient || new GrokClient(config);
    this.disclaimerEnabled = config.disclaimerEnabled !== false;
  }

  /**
   * Provide general health advice
   */
  async provideHealthAdvice(question, context = {}) {
    const systemPrompt = this.buildSystemPrompt();
    const userMessage = this.buildQuestionMessage(question, context);

    try {
      const response = await this.grokClient.chat(
        [{ role: 'user', content: userMessage }],
        {
          systemPrompt: systemPrompt,
          temperature: 0.6,
          maxTokens: 1000
        }
      );

      let advice = response.content;

      // Always add disclaimer for health advice
      if (this.disclaimerEnabled) {
        advice = this.addHealthDisclaimer(advice);
      }

      return {
        success: true,
        advice: advice,
        question: question,
        isGeneralAdvice: true,
        usage: response.usage
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        question: question
      };
    }
  }

  /**
   * Get wellness tips
   */
  async getWellnessTips(category = 'general') {
    const systemPrompt = `You are a wellness advisor AI. Provide helpful, evidence-based wellness tips that promote healthy living.`;

    const userMessage = `Provide 5 practical wellness tips for the category: ${category}. 
    
Make them:
- Actionable and specific
- Evidence-based
- Easy to implement
- Suitable for general audience

Format as a numbered list.`;

    try {
      const response = await this.grokClient.chat(
        [{ role: 'user', content: userMessage }],
        {
          systemPrompt: systemPrompt,
          temperature: 0.7,
          maxTokens: 800
        }
      );

      return {
        success: true,
        tips: response.content,
        category: category,
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
   * Answer nutrition questions
   */
  async answerNutritionQuestion(question) {
    const systemPrompt = `You are a nutrition information AI assistant. Provide evidence-based nutritional information and guidance. Always emphasize the importance of consulting with healthcare professionals or registered dietitians for personalized advice.`;

    const userMessage = `${question}\n\nProvide a helpful, informative response about nutrition.`;

    try {
      const response = await this.grokClient.chat(
        [{ role: 'user', content: userMessage }],
        {
          systemPrompt: systemPrompt,
          temperature: 0.6,
          maxTokens: 900
        }
      );

      let answer = response.content;
      
      if (this.disclaimerEnabled) {
        answer = this.addNutritionDisclaimer(answer);
      }

      return {
        success: true,
        answer: answer,
        topic: 'nutrition',
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
   * Provide preventive care information
   */
  async getPreventiveCareInfo(topic) {
    const systemPrompt = `You are a preventive healthcare information AI. Provide accurate information about preventive care measures, screenings, and healthy lifestyle practices.`;

    const userMessage = `Provide comprehensive information about: ${topic}

Include:
1. What it is
2. Why it's important
3. Who should consider it
4. How often
5. What to expect

Keep it informative and accessible.`;

    try {
      const response = await this.grokClient.chat(
        [{ role: 'user', content: userMessage }],
        {
          systemPrompt: systemPrompt,
          temperature: 0.5,
          maxTokens: 1000
        }
      );

      return {
        success: true,
        information: response.content,
        topic: topic,
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
   * Build system prompt for health advice
   */
  buildSystemPrompt() {
    return `You are a health information AI assistant for a pharmacy management system.

Your role is to provide general health information and wellness guidance to help people make informed decisions about their health.

CRITICAL GUIDELINES:
1. Provide general health information only - NEVER diagnose medical conditions
2. Always encourage consulting healthcare professionals for medical concerns
3. Be accurate and evidence-based in your information
4. Use clear, accessible language
5. Be empathetic and supportive
6. Emphasize preventive care and healthy lifestyle choices
7. Never prescribe medications or treatments
8. If a question requires medical expertise, direct to a healthcare provider
9. Prioritize safety and well-being above all else

You are an educational resource, not a replacement for professional medical care.`;
  }

  /**
   * Build question message with context
   */
  buildQuestionMessage(question, context) {
    let message = question;

    if (context.userAge) {
      message += `\n\nContext: User is ${context.userAge} years old.`;
    }

    if (context.specificConcern) {
      message += `\nSpecific concern: ${context.specificConcern}`;
    }

    return message;
  }

  /**
   * Add health disclaimer
   */
  addHealthDisclaimer(advice) {
    const disclaimer = `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ IMPORTANT HEALTH DISCLAIMER

This information is provided by AI for general educational purposes only and is not intended as medical advice, diagnosis, or treatment. 

Always seek the advice of your physician, pharmacist, or other qualified health provider with any questions you may have regarding a medical condition or treatment.

Never disregard professional medical advice or delay seeking it because of information provided by this AI assistant.

If you have a medical emergency, call your local emergency number immediately.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    return advice + disclaimer;
  }

  /**
   * Add nutrition disclaimer
   */
  addNutritionDisclaimer(answer) {
    const disclaimer = `\n\n💡 Note: This nutritional information is for general education. Individual nutritional needs vary. Please consult a registered dietitian or healthcare provider for personalized nutrition advice.`;

    return answer + disclaimer;
  }

  /**
   * Check if question is appropriate for AI
   */
  isAppropriateForAI(question) {
    // Configurable emergency keywords (should be maintained by medical professionals)
    // Using pattern matching for better accuracy
    const emergencyPatterns = [
      // Critical symptoms
      /\b(emergency|urgent|critical|life[\s-]threatening)\b/i,
      /\b(severe|intense|unbearable|excruciating)\s+(pain|headache|discomfort)\b/i,
      /\bchest\s+pain\b/i,
      /\b(difficulty|trouble|can't|cannot)\s+(breath|breathing|breathe)\b/i,
      /\b(unconscious|unresponsive|collapsed|passed\s+out)\b/i,
      /\b(bleeding\s+heavily|severe\s+bleeding|hemorrhage)\b/i,
      
      // Mental health emergencies
      /\b(suicidal|suicide|kill\s+(my)?self|end\s+(my\s+)?life)\b/i,
      /\b(self[\s-]harm|hurt\s+(my)?self)\b/i,
      
      // Poisoning/overdose
      /\b(overdose|overdosed|took\s+too\s+many)\b/i,
      /\b(poisoning|poisoned|ingested\s+(toxic|poison))\b/i,
      /\bswallowed\b.*\b(toxic|poison|chemicals?)\b/i,
      
      // Stroke symptoms
      /\b(stroke|sudden\s+weakness|facial\s+droop|slurred\s+speech)\b/i,
      
      // Heart attack symptoms
      /\b(heart\s+attack|cardiac\s+arrest)\b/i,
      
      // Severe allergic reactions
      /\b(anaphylaxis|severe\s+allergic\s+reaction|throat\s+closing)\b/i,
      
      // High fever in children
      /\b(infant|baby|child).*\b(high\s+fever|temperature.*10[4-9]|seizure)\b/i
    ];

    const lowerQuestion = question.toLowerCase();
    
    for (const pattern of emergencyPatterns) {
      if (pattern.test(question)) {
        return {
          appropriate: false,
          reason: 'This appears to be a medical emergency. Please call emergency services or seek immediate medical attention.',
          emergencyDetected: true
        };
      }
    }

    // Additional check for multiple concerning symptoms
    const concerningSymptoms = ['pain', 'bleeding', 'fever', 'vomiting', 'dizzy', 'confused'];
    const symptomCount = concerningSymptoms.filter(s => lowerQuestion.includes(s)).length;
    
    if (symptomCount >= 3) {
      return {
        appropriate: false,
        reason: 'Multiple concerning symptoms detected. Please consult a healthcare provider immediately.',
        emergencyDetected: true
      };
    }

    return {
      appropriate: true,
      reason: null,
      emergencyDetected: false
    };
  }

  /**
   * Get emergency response message
   */
  getEmergencyResponseMessage() {
    return `🚨 MEDICAL EMERGENCY DETECTED

This appears to be a medical emergency that requires immediate professional attention.

IMMEDIATE ACTIONS:
- Call your local emergency number (911 in US, 999 in UK, 112 in EU, etc.)
- Go to the nearest emergency room
- Contact your doctor immediately

DO NOT rely on AI assistance for medical emergencies.

Time is critical - seek professional help now.`;
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HealthAdviceService;
}

if (typeof window !== 'undefined') {
  window.HealthAdviceService = HealthAdviceService;
}
