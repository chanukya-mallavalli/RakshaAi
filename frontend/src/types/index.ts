export type RiskLevel = 'SAFE' | 'SUSPICIOUS' | 'DANGEROUS' | 'UNABLE TO VERIFY';

export type AnalysisType = 'message' | 'link' | 'screenshot' | 'qr' | 'call';

export interface AnalysisResult {
  risk_score: number;
  risk_level: RiskLevel;
  scam_type: string;
  confidence: number;
  summary: string;
  reasons: string[];
  recommended_actions: string[];
  things_to_avoid: string[];
  extracted_text?: string;
  analyzed_target?: string;
  provider_used?: string;
}

export interface HealthStatus {
  status: string;
  app_name: string;
  tagline: string;
  version: string;
  environment: string;
  ai_provider: string;
  database: string;
  details?: Record<string, unknown>;
}

export interface TrustedContact {
  id: number;
  name: string;
  relation: string;
  phone?: string;
  email?: string;
  is_primary: boolean;
  created_at?: string;
}

export interface HistoryItem {
  id: number;
  created_at: string;
  analysis_type: AnalysisType;
  content_preview: string;
  risk_level: RiskLevel;
  risk_score: number;
  scam_type: string;
  summary?: string;
}

export type SupportedLanguage = 'en' | 'hi' | 'te';

export type BackgroundThemeType = 'plain' | 'gradient' | 'particles' | '3d' | 'cyber-stream';

export type PlainVariant = 'navy' | 'black' | 'light' | 'white';

export interface ThemeSettings {
  bgTheme: BackgroundThemeType;
  plainVariant: PlainVariant;
  animationsEnabled: boolean;
  threeDEnabled: boolean;
  bgIntensity: number;     // 0.2 to 1.0
  animationSpeed: number;  // 0.2 to 2.0
  particleDensity: number; // 20 to 100
  bgDimming: number;       // 0.2 to 0.95
  isDark: boolean;
}

export interface DemoScenario {
  id: string;
  title: string;
  category: string;
  type: AnalysisType;
  content: string;
  sender?: string;
  expectedResult: AnalysisResult;
}
