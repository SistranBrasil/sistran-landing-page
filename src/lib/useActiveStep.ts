'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Marca a etapa ativa de um scrollytelling usando a zona central da viewport.
 * Devolve também `setActive` para que clique e teclado tenham equivalência ao
 * scroll — sem isso a navegação por teclado percorreria as etapas sem que
 * nenhuma delas acendesse.
 *
 * Portado de `hooks/useActiveStep.ts` da apresentação de legado.
 */
export function useActiveStep(count: number) {
  const [active, setActive] = useState(0);
  const steps = useRef<Array<HTMLElement | null>>([]);

  const register = useCallback(
    (index: number) => (node: HTMLElement | null) => {
      steps.current[index] = node;
    },
    [],
  );

  useEffect(() => {
    const nodes = steps.current.filter((node): node is HTMLElement => Boolean(node));
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number((entry.target as HTMLElement).dataset.index);
          if (!Number.isNaN(index)) setActive(index);
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [count]);

  return { active, setActive, register };
}
