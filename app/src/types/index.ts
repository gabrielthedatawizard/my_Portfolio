// Profile Types
export interface Profile {
  id: string;
  name: string;
  headline: string;
  bio: string;
  location: string;
  email: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  cv_url?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

// Project Types
export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  problem?: string;
  approach?: string;
  tools: string[];
  tags: string[];
  outcomes?: string;
  featured: boolean;
  start_date?: string;
  end_date?: string;
  project_url?: string;
  github_url?: string;
  status: 'draft' | 'published';
  created_at?: string;
  updated_at?: string;
}

export interface ProjectMedia {
  id: string;
  project_id: string;
  image_url: string;
  caption?: string;
  order: number;
  created_at?: string;
}

// Certificate Types
export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  expiry_date?: string;
  credential_url?: string;
  media_url?: string;
  tags: string[];
  status: 'draft' | 'published';
  created_at?: string;
  updated_at?: string;
}

// Post/Blog Types
export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  featured_image?: string;
  published_at?: string;
  status: 'draft' | 'published';
  created_at?: string;
  updated_at?: string;
}

// Gallery Types
export interface GalleryItem {
  id: string;
  media_url: string;
  caption?: string;
  category: 'profile' | 'event' | 'speaking' | 'project' | 'other';
  order: number;
  status: 'draft' | 'published';
  created_at?: string;
}

// Experience Types
export interface Experience {
  id: string;
  title: string;
  organization: string;
  location?: string;
  start_date: string;
  end_date?: string;
  current: boolean;
  description: string;
  highlights?: string[];
  order: number;
  created_at?: string;
  updated_at?: string;
}

// Education Types
export interface Education {
  id: string;
  school: string;
  program: string;
  degree?: string;
  start_date: string;
  end_date?: string;
  current: boolean;
  details?: string;
  order: number;
  created_at?: string;
  updated_at?: string;
}

// Skill Types
export interface Skill {
  id: string;
  name: string;
  category: 'data_bi' | 'databases' | 'ai_ml' | 'digital_health' | 'research' | 'programming' | 'tools' | 'soft_skills';
  level?: number;
  order: number;
  created_at?: string;
  updated_at?: string;
}

// Testimonial Types
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  organization?: string;
  content: string;
  avatar_url?: string;
  order: number;
  status: 'draft' | 'published';
  created_at?: string;
}

// Contact Message Types
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at?: string;
}

// User Types (for admin)
export interface User {
  id: string;
  email: string;
  role: 'admin';
  created_at?: string;
}

// Filter Types
export type ProjectFilter = 'all' | 'featured' | 'data' | 'ai' | 'health' | 'web';
export type CertificateFilter = 'all' | string;
export type PostFilter = 'all' | 'data' | 'health' | 'ai' | 'research';
export type GalleryFilter = 'all' | 'profile' | 'event' | 'speaking' | 'project';

// Form Types
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

// Navigation Types
export interface NavItem {
  label: string;
  href: string;
}

// Stats Types
export interface Stats {
  projectsCount: number;
  certificatesCount: number;
  yearsExperience: number;
  skillsCount: number;
}
