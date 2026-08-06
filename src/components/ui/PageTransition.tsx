'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/lib/motion';
import type Lenis from 'lenis';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const rm = useReducedMotion();

  // A cada troca de rota: volta ao topo (Lenis mantém a posição anterior)
  // e recalcula os ScrollTriggers da página nova.
  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);

    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [pathname]);

  if (rm) return <>{children}</>;

  // Sem AnimatePresence mode="wait": no App Router o exit não completa de
  // forma confiável e a rota nova fica presa em opacity 0 (tela em branco).
  // Fade-in simples keyed por pathname é suficiente e à prova de falhas.
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
