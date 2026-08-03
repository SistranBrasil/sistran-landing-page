'use client';

import { useEffect, useState } from 'react';

/**
 * Design system de motion do padrão Sistran Labs.
 * Importar de `@/lib/motion` (copiar este arquivo para src/lib/motion.ts).
 *
 * Uso típico:
 *   <motion.div variants={vHeader} initial="hidden" whileInView="visible" viewport={VP}>
 *     <motion.span variants={vEyebrow}>...</motion.span>
 *     <motion.h2  variants={vTitle}>...</motion.h2>
 *   </motion.div>
 */

export const ease = [0.25, 0.46, 0.45, 0.94] as const;
export const easeExpo = [0.22, 1, 0.36, 1] as const;

export const VP = { once: true, margin: '-80px' } as const;
export const VP0 = { once: true } as const;

/** Container que orquestra stagger nos filhos (eyebrow/title/subtitle). */
export const vHeader = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
};

export const vEyebrow = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

export const vTitle = {
  hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.88, ease: easeExpo } },
};

export const vSubtitle = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease } },
};

/** Container de grid com stagger para cards. */
export const vGrid = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

export const vCard = {
  hidden: { opacity: 0, y: 36, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: easeExpo } },
};

export const vFadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

/** Enter/exit para conteúdo de tabs (usar com AnimatePresence mode="wait"). */
export const tabContent = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease } },
};

/** Gradient de texto assinatura — usar como className em <span>. */
export const grad =
  'bg-gradient-to-r from-[#0079CB] via-[#1e8fe0] to-[#0ed8f6] bg-clip-text text-transparent';

/** Hook: retorna true se o usuário prefere motion reduzido. */
export function useReducedMotion(): boolean {
  const [rm, setRm] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setRm(mq.matches);
    const handler = (e: MediaQueryListEvent) => setRm(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return rm;
}
