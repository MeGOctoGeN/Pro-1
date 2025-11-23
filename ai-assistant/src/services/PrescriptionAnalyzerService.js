/**
 * PrescriptionAnalyzerService - Analyzes prescription patterns using Grok AI
 * Provides insights into prescription trends and potential issues
 */

const GrokClient = require('../client/GrokClient');

class PrescriptionAnalyzerService {
  constructor(config = {}) {
    this.grokClient = config.grokClient || new GrokClient(config);
    this.privacyMode = config.privacyMode !== false; // Default to true for privacy
  }

  /**
   * Analyze prescription patterns
   */
  async analyzePrescriptionPatterns(prescriptionData, options = {}) {
    const {
      timeframe = '30 days',
      focusAreas = ['trends', 'frequency', 'interactions']
    } = options;

    // Anonymize data for privacy
    const anonymizedData = this.privacyMode ? this.anonymizeData(prescriptionData) : prescriptionData;

    const systemPrompt = this.buildSystemPrompt();
    const userMessage = this.buildAnalysisMessage(anonymizedData, timeframe, focusAreas);

    try {
      const response = await this.grokClient.chat(
        [{ role: 'user', content: userMessage }],
        {
          systemPrompt: systemPrompt,
          temperature: 0.4,
          maxTokens: 1200
        }
      );

      return {
        success: true,
        analysis: response.content,
        timeframe: timeframe,
        privacyCompliant: this.privacyMode,
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
   * Identify prescription trends
   */
  async identifyTrends(prescriptionHistory) {
    const systemPrompt = `You are a pharmaceutical data analyst AI. Identify key trends and patterns in prescription data while respecting patient privacy.`;

    const anonymizedHistory = this.privacyMode ? this.anonymizeData(prescriptionHistory) : prescriptionHistory;

    const userMessage = `Analyze the following prescription history and identify:
1. Most prescribed medications
2. Emerging trends
3. Declining prescriptions
4. Therapeutic category patterns
5. Insights for pharmacy operations

Prescription History (anonymized):
${JSON.stringify(anonymizedHistory, null, 2)}`;

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
        trends: response.content,
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
   * Detect potential issues in prescriptions
   */
  async detectPotentialIssues(prescriptionData) {
    const systemPrompt = `You are a clinical pharmacy AI system. Analyze prescription data to identify potential issues such as drug interactions, duplicate therapies, or unusual patterns. Always prioritize patient safety.`;

    const anonymizedData = this.privacyMode ? this.anonymizeData(prescriptionData) : prescriptionData;

    const userMessage = `Review the following prescription data and flag any potential issues:

${JSON.stringify(anonymizedData, null, 2)}

Look for:
1. Potential drug interactions
2. Duplicate therapy
3. Unusual dosages
4. Contraindications
5. Other safety concerns

Note: This is for informational review only. All identified issues should be verified by a licensed pharmacist.`;

    try {
      const response = await this.grokClient.chat(
        [{ role: 'user', content: userMessage }],
        {
          systemPrompt: systemPrompt,
          temperature: 0.3, // Lower temperature for safety-critical analysis
          maxTokens: 1200
        }
      );

      return {
        success: true,
        issues: response.content,
        requiresPharmacistReview: true,
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
   * Generate prescription insights report
   */
  async generateInsightsReport(prescriptionData, period = 'monthly') {
    const systemPrompt = `You are a pharmacy analytics AI. Generate comprehensive insights reports from prescription data to help pharmacies optimize operations and improve patient care.`;

    const anonymizedData = this.privacyMode ? this.anonymizeData(prescriptionData) : prescriptionData;

    const userMessage = `Generate a ${period} prescription insights report based on this data:

${JSON.stringify(anonymizedData, null, 2)}

Include:
1. Executive Summary
2. Key Metrics
3. Top Prescribed Medications
4. Therapeutic Category Analysis
5. Operational Recommendations
6. Areas for Improvement

Format the report in a clear, structured manner.`;

    try {
      const response = await this.grokClient.chat(
        [{ role: 'user', content: userMessage }],
        {
          systemPrompt: systemPrompt,
          temperature: 0.4,
          maxTokens: 1500
        }
      );

      return {
        success: true,
        report: response.content,
        period: period,
        generatedAt: new Date().toISOString(),
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
   * Build system prompt for prescription analysis
   */
  buildSystemPrompt() {
    return `You are an advanced pharmaceutical analytics AI for pharmacy management systems.

Your role is to analyze prescription patterns while maintaining strict privacy and compliance standards.

IMPORTANT GUIDELINES:
1. Always respect patient privacy and HIPAA compliance
2. Work with anonymized data only
3. Focus on patterns and trends, not individual cases
4. Provide actionable insights for pharmacy operations
5. Flag potential safety concerns for pharmacist review
6. Use evidence-based analysis
7. Be objective and data-driven

Your analysis helps pharmacies improve operations, optimize inventory, and enhance patient care.`;
  }

  /**
   * Build analysis message
   */
  buildAnalysisMessage(data, timeframe, focusAreas) {
    let message = `Analyze prescription patterns for the ${timeframe} period.\n\n`;
    message += `Focus Areas: ${focusAreas.join(', ')}\n\n`;
    message += `Data:\n${JSON.stringify(data, null, 2)}\n\n`;
    message += `Provide a comprehensive analysis covering the specified focus areas.`;
    
    return message;
  }

  /**
   * Anonymize prescription data for privacy compliance
   */
  anonymizeData(data) {
    if (!data || typeof data !== 'object') {
      return data;
    }

    // Create a deep copy
    const anonymized = JSON.parse(JSON.stringify(data));

    // Configurable list of fields to remove (can be extended via config)
    const defaultRemoveFields = [
      'patientName', 'patientId', 'ssn', 'socialSecurityNumber',
      'address', 'streetAddress', 'street', 'city', 'zipCode', 'postalCode',
      'phone', 'phoneNumber', 'mobile', 'telephone',
      'email', 'emailAddress',
      'doctorName', 'doctorId', 'physicianName', 'providerId',
      'birthDate', 'dateOfBirth', 'dob',
      'firstName', 'lastName', 'middleName', 'fullName',
      'insuranceId', 'memberId', 'policyNumber',
      'medicalRecordNumber', 'mrn', 'patientNumber'
    ];
    
    const removeFields = this.config?.anonymizeFields || defaultRemoveFields;
    
    const cleanObject = (obj) => {
      if (!obj || typeof obj !== 'object') return obj;

      if (Array.isArray(obj)) {
        return obj.map(item => cleanObject(item));
      }

      Object.keys(obj).forEach(key => {
        const lowerKey = key.toLowerCase();
        // Check if field name or lowercase version matches any PII field
        if (removeFields.includes(key) || removeFields.some(f => lowerKey.includes(f.toLowerCase()))) {
          delete obj[key];
        } else if (typeof obj[key] === 'object') {
          obj[key] = cleanObject(obj[key]);
        }
      });

      return obj;
    };

    return cleanObject(anonymized);
  }

  /**
   * Validate prescription data
   */
  validatePrescriptionData(data) {
    if (!data) {
      throw new Error('Prescription data is required');
    }

    if (typeof data !== 'object') {
      throw new Error('Prescription data must be an object or array');
    }

    return true;
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PrescriptionAnalyzerService;
}

if (typeof window !== 'undefined') {
  window.PrescriptionAnalyzerService = PrescriptionAnalyzerService;
}
