'use client';

import { MotionConfig } from 'framer-motion';

// Respecte la préférence système « réduire les mouvements » (prefers-reduced-motion) :
// les animations de transformation framer-motion sont alors désactivées automatiquement.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
