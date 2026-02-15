import { type ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, EyeOff, Upload } from 'lucide-react';
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
import { supabase } from '@/lib/supabase';

type ProjectFormValues = {
  title: string;
  slug: string;
  summary: string;
  content: string;
  problem: string;
  approach: string;
  outcomes: string;
  tools: string;
  tags: string;
  featured: boolean;
  project_url: string;
  github_url: string;
  start_date: string;
  end_date: string;
  cover_url: string;
  status: 'draft' | 'published';
};

const defaultFormValues: ProjectFormValues = {
  title: '',
  slug: '',
  summary: '',
  content: '',
  problem: '',
  approach: '',
  outcomes: '',
  tools: '',
  tags: '',
  featured: false,
  project_url: '',
  github_url: '',
  start_date: '',
  end_date: '',
  cover_url: '',
  status: 'draft',
};

const parseList = (value: string) =>
  value
    .split(',')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);

const mapProjectToForm = (project: Project | null, coverUrl = ''): ProjectFormValues => {
  if (!project) return defaultFormValues;
  return {
    title: project.title ?? '',
    slug: project.slug ?? '',
    summary: project.summary ?? '',
    content: project.content ?? '',
    problem: project.problem ?? '',
    approach: project.approach ?? '',
    outcomes: project.outcomes ?? '',
    tools: (project.tools ?? []).join(', '),
    tags: (project.tags ?? []).join(', '),
    featured: Boolean(project.featured),
    project_url: project.project_url ?? '',
    github_url: project.github_url ?? '',
    start_date: project.start_date ?? '',
    end_date: project.end_date ?? '',
    cover_url: coverUrl,
    status: project.status,
  };
};

