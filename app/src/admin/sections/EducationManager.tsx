import { useState } from 'react';
import { Plus, Edit2, Trash2, GraduationCap, Calendar } from 'lucide-react';
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

const sampleEducation: Education[] = [
  {
    id: '1',
    school: 'University of Dar es Salaam',
    program: 'Health Information Science',
    degree: 'Bachelor of Science',
    start_date: '2014-09-01',
    end_date: '2018-06-30',
    current: false,
    details: 'Specialized in health informatics and data management. Graduated with First Class Honors.',
    order: 1,
  },
  {
    id: '2',
    school: 'Aga Khan University',
    program: 'Data Science for Health',
    degree: 'Professional Certificate',
    start_date: '2021-01-01',
    end_date: '2021-06-30',
    current: false,
    details: 'Intensive program covering ML applications in healthcare.',
    order: 2,
  },
];

const EducationManager = () => {
  const [education, setEducation] = useState<Education[]>(sampleEducation);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this education entry?')) {
      setEducation(education.filter((e) => e.id !== id));
      toast.success('Education entry deleted');
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
          <h2 className="text-2xl font-bold text-white">Education</h2>
          <p className="text-white/60">Manage your academic background</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="bg-electric hover:bg-electric-dark">
          <Plus className="h-4 w-4 mr-2" />
          Add Education
        </Button>
      </div>

      <div className="space-y-4">
        {education.map((edu) => (
          <div
            key={edu.id}
            className="bg-charcoal-light border border-white/5 rounded-xl p-6 group hover:border-white/10 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-electric/10 rounded-lg">
                    <GraduationCap className="h-4 w-4 text-electric" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{edu.program}</h3>
                    <p className="text-electric">{edu.school}</p>
                  </div>
                  {edu.current && (
                    <span className="px-2 py-0.5 bg-electric/20 text-electric text-xs rounded-full">
                      Current
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-white/60 mb-3 ml-11">
                  <span className="text-electric">{edu.degree}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                  </span>
                </div>

                <p className="text-white/60 text-sm ml-11">{edu.details}</p>
              </div>

              <div className="flex gap-1 ml-4">
                <button className="p-2 text-white/40 hover:text-electric transition-colors">
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(edu.id)}
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
        <DialogContent className="max-w-lg bg-charcoal-light border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Add Education</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white/60 mb-2">School/Institution</label>
              <Input className="bg-white/5 border-white/10 text-white" />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Program/Course</label>
              <Input className="bg-white/5 border-white/10 text-white" />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Degree/Certificate</label>
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
              <label className="block text-sm text-white/60 mb-2">Details</label>
              <textarea className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white min-h-[80px]" />
            </div>
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-electric hover:bg-electric-dark">Add Education</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EducationManager;
