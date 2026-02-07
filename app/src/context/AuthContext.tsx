import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase, getSession } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
  // Demo mode
  enableDemoMode: () => void;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo user for when Supabase is not configured
const demoUser: User = {
  id: 'demo-user',
  email: 'demo@example.com',
  role: 'authenticated',
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  app_metadata: {},
  user_metadata: {},
  identities: [],
  updated_at: new Date().toISOString(),
} as User;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    // Check for demo mode in localStorage
    const demoMode = localStorage.getItem('demoMode') === 'true';
    if (demoMode) {
      setIsDemoMode(true);
      setUser(demoUser);
      setLoading(false);
      return;
    }

    // Check for existing session
    const checkSession = async () => {
      try {
        const session = await getSession();
        if (session?.user) {
          setUser(session.user);
        }
      } catch (err) {
        console.error('Error checking session:', err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Subscribe to auth changes
    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (_event: any, session: any) => {
          setUser(session?.user as User | null);
          setLoading(false);
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    } catch (err) {
      console.error('Error setting up auth listener:', err);
      setLoading(false);
      return () => {};
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Check for demo credentials
      if (email === 'demo' && password === 'demo') {
        enableDemoMode();
        return { error: null };
      }
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      if (isDemoMode) {
        localStorage.removeItem('demoMode');
        setIsDemoMode(false);
        setUser(null);
        return { error: null };
      }
      
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const enableDemoMode = () => {
    localStorage.setItem('demoMode', 'true');
    setIsDemoMode(true);
    setUser(demoUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, enableDemoMode, isDemoMode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
