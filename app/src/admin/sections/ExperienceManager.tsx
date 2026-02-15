import { useCallback, useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import type { Experience } from '../../types';
import { supabase } from '@/lib/supabase';

type ExperienceFormValues = {
  title: string;
  organization: string;
  location: string;
  start_date: string;
  end_date: string;
  current: boolean;
  description: string;
  highlights: string;
  order: string;
};

const defaultFormValues: ExperienceFormValues = {
  title: '',
  organization: '',
  location: '',
  start_date: '',
  end_date: '',
  current: false,
  description: '',
  highlights: '',
  order: '',
};

const mapExperienceToForm = (item: Experience | null): ExperienceFormValues => {
  if (!item) return defaultFormValues;
  return {
    title: item.title ?? '',
    organization: item.organization ?? '',
    location: item.location ?? '',
    start_date: item.start_date ?? '',
    end_date: item.end_date ?? '',
    current: Boolean(item.current),
    description: item.description ?? '',
    highlights: (item.highlights ?? []).join('\n'),
    order: item.order.toString(),
  };
};

const ExperienceManager = () => {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<Experience | null>(null);

  const loadExperience = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('experience')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;
      setExperience((data ?? []) as Experience[]);
    } catch (error) {
      console.error('Failed to load experience:', error);
      toast.error('Failed to load experience');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadExperience();
  }, [loadExperience]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience item?')) return;

    try {
      const { error } = await supabase.from('experience').delete().eq('id', id);
      if (error) throw error;

      setExperience((prev) => prev.filter((item) => item.id !== id));
      toast.success('Experience deleted');
    } catch (error) {
      console.error('Failed to delete experience:', error);
      toast.error('Failed to delete experience');
    }
  };

  const handleSave = async (formValues: ExperienceFormValues) => {
    setIsSaving(true);
    try {
      const payload = {
        title: formValues.title.trim(),
        organization: formValues.organization.trim(),
        location: formValues.location.trim() || null,
        start_date: formValues.start_date,
        end_date: formValues.current ? null : formValues.end_date || null,
        current: formValues.current,
        description: formValues.description.trim(),
        highlights: formValues.highlights
          .split('\n')
          .map((entry) => entry.trim())
          .filter((entry) => entry.length > 0),
        order: formValues.order ? Number(formValues.order) : 0,
      };

      if (editingItem) {
        const { data, error } = await supabase
          .from('experience')
          .update(payload)
          .eq('id', editingItem.id)
          .select('*')
          .single();
        if (error) throw error;

        setExperience((prev) =>
          prev
            .map((item) => (item.id === editingItem.id ? (data as Experience) : item))
            .sort((a, b) => a.order - b.order)
        );
        toast.success('Experience updated');
      } else {
        const { data, error } = await supabase
          .from('experience')
          .insert(payload)
          .select('*')
          .single();
        if (error) throw error;

        setExperience((prev) => [...prev, data as Experience].sort((a, b) => a.order - b.order));
        toast.success('Experience created');
      }

      setIsDialogOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Failed to save experience:', error);
      toast.error('Failed to save experience');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Experience</h2>
          <p className="text-white/60">Manage your work experience timeline</p>
        </div>
        <Button
          onClick={() => {
            setEditingItem(null);
            setIsDialogOpen(true);
          }}
          className="bg-electric hover:bg-electric-dark"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {loading ? (
        <div className="text-white/60">Loading experience...</div>
      ) : (
        <div className="space-y-4">
          {experience.map((item) => (
            <div
              key={item.id}
              className="bg-charcoal-light border border-white/5 rounded-xl p-6 group hover:border-white/10 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-electric/10 rounded-lg">
                    <Briefcase className="h-4 w-4 text-electric" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    <p className="text-sm text-electric">{item.organization}</p>
                    <p className="text-xs text-white/40 mt-1">
                      {item.start_date} - {item.current ? 'Present' : item.end_date || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setEditingItem(item);
                      setIsDialogOpen(true);
                    }}
                    className="p-2 text-white/40 hover:text-electric transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => void handleDelete(item.id)}
                    className="p-2 text-white/40 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-white/70 mb-3">{item.description}</p>
              {(item.highlights ?? []).length > 0 && (
                <ul className="space-y-1">
                  {(item.highlights ?? []).map((highlight, index) => (
                    <li key={index} className="text-xs text-white/50">
                      - {highlight}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open) setEditingItem(null);
          setIsDialogOpen(open);
        }}
      >
        <DialogContent className="max-w-2xl bg-charcoal-light border-white/10 text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Experience' : 'Add Experience'}</DialogTitle>
          </DialogHeader>
          <ExperienceForm
            initialValues={mapExperienceToForm(editingItem)}
            saving={isSaving}
            onSave={handleSave}
            onCancel={() => {
              setIsDialogOpen(false);
              setEditingItem(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface ExperienceFormProps {
  initialValues: ExperienceFormValues;
  saving: boolean;
  onSave: (values: ExperienceFormValues) => Promise<void>;
  onCancel: () => void;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({
  initialValues,
  saving,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<ExperienceFormValues>(initialValues);

  useEffect(() => {
    setFormData(initialValues);
  }, [initialValues]);

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
          <label className="block text-sm text-white/60 mb-2">Organization</label>
          <Input
            value={formData.organization}
            onChange={(e) => setFormData((prev) => ({ ...prev, organization: e.target.value }))}
            className="bg-white/5 border-white/10 text-white"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-white/60 mb-2">Location</label>
        <Input
          value={formData.location}
          onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
          className="bg-white/5 border-white/10 text-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-white/60 mb-2">Start Date</label>
          <Input
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData((prev) => ({ ...prev, start_date: e.target.value }))}
            className="bg-white/5 border-white/10 text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-2">End Date</label>
          <Input
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData((prev) => ({ ...prev, end_date: e.target.value }))}
            className="bg-white/5 border-white/10 text-white"
            disabled={formData.current}
          />
        </div>
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={formData.current}
          onChange={(e) => setFormData((prev) => ({ ...prev, current: e.target.checked }))}
          className="w-4 h-4 rounded border-white/20 bg-white/5"
        />
        <span className="text-sm text-white/60">Current role</span>
      </label>

      <div>
        <label className="block text-sm text-white/60 mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white min-h-[80px]"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-white/60 mb-2">Highlights (one per line)</label>
        <textarea
          value={formData.highlights}
          onChange={(e) => setFormData((prev) => ({ ...prev, highlights: e.target.value }))}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white min-h-[80px]"
        />
      </div>

      <div>
        <label className="block text-sm text-white/60 mb-2">Order</label>
        <Input
          type="number"
          min="0"
          value={formData.order}
          onChange={(e) => setFormData((prev) => ({ ...prev, order: e.target.value }))}
          className="bg-white/5 border-white/10 text-white"
        />
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button className="bg-electric hover:bg-electric-dark" disabled={saving}>
          {saving ? 'Saving...' : 'Save Experience'}
        </Button>
      </div>
    </form>
  );
};

export default ExperienceManager;
