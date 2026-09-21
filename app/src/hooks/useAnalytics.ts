import { useCallback, useEffect, useMemo, useState } from 'react';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { Visitor } from '@/types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export const parseBrowser = (ua?: string | null): string => {
  if (!ua) return 'Unknown';
  const u = ua.toLowerCase();
  if (u.includes('edg/') || u.includes('edge')) return 'Edge';
  if (u.includes('opr/') || u.includes('opera')) return 'Opera';
  if (u.includes('chrome/') && !u.includes('chromium')) return 'Chrome';
  if (u.includes('safari/') && u.includes('version/')) return 'Safari';
  if (u.includes('firefox/')) return 'Firefox';
  if (u.includes('msie') || u.includes('trident')) return 'IE';
  if (u.includes('bot') || u.includes('crawl') || u.includes('spider')) return 'Bot';
  return 'Other';
};

export const parseDevice = (viewport?: string | null): 'Desktop' | 'Mobile' | 'Unknown' => {
  if (!viewport || !viewport.includes('x')) return 'Unknown';
  const width = Number(viewport.split('x')[0]);
  if (Number.isNaN(width)) return 'Unknown';
  return width >= 768 ? 'Desktop' : 'Mobile';
};

export const cleanReferrer = (ref?: string | null): string => {
  if (!ref) return 'Direct';
  try {
    const url = new URL(ref);
    return url.hostname.replace(/^www\./, '') || 'Direct';
  } catch {
    return ref.slice(0, 32) || 'Direct';
  }
};

export const shortSession = (sessionId: string): string =>
  sessionId.length > 8 ? `${sessionId.slice(0, 8)}…` : sessionId;

const dayKey = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;

