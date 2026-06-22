/** Geist motion — cubic-bezier(0.175, 0.885, 0.32, 1.1) */
export const GEIST_EASE = [0.175, 0.885, 0.32, 1.1] as const;

export const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 4 },
  transition: { duration: 0.15, ease: GEIST_EASE },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.15, ease: GEIST_EASE },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.99 },
  transition: { duration: 0.2, ease: GEIST_EASE },
};

export const flipTransition = {
  duration: 0.5,
  ease: [0.4, 0, 0.2, 1] as const,
};
