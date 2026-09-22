import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus, Search, Edit2, Trash2, Quote, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { AdminEmptyState } from '@/components/EmptyIllustration';
import { toast } from 'sonner';
import type { Testimonial } from '@/types';
import { supabase } from '@/lib/supabase';

type TestimonialForm = {
  name: string;
  role: string;
  organization: string;
  content: string;
  avatar_url: string;
  order: string;
  status: 'draft' | 'published';
};

const defaultForm: TestimonialForm = {
  name: '',
  role: '',
  organization: '',
  content: '',
  avatar_url: '',
  order: '0',
  status: 'published',
};

const TestimonialsManager = () => {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState<TestimonialForm>(defaultForm);

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('order', { ascending: true });
      if (error) throw error;
      setItems((data ?? []) as Testimonial[]);
    } catch (error) {
      console.error('Failed to load testimonials:', error);
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  const filtered = useMemo(
    () =>
      items.filter(
        (t) =>
          t.name.toLowerCase().includes(search.toLowerCase()) ||
          (t.organization ?? '').toLowerCase().includes(search.toLowerCase()) ||
          t.content.toLowerCase().includes(search.toLowerCase())
      ),
    [items, search]
  );

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm);
    setDialogOpen(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({
      name: t.name,
      role: t.role,
      organization: t.organization ?? '',
      content: t.content,
      avatar_url: t.avatar_url ?? '',
      order: String(t.order ?? 0),
      status: t.status,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.content.trim() || !form.role.trim()) {
      toast.error('Name, role and quote are required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        role: form.role.trim(),
        organization: form.organization.trim() || null,
        content: form.content.trim(),
        avatar_url: form.avatar_url.trim() || null,
        order: Number(form.order) || 0,
        status: form.status,
      };
      if (editing) {
        const { error } = await supabase.from('testimonials').update(payload).eq('id', editing.id);
        if (error) throw error;
        toast.success('Testimonial updated');
      } else {
        const { error } = await supabase.from('testimonials').insert(payload);
        if (error) throw error;
        toast.success('Testimonial added — social proof builds hiring trust');
      }
      setDialogOpen(false);
      await loadItems();
    } catch (error) {
      console.error('Failed to save testimonial:', error);
      toast.error('Failed to save testimonial');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    try {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) throw error;
      toast.success('Testimonial deleted');
      await loadItems();
    } catch (error) {
      console.error('Failed to delete testimonial:', error);
      toast.error('Failed to delete testimonial');
    }
  };

  const toggleStatus = async (t: Testimonial) => {
    try {
      const next = t.status === 'published' ? 'draft' : 'published';
      const { error } = await supabase.from('testimonials').update({ status: next }).eq('id', t.id);
      if (error) throw error;
      await loadItems();
    } catch (error) {
      console.error('Failed to toggle status:', error);
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Testimonials</h2>
          <p className="text-white/60">
            Quotes from supervisors, clinicians and collaborators — the fastest trust signal for health employers.
          </p>
        </div>
        <Button className="bg-electric hover:bg-electric-dark text-white" onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" /> Add testimonial
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search testimonials…"
          className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/30"
        />
      </div>

      {loading ? (
        <p className="text-white/60">Loading testimonials…</p>
      ) : filtered.length === 0 ? (
        <AdminEmptyState
          variant="quotes"
          title="No testimonials yet"
          description="Ask a supervisor, lecturer or clinical partner for 2 to 3 sentences about your data work. Aim for 3 or more published quotes."
          actionLabel="Add your first testimonial"
          onAction={openCreate}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((t) => (
            <Card key={t.id} className="bg-charcoal-light border-white/5 text-white">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <Quote className="h-6 w-6 text-electric shrink-0" />
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        t.status === 'published'
                          ? 'bg-green-500/15 text-green-400 border-0'
                          : 'bg-amber-500/15 text-amber-400 border-0'
                      }
                    >
                      {t.status}
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white" onClick={() => void toggleStatus(t)} title="Toggle visibility">
                      {t.status === 'published' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white" onClick={() => openEdit(t)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-red-400" onClick={() => void handleDelete(t.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-white/80 text-sm leading-relaxed mb-4">“{t.content}”</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-electric/20 flex items-center justify-center text-electric font-semibold">
                    {t.name[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{t.name}</p>
                    <p className="text-xs text-white/50">
                      {t.role}{t.organization ? ` · ${t.organization}` : ''}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-charcoal-light border-white/10 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">{editing ? 'Edit testimonial' : 'Add testimonial'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/60 mb-2">Name *</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-white/5 border-white/10 text-white" placeholder="Dr. Amina Juma" />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2">Role *</label>
                <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="bg-white/5 border-white/10 text-white" placeholder="Medical Officer In-charge" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Organization</label>
              <Input value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} className="bg-white/5 border-white/10 text-white" placeholder="Dodoma Regional Hospital" />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Quote *</label>
              <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="bg-white/5 border-white/10 text-white min-h-[110px]" placeholder="Gabriel cleaned our DHIS2 exports and built a dashboard that cut monthly reporting from 3 days to 3 hours…" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/60 mb-2">Order</label>
                <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} className="bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2">Status</label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as 'draft' | 'published' })}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" className="border-white/10 text-white/70" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-electric hover:bg-electric-dark text-white" onClick={() => void handleSave()} disabled={saving}>
                {saving ? 'Saving…' : editing ? 'Save changes' : 'Add testimonial'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestimonialsManager;
