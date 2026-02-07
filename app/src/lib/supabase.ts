import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a mock client if credentials are not available
const createMockClient = () => {
  console.warn('Supabase credentials not configured. Using mock client.');
  return {
    auth: {
      signInWithPassword: async () => ({ data: null, error: new Error('Supabase not configured') }),
      signOut: async () => ({ error: null }),
      getUser: async () => ({ data: { user: null } }),
      getSession: async () => ({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    storage: {
      from: () => ({
        upload: async () => ({ data: null, error: new Error('Supabase not configured') }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
        remove: async () => ({ error: null }),
      }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({ 
          order: () => ({ 
            limit: () => ({ data: [], error: null }),
            data: [], 
            error: null 
          }),
          single: () => ({ data: null, error: null }),
          data: [],
          error: null,
        }),
        order: () => ({ data: [], error: null }),
        limit: () => ({ data: [], error: null }),
        data: [],
        error: null,
      }),
    }),
  } as any;
};

// Create supabase client with error handling
let supabaseClient: any;

try {
  if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')) {
    supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey);
    console.log('Supabase client created successfully');
  } else {
    console.log('Invalid or missing Supabase credentials, using mock client');
    supabaseClient = createMockClient();
  }
} catch (error) {
  console.error('Error creating Supabase client:', error);
  supabaseClient = createMockClient();
}

export const supabase = supabaseClient;

// Auth helpers
export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  } catch (error) {
    console.error('Sign in error:', error);
    return { data: null, error: error as Error };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (error) {
    console.error('Sign out error:', error);
    return { error: error as Error };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
};

export const getSession = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Get session error:', error);
    return null;
  }
};

// Storage helpers
export const uploadFile = async (bucket: string, path: string, file: File) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
      });
    return { data, error };
  } catch (error) {
    console.error('Upload error:', error);
    return { data: null, error: error as Error };
  }
};

export const getPublicUrl = (bucket: string, path: string) => {
  try {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  } catch (error) {
    console.error('Get public URL error:', error);
    return '';
  }
};

export const deleteFile = async (bucket: string, path: string) => {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    return { error };
  } catch (error) {
    console.error('Delete file error:', error);
    return { error: error as Error };
  }
};
