import type { Certificate, Education, Experience, Post, Project, Skill } from '@/types';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export const sampleProjects: Array<Omit<Project, 'id' | 'created_at' | 'updated_at'>> = [
  {
    title: 'Health Data Analytics Platform',
    slug: 'health-data-analytics',
    summary:
      'A comprehensive analytics platform for visualizing and analyzing healthcare data to improve patient outcomes.',
    content:
      'This platform integrates multiple data sources including EHR systems, wearable devices, and lab results to provide a unified view of patient health. It features interactive dashboards, predictive analytics, and automated reporting.',
    problem:
      'Healthcare providers struggled with fragmented data across multiple systems, making it difficult to get a comprehensive view of patient health.',
    approach:
      'We designed a centralized data warehouse with ETL pipelines to consolidate data from various sources. Machine learning models were developed for risk prediction and anomaly detection.',
    tools: ['Python', 'PostgreSQL', 'React', 'TensorFlow', 'AWS'],
    tags: ['Data Analytics', 'Healthcare', 'AI/ML'],
    outcomes:
      'Reduced data retrieval time by 70%, improved diagnostic accuracy by 25%, and enabled proactive care for high-risk patients.',
    featured: true,
    start_date: '2023-01-01',
    end_date: '2023-06-30',
    project_url: 'https://health-data-analytics-ai.vercel.app',
    github_url: 'https://github.com/gabrielthedatawizard',
    status: 'published',
  },
  {
    title: 'TRIP — Tanzania Readmission Intelligence Platform',
    slug: 'trip-readmission-intelligence',
    summary:
      'AI-powered platform that predicts 30-day hospital readmission risk, helping Tanzanian hospitals intervene early and improve patient outcomes.',
    content:
      "TRIP (Tanzania Readmission Intelligence Platform) is an AI-powered readmission prevention system for Tanzania's health system. It uses predictive analytics to identify patients at risk of 30-day hospital readmission, with interactive dashboards, patient-level risk views and exportable PDF reports for clinical and administrative teams. The platform was selected for presentation at the 3rd UDOM Scientific Conference on Health (USCHe 2026).",
    problem:
      'Hospitals struggle to tell which discharged patients will bounce back within 30 days, driving preventable readmissions, crowded wards and wasted resources.',
    approach:
      'Built an AI-driven risk-stratification workflow with interactive dashboards, patient-level risk views and one-click PDF exports so clinicians and managers can act on the predictions.',
    tools: ['React', 'Machine Learning', 'Data Visualization', 'PDF Reporting', 'Vercel'],
    tags: ['Machine Learning', 'Predictive Analytics', 'Digital Health'],
    outcomes:
      'Live platform deployed on Vercel and serving real users; selected for presentation at the 3rd UDOM Scientific Conference on Health (USCHe 2026).',
    featured: true,
    start_date: '2026-01-01',
    project_url: 'https://patient-readmission-prediction-plat-red.vercel.app',
    github_url: 'https://github.com/gabrielthedatawizard',
    cover_url: '/screenshots/trip-logo.png',
    status: 'published',
  },
  {
    title: 'Clinical Database Optimization',
    slug: 'clinical-database-optimization',
    summary:
      'Redesigned and optimized a clinical database system, improving query performance and data integrity.',
    content:
      'Complete overhaul of a legacy clinical database system, implementing modern data architecture patterns and optimization techniques.',
    problem:
      'Slow query performance and data inconsistencies were affecting clinical decision-making and reporting.',
    approach:
      'Normalized the database schema, implemented proper indexing strategies, and set up automated data quality checks.',
    tools: ['PostgreSQL', 'Redis', 'Python', 'Airflow'],
    tags: ['Database', 'SQL', 'Optimization'],
    outcomes:
      'Query performance improved by 90%, data integrity issues reduced by 95%, and report generation time decreased from hours to minutes.',
    featured: true,
    start_date: '2023-06-01',
    end_date: '2023-09-30',
    github_url: 'https://github.com/gabrielthedatawizard',
    status: 'published',
  },
  {
    title: 'Telemedicine Dashboard',
    slug: 'telemedicine-dashboard',
    summary: 'Real-time dashboard for monitoring telemedicine sessions and patient engagement metrics.',
    content:
      'A comprehensive dashboard that provides real-time insights into telemedicine operations, patient engagement, and system performance.',
    problem:
      'Healthcare administrators lacked visibility into telemedicine operations and patient engagement patterns.',
    approach:
      'Built a real-time data pipeline using WebSockets and created intuitive visualizations for key metrics.',
    tools: ['React', 'Node.js', 'MongoDB', 'Socket.io', 'D3.js'],
    tags: ['Web Development', 'Real-time', 'Dashboard'],
    outcomes:
      'Increased patient engagement by 40% and reduced no-show rates by 25% through data-driven interventions.',
    featured: false,
    start_date: '2023-09-01',
    end_date: '2023-12-31',
    github_url: 'https://github.com/gabrielthedatawizard',
    status: 'published',
  },
];

