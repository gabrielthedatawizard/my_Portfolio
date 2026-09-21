import { isSupabaseConfigured, supabase } from '@/lib/supabase';

const SESSION_STORAGE_KEY = 'portfolio_session_id';

/**
 * Gets the portfolio session id, creating one if needed (same key and format
 * as `useVisitorTracking`). Creating here covers entry points that render
 * outside `PublicLayout` — e.g. the standalone `/cv` page.
 */
export const getPortfolioSessionId = (): string => {
  if (typeof window === 'undefined') return '';
  const existing = localStorage.getItem(SESSION_STORAGE_KEY);
  if (existing) return existing;
  const generated =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  localStorage.setItem(SESSION_STORAGE_KEY, generated);
  return generated;
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
