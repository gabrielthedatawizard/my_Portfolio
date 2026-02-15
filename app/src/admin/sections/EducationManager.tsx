import { useCallback, useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import type { Education } from '../../types';
import { supabase } from '@/lib/supabase';

type EducationFormValues = {
  school: string;
  program: string;
  degree: string;
  start_date: string;
  end_date: string;
  current: boolean;
  details: string;
  order: string;
};

const defaultFormValues: EducationFormValues = {
  school: '',
  program: '',
  degree: '',
  start_date: '',
  end_date: '',
  current: false,
  details: '',
  order: '',
};

const mapEducationToForm = (item: Education | null): EducationFormValues => {
  if (!item) return defaultFormValues;
  return {
    school: item.school ?? '',
    program: item.program ?? '',
    degree: item.degree ?? '',
    start_date: item.start_date ?? '',
    end_date: item.end_date ?? '',
    current: Boolean(item.current),
    details: item.details ?? '',
    order: item.order.toString(),
  };
};

const EducationManager = () => {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<Education | null>(null);

  const loadEducation = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('education')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;
      setEducation((data ?? []) as Education[]);
    } catch (error) {
      console.error('Failed to load education:', error);
      toast.error('Failed to load education');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadEducation();
  }, [loadEducation]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this education item?')) return;

    try {
      const { error } = await supabase.from('education').delete().eq('id', id);
      if (error) throw error;

      setEducation((prev) => prev.filter((item) => item.id !== id));
      toast.success('Education deleted');
    } catch (error) {
      console.error('Failed to delete education:', error);
      toast.error('Failed to delete education');
    }
  };

  const handleSave = async (formValues: EducationFormValues) => {
    setIsSaving(true);
    try {
      const payload = {
        school: formValues.school.trim(),
        program: formValues.program.trim(),
        degree: formValues.degree.trim() || null,
        start_date: formValues.start_date,
        end_date: formValues.current ? null : formValues.end_date || null,
        current: formValues.current,
        details: formValues.details.trim() || null,
        order: formValues.order ? Number(formValues.order) : 0,
      };

      if (editingItem) {
        const { data, error } = await supabase
          .from('education')
          .update(payload)
          .eq('id', editingItem.id)
          .select('*')
          .single();
        if (error) throw error;

        setEducation((prev) =>
          prev
            .map((item) => (item.id === editingItem.id ? (data as Education) : item))
            .sort((a, b) => a.order - b.order)
        );
        toast.success('Education updated');
      } else {
        const { data, error } = await supabase
          .from('education')
          .insert(payload)
          .select('*')
          .single();
        if (error) throw error;

        setEducation((prev) => [...prev, data as Education].sort((a, b) => a.order - b.order));
        toast.success('Education created');
      }

      setIsDialogOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Failed to save education:', error);
      toast.error('Failed to save education');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Education</h2>
          <p className="text-white/60">Manage your education timeline</p>
        </div>
        <Button
          onClick={() => {
            setEditingItem(null);
            setIsDialogOpen(true);
          }}
          className="bg-electric hover:bg-electric-dark"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Education
        </Button>
      </div>

      {loading ? (
        <div className="text-white/60">Loading education...</div>
      ) : (
        <div className="space-y-4">
          {education.map((item) => (
            <div
              key={item.id}
              className="bg-charcoal-light border border-white/5 rounded-xl p-6 group hover:border-white/10 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-electric/10 rounded-lg">
                    <GraduationCap className="h-4 w-4 text-electric" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{item.program}</h3>
                    <p className="text-sm text-electric">{item.school}</p>
                    {item.degree && <p className="text-xs text-white/60 mt-1">{item.degree}</p>}
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

              {item.details && <p className="text-sm text-white/70">{item.details}</p>}
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
            <DialogTitle>{editingItem ? 'Edit Education' : 'Add Education'}</DialogTitle>
          </DialogHeader>
          <EducationForm
            initialValues={mapEducationToForm(editingItem)}
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

interface EducationFormProps {
  initialValues: EducationFormValues;
  saving: boolean;
  onSave: (values: EducationFormValues) => Promise<void>;
  onCancel: () => void;
}

const EducationForm: React.FC<EducationFormProps> = ({
  initialValues,
  saving,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<EducationFormValues>(initialValues);

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
          <label className="block text-sm text-white/60 mb-2">School</label>
          <Input
            value={formData.school}
            onChange={(e) => setFormData((prev) => ({ ...prev, school: e.target.value }))}
            className="bg-white/5 border-white/10 text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-2">Program</label>
          <Input
            value={formData.program}
            onChange={(e) => setFormData((prev) => ({ ...prev, program: e.target.value }))}
            className="bg-white/5 border-white/10 text-white"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-white/60 mb-2">Degree</label>
        <Input
          value={formData.degree}
          onChange={(e) => setFormData((prev) => ({ ...prev, degree: e.target.value }))}
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
        <span className="text-sm text-white/60">Currently studying</span>
      </label>

      <div>
        <label className="block text-sm text-white/60 mb-2">Details</label>
        <textarea
          value={formData.details}
          onChange={(e) => setFormData((prev) => ({ ...prev, details: e.target.value }))}
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
          {saving ? 'Saving...' : 'Save Education'}
        </Button>
      </div>
    </form>
  );
};

export default EducationManager;
