export interface CompanyProfile {
  name: string;
  tagline?: string;
  domain: string;
  primary_color: string;
  secondary_color?: string;
  industry_tag?: string;
  summary?: string;
  logo_prompt?: string;
  generated_logo?: string;
  hero_image?: string; // New field for URL-derived hero image
}

export interface IcpPersona {
  name: string;
  role: string;
  avatar_id: string;
  bio_snack: string;
  pain_points: string[];
  location?: string;
  // New fields for the overhauled UI
  company_size?: string;
  interests?: string[];
  preferred_channel?: string[]; // Updated to list
  avoid_channel?: string[]; // Updated to list
}

export interface ValueHook {
  one_liner: string;
  social_media_headline: string;
}

export interface MarketData {
  total_leads: number;
  confidence_score: number;
}

export interface AnalysisResult {
  company_profile: CompanyProfile;
  icp_persona: IcpPersona;
  value_hook: ValueHook;
  market_data: MarketData;
  is_hard_reset?: boolean;
}

export type AppStep = 'landing' | 'loading' | 'result';

export type ToneOfVoice = 'Consultative' | 'Aggressive' | 'Witty';