const ProjectsManager = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectCovers, setProjectCovers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      const projectsData = (data ?? []) as Project[];
      setProjects(projectsData);

      const { data: mediaData, error: mediaError } = await supabase
        .from('project_media')
        .select('project_id, image_url, order')
        .order('order', { ascending: true });
      if (mediaError) throw mediaError;

      const covers: Record<string, string> = {};
      (mediaData ?? []).forEach((entry: { project_id: string; image_url: string }) => {
        if (!covers[entry.project_id] && entry.image_url) {
          covers[entry.project_id] = entry.image_url;
        }
      });
      setProjectCovers(covers);
    } catch (error) {
      console.error('Failed to load projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  const filteredProjects = useMemo(
    () =>
      projects.filter(
        (project) =>
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (project.tags ?? []).some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      ),
    [projects, searchQuery]
  );

  const upsertProjectCover = useCallback(async (projectId: string, coverUrl: string) => {
    const normalizedCoverUrl = coverUrl.trim();

    const { error: deleteError } = await supabase
      .from('project_media')
      .delete()
      .eq('project_id', projectId)
      .eq('order', 0);
    if (deleteError) throw deleteError;

    if (normalizedCoverUrl) {
      const { error: insertError } = await supabase.from('project_media').insert({
        project_id: projectId,
        image_url: normalizedCoverUrl,
        caption: 'Cover image',
        order: 0,
      });
      if (insertError) throw insertError;
    }

    setProjectCovers((prev) => {
      if (!normalizedCoverUrl) {
        const next = { ...prev };
        delete next[projectId];
        return next;
      }
      return { ...prev, [projectId]: normalizedCoverUrl };
    });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;

      setProjects((prev) => prev.filter((project) => project.id !== id));
      setProjectCovers((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      toast.success('Project deleted successfully');
    } catch (error) {
      console.error('Failed to delete project:', error);
      toast.error('Failed to delete project');
    }
  };

  const handleToggleStatus = async (project: Project) => {
    const nextStatus = project.status === 'published' ? 'draft' : 'published';
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({ status: nextStatus })
        .eq('id', project.id)
        .select('*')
        .single();

      if (error) throw error;

      setProjects((prev) =>
        prev.map((entry) => (entry.id === project.id ? (data as Project) : entry))
      );
      toast.success('Status updated');
    } catch (error) {
      console.error('Failed to update project status:', error);
      toast.error('Failed to update project status');
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingProject(null);
    setIsDialogOpen(true);
  };

  const handleSave = async (formValues: ProjectFormValues) => {
    setIsSaving(true);
    try {
      const payload = {
        title: formValues.title.trim(),
        slug: formValues.slug.trim(),
        summary: formValues.summary.trim(),
        content: formValues.content.trim(),
        problem: formValues.problem.trim() || null,
        approach: formValues.approach.trim() || null,
        outcomes: formValues.outcomes.trim() || null,
        tools: parseList(formValues.tools),
        tags: parseList(formValues.tags),
        featured: formValues.featured,
        project_url: formValues.project_url.trim() || null,
        github_url: formValues.github_url.trim() || null,
        start_date: formValues.start_date || null,
        end_date: formValues.end_date || null,
        status: formValues.status,
      };

      let savedProject: Project;
      if (editingProject) {
        const { data, error } = await supabase
          .from('projects')
          .update(payload)
          .eq('id', editingProject.id)
          .select('*')
          .single();

        if (error) throw error;

        savedProject = data as Project;
        await upsertProjectCover(savedProject.id, formValues.cover_url);

        setProjects((prev) =>
          prev.map((project) =>
            project.id === editingProject.id ? savedProject : project
          )
        );
        toast.success('Project updated');
      } else {
        const { data, error } = await supabase
          .from('projects')
          .insert(payload)
          .select('*')
          .single();

        if (error) throw error;

        savedProject = data as Project;
        await upsertProjectCover(savedProject.id, formValues.cover_url);

        setProjects((prev) => [savedProject, ...prev]);
        toast.success('Project created');
      }

      setIsDialogOpen(false);
      setEditingProject(null);
    } catch (error) {
      console.error('Failed to save project:', error);
      toast.error('Failed to save project. Check title/slug uniqueness.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
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

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search projects..."
          className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
        />
      </div>

      {loading ? (
        <div className="text-white/60">Loading projects...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-charcoal-light border border-white/5 rounded-xl p-6 group hover:border-white/10 transition-colors"
            >
              {projectCovers[project.id] && (
                <div className="mb-4 overflow-hidden rounded-lg border border-white/10 aspect-video">
                  <img
                    src={projectCovers[project.id]}
                    alt={`${project.title} cover`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}

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
                {(project.tags ?? []).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-white/5 text-white/70 border-0 text-xs"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleToggleStatus(project)}
                  className={`flex items-center gap-1 text-sm ${
                    project.status === 'published' ? 'text-green-400' : 'text-white/40'
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
      )}

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setEditingProject(null);
          }
          setIsDialogOpen(open);
        }}
      >
        <DialogContent className="max-w-2xl bg-charcoal-light border-white/10 text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
          </DialogHeader>
          <ProjectForm
            initialValues={mapProjectToForm(
              editingProject,
              editingProject ? projectCovers[editingProject.id] ?? '' : ''
            )}
            saving={isSaving}
            onSave={handleSave}
            onCancel={() => {
              setIsDialogOpen(false);
              setEditingProject(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface ProjectFormProps {
  initialValues: ProjectFormValues;
  saving: boolean;
  onSave: (values: ProjectFormValues) => Promise<void>;
  onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  initialValues,
  saving,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<ProjectFormValues>(initialValues);
  const [uploadingCover, setUploadingCover] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormData(initialValues);
  }, [initialValues]);

  const handleCoverUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file.');
      event.target.value = '';
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      toast.error('Image is too large. Maximum size is 8MB.');
      event.target.value = '';
      return;
    }

    setUploadingCover(true);
    try {
      const safeName = file.name.toLowerCase().replace(/[^a-z0-9.\-_]/g, '-');
      const filePath = `projects/cover-${Date.now()}-${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-media')
        .upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('portfolio-media').getPublicUrl(filePath);
      setFormData((prev) => ({ ...prev, cover_url: data.publicUrl }));
      toast.success('Cover image uploaded');
    } catch (error) {
      console.error('Failed to upload project cover:', error);
      toast.error('Failed to upload cover image');
    } finally {
      setUploadingCover(false);
      event.target.value = '';
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-white/60 mb-2">Title</label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            className="bg-white/5 border-white/10 text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-2">Slug</label>
          <Input
            value={formData.slug}
            onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
            className="bg-white/5 border-white/10 text-white"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-white/60 mb-2">Summary</label>
        <Input
          value={formData.summary}
          onChange={(e) => setFormData((prev) => ({ ...prev, summary: e.target.value }))}
          className="bg-white/5 border-white/10 text-white"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-white/60 mb-2">Content</label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white min-h-[100px]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-white/60 mb-2">Problem</label>
          <textarea
            value={formData.problem}
            onChange={(e) => setFormData((prev) => ({ ...prev, problem: e.target.value }))}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white min-h-[80px]"
          />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-2">Approach</label>
          <textarea
            value={formData.approach}
            onChange={(e) => setFormData((prev) => ({ ...prev, approach: e.target.value }))}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white min-h-[80px]"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-white/60 mb-2">Outcomes</label>
        <textarea
          value={formData.outcomes}
          onChange={(e) => setFormData((prev) => ({ ...prev, outcomes: e.target.value }))}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white min-h-[80px]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-white/60 mb-2">Tools (comma-separated)</label>
          <Input
            value={formData.tools}
            onChange={(e) => setFormData((prev) => ({ ...prev, tools: e.target.value }))}
            className="bg-white/5 border-white/10 text-white"
            placeholder="Python, React, PostgreSQL"
          />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-2">Tags (comma-separated)</label>
          <Input
            value={formData.tags}
            onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
            className="bg-white/5 border-white/10 text-white"
            placeholder="Data Analytics, Healthcare"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-white/60 mb-2">Start Date</label>
          <Input
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData((prev) => ({ ...prev, start_date: e.target.value }))}
            className="bg-white/5 border-white/10 text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-2">End Date</label>
          <Input
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData((prev) => ({ ...prev, end_date: e.target.value }))}
            className="bg-white/5 border-white/10 text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-white/60 mb-2">Project URL</label>
          <Input
            value={formData.project_url}
            onChange={(e) => setFormData((prev) => ({ ...prev, project_url: e.target.value }))}
            className="bg-white/5 border-white/10 text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-2">GitHub URL</label>
          <Input
            value={formData.github_url}
            onChange={(e) => setFormData((prev) => ({ ...prev, github_url: e.target.value }))}
            className="bg-white/5 border-white/10 text-white"
          />
        </div>
      </div>

      <input
        ref={coverInputRef}
        type="file"
        accept="image/*"
        onChange={handleCoverUpload}
        className="hidden"
      />

      <div>
        <label className="block text-sm text-white/60 mb-2">Cover Image URL</label>
        <div className="flex flex-col md:flex-row gap-3">
          <Input
            value={formData.cover_url}
            onChange={(e) => setFormData((prev) => ({ ...prev, cover_url: e.target.value }))}
            className="bg-white/5 border-white/10 text-white"
            placeholder="https://..."
          />
          <Button
            type="button"
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
            onClick={() => coverInputRef.current?.click()}
            disabled={uploadingCover}
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploadingCover ? 'Uploading...' : 'Upload Cover'}
          </Button>
        </div>

        {formData.cover_url && (
          <div className="mt-3 rounded-lg overflow-hidden border border-white/10 aspect-video">
            <img
              src={formData.cover_url}
              alt="Project cover preview"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))}
            className="w-4 h-4 rounded border-white/20 bg-white/5"
          />
          <span className="text-sm text-white/60">Featured</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.status === 'published'}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, status: e.target.checked ? 'published' : 'draft' }))
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
        <Button type="submit" className="bg-electric hover:bg-electric-dark" disabled={saving}>
          {saving ? 'Saving...' : 'Save Project'}
        </Button>
      </div>
    </form>
  );
};

export default ProjectsManager;
