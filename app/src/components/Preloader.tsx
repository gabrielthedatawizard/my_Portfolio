import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimation } from '@/context/AnimationContext';
import { useTheme } from '@/context/ThemeContext';

const Preloader: React.FC = () => {
  const { isLoading, loadingProgress } = useAnimation();
  const { resolvedTheme, reducedMotion, animationsEnabled } = useTheme();
  const isLight = resolvedTheme === 'light';
  const shouldAnimate = animationsEnabled && !reducedMotion;

  const progressNumber = Math.round(loadingProgress);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={shouldAnimate ? { opacity: 0, scale: 0.985 } : { opacity: 0 }}
          transition={{ duration: shouldAnimate ? 0.35 : 0.01, ease: [0.22, 1, 0.36, 1] }}
          className={`fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden ${
            isLight ? 'bg-slate-50' : 'bg-[#0A0A0A]'
          }`}
          style={{ willChange: 'opacity, transform' }}
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
                animation: shouldAnimate ? 'gridMove 18s linear infinite' : 'none',
              }}
            />
          </div>

          {/* Main content */}
          <div className="relative z-10 text-center px-6">
            {/* Welcome copy */}
            <motion.div
              initial={shouldAnimate ? { opacity: 0, y: 14 } : { opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="mb-8"
            >
              <p
                className={`text-xs sm:text-sm tracking-[0.22em] italic mb-2 ${
                  isLight ? 'text-slate-600' : 'text-white/70'
                }`}
                style={{
                  fontFamily:
                    '"Lucida Sans Unicode", "Lucida Grande", "Lucida Sans", Arial, sans-serif',
                }}
              >
                Welcome to
              </p>

              <h1
                className={`text-[clamp(1.75rem,4vw,3rem)] font-semibold tracking-tight ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                Gabriel <span className="text-[#2A6BFF]">Myeye&apos;s Portfolio</span>
              </h1>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              initial={shouldAnimate ? { opacity: 0, y: 8 } : { opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className={`w-64 h-[2px] mx-auto mb-6 overflow-hidden rounded-full ${
                isLight ? 'bg-black/10' : 'bg-white/10'
              }`}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-[#2A6BFF] to-[#5B8DEF]"
                animate={{ width: `${loadingProgress}%` }}
                transition={{ duration: shouldAnimate ? 0.25 : 0.01, ease: 'easeOut' }}
              />
            </motion.div>

            {/* Progress text */}
            <motion.div
              initial={shouldAnimate ? { opacity: 0 } : { opacity: 1 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.3 }}
              className="flex items-center justify-center gap-4"
            >
              <span className={`text-sm uppercase tracking-widest ${isLight ? 'text-slate-500' : 'text-white/40'}`}>
                Loading
              </span>
              <span className="text-[#2A6BFF] font-mono text-lg font-medium">
                {progressNumber}%
              </span>
            </motion.div>

            {/* Loading dots animation */}
            {shouldAnimate && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="flex items-center justify-center gap-2 mt-8"
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-[#2A6BFF] rounded-full"
                    animate={{
                      scale: [1, 1.45, 1],
                      opacity: [0.45, 1, 0.45],
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: i * 0.18,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </motion.div>
            )}
          </div>

          {/* Corner decorations */}
          <motion.div
            initial={shouldAnimate ? { opacity: 0 } : { opacity: 0.25 }}
            animate={{ opacity: 0.25 }}
            transition={{ delay: 0.35 }}
            className={`absolute top-8 left-8 w-16 h-16 border-l border-t ${
              isLight ? 'border-black/20' : 'border-white/20'
            }`}
          />
          <motion.div
            initial={shouldAnimate ? { opacity: 0 } : { opacity: 0.25 }}
            animate={{ opacity: 0.25 }}
            transition={{ delay: 0.35 }}
            className={`absolute top-8 right-8 w-16 h-16 border-r border-t ${
              isLight ? 'border-black/20' : 'border-white/20'
            }`}
          />
          <motion.div
            initial={shouldAnimate ? { opacity: 0 } : { opacity: 0.25 }}
            animate={{ opacity: 0.25 }}
            transition={{ delay: 0.35 }}
            className={`absolute bottom-8 left-8 w-16 h-16 border-l border-b ${
              isLight ? 'border-black/20' : 'border-white/20'
            }`}
          />
          <motion.div
            initial={shouldAnimate ? { opacity: 0 } : { opacity: 0.25 }}
            animate={{ opacity: 0.25 }}
            transition={{ delay: 0.35 }}
            className={`absolute bottom-8 right-8 w-16 h-16 border-r border-b ${
              isLight ? 'border-black/20' : 'border-white/20'
            }`}
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
