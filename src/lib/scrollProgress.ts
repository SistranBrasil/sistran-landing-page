'use client';

import { useEffect, type RefObject } from 'react';

/* ============================================================================
   Progresso de seção publicado como variável CSS
   ----------------------------------------------------------------------------
   Uma seção, um relógio, um número. O hook mede a posição da seção na janela e
   escreve o resultado numa custom property DO PRÓPRIO nó, por `ref`. Nada de
   `setState`: valor por quadro em estado de React re-renderiza a árvore inteira
   sessenta vezes por segundo, e o que consome esse valor é CSS, não JSX.

   Por que não ScrollTrigger aqui: não há pin nem timeline: é um único escalar
   derivado de `getBoundingClientRect`. ScrollTrigger traria o acoplamento com
   `ScrollTrigger.refresh()` (resize, fontes, mudança de altura) sem nada em
   troca. As seções que PRECISAM de pin/timeline nesta base continuam usando
   ScrollTrigger — `Solutions`, `Metrics`, `ProofJourney`. A vizinha imediata das
   consumidoras deste hook (`Social`) já usa exatamente esta mecânica de listener
   + rAF, então a rota fica com uma gramática só.

   Um rAF por rajada de scroll (`quadro` como trava), listener passivo, e a
   variável é removida no cleanup — sem isso a seção ficaria congelada no último
   valor escrito se o efeito fosse desmontado no meio da rolagem.

   `ativo: false` (movimento reduzido, ou mobile quando o efeito não vale o
   custo) não é "escrever 0": é NÃO ESCREVER NADA. O valor de repouso mora no
   CSS, no fallback do `var()`, e é ele que garante o estado legível quando a
   preferência está ligada. Escrever 0 aqui obrigaria o CSS a ter dois estados de
   repouso diferentes.
   ========================================================================== */

export type ModoProgresso =
  /* 0 quando o topo da seção encosta no topo da janela, 1 quando a base encosta
     no topo. É a PARTIDA da seção — serve para quem sai de cena. */
  | 'saida'
  /* 0 quando a seção começa a entrar pela base da janela, 1 quando termina de
     sair pelo topo. É a travessia completa — serve para deriva/paralaxe. */
  | 'travessia';

export function useProgressoDeSecao(
  alvo: RefObject<HTMLElement | null>,
  propriedade: string,
  ativo: boolean,
  modo: ModoProgresso = 'travessia',
) {
  useEffect(() => {
    const el = alvo.current;
    if (!el || !ativo) return;

    let quadro = 0;

    const medir = () => {
      quadro = 0;
      const r = el.getBoundingClientRect();
      if (r.height <= 0) return;
      const p =
        modo === 'saida'
          ? -r.top / r.height
          : (window.innerHeight - r.top) / (window.innerHeight + r.height);
      el.style.setProperty(propriedade, Math.min(1, Math.max(0, p)).toFixed(4));
    };

    const agendar = () => {
      if (quadro) return;
      quadro = window.requestAnimationFrame(medir);
    };

    medir();
    window.addEventListener('scroll', agendar, { passive: true });
    window.addEventListener('resize', agendar, { passive: true });

    return () => {
      if (quadro) window.cancelAnimationFrame(quadro);
      window.removeEventListener('scroll', agendar);
      window.removeEventListener('resize', agendar);
      el.style.removeProperty(propriedade);
    };
  }, [alvo, propriedade, ativo, modo]);
}
