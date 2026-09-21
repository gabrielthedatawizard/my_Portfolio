import { useMemo } from 'react';
import {
  FolderGit2,
  Award,
  FileText,
  Image,
  Settings,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  RefreshCw,
  BarChart3,
  Quote,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Stethoscope,
} from 'lucide-react';
import { useContactMessages, useStats, useVisitorStats } from '../../hooks/useData';
import { useAnalytics, useContentHealth } from '../../hooks/useAnalytics';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

type DashboardSection =
  | 'analytics'
  | 'projects'
  | 'certificates'
  | 'posts'
  | 'gallery'
  | 'messages'
  | 'settings'
  | 'testimonials'
  | 'skills'
  | 'experience';

interface DashboardHomeProps {
  onNavigate: (section: DashboardSection) => void;
  onSyncSampleContent: () => Promise<void>;
  syncingSampleContent: boolean;
}

const timeAgo = (value?: string) => {
  if (!value) return 'Unknown time';
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const DashboardHome = ({
  onNavigate,
  onSyncSampleContent,
  syncingSampleContent,
}: DashboardHomeProps) => {
  const { stats, loading } = useStats();
  const { data: messages } = useContactMessages();
  const { stats: visitorStats, loading: visitorLoading } = useVisitorStats();
  const analytics = useAnalytics(30);
  const health = useContentHealth();

  const unreadMessages = useMemo(
    () => messages.filter((message) => !message.read).length,
    [messages]
  );

  // Real activity feed: latest messages + latest visits (no more hardcoded items)
  const recentActivity = useMemo(() => {
    const messageItems = messages.slice(0, 3).map((m) => ({
      kind: 'message' as const,
      action: 'New message received',
      item: `${m.name} — ${m.subject}`,
      time: m.created_at ?? '',
      displayTime: timeAgo(m.created_at),
    }));
    const visitItems = analytics.visitors.slice(0, 4).map((v) => ({
      kind: 'visit' as const,
      action: 'Portfolio viewed',
      item: `${v.path || '/'} · ${v.session_id.slice(0, 8)}`,
      time: v.visited_at ?? '',
      displayTime: timeAgo(v.visited_at),
    }));
    return [...messageItems, ...visitItems]
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 5);
  }, [messages, analytics.visitors]);

  const delta = analytics.summary.viewsDeltaPct;

  const quickStats = [
    {
      label: 'Total Projects',
      value: stats.projectsCount,
      icon: FolderGit2,
      badge:
        health.counts.featuredProjects > 0 ? (
          <Badge variant="secondary" className="bg-electric/10 text-electric border-0">
            {health.counts.featuredProjects} featured
          </Badge>
        ) : (
          <Badge variant="secondary" className="bg-amber-500/15 text-amber-400 border-0">
            feature 3+
          </Badge>
        ),
    },
    {
      label: 'Certificates',
      value: stats.certificatesCount,
      icon: Award,
      badge: (
        <Badge variant="secondary" className="bg-green-500/15 text-green-400 border-0">
          {health.counts.certificates}/5 goal
        </Badge>
      ),
    },
    {
      label: 'Unread Messages',
      value: unreadMessages,
      icon: MessageSquare,
      badge:
        unreadMessages > 0 ? (
          <Badge className="bg-purple-500/15 text-purple-300 border-0">needs reply</Badge>
        ) : (
          <Badge variant="secondary" className="bg-white/5 text-white/50 border-0">inbox zero</Badge>
        ),
    },
    {
      label: 'Unique Visitors (30d)',
      value: visitorLoading ? '—' : analytics.summary.rangeUniques,
      icon: Users,
      badge:
        delta === null ? (
          <Badge variant="secondary" className="bg-white/5 text-white/50 border-0">collecting</Badge>
        ) : delta >= 0 ? (
          <Badge className="bg-green-500/15 text-green-400 border-0">
            <TrendingUp className="h-3 w-3 mr-1" /> +{delta}%
          </Badge>
        ) : (
          <Badge className="bg-red-500/15 text-red-400 border-0">
            <TrendingDown className="h-3 w-3 mr-1" /> {delta}%
          </Badge>
        ),
    },
  ];

  const quickActions: Array<{ label: string; icon: React.ElementType; section: DashboardSection }> = [
    { label: 'Analytics', icon: BarChart3, section: 'analytics' },
    { label: 'Add Project', icon: FolderGit2, section: 'projects' },
    { label: 'Add Certificate', icon: Award, section: 'certificates' },
    { label: 'New Blog Post', icon: FileText, section: 'posts' },
    { label: 'Upload Image', icon: Image, section: 'gallery' },
    { label: 'Testimonials', icon: Quote, section: 'testimonials' },
    { label: 'View Messages', icon: MessageSquare, section: 'messages' },
    { label: 'Settings', icon: Settings, section: 'settings' },
  ];

  const contentRows = [
    { label: 'Projects', total: health.counts.projects, hint: `${health.counts.featuredProjects} featured`, section: 'projects' as DashboardSection },
    { label: 'Skills', total: health.counts.skills, hint: 'goal 15+', section: 'skills' as DashboardSection },
    { label: 'Experience', total: health.counts.experience, hint: 'roles', section: 'experience' as DashboardSection },
    { label: 'Posts', total: health.counts.posts, hint: 'research notes', section: 'posts' as DashboardSection },
    { label: 'Gallery', total: health.counts.gallery, hint: 'field photos', section: 'gallery' as DashboardSection },
    { label: 'Testimonials', total: health.counts.testimonials, hint: 'goal 3+', section: 'testimonials' as DashboardSection },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            Welcome back! <Stethoscope className="h-6 w-6 text-electric" />
          </h2>
          <p className="text-white/60">
            Your health-data portfolio command center — traffic, hiring signals and content readiness.
          </p>
        </div>
        <Button
          className="bg-electric hover:bg-electric-dark text-white w-fit"
          onClick={() => onNavigate('analytics')}
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          Open full analytics
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index} className="bg-charcoal-light border-white/5 text-white">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-white/5 rounded-lg">
                  <stat.icon className="h-5 w-5 text-electric" />
                </div>
                {stat.badge}
              </div>
              <p className="text-3xl font-bold mb-1">
                {loading || visitorLoading ? '-' : stat.value}
              </p>
              <p className="text-sm text-white/60">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Portfolio health + Recruiter signals */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2 bg-charcoal-light border-white/5 text-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Portfolio health — {health.score}%</CardTitle>
                <CardDescription className="text-white/40">
                  What a health employer checks before shortlisting you. Fix red items first.
                </CardDescription>
              </div>
              <Badge
                className={
                  health.score >= 80
                    ? 'bg-green-500/15 text-green-400 border-0'
                    : health.score >= 50
                      ? 'bg-amber-500/15 text-amber-400 border-0'
                      : 'bg-red-500/15 text-red-400 border-0'
                }
              >
                {health.score >= 80 ? 'hire-ready' : health.score >= 50 ? 'almost there' : 'needs work'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={health.score} className="bg-white/10" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {health.items.map((item) => (
                <button
                  key={item.label}
                  onClick={() => onNavigate(item.action as DashboardSection)}
                  className="text-left p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-electric/30 transition-colors group"
                >
                  <div className="flex items-start gap-2">
                    {item.done ? (
                      <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                    )}
                    <div>
                      <p className="text-sm text-white group-hover:text-electric transition-colors">{item.label}</p>
                      <p className="text-xs text-white/40 mt-0.5">{item.hint}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-b from-electric/15 to-charcoal-light border-electric/20 text-white">
          <CardHeader>
            <CardTitle className="text-white">Recruiter signals</CardTitle>
            <CardDescription className="text-white/50">Hiring intent, decoded from your data.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
              <div className="flex items-center gap-3">
                <Eye className="h-5 w-5 text-electric" />
                <div>
                  <p className="text-sm text-white/60">Views today</p>
                  <p className="text-xl font-bold text-white">{analytics.summary.todayViews}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-white/60">CV page</p>
                <p className="text-xl font-bold text-white font-mono">
                  {analytics.topPages.find((p) => p.name === '/cv')?.views ?? 0}
                </p>
              </div>
            </div>
            <div className="p-3 bg-black/20 rounded-lg">
              <p className="text-sm text-white/60 mb-1">Contact conversion (30d)</p>
              <p className="text-2xl font-bold text-white">{analytics.summary.contactConversionPct}%</p>
              <p className="text-xs text-white/40 mt-1">
                {analytics.summary.contactConversionPct >= 2
                  ? 'Healthy — your CTAs are working.'
                  : 'Below 2% — add a "Hire me" CTA after each case-study outcome.'}
              </p>
            </div>
            <div className="p-3 bg-black/20 rounded-lg">
              <p className="text-sm text-white/60 mb-1">Top page</p>
              <p className="font-mono text-electric text-sm truncate">{analytics.summary.topPage}</p>
              <p className="text-xs text-white/40 mt-1">
                {unreadMessages > 0
                  ? `${unreadMessages} unread message${unreadMessages > 1 ? 's' : ''} waiting — reply within 24h.`
                  : 'Inbox clear. Star page deserves a fresh result metric this month.'}
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10"
              onClick={() => onNavigate('messages')}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              {unreadMessages > 0 ? `Reply to ${unreadMessages} message${unreadMessages > 1 ? 's' : ''}` : 'Open inbox'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Activity + Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-charcoal-light border-white/5 text-white">
          <CardHeader>
            <CardTitle className="text-white">Live activity</CardTitle>
            <CardDescription className="text-white/40">Real messages + visits, newest first.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.length === 0 && (
              <p className="text-sm text-white/40">
                No activity yet — share your link on LinkedIn or send yourself a test message via the contact form.
              </p>
            )}
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-white/[0.02] rounded-lg border border-white/5">
                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${activity.kind === 'message' ? 'bg-purple-400' : 'bg-electric'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm">{activity.action}</p>
                  <p className="text-electric text-sm truncate">{activity.item}</p>
                  <p className="text-white/40 text-xs mt-1">{activity.displayTime}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-charcoal-light border-white/5 text-white">
          <CardHeader>
            <CardTitle className="text-white">Quick actions</CardTitle>
            <CardDescription className="text-white/40">The 30-second jobs that keep a portfolio hire-ready.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => onNavigate(action.section)}
                  className="flex flex-col items-center gap-2 p-4 bg-white/[0.02] border border-white/5 rounded-lg hover:bg-white/5 hover:border-electric/30 transition-colors group"
                >
                  <action.icon className="h-5 w-5 text-electric group-hover:scale-110 transition-transform" />
                  <span className="text-xs text-white/70">{action.label}</span>
                </button>
              ))}
            </div>
            <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.02] p-4">
              <p className="text-sm text-white/70 mb-1">Sync frontend sample data</p>
              <p className="text-xs text-white/50 mb-3">
                Imports hardcoded samples into Supabase so they can be edited here.
              </p>
              <Button
                type="button"
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10"
                onClick={() => void onSyncSampleContent()}
                disabled={syncingSampleContent}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${syncingSampleContent ? 'animate-spin' : ''}`} />
                {syncingSampleContent ? 'Syncing...' : 'Sync Samples'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content performance */}
      <Card className="bg-charcoal-light border-white/5 text-white">
        <CardHeader>
          <CardTitle className="text-white">Content inventory</CardTitle>
          <CardDescription className="text-white/40">
            Total records per section — click a tile to curate it. Gaps here are gaps a recruiter sees.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {contentRows.map((row) => (
              <button
                key={row.label}
                onClick={() => onNavigate(row.section)}
                className="p-4 text-center bg-white/[0.02] border border-white/5 rounded-lg hover:border-electric/30 transition-colors"
              >
                <p className="text-2xl font-bold text-white">{health.loading ? '—' : row.total}</p>
                <p className="text-xs text-white/60 mt-1">{row.label}</p>
                <p className="text-[11px] text-electric/80">{row.hint}</p>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-white/5 text-center">
            <div>
              <p className="text-2xl font-bold text-white">
                {visitorLoading ? '-' : visitorStats.totalPageViews}
              </p>
              <p className="text-sm text-white/60">Total profile views</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {visitorLoading ? '-' : visitorStats.todayUniqueVisitors}
              </p>
              <p className="text-sm text-white/60">Unique visitors today</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {visitorLoading ? '-' : visitorStats.todayPageViews}
              </p>
              <p className="text-sm text-white/60">Page views today</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHome;
