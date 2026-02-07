import { useState } from 'react';
import { Plus, Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { GalleryItem } from '../../types';

const sampleGallery: GalleryItem[] = [
  { id: '1', media_url: '/placeholder1.jpg', caption: 'Speaking at Health Tech Conference', category: 'speaking', order: 1, status: 'published' },
  { id: '2', media_url: '/placeholder2.jpg', caption: 'Team workshop session', category: 'event', order: 2, status: 'published' },
  { id: '3', media_url: '/placeholder3.jpg', caption: 'Project showcase', category: 'project', order: 3, status: 'published' },
];

const categories = [
  { value: 'profile', label: 'Profile' },
  { value: 'event', label: 'Events' },
  { value: 'speaking', label: 'Speaking' },
  { value: 'project', label: 'Projects' },
  { value: 'other', label: 'Other' },
];

const GalleryManager = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>(sampleGallery);
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredGallery = activeCategory === 'all'
    ? gallery
    : gallery.filter((item) => item.category === activeCategory);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this image?')) {
      setGallery(gallery.filter((g) => g.id !== id));
      toast.success('Image deleted');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Gallery</h2>
          <p className="text-white/60">Manage your photos and media</p>
        </div>
        <Button className="bg-electric hover:bg-electric-dark">
          <Upload className="h-4 w-4 mr-2" />
          Upload Image
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
        {categories.map((cat) => (
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

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredGallery.map((item) => (
          <div
            key={item.id}
            className="group relative aspect-square bg-charcoal-light border border-white/5 rounded-xl overflow-hidden"
          >
            {/* Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-electric/20 to-purple-500/20 flex items-center justify-center">
              <ImageIcon className="h-12 w-12 text-white/20" />
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
              <p className="text-white text-sm mb-2">{item.caption}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60 capitalize">{item.category}</span>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-white/60 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Add New Placeholder */}
        <button className="aspect-square bg-charcoal-light border border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-electric/50 hover:bg-electric/5 transition-colors">
          <Plus className="h-8 w-8 text-white/40" />
          <span className="text-sm text-white/40">Add Image</span>
        </button>
      </div>
    </div>
  );
};

export default GalleryManager;
