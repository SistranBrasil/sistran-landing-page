'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * SIS-193 — o gatilho único dos efeitos de rolagem descritos em
 * `docs/efeitos-scroll-terminal-industries.md`.
 *
 * Devolve uma `ref` e o valor de `data-in` para pôr no elemento raiz. Todo o
 * movimento vive no CSS (bloco "SIS-193 · fundação" no fim de
 * `src/app/globals.css`); daqui só sai a marca de "entrou em cena".
 *
 * ── Por que IntersectionObserver e não ScrollTrigger ──────────────────────
 * O doc sugere GSAP, e a casa tem GSAP (`SectionReveal` usa). Aqui não serve:
 * o que estas issues pedem é uma marca booleana por seção, com reversão ao
 * voltar acima — que é literalmente a API do IntersectionObserver. Um
 * ScrollTrigger por seção para escrever um atributo custaria um ticker de
 * rolagem e uma medição a cada `refresh` para fazer o que o observador faz de
 * graça, fora da thread principal. `pin` está proibido na casa e não é usado.
 *
 * ── Por que a preferência de movimento NÃO é decidida aqui ────────────────
 * `useReducedMotion` só sabe a resposta depois de montar; decidir aqui daria um
 * quadro de movimento a quem pediu para não ver movimento, e mudaria a árvore
 * entre servidor e cliente. Então o hook sempre observa, sempre marca, e quem
 * anula o movimento é o CSS — nas DUAS chaves (`@media` e
 * `html[data-motion="reduce"]`). O conteúdo fica no estado final em qualquer
 * uma delas, inclusive sem JavaScript, porque `data-in` ausente com movimento
 * reduzido já cai na regra de estado final.
 */
type Opcoes = {
  /**
   * Fração do elemento visível para acender. O doc pede "20% da seção
   * alcançando 50% da viewport" (Efeito 1) e `top 82%` (Efeitos 2 e 4) — os
   * dois viram limiar de interseção, que é a mesma ideia sem medir posição.
   */
  limiar?: number;
  /** `false` para reverter ao sair de cena (a parede de logos do doc). */
  umaVez?: boolean;
  /**
   * Mantém o estado final quando a seção sai pelo topo da viewport e só
   * reverte quando ela cruza o limiar no caminho de volta. Equivale a
   * `toggleActions: play none none reverse`.
   */
  reverterSomenteAcima?: boolean;
  /** Margem do observador, no formato de `rootMargin`. */
  margem?: string;
};

export function useRevealTrigger<T extends HTMLElement = HTMLDivElement>({
  limiar = 0.2,
  umaVez = true,
  reverterSomenteAcima = false,
  margem = '0px 0px -12% 0px',
}: Opcoes = {}) {
  const ref = useRef<T>(null);
  const [dentro, setDentro] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    /* `data-in` é escrito no DOM pelo efeito, e NÃO devolvido pelo render.
       Duas razões:
       1. Hidratação: o HTML do servidor sai sem o atributo, então servidor e
          primeiro render do cliente produzem exatamente a mesma árvore. O
          estado escondido do CSS exige `[data-in="false"]` num ancestral —
          logo, sem JavaScript o conteúdo aparece pronto.
       2. Marcar "montado" com `useState` dentro do efeito é justamente o
          `setState` em cascata que o lint aponta na casa. Aqui o atributo é
          estado de sistema externo (o DOM), que é o uso legítimo do efeito. */
    const marcar = (valor: boolean) => {
      el.dataset.in = valor ? 'true' : 'false';
      setDentro(valor);
    };

    /* Sem IntersectionObserver (navegador antigo, ou ambiente de teste) o certo
       é mostrar, não esconder: a animação é complemento de leitura. */
    if (typeof IntersectionObserver === 'undefined') {
      marcar(true);
      return;
    }

    el.dataset.in = 'false';

    const obs = new IntersectionObserver(
      ([entrada]) => {
        /* `isIntersecting` sozinho fica verdadeiro mesmo abaixo do `threshold`.
           A razão é o que representa de fato o cruzamento do gatilho. */
        const atingiuLimiar =
          entrada.isIntersecting && entrada.intersectionRatio >= limiar;

        if (atingiuLimiar) {
          marcar(true);
          if (umaVez) obs.disconnect();
          return;
        }

        if (!umaVez) {
          if (!reverterSomenteAcima) {
            marcar(false);
            return;
          }

          /* Ao rolar para baixo, a seção sai pelo TOPO (`top` negativo): o
             estado final permanece. Ao voltar, ela perde o limiar ainda abaixo
             do topo da viewport (`top` positivo): só então faz reverse.
             Assim, oscilar entre o interior e o rodapé não reinicia a cena. */
          const topoDaRaiz = entrada.rootBounds?.top ?? 0;
          if (entrada.boundingClientRect.top >= topoDaRaiz) marcar(false);
        }
      },
      {
        /* O zero garante uma segunda notificação quando um salto de rolagem
           atravessa a seção inteira. Sem ele, alguns navegadores entregam só o
           cruzamento de `limiar` ainda pelo topo e não notificam a saída final
           pelo lado oposto. */
        threshold: limiar === 0 ? 0 : [0, limiar],
        rootMargin: margem,
      },
    );
    obs.observe(el);

    /* Um salto programático pode ir do rodapé ao topo sem produzir um frame em
       que a seção intersecte (razão 0 antes e depois). O observador não tem
       cruzamento para notificar nesse caso; esta guarda cobre apenas o estado
       inequívoco "seção inteira abaixo da viewport", sem interferir na saída
       inferior nem na oscilação no rodapé. */
    let frameSalto = 0;
    const conferirSaltoAcima = () => {
      cancelAnimationFrame(frameSalto);
      frameSalto = requestAnimationFrame(() => {
        if (el.getBoundingClientRect().top >= window.innerHeight) marcar(false);
      });
    };
    if (reverterSomenteAcima) {
      window.addEventListener('scroll', conferirSaltoAcima, { passive: true });
    }

    return () => {
      obs.disconnect();
      cancelAnimationFrame(frameSalto);
      window.removeEventListener('scroll', conferirSaltoAcima);
    };
  }, [limiar, umaVez, reverterSomenteAcima, margem]);

  return { ref, dentro } as const;
}
