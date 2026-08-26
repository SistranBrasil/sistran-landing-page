'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { registerSmoothScroll } from '@/lib/smoothScroll';

/**
 * Curva do deslize.
 *
 * A marca tem uma só curva de saída — `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)`
 * em `globals.css`. Ela não entra aqui como string: o Lenis quer uma função de
 * `t`, e resolver uma bézier cúbica por Newton a cada quadro é caro para um
 * ganho que ninguém vê. `1 - (1 - t)^5` (easeOutQuint) é a mesma família —
 * arranca rápido e assenta longo — com uma linha de conta. É por isso que o
 * deslize da página combina com as transições dos componentes.
 */
const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);

/**
 * Progresso do documento como custom property no `<html>`.
 *
 * É o relógio compartilhado: quem precisa saber "quanto da página já passou"
 * lê `--scroll-p` em CSS, em vez de abrir um segundo observador de scroll. Uma
 * escrita por quadro, direto no nó — nenhum `setState`, nenhum re-render.
 *
 * Publicado também sob movimento reduzido, onde o Lenis nem existe: o valor é
 * informação, não animação, e as seções continuam consumindo.
 */
function publicarProgresso(y: number) {
  const doc = document.documentElement;
  const curso = doc.scrollHeight - window.innerHeight;
  const p = curso > 0 ? Math.min(1, Math.max(0, y / curso)) : 0;
  doc.style.setProperty('--scroll-p', p.toFixed(4));
}

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
       comportamento correto. O resto acima continua valendo — inclusive o
       progresso publicado, que as secoes consomem nos dois modos. */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const onScrollNativo = () => publicarProgresso(window.scrollY);
      onScrollNativo();
      window.addEventListener('scroll', onScrollNativo, { passive: true });
      window.addEventListener('resize', onScrollNativo);
      return () => {
        cleanupBase();
        window.removeEventListener('scroll', onScrollNativo);
        window.removeEventListener('resize', onScrollNativo);
      };
    }

    const lenis = new Lenis({
      /* `anchors` NÃO é opcional aqui: o padrão é `false` e, com o Lenis
         gerenciando a posição, só `#top` parece funcionar (coincide com zero).
         Os demais links de âncora do header não sairiam do lugar. O Lenis
         desconta `scroll-margin-top` ao resolver o elemento. */
      anchors: true,
      /* `duration` + `easing`, e NÃO `lerp`. Os dois são controles do mesmo
         eixo e o Lenis usa um só: com `lerp` presente ele ignora a duração, e
         a curva da marca — que só existe no modo por duração — nunca chegava a
         ser aplicada. Antes havia `duration: 1.8` E `lerp: 0.08` no mesmo
         objeto, então afinar qualquer um dos dois era tentativa e erro.

         Consequência de escolher duração: cada gesto anima até um alvo e
         TERMINA. A inércia do `lerp` é exponencial — sempre se aproximando,
         nunca chegando — e é ela que dá a sensação de a página continuar
         patinando depois que a roda parou. */
      duration: 1.3,
      easing: easeOutQuint,
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.4,
    });
    // expose para debug e forçar scroll manual se necessário
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    /* Registro global: quem abre um modal pausa o scroll suave sem prop
       drilling. Ver `src/lib/smoothScroll.ts`. */
    registerSmoothScroll(lenis);

    /* Um evento, dois consumidores: o ScrollTrigger e o progresso global. É o
       Lenis quem manda no relógio — `window.scrollY` durante o deslize está
       sempre um quadro atrás da posição animada, então o valor vem de
       `lenis.scroll`, não da janela. */
    lenis.on('scroll', () => {
      ScrollTrigger.update();
      publicarProgresso(lenis.scroll);
    });
    publicarProgresso(lenis.scroll);

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