export const sampleCertificates: Array<Omit<Certificate, 'id' | 'created_at' | 'updated_at'>> = [
  {
    title: 'Google Data Analytics Professional Certificate',
    issuer: 'Google',
    issue_date: '2023-06-15',
    credential_url: 'https://www.credly.com',
    tags: ['Data Analytics', 'SQL', 'Tableau'],
    status: 'published',
  },
  {
    title: 'AWS Certified Solutions Architect',
    issuer: 'Amazon Web Services',
    issue_date: '2023-04-20',
    expiry_date: '2026-04-20',
    credential_url: 'https://www.credly.com',
    tags: ['Cloud', 'AWS', 'Architecture'],
    status: 'published',
  },
  {
    title: 'TensorFlow Developer Certificate',
    issuer: 'Google',
    issue_date: '2023-08-10',
    credential_url: 'https://www.tensorflow.org',
    tags: ['Machine Learning', 'Python', 'TensorFlow'],
    status: 'published',
  },
  {
    title: 'Health Informatics Certificate',
    issuer: 'Johns Hopkins University',
    issue_date: '2022-12-01',
    credential_url: 'https://coursera.org',
    tags: ['Healthcare', 'Informatics', 'Data'],
    status: 'published',
  },
  {
    title: 'PostgreSQL Administration',
    issuer: 'PostgreSQL Global Development Group',
    issue_date: '2023-02-15',
    credential_url: 'https://www.postgresql.org',
    tags: ['Database', 'PostgreSQL', 'SQL'],
    status: 'published',
  },
  {
    title: 'Python for Data Science',
    issuer: 'IBM',
    issue_date: '2022-10-20',
    credential_url: 'https://www.credly.com',
    tags: ['Python', 'Data Science', 'Pandas'],
    status: 'published',
  },
];

