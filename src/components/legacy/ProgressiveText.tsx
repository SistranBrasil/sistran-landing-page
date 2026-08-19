'use client';

import { motion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { useRef, type ElementType } from 'react';
import { useReducedMotion } from '@/lib/motion';

type Props = {
  text: string;
  className?: string;
  as?: ElementType;
  id?: string;
};

/**
 * Texto progressivo por palavra: o progresso do scroll acende cada token,
 * mapeando apenas opacidade (sem transform). O texto completo fica no DOM na
 * ordem de leitura e, sob reduced motion ou sem JS, aparece inteiro.
 * Limitado a frases curtas — cada palavra adiciona um nó.
 *
 * Diferente da fonte, `reduced` não troca a árvore renderizada: aqui o hook
 * devolve a preferência real já no primeiro render do cliente, e um
 * `if (reduced) return <Tag>…` remontaria a subárvore (ver a nota em
 * `@/lib/motion`). Com movimento reduzido o intervalo do `useTransform` vira
 * constante e todas as palavras nascem opacas — mesmo resultado, mesma árvore.
 */
export function ProgressiveText({ text, className, as, id }: Props) {
  const Tag = (as ?? 'p') as ElementType;
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 88%', 'end 45%'] });

  const words = text.split(' ');

  return (
    <Tag ref={ref} id={id} className={className} aria-label={text}>
      {words.map((word, index) => (
        // O espaço vive FORA do span: dentro de um inline-block o browser
        // descarta o whitespace final e as palavras colam umas nas outras.
        <span key={`${word}-${index}`}>
          <Token
            word={word}
            index={index}
            total={words.length}
            progress={scrollYProgress}
            reduced={reduced}
          />
          {index < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  );
}

function Token({
  word,
  index,
  total,
  progress,
  reduced,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  const start = (index / total) * 0.8;
  const end = Math.min(start + 0.22, 1);
  const opacity = useTransform(progress, [start, end], reduced ? [1, 1] : [0.22, 1]);

  return (
    <motion.span aria-hidden="true" style={{ opacity, display: 'inline-block' }}>
      {word}
    </motion.span>
  );
}
