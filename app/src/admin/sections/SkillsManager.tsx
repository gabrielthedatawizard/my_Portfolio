import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus, Edit2, Trash2, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import type { Skill } from '../../types';
import { supabase } from '@/lib/supabase';

const skillCategories: Array<{ value: Skill['category']; label: string }> = [
  { value: 'data_bi', label: 'Data & BI' },
  { value: 'databases', label: 'Databases' },
  { value: 'ai_ml', label: 'AI & Machine Learning' },
  { value: 'digital_health', label: 'Digital Health' },
  { value: 'programming', label: 'Programming' },
  { value: 'tools', label: 'Tools & Platforms' },
  { value: 'research', label: 'Research Methods' },
  { value: 'soft_skills', label: 'Soft Skills' },
];

type SkillFormValues = {
  name: string;
  category: Skill['category'];
  level: string;
  order: string;
};

const defaultFormValues: SkillFormValues = {
  name: '',
  category: 'programming',
  level: '',
  order: '',
};

const mapSkillToForm = (skill: Skill | null): SkillFormValues => {
  if (!skill) return defaultFormValues;
  return {
    name: skill.name ?? '',
    category: skill.category,
    level: skill.level?.toString() ?? '',
    order: skill.order.toString(),
  };
};

const SkillsManager = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const loadSkills = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;
      setSkills((data ?? []) as Skill[]);
    } catch (error) {
      console.error('Failed to load skills:', error);
      toast.error('Failed to load skills');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSkills();
  }, [loadSkills]);

  const filteredSkills = useMemo(
    () =>
      activeCategory === 'all'
        ? skills
        : skills.filter((skill) => skill.category === activeCategory),
    [activeCategory, skills]
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;

    try {
      const { error } = await supabase.from('skills').delete().eq('id', id);
      if (error) throw error;

      setSkills((prev) => prev.filter((skill) => skill.id !== id));
      toast.success('Skill deleted');
    } catch (error) {
      console.error('Failed to delete skill:', error);
      toast.error('Failed to delete skill');
    }
  };

  const handleSave = async (formValues: SkillFormValues) => {
    setIsSaving(true);
    try {
      const payload = {
        name: formValues.name.trim(),
        category: formValues.category,
        level: formValues.level ? Number(formValues.level) : null,
        order: formValues.order ? Number(formValues.order) : 0,
      };

      if (editingSkill) {
        const { data, error } = await supabase
          .from('skills')
          .update(payload)
          .eq('id', editingSkill.id)
          .select('*')
          .single();
        if (error) throw error;

        setSkills((prev) =>
          prev.map((skill) => (skill.id === editingSkill.id ? (data as Skill) : skill))
        );
        toast.success('Skill updated');
      } else {
        const { data, error } = await supabase
          .from('skills')
          .insert(payload)
          .select('*')
          .single();
        if (error) throw error;

        setSkills((prev) => [...prev, data as Skill].sort((a, b) => a.order - b.order));
        toast.success('Skill created');
      }

      setIsDialogOpen(false);
      setEditingSkill(null);
    } catch (error) {
      console.error('Failed to save skill:', error);
      toast.error('Failed to save skill');
    } finally {
      setIsSaving(false);
    }
  };

  const getCategoryLabel = (value: string) =>
    skillCategories.find((category) => category.value === value)?.label || value;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Skills</h2>
          <p className="text-white/60">Manage your skills and expertise</p>
        </div>
        <Button
          onClick={() => {
            setEditingSkill(null);
            setIsDialogOpen(true);
          }}
          className="bg-electric hover:bg-electric-dark"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Skill
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 text-sm rounded-full border transition-all ${
            activeCategory === 'all'
              ? 'bg-electric border-electric text-white'
              : 'bg-transparent border-white/20 text-white/70 hover:border-white/40'
          }`}
        >
          All
        </button>
        {skillCategories.map((category) => (
          <button
            key={category.value}
            onClick={() => setActiveCategory(category.value)}
            className={`px-4 py-2 text-sm rounded-full border transition-all ${
              activeCategory === category.value
                ? 'bg-electric border-electric text-white'
                : 'bg-transparent border-white/20 text-white/70 hover:border-white/40'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-white/60">Loading skills...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="bg-charcoal-light border border-white/5 rounded-xl p-4 group hover:border-white/10 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-electric/10 rounded-lg">
                    <Wrench className="h-4 w-4 text-electric" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{skill.name}</h3>
                    <p className="text-xs text-white/50">{getCategoryLabel(skill.category)}</p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="p-1.5 text-white/40 hover:text-electric transition-colors"
                    onClick={() => {
                      setEditingSkill(skill);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => void handleDelete(skill.id)}
                    className="p-1.5 text-white/40 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {typeof skill.level === 'number' && (
                <div>
                  <div className="flex justify-between text-xs text-white/40 mb-1">
                    <span>Proficiency</span>
                    <span>{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-electric rounded-full transition-all"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open) setEditingSkill(null);
          setIsDialogOpen(open);
        }}
      >
        <DialogContent className="max-w-md bg-charcoal-light border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>{editingSkill ? 'Edit Skill' : 'Add Skill'}</DialogTitle>
          </DialogHeader>
          <SkillForm
            initialValues={mapSkillToForm(editingSkill)}
            saving={isSaving}
            onSave={handleSave}
            onCancel={() => {
              setIsDialogOpen(false);
              setEditingSkill(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface SkillFormProps {
  initialValues: SkillFormValues;
  saving: boolean;
  onSave: (values: SkillFormValues) => Promise<void>;
  onCancel: () => void;
}

const SkillForm: React.FC<SkillFormProps> = ({ initialValues, saving, onSave, onCancel }) => {
  const [formData, setFormData] = useState<SkillFormValues>(initialValues);

  useEffect(() => {
    setFormData(initialValues);
  }, [initialValues]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-white/60 mb-2">Skill Name</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          className="bg-white/5 border-white/10 text-white"
          placeholder="e.g., Python"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-white/60 mb-2">Category</label>
        <select
          value={formData.category}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, category: e.target.value as Skill['category'] }))
          }
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white"
        >
          {skillCategories.map((category) => (
            <option key={category.value} value={category.value} className="bg-charcoal">
              {category.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-white/60 mb-2">Proficiency</label>
          <Input
            type="number"
            min="0"
            max="100"
            value={formData.level}
            onChange={(e) => setFormData((prev) => ({ ...prev, level: e.target.value }))}
            className="bg-white/5 border-white/10 text-white"
            placeholder="85"
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
            placeholder="0"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button className="bg-electric hover:bg-electric-dark" disabled={saving}>
          {saving ? 'Saving...' : editingLabel(initialValues)}
        </Button>
      </div>
    </form>
  );
};

const editingLabel = (initialValues: SkillFormValues) =>
  initialValues.name ? 'Save Skill' : 'Add Skill';

export default SkillsManager;
