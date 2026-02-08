import { AnalysisResult, IcpPersona } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

// --- 0. CONFIGURATION & CONSTANTS ---
const SYSTEM_INSTRUCTION = `
# ROLE
You are the Strategic ICP Matcher. Your task is to select the single best ICP ID from the database for the given company based on a strict waterfall logic.

# STEP 1: CLASSIFY
Decide if the company is B2B (Business-to-Business) or B2C (Business-to-Consumer).
- Mode B2B: Sells products/services to other companies (SaaS, ERP, Consulting, Logistics, etc.).
- Mode B2C: Sells products/services to individuals (Retail, Gaming, Lifestyle, Apps, Beverage, etc.).

# STEP 2: GEOGRAPHIC INSPECTION
Scan the provided context (Description, Title, site metadata) for explicit geographic mentions in the footer/contact info style.
- Look for country names or city+country pairs.
- If a clear, authoritative country is found, return it as "detected_country".
- IF a country is detected: provide a list of 3-5 "major_cities" (capital and major business hubs) for that specific country to ensure geographic consistency.

# STEP 3: MATCHING WATERFALL
- IF B2B: Match strictly based on Job Title, Industry, and Professional Challenges. Do NOT use personal interests or hobbies.
- IF B2C: Match strictly based on Personal Interests. Do NOT use job titles, challenges, or company size. Match on semantic overlap between the product/category and the persona's hobbies/interests.

# REFINEMENT PROTOCOLS
*   refined_tagline: Ultra-short (Max 12 words).
*   refined_summary: 2-3 sentences explaining exactly what they do and who they serve.
*   logo_prompt: Concise visual description of the brand's logo icon.

# OUTPUT JSON SCHEMA
{
  "mode": "b2b" | "b2c",
  "reason": "Short reason for classification",
  "selected_id": "The exact ID from the database",
  "matched_on": ["List of fields used for matching"],
  "top_matches": [ {"id": "ID", "score": 0.95}, {"id": "ID", "score": 0.8} ],
  "detected_country": "Full country name if found (e.g. Germany, USA, Netherlands), else null",
  "major_cities": ["City A", "City B", "City C"],
  "refined_tagline": "...",
  "refined_summary": "...",
  "logo_prompt": "..."
}
`;

// --- FALLBACK HERO POOL ---
const FALLBACK_HEROES = [
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop', // Modern Blue Tech
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop', // Professional Architecture
  'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop', // Minimalist Clean Office
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1600&auto=format&fit=crop', // Abstract Grid Connectivity
];

// --- HELPER: Stable Hash ---
function getStableHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// --- COUNTRY POOLS (Illustrative Examples) ---
const COUNTRY_CITY_POOLS: Record<string, string[]> = {
  'Netherlands': ['Amsterdam'],
  'Germany': ['Berlin', 'Munich', 'Hamburg'],
  'Denmark': ['Copenhagen'],
  'Sweden': ['Stockholm'],
  'Norway': ['Oslo'],
  'Finland': ['Helsinki'],
  'Spain': ['Madrid', 'Barcelona'],
  'Italy': ['Milan', 'Rome'],
  'USA': ['New York City', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'Jacksonville'],
  'France': ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Bordeaux', 'Lille'],
  'UK': ['London', 'Manchester', 'Birmingham'],
  'Singapore': ['Singapore'],
  'Canada': ['Toronto', 'Vancouver', 'Montreal'],
  'Australia': ['Sydney', 'Melbourne'],
};

