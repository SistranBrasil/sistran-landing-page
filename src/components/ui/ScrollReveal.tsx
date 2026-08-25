'use client';

import { motion } from 'motion/react';
import type { CSSProperties, ReactNode } from 'react';
import { useReducedMotion } from '@/lib/motion';

/**
 * Entrada por rolagem para blocos de conteudo.
 *
 * Duas regras vindas de `.claude/skills/scroll-orchestrated-lp`:
 *
 * 1. `whileInView` com `once`, nunca `initial` puro. Cartao e lista sao
 *    conteudo: se a animacao morrer no meio, o estado final tem de ser o
 *    visivel, senao o texto desaparece para sempre.
 * 2. A arvore nao muda com a preferencia de movimento. Com movimento reduzido
 *    as variantes viram o mesmo objeto (opacidade 1, sem deslocamento) — mesmo
 *    DOM, mesmos nos, sem risco de hidratacao.
 *
 * So `transform` e `opacity` sao animados. O `indice` escalona a cascata sem
 * precisar de um pai orquestrador, o que deixa cada item independente do
 * momento em que entra na tela.
 */

const EASE_MARCA = [0.22, 1, 0.36, 1] as const;
const PASSO = 0.07; // atraso entre itens vizinhos
const ATRASO_MAX = 0.42; // teto: com 10 cartoes o ultimo nao pode chegar tarde

type Props = {
  children: ReactNode;
  /** Posicao do item na lista; define o atraso da cascata. */
  indice?: number;
  /** Distancia percorrida na entrada, em pixels. */
  distancia?: number;
  /** Tag semantica do no animado; o elemento certo depende do contexto (li em
      lista, article em cartao autonomo), e trocar a tag nao muda a animacao. */
  as?: keyof typeof TAGS;
  className?: string;
  style?: CSSProperties;
};

const TAGS = {
  div: motion.div,
  li: motion.li,
  article: motion.article,
  section: motion.section,
} as const;

export default function ScrollReveal({
  children,
  indice = 0,
  distancia = 22,
  as = 'div',
  className,
  style,
}: Props) {
  const reduzido = useReducedMotion();
  const Tag = TAGS[as];

  return (
    <Tag
      className={className}
      style={style}
      initial={
        reduzido
          ? { opacity: 1, y: 0, scale: 1, clipPath: 'inset(0% 0% 0% 0%)' }
          : {
              opacity: 0,
              y: distancia,
              scale: 0.97,
              /* Cortina: o cartao é revelado de cima para baixo. Mesmo tipo de
                 forma no inicio e no fim (`inset`), senao a interpolacao nao
                 acontece. */
              clipPath: 'inset(0% 0% 32% 0%)',
            }
      }
      whileInView={{ opacity: 1, y: 0, scale: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={{ once: true, amount: 0.2, margin: '-40px' }}
      transition={
        reduzido
          ? { duration: 0 }
          : {
              duration: 0.7,
              ease: EASE_MARCA,
              delay: Math.min(indice * PASSO, ATRASO_MAX),
            }
      }
    >
      {children}
    </Tag>
  );
}
