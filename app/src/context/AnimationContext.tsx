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

    gsap.ticker.add((time) => {
      lenisInstance.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenisInstance.destroy();
      gsap.ticker.remove((time) => {
        lenisInstance.raf(time * 1000);
      });
    };
  }, []);

  // Simulate loading progress
  useEffect(() => {
    if (!isLoading) return;

    const duration = 2500; // 2.5 seconds loading
    const interval = 50;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = Math.min((currentStep / steps) * 100, 100);
      
      // Non-linear progress for suspense
      const easedProgress = progress < 50 
        ? progress * 0.7 // Slower at start
        : 35 + (progress - 50) * 1.3; // Faster at end
      
      setLoadingProgress(Math.min(easedProgress, 100));

      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }
    }, interval);

    return () => clearInterval(timer);
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
