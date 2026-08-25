'use client';

import { motion, useScroll } from 'motion/react';
import { useReducedMotion } from '@/lib/motion';

/**
 * Trilho de progresso da pagina: barra fina na borda esquerda que cresce com a
 * rolagem. É decoracao (`aria-hidden`) e nao captura ponteiro — quem precisa
 * saber onde esta usa a propria barra de rolagem do navegador.
 *
 * `scaleY` em vez de `height` para nao animar layout, e `transform-origin` no
 * topo para crescer para baixo. Com movimento reduzido o trilho aparece cheio e
 * estatico: nao é informacao, so ritmo.
 */
export default function ProgressoLateral() {
  const { scrollYProgress } = useScroll();
  const reduzido = useReducedMotion();

  return (
    <motion.span
      aria-hidden
      className="progresso-lateral"
      style={{ scaleY: reduzido ? 1 : scrollYProgress }}
    />
  );
}
