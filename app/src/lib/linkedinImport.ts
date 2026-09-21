/**
 * LinkedIn Data Export Parser
 *
 * Parses LinkedIn's official data export ZIP/CSV files and maps them
 * to the portfolio's existing TypeScript types for upsert into Supabase.
 *
 * LinkedIn Export Format:
 *   Profile.csv, Positions.csv, Certifications.csv, Skills.csv, Education.csv
 *
 * How to get export: LinkedIn → Settings → Data Privacy → Get a copy of your data
 */

import type { Certificate, Skill, Experience, Education, Profile } from '../types';

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

/** Parse a simple CSV string into an array of row-objects */
function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  // LinkedIn CSV uses the first row as headers
  const headers = parseCSVLine(lines[0]);
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === 0) continue;
    const row: Record<string, string> = {};
    headers.forEach((header, idx) => {
      row[header.trim()] = (values[idx] ?? '').trim();
    });
    rows.push(row);
  }
  return rows;
}

/** Parse a single CSV line, respecting quoted fields */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

/**
 * Normalize LinkedIn date strings to ISO YYYY-MM-DD format.
 * LinkedIn uses formats like "Jan 2023", "2023", "2023-01", "01/2023".
 */
function normalizeDate(dateStr: string): string {
  if (!dateStr || dateStr.trim() === '') return '';

  const monthMap: Record<string, string> = {
    jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
    jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
  };

  // "Jan 2023" or "January 2023"
  const longMatch = dateStr.match(/^(\w{3,9})\s+(\d{4})$/i);
  if (longMatch) {
    const month = monthMap[longMatch[1].toLowerCase().slice(0, 3)] ?? '01';
    return `${longMatch[2]}-${month}-01`;
  }

  // "2023-01" or "2023-1"
  const dashMatch = dateStr.match(/^(\d{4})-(\d{1,2})$/);
  if (dashMatch) {
    return `${dashMatch[1]}-${dashMatch[2].padStart(2, '0')}-01`;
  }

  // "01/2023"
  const slashMatch = dateStr.match(/^(\d{1,2})\/(\d{4})$/);
  if (slashMatch) {
    return `${slashMatch[2]}-${slashMatch[1].padStart(2, '0')}-01`;
  }

  // Pure year "2023"
  if (/^\d{4}$/.test(dateStr.trim())) {
    return `${dateStr.trim()}-01-01`;
  }

  // Already ISO
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr.trim())) {
    return dateStr.trim();
  }

  return dateStr.trim();
}

/** Generate a short unique ID for new records */
function generateId(): string {
  return `li_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`;
}

// ---------------------------------------------------------------------------
// Skill category inference
// Keyword → category mapping matching the app's Skill.category type
// ---------------------------------------------------------------------------

type SkillCategory = Skill['category'];

const CATEGORY_KEYWORDS: Record<SkillCategory, string[]> = {
  data_bi: [
    'tableau', 'power bi', 'powerbi', 'excel', 'spss', 'data visualization',
    'business intelligence', 'bi', 'data analysis', 'data analytics',
    'analytics', 'looker', 'qlik', 'metabase', 'dbt', 'etl', 'reporting',
    'pandas', 'numpy', 'matplotlib', 'seaborn', 'plotly',
  ],
  databases: [
    'sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'database',
    'data warehouse', 'snowflake', 'bigquery', 'oracle', 'sqlite',
    'cassandra', 'dynamodb', 'firebase', 'supabase', 'nosql',
    'data modeling', 'schema',
  ],
  ai_ml: [
    'machine learning', 'deep learning', 'tensorflow', 'keras', 'pytorch',
    'scikit', 'sklearn', 'nlp', 'natural language', 'computer vision',
    'neural network', 'ai', 'artificial intelligence', 'llm', 'gpt',
    'predictive modeling', 'classification', 'regression', 'clustering',
    'reinforcement learning', 'transformers', 'hugging face',
  ],
  digital_health: [
    'hl7', 'fhir', 'ehr', 'emr', 'health informatics', 'health information',
    'clinical', 'telemedicine', 'medical', 'healthcare', 'hipaa',
    'epidemiology', 'public health', 'biostatistics', 'digital health',
    'health data', 'patient', 'disease surveillance',
  ],
  research: [
    'research', 'statistical analysis', 'spss', 'r programming', 'stata',
    'academic writing', 'literature review', 'survey', 'hypothesis',
    'data collection', 'qualitative', 'quantitative', 'scientific',
  ],
  programming: [
    'python', 'javascript', 'typescript', 'java', 'c++', 'c#', 'go', 'rust',
    'react', 'node', 'angular', 'vue', 'html', 'css', 'rest api', 'graphql',
    'django', 'flask', 'fastapi', 'spring', 'laravel', 'php', 'swift',
    'kotlin', 'dart', 'flutter', 'web development',
  ],
  tools: [
    'docker', 'kubernetes', 'aws', 'azure', 'google cloud', 'gcp', 'linux',
    'git', 'github', 'gitlab', 'jenkins', 'ci/cd', 'devops', 'jupyter',
    'vs code', 'postman', 'figma', 'jira', 'confluence', 'slack',
    'terraform', 'ansible', 'airflow', 'spark', 'hadoop',
  ],
  soft_skills: [
    'leadership', 'communication', 'teamwork', 'problem solving', 'critical thinking',
    'project management', 'agile', 'scrum', 'adaptability', 'creativity',
    'time management', 'collaboration', 'mentoring', 'presenting',
  ],
};

