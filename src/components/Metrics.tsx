'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { METRICS } from '@/data/metrics';
import { vHeader, vTitle, vSubtitle, VP, useReducedMotion } from '@/lib/motion';

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [value, setValue] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;
    setValue(0);
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setValue(Math.round(target * easeOutCubic(p)));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [target, active, duration]);

  return value;
}

function MetricBig({ m, index }: { m: (typeof METRICS)[number]; index: number }) {
  const rm = useReducedMotion();
  const liRef = useRef<HTMLLIElement>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const el = liRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        setActive(e.isIntersecting);
      },
      { threshold: 0.35 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const v = useCountUp(m.value, active && !rm);
  const display = rm || !active ? (active ? m.value : 0) : v;
  const align = index % 2 === 0 ? 'items-start text-left' : 'items-end text-right';
  return (
    <motion.li
      ref={liRef}
      initial={rm ? false : { opacity: 0, y: 40, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-80px 0px -80px 0px' }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className={`relative flex flex-col gap-3 border-b border-[#0079CB]/12 py-10 md:py-14 last:border-b-0 ${align}`}
    >
      <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#0079CB]">
        <span className="tabular-nums">{String(index + 1).padStart(2, '0')}</span>
        <span aria-hidden className="h-px w-16 bg-gradient-to-r from-[#0079CB] to-transparent" />
      </div>
      <div
        className="font-display font-black leading-[0.9]"
        style={{
          fontVariantNumeric: 'tabular-nums',
          fontSize: 'clamp(4rem, 12vw, 10rem)',
          letterSpacing: '-0.055em',
          background: 'linear-gradient(135deg, #0079CB 0%, #0ed8f6 55%, #7c3aed 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          color: 'transparent',
        }}
      >
        <span aria-hidden>{display}</span>
        <span aria-hidden className="text-[#0ed8f6]">{m.suffix}</span>
        <span className="sr-only">{m.value}{m.suffix}</span>
      </div>
      <p className="max-w-md text-base font-medium leading-relaxed text-[#3d5a80] md:text-lg">{m.label}</p>
    </motion.li>
  );
}

export default function Metrics() {
  const rm = useReducedMotion();

  return (
    <section id="resultados" className="section-py relative overflow-hidden">
      <div className="container-lp">
        <motion.div
          variants={vHeader}
          initial={rm ? false : 'hidden'}
          whileInView="visible"
          viewport={VP}
          className="mb-16 max-w-2xl"
        >
          <motion.span variants={vSubtitle} className="eyebrow">
            Resultados acumulados
          </motion.span>
          <motion.h2 variants={vTitle} className="mt-3 font-display text-section font-bold text-ink">
            Números que traduzem <span className="text-gradient-brand">nossa entrega</span>
          </motion.h2>
          <motion.p variants={vSubtitle} className="mt-4 max-w-xl text-base text-ink-muted">
            Métricas acumuladas ao longo da trajetória da Sistran no mercado segurador.
          </motion.p>
        </motion.div>

        <div className="relative">
          {/* Linha técnica vertical conectando */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 md:block"
            style={{
              background:
                'linear-gradient(180deg, transparent 0%, rgba(0,121,203,0.35) 15%, rgba(14,216,246,0.4) 50%, rgba(124,58,237,0.3) 85%, transparent 100%)',
            }}
          />
          <ul className="relative">
            {METRICS.map((m, i) => (
              <MetricBig key={m.id} m={m} index={i} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
