'use client';

import { animate, motion, useInView, useMotionValue, useTransform } from 'motion/react';
import { useEffect, useRef } from 'react';
import { easeExpo, useReducedMotion } from '@/lib/motion';

type Props = {
  /** Valor final, como está escrito no conteúdo ("10", "1"…). */
  value: string;
  className?: string;
  /** Duração da contagem em segundos. */
  duration?: number;
  /**
   * Texto anunciado por leitor de tela. Padrão: `value`. Passe a frase completa
   * quando houver sufixo ao lado ("40+"), senão a unidade não é lida.
   * `null` desliga o `.sr-only` daqui — use quando quem chama já tem o seu.
   */
  srText?: string | null;
};

/**
 * Contagem de 0 até o valor, disparada quando o número entra na tela.
 *
 * `useInView` sem `once` de propósito: ao sair e voltar, a contagem zera e roda
 * de novo. Sem o `count.set(0)` na saída, o número voltaria já cheio e a
 * segunda passagem não teria efeito.
 *
 * O texto animado vive num MotionValue, não em estado React: a cada frame o
 * Motion escreve direto no nó, sem re-render da lista de métricas — que é a
 * diferença em relação ao `useCountUp` com `useState` por frame.
 *
 * O valor lido por leitor de tela é o final, sempre, num `.sr-only`. A parte
 * que anima é `aria-hidden` — números correndo em região viva seriam anunciados
 * dezenas de vezes.
 *
 * Valor não numérico ("1,5 mil") volta como texto, sem contagem.
 */
export function CountUp({ value, className, duration = 1.4, srText }: Props) {
  const target = Number(value);
  const ref = useRef<HTMLSpanElement>(null);
  // `amount: 0.6` para a contagem começar com o número claramente em cena, não
  // ao encostar a primeira linha de pixels na borda.
  const inView = useInView(ref, { amount: 0.6 });
  const reduced = useReducedMotion();
  const count = useMotionValue(0);
  const text = useTransform(count, (current) => Math.round(current).toString());

  useEffect(() => {
    if (Number.isNaN(target)) return;

    /* A contagem é a informação em si, mas sob movimento reduzido o número
       aparece pronto — o conteúdo continua acessível sem movimento. */
    if (reduced) {
      count.set(target);
      return;
    }

    if (!inView) {
      count.set(0);
      return;
    }

    const controls = animate(count, target, { duration, ease: easeExpo });
    return () => controls.stop();
  }, [count, duration, inView, reduced, target]);

  if (Number.isNaN(target)) {
    return <span className={className}>{value}</span>;
  }

  return (
    <span ref={ref} className={className}>
      {srText === null ? null : <span className="sr-only">{srText ?? value}</span>}
      {/* Largura reservada pelo número final: contando 0 → 10 o texto passa de
          um para dois dígitos, e sem a reserva a unidade ao lado escorregaria
          durante a contagem. */}
      <motion.span
        aria-hidden="true"
        style={{ display: 'inline-block', minWidth: `${value.length}ch` }}
      >
        {text}
      </motion.span>
    </span>
  );
}
