import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimation } from '@/context/AnimationContext';
import gsap from 'gsap';

const Preloader: React.FC = () => {
  const { isLoading, loadingProgress } = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [displayProgress, setDisplayProgress] = useState(0);

  // Animate progress number
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayProgress((prev) => {
        if (prev < loadingProgress) {
          return Math.min(prev + 1, loadingProgress);
        }
        return prev;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [loadingProgress]);

  // Exit animation
  useEffect(() => {
    if (!isLoading && containerRef.current) {
      const ctx = gsap.context(() => {
        // Animate text up
        gsap.to(textRef.current, {
          y: -100,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.inOut',
        });

        // Animate container curtain effect
        gsap.to(containerRef.current, {
          clipPath: 'inset(0 0 100% 0)',
          duration: 1.2,
          delay: 0.3,
          ease: 'power4.inOut',
        });
      });

      return () => ctx.revert();
    }
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          ref={containerRef}
          initial={{ clipPath: 'inset(0 0 0% 0)' }}
          className="fixed inset-0 z-[9999] bg-[#0A0A0A] flex items-center justify-center overflow-hidden"
          style={{ willChange: 'clip-path' }}
        >
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-20">
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(42, 107, 255, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(42, 107, 255, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '100px 100px',
                animation: 'gridMove 20s linear infinite',
              }}
            />
          </div>

          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-[#2A6BFF]/40 rounded-full"
                initial={{
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                  y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                  opacity: 0,
                }}
                animate={{
                  y: [null, -20, 20],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>

          {/* Main content */}
          <div ref={textRef} className="relative z-10 text-center">
            {/* Logo/Name reveal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mb-8"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
                <span className="inline-block overflow-hidden">
                  <motion.span
                    className="inline-block"
                    initial={{ y: 60 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    Gabriel
                  </motion.span>
                </span>{' '}
                <span className="inline-block overflow-hidden">
                  <motion.span
                    className="inline-block text-[#2A6BFF]"
                    initial={{ y: 60 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    Myeye
                  </motion.span>
                </span>
              </h1>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: '100%' }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="w-64 h-[2px] bg-white/10 mx-auto mb-6 overflow-hidden rounded-full"
            >
              <motion.div
                className="h-full bg-gradient-to-r from-[#2A6BFF] to-[#5B8DEF]"
                initial={{ width: '0%' }}
                animate={{ width: `${loadingProgress}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </motion.div>

            {/* Progress text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center justify-center gap-4"
            >
              <span className="text-white/40 text-sm uppercase tracking-widest">
                Loading
              </span>
              <span className="text-[#2A6BFF] font-mono text-lg font-medium">
                {displayProgress.toFixed(0)}%
              </span>
            </motion.div>

            {/* Loading dots animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center justify-center gap-2 mt-8"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-[#2A6BFF] rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </motion.div>
          </div>

          {/* Corner decorations */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 1 }}
            className="absolute top-8 left-8 w-16 h-16 border-l border-t border-white/20"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 1 }}
            className="absolute top-8 right-8 w-16 h-16 border-r border-t border-white/20"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 1 }}
            className="absolute bottom-8 left-8 w-16 h-16 border-l border-b border-white/20"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 1 }}
            className="absolute bottom-8 right-8 w-16 h-16 border-r border-b border-white/20"
          />

          <style>{`
            @keyframes gridMove {
              0% { transform: translate(0, 0); }
              100% { transform: translate(100px, 100px); }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
