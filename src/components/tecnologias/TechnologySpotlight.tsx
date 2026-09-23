'use client';

/**
 * O destaque central: três plataformas, uma ativa, troca automática (itens 4 e 5).
 *
 * ── O QUE O REACT FAZ, E O QUE ELE NÃO FAZ ──────────────────────────────────
 * Ele decide QUAL das três está ativa e publica `data-pos` em cada painel (−1, 0,
 * 1). Não escreve `transform`, não escreve `opacity`, não mede nada: a folha tem
 * uma regra por posição e a `transition` de 650ms interpola. Custo: uma
 * re-renderização a cada 4s, nenhuma por quadro — o que o item 9 pede quando fala
 * de `transform`/`opacity` e de evitar reflow.
 *
 * ── UM TIMER SÓ ─────────────────────────────────────────────────────────────
 * `useEffect` com `[ativo, pausado]`: cada troca agenda o próximo passo e o
 * anterior é limpo pela função de limpeza. Não há `setInterval` correndo em
 * paralelo, e com `pausado` o efeito simplesmente não agenda — em vez de agendar e
 * descartar, que é o que faz um intervalo continuar consumindo quadro com a aba
 * escondida.
 *
 * ── NENHUM CONTROLE, e é proposital ─────────────────────────────────────────
 * Não existe seta, bolinha, barra, contador nem botão de play/pause neste arquivo.
 * A lista do item 5 é explícita e é critério de aceite. A pausa é por HOVER na
 * área central, que o doc pede, e não por botão.
 *
 * Também não há arrasto nem teclas de seta (o componente antigo tinha os dois):
 * ambos são «controles do carrossel», e sem indicação visual eles seriam affordance
 * invisível. Quem não pode esperar a troca alcança as três legendas pelo DOM — os
 * três painéis estão sempre montados, e só as laterais têm a tinta da legenda
 * suprimida.
 */

import { useEffect, useState } from 'react';
import TechnologyLogo from './TechnologyLogo';
import { TECNOLOGIAS_DESTAQUE, TECNOLOGIA_INICIAL } from '@/data/tecnologias';

/* O intervalo da troca do painel central.

   `docs/tecnologia.md` (item 5) escreve «4 segundos», e foi o que entrou na
   primeira versão. A usuária pediu depois, olhando a seção montada, que «os
   grandes do meio demorem menos tempo para mudar» — então 2600ms, decisão dela
   sobre a letra do doc. Continua acima do limiar em que a transição de 650ms
   passa a emendar na seguinte (a troca leva 650ms e sobram ~2s de leitura do
   painel parado), e continua sem controles: quem quiser segurar usa o hover. */
const TROCA_MS = 2600;

const TOTAL = TECNOLOGIAS_DESTAQUE.length;

const TAMANHOS = '(max-width: 767px) 70vw, (max-width: 1023px) 260px, 300px';

/**
 * Posição de cada painel em relação ao ativo, no anel de três.
 *
 * Circular: da última para a primeira é UM passo, que é o «recomeçar em Pega» da
 * sequência do doc. Com `TOTAL === 3` o resultado é sempre −1, 0 ou 1 — nunca há
 * item «fora», e por isso a folha só precisa de três regras.
 */
function posicao(indice: number, ativo: number): -1 | 0 | 1 {
  return (((indice - ativo + 1 + TOTAL) % TOTAL) - 1) as -1 | 0 | 1;
}

export default function TechnologySpotlight({ abaOculta }: { abaOculta: boolean }) {
  /* `TECNOLOGIA_INICIAL` aponta para a AWS — o estado de abertura que o doc
     descreve e o mock mostra («AWS ativa no centro, Pega à esquerda, Salesforce à
     direita»). O valor vem do dado, não daqui. */
  const [ativo, setAtivo] = useState(TECNOLOGIA_INICIAL);
  const [sobre, setSobre] = useState(false);

  /* Hover na área central pausa (item 5) e a aba inativa pausa (item 9). O
     segundo caso não poderia ser resolvido só em CSS como nas faixas: um
     `setTimeout` não conhece `animation-play-state`. */
  const pausado = sobre || abaOculta;

  useEffect(() => {
    if (pausado) return;
    const t = window.setTimeout(() => setAtivo((i) => (i + 1) % TOTAL), TROCA_MS);
    return () => window.clearTimeout(t);
  }, [ativo, pausado]);

  return (
    <div
      className="tec-destaque"
      /* «Pausar quando o usuário mantiver o mouse sobre a área central. Retomar
         automaticamente quando o mouse sair.» Os eventos de PONTEIRO cobrem mouse
         e caneta; o toque não dispara `pointerleave` de forma confiável, e ali a
         troca continuar é o comportamento certo (não há cursor parado sobre a
         área). O par de foco entra junto porque quem chega por teclado ao painel
         precisa do mesmo tempo que quem chega pelo mouse. */
      onPointerEnter={() => setSobre(true)}
      onPointerLeave={() => setSobre(false)}
      onFocusCapture={() => setSobre(true)}
      onBlurCapture={() => setSobre(false)}
    >
      {TECNOLOGIAS_DESTAQUE.map((tec, i) => {
        const pos = posicao(i, ativo);
        return (
          <article
            className="tec-destaque__item"
            key={tec.id}
            data-pos={pos}
            /* O painel ativo é o único que o leitor de tela anuncia como corrente;
               as laterais seguem no DOM (o conteúdo nunca desaparece) mas sem a
               marca, para que a troca não se leia como três itens simultâneos. */
            aria-current={pos === 0 || undefined}
            style={tec.cor ? ({ '--tec-cor-marca': tec.cor } as React.CSSProperties) : undefined}
          >
            <TechnologyLogo tec={tec} className="tec-destaque__logo" tamanhos={TAMANHOS} />
            {/* Decorativa: a linha é pintura, e a informação está na categoria. */}
            <span className="tec-destaque__linha" aria-hidden="true" />
            <p className="tec-destaque__categoria">{tec.categoria}</p>
          </article>
        );
      })}
    </div>
  );
}
