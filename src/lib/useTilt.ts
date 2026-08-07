'use client';

import { useState } from 'react';

/**
 * Tilt 3D seguindo o cursor — receita do MetricCard
 * (.claude/skills/sistran-labs-pattern/reference/dynamic-components.md, item 1).
 *
 * Retorna `hover`, a posição normalizada do mouse (0–1) e os handlers para
 * espalhar no elemento. Passe `enabled: false` (prefers-reduced-motion) para
 * desligar sem alterar a árvore de componentes.
 *
 * IMPORTANTE: aplique o transform num elemento próprio. Se o mesmo nó também
 * for animado por motion (`y`, `scale`), o `style.transform` sobrescreve o
 * transform do motion e a animação de entrada não acontece.
 */
export function useTilt(enabled = true) {
  const [hover, setHover] = useState(false);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });

  const handlers = enabled
    ? {
        onMouseEnter: () => setHover(true),
        onMouseLeave: () => {
          setHover(false);
          setMouse({ x: 0.5, y: 0.5 });
        },
        onMouseMove: (e: React.MouseEvent) => {
          const r = e.currentTarget.getBoundingClientRect();
          setMouse({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
        },
      }
    : {};

  /** Transform de tilt pronto para `style.transform`. */
  const tiltTransform = (opts?: { lift?: number; deg?: number; perspective?: number }) => {
    const { lift = 6, deg = 7, perspective = 900 } = opts ?? {};
    if (!enabled || !hover) return `translateY(0) perspective(${perspective}px)`;
    return `translateY(-${lift}px) perspective(${perspective}px) rotateX(${
      (mouse.y - 0.5) * -deg
    }deg) rotateY(${(mouse.x - 0.5) * deg}deg)`;
  };

  return { hover, mouse, handlers, tiltTransform };
}
