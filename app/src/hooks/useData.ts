import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type {
  Profile,
  Project,
  Certificate,
  Post,
  GalleryItem,
  Experience,
  Education,
  Skill,
  Testimonial,
  ContactMessage,
} from '../types';

// Generic hook for fetching data
const useFetch = <T>(
  table: string,
  options?: {
    select?: string;
    filters?: Record<string, unknown>;
    order?: { column: string; ascending?: boolean };
    limit?: number;
  }
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase.from(table).select(options?.select || '*');

      if (options?.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          query = query.eq(key, value as string | number | boolean);
        });
      }

      if (options?.order) {
        query = query.order(options.order.column, {
          ascending: options.order.ascending ?? true,
        });
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data: result, error: supabaseError } = await query;

      if (supabaseError) throw supabaseError;
      setData(result as T[]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [table, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Profile hook
export const useProfile = () => {
  return useFetch<Profile>('profiles', { limit: 1 });
};

// Projects hooks
export const useProjects = (filters?: { featured?: boolean; status?: string }) => {
  const filterObj: Record<string, unknown> = {};
  if (filters?.featured !== undefined) filterObj.featured = filters.featured;
  if (filters?.status) filterObj.status = filters.status;

  return useFetch<Project>('projects', {
    filters: Object.keys(filterObj).length > 0 ? filterObj : undefined,
    order: { column: 'created_at', ascending: false },
  });
};

export const useProject = (slug: string) => {
  const [data, setData] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const { data: result, error: supabaseError } = await supabase
          .from('projects')
          .select('*')
          .eq('slug', slug)
          .single();

        if (supabaseError) throw supabaseError;
        setData(result as Project);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchProject();
  }, [slug]);

  return { data, loading, error };
};

// Certificates hook
export const useCertificates = () => {
  return useFetch<Certificate>('certificates', {
    filters: { status: 'published' },
    order: { column: 'issue_date', ascending: false },
  });
};

// Posts hooks
export const usePosts = (limit?: number) => {
  return useFetch<Post>('posts', {
    filters: { status: 'published' },
    order: { column: 'published_at', ascending: false },
    limit,
  });
};

export const usePost = (slug: string) => {
  const [data, setData] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const { data: result, error: supabaseError } = await supabase
          .from('posts')
          .select('*')
          .eq('slug', slug)
          .single();

        if (supabaseError) throw supabaseError;
        setData(result as Post);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchPost();
  }, [slug]);

  return { data, loading, error };
};

// Gallery hook
export const useGallery = (category?: string) => {
  const filters: Record<string, unknown> = { status: 'published' };
  if (category && category !== 'all') filters.category = category;

  return useFetch<GalleryItem>('gallery', {
    filters,
    order: { column: 'order', ascending: true },
  });
};

// Experience hook
export const useExperience = () => {
  return useFetch<Experience>('experience', {
    order: { column: 'order', ascending: true },
  });
};

// Education hook
export const useEducation = () => {
  return useFetch<Education>('education', {
    order: { column: 'order', ascending: true },
  });
};

// Skills hook
export const useSkills = (category?: string) => {
  const filters: Record<string, unknown> = {};
  if (category && category !== 'all') filters.category = category;

  return useFetch<Skill>('skills', {
    filters: Object.keys(filters).length > 0 ? filters : undefined,
    order: { column: 'order', ascending: true },
  });
};

// Testimonials hook
export const useTestimonials = () => {
  return useFetch<Testimonial>('testimonials', {
    filters: { status: 'published' },
    order: { column: 'order', ascending: true },
  });
};

// Contact messages hook (admin only)
export const useContactMessages = () => {
  return useFetch<ContactMessage>('contact_messages', {
    order: { column: 'created_at', ascending: false },
  });
};

// Stats hook
export const useStats = () => {
  const [stats, setStats] = useState({
    projectsCount: 0,
    certificatesCount: 0,
    yearsExperience: 0,
    skillsCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          { count: projectsCount },
          { count: certificatesCount },
          { count: skillsCount },
        ] = await Promise.all([
          supabase.from('projects').select('*', { count: 'exact', head: true }),
          supabase.from('certificates').select('*', { count: 'exact', head: true }),
          supabase.from('skills').select('*', { count: 'exact', head: true }),
        ]);

        // Calculate years of experience from experience table
        const { data: experienceData } = await supabase
          .from('experience')
          .select('start_date')
          .order('start_date', { ascending: true })
          .limit(1);

        let yearsExperience = 0;
        if (experienceData && experienceData.length > 0) {
          const firstJobDate = (experienceData[0] as { start_date: string }).start_date;
          const firstJob = new Date(firstJobDate);
          yearsExperience = Math.floor(
            (new Date().getTime() - firstJob.getTime()) / (1000 * 60 * 60 * 24 * 365)
          );
        }

        setStats({
          projectsCount: projectsCount || 0,
          certificatesCount: certificatesCount || 0,
          yearsExperience,
          skillsCount: skillsCount || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading };
};
