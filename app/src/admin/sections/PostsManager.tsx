import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
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
import type { Post } from '../../types';

const samplePosts: Post[] = [
  {
    id: '1',
    title: 'The Future of Digital Health in Africa',
    slug: 'future-digital-health-africa',
    excerpt: 'Exploring how technology is transforming healthcare delivery across the continent.',
    content: 'Full article content...',
    tags: ['Digital Health', 'Africa', 'Technology'],
    status: 'published',
    published_at: '2024-01-15',
  },
  {
    id: '2',
    title: 'Building Reliable Data Pipelines for Healthcare',
    slug: 'building-reliable-data-pipelines',
    excerpt: 'Best practices for designing ETL processes in health information systems.',
    content: 'Full article content...',
    tags: ['Data Engineering', 'Healthcare', 'ETL'],
    status: 'published',
    published_at: '2024-01-10',
  },
];

const PostsManager = () => {
  const [posts, setPosts] = useState<Post[]>(samplePosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      setPosts(posts.filter((p) => p.id !== id));
      toast.success('Post deleted');
    }
  };

  const handleToggleStatus = (id: string) => {
    setPosts(
      posts.map((p) =>
        p.id === id ? { ...p, status: p.status === 'published' ? 'draft' : 'published' } : p
      )
    );
    toast.success('Status updated');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Blog Posts</h2>
          <p className="text-white/60">Manage your articles and insights</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="bg-electric hover:bg-electric-dark">
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search posts..."
          className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
        />
      </div>

      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-charcoal-light border border-white/5 rounded-xl p-6 group hover:border-white/10 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-2">{post.title}</h3>
                <p className="text-sm text-white/60 mb-3">{post.excerpt}</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="bg-white/5 text-white/70 border-0 text-xs"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-1 ml-4">
                <button
                  onClick={() => handleToggleStatus(post.id)}
                  className={`p-2 transition-colors ${
                    post.status === 'published' ? 'text-green-400' : 'text-white/40'
                  }`}
                >
                  {post.status === 'published' ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button className="p-2 text-white/40 hover:text-electric transition-colors">
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
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
        <DialogContent className="max-w-2xl bg-charcoal-light border-white/10 text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white/60 mb-2">Title</label>
              <Input className="bg-white/5 border-white/10 text-white" />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Slug</label>
              <Input className="bg-white/5 border-white/10 text-white" />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Excerpt</label>
              <Input className="bg-white/5 border-white/10 text-white" />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Content (Markdown)</label>
              <textarea
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white min-h-[200px]"
                placeholder="Write your post in Markdown..."
              />
            </div>
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-electric hover:bg-electric-dark">Create Post</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PostsManager;
