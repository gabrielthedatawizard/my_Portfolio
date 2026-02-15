import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { supabase } from '@/lib/supabase';

type PostFormValues = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string;
  status: Post['status'];
};

const defaultFormValues: PostFormValues = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  tags: '',
  status: 'draft',
};

const mapPostToForm = (post: Post | null): PostFormValues => {
  if (!post) return defaultFormValues;
  return {
    title: post.title ?? '',
    slug: post.slug ?? '',
    excerpt: post.excerpt ?? '',
    content: post.content ?? '',
    tags: (post.tags ?? []).join(', '),
    status: post.status,
  };
};

const parseTags = (value: string) =>
  value
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);

const PostsManager = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts((data ?? []) as Post[]);
    } catch (error) {
      console.error('Failed to load posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  const filteredPosts = useMemo(
    () =>
      posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      ),
    [posts, searchQuery]
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (error) throw error;

      setPosts((prev) => prev.filter((post) => post.id !== id));
      toast.success('Post deleted');
    } catch (error) {
      console.error('Failed to delete post:', error);
      toast.error('Failed to delete post');
    }
  };

  const handleToggleStatus = async (post: Post) => {
    const nextStatus: Post['status'] = post.status === 'published' ? 'draft' : 'published';
    const publishedAt = nextStatus === 'published' ? new Date().toISOString() : null;

    try {
      const { data, error } = await supabase
        .from('posts')
        .update({ status: nextStatus, published_at: publishedAt })
        .eq('id', post.id)
        .select('*')
        .single();
      if (error) throw error;

      setPosts((prev) => prev.map((entry) => (entry.id === post.id ? (data as Post) : entry)));
      toast.success('Post status updated');
    } catch (error) {
      console.error('Failed to update post status:', error);
      toast.error('Failed to update post status');
    }
  };

  const handleSave = async (formValues: PostFormValues) => {
    setIsSaving(true);
    try {
      const payload = {
        title: formValues.title.trim(),
        slug: formValues.slug.trim(),
        excerpt: formValues.excerpt.trim(),
        content: formValues.content.trim(),
        tags: parseTags(formValues.tags),
        status: formValues.status,
        published_at: formValues.status === 'published' ? new Date().toISOString() : null,
      };

      if (editingPost) {
        const { data, error } = await supabase
          .from('posts')
          .update(payload)
          .eq('id', editingPost.id)
          .select('*')
          .single();
        if (error) throw error;

        setPosts((prev) => prev.map((post) => (post.id === editingPost.id ? (data as Post) : post)));
        toast.success('Post updated');
      } else {
        const { data, error } = await supabase
          .from('posts')
          .insert(payload)
          .select('*')
          .single();
        if (error) throw error;

        setPosts((prev) => [data as Post, ...prev]);
        toast.success('Post created');
      }

      setIsDialogOpen(false);
      setEditingPost(null);
    } catch (error) {
      console.error('Failed to save post:', error);
      toast.error('Failed to save post. Check title/slug uniqueness.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Blog Posts</h2>
          <p className="text-white/60">Manage your articles and insights</p>
        </div>
        <Button
          onClick={() => {
            setEditingPost(null);
            setIsDialogOpen(true);
          }}
          className="bg-electric hover:bg-electric-dark"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
        <Input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search posts..."
          className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
        />
      </div>

      {loading ? (
        <div className="text-white/60">Loading posts...</div>
      ) : (
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
                    {(post.tags ?? []).map((tag, index) => (
                      <Badge
                        key={index}
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
                    onClick={() => void handleToggleStatus(post)}
                    className={`p-2 transition-colors ${
                      post.status === 'published' ? 'text-green-400' : 'text-white/40'
                    }`}
                  >
                    {post.status === 'published' ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => {
                      setEditingPost(post);
                      setIsDialogOpen(true);
                    }}
                    className="p-2 text-white/40 hover:text-electric transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => void handleDelete(post.id)}
                    className="p-2 text-white/40 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredPosts.length === 0 && (
        <p className="text-white/40">No posts found.</p>
      )}

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open) setEditingPost(null);
          setIsDialogOpen(open);
        }}
      >
        <DialogContent className="max-w-2xl bg-charcoal-light border-white/10 text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPost ? 'Edit Post' : 'Create New Post'}</DialogTitle>
          </DialogHeader>
          <PostForm
            initialValues={mapPostToForm(editingPost)}
            saving={isSaving}
            onSave={handleSave}
            onCancel={() => {
              setIsDialogOpen(false);
              setEditingPost(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface PostFormProps {
  initialValues: PostFormValues;
  saving: boolean;
  onSave: (values: PostFormValues) => Promise<void>;
  onCancel: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ initialValues, saving, onSave, onCancel }) => {
  const [formData, setFormData] = useState<PostFormValues>(initialValues);

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
        <label className="block text-sm text-white/60 mb-2">Title</label>
        <Input
          value={formData.title}
          onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
          className="bg-white/5 border-white/10 text-white"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-white/60 mb-2">Slug</label>
        <Input
          value={formData.slug}
          onChange={(event) => setFormData((prev) => ({ ...prev, slug: event.target.value }))}
          className="bg-white/5 border-white/10 text-white"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-white/60 mb-2">Excerpt</label>
        <Input
          value={formData.excerpt}
          onChange={(event) => setFormData((prev) => ({ ...prev, excerpt: event.target.value }))}
          className="bg-white/5 border-white/10 text-white"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-white/60 mb-2">Content</label>
        <textarea
          value={formData.content}
          onChange={(event) => setFormData((prev) => ({ ...prev, content: event.target.value }))}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white min-h-[220px]"
          placeholder="Write your post..."
          required
        />
      </div>

      <div>
        <label className="block text-sm text-white/60 mb-2">Tags (comma separated)</label>
        <Input
          value={formData.tags}
          onChange={(event) => setFormData((prev) => ({ ...prev, tags: event.target.value }))}
          className="bg-white/5 border-white/10 text-white"
          placeholder="AI, Healthcare, Data Science"
        />
      </div>

      <div>
        <label className="block text-sm text-white/60 mb-2">Status</label>
        <select
          value={formData.status}
          onChange={(event) => setFormData((prev) => ({ ...prev, status: event.target.value as Post['status'] }))}
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
          {saving ? 'Saving...' : 'Save Post'}
        </Button>
      </div>
    </form>
  );
};

export default PostsManager;
