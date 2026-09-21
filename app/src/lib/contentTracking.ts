import { isSupabaseConfigured, supabase } from '@/lib/supabase';

const SESSION_STORAGE_KEY = 'portfolio_session_id';

/**
 * Reuses the visitor session id created by `useVisitorTracking` so content
 * views (project case-study opens, insight reads) attribute to the same
 * session. Returns '' when no session exists yet (tracking not initialized).
 */
export const getPortfolioSessionId = (): string => {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(SESSION_STORAGE_KEY) ?? '';
};

/**
 * Records a virtual page view in the `visitors` table, e.g.
 * `/projects/dhis2-dashboard` or `/insights/data-quality-notes`.
 *
 * No schema change needed: these rows flow straight into the existing
 * Analytics top-pages, trends and CSV export. Fire-and-forget — never
 * throws, never blocks the UI.
 */
export const trackContentView = (path: string): void => {
  if (!isSupabaseConfigured || typeof window === 'undefined') return;
  const sessionId = getPortfolioSessionId();
  if (!sessionId) return;

  void (async () => {
    try {
      const { error } = await supabase.from('visitors').insert({
        session_id: sessionId,
        path,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent || null,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
      });
      if (error) throw error;
    } catch (error) {
      console.error('Content view tracking failed:', error);
    }
  })();
};
