import { useMemo, useState } from 'react';
import {
  Users,
  Eye,
  TrendingUp,
  TrendingDown,
  MailCheck,
  RefreshCw,
  Download,
  Search,
  Trash2,
  Globe,
  MonitorSmartphone,
  Compass,
  Lightbulb,
  CalendarDays,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { ChartContainer, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import {
  useAnalytics,
  cleanReferrer,
  parseBrowser,
  parseDevice,
  shortSession,
} from '@/hooks/useAnalytics';

const chartConfig: ChartConfig = {
  views: { label: 'Page views', color: '#2A6BFF' },
  uniques: { label: 'Unique visitors', color: '#22c55e' },
};

const PAGE_SIZE = 12;

const formatDateTime = (value?: string) => {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const AnalyticsManager = () => {
  const [rangeDays, setRangeDays] = useState(30);
  const [search, setSearch] = useState('');
  const [pathFilter, setPathFilter] = useState('all');
  const [page, setPage] = useState(0);

  const {
    visitors,
    loading,
    refetch,
    summary,
    daily,
    topPages,
    topReferrers,
    browsers,
    devices,
    insights,
  } = useAnalytics(rangeDays);

  const pathOptions = useMemo(() => {
    const set = new Set(visitors.map((v) => v.path || '/'));
    return ['all', ...Array.from(set).slice(0, 20)];
  }, [visitors]);

  const filteredVisits = useMemo(() => {
    const q = search.trim().toLowerCase();
    return visitors.filter((v) => {
      if (pathFilter !== 'all' && (v.path || '/') !== pathFilter) return false;
      if (!q) return true;
      return (
        (v.path || '').toLowerCase().includes(q) ||
        (v.session_id || '').toLowerCase().includes(q) ||
        (v.referrer || '').toLowerCase().includes(q) ||
        (v.user_agent || '').toLowerCase().includes(q)
      );
    });
  }, [visitors, search, pathFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredVisits.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const pagedVisits = filteredVisits.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  const handleExport = () => {
    if (filteredVisits.length === 0) {
      toast.error('Nothing to export yet');
      return;
    }
    const header = 'visited_at,session_id,path,referrer,user_agent,viewport';
    const escape = (value?: string | null) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const rows = filteredVisits.map((v) =>
      [
        v.visited_at ?? '',
        v.session_id,
        v.path,
        v.referrer ?? '',
        v.user_agent ?? '',
        v.viewport ?? '',
      ]
        .map(escape)
        .join(',')
    );
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `portfolio-visitors-${rangeDays}d.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filteredVisits.length} visits to CSV`);
  };

  const handleDeleteVisit = async (id: string) => {
    if (!confirm('Delete this visit record?')) return;
    try {
      const { error } = await supabase.from('visitors').delete().eq('id', id);
      if (error) throw error;
      toast.success('Visit deleted');
      await refetch();
    } catch (error) {
      console.error('Failed to delete visit:', error);
      toast.error('Failed to delete visit');
    }
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Visitors & Analytics</h2>
          <p className="text-white/60">Understand who views your portfolio and what wins their attention.</p>
        </div>
        <Empty className="bg-charcoal-light border-white/10 border text-white">
          <EmptyHeader>
            <EmptyMedia variant="icon" className="bg-electric/10 text-electric">
              <Users className="h-6 w-6" />
            </EmptyMedia>
            <EmptyTitle className="text-white">Analytics not connected</EmptyTitle>
            <EmptyDescription className="text-white/50">
              Set <span className="font-mono">VITE_SUPABASE_URL</span> and{' '}
              <span className="font-mono">VITE_SUPABASE_ANON_KEY</span> so page views are tracked
              into the <span className="font-mono">visitors</span> table. The dashboard below will
              light up automatically once data arrives.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  const delta = summary.viewsDeltaPct;
  const DeltaBadge = () =>
    delta === null ? (
      <Badge variant="secondary" className="bg-white/5 text-white/60 border-0">new period</Badge>
    ) : delta >= 0 ? (
      <Badge className="bg-green-500/15 text-green-400 border-0">
        <TrendingUp className="h-3 w-3 mr-1" /> +{delta}%
      </Badge>
    ) : (
      <Badge className="bg-red-500/15 text-red-400 border-0">
        <TrendingDown className="h-3 w-3 mr-1" /> {delta}%
      </Badge>
    );

  const kpis = [
    {
      label: `Page views · last ${rangeDays}d`,
      value: loading ? '—' : summary.rangeViews.toLocaleString(),
      sub: `All-time ${summary.totalViews.toLocaleString()} · avg ${summary.avgPerDay}/day`,
      icon: Eye,
      badge: <DeltaBadge />,
    },
    {
      label: `Unique visitors · last ${rangeDays}d`,
      value: loading ? '—' : summary.rangeUniques.toLocaleString(),
      sub: `All-time ${summary.totalUniques.toLocaleString()} · ${summary.returningRatePct}% returning`,
      icon: Users,
      badge: (
        <Badge variant="secondary" className="bg-electric/10 text-electric border-0">
          {summary.returningRatePct}% returning
        </Badge>
      ),
    },
    {
      label: 'Today',
      value: loading ? '—' : summary.todayViews.toLocaleString(),
      sub: `${summary.todayUniques} unique sessions today`,
      icon: CalendarDays,
      badge: (
        <Badge variant="secondary" className="bg-white/5 text-white/60 border-0">
          live
        </Badge>
      ),
    },
    {
      label: 'Contact conversion',
      value: loading ? '—' : `${summary.contactConversionPct}%`,
      sub: 'Messages per 100 unique visitors in range',
      icon: MailCheck,
      badge: (
        <Badge
          className={
            summary.contactConversionPct >= 2
              ? 'bg-green-500/15 text-green-400 border-0'
              : 'bg-amber-500/15 text-amber-400 border-0'
          }
        >
          {summary.contactConversionPct >= 2 ? 'healthy' : 'needs CTA'}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Visitors & Analytics</h2>
          <p className="text-white/60">
            Recruiter-grade insight: traffic trend, winning pages, channels, devices and every visit.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={String(rangeDays)} onValueChange={(v) => setRangeDays(Number(v))}>
            <SelectTrigger className="w-[150px] bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="14">Last 14 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="border-white/10 text-white/70 hover:bg-white/5 hover:text-white"
            onClick={() => void refetch()}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-electric hover:bg-electric-dark text-white" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="bg-charcoal-light border-white/5 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white/60">{kpi.label}</CardTitle>
              <kpi.icon className="h-4 w-4 text-electric" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold mb-1">{kpi.value}</p>
              <p className="text-xs text-white/40 mb-3">{kpi.sub}</p>
              {kpi.badge}
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-charcoal-light border border-white/5 text-white/60">
          <TabsTrigger value="overview" className="data-[state=active]:bg-electric data-[state=active]:text-white">
            Overview
          </TabsTrigger>
          <TabsTrigger value="pages" className="data-[state=active]:bg-electric data-[state=active]:text-white">
            Top pages
          </TabsTrigger>
          <TabsTrigger value="audience" className="data-[state=active]:bg-electric data-[state=active]:text-white">
            Audience
          </TabsTrigger>
          <TabsTrigger value="visits" className="data-[state=active]:bg-electric data-[state=active]:text-white">
            Visit log
          </TabsTrigger>
        </TabsList>

        {/* OVERVIEW */}
        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <Card className="xl:col-span-2 bg-charcoal-light border-white/5 text-white">
              <CardHeader>
                <CardTitle className="text-white">Traffic trend</CardTitle>
                <CardDescription className="text-white/40">
                  Daily page views vs unique sessions · last {rangeDays} days
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-white/40 text-sm py-12 text-center">Loading chart…</p>
                ) : summary.rangeViews === 0 ? (
                  <p className="text-white/40 text-sm py-12 text-center">
                    No visits in this range yet — share your portfolio link on LinkedIn to seed data.
                  </p>
                ) : (
                  <ChartContainer config={chartConfig} className="h-[280px] w-full">
                    <AreaChart data={daily} margin={{ left: -16, right: 8, top: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                      <XAxis dataKey="label" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} interval="preserveStartEnd" />
                      <YAxis tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} allowDecimals={false} />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Area type="monotone" dataKey="views" stroke="#2A6BFF" fill="#2A6BFF" fillOpacity={0.25} strokeWidth={2} />
                      <Area type="monotone" dataKey="uniques" stroke="#22c55e" fill="#22c55e" fillOpacity={0.15} strokeWidth={2} />
                    </AreaChart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-b from-electric/15 to-charcoal-light border-electric/20 text-white">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-electric" />
                  Recruiter insights
                </CardTitle>
                <CardDescription className="text-white/50">
                  Auto-generated from your traffic — act on one per week.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {insights.map((insight, i) => (
                  <div key={i} className="flex gap-3 p-3 bg-black/20 rounded-lg border border-white/5">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-electric/20 text-electric text-xs font-bold">
                      {i + 1}
                    </span>
                    <p className="text-sm text-white/75 leading-relaxed">{insight}</p>
                  </div>
                ))}
                <div className="pt-1 text-xs text-white/40">
                  Star page right now: <span className="text-electric font-mono">{summary.topPage}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-charcoal-light border-white/5 text-white">
            <CardHeader>
              <CardTitle className="text-white">Winning pages in range</CardTitle>
              <CardDescription className="text-white/40">Where attention concentrates — double down on these topics.</CardDescription>
            </CardHeader>
            <CardContent>
              {topPages.length === 0 ? (
                <p className="text-white/40 text-sm">No page data yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={topPages.slice(0, 6)} layout="vertical" margin={{ left: 8, right: 24 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} allowDecimals={false} />
                    <YAxis type="category" dataKey="name" width={110} tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ background: '#141414', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }}
                    />
                    <Bar dataKey="views" fill="#2A6BFF" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* PAGES */}
        <TabsContent value="pages" className="mt-4">
          <Card className="bg-charcoal-light border-white/5 text-white">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Compass className="h-5 w-5 text-electric" /> Top pages
              </CardTitle>
              <CardDescription className="text-white/40">
                `/` is your hero, `/cv` means hiring intent — a spike there deserves a fast follow-up on messages.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-white/50">Page</TableHead>
                    <TableHead className="text-white/50 text-right">Views</TableHead>
                    <TableHead className="text-white/50 text-right">Uniques</TableHead>
                    <TableHead className="text-white/50 w-[220px]">Share</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topPages.map((p) => (
                    <TableRow key={p.name} className="border-white/5">
                      <TableCell>
                        <Badge variant="secondary" className="bg-white/5 text-electric border-0 font-mono">
                          {p.name}
                        </Badge>
                        {p.name === '/cv' && (
                          <Badge className="ml-2 bg-green-500/15 text-green-400 border-0">hiring intent</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right text-white font-semibold">{p.views}</TableCell>
                      <TableCell className="text-right text-white/60">{p.uniques}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={p.share} className="bg-white/10" />
                          <span className="text-xs text-white/50 w-10 text-right">{p.share}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {topPages.length === 0 && (
                    <TableRow className="border-white/5">
                      <TableCell colSpan={4} className="text-center text-white/40 py-8">
                        No page views in this range.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AUDIENCE */}
        <TabsContent value="audience" className="mt-4">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <Card className="bg-charcoal-light border-white/5 text-white">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Globe className="h-5 w-5 text-electric" /> Channels
                </CardTitle>
                <CardDescription className="text-white/40">Where recruiters find you.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {topReferrers.map((r) => (
                  <div key={r.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/80 truncate">{r.name}</span>
                      <span className="text-white/40">{r.views} · {r.share}%</span>
                    </div>
                    <Progress value={r.share} className="bg-white/10" />
                  </div>
                ))}
                {topReferrers.length === 0 && <p className="text-white/40 text-sm">No referrer data yet.</p>}
                <p className="text-xs text-white/30 pt-2">
                  Tip: post with <span className="font-mono">?utm_source=linkedin</span> to separate LinkedIn from direct traffic.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-charcoal-light border-white/5 text-white">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MonitorSmartphone className="h-5 w-5 text-electric" /> Devices
                </CardTitle>
                <CardDescription className="text-white/40">Parsed from viewport size.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {devices.map((d) => (
                  <div key={d.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/80">{d.name}</span>
                      <span className="text-white/40">{d.views} · {d.share}%</span>
                    </div>
                    <Progress value={d.share} className="bg-white/10" />
                  </div>
                ))}
                {devices.length === 0 && <p className="text-white/40 text-sm">No device data yet.</p>}
              </CardContent>
            </Card>

            <Card className="bg-charcoal-light border-white/5 text-white">
              <CardHeader>
                <CardTitle className="text-white">Browsers</CardTitle>
                <CardDescription className="text-white/40">Parsed from user-agent.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {browsers.map((b) => (
                  <div key={b.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/80">{b.name}</span>
                      <span className="text-white/40">{b.views} · {b.share}%</span>
                    </div>
                    <Progress value={b.share} className="bg-white/10" />
                  </div>
                ))}
                {browsers.length === 0 && <p className="text-white/40 text-sm">No browser data yet.</p>}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* VISIT LOG */}
        <TabsContent value="visits" className="mt-4">
          <Card className="bg-charcoal-light border-white/5 text-white">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <CardTitle className="text-white">Visit log ({filteredVisits.length})</CardTitle>
                  <CardDescription className="text-white/40">Every tracked page view — search, filter, audit, export.</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                    <Input
                      value={search}
                      onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                      placeholder="Search path, session, referrer…"
                      className="pl-9 w-full sm:w-64 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    />
                  </div>
                  <Select value={pathFilter} onValueChange={(v) => { setPathFilter(v); setPage(0); }}>
                    <SelectTrigger className="w-full sm:w-[160px] bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Page" />
                    </SelectTrigger>
                    <SelectContent>
                      {pathOptions.map((p) => (
                        <SelectItem key={p} value={p}>{p === 'all' ? 'All pages' : p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-white/50">When</TableHead>
                    <TableHead className="text-white/50">Session</TableHead>
                    <TableHead className="text-white/50">Page</TableHead>
                    <TableHead className="text-white/50">Referrer</TableHead>
                    <TableHead className="text-white/50">Device · Browser</TableHead>
                    <TableHead className="text-white/50 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagedVisits.map((v) => (
                    <TableRow key={v.id} className="border-white/5">
                      <TableCell className="text-white/60 text-xs whitespace-nowrap">{formatDateTime(v.visited_at)}</TableCell>
                      <TableCell className="text-white/70 font-mono text-xs" title={v.session_id}>
                        {shortSession(v.session_id)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-electric/10 text-electric border-0 font-mono">{v.path}</Badge>
                      </TableCell>
                      <TableCell className="text-white/60 text-xs max-w-[180px] truncate" title={v.referrer ?? ''}>
                        {cleanReferrer(v.referrer)}
                      </TableCell>
                      <TableCell className="text-white/60 text-xs">
                        {parseDevice(v.viewport)} · {parseBrowser(v.user_agent)}
                        <span className="block text-white/30 font-mono">{v.viewport ?? ''}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white/30 hover:text-red-400 hover:bg-red-500/10"
                          onClick={() => void handleDeleteVisit(v.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {pagedVisits.length === 0 && (
                    <TableRow className="border-white/5">
                      <TableCell colSpan={6} className="text-center text-white/40 py-8">
                        {loading ? 'Loading visits…' : 'No visits match your filters.'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between mt-4">
                <p className="text-xs text-white/40">
                  Page {safePage + 1} of {pageCount} · {filteredVisits.length} records
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/10 text-white/70"
                    disabled={safePage === 0}
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/10 text-white/70"
                    disabled={safePage >= pageCount - 1}
                    onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsManager;
