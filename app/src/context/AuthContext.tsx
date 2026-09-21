import React, { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { supabase, getSession } from '../lib/supabase';
import { clearQueryCache } from '../lib/queryCache';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
  // Demo mode (development only — never honored in production builds)
  enableDemoMode: () => void;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo mode is a local-development convenience. It is compiled out of
// production builds so `demo/demo` can never open the admin panel live.
const DEMO_ENABLED = import.meta.env.DEV === true;
const DEMO_STORAGE_KEY = 'demoMode';

// Demo user for local development when Supabase is not configured
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
  const userRef = useRef<User | null>(null);
  userRef.current = user;
  const lastFocusCheck = useRef(0);

  useEffect(() => {
    // Defensive: a stale demo flag must never grant access in production.
    if (!DEMO_ENABLED) {
      localStorage.removeItem(DEMO_STORAGE_KEY);
    }

    // Check for demo mode in localStorage (dev only)
    if (DEMO_ENABLED && localStorage.getItem(DEMO_STORAGE_KEY) === 'true') {
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

    void checkSession();

    // Subscribe to auth changes. Every event carries the current session,
    // so a null session (SIGNED_OUT, failed TOKEN_REFRESHED = expiry) clears
    // the user and ProtectedRoute sends them back to /admin to re-login.
    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (_event: any, session: any) => {
          setUser((session?.user as User | null) ?? null);
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

  // Revalidate the session when the tab regains focus (throttled): catches
  // expiry that happened while the tab was asleep without waiting for a
  // failed request. Skipped in demo mode.
  useEffect(() => {
    const revalidate = async () => {
      const now = Date.now();
      if (now - lastFocusCheck.current < 60_000) return;
      lastFocusCheck.current = now;
      if (!userRef.current || localStorage.getItem(DEMO_STORAGE_KEY) === 'true') return;
      try {
        const session = await getSession();
        if (!session?.user) {
          setUser(null);
        } else if (session.user.id !== userRef.current.id) {
          setUser(session.user);
        }
      } catch (err) {
        console.error('Error revalidating session:', err);
      }
    };

    const onFocus = () => void revalidate();
    const onVisibility = () => {
      if (document.visibilityState === 'visible') void revalidate();
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Demo credentials only exist in development builds
      if (DEMO_ENABLED && email === 'demo' && password === 'demo') {
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
      // Always clear demo state, even if Supabase sign-out below fails
      const wasDemo = isDemoMode || localStorage.getItem(DEMO_STORAGE_KEY) === 'true';
      localStorage.removeItem(DEMO_STORAGE_KEY);
      setIsDemoMode(false);
      // Drop cached reads (incl. admin-only data) so nothing lingers for the
      // next person on a shared browser.
      clearQueryCache();
      if (wasDemo) {
        setUser(null);
        return { error: null };
      }

      const { error } = await supabase.auth.signOut();
      if (!error) setUser(null);
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const enableDemoMode = useCallback(() => {
    if (!DEMO_ENABLED) return;
    localStorage.setItem(DEMO_STORAGE_KEY, 'true');
    setIsDemoMode(true);
    setUser(demoUser);
  }, []);

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
