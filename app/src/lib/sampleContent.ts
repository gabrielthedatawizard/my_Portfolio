import type { Certificate, Education, Experience, Project, Skill } from '@/types';
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
    project_url: 'https://example.com',
    github_url: 'https://github.com',
    status: 'published',
  },
  {
    title: 'Predictive Disease Modeling',
    slug: 'predictive-disease-modeling',
    summary: 'Machine learning models to predict disease outbreaks and patient readmission risks.',
    content:
      'Developed and deployed machine learning models that analyze historical health data to predict disease outbreaks and identify patients at high risk of readmission.',
    problem: 'Hospitals needed better tools to predict patient outcomes and allocate resources effectively.',
    approach:
      'We used ensemble learning methods combining random forests, gradient boosting, and neural networks. Feature engineering focused on temporal patterns and demographic factors.',
    tools: ['Python', 'Scikit-learn', 'Pandas', 'Jupyter', 'Docker'],
    tags: ['Machine Learning', 'Predictive Analytics', 'Python'],
    outcomes:
      'Achieved 85% accuracy in readmission prediction, enabling early intervention programs that reduced readmissions by 30%.',
    featured: true,
    start_date: '2023-03-01',
    end_date: '2023-08-31',
    project_url: 'https://example.com',
    github_url: 'https://github.com',
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
    project_url: 'https://example.com',
    github_url: 'https://github.com',
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
    project_url: 'https://example.com',
    github_url: 'https://github.com',
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

export const sampleExperience: Array<Omit<Experience, 'id' | 'created_at' | 'updated_at'>> = [
  {
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
    school: 'Ilboru High School',
    program: 'Advanced Level',
    start_date: '2021-01-01',
    end_date: '2023-12-31',
    current: false,
    order: 0,
  },
  {
    school: "St Joseph Boys' Science School",
    program: 'Ordinary Level',
    start_date: '2017-01-01',
    end_date: '2020-12-31',
    current: false,
    order: 1,
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