const startOfDay = (d: Date): Date => {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

// ---------------------------------------------------------------------------
// useVisitors — raw visit log (admin)
// ---------------------------------------------------------------------------

export const useVisitors = (limit = 500) => {
  const [data, setData] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchVisitors = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setData([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data: result, error: supabaseError } = await supabase
        .from('visitors')
        .select('*')
        .order('visited_at', { ascending: false })
        .limit(limit);
      if (supabaseError) throw supabaseError;
      setData((result ?? []) as Visitor[]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load visitors'));
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    void fetchVisitors();
  }, [fetchVisitors]);

  return { data, loading, error, refetch: fetchVisitors };
};

// ---------------------------------------------------------------------------
// Analytics types
// ---------------------------------------------------------------------------

export interface DailyPoint {
  date: string;
  label: string;
  views: number;
  uniques: number;
}

export interface TopEntry {
  name: string;
  views: number;
  uniques: number;
  share: number;
}

export interface AnalyticsSummary {
  totalViews: number;
  totalUniques: number;
  rangeViews: number;
  rangeUniques: number;
  prevRangeViews: number;
  viewsDeltaPct: number | null;
  todayViews: number;
  todayUniques: number;
  avgPerDay: number;
  returningRatePct: number;
  topPage: string;
  contactConversionPct: number;
}

// ---------------------------------------------------------------------------
// useAnalytics — aggregated insights for portfolio owners
// ---------------------------------------------------------------------------

export const useAnalytics = (rangeDays = 30) => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [messageCount, setMessageCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setVisitors([]);
      setMessageCount(0);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const [{ data: visitRows }, { count: msgCount }] = await Promise.all([
        supabase
          .from('visitors')
          .select('*')
          .order('visited_at', { ascending: false })
          .limit(2000),
        supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
      ]);
      setVisitors((visitRows ?? []) as Visitor[]);
      setMessageCount(msgCount ?? 0);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchAnalytics();
  }, [fetchAnalytics]);

  const computed = useMemo(() => {
    const now = new Date();
    const todayStart = startOfDay(now);
    const rangeStart = startOfDay(new Date(now.getTime() - (rangeDays - 1) * 86400000));
    const prevRangeStart = new Date(rangeStart.getTime() - rangeDays * 86400000);

    const totalViews = visitors.length;
    const totalUniques = new Set(visitors.map((v) => v.session_id)).size;

    const inRange = visitors.filter(
      (v) => v.visited_at && new Date(v.visited_at) >= rangeStart
    );
    const prevRange = visitors.filter((v) => {
      if (!v.visited_at) return false;
      const t = new Date(v.visited_at);
      return t >= prevRangeStart && t < rangeStart;
    });
    const today = visitors.filter(
      (v) => v.visited_at && new Date(v.visited_at) >= todayStart
    );

    const rangeViews = inRange.length;
    const rangeUniques = new Set(inRange.map((v) => v.session_id)).size;
    const prevRangeViews = prevRange.length;
    const viewsDeltaPct =
      prevRangeViews > 0
        ? Math.round(((rangeViews - prevRangeViews) / prevRangeViews) * 100)
        : null;

    // Returning visitors: sessions seen more than once in range
    const sessionCounts = new Map<string, number>();
    inRange.forEach((v) => sessionCounts.set(v.session_id, (sessionCounts.get(v.session_id) ?? 0) + 1));
    const returningSessions = [...sessionCounts.values()].filter((c) => c > 1).length;
    const returningRatePct =
      rangeUniques > 0 ? Math.round((returningSessions / rangeUniques) * 100) : 0;

    // Daily series
    const buckets = new Map<string, { views: number; sessions: Set<string> }>();
    for (let i = 0; i < rangeDays; i++) {
      const d = new Date(rangeStart.getTime() + i * 86400000);
      buckets.set(dayKey(d), { views: 0, sessions: new Set() });
    }
    inRange.forEach((v) => {
      if (!v.visited_at) return;
      const key = dayKey(new Date(v.visited_at));
      const bucket = buckets.get(key);
      if (bucket) {
        bucket.views += 1;
        bucket.sessions.add(v.session_id);
      }
    });
    const daily: DailyPoint[] = [...buckets.entries()].map(([date, b]) => ({
      date,
      label: new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      views: b.views,
      uniques: b.sessions.size,
    }));

    // Top pages
    const pageMap = new Map<string, { views: number; sessions: Set<string> }>();
    inRange.forEach((v) => {
      const path = v.path || '/';
      const entry = pageMap.get(path) ?? { views: 0, sessions: new Set<string>() };
      entry.views += 1;
      entry.sessions.add(v.session_id);
      pageMap.set(path, entry);
    });
    const topPages: TopEntry[] = [...pageMap.entries()]
      .map(([name, e]) => ({
        name,
        views: e.views,
        uniques: e.sessions.size,
        share: rangeViews > 0 ? Math.round((e.views / rangeViews) * 100) : 0,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 8);

    // Top referrers
    const refMap = new Map<string, { views: number; sessions: Set<string> }>();
    inRange.forEach((v) => {
      const ref = cleanReferrer(v.referrer);
      const entry = refMap.get(ref) ?? { views: 0, sessions: new Set<string>() };
      entry.views += 1;
      entry.sessions.add(v.session_id);
      refMap.set(ref, entry);
    });
    const topReferrers: TopEntry[] = [...refMap.entries()]
      .map(([name, e]) => ({
        name,
        views: e.views,
        uniques: e.sessions.size,
        share: rangeViews > 0 ? Math.round((e.views / rangeViews) * 100) : 0,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 8);

    // Browsers
    const browserMap = new Map<string, number>();
    inRange.forEach((v) => {
      const b = parseBrowser(v.user_agent);
      browserMap.set(b, (browserMap.get(b) ?? 0) + 1);
    });
    const browsers: TopEntry[] = [...browserMap.entries()]
      .map(([name, views]) => ({
        name,
        views,
        uniques: views,
        share: rangeViews > 0 ? Math.round((views / rangeViews) * 100) : 0,
      }))
      .sort((a, b) => b.views - a.views);

    // Devices
    const deviceMap = new Map<string, number>();
    inRange.forEach((v) => {
      const d = parseDevice(v.viewport);
      deviceMap.set(d, (deviceMap.get(d) ?? 0) + 1);
    });
    const devices: TopEntry[] = [...deviceMap.entries()]
      .map(([name, views]) => ({
        name,
        views,
        uniques: views,
        share: rangeViews > 0 ? Math.round((views / rangeViews) * 100) : 0,
      }))
      .sort((a, b) => b.views - a.views);

    const summary: AnalyticsSummary = {
      totalViews,
      totalUniques,
      rangeViews,
      rangeUniques,
      prevRangeViews,
      viewsDeltaPct,
      todayViews: today.length,
      todayUniques: new Set(today.map((v) => v.session_id)).size,
      avgPerDay: rangeDays > 0 ? Math.round((rangeViews / rangeDays) * 10) / 10 : 0,
      returningRatePct,
      topPage: topPages[0]?.name ?? '—',
      contactConversionPct:
        rangeUniques > 0 ? Math.round((messageCount / Math.max(rangeUniques, 1)) * 1000) / 10 : 0,
    };

    // Hiring funnel (in range): unique visitors -> CV views -> CV downloads -> messages.
    // CV events come from virtual paths logged by the standalone /cv page.
    const cvSessions = new Set(
      inRange.filter((v) => v.path === '/cv').map((v) => v.session_id)
    );
    const downloadSessions = new Set(
      inRange.filter((v) => v.path === '/cv/download').map((v) => v.session_id)
    );
    const pct = (num: number, den: number) =>
      den > 0 ? Math.round((num / den) * 1000) / 10 : 0;
    const funnel = {
      visitors: rangeUniques,
      cvViews: cvSessions.size,
      cvDownloads: downloadSessions.size,
      messages: messageCount,
      cvViewRate: pct(cvSessions.size, rangeUniques),
      downloadRate: pct(downloadSessions.size, cvSessions.size),
      messageRate: pct(messageCount, rangeUniques),
    };

    // Actionable insights tailored to a health-data portfolio
    const insights: string[] = [];
    const mobileShare = devices.find((d) => d.name === 'Mobile')?.share ?? 0;
    if (mobileShare >= 50) {
      insights.push(
        `${mobileShare}% of visits are on mobile — verify the CV page and project case studies read well on small screens; recruiters often skim on phones.`
      );
    }
    const directShare = topReferrers.find((r) => r.name === 'Direct')?.share ?? 0;
    if (directShare >= 60) {
      insights.push(
        `${directShare}% of traffic is Direct — add UTM links on LinkedIn, GitHub and WhatsApp (e.g. ?utm_source=linkedin) so you can see which channel brings recruiters.`
      );
    }
    const projectViews = topPages
      .filter((p) => p.name.includes('project') || p.name === '/')
      .reduce((sum, p) => sum + p.share, 0);
    if (topPages.length > 0 && projectViews < 30 && rangeViews > 20) {
      insights.push(
        `Only ~${projectViews}% of views touch project content — feature your strongest health-data case study (EHR analytics, DHIS2, predictive model) at the top of the Projects section.`
      );
    }
    if (summary.contactConversionPct < 2 && rangeUniques > 20) {
      insights.push(
        `Contact conversion is ${summary.contactConversionPct}% — add a clear "Hire me / Collaborate" CTA near the top of the Hero and after each case study outcome.`
      );
    }
    if (summary.returningRatePct >= 25) {
      insights.push(
        `${summary.returningRatePct}% returning visitors — a blog post or new dashboard screenshot gives them a reason to come back and share.`
      );
    }
    if (insights.length === 0) {
      insights.push(
        'Traffic looks healthy. Keep one featured project, one certificate and your CV fresh each month — stale portfolios lose recruiter trust.'
      );
    }

    return { summary, daily, topPages, topReferrers, browsers, devices, insights, funnel };
  }, [visitors, messageCount, rangeDays]);

  return {
    visitors,
    messageCount,
    loading,
    refetch: fetchAnalytics,
    ...computed,
  };
};

// ---------------------------------------------------------------------------
// useContentHealth — portfolio completeness checklist (health-data focused)
// ---------------------------------------------------------------------------

export interface HealthItem {
  label: string;
  done: boolean;
  hint: string;
  action: string;
}

export const useContentHealth = () => {
  const [counts, setCounts] = useState({
    projects: 0,
    featuredProjects: 0,
    certificates: 0,
    skills: 0,
    posts: 0,
    gallery: 0,
    experience: 0,
    education: 0,
    testimonials: 0,
    unreadMessages: 0,
  });
  const [profile, setProfile] = useState({
    name: false,
    headline: false,
    bio: false,
    email: false,
    cv: false,
    linkedin: false,
  });
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const [
        { count: projects },
        { data: featuredRows },
        { count: certificates },
        { count: skills },
        { count: posts },
        { count: gallery },
        { count: experience },
        { count: education },
        { count: testimonials },
        { count: unreadMessages },
        { data: profileRows },
      ] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('id').eq('featured', true).eq('status', 'published'),
        supabase.from('certificates').select('*', { count: 'exact', head: true }),
        supabase.from('skills').select('*', { count: 'exact', head: true }),
        supabase.from('posts').select('*', { count: 'exact', head: true }),
        supabase.from('gallery').select('*', { count: 'exact', head: true }),
        supabase.from('experience').select('*', { count: 'exact', head: true }),
        supabase.from('education').select('*', { count: 'exact', head: true }),
        supabase.from('testimonials').select('*', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('read', false),
        supabase.from('profiles').select('name,headline,bio,email,cv_url,linkedin').limit(1),
      ]);
      const p = (profileRows?.[0] ?? {}) as Record<string, unknown>;
      setCounts({
        projects: projects ?? 0,
        featuredProjects: featuredRows?.length ?? 0,
        certificates: certificates ?? 0,
        skills: skills ?? 0,
        posts: posts ?? 0,
        gallery: gallery ?? 0,
        experience: experience ?? 0,
        education: education ?? 0,
        testimonials: testimonials ?? 0,
        unreadMessages: unreadMessages ?? 0,
      });
      setProfile({
        name: Boolean(p.name),
        headline: Boolean(p.headline),
        bio: Boolean(p.bio && String(p.bio).length >= 80),
        email: Boolean(p.email),
        cv: Boolean(p.cv_url),
        linkedin: Boolean(p.linkedin),
      });
    } catch (error) {
      console.error('Failed to load content health:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const items: HealthItem[] = useMemo(
    () => [
      {
        label: 'Profile headline & bio (80+ chars)',
        done: profile.headline && profile.bio,
        hint: 'Recruiters decide in ~7 seconds — state your health-data niche clearly.',
        action: 'settings',
      },
      {
        label: 'CV uploaded',
        done: profile.cv,
        hint: 'A downloadable CV doubles recruiter follow-through.',
        action: 'settings',
      },
      {
        label: 'LinkedIn connected',
        done: profile.linkedin,
        hint: 'Cross-link LinkedIn for credibility and referral traffic.',
        action: 'settings',
      },
      {
        label: `Featured projects (${counts.featuredProjects}/3)`,
        done: counts.featuredProjects >= 3,
        hint: 'Showcase 3+ case studies with problem → approach → measurable outcome.',
        action: 'projects',
      },
      {
        label: `Skills (${counts.skills}/15)`,
        done: counts.skills >= 15,
        hint: 'Cover data/BI, databases, AI/ML, digital health and research.',
        action: 'skills',
      },
      {
        label: `Certificates (${counts.certificates}/5)`,
        done: counts.certificates >= 5,
        hint: 'Health informatics + cloud/data certs build hiring trust.',
        action: 'certificates',
      },
      {
        label: `Work experience (${counts.experience}/2)`,
        done: counts.experience >= 2,
        hint: 'Quantify impact: e.g. "cut report time from hours to minutes".',
        action: 'experience',
      },
      {
        label: `Client testimonials (${counts.testimonials}/3)`,
        done: counts.testimonials >= 3,
        hint: 'Quotes from supervisors or clinical partners convert skeptics.',
        action: 'testimonials',
      },
    ],
    [profile, counts]
  );

  const score = useMemo(() => {
    const done = items.filter((i) => i.done).length;
    return Math.round((done / Math.max(items.length, 1)) * 100);
  }, [items]);

  return { counts, profile, items, score, loading, refetch };
};

// ---------------------------------------------------------------------------
// useContentViewCounts — per-project / per-post views from virtual paths
// (`/projects/:slug`, `/insights/:slug` recorded via trackContentView)
// ---------------------------------------------------------------------------

export interface ContentViewCount {
  views: number;
  uniques: number;
}

export const useContentViewCounts = () => {
  const [projectViews, setProjectViews] = useState<Record<string, ContentViewCount>>({});
  const [postViews, setPostViews] = useState<Record<string, ContentViewCount>>({});
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setProjectViews({});
      setPostViews({});
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('visitors')
        .select('session_id, path')
        .limit(2000);
      if (error) throw error;

      const projects: Record<string, { views: number; sessions: Set<string> }> = {};
      const posts: Record<string, { views: number; sessions: Set<string> }> = {};
      ((data ?? []) as Array<{ session_id: string; path: string }>).forEach((row) => {
        const match = row.path?.match(/^\/(projects|insights)\/([^/?#]+)/);
        if (!match) return;
        const [, kind, slug] = match;
        const bucket = kind === 'projects' ? projects : posts;
        const entry = bucket[slug] ?? { views: 0, sessions: new Set<string>() };
        entry.views += 1;
        entry.sessions.add(row.session_id);
        bucket[slug] = entry;
      });

      const collapse = (bucket: Record<string, { views: number; sessions: Set<string> }>) =>
        Object.fromEntries(
          Object.entries(bucket).map(([slug, e]) => [
            slug,
            { views: e.views, uniques: e.sessions.size },
          ])
        );
      setProjectViews(collapse(projects));
      setPostViews(collapse(posts));
    } catch (error) {
      console.error('Failed to load content view counts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { projectViews, postViews, loading, refetch };
};
