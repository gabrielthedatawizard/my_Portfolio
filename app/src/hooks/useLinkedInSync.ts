/**
 * useLinkedInSync
 *
 * Custom hook for syncing basic profile data (name, headline, photo, email)
 * from LinkedIn using OAuth 2.0 (openid + profile + email scopes).
 *
 * Flow:
 *  1. Open a popup window with the LinkedIn OAuth authorization URL
 *  2. User grants permission on LinkedIn
 *  3. LinkedIn redirects to our callback URL with an auth code
 *  4. Our Supabase Edge Function exchanges the code for a token and fetches profile
 *  5. Profile fields are upserted into Supabase
 *  6. Hook returns updated profile data
 *
 * Requirements:
 *  - VITE_LINKEDIN_CLIENT_ID env variable
 *  - Supabase Edge Function deployed at /functions/v1/linkedin-sync
 *  - LinkedIn App with redirect URI: <supabase-url>/functions/v1/linkedin-sync/callback
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { buildLinkedInAuthUrl } from '@/lib/linkedinImport';
import type { LinkedInSyncStatus, LinkedInSyncResult } from '@/types';

const LINKEDIN_CLIENT_ID = import.meta.env.VITE_LINKEDIN_CLIENT_ID as string | undefined;
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;

// The redirect URI must match exactly what's registered in your LinkedIn App
const getRedirectUri = () => {
  if (!SUPABASE_URL) return '';
  return `${SUPABASE_URL}/functions/v1/linkedin-sync/callback`;
};

// Generates a random state string for CSRF protection
function generateState(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export interface UseLinkedInSyncReturn {
  status: LinkedInSyncStatus;
  result: LinkedInSyncResult | null;
  error: string | null;
  isConfigured: boolean;
  lastSynced: Date | null;
  sync: () => void;
  reset: () => void;
}

export function useLinkedInSync(): UseLinkedInSyncReturn {
  const [status, setStatus] = useState<LinkedInSyncStatus>('idle');
  const [result, setResult] = useState<LinkedInSyncResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastSynced, setLastSynced] = useState<Date | null>(() => {
    const stored = localStorage.getItem('linkedin_last_synced');
    return stored ? new Date(stored) : null;
  });

  const popupRef = useRef<Window | null>(null);
  const stateRef = useRef<string>('');
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isConfigured = Boolean(LINKEDIN_CLIENT_ID && SUPABASE_URL);

  const clearPoll = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, []);

  // Listen for messages from the OAuth popup
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // Only accept messages from our own origin
      if (event.origin !== window.location.origin) return;

      const { type, code, state, error: oauthError } = event.data as {
        type?: string;
        code?: string;
        state?: string;
        error?: string;
      };

      if (type !== 'linkedin-oauth-callback') return;

      clearPoll();
      if (popupRef.current && !popupRef.current.closed) {
        popupRef.current.close();
      }

      if (oauthError) {
        setError(`LinkedIn authorization failed: ${oauthError}`);
        setStatus('error');
        return;
      }

      if (!code || state !== stateRef.current) {
        setError('Invalid OAuth response. Please try again.');
        setStatus('error');
        return;
      }

      // Exchange code via Supabase Edge Function
      setStatus('syncing');
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const accessToken = sessionData?.session?.access_token;

        const response = await fetch(
          `${SUPABASE_URL}/functions/v1/linkedin-sync`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken ?? ''}`,
            },
            body: JSON.stringify({
              code,
              redirectUri: getRedirectUri(),
            }),
          }
        );

        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || `HTTP ${response.status}`);
        }

        const syncResult = await response.json() as LinkedInSyncResult;
        setResult(syncResult);
        setStatus('success');
        const now = new Date();
        setLastSynced(now);
        localStorage.setItem('linkedin_last_synced', now.toISOString());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to sync profile');
        setStatus('error');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [clearPoll]);

  const sync = useCallback(() => {
    if (!isConfigured) {
      setError('LinkedIn Client ID or Supabase URL not configured. Check your .env file.');
      setStatus('error');
      return;
    }

    setStatus('connecting');
    setError(null);
    setResult(null);

    const state = generateState();
    stateRef.current = state;

    const authUrl = buildLinkedInAuthUrl(
      LINKEDIN_CLIENT_ID!,
      getRedirectUri(),
      state
    );

    // Open OAuth popup
    const width = 600;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      authUrl,
      'linkedin-oauth',
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`
    );

    if (!popup) {
      setError('Popup was blocked. Please allow popups for this site and try again.');
      setStatus('error');
      return;
    }

    popupRef.current = popup;

    // Poll to detect if popup was closed without completing OAuth
    pollIntervalRef.current = setInterval(() => {
      if (popup.closed) {
        clearPoll();
        setStatus((prev) => {
          if (prev === 'connecting') {
            setError('Authorization was cancelled.');
            return 'error';
          }
          return prev;
        });
      }
    }, 500);
  }, [isConfigured, clearPoll]);

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
    setResult(null);
    clearPoll();
  }, [clearPoll]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearPoll();
    };
  }, [clearPoll]);

  return { status, result, error, isConfigured, lastSynced, sync, reset };
}
