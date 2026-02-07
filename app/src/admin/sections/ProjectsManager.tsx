import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import type { Project } from '../../types';

// Sample projects (will be replaced with Supabase data)
const sampleProjects: Project[] = [
  {
    id: '1',
    title: 'Health Data Analytics Platform',
    slug: 'health-data-analytics',
    summary: 'A comprehensive analytics platform for visualizing healthcare data.',
    content: 'Full project description...',
    tools: ['Python', 'PostgreSQL', 'React', 'TensorFlow'],
    tags: ['Data Analytics', 'Healthcare', 'AI/ML'],
    featured: true,
    status: 'published',
    created_at: '2023-01-01',
  },
  {
    id: '2',
    title: 'Predictive Disease Modeling',
    slug: 'predictive-disease-modeling',
    summary: 'ML models for predicting disease outbreaks and readmission risks.',
    content: 'Full project description...',
    tools: ['Python', 'Scikit-learn', 'Pandas'],
    tags: ['Machine Learning', 'Predictive Analytics'],
    featured: true,
    status: 'published',
    created_at: '2023-03-01',
  },
  {
    id: '3',
    title: 'Clinical Database Optimization',
    slug: 'clinical-database-optimization',
    summary: 'Redesigned and optimized clinical database system.',
    content: 'Full project description...',
    tools: ['PostgreSQL', 'Redis', 'Python'],
    tags: ['Database', 'SQL', 'Optimization'],
    featured: false,
    status: 'published',
    created_at: '2023-06-01',
  },
];

const ProjectsManager = () => {
  const [projects, setProjects] = useState<Project[]>(sampleProjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter((p) => p.id !== id));
      toast.success('Project deleted successfully');
    }
  };

  const handleToggleStatus = (id: string) => {
    setProjects(
      projects.map((p) =>
        p.id === id
          ? { ...p, status: p.status === 'published' ? 'draft' : 'published' }
          : p
      )
    );
    toast.success('Status updated');
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingProject(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Projects</h2>
          <p className="text-white/60">Manage your portfolio projects</p>
        </div>
        <Button onClick={handleAdd} className="bg-electric hover:bg-electric-dark">
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search projects..."
          className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
        />
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-charcoal-light border border-white/5 rounded-xl p-6 group hover:border-white/10 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-white mb-1">{project.title}</h3>
                <p className="text-sm text-white/60 line-clamp-2">{project.summary}</p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleEdit(project)}
                  className="p-2 text-white/40 hover:text-electric transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="p-2 text-white/40 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags.map((tag, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="bg-white/5 text-white/70 border-0 text-xs"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => handleToggleStatus(project.id)}
                className={`flex items-center gap-1 text-sm ${
                  project.status === 'published'
                    ? 'text-green-400'
                    : 'text-white/40'
                }`}
              >
                {project.status === 'published' ? (
                  <>
                    <Eye className="h-4 w-4" />
                    Published
                  </>
                ) : (
                  <>
                    <EyeOff className="h-4 w-4" />
                    Draft
                  </>
                )}
              </button>
              {project.featured && (
                <Badge className="bg-electric/20 text-electric border-0 text-xs">
                  Featured
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl bg-charcoal-light border-white/10 text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? 'Edit Project' : 'Add New Project'}
            </DialogTitle>
          </DialogHeader>
          <ProjectForm
            project={editingProject}
            onSave={() => {
              setIsDialogOpen(false);
              toast.success(editingProject ? 'Project updated' : 'Project created');
            }}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Project Form Component
interface ProjectFormProps {
  project: Project | null;
  onSave: () => void;
  onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    slug: project?.slug || '',
    summary: project?.summary || '',
    content: project?.content || '',
    problem: project?.problem || '',
    approach: project?.approach || '',
    outcomes: project?.outcomes || '',
    tools: project?.tools?.join(', ') || '',
    tags: project?.tags?.join(', ') || '',
    featured: project?.featured || false,
    project_url: project?.project_url || '',
    github_url: project?.github_url || '',
    status: project?.status || 'draft',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-white/60 mb-2">Title</label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="bg-white/5 border-white/10 text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-2">Slug</label>
          <Input
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="bg-white/5 border-white/10 text-white"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-white/60 mb-2">Summary</label>
        <Input
          value={formData.summary}
          onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
          className="bg-white/5 border-white/10 text-white"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-white/60 mb-2">Content</label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white min-h-[100px]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-white/60 mb-2">Tools (comma-separated)</label>
          <Input
            value={formData.tools}
            onChange={(e) => setFormData({ ...formData, tools: e.target.value })}
            className="bg-white/5 border-white/10 text-white"
            placeholder="Python, React, PostgreSQL"
          />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-2">Tags (comma-separated)</label>
          <Input
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="bg-white/5 border-white/10 text-white"
            placeholder="Data Analytics, Healthcare"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-white/60 mb-2">Project URL</label>
          <Input
            value={formData.project_url}
            onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
            className="bg-white/5 border-white/10 text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-2">GitHub URL</label>
          <Input
            value={formData.github_url}
            onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
            className="bg-white/5 border-white/10 text-white"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="w-4 h-4 rounded border-white/20 bg-white/5"
          />
          <span className="text-sm text-white/60">Featured</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.status === 'published'}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.checked ? 'published' : 'draft' })
            }
            className="w-4 h-4 rounded border-white/20 bg-white/5"
          />
          <span className="text-sm text-white/60">Published</span>
        </label>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-electric hover:bg-electric-dark">
          {project ? 'Update' : 'Create'} Project
        </Button>
      </div>
    </form>
  );
};

export default ProjectsManager;
