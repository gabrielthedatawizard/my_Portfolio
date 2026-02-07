import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

interface PhotoItem {
  id: number;
  src: string;
  alt: string;
  span: string;
}

const photos: PhotoItem[] = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop',
    alt: 'Health Data Visualization',
    span: 'col-span-1 row-span-2',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    alt: 'Analytics Dashboard',
    span: 'col-span-1 row-span-1',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
    alt: 'AI Neural Network',
    span: 'col-span-1 row-span-1',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=600&fit=crop',
    alt: 'Database Systems',
    span: 'col-span-1 row-span-2',
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
    alt: 'Digital Health',
    span: 'col-span-1 row-span-1',
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
    alt: 'Data Analysis',
    span: 'col-span-1 row-span-1',
  },
];

const SplitPhotoItem: React.FC<{ photo: PhotoItem; index: number }> = ({ photo, index }) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const { animationsEnabled, reducedMotion } = useTheme();
  const shouldAnimate = animationsEnabled && !reducedMotion;

  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ['start end', 'end start'],
  });

  // Parallax effect
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);

  // Smooth spring
  const springY = useSpring(y, { stiffness: 100, damping: 30 });
  const springScale = useSpring(scale, { stiffness: 100, damping: 30 });

  // Clip path animation for split reveal
  const clipPath = useTransform(
    scrollYProgress,
    [0, 0.3],
    [
      'polygon(0 0, 0 0, 0 100%, 0 100%)',
      'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
    ]
  );

  return (
    <motion.div
      ref={itemRef}
      className={`relative overflow-hidden rounded-2xl ${photo.span} group`}
      initial={shouldAnimate ? { opacity: 0, y: 30 } : {}}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      style={shouldAnimate ? { y: springY, scale: springScale } : {}}
    >
      {/* Image container with clip-path reveal */}
      <motion.div
        className="absolute inset-0"
        style={shouldAnimate ? { clipPath } : {}}
      >
        <motion.img
          src={photo.src}
          alt={photo.alt}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          style={shouldAnimate ? { opacity } : {}}
        />
      </motion.div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
        <p className="text-white font-medium text-sm">{photo.alt}</p>
      </div>

      {/* Border glow on hover */}
      <div className="absolute inset-0 rounded-2xl border-2 border-electric/0 group-hover:border-electric/50 transition-colors duration-500 pointer-events-none" />

      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
        }}
      />
    </motion.div>
  );
};

const SplitPhotoGallery: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Background parallax
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  return (
    <section ref={containerRef} className="relative py-24 md:py-32 bg-charcoal overflow-hidden">
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-electric/5 via-transparent to-electric/5"
        style={{ y: backgroundY }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.span className="text-sm text-electric uppercase tracking-widest mb-4 block">
            Visual Journey
          </motion.span>
          <motion.h2 className="text-section font-bold text-white mb-6">
            Work in <span className="text-electric">Action</span>
          </motion.h2>
          <motion.p className="text-white/70 text-lg">
            A glimpse into the data-driven world of health innovation.
          </motion.p>
        </motion.div>

        {/* Bento Grid Gallery */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
          {photos.map((photo, index) => (
            <SplitPhotoItem key={photo.id} photo={photo} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SplitPhotoGallery;
