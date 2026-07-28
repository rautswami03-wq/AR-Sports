import type { Variants } from 'framer-motion';

// ============================================================================
// AR Sports Studio Pro — Animation Variants
// ============================================================================

// --- Timing constants (ms converted to seconds for framer-motion) ---
export const TIMING = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  broadcast: 0.8,
} as const;

export const EASING = {
  standard: [0.4, 0, 0.2, 1] as const,
  decelerate: [0, 0, 0.2, 1] as const,
  accelerate: [0.4, 0, 1, 1] as const,
  broadcast: [0.22, 1, 0.36, 1] as const,
  bounce: [0.34, 1.56, 0.64, 1] as const,
} as const;

// --- Slide variants ---

export const slideInRight: Variants = {
  hidden: { x: '100%', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: TIMING.slow, ease: EASING.broadcast },
  },
  exit: {
    x: '-100%',
    opacity: 0,
    transition: { duration: TIMING.normal, ease: EASING.accelerate },
  },
};

export const slideInLeft: Variants = {
  hidden: { x: '-100%', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: TIMING.slow, ease: EASING.broadcast },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: { duration: TIMING.normal, ease: EASING.accelerate },
  },
};

export const slideInBottom: Variants = {
  hidden: { y: '100%', opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: TIMING.slow, ease: EASING.broadcast },
  },
  exit: {
    y: '100%',
    opacity: 0,
    transition: { duration: TIMING.normal, ease: EASING.accelerate },
  },
};

export const slideInTop: Variants = {
  hidden: { y: '-100%', opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: TIMING.slow, ease: EASING.broadcast },
  },
  exit: {
    y: '-100%',
    opacity: 0,
    transition: { duration: TIMING.normal, ease: EASING.accelerate },
  },
};

// --- Fade variants ---

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: TIMING.normal, ease: EASING.decelerate },
  },
  exit: {
    opacity: 0,
    transition: { duration: TIMING.fast, ease: EASING.accelerate },
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: TIMING.slow, ease: EASING.broadcast },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: TIMING.normal, ease: EASING.accelerate },
  },
};

// --- Scale variants ---

export const scaleIn: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: TIMING.slow, ease: EASING.broadcast },
  },
  exit: {
    scale: 0.8,
    opacity: 0,
    transition: { duration: TIMING.normal, ease: EASING.accelerate },
  },
};

export const bounceIn: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.6, ease: EASING.bounce },
  },
  exit: {
    scale: 0,
    opacity: 0,
    transition: { duration: TIMING.normal, ease: EASING.accelerate },
  },
};

// --- Broadcast-specific variants ---

export const scoreBugEnter: Variants = {
  hidden: { x: '-100%', opacity: 0, scale: 0.95 },
  visible: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: TIMING.broadcast, ease: EASING.broadcast },
  },
  exit: {
    x: '-100%',
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.4, ease: EASING.accelerate },
  },
};

export const fourAnimation: Variants = {
  hidden: { scale: 0.3, opacity: 0, rotate: -10 },
  visible: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: { duration: 0.6, ease: EASING.bounce },
  },
  exit: {
    scale: 1.2,
    opacity: 0,
    transition: { duration: 0.4, ease: EASING.accelerate },
  },
};

export const sixAnimation: Variants = {
  hidden: { scale: 0, opacity: 0, y: 50 },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASING.bounce },
  },
  exit: {
    scale: 1.5,
    opacity: 0,
    y: -50,
    transition: { duration: 0.5, ease: EASING.accelerate },
  },
};

export const wicketAnimation: Variants = {
  hidden: { scale: 0.5, opacity: 0, rotate: 5 },
  visible: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: { duration: 0.5, ease: EASING.bounce },
  },
  exit: {
    scale: 0.8,
    opacity: 0,
    rotate: -5,
    transition: { duration: 0.4, ease: EASING.accelerate },
  },
};

export const winnerAnimation: Variants = {
  hidden: { scale: 0.8, opacity: 0, y: 30 },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      duration: TIMING.broadcast,
      ease: EASING.broadcast,
      scale: { type: 'spring', damping: 12, stiffness: 200 },
    },
  },
  exit: {
    scale: 0.9,
    opacity: 0,
    y: -30,
    transition: { duration: TIMING.slow, ease: EASING.accelerate },
  },
};

// --- Stagger children ---

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: TIMING.normal, ease: EASING.broadcast },
  },
};

// --- Pulse (for live indicators) ---

export const pulse: Variants = {
  animate: {
    opacity: [1, 0.4, 1],
    transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
  },
};

// --- Number counter animation ---

export const numberChange: Variants = {
  initial: { y: -20, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: EASING.decelerate },
  },
};
