/**
 * InventoryPredictionService - Predicts inventory needs using Grok AI
 * Analyzes historical data to forecast inventory requirements
 */

const GrokClient = require('../client/GrokClient');

class InventoryPredictionService {
  constructor(config = {}) {
    this.grokClient = config.grokClient || new GrokClient(config);
  }

  /**
   * Predict inventory needs based on historical data
   */
  async predictInventoryNeeds(historicalData, options = {}) {
    const {
      timeframe = '30 days',
      includeSeasonality = true,
      confidenceLevel = 0.8
    } = options;

    const systemPrompt = this.buildSystemPrompt();
    const userMessage = this.buildPredictionMessage(historicalData, timeframe, includeSeasonality);

    try {
      const response = await this.grokClient.chat(
        [{ role: 'user', content: userMessage }],
        {
          systemPrompt: systemPrompt,
          temperature: 0.3, // Lower temperature for more consistent predictions
          maxTokens: 1200
        }
      );

      return {
        success: true,
        prediction: response.content,
        timeframe: timeframe,
        confidence: confidenceLevel,
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
   * Analyze stock trends
   */
  async analyzeStockTrends(inventoryHistory) {
    const systemPrompt = `You are an inventory management AI expert for pharmacy systems. Analyze inventory data and provide insights on stock trends, patterns, and recommendations.`;

    const userMessage = `Analyze the following inventory history and provide:
1. Key trends identified
2. Products with increasing/decreasing demand
3. Seasonal patterns (if any)
4. Stock optimization recommendations

Inventory History:
${JSON.stringify(inventoryHistory, null, 2)}

Provide a structured analysis with clear actionable recommendations.`;

    try {
      const response = await this.grokClient.chat(
        [{ role: 'user', content: userMessage }],
        {
          systemPrompt: systemPrompt,
          temperature: 0.4,
          maxTokens: 1000
        }
      );

      return {
        success: true,
        analysis: response.content,
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
   * Generate reorder recommendations
   */
  async generateReorderRecommendations(currentStock, salesData) {
    const systemPrompt = `You are an inventory optimization AI. Generate smart reorder recommendations based on current stock levels and sales data.`;

    const userMessage = `Based on the following data, recommend which products to reorder, the quantities, and the priority:

Current Stock:
${JSON.stringify(currentStock, null, 2)}

Recent Sales Data:
${JSON.stringify(salesData, null, 2)}

Provide recommendations in the following format:
- Product name
- Recommended order quantity
- Priority (High/Medium/Low)
- Reasoning`;

    try {
      const response = await this.grokClient.chat(
        [{ role: 'user', content: userMessage }],
        {
          systemPrompt: systemPrompt,
          temperature: 0.3,
          maxTokens: 1200
        }
      );

      return {
        success: true,
        recommendations: response.content,
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
   * Detect anomalies in inventory patterns
   */
  async detectAnomalies(inventoryData) {
    const systemPrompt = `You are an AI specialized in detecting anomalies in pharmacy inventory data. Identify unusual patterns, sudden spikes or drops, and potential issues.`;

    const userMessage = `Analyze this inventory data for anomalies or unusual patterns:

${JSON.stringify(inventoryData, null, 2)}

Identify:
1. Unusual stock movements
2. Potential stockouts
3. Overstocking issues
4. Data irregularities
5. Recommended actions`;

    try {
      const response = await this.grokClient.chat(
        [{ role: 'user', content: userMessage }],
        {
          systemPrompt: systemPrompt,
          temperature: 0.4,
          maxTokens: 1000
        }
      );

      return {
        success: true,
        anomalies: response.content,
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
   * Build system prompt for predictions
   */
  buildSystemPrompt() {
    return `You are an advanced AI inventory prediction system for pharmacy management. 

Your expertise includes:
- Analyzing sales patterns and trends
- Forecasting inventory needs
- Identifying seasonal variations
- Optimizing stock levels
- Preventing stockouts and overstocking

Provide data-driven, accurate predictions with clear reasoning. Consider factors like:
- Historical sales data
- Seasonal trends
- Market conditions
- Product shelf life
- Lead times

Always provide practical, actionable recommendations.`;
  }

  /**
   * Build prediction message
   */
  buildPredictionMessage(historicalData, timeframe, includeSeasonality) {
    let message = `Predict inventory needs for the next ${timeframe} based on the following historical data:\n\n`;
    
    message += JSON.stringify(historicalData, null, 2);
    
    message += `\n\nPlease provide:
1. Predicted demand for each product
2. Recommended stock levels
3. Key factors influencing the prediction`;

    if (includeSeasonality) {
      message += `\n4. Seasonal considerations and adjustments`;
    }

    return message;
  }

  /**
   * Format historical data for analysis
   */
  formatHistoricalData(rawData) {
    // Helper method to format raw data into a structure suitable for AI analysis
    return {
      products: rawData.products || [],
      salesByMonth: rawData.salesByMonth || [],
      averageDailySales: rawData.averageDailySales || 0,
      peakPeriods: rawData.peakPeriods || []
    };
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = InventoryPredictionService;
}

if (typeof window !== 'undefined') {
  window.InventoryPredictionService = InventoryPredictionService;
}
