'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';

/**
 * Wrapper do Hero: o Hero fica sticky por 200vh e, conforme o scroll avança,
 * sofre scale + fade + blur suave, dando a sensação de "afundar" antes da
 * próxima seção aparecer.
 *
 * Requer `overflow-x: clip` (não `hidden`) nos ancestrais — `hidden` cria um
 * scroll container e quebra o `position: sticky`.
 */
export default function HeroScrollWrapper({ children }: { children: React.ReactNode }) {
  const rm = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.86]);
  const opacity = useTransform(scrollYProgress, [0, 0.55, 1], [1, 0.85, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const filter = useTransform(
    scrollYProgress,
    [0, 0.7, 1],
    ['blur(0px)', 'blur(0px)', 'blur(6px)'],
  );

  if (rm) return <>{children}</>;

  return (
    <div ref={ref} style={{ height: '200vh', position: 'relative' }}>
      <motion.div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          scale,
          opacity,
          y,
          filter,
          transformOrigin: '50% 40%',
          willChange: 'transform, opacity, filter',
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
