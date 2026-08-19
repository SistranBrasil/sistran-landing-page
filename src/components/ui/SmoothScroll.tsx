'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { registerSmoothScroll } from '@/lib/smoothScroll';

export default function SmoothScroll() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    /* Refresh apos o layout estabilizar. As fontes usam `display: swap`, entao
       o texto reflui DEPOIS que os ScrollTriggers mediram as posicoes — em
       maquinas lentas ou cache frio os triggers ficam com valores velhos e as
       animacoes parecem congeladas. Isto roda inclusive com reduced-motion,
       porque o ScrollTrigger continua ativo para os componentes que o usam. */
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    document.fonts?.ready.then(refresh).catch(() => {});
    const late = window.setTimeout(refresh, 1200);

    const cleanupBase = () => {
      window.removeEventListener('load', refresh);
      window.clearTimeout(late);
    };

    /* Lenis nao inicia com reduced-motion: o scroll fica nativo, que e o
       comportamento correto. O resto acima continua valendo. */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return cleanupBase;
    }

    const lenis = new Lenis({
      /* `anchors` NÃO é opcional aqui: o padrão é `false` e, com o Lenis
         gerenciando a posição, só `#top` parece funcionar (coincide com zero).
         Os demais links de âncora do header não sairiam do lugar. O Lenis
         desconta `scroll-margin-top` ao resolver o elemento. */
      anchors: true,
      duration: 1.8,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.4,
      lerp: 0.08,
    });
    // expose para debug e forçar scroll manual se necessário
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    /* Registro global: quem abre um modal pausa o scroll suave sem prop
       drilling. Ver `src/lib/smoothScroll.ts`. */
    registerSmoothScroll(lenis);

    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      cleanupBase();
      registerSmoothScroll(null);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