function inferSkillCategory(skillName: string): SkillCategory {
  const lower = skillName.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return category as SkillCategory;
    }
  }
  return 'tools'; // default fallback
}

// ---------------------------------------------------------------------------
// Parsers — one per LinkedIn CSV file
// ---------------------------------------------------------------------------

export function parseCertificationsCSV(text: string): Certificate[] {
  const rows = parseCSV(text);
  return rows
    .filter((row) => row['Name'] || row['Authority'])
    .map((row, i) => ({
      id: generateId(),
      title: row['Name'] || row['Certificate Name'] || 'Untitled Certificate',
      issuer: row['Authority'] || row['Issuer'] || 'Unknown Issuer',
      issue_date: normalizeDate(row['Started On'] || row['Issue Date'] || ''),
      expiry_date: normalizeDate(row['Finished On'] || row['Expiry Date'] || '') || undefined,
      credential_url: row['Url'] || row['URL'] || row['Credential URL'] || undefined,
      media_url: undefined,
      tags: inferTagsFromCert(row['Name'] || '', row['Authority'] || ''),
      status: 'published' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      _order: i,
    }));
}

function inferTagsFromCert(name: string, issuer: string): string[] {
  const tags: string[] = [];
  const combined = `${name} ${issuer}`.toLowerCase();

  const tagMap: Record<string, string> = {
    'data': 'Data',
    'sql': 'SQL',
    'python': 'Python',
    'machine learning': 'Machine Learning',
    'cloud': 'Cloud',
    'aws': 'AWS',
    'google': 'Google',
    'azure': 'Azure',
    'health': 'Healthcare',
    'analytics': 'Analytics',
    'ai': 'AI',
    'javascript': 'JavaScript',
    'react': 'React',
    'tableau': 'Tableau',
    'power bi': 'Power BI',
    'tensorflow': 'TensorFlow',
    'nlp': 'NLP',
  };

  for (const [keyword, tag] of Object.entries(tagMap)) {
    if (combined.includes(keyword)) tags.push(tag);
    if (tags.length >= 4) break; // cap at 4 tags
  }

  return tags.length > 0 ? tags : ['Professional'];
}