export const samplePosts: Array<Omit<Post, 'id' | 'created_at' | 'updated_at'>> = [
  {
    title: '5 Data-Quality Checks I Run on Every DHIS2 Export',
    slug: 'dhis2-data-quality-checks',
    excerpt:
      'Duplicate rows, silent blanks, shifted dates — the unglamorous checks that decide whether a dashboard tells the truth.',
    content: `Every DHIS2 export I touch goes through the same five checks before it gets near a dashboard.

1. Completeness: which facilities and periods are missing, and is the gap real or a late report?
2. Duplicates: same facility, period and data element appearing twice after merged downloads.
3. Blanks vs zeros: a blank cell is not a zero. Treating them the same has ruined more analyses than any model ever has.
4. Date sanity: reporting periods that shifted by a month after an Excel re-open. Yes, really.
5. Outlier sweep: values more than 3 standard deviations from a facility's own history get a phone call, not a delete key.

None of this is fancy. All of it is the difference between a dashboard clinicians trust and one they quietly stop opening.`,
    tags: ['DHIS2', 'Data Quality', 'Digital Health'],
    published_at: '2026-06-15T00:00:00.000Z',
    status: 'published',
  },
  {
    title: 'What Presenting TRIP at USCHe 2026 Taught Me',
    slug: 'trip-usche-2026-lessons',
    excerpt:
      "Clinicians don't ask about your model. They ask who acts on the prediction, and when.",
    content: `Presenting the Tanzania Readmission Intelligence Platform (TRIP) at the 3rd UDOM Scientific Conference on Health was the most useful feedback session the project ever had.

The questions from clinicians were never about algorithms. They were operational: which nurse sees the risk list, at what point in the discharge workflow, and what exactly is she supposed to do differently for a high-risk patient?

Three lessons I took home:

1. A prediction without an owner is just a number on a screen.
2. Exportable, printable outputs beat beautiful dashboards in wards with one shared computer.
3. "30-day readmission risk" only matters if the follow-up appointment system can absorb the extra attention.

TRIP is a better platform because it survived contact with the people who will actually use it.`,
    tags: ['AI/ML', 'Digital Health', 'Research'],
    published_at: '2026-08-02T00:00:00.000Z',
    status: 'published',
  },
  {
    title: 'How I Structure a Health Analytics Project',
    slug: 'structuring-health-analytics-project',
    excerpt:
      'Problem, data audit, one baseline, then the fancy stuff. The boring order that keeps projects alive.',
    content: `Most health analytics projects don't fail on modeling. They fail on structure — starting with the model instead of the problem.

Here is the order I force myself to follow:

1. Problem in one sentence, with the person who feels the pain named explicitly.
2. Data audit before any analysis: sources, owners, refresh cadence, known gaps.
3. One simple baseline (a rule, a count, last-period comparison) that already delivers value.
4. Then the advanced work: risk scores, forecasts, automation.
5. A handover artifact: who maintains it, what breaks first, how they know.

Steps 1–3 are where trust is built. Step 4 is where attention goes. Step 5 is what decides whether the work still matters in a year.`,
    tags: ['Data Analytics', 'Workflow', 'Research'],
    published_at: '2026-04-20T00:00:00.000Z',
    status: 'published',
  },
];

export const sampleExperience: Array<Omit<Experience, 'id' | 'created_at' | 'updated_at'>> = [  {
    title: 'Health Data Analyst',
    organization: 'Digital Health Solutions Ltd',
    location: 'Dodoma, Tanzania',
    start_date: '2022-03-01',
    current: true,
    description:
      'Leading data analytics initiatives for healthcare clients, developing predictive models and building data pipelines.',
    highlights: [
      'Reduced patient readmission rates by 30% through predictive modeling',
      'Built ETL pipelines processing 1M+ records daily',
      'Led team of 5 data analysts',
    ],
    order: 0,
  },
  {
    title: 'Database Administrator',
    organization: 'Tech Health Systems',
    location: 'Dodoma, Tanzania',
    start_date: '2020-06-01',
    end_date: '2022-02-28',
    current: false,
    description:
      'Managed clinical databases, optimized query performance, and ensured data security compliance.',
    highlights: [
      'Improved query performance by 90%',
      'Implemented HIPAA-compliant data security measures',
      'Migrated legacy systems to modern cloud infrastructure',
    ],
    order: 1,
  },
  {
    title: 'Data Analyst Intern',
    organization: 'County Health Department',
    location: 'Dodoma, Tanzania',
    start_date: '2019-01-01',
    end_date: '2019-12-31',
    current: false,
    description: 'Analyzed public health data and created reports for policy makers.',
    highlights: ['Developed dashboards for COVID-19 tracking', 'Created automated reporting system'],
    order: 2,
  },
];

export const sampleEducation: Array<Omit<Education, 'id' | 'created_at' | 'updated_at'>> = [
  {
    school: 'University of Dodoma',
    program: 'University Education',
    degree: 'Bachelor of Science in Health Information Science',
    start_date: '2023-01-01',
    end_date: '2026-12-31',
    current: false,
    order: 0,
  },
  {
    school: 'Ilboru High School',
    program: 'Advanced Level',
    start_date: '2021-01-01',
    end_date: '2023-12-31',
    current: false,
    order: 1,
  },
  {
    school: "St Joseph Boys' Science School",
    program: 'Ordinary Level',
    start_date: '2017-01-01',
    end_date: '2020-12-31',
    current: false,
    order: 2,
  },
];

