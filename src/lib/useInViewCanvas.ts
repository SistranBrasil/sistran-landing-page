'use client';

import { useEffect, type RefObject } from 'react';

type DrawArgs = {
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
  time: number;
};

/**
 * Canvas 2D com ciclo de vida completo:
 * - dimensiona por devicePixelRatio limitado a 2;
 * - só desenha enquanto visível (IntersectionObserver);
 * - congela em um único frame sob reduced motion;
 * - encerra o RAF e o observer ao desmontar.
 *
 * Portado de `hooks/useInViewCanvas.ts` da apresentação de legado.
 */
export function useInViewCanvas(
  ref: RefObject<HTMLCanvasElement | null>,
  draw: (args: DrawArgs) => void,
  options: { animate?: boolean } = {},
) {
  const animate = options.animate ?? true;

  useEffect(() => {
    const canvas = ref.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    /* Duas fontes de verdade, como no resto do site: a preferência do sistema e
       a escolha explícita gravada em `<html data-motion>`. */
    const reduced =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.dataset.motion === 'reduce';
    const loop = animate && !reduced;
    let frame = 0;
    let visible = false;
    let time = 0;

    const render = () => {
      draw({ context, width: canvas.width, height: canvas.height, time });
    };

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = parent.clientWidth;
      const height = parent.clientHeight;
      canvas.width = Math.max(1, Math.round(width * ratio));
      canvas.height = Math.max(1, Math.round(height * ratio));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      render();
    };

    const tick = () => {
      if (!visible) return;
      time += 0.006;
      render();
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(frame);
      if (!visible) return;
      if (loop) tick();
      else render();
    });

    observer.observe(parent);
    resize();
    window.addEventListener('resize', resize);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, [ref, draw, animate]);
}
