import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderGit2,
  Award,
  FileText,
  Image,
  Briefcase,
  GraduationCap,
  Wrench,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

// Admin sections
import DashboardHome from './sections/DashboardHome';
import ProjectsManager from './sections/ProjectsManager';
import CertificatesManager from './sections/CertificatesManager';
import PostsManager from './sections/PostsManager';
import GalleryManager from './sections/GalleryManager';
import ExperienceManager from './sections/ExperienceManager';
import EducationManager from './sections/EducationManager';
import SkillsManager from './sections/SkillsManager';
import MessagesManager from './sections/MessagesManager';
import SettingsManager from './sections/SettingsManager';

type AdminSection =
  | 'dashboard'
  | 'projects'
  | 'certificates'
  | 'posts'
  | 'gallery'
  | 'experience'
  | 'education'
  | 'skills'
  | 'messages'
  | 'settings';

const menuItems: { id: AdminSection; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
  { id: 'certificates', label: 'Certificates', icon: Award },
  { id: 'posts', label: 'Blog Posts', icon: FileText },
  { id: 'gallery', label: 'Gallery', icon: Image },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'skills', label: 'Skills', icon: Wrench },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('Failed to sign out');
    } else {
      toast.success('Signed out successfully');
      navigate('/admin');
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardHome />;
      case 'projects':
        return <ProjectsManager />;
      case 'certificates':
        return <CertificatesManager />;
      case 'posts':
        return <PostsManager />;
      case 'gallery':
        return <GalleryManager />;
      case 'experience':
        return <ExperienceManager />;
      case 'education':
        return <EducationManager />;
      case 'skills':
        return <SkillsManager />;
      case 'messages':
        return <MessagesManager />;
      case 'settings':
        return <SettingsManager />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="min-h-screen bg-charcoal flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-charcoal-light border-r border-white/5 transform transition-transform duration-300 lg:transform-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/5">
          <a href="/" className="text-xl font-bold text-white">
            Gabriel <span className="text-electric">Myeye</span>
          </a>
          <p className="text-sm text-white/40 mt-1">Admin Panel</p>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === item.id
                  ? 'bg-electric/10 text-electric'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-4 px-4">
            <div className="w-8 h-8 bg-electric/20 rounded-full flex items-center justify-center">
              <span className="text-electric text-sm font-medium">
                {user?.email?.[0].toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{user?.email}</p>
              <p className="text-xs text-white/40">Administrator</p>
            </div>
          </div>
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="w-full border-white/10 text-white/70 hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-charcoal-light border-b border-white/5 flex items-center justify-between px-4 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-white/70 hover:text-white"
          >
            <Menu className="h-6 w-6" />
          </button>

          <h1 className="text-lg font-semibold text-white hidden lg:block">
            {menuItems.find((item) => item.id === activeSection)?.label}
          </h1>

          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/60 hover:text-electric transition-colors"
            >
              View Site →
            </a>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 lg:p-8">
          {renderSection()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