export type SampleGalleryItem = {
  media_url: string;
  caption: string;
  category: 'profile' | 'event' | 'speaking' | 'project' | 'other';
  order: number;
  status: 'draft' | 'published';
};

export const sampleGallery: SampleGalleryItem[] = [
  {
    media_url:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop',
    caption: 'Health Data Visualization',
    category: 'project',
    order: 0,
    status: 'published',
  },
  {
    media_url:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    caption: 'Analytics Dashboard',
    category: 'project',
    order: 1,
    status: 'published',
  },
  {
    media_url:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
    caption: 'AI Neural Network',
    category: 'project',
    order: 2,
    status: 'published',
  },
  {
    media_url:
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=600&fit=crop',
    caption: 'Database Systems',
    category: 'project',
    order: 3,
    status: 'published',
  },
  {
    media_url:
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
    caption: 'Digital Health',
    category: 'project',
    order: 4,
    status: 'published',
  },
  {
    media_url:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
    caption: 'Data Analysis',
    category: 'project',
    order: 5,
    status: 'published',
  },
];

const sampleSkillGroups: Array<{ category: Skill['category']; skills: string[] }> = [
  {
    category: 'data_bi',
    skills: ['Python', 'R', 'Pandas', 'NumPy', 'Tableau', 'Power BI', 'Excel', 'SPSS', 'Data Visualization'],
  },
  {
    category: 'databases',
    skills: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQL', 'Database Design', 'ETL', 'Data Warehousing'],
  },
  {
    category: 'ai_ml',
    skills: ['TensorFlow', 'Scikit-learn', 'Keras', 'PyTorch', 'NLP', 'Computer Vision', 'Predictive Modeling', 'Deep Learning'],
  },
  {
    category: 'digital_health',
    skills: ['HL7 FHIR', 'EHR Systems', 'Health Informatics', 'Clinical Data', 'Telemedicine', 'Medical Imaging', 'HIPAA Compliance'],
  },
  {
    category: 'programming',
    skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'HTML/CSS', 'Git', 'REST APIs', 'GraphQL'],
  },
  {
    category: 'tools',
    skills: ['Docker', 'AWS', 'Google Cloud', 'Linux', 'Jupyter', 'VS Code', 'Postman', 'Figma'],
  },
  {
    category: 'research',
    skills: ['Statistical Analysis', 'Research Design', 'Literature Review', 'Academic Writing', 'Data Collection', 'Hypothesis Testing'],
  },
  {
    category: 'soft_skills',
    skills: ['Problem Solving', 'Communication', 'Teamwork', 'Project Management', 'Critical Thinking', 'Adaptability'],
  },
];

export const sampleSkills: Array<Omit<Skill, 'id' | 'created_at' | 'updated_at'>> = sampleSkillGroups
  .flatMap((group) =>
    group.skills.map((name, index) => ({
      name,
      category: group.category,
      level: Math.max(60, 95 - index * 4),
      order: index,
    }))
  );

export interface SampleSyncResult {
  projects: number;
  certificates: number;
  posts: number;
  gallery: number;
  experience: number;
  education: number;
  skills: number;
}

