import React, { useMemo, useRef, useState } from 'react';
import { ArrowUpRight, BookOpen, CalendarDays, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import type { Post } from '../types';
import { usePosts } from '@/hooks/useData';
import { isSupabaseConfigured } from '@/lib/supabase';
import { samplePosts } from '@/lib/sampleContent';
import { trackContentView } from '@/lib/contentTracking';

const readingTime = (content: string): number => {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

const formatDate = (value?: string | null) => {
  if (!value) return 'Unpublished';
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const Research: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [activeTag, setActiveTag] = useState('All');
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const { data: postsData, loading } = usePosts();
  // Same pattern as Projects: live data when Supabase is connected,
  // curated samples otherwise — the section is never an empty dead end.
  const posts = useMemo<Post[]>(
    () => (!isSupabaseConfigured ? (samplePosts as unknown as Post[]) : postsData),
    [postsData]
  );

  const tags = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((post) => (post.tags ?? []).forEach((tag) => tag && set.add(tag)));
    return ['All', ...Array.from(set)];
  }, [posts]);

  const filtered = activeTag === 'All' ? posts : posts.filter((p) => (p.tags ?? []).includes(activeTag));

  const handleOpenPost = (post: Post) => {
    setSelectedPost(post);
    trackContentView(`/insights/${post.slug}`);
  };

  // Samples guarantee content when Supabase is offline; with Supabase live
  // but zero posts, the empty-state message below invites the owner to publish.

  return (
    <section ref={sectionRef} id="insights" className="relative py-24 md:py-32 bg-charcoal overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-electric/[0.03] to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div>
            <motion.span
              className="text-sm text-electric uppercase tracking-widest mb-4 block"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Research & Notes
            </motion.span>
            <motion.h2
              className="text-section font-bold text-white"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Insights from the <span className="text-electric">Field</span>
            </motion.h2>
            <motion.p
              className="text-white/60 mt-4 max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Practical notes on health data, DHIS2, analytics and digital health — what I learn building systems that clinicians actually use.
            </motion.p>
          </div>

          {tags.length > 2 && (
            <motion.div
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`px-4 py-2 text-sm rounded-full border transition-all duration-300 ${
                    activeTag === tag
                      ? 'bg-electric border-electric text-white'
                      : 'bg-transparent border-white/20 text-white/70 hover:border-white/40'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </motion.div>
          )}
        </motion.div>

        {loading ? (
          <p className="text-white/40">Loading insights…</p>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTag}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: 20 }}
            >
              {filtered.map((post, index) => (
                <motion.article
                  key={post.slug || post.title}
                  onClick={() => handleOpenPost(post)}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1 + index * 0.08 }}
                  whileHover={{ y: -6 }}
                  className="group relative bg-charcoal-light border border-white/5 rounded-2xl p-6 cursor-pointer flex flex-col"
                >
                  <div className="flex items-center gap-2 text-xs text-white/40 mb-4">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formatDate(post.published_at ?? post.created_at)}
                    </span>
                    <span aria-hidden>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {readingTime(post.content)} min read
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-electric transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-white/60 text-sm line-clamp-3 flex-1">{post.excerpt}</p>
                  <div className="flex flex-wrap gap-2 mt-4 mb-4">
                    {(post.tags ?? []).slice(0, 3).map((tag, i) => (
                      <Badge key={i} variant="secondary" className="bg-white/5 text-white/70 border-0 text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm text-electric font-medium">
                    Read note <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                  <div className="absolute inset-0 rounded-2xl border border-electric/0 group-hover:border-electric/30 transition-all duration-500 pointer-events-none" />
                </motion.article>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {!loading && filtered.length === 0 && (
          <p className="text-center text-white/40 mt-8">No notes under this topic yet.</p>
        )}
      </div>

      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-3xl bg-charcoal-light border-white/10 text-white max-h-[90vh] overflow-y-auto">
          {selectedPost && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <div className="flex flex-wrap gap-2 mb-4">
                {(selectedPost.tags ?? []).map((tag, i) => (
                  <Badge key={i} className="bg-electric/20 text-electric border-0">{tag}</Badge>
                ))}
              </div>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-white">{selectedPost.title}</DialogTitle>
                <DialogDescription className="text-white/60 flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {formatDate(selectedPost.published_at ?? selectedPost.created_at)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {readingTime(selectedPost.content)} min read
                  </span>
                </DialogDescription>
              </DialogHeader>
              <p className="mt-4 text-electric/90 text-sm border-l-2 border-electric/40 pl-4">{selectedPost.excerpt}</p>
              <div className="mt-6">
                <p className="text-white/75 whitespace-pre-wrap leading-relaxed">{selectedPost.content}</p>
              </div>
              <div className="mt-8 pt-6 border-t border-white/10">
                <Button className="bg-electric hover:bg-electric-dark text-white" asChild>
                  <a href="#contact" onClick={() => setSelectedPost(null)}>
                    Discuss this topic with me
                  </a>
                </Button>
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Research;
