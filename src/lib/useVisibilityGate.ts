'use client';

import { useEffect, useRef } from 'react';
import type { MotionValue } from 'motion/react';

/**
 * Esconde de verdade um elemento que a opacidade já levou a zero.
 *
 * `opacity: 0` continua recebendo clique e foco: um bloco "invisível" empilhado
 * sobre outro rouba o alvo do mouse e aparece na navegação por Tab. Isto observa
 * a MotionValue de opacidade e escreve `visibility` no nó — imperativamente, e
 * não via `style`, porque passar `visibility` como MotionValue faz o Motion
 * tentar interpolá-la ("Offsets must be monotonically non-decreasing").
 *
 * Com `enabled: false` (movimento reduzido) nada é escrito: o elemento fica
 * visível, que é o estado final correto.
 */
export function useVisibilityGate<T extends HTMLElement>(
  opacity: MotionValue<number>,
  enabled = true,
  threshold = 0.02,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!enabled) {
      node.style.visibility = '';
      return;
    }

    const apply = (value: number) => {
      node.style.visibility = value < threshold ? 'hidden' : 'visible';
    };

    apply(opacity.get());
    return opacity.on('change', apply);
  }, [opacity, enabled, threshold]);

  return ref;
}