// --- HELPER: Buyer City Selection (Waterfall Logic) ---
function pickBuyerCity(targetUrl: string, detectedCountry: string | null, dynamicPool: string[] | null): string {
  const urlObj = new URL(targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`);
  const hostname = urlObj.hostname.replace(/^www\./i, '');
  const parts = hostname.split('.');
  const tld = parts.pop()?.toLowerCase();
  const hash = getStableHash(hostname);

  // STEP 0: Detected Country Override (Authoritative)
  if (detectedCountry) {
    let pool = COUNTRY_CITY_POOLS[detectedCountry];
    
    // Generic Resolution Rule: If country is known but not in static pool, use the dynamic cities from AI
    if (!pool && dynamicPool && dynamicPool.length > 0) {
      pool = dynamicPool;
    }

    if (pool) {
      console.log(`[CITY] country=${detectedCountry} strategy=capital_or_major_hub`);
      return pool[hash % pool.length];
    }
  }

  // STEP 1: ccTLD Anchor (Fallback if Step 0 failed)
  const ccTLDMap: Record<string, string> = {
    'nl': 'Amsterdam',
    'de': 'Berlin',
    'dk': 'Copenhagen',
    'se': 'Stockholm',
    'no': 'Oslo',
    'fi': 'Helsinki',
    'es': 'Madrid',
    'it': 'Milan'
  };
  if (tld && ccTLDMap[tld]) return ccTLDMap[tld];

  // STEP 2 & 3: Large Country / Generic TLD Pools
  const usCities = COUNTRY_CITY_POOLS['USA'];
  const frCities = COUNTRY_CITY_POOLS['France'];
  
  // France check
  if (tld === 'fr') return frCities[hash % frCities.length];

  // US/Global Check (Generic TLDs or .us)
  const genericTLDs = ['com', 'net', 'org', 'us', 'io', 'ai', 'co', 'biz'];
  if (tld && genericTLDs.includes(tld)) return usCities[hash % usCities.length];

  // STEP 4: Global Hub Pool Fallback
  const globalHubs = ['London', 'Singapore', 'Toronto', 'Sydney', 'New York City', 'Berlin'];
  return globalHubs[hash % globalHubs.length];
}

// --- HELPER: Robust CSV Parser ---
function parseCSV(text: string): string[][] {
  const lines = text.split(/\r?\n/);
  return lines.map(line => {
    const result = [];
    let cur = "";
    let inQuote = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') inQuote = !inQuote;
      else if (char === ',' && !inQuote) {
        result.push(cur.replace(/^"|"$/g, '').trim());
        cur = "";
      } else {
        cur += char;
      }
    }
    result.push(cur.replace(/^"|"$/g, '').trim());
    return result;
  });
}

// --- HELPER: Company Name Normalization ---
function normalizeCompanyName(name: string, hostname: string): string {
  if (!name) return "";
  let clean = name.trim();
  const legalSuffixes = /\s(Inc|LLC|Ltd|Limited|GmbH|B\.V\.|BV|S\.A\.|SA|SAS|PLC|Corp|Corporation)[.,]?$/i;
  clean = clean.replace(legalSuffixes, "");
  const commonTLDs = /\.(com|io|ai|net|org|co|uk|de|nl|fr|gov|edu|me|app|tech)$/i;
  if (clean.toLowerCase().endsWith(hostname.toLowerCase()) || clean.match(commonTLDs)) {
    clean = clean.replace(commonTLDs, "");
  }
  clean = clean.replace(/^["']|["']$/g, "").replace(/\s+/g, " ");
  if (clean === clean.toUpperCase() || clean === clean.toLowerCase()) {
    clean = clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase();
  }
  return clean.trim();
}

// --- HELPER: Gemini with Retry ---
async function callGeminiWithRetry(ai: any, contents: string, instruction: string, retries = 2): Promise<any> {
  let attempt = 0;
  const backoffs = [600, 1500];

  while (attempt <= retries) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents,
        config: { systemInstruction: instruction, responseMimeType: 'application/json' }
      });
      return JSON.parse(response.text || '{}');
    } catch (e: any) {
      if (attempt < retries && (e.status === 429 || e.status >= 500 || !e.status)) {
        await new Promise(resolve => setTimeout(resolve, backoffs[attempt]));
        attempt++;
      } else {
        throw e;
      }
    }
  }
}

// --- HELPER: Metadata Fetcher ---
async function fetchMetadata(targetUrl: string) {
  try {
    const response = await fetch(`https://api.microlink.io/?url=${targetUrl}`);
    if (!response.ok) return null;
    const json = await response.json();
    return json.data;
  } catch (e) { return null; }
}

