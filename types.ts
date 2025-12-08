export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  SCANNER = 'SCANNER',
  APPEAL = 'APPEAL',
  REVIEWS = 'REVIEWS',
  VERIFICATION = 'VERIFICATION'
}

export enum SuspensionReason {
  VERIFICATION = 'Verification Failure (Loop/Rejected)',
  QUALITY = 'Quality Issues (Name/Spam)',
  SUSPICIOUS = 'Suspicious Activity (Edits)',
  CONTENT = 'Content Policy Violation',
  VIRTUAL_OFFICE = 'Virtual Office/Address Issue'
}

export enum VerificationIssueType {
  DEATH_LOOP = 'DEATH_LOOP', // Video stuck processing
  UPLOAD_BUG = 'UPLOAD_BUG', // Mobile upload fails immediately
  LOCKOUT = 'LOCKOUT', // No options left
  AI_REJECTION = 'AI_REJECTION' // Instant rejection for sensitive content
}

export interface BusinessProfile {
  name: string;
  address: string;
  phone: string;
  website: string;
  category: string;
  description: string;
}

export interface ScanResult {
  riskScore: number; // 0-100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  issues: string[];
  recommendations: string[];
  analysis: string;
}

export interface ReviewAuditResult {
  flaggedCount: number;
  analysis: string;
  suspiciousReviews: {
    text: string;
    reason: string;
  }[];
}

export interface VerificationAdvice {
  steps: string[];
  explanation: string;
  technicalFix: boolean; // True if it involves cache clearing etc.
}