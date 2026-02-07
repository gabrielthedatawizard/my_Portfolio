import { useState } from 'react';
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

const skillCategories = [
  { value: 'data_bi', label: 'Data & BI' },
  { value: 'databases', label: 'Databases' },
  { value: 'ai_ml', label: 'AI & Machine Learning' },
  { value: 'digital_health', label: 'Digital Health' },
  { value: 'programming', label: 'Programming' },
  { value: 'tools', label: 'Tools & Platforms' },
  { value: 'research', label: 'Research Methods' },
  { value: 'soft_skills', label: 'Soft Skills' },
];

const sampleSkills: Skill[] = [
  { id: '1', name: 'Python', category: 'programming', level: 95, order: 1 },
  { id: '2', name: 'PostgreSQL', category: 'databases', level: 90, order: 2 },
  { id: '3', name: 'Machine Learning', category: 'ai_ml', level: 85, order: 3 },
  { id: '4', name: 'Tableau', category: 'data_bi', level: 88, order: 4 },
  { id: '5', name: 'Health Informatics', category: 'digital_health', level: 92, order: 5 },
  { id: '6', name: 'React', category: 'programming', level: 80, order: 6 },
];

const SkillsManager = () => {
  const [skills, setSkills] = useState<Skill[]>(sampleSkills);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredSkills = activeCategory === 'all'
    ? skills
    : skills.filter((s) => s.category === activeCategory);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this skill?')) {
      setSkills(skills.filter((s) => s.id !== id));
      toast.success('Skill deleted');
    }
  };

  const getCategoryLabel = (value: string) => {
    return skillCategories.find((c) => c.value === value)?.label || value;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Skills</h2>
          <p className="text-white/60">Manage your skills and expertise</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="bg-electric hover:bg-electric-dark">
          <Plus className="h-4 w-4 mr-2" />
          Add Skill
        </Button>
      </div>

      {/* Category Filter */}
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
        {skillCategories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`px-4 py-2 text-sm rounded-full border transition-all ${
              activeCategory === cat.value
                ? 'bg-electric border-electric text-white'
                : 'bg-transparent border-white/20 text-white/70 hover:border-white/40'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
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
                <button className="p-1.5 text-white/40 hover:text-electric transition-colors">
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(skill.id)}
                  className="p-1.5 text-white/40 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {skill.level && (
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md bg-charcoal-light border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Add Skill</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white/60 mb-2">Skill Name</label>
              <Input className="bg-white/5 border-white/10 text-white" placeholder="e.g., Python" />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Category</label>
              <select className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white">
                {skillCategories.map((cat) => (
                  <option key={cat.value} value={cat.value} className="bg-charcoal">
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Proficiency (optional)</label>
              <Input type="number" min="0" max="100" className="bg-white/5 border-white/10 text-white" placeholder="85" />
            </div>
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-electric hover:bg-electric-dark">Add Skill</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SkillsManager;
