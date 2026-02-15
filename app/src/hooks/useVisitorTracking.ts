import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

const SESSION_STORAGE_KEY = 'portfolio_session_id';
const TRACK_DEDUPE_KEY = 'portfolio_last_tracked_path';

const getSessionId = () => {
  if (typeof window === 'undefined') return '';

  const existingSessionId = localStorage.getItem(SESSION_STORAGE_KEY);
  if (existingSessionId) return existingSessionId;

  const generatedSessionId =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  localStorage.setItem(SESSION_STORAGE_KEY, generatedSessionId);
  return generatedSessionId;
};

export const useVisitorTracking = () => {
  const location = useLocation();
  const sessionId = useMemo(getSessionId, []);

  useEffect(() => {
    if (!isSupabaseConfigured || !sessionId) return;
    const currentPath = `${location.pathname}${location.search}`;

    const lastTrackedRaw = sessionStorage.getItem(TRACK_DEDUPE_KEY);
    if (lastTrackedRaw) {
      try {
        const lastTracked = JSON.parse(lastTrackedRaw) as { path: string; ts: number };
        if (lastTracked.path === currentPath && Date.now() - lastTracked.ts < 5000) {
          return;
        }
      } catch {
        // Ignore malformed session storage payloads
      }
    }

    sessionStorage.setItem(
      TRACK_DEDUPE_KEY,
      JSON.stringify({ path: currentPath, ts: Date.now() })
    );

    const trackVisit = async () => {
      try {
        const { error } = await supabase.from('visitors').insert({
          session_id: sessionId,
          path: currentPath,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent || null,
          viewport: `${window.innerWidth}x${window.innerHeight}`,
        });

        if (error) throw error;
      } catch (error) {
        console.error('Visitor tracking failed:', error);
      }
    };

    void trackVisit();
  }, [location.pathname, location.search, sessionId]);
};
