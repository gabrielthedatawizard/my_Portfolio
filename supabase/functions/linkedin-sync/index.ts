/**
 * Supabase Edge Function: linkedin-sync
 *
 * Handles two routes:
 *   GET  /linkedin-sync/callback  — LinkedIn OAuth redirect handler (popup postMessage)
 *   POST /linkedin-sync           — Exchange auth code for token, fetch profile, upsert to DB
 *
 * Environment variables (set in Supabase Dashboard → Edge Functions → Secrets):
 *   LINKEDIN_CLIENT_ID      — Your LinkedIn App Client ID
 *   LINKEDIN_CLIENT_SECRET  — Your LinkedIn App Client Secret
 *   SUPABASE_URL            — Your Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY — Service role key for DB writes
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

interface LinkedInTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

interface LinkedInUserInfoResponse {
  sub: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  email?: string;
  locale?: { country: string; language: string };
  headline?: string;
  'vanity_name'?: string;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const url = new URL(req.url);

  // -------------------------------------------------------------------------
  // GET /linkedin-sync/callback
  // LinkedIn redirects here after user grants permission.
  // We relay the code/error back to the parent window via postMessage.
  // -------------------------------------------------------------------------
  if (req.method === 'GET' && url.pathname.endsWith('/callback')) {
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');
    const errorDescription = url.searchParams.get('error_description');

    const html = `<!DOCTYPE html>
<html>
<head><title>LinkedIn Authorization</title></head>
<body>
<script>
  if (window.opener) {
    window.opener.postMessage(
      {
        type: 'linkedin-oauth-callback',
        code: ${JSON.stringify(code)},
        state: ${JSON.stringify(state)},
        error: ${JSON.stringify(error ?? errorDescription ?? null)},
      },
      window.location.origin
    );
    window.close();
  } else {
    document.body.innerHTML = '<p>Authorization complete. You can close this window.</p>';
  }
</script>
<p>Completing authorization, please wait...</p>
</body>
</html>`;

    return new Response(html, {
      headers: { ...corsHeaders, 'Content-Type': 'text/html' },
    });
  }

  // -------------------------------------------------------------------------
  // POST /linkedin-sync
  // Exchange auth code for access token, fetch user profile, upsert to DB.
  // -------------------------------------------------------------------------
  if (req.method === 'POST') {
    try {
      const { code, redirectUri } = await req.json() as { code: string; redirectUri: string };

      if (!code || !redirectUri) {
        return new Response(
          JSON.stringify({ error: 'Missing code or redirectUri' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const clientId = Deno.env.get('LINKEDIN_CLIENT_ID');
      const clientSecret = Deno.env.get('LINKEDIN_CLIENT_SECRET');
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

      if (!clientId || !clientSecret || !supabaseUrl || !serviceRoleKey) {
        return new Response(
          JSON.stringify({ error: 'Server configuration missing. Check Edge Function secrets.' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Step 1: Exchange authorization code for access token
      const tokenParams = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      });

      const tokenResponse = await fetch(
        'https://www.linkedin.com/oauth/v2/accessToken',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: tokenParams.toString(),
        }
      );

      if (!tokenResponse.ok) {
        const tokenError = await tokenResponse.text();
        console.error('LinkedIn token error:', tokenError);
        return new Response(
          JSON.stringify({ error: `Failed to get LinkedIn access token: ${tokenError}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const tokenData = await tokenResponse.json() as LinkedInTokenResponse;
      const accessToken = tokenData.access_token;

      // Step 2: Fetch profile using OpenID Connect userinfo endpoint
      // This returns: sub, name, given_name, family_name, picture, email, locale
      const userInfoResponse = await fetch(
        'https://api.linkedin.com/v2/userinfo',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!userInfoResponse.ok) {
        const userInfoError = await userInfoResponse.text();
        console.error('LinkedIn userinfo error:', userInfoError);
        return new Response(
          JSON.stringify({ error: `Failed to fetch LinkedIn profile: ${userInfoError}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const userInfo = await userInfoResponse.json() as LinkedInUserInfoResponse;

      const profileData = {
        name: userInfo.name ?? [userInfo.given_name, userInfo.family_name].filter(Boolean).join(' '),
        email: userInfo.email,
        avatar_url: userInfo.picture,
        updated_at: new Date().toISOString(),
      };

      // Step 3: Upsert profile into Supabase
      const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

      const { data: existingProfile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .limit(1);

      const existingId = (existingProfile?.[0] as { id: string } | undefined)?.id;

      if (existingId) {
        await supabaseAdmin
          .from('profiles')
          .update(profileData)
          .eq('id', existingId);
      } else {
        await supabaseAdmin.from('profiles').insert({
          ...profileData,
          headline: '',
          bio: '',
          location: '',
        });
      }

      // Return the synced profile data to the frontend
      const result = {
        name: profileData.name,
        email: profileData.email,
        profilePicture: profileData.avatar_url,
      };

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (err) {
      console.error('linkedin-sync error:', err);
      return new Response(
        JSON.stringify({ error: err instanceof Error ? err.message : 'Internal server error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }

  return new Response('Method not allowed', { status: 405, headers: corsHeaders });
});
