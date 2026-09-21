import React, { useRef } from 'react';
import { Quote } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useTestimonials } from '@/hooks/useData';

const Testimonials: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const { data: testimonials, loading } = useTestimonials();

  // No invented praise: hidden until the owner publishes real quotes
  // via Admin → Testimonials.
  if (!loading && testimonials.length === 0) return null;

  return (
    <section ref={sectionRef} id="testimonials" className="relative py-24 md:py-32 bg-charcoal overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-electric/[0.04] to-transparent" />
      <motion.div
        className="absolute top-32 left-16 w-72 h-72 bg-electric/5 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-14"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.span
            className="text-sm text-electric uppercase tracking-widest mb-4 block"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Kind Words
          </motion.span>
          <motion.h2
            className="text-section font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Trusted by People <span className="text-electric">I've Worked With</span>
          </motion.h2>
          <motion.p
            className="text-white/70 text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Supervisors, clinicians and collaborators on the data work that matters.
          </motion.p>
        </motion.div>

        {loading ? (
          <p className="text-center text-white/40">Loading testimonials…</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, index) => (
              <motion.figure
                key={t.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 + index * 0.08 }}
                whileHover={{ y: -6 }}
                className="relative bg-charcoal-light border border-white/5 rounded-2xl p-6 flex flex-col"
              >
                <Quote className="h-7 w-7 text-electric/60 mb-4" />
                <blockquote className="text-white/75 text-sm leading-relaxed flex-1">
                  “{t.content}”
                </blockquote>
                <figcaption className="flex items-center gap-3 mt-6 pt-5 border-t border-white/5">
                  {t.avatar_url ? (
                    <img
                      src={t.avatar_url}
                      alt={t.name}
                      className="w-10 h-10 rounded-full object-cover border border-white/10"
                      loading="lazy"
                    />
                  ) : (
                    <span className="w-10 h-10 rounded-full bg-electric/20 flex items-center justify-center text-electric font-semibold">
                      {t.name[0]?.toUpperCase()}
                    </span>
                  )}
                  <div>
                    <p className="text-sm font-medium text-white">{t.name}</p>
                    <p className="text-xs text-white/50">
                      {t.role}{t.organization ? ` · ${t.organization}` : ''}
                    </p>
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
