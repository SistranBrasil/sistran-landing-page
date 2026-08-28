'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { easeExpo, useReducedMotion } from '@/lib/motion';
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

  // View Transitions nativa do React esta fora de alcance nesta versao: o
  // componente correspondente so existe nas builds canary (verificado no React
  // instalado, que nao o exporta em nenhuma das duas grafias), e trocar de React
  // seria mexer na stack — o que o pedido proibe. O relatorio (p18) admite o
  // cross-fade como fallback, e e ele que fica: 400ms, dentro da faixa de
  // 400-600ms pedida. Em reduced motion o globals.css tambem neutraliza as
  // pseudo-classes de transicao de view, para o caso de o navegador animar uma
  // navegacao de historico por conta propria.
  //
  // Sem AnimatePresence mode="wait": no App Router o exit não completa de
  // forma confiável e a rota nova fica presa em opacity 0 (tela em branco).
  // Fade-in simples keyed por pathname é suficiente e à prova de falhas.
  //
  // O wrapper existe SEMPRE. Trocá-lo por um Fragment quando `rm` vira true
  // (o que só acontece depois da hidratação) desmontava e remontava o site
  // inteiro, matando os ScrollTriggers e os canvases já inicializados — era a
  // origem da página congelada em quem tem "reduzir movimento" ligado.
  return (
    <motion.div
      key={pathname}
      initial={rm ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={rm ? { duration: 0 } : { duration: 0.4, ease: easeExpo }}
    >
      {children}
    </motion.div>
  );
}
