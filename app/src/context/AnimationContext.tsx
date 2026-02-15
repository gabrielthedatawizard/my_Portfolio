import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface AnimationContextType {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  loadingProgress: number;
  setLoadingProgress: (value: number) => void;
  lenis: Lenis | null;
  scrollTo: (target: string | number) => void;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export const AnimationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [lenis, setLenis] = useState<Lenis | null>(null);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    // Prefer native scrolling when user requests reduced motion.
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    setLenis(lenisInstance);

    // Connect Lenis to GSAP ScrollTrigger
    lenisInstance.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => {
      lenisInstance.raf(time * 1000);
    };

    gsap.ticker.add(raf);

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenisInstance.destroy();
      gsap.ticker.remove(raf);
    };
  }, []);

  // Simulate loading progress
  useEffect(() => {
    if (!isLoading) return;

    const durationMs = 950; // 700-1200ms target window
    const exitDelayMs = 180; // allow a brief "100%" moment before fade-out
    const start = performance.now();

    let rafId = 0;
    let exitTimeoutId: number | undefined;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1);
      const eased = easeOutCubic(t);
      const nextProgress = Math.round(eased * 100);
      setLoadingProgress(nextProgress);

      if (t < 1) {
        rafId = window.requestAnimationFrame(tick);
        return;
      }

      setLoadingProgress(100);
      exitTimeoutId = window.setTimeout(() => {
        setIsLoading(false);
      }, exitDelayMs);
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(rafId);
      if (exitTimeoutId) window.clearTimeout(exitTimeoutId);
    };
  }, [isLoading]);

  const scrollTo = useCallback((target: string | number) => {
    if (!lenis) return;
    
    if (typeof target === 'string') {
      const element = document.querySelector(target);
      if (element) {
        lenis.scrollTo(element as HTMLElement, {
          offset: 0,
          duration: 1.5,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      }
    } else {
      lenis.scrollTo(target, {
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    }
  }, [lenis]);

  return (
    <AnimationContext.Provider
      value={{
        isLoading,
        setIsLoading,
        loadingProgress,
        setLoadingProgress,
        lenis,
        scrollTo,
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
};
