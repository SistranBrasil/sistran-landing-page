'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { useReducedMotion } from '@/lib/motion';

/**
 * SIS-140 item 3 — o foguete que acompanha a rolagem atrás das escritas de SOCIAL.
 *
 * O MOTIVO NÃO É INVENTADO (ponto de atenção 6). O selo do Projeto Gerando
 * Talentos, que está nesta mesma seção, tem um ônibus espacial decolando: tanque
 * externo ao centro, dois foguetes auxiliares nas laterais, o orbitador branco à
 * frente e um rastro azul em arco saindo pela esquerda. A silhueta abaixo é esse
 * desenho, simplificado — a issue pede para reaproveitar a silhueta em SVG, e o
 * selo é um `.webp` (raster), então não havia vetor para extrair: o caminho foi
 * traçado a partir dele. O que se preservou é o que identifica o motivo: as três
 * colunas (tanque + dois auxiliares), o nariz único, as três chamas e o arco do
 * rastro. Não é um foguete de foguetinho genérico, é AQUELE.
 *
 * POR QUE ELE É SÓ BRANCO — e isto é o item 5 dos pontos de atenção resolvido por
 * construção, não por sorte. A seção é clara (`section-light-blue`: gradiente de
 * `#f2f9fe` a `#cfe7f7`) e o texto dela é navy (`text-ink` #0a1f44) e azul-acinzentado
 * (`text-ink-muted` #3d5a80). Numa seção clara com tinta escura, TODA camada que
 * escurece o fundo derruba o contraste do texto, e toda camada que o clareia só
 * pode aumentá-lo: `#3d5a80` dá 5,57:1 sobre `#cfe7f7` e 7,16:1 sobre branco puro.
 * Então a silhueta não tem contorno, não tem tinta azul e não tem sombra — é
 * branco translúcido e nada mais. Um foguete azul passando atrás de parágrafo
 * navy era exatamente o defeito que o ponto de atenção descreve; com camada que só
 * clareia, o pior ponto do trajeto é melhor que o fundo sem foguete nenhum.
 *
 * POR QUE NÃO HÁ `setState` AQUI (ponto de atenção 5, segunda metade). O progresso
 * vira `MotionValue` e o `motion.div` escreve o `transform` direto no nó do DOM,
 * fora do ciclo de render do React — zero commit por quadro. É o mesmo caminho do
 * `TituloAceso`, e é a alternativa ao erro que o `PartnersTrail.tsx` documenta
 * ("Maximum update depth exceeded", de atualizar estado a cada quadro de rolagem).
 *
 * Acessibilidade e movimento reduzido: `aria-hidden` (é decoração, não informa
 * nada), `pointer-events: none` (não rouba clique do que está atrás/à frente) e
 * `z-index: -1` dentro de um pai `isolate`, o que o põe acima do fundo da seção e
 * abaixo de todo o conteúdo em fluxo. Com `prefers-reduced-motion: reduce` ele
 * para — e para VISÍVEL, no meio do trajeto, nunca fora da tela nem transparente.
 */
export default function FogueteScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const reduzido = useReducedMotion();

  /* `start end` → `end start`: o progresso cobre toda a travessia da seção pela
     janela, então o foguete tem curso inteiro em vez de só o pedaço central. */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  /* Sobe da base para o topo. Com movimento reduzido os três intervalos viram
     constantes: ele fica parado no meio do caminho, visível, sem trocar a árvore
     renderizada (o que evitaria o mismatch de hidratação — `useReducedMotion` só
     conhece a preferência no cliente). */
  const y = useTransform(scrollYProgress, [0, 1], reduzido ? ['-6%', '-6%'] : ['32%', '-44%']);
  /* Deriva lateral pequena: um voo reto lê como sprite subindo, um voo com desvio
     lê como trajetória. 4% da largura da caixa, não mais. */
  const x = useTransform(scrollYProgress, [0, 0.5, 1], reduzido ? ['0%', '0%', '0%'] : ['0%', '4%', '0%']);
  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], reduzido ? [8, 8, 8] : [14, 6, 2]);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute right-[6%] top-1/2 w-[168px] -translate-y-1/2 md:right-[9%] md:w-[232px]"
        style={{ x, y, rotate }}
      >
        <svg viewBox="0 0 120 300" fill="none" className="h-auto w-full">
          {/* O rastro em arco do selo, saindo pela esquerda e para baixo. Mais
              apagado que o corpo: é esteira, não estrutura. */}
          <path
            d="M50 214c-16 14-34 22-49 21 15 12 37 9 56-4z"
            fill="#ffffff"
            fillOpacity="0.46"
          />
          {/* As três chamas. Ficam abaixo do corpo e são as partes mais fracas —
              no selo elas são o degradê que se dissolve. */}
          <g fill="#ffffff" fillOpacity="0.78">
            <path d="M38 188c4.5 11 4.5 24 0 37-4.5-13-4.5-26 0-37z" />
            <path d="M82 188c4.5 11 4.5 24 0 37-4.5-13-4.5-26 0-37z" />
            <path d="M60 202c5.5 13 5.5 28 0 43-5.5-15-5.5-30 0-43z" />
          </g>
          {/* Corpo: tanque central, os dois auxiliares e o orbitador. São formas
              SOBREPOSTAS de uma cor só — a união é a silhueta, então o encaixe
              entre elas não precisa ser exato, e não há costura visível. */}
          <g fill="#ffffff" fillOpacity="0.78">
            <path d="M38 62c4.5 0 8 6 8 13v115H30V75c0-7 3.5-13 8-13z" />
            <path d="M82 62c4.5 0 8 6 8 13v115H74V75c0-7 3.5-13 8-13z" />
            <path d="M60 24c7.5 0 13 9 13 21v157H47V45c0-12 5.5-21 13-21z" />
            <path d="M60 40c6 0 10 12 10 26v72l17 27H33l17-27V66c0-14 4-26 10-26z" />
          </g>
        </svg>
      </motion.div>
    </div>
  );
}
