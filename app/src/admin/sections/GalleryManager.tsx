import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import type { GalleryItem } from '../../types';
import { supabase } from '@/lib/supabase';

type GalleryFormValues = {
  media_url: string;
  caption: string;
  category: GalleryItem['category'];
  order: string;
  status: GalleryItem['status'];
};

const categories: Array<{ value: GalleryItem['category']; label: string }> = [
  { value: 'profile', label: 'Profile' },
  { value: 'event', label: 'Events' },
  { value: 'speaking', label: 'Speaking' },
  { value: 'project', label: 'Projects' },
  { value: 'other', label: 'Other' },
];

const defaultFormValues: GalleryFormValues = {
  media_url: '',
  caption: '',
  category: 'other',
  order: '0',
  status: 'published',
};

const mapGalleryToForm = (item: GalleryItem | null): GalleryFormValues => {
  if (!item) return defaultFormValues;
  return {
    media_url: item.media_url ?? '',
    caption: item.caption ?? '',
    category: item.category,
    order: item.order.toString(),
    status: item.status,
  };
};

const GalleryManager = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<'all' | GalleryItem['category']>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

  const loadGallery = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;
      setGallery((data ?? []) as GalleryItem[]);
    } catch (error) {
      console.error('Failed to load gallery:', error);
      toast.error('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadGallery();
  }, [loadGallery]);

  const filteredGallery = useMemo(
    () =>
      activeCategory === 'all'
        ? gallery
        : gallery.filter((item) => item.category === activeCategory),
    [activeCategory, gallery]
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const { error } = await supabase.from('gallery').delete().eq('id', id);
      if (error) throw error;

      setGallery((prev) => prev.filter((item) => item.id !== id));
      toast.success('Gallery item deleted');
    } catch (error) {
      console.error('Failed to delete gallery item:', error);
      toast.error('Failed to delete gallery item');
    }
  };

  const handleSave = async (formValues: GalleryFormValues) => {
    setIsSaving(true);
    try {
      const payload = {
        media_url: formValues.media_url.trim(),
        caption: formValues.caption.trim() || null,
        category: formValues.category,
        order: Number(formValues.order) || 0,
        status: formValues.status,
      };

      if (editingItem) {
        const { data, error } = await supabase
          .from('gallery')
          .update(payload)
          .eq('id', editingItem.id)
          .select('*')
          .single();
        if (error) throw error;

        setGallery((prev) =>
          prev
            .map((item) => (item.id === editingItem.id ? (data as GalleryItem) : item))
            .sort((a, b) => a.order - b.order)
        );
        toast.success('Gallery item updated');
      } else {
        const { data, error } = await supabase
          .from('gallery')
          .insert(payload)
          .select('*')
          .single();
        if (error) throw error;

        setGallery((prev) => [...prev, data as GalleryItem].sort((a, b) => a.order - b.order));
        toast.success('Gallery item created');
      }

      setIsDialogOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Failed to save gallery item:', error);
      toast.error('Failed to save gallery item');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Gallery</h2>
          <p className="text-white/60">Manage your photos and media</p>
        </div>
        <Button
          onClick={() => {
            setEditingItem(null);
            setIsDialogOpen(true);
          }}
          className="bg-electric hover:bg-electric-dark"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Image
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
        {categories.map((category) => (
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
        <div className="text-white/60">Loading gallery...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-square bg-charcoal-light border border-white/5 rounded-xl overflow-hidden"
            >
              {item.media_url ? (
                <img
                  src={item.media_url}
                  alt={item.caption || 'Gallery item'}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-electric/20 to-purple-500/20 flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-white/20" />
                </div>
              )}

              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => {
                      setEditingItem(item);
                      setIsDialogOpen(true);
                    }}
                    className="p-2 text-white/60 hover:text-electric transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => void handleDelete(item.id)}
                    className="p-2 text-white/60 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div>
                  <p className="text-white text-sm line-clamp-2">{item.caption || 'No caption'}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-white/60 capitalize">{item.category}</span>
                    <span className="text-xs text-white/40">{item.status}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredGallery.length === 0 && (
        <p className="text-white/40">No gallery items for this category.</p>
      )}

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open) setEditingItem(null);
          setIsDialogOpen(open);
        }}
      >
        <DialogContent className="max-w-lg bg-charcoal-light border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Gallery Item' : 'Add Gallery Item'}</DialogTitle>
          </DialogHeader>
          <GalleryForm
            initialValues={mapGalleryToForm(editingItem)}
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

interface GalleryFormProps {
  initialValues: GalleryFormValues;
  saving: boolean;
  onSave: (values: GalleryFormValues) => Promise<void>;
  onCancel: () => void;
}

const GalleryForm: React.FC<GalleryFormProps> = ({ initialValues, saving, onSave, onCancel }) => {
  const [formData, setFormData] = useState<GalleryFormValues>(initialValues);

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
        <label className="block text-sm text-white/60 mb-2">Image URL</label>
        <Input
          value={formData.media_url}
          onChange={(event) => setFormData((prev) => ({ ...prev, media_url: event.target.value }))}
          className="bg-white/5 border-white/10 text-white"
          placeholder="https://..."
          required
        />
      </div>

      <div>
        <label className="block text-sm text-white/60 mb-2">Caption</label>
        <Input
          value={formData.caption}
          onChange={(event) => setFormData((prev) => ({ ...prev, caption: event.target.value }))}
          className="bg-white/5 border-white/10 text-white"
          placeholder="Optional caption"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-white/60 mb-2">Category</label>
          <select
            value={formData.category}
            onChange={(event) =>
              setFormData((prev) => ({
                ...prev,
                category: event.target.value as GalleryItem['category'],
              }))
            }
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value} className="bg-charcoal text-white">
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-white/60 mb-2">Order</label>
          <Input
            type="number"
            value={formData.order}
            onChange={(event) => setFormData((prev) => ({ ...prev, order: event.target.value }))}
            className="bg-white/5 border-white/10 text-white"
            min={0}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-white/60 mb-2">Status</label>
        <select
          value={formData.status}
          onChange={(event) =>
            setFormData((prev) => ({ ...prev, status: event.target.value as GalleryItem['status'] }))
          }
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white"
        >
          <option value="draft" className="bg-charcoal text-white">
            Draft
          </option>
          <option value="published" className="bg-charcoal text-white">
            Published
          </option>
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-white/20 text-white hover:bg-white/10"
        >
          Cancel
        </Button>
        <Button type="submit" className="bg-electric hover:bg-electric-dark" disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
};

export default GalleryManager;