// --- DATABASE FETCH ---
interface PassportRow {
  id: string; industry: string; firstName: string; jobTitle: string; 
  companySize: string; bio: string; challenges: string[]; 
  interests: string[]; preferred: string[]; avoid: string[]; avatar: string;
}
let cachedPassportData: PassportRow[] | null = null;
async function fetchPassportData(forceRefresh: boolean = false): Promise<PassportRow[]> {
  if (cachedPassportData && !forceRefresh) return cachedPassportData;
  if (forceRefresh) cachedPassportData = null;

  const SHEET_BASE_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQRFm2ej_14g-8c7EDnWXQ-z3gNA425FlUMw3LZ_9nLPiqeciNjPeaLXAFD7uecFVwoMSfRcp4bAEoE/pub?output=csv';
  const SHEET_URL = forceRefresh ? `${SHEET_BASE_URL}&cb=${Date.now()}` : SHEET_BASE_URL;

  try {
    const response = await fetch(SHEET_URL, { cache: forceRefresh ? 'no-store' : 'default' });
    const text = await response.text();
    const rows = parseCSV(text);
    
    cachedPassportData = rows.slice(1).filter(r => r.length >= 11).map((r, i) => ({
      id: r[0] || `ICP-${i+1}`,
      industry: r[1],
      firstName: r[2],
      jobTitle: r[3],
      companySize: r[4],
      bio: r[5],
      challenges: r[6]?.split(/[|,]/).map(s => s.trim()).filter(Boolean) || [],
      interests: r[7]?.split(/[|,]/).map(s => s.trim()).filter(Boolean) || [],
      preferred: r[8]?.split(/[|,]/).map(s => s.trim()).filter(Boolean) || [],
      avoid: r[9]?.split(/[|,]/).map(s => s.trim()).filter(Boolean) || [],
      avatar: r[10] || ""
    }));
    return cachedPassportData;
  } catch (e) { 
    console.error("Failed to fetch passport data:", e);
    return []; 
  }
}

export async function preloadPassportData() { await fetchPassportData(); }

