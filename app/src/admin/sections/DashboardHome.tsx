import { useMemo } from 'react';
import {
  FolderGit2,
  Award,
  FileText,
  Image,
  Settings,
  MessageSquare,
  TrendingUp,
  Users,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { useContactMessages, useStats, useVisitorStats } from '../../hooks/useData';
import { Button } from '@/components/ui/button';

interface QuickStat {
  label: string;
  value: number | string;
  icon: React.ElementType;
  change?: string;
  color: string;
}

type DashboardSection =
  | 'projects'
  | 'certificates'
  | 'posts'
  | 'gallery'
  | 'messages'
  | 'settings';

interface DashboardHomeProps {
  onNavigate: (section: DashboardSection) => void;
  onSyncSampleContent: () => Promise<void>;
  syncingSampleContent: boolean;
}

const DashboardHome = ({
  onNavigate,
  onSyncSampleContent,
  syncingSampleContent,
}: DashboardHomeProps) => {
  const { stats, loading } = useStats();
  const { data: messages } = useContactMessages();
  const { stats: visitorStats, loading: visitorLoading } = useVisitorStats();

  const unreadMessages = useMemo(
    () => messages.filter((message) => !message.read).length,
    [messages]
  );

  const quickStats = useMemo<QuickStat[]>(
    () => [
      { label: 'Total Projects', value: stats.projectsCount, icon: FolderGit2, change: '+2 this month', color: 'from-blue-500/20 to-cyan-500/20' },
      { label: 'Certificates', value: stats.certificatesCount, icon: Award, change: '+1 this month', color: 'from-green-500/20 to-emerald-500/20' },
      { label: 'Unread Messages', value: unreadMessages, icon: MessageSquare, change: 'Contact inbox', color: 'from-purple-500/20 to-pink-500/20' },
      { label: 'Unique Visitors', value: visitorStats.uniqueVisitors, icon: Users, change: 'All-time sessions', color: 'from-orange-500/20 to-amber-500/20' },
    ],
    [stats.projectsCount, stats.certificatesCount, unreadMessages, visitorStats.uniqueVisitors]
  );

  const recentActivity = [
    { action: 'New project added', item: 'Health Data Analytics Platform', time: '2 hours ago' },
    { action: 'Certificate updated', item: 'AWS Solutions Architect', time: '1 day ago' },
    { action: 'Blog post published', item: 'The Future of Digital Health', time: '2 days ago' },
    { action: 'New message received', item: 'From John Doe', time: '3 days ago' },
  ];

  const quickActions: Array<{ label: string; icon: React.ElementType; section: DashboardSection }> = [
    { label: 'Add Project', icon: FolderGit2, section: 'projects' },
    { label: 'Add Certificate', icon: Award, section: 'certificates' },
    { label: 'New Blog Post', icon: FileText, section: 'posts' },
    { label: 'Upload Image', icon: Image, section: 'gallery' },
    { label: 'View Messages', icon: MessageSquare, section: 'messages' },
    { label: 'Settings', icon: Settings, section: 'settings' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Welcome back! 👋</h2>
        <p className="text-white/60">
          Here's what's happening with your portfolio today.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <div
            key={index}
            className="relative p-6 bg-charcoal border border-white/5 rounded-xl overflow-hidden group hover:border-white/10 transition-colors"
          >
            {/* Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-white/5 rounded-lg">
                  <stat.icon className="h-5 w-5 text-electric" />
                </div>
                {stat.change && (
                  <span className="text-xs text-green-400 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {stat.change}
                  </span>
                )}
              </div>
              <p className="text-3xl font-bold text-white mb-1">
                {loading || visitorLoading ? '-' : stat.value}
              </p>
              <p className="text-sm text-white/60">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-charcoal-light border border-white/5 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 bg-white/[0.02] rounded-lg"
              >
                <div className="w-2 h-2 bg-electric rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-white text-sm">{activity.action}</p>
                  <p className="text-electric text-sm">{activity.item}</p>
                  <p className="text-white/40 text-xs mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-charcoal-light border border-white/5 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => onNavigate(action.section)}
                className="flex flex-col items-center gap-3 p-6 bg-white/[0.02] rounded-lg hover:bg-white/5 transition-colors group"
              >
                <action.icon className="h-6 w-6 text-electric group-hover:scale-110 transition-transform" />
                <span className="text-sm text-white/70">{action.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.02] p-4">
            <p className="text-sm text-white/70 mb-2">Sync Frontend Sample Data</p>
            <p className="text-xs text-white/50 mb-4">
              Imports hardcoded frontend samples into Supabase so they can be edited in the dashboard.
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
        </div>
      </div>

      {/* Performance Overview */}
      <div className="bg-charcoal-light border border-white/5 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Portfolio Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-electric/10 rounded-full mb-4">
              <Users className="h-8 w-8 text-electric" />
            </div>
            <p className="text-2xl font-bold text-white mb-1">
              {visitorLoading ? '-' : visitorStats.totalPageViews}
            </p>
            <p className="text-sm text-white/60">Total Profile Views</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-full mb-4">
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-white mb-1">
              {visitorLoading ? '-' : visitorStats.todayUniqueVisitors}
            </p>
            <p className="text-sm text-white/60">Unique Visitors Today</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/10 rounded-full mb-4">
              <Eye className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-white mb-1">
              {visitorLoading ? '-' : visitorStats.todayPageViews}
            </p>
            <p className="text-sm text-white/60">Page Views Today</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
