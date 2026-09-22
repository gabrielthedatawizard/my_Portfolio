import type Lenis from 'lenis';

/**
 * Reference counted scroll lock for modals.
 *
 * The previous naive stop/start pairing could leave the page frozen if mounts
 * and cleanups ever unbalanced (nesting, remounts). A counter makes stray
 * states impossible: the root scroller only restarts when zero locks remain.
 * Body overflow is locked too, so the page behind a modal cannot scroll
 * natively while Lenis is stopped.
 */

let locks = 0;
let lenisRef: Lenis | null = null;

export const registerLenis = (instance: Lenis | null): void => {
  lenisRef = instance;
  if (!instance) locks = 0;
};

export const acquireScrollLock = (): void => {
  locks += 1;
  if (locks === 1) {
    lenisRef?.stop();
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }
};

export const releaseScrollLock = (): void => {
  locks = Math.max(0, locks - 1);
  if (locks === 0) {
    lenisRef?.start();
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }
};

/** Failsafe: force scroll back on (route changes, error boundaries). */
export const resetScrollLocks = (): void => {
  locks = 0;
  lenisRef?.start();
  if (typeof document !== 'undefined') {
    document.body.style.overflow = '';
  }
};
