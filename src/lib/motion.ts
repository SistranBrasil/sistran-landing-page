'use client';

import { useSyncExternalStore } from 'react';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

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
  visible: { transition: { staggerChildren: 0.12 } },
};

export const vEyebrow = {
  hidden: { opacity: 0, y: 34, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: easeExpo },
  },
};

export const vTitle = {
  hidden: { opacity: 0, y: 34, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: easeExpo },
  },
};

export const vSubtitle = {
  hidden: { opacity: 0, y: 34, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: easeExpo },
  },
};

/** Container de grid com stagger para cards. */
export const vGrid = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export const vCard = {
  hidden: { opacity: 0, y: 34, scale: 0.97, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: easeExpo },
  },
};

export const vFadeUp = {
  hidden: { opacity: 0, y: 34, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: easeExpo },
  },
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

/* Uma única MediaQueryList para toda a aplicação. Sem o cache, cada render de
   cada componente que chama o hook alocaria um objeto novo — `getSnapshot` roda
   em todo render, e são dezenas de consumidores. */
let mediaQuery: MediaQueryList | null = null;

function getMediaQuery(): MediaQueryList {
  if (!mediaQuery) mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  return mediaQuery;
}

/**
 * Leitura síncrona da preferência. Use dentro de `useEffect`, nunca durante o
 * render: no render o valor precisa ser o mesmo do servidor (`false`), senão a
 * hidratação diverge.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return getMediaQuery().matches;
}

/**
 * Hook: retorna true se o usuário prefere motion reduzido.
 *
 * O snapshot do servidor é sempre `false` e o primeiro render do cliente também
 * — o valor real só chega depois da hidratação. Por isso o consumidor NUNCA
 * pode usar `rm` para decidir quais nós existem (`if (rm) return <A/>`): quando
 * o valor vira `true`, a subárvore inteira é desmontada e remontada. Condicione
 * apenas estilos e props, ou resolva a diferença em CSS.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false);
}

function subscribeReducedMotion(onChange: () => void): () => void {
  const mq = getMediaQuery();
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

function getReducedMotion(): boolean {
  return getMediaQuery().matches;
}