export function parseSkillsCSV(text: string): Skill[] {
  const rows = parseCSV(text);
  return rows
    .filter((row) => row['Name'])
    .map((row, i) => ({
      id: generateId(),
      name: row['Name'],
      category: inferSkillCategory(row['Name']),
      level: undefined,
      order: i,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
}

export function parsePositionsCSV(text: string): Experience[] {
  const rows = parseCSV(text);
  return rows
    .filter((row) => row['Title'] || row['Company Name'])
    .map((row, i) => {
      const endDateRaw = row['Finished On'] || row['End Date'] || '';
      const isCurrent = !endDateRaw || endDateRaw.toLowerCase() === 'present' || endDateRaw === '';
      return {
        id: generateId(),
        title: row['Title'] || 'Role',
        organization: row['Company Name'] || 'Company',
        location: row['Location'] || undefined,
        start_date: normalizeDate(row['Started On'] || row['Start Date'] || '') || new Date().toISOString().slice(0, 10),
        end_date: isCurrent ? undefined : normalizeDate(endDateRaw),
        current: isCurrent,
        description: row['Description'] || '',
        highlights: undefined,
        order: i,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    });
}

export function parseEducationCSV(text: string): Education[] {
  const rows = parseCSV(text);
  return rows
    .filter((row) => row['School Name'] || row['School'])
    .map((row, i) => {
      const endDateRaw = row['End Date'] || row['Finished On'] || '';
      const isCurrent = !endDateRaw || endDateRaw.toLowerCase() === 'present';
      return {
        id: generateId(),
        school: row['School Name'] || row['School'] || 'Institution',
        program: row['Field Of Study'] || row['Degree Name'] || row['Program'] || '',
        degree: row['Degree Name'] || row['Degree'] || undefined,
        start_date: normalizeDate(row['Start Date'] || row['Started On'] || '') || new Date().toISOString().slice(0, 10),
        end_date: isCurrent ? undefined : normalizeDate(endDateRaw),
        current: isCurrent,
        details: row['Activities And Societies'] || row['Notes'] || undefined,
        order: i,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    });
}

export function parseProfileCSV(text: string): Partial<Profile> {
  const rows = parseCSV(text);
  if (rows.length === 0) return {};
  const row = rows[0];
  return {
    name: [row['First Name'], row['Last Name']].filter(Boolean).join(' ') || undefined,
    headline: row['Headline'] || undefined,
    bio: row['Summary'] || undefined,
    location: row['Geo Location'] || row['Location'] || undefined,
    email: row['Email Address'] || undefined,
    website: row['Websites'] || row['Website'] || undefined,
    twitter: row['Twitter Handles'] || row['Twitter'] || undefined,
  };
}

// ---------------------------------------------------------------------------
// ZIP extraction using the browser's DecompressionStream (Chrome 80+) + JSZIP fallback
// ---------------------------------------------------------------------------

export interface LinkedInParseResult {
  certifications: Certificate[];
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  profile: Partial<Profile>;
  warnings: string[];
}

/**
 * Parse raw CSV text entries from a LinkedIn data export.
 * This is the pure-function version for use when file contents are already extracted.
 */
export function parseLinkedInCSVFiles(files: Record<string, string>): LinkedInParseResult {
  const warnings: string[] = [];

  const certText = findFile(files, ['Certifications.csv', 'certifications.csv']);
  const skillsText = findFile(files, ['Skills.csv', 'skills.csv']);
  const positionsText = findFile(files, ['Positions.csv', 'positions.csv']);
  const educationText = findFile(files, ['Education.csv', 'education.csv']);
  const profileText = findFile(files, ['Profile.csv', 'profile.csv']);

  if (!certText) warnings.push('Certifications.csv not found in export');
  if (!skillsText) warnings.push('Skills.csv not found in export');
  if (!positionsText) warnings.push('Positions.csv not found in export');
  if (!educationText) warnings.push('Education.csv not found in export');
  if (!profileText) warnings.push('Profile.csv not found in export');

  return {
    certifications: certText ? parseCertificationsCSV(certText) : [],
    skills: skillsText ? parseSkillsCSV(skillsText) : [],
    experience: positionsText ? parsePositionsCSV(positionsText) : [],
    education: educationText ? parseEducationCSV(educationText) : [],
    profile: profileText ? parseProfileCSV(profileText) : {},
    warnings,
  };
}

function findFile(files: Record<string, string>, names: string[]): string | null {
  for (const name of names) {
    // Try exact key
    if (files[name]) return files[name];
    // Try case-insensitive search
    const key = Object.keys(files).find(
      (k) => k.toLowerCase().endsWith(name.toLowerCase())
    );
    if (key) return files[key];
  }
  return null;
}

/**
 * Read a ZIP file (File object) and extract LinkedIn CSV files.
 * Uses JSZip if available (must be installed), otherwise returns a helpful error.
 */
export async function extractLinkedInZip(zipFile: File): Promise<LinkedInParseResult> {
  try {
    // Dynamic import of JSZip — installed as part of this feature
    const JSZip = (await import('jszip')).default;
    const zip = await JSZip.loadAsync(zipFile);

    const fileContents: Record<string, string> = {};
    const csvFileNames = [
      'Certifications.csv',
      'Skills.csv',
      'Positions.csv',
      'Education.csv',
      'Profile.csv',
    ];

    await Promise.all(
      Object.entries(zip.files).map(async ([path, file]) => {
        if (file.dir) return;
        const baseName = path.split('/').pop() ?? path;
        const isTarget = csvFileNames.some(
          (n) => baseName.toLowerCase() === n.toLowerCase()
        );
        if (isTarget) {
          fileContents[baseName] = await file.async('string');
        }
      })
    );

    return parseLinkedInCSVFiles(fileContents);
  } catch (err) {
    throw new Error(
      `Failed to extract ZIP: ${err instanceof Error ? err.message : String(err)}. ` +
      'Make sure jszip is installed (npm install jszip).'
    );
  }
}

/**
 * Read individual CSV files (for when user uploads files one by one instead of a ZIP)
 */
export async function readCSVFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string ?? '');
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

// ---------------------------------------------------------------------------
// LinkedIn OAuth helpers (Phase 2)
// ---------------------------------------------------------------------------

export interface LinkedInProfile {
  name: string;
  headline?: string;
  profilePicture?: string;
  email?: string;
  location?: string;
}

/** Build the LinkedIn OAuth 2.0 authorization URL */
export function buildLinkedInAuthUrl(clientId: string, redirectUri: string, state: string): string {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
    scope: 'openid profile email',
  });
  return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
}