export const syncSampleContentToSupabase = async (): Promise<SampleSyncResult> => {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured');
  }

  const result: SampleSyncResult = {
    projects: 0,
    certificates: 0,
    posts: 0,
    gallery: 0,
    experience: 0,
    education: 0,
    skills: 0,
  };

  const { data: projectRows, error: projectFetchError } = await supabase
    .from('projects')
    .select('slug');
  if (projectFetchError) throw projectFetchError;
  const existingProjectSlugs = new Set(
    (projectRows ?? []).map((row: { slug: string }) => row.slug)
  );
  const missingProjects = sampleProjects.filter((item) => !existingProjectSlugs.has(item.slug));
  if (missingProjects.length > 0) {
    const { error } = await supabase.from('projects').insert(missingProjects);
    if (error) throw error;
    result.projects = missingProjects.length;
  }

  const { data: certificateRows, error: certificateFetchError } = await supabase
    .from('certificates')
    .select('title, issuer');
  if (certificateFetchError) throw certificateFetchError;
  const existingCertificates = new Set(
    (certificateRows ?? []).map(
      (row: { title: string; issuer: string }) => `${row.title.toLowerCase()}::${row.issuer.toLowerCase()}`
    )
  );
  const missingCertificates = sampleCertificates.filter(
    (item) => !existingCertificates.has(`${item.title.toLowerCase()}::${item.issuer.toLowerCase()}`)
  );
  if (missingCertificates.length > 0) {
    const { error } = await supabase.from('certificates').insert(missingCertificates);
    if (error) throw error;
    result.certificates = missingCertificates.length;
  }

  const { data: postRows, error: postFetchError } = await supabase
    .from('posts')
    .select('slug');
  if (postFetchError) throw postFetchError;
  const existingPostSlugs = new Set(
    (postRows ?? []).map((row: { slug: string }) => row.slug)
  );
  const missingPosts = samplePosts.filter((item) => !existingPostSlugs.has(item.slug));
  if (missingPosts.length > 0) {
    const { error } = await supabase.from('posts').insert(missingPosts);
    if (error) throw error;
    result.posts = missingPosts.length;
  }

  const { data: galleryRows, error: galleryFetchError } = await supabase
    .from('gallery')
    .select('media_url');
  if (galleryFetchError) throw galleryFetchError;
  const existingGalleryUrls = new Set(
    (galleryRows ?? []).map((row: { media_url: string }) => row.media_url)
  );
  const missingGalleryItems = sampleGallery.filter(
    (item) => !existingGalleryUrls.has(item.media_url)
  );
  if (missingGalleryItems.length > 0) {
    const { error } = await supabase.from('gallery').insert(missingGalleryItems);
    if (error) throw error;
    result.gallery = missingGalleryItems.length;
  }

  const { data: experienceRows, error: experienceFetchError } = await supabase
    .from('experience')
    .select('title, organization, start_date');
  if (experienceFetchError) throw experienceFetchError;
  const existingExperience = new Set(
    (experienceRows ?? []).map(
      (row: { title: string; organization: string; start_date: string }) =>
        `${row.title.toLowerCase()}::${row.organization.toLowerCase()}::${row.start_date}`
    )
  );
  const missingExperience = sampleExperience.filter(
    (item) =>
      !existingExperience.has(
        `${item.title.toLowerCase()}::${item.organization.toLowerCase()}::${item.start_date}`
      )
  );
  if (missingExperience.length > 0) {
    const { error } = await supabase.from('experience').insert(missingExperience);
    if (error) throw error;
    result.experience = missingExperience.length;
  }

  const { data: educationRows, error: educationFetchError } = await supabase
    .from('education')
    .select('school, program, start_date');
  if (educationFetchError) throw educationFetchError;
  const existingEducation = new Set(
    (educationRows ?? []).map(
      (row: { school: string; program: string; start_date: string }) =>
        `${row.school.toLowerCase()}::${row.program.toLowerCase()}::${row.start_date}`
    )
  );
  const missingEducation = sampleEducation.filter(
    (item) =>
      !existingEducation.has(
        `${item.school.toLowerCase()}::${item.program.toLowerCase()}::${item.start_date}`
      )
  );
  if (missingEducation.length > 0) {
    const { error } = await supabase.from('education').insert(missingEducation);
    if (error) throw error;
    result.education = missingEducation.length;
  }

  const { data: skillRows, error: skillFetchError } = await supabase
    .from('skills')
    .select('name, category');
  if (skillFetchError) throw skillFetchError;
  const existingSkills = new Set(
    (skillRows ?? []).map(
      (row: { name: string; category: Skill['category'] }) =>
        `${row.name.toLowerCase()}::${row.category}`
    )
  );
  const missingSkills = sampleSkills.filter(
    (item) => !existingSkills.has(`${item.name.toLowerCase()}::${item.category}`)
  );
  if (missingSkills.length > 0) {
    const { error } = await supabase.from('skills').insert(missingSkills);
    if (error) throw error;
    result.skills = missingSkills.length;
  }

  return result;
};
