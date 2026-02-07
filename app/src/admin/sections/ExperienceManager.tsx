import { useState } from 'react';
import { Plus, Edit2, Trash2, Briefcase, MapPin, Calendar } from 'lucide-react';
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

const sampleExperience: Experience[] = [
  {
    id: '1',
    title: 'Senior Data Analyst',
    organization: 'Tanzania Health Information Systems',
    location: 'Dar es Salaam, Tanzania',
    start_date: '2022-01-01',
    current: true,
    description: 'Leading data analytics initiatives for national health information systems.',
    highlights: ['Designed data quality monitoring systems', 'Reduced reporting errors by 60%'],
    order: 1,
  },
  {
    id: '2',
    title: 'Database Administrator',
    organization: 'Digital Health Solutions Ltd',
    location: 'Dar es Salaam, Tanzania',
    start_date: '2020-03-01',
    end_date: '2021-12-31',
    current: false,
    description: 'Managed and optimized database systems for healthcare applications.',
    highlights: ['Optimized query performance by 80%', 'Implemented automated backups'],
    order: 2,
  },
];

const ExperienceManager = () => {
  const [experience, setExperience] = useState<Experience[]>(sampleExperience);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this experience?')) {
      setExperience(experience.filter((e) => e.id !== id));
      toast.success('Experience deleted');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Present';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Experience</h2>
          <p className="text-white/60">Manage your work history</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="bg-electric hover:bg-electric-dark">
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </Button>
      </div>

      <div className="space-y-4">
        {experience.map((exp) => (
          <div
            key={exp.id}
            className="bg-charcoal-light border border-white/5 rounded-xl p-6 group hover:border-white/10 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-electric/10 rounded-lg">
                    <Briefcase className="h-4 w-4 text-electric" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{exp.title}</h3>
                    <p className="text-electric">{exp.organization}</p>
                  </div>
                  {exp.current && (
                    <span className="px-2 py-0.5 bg-electric/20 text-electric text-xs rounded-full">
                      Current
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-white/60 mb-3 ml-11">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {exp.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(exp.start_date)} - {formatDate(exp.end_date)}
                  </span>
                </div>

                <p className="text-white/60 text-sm ml-11 mb-3">{exp.description}</p>

                <ul className="space-y-1 ml-11">
                  {exp.highlights?.map((highlight, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/50">
                      <span className="w-1 h-1 bg-electric rounded-full mt-1.5 flex-shrink-0" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-1 ml-4">
                <button className="p-2 text-white/40 hover:text-electric transition-colors">
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(exp.id)}
                  className="p-2 text-white/40 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg bg-charcoal-light border-white/10 text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Experience</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white/60 mb-2">Job Title</label>
              <Input className="bg-white/5 border-white/10 text-white" placeholder="e.g., Senior Data Analyst" />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Organization</label>
              <Input className="bg-white/5 border-white/10 text-white" />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Location</label>
              <Input className="bg-white/5 border-white/10 text-white" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/60 mb-2">Start Date</label>
                <Input type="date" className="bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2">End Date</label>
                <Input type="date" className="bg-white/5 border-white/10 text-white" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Description</label>
              <textarea className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white min-h-[80px]" />
            </div>
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-electric hover:bg-electric-dark">Add Experience</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExperienceManager;