export const mockAnalyze = async (inputUrl: string, runId: string, hardReset: boolean = false): Promise<AnalysisResult> => {
  const cleanUrl = inputUrl.trim().startsWith('http') ? inputUrl.trim() : `https://${inputUrl.trim()}`;
  const domain = new URL(cleanUrl).hostname;

  const [meta, passportRows] = await Promise.all([
    fetchMetadata(cleanUrl),
    fetchPassportData(hardReset)
  ]);

  const rawLogo = typeof meta?.logo === 'object' ? meta.logo.url : meta?.logo;
  const generatedLogo = rawLogo || `https://www.google.com/s2/favicons?domain=${domain}&sz=256`;
  
  let companyName = meta?.publisher || meta?.site_name || "";
  if (!companyName && meta?.title) companyName = meta.title.split(/[|\-•:]/)[0];
  companyName = normalizeCompanyName(companyName, domain) || domain.split('.')[0];

  let tagline = meta?.description?.slice(0, 100) || `Strategic growth for ${companyName}.`;
  let summary = meta?.description || `${companyName} is a market leader in their vertical.`;
  let logoPrompt = `Minimalist logo for ${companyName}`;
  let selectedId = passportRows[0]?.id || "ICP-1";
  let detectedCountry: string | null = null;
  let dynamicCitiesPool: string[] | null = null;

  // --- STEP 1: Hero Image Extraction ---
  let heroImage = "";
  const siteImage = typeof meta?.image === 'object' ? meta.image : (meta?.image ? { url: meta.image } : null);

  if (siteImage?.url && !siteImage.url.includes('.svg')) {
    const isLandscape = siteImage.width && siteImage.height ? siteImage.width > siteImage.height : true;
    const isLarge = siteImage.width ? siteImage.width >= 1200 : true;

    if (isLandscape && isLarge) {
      heroImage = siteImage.url;
      console.log(`[HERO] source=website url=${heroImage}`);
    }
  }

  if (!heroImage) {
    const fallbackIndex = getStableHash(domain) % FALLBACK_HEROES.length;
    heroImage = FALLBACK_HEROES[fallbackIndex];
    console.log(`[HERO] source=fallback index=${fallbackIndex}`);
  }

  // GEMINI REFINEMENT & ICP SELECTION WATERFALL
  if (process.env.API_KEY) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const dbContext = JSON.stringify(passportRows.map(p => ({ 
        id: p.id, 
        jobTitle: p.jobTitle, 
        industry: p.industry,
        challenges: p.challenges,
        interests: p.interests
      })));
      
      const res = await callGeminiWithRetry(ai, `Website: ${cleanUrl}\nCompany: ${companyName}\nDescription: ${summary}\nDatabase: ${dbContext}`, SYSTEM_INSTRUCTION);
      
      console.log(`[ICP-MODE] mode=${res.mode} reason=${res.reason}`);

      if (res.detected_country) {
        detectedCountry = res.detected_country;
        dynamicCitiesPool = res.major_cities || null;
        console.log(`[CITY-COUNTRY] source=footer|contact country=${detectedCountry}`);
      }

      if (res.mode === 'b2b') {
        if (res.matched_on?.some((f: string) => f.toLowerCase().includes('interest') || f.toLowerCase().includes('hobby'))) {
          console.error('[ICP-ERROR] B2B matcher used forbidden fields');
        }
        const topMatchesStr = res.top_matches?.map((m: any) => `${m.id}:${m.score}`).join(',') || '';
        console.log(`[ICP-B2B] selected_id=${res.selected_id} top_matches=${topMatchesStr} matched_on=${res.matched_on?.join(',')}`);
      } else {
        if (res.matched_on?.some((f: string) => f.toLowerCase().includes('title') || f.toLowerCase().includes('job') || f.toLowerCase().includes('challenge') || f.toLowerCase().includes('company'))) {
          console.error('[ICP-ERROR] B2C matcher used forbidden fields');
        }
        const topMatchesStr = res.top_matches?.map((m: any) => `${m.id}:${m.score}`).join(',') || '';
        console.log(`[ICP-B2C] selected_id=${res.selected_id} top_matches=${topMatchesStr} matched_on=personal_interest`);
      }

      if (res.selected_id) selectedId = res.selected_id;
      if (res.refined_tagline) tagline = res.refined_tagline;
      if (res.refined_summary) summary = res.refined_summary;
      if (res.logo_prompt) logoPrompt = res.logo_prompt;
    } catch (e) {
      console.warn(`[GEMINI_CALL_FAIL] Falling back to default selection.`);
    }
  }

  // Final City Resolution with Override & Consistency Rule
  const buyerCity = pickBuyerCity(cleanUrl, detectedCountry, dynamicCitiesPool);

  const persona = passportRows.find(p => p.id.trim().toLowerCase() === selectedId.trim().toLowerCase()) || passportRows[0];

  console.log(`[ICP] selected_id=${selectedId} matched_row_id=${persona.id} image=${persona.avatar} hardReset=${hardReset}`);

  return {
    company_profile: {
      name: companyName,
      tagline,
      domain,
      primary_color: "#ea580c",
      industry_tag: persona.industry,
      summary,
      logo_prompt: logoPrompt,
      generated_logo: generatedLogo,
      hero_image: heroImage,
    },
    icp_persona: {
      name: persona.firstName,
      role: persona.jobTitle,
      avatar_id: persona.avatar,
      bio_snack: persona.bio,
      pain_points: persona.challenges,
      location: buyerCity,
      company_size: persona.companySize,
      interests: persona.interests,
      preferred_channel: persona.preferred,
      avoid_channel: persona.avoid
    },
    value_hook: { one_liner: "", social_media_headline: "" },
    market_data: { total_leads: 5000, confidence_score: 98 },
    is_hard_reset: hardReset
  };
};