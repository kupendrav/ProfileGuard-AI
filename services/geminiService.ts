import { GoogleGenAI, Type } from "@google/genai";
import { BusinessProfile, ScanResult, ReviewAuditResult, SuspensionReason, VerificationIssueType, VerificationAdvice } from "../types";

// API key storage key
const API_KEY_STORAGE_KEY = 'profileguard_gemini_api_key';

// Get/set API key from localStorage
export const getApiKey = (): string | null => {
  return localStorage.getItem(API_KEY_STORAGE_KEY);
};

export const setApiKey = (key: string): void => {
  localStorage.setItem(API_KEY_STORAGE_KEY, key);
};

export const clearApiKey = (): void => {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
};

// Helper to get AI instance safely
const getAI = () => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API Key not configured. Please add your Gemini API key in Settings.");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeProfileCompliance = async (profile: BusinessProfile): Promise<ScanResult> => {
  const ai = getAI();
  
  const prompt = `
    Analyze this Google Business Profile for strict 2024-2025 compliance policies.
    
    CRITICAL CHECKS:
    1. **NAP Consistency**: Does the address/phone format look standard? (Warn about minor "St" vs "Street" mismatches with state licenses).
    2. **Virtual Office Crackdown**: Does the address suggest a coworking space or virtual office? (High risk of "No permanent signage" suspension).
    3. **Keyword Stuffing**: Distinguish between legitimate legal names vs keywords added for ranking (e.g., "Best Plumbing Co" vs "Joe's Plumbing - Best Drain Cleaner").
    4. **Trigger-Happy Edits**: warning that changing phone numbers or managers on this profile might trigger immediate "Hard Suspension".

    Profile Data:
    Name: ${profile.name}
    Address: ${profile.address}
    Category: ${profile.category}
    Description: ${profile.description}
    Website: ${profile.website}

    Return JSON with riskScore (0-100), riskLevel, issues, recommendations, and analysis.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          riskScore: { type: Type.INTEGER },
          riskLevel: { type: Type.STRING, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"] },
          issues: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
          analysis: { type: Type.STRING }
        }
      }
    }
  });

  if (!response.text) throw new Error("No response from AI");
  return JSON.parse(response.text) as ScanResult;
};

export const generateAppealLetter = async (
  profile: BusinessProfile,
  reason: SuspensionReason,
  additionalDetails: string
): Promise<string> => {
  const ai = getAI();

  const prompt = `
    Write a Google Business Profile reinstatement appeal letter.
    
    Context:
    Suspension Reason: ${reason}.
    Current Climate: Acknowledge the "Reinstatement Backlog" (1-3 weeks wait). The letter must be concise to speed up review.
    
    Specific Handling:
    - If "Verification Failure": Mention if video was uploaded but stuck in "Processing" (Death Loop).
    - If "Suspicious Activity": Clarify if recent edits (hours, phone) were legitimate updates.
    
    Business Details:
    Name: ${profile.name}
    Address: ${profile.address}
    Phone: ${profile.phone}
    Website: ${profile.website}

    User Evidence:
    ${additionalDetails}

    Structure: Formal, Evidence-First, Polite but Assertive.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text || "Failed to generate appeal letter.";
};

export const auditReviews = async (reviewsText: string): Promise<ReviewAuditResult> => {
  const ai = getAI();

  const prompt = `
    Analyze these reviews for "Ghost Review" triggers and "Aggressive AI Filtering" risks.
    
    Specific Filters to Check:
    1. **Incentivized Patterns**: Reviews that sound like they were posted from the store's Wi-Fi or same IP (vague praise, posted in clusters).
    2. **Review Limbo**: Content that might delay publishing (URLs, profanity, hate speech).
    3. **Authenticity**: Generic reviews that look like bot spam.

    Reviews:
    ${reviewsText}

    Return JSON with flaggedCount, analysis, and suspiciousReviews.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          flaggedCount: { type: Type.INTEGER },
          analysis: { type: Type.STRING },
          suspiciousReviews: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                reason: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });

  if (!response.text) throw new Error("No response from AI");
  return JSON.parse(response.text) as ReviewAuditResult;
};

export const getVerificationAdvice = async (
  issueType: VerificationIssueType,
  details: string
): Promise<VerificationAdvice> => {
  const ai = getAI();

  const prompt = `
    Provide technical troubleshooting steps for a Google Business Profile Verification issue.
    
    Issue Type: ${issueType}
    User Details: ${details}

    Knowledge Base:
    - **DEATH_LOOP (Video stuck processing)**: It's a technical flaw. If >5 days, delete upload and retry? Or contact support? Mention the "3+ weeks" reality.
    - **UPLOAD_BUG (Mobile failure)**: Caused by local cache conflicts. Suggest: Clear App Cache/Data, free up storage, try recording at lower resolution, or keep app open.
    - **LOCKOUT (No options)**: System removed self-service. Must submit manual support ticket.
    - **AI_REJECTION**: Video rejected instantly. Cause: "Sensitive Content" (bank info in background) or "Insufficient Proof" (no permanent signage).

    Return JSON: { steps: string[], explanation: string, technicalFix: boolean }
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          steps: { type: Type.ARRAY, items: { type: Type.STRING } },
          explanation: { type: Type.STRING },
          technicalFix: { type: Type.BOOLEAN }
        }
      }
    }
  });

  if (!response.text) throw new Error("No response from AI");
  return JSON.parse(response.text) as VerificationAdvice;
};
