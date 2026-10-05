'use client';

import { useEffect, useRef, useState } from 'react';

import { LIMIAR_REVEAL, MARGEM_REVEAL } from '@/lib/reveal-calibre';

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
  /**
   * SIS-263 (2ª volta) — só começa a observar quando isto é `true`.
   *
   * Existe por um defeito MEDIDO em `/contato`: um bloco que já está na primeira
   * dobra intersecta a janela ENQUANTO a cortina do `RouteLoadGate` ainda está de
   * pé. O observador então acende atrás da cortina, a transição termina no escuro,
   * e quando a cortina levanta o bloco já está parado no estado final — a entrada
   * existiu e ninguém viu. Com o gatilho esperando a liberação da rota, o que a
   * pessoa vê depois do carregamento é o conteúdo SURGINDO.
   *
   * Padrão `true` para não mudar nenhuma outra rota: quem não passa nada continua
   * observando desde a montagem, que é o comportamento das SIS-193/195.
   */
  pronto?: boolean;
};

/* 02/10 · SIS-307 — OS PADRÕES VÊM DO CALIBRE CANÔNICO, e não mais de literais
   daqui. Eram `0.2` e `'0px 0px -12% 0px'`, escritos à mão, enquanto
   `src/lib/reveal-calibre.ts` dizia `0.15`/`-12%` e quatro rotas reexportavam
   dele: quem não passava opção explícita acendia numa geometria que NENHUM
   arquivo de calibre descrevia. O pedido «os efeitos tão rápidos conforme o
   scroll» precisa valer para esses chamadores também, e com dois números em dois
   lugares ele valeria só para metade do site. A razão de cada número está no
   docblock do canônico. */
/* 05/10 · SIS-242 — A REDE DE SEGURANÇA, e por que ela é medida sobre a JANELA.
   O critério 4 da issue é «scroll rápido: nenhum bloco marcado permanece
   `opacity: 0` com a caixa já majoritariamente na viewport». O limiar sozinho não
   consegue garantir isso, e não é questão de afiná-lo: ele é fração do ELEMENTO,
   e num bloco mais alto que a dobra a razão de interseção NUNCA alcança valores
   altos — um `<section>` de 2000px numa janela de 900px satura em 0.45. Então
   existe uma faixa de estados em que o bloco enche a tela inteira e a condição de
   ignição ainda pode não ter sido satisfeita.
   `FRACAO_JANELA_REVEAL` fecha essa faixa pelo outro eixo: quanto da JANELA a
   parte visível do bloco ocupa. Um quarto da dobra coberto pelo bloco é a
   definição operacional de «a pessoa está olhando para ele», independe da altura
   dele, e é o que torna o critério 4 verificável em vez de aproximado.
   25% e não 50%: com 50% um bloco de altura média (metade da dobra) só entraria
   pela rede quando estivesse inteiro em cena, tarde demais para servir de rede. */
const FRACAO_JANELA_REVEAL = 0.25;

export function useRevealTrigger<T extends HTMLElement = HTMLDivElement>({
  limiar = LIMIAR_REVEAL,
  umaVez = true,
  reverterSomenteAcima = false,
  margem = MARGEM_REVEAL,
  pronto = true,
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

    /* Esperando a rota liberar: o bloco fica no estado ESCONDIDO e sem
       observador. Escrever `false` antes de sair é o que garante que, quando
       `pronto` virar `true`, exista transição para assistir — se ficasse sem
       atributo, a folha não casaria e o bloco apareceria pronto, sem entrada.
       A cortina cobre a tela nesse intervalo, então nada disto é visível. */
    if (!pronto) return;

    const obs = new IntersectionObserver(
      ([entrada]) => {
        /* `isIntersecting` sozinho fica verdadeiro mesmo abaixo do `threshold`.
           A razão é o que representa de fato o cruzamento do gatilho. */
        /* 05/10 · SIS-242 — a rede de segurança entra como OU, não substitui o
           limiar: o limiar continua sendo o gatilho normal (e é ele que dá a
           leitura de «o bloco entrou»); a fração da janela só acende o que o
           limiar não conseguiria alcançar. Os dois números saem da MESMA
           `entrada`, então a rede não custa medição nem ouvinte nenhum — era a
           alternativa óbvia e teria posto um `getBoundingClientRect` por nó por
           quadro de rolagem, com ~100 escopos no site. */
        const alturaDaRaiz = entrada.rootBounds?.height ?? 0;
        const fracaoDaJanela =
          alturaDaRaiz > 0 ? entrada.intersectionRect.height / alturaDaRaiz : 0;
        const atingiuLimiar =
          entrada.isIntersecting &&
          (entrada.intersectionRatio >= limiar ||
            fracaoDaJanela >= FRACAO_JANELA_REVEAL);

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
        /* 05/10 · SIS-242 — A ESCADA DE PONTOS DE AMOSTRAGEM, e ela é o que faz a
           rede de segurança acima FUNCIONAR. Era `[0, limiar]`.
           O observador só chama de volta em CRUZAMENTO de `threshold`: com dois
           pontos, uma rolagem que para entre eles não produz chamada nenhuma, e a
           rede — que vive dentro da função de retorno — nunca é avaliada. É
           exatamente o sintoma do título da issue: o nó fica em `data-in="false"`
           e só acende quando a pessoa rola DE NOVO, porque é o movimento seguinte
           que gera o cruzamento que faltava.
           Os pontos extras são todos ACIMA do limiar (0.04), então nenhum deles
           pode disparar a reversão: numa chamada em 0.25, 0.5 ou 0.75 a razão já
           é ≥ limiar e o ramo que marca `false` não é alcançado. Em bloco mais
           alto que a dobra os pontos superiores simplesmente nunca são cruzados,
           e o navegador não cobra por isso.
           `Set` + `sort` porque `threshold` não aceita repetido nem fora de ordem,
           e `limiar` pode coincidir com um ponto da escada (é o caso de
           `LIMIAR_REVEAL_BLOCO`, hoje 0.24, vizinho de 0.25). O `limiar === 0`
           deixou de precisar de ramo próprio: com `Set`, zero é só um ponto que
           já estava lá. */
        threshold: Array.from(
          new Set([0, limiar, 0.25, 0.5, 0.75, 1]),
        ).sort((a, b) => a - b),
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
  }, [limiar, umaVez, reverterSomenteAcima, margem, pronto]);

  return { ref, dentro } as const;
}
