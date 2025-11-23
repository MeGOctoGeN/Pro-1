/**
 * GrokClient - xAI Grok API Integration
 * Handles communication with the xAI Grok API for AI-powered features
 */

class GrokClient {
  constructor(config = {}) {
    this.apiKey = config.apiKey || process.env.XAI_API_KEY || '';
    this.apiEndpoint = config.apiEndpoint || 'https://api.x.ai/v1/chat/completions';
    this.model = config.model || 'grok-beta';
    this.maxRetries = config.maxRetries || 3;
    this.timeout = config.timeout || 30000; // 30 seconds
    this.debug = config.debug || false;
    this.requireApiKey = config.requireApiKey !== false; // Default to true in production

    if (!this.apiKey) {
      const message = '[GrokClient] Warning: No API key provided. Set XAI_API_KEY environment variable or pass apiKey in config.';
      if (this.requireApiKey && process.env.NODE_ENV === 'production') {
        throw new Error(message);
      }
      console.warn(message);
    }
  }

  /**
   * Validate API key
   */
  validateApiKey() {
    if (!this.apiKey || this.apiKey.trim() === '') {
      throw new Error('XAI API key is required. Please set XAI_API_KEY environment variable or provide it in the config.');
    }
  }

  /**
   * Make a chat completion request to Grok API
   */
  async chat(messages, options = {}) {
    this.validateApiKey();

    const requestBody = {
      model: options.model || this.model,
      messages: messages,
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 1000,
      stream: false
    };

    if (options.systemPrompt) {
      requestBody.messages = [
        { role: 'system', content: options.systemPrompt },
        ...messages
      ];
    }

    let lastError;
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        this.log(`Attempt ${attempt}/${this.maxRetries} - Sending request to Grok API`);
        
        const response = await this.makeRequest(requestBody);
        
        if (response.choices && response.choices.length > 0) {
          const result = {
            content: response.choices[0].message.content,
            role: response.choices[0].message.role,
            finishReason: response.choices[0].finish_reason,
            usage: response.usage,
            model: response.model
          };

          this.log('Response received successfully');
          return result;
        } else {
          throw new Error('Invalid response format from Grok API');
        }
      } catch (error) {
        lastError = error;
        this.log(`Attempt ${attempt} failed: ${error.message}`, 'error');
        
        if (attempt < this.maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000); // Exponential backoff
          this.log(`Retrying in ${delay}ms...`);
          await this.sleep(delay);
        }
      }
    }

    throw new Error(`Failed to get response from Grok API after ${this.maxRetries} attempts: ${lastError.message}`);
  }

  /**
   * Make HTTP request to Grok API
   */
  async makeRequest(body) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(body),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.error) {
            errorMessage = errorJson.error.message || errorMessage;
          }
        } catch (e) {
          // If response is not JSON, use status text
        }

        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${this.timeout}ms`);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Generate text completion
   */
  async complete(prompt, options = {}) {
    const messages = [
      { role: 'user', content: prompt }
    ];

    const response = await this.chat(messages, options);
    return response.content;
  }

  /**
   * Test connection to Grok API
   */
  async testConnection() {
    try {
      this.validateApiKey();
      
      const response = await this.complete('Hello, this is a connection test. Please respond with "OK".');
      
      return {
        success: true,
        message: 'Connection successful',
        response: response
      };
    } catch (error) {
      return {
        success: false,
        message: `Connection failed: ${error.message}`,
        error: error
      };
    }
  }

  /**
   * Sleep helper for retry logic
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Debug logging
   */
  log(message, level = 'info') {
    if (!this.debug) return;

    const prefix = '[GrokClient]';
    const timestamp = new Date().toISOString();
    
    switch (level) {
      case 'error':
        console.error(`${timestamp} ${prefix}`, message);
        break;
      case 'warn':
        console.warn(`${timestamp} ${prefix}`, message);
        break;
      default:
        console.log(`${timestamp} ${prefix}`, message);
    }
  }
}

// Export for Node.js and browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GrokClient;
}

if (typeof window !== 'undefined') {
  window.GrokClient = GrokClient;
}
