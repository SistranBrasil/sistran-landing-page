'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { DIFFERENTIALS } from '@/data/differentials';
import { getIcon } from '@/lib/icons';
import { useReducedMotion } from '@/lib/motion';

const DURATION_MS = 3800;

export default function PillarsCarousel() {
  const rm = useReducedMotion();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (rm || paused) return;
    timer.current = window.setTimeout(
      () => setI((n) => (n + 1) % DIFFERENTIALS.length),
      DURATION_MS,
    );
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [i, rm, paused]);

  const current = DIFFERENTIALS[i];
  const Icon = getIcon(current.icon);

  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-white/12 bg-gradient-to-br from-[#083156]/95 to-[#041D37]/95 p-7 backdrop-blur-xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-label="Pilares da Sistran em rotação"
    >
      {/* Gradient border reveal */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{
          padding: 1,
          background: `linear-gradient(135deg, ${current.color}88, transparent 60%)`,
          WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          transition: 'background 500ms ease',
        }}
      />
      {/* Orb by tone */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-30 blur-3xl transition-colors duration-700"
        style={{ background: current.color }}
      />

      {/* Header */}
      <div className="relative mb-6 flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0ed8f6]">
          Nossos pilares
        </span>
        <span className="text-[10px] font-semibold tabular-nums text-white/75">
          {String(i + 1).padStart(2, '0')} / {String(DIFFERENTIALS.length).padStart(2, '0')}
        </span>
      </div>

      {/* Slide */}
      <div className="relative min-h-[160px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={rm ? false : { opacity: 0, y: 12, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-4"
          >
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{
                background: `linear-gradient(135deg, ${current.color}30, ${current.color}0a)`,
                border: `1px solid ${current.color}66`,
                boxShadow: `0 8px 24px -12px ${current.color}88`,
              }}
            >
              <Icon className="h-7 w-7" style={{ color: current.color }} strokeWidth={1.8} />
            </div>
            <h3 className="font-display text-xl font-bold leading-tight text-white md:text-2xl">
              {current.title}
            </h3>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress bars / navigation */}
      <div className="relative mt-6 flex items-center gap-2">
        {DIFFERENTIALS.map((d, idx) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setI(idx)}
            aria-label={`Ver ${d.title}`}
            aria-current={idx === i ? 'true' : undefined}
            className="group relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/10"
          >
            <span
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                background: d.color,
                width: idx < i ? '100%' : idx === i ? '100%' : '0%',
                transformOrigin: 'left',
                transform: idx === i ? 'scaleX(1)' : idx < i ? 'scaleX(1)' : 'scaleX(0)',
                transition:
                  idx === i && !rm && !paused
                    ? `transform ${DURATION_MS}ms linear`
                    : 'transform 240ms ease',
              }}
            />
          </button>
        ))}
      </div>

      {/* Tiny list of all pillars (context) */}
      <ul className="relative mt-5 grid grid-cols-2 gap-1.5">
        {DIFFERENTIALS.map((d, idx) => (
          <li
            key={d.id}
            className="flex items-center gap-1.5 text-[11px] font-medium"
            style={{ color: idx === i ? '#fff' : 'rgba(255,255,255,0.45)' }}
          >
            <span
              className="h-1 w-1 rounded-full"
              style={{ background: idx === i ? d.color : 'rgba(255,255,255,0.35)' }}
            />
            {d.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
