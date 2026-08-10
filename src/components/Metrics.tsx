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

  // Alternância em torno do eixo central: ímpares encostam o número no eixo
  // pela direita, pares pela esquerda. O número nunca vai para a borda da tela.
  const even = index % 2 === 0;

  return (
    <motion.li
      ref={liRef}
      initial={rm ? false : { opacity: 0, y: 32, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-80px 0px -80px 0px' }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className="group relative border-b border-[#0079CB]/12 py-3.5 last:border-b-0 md:py-4"
    >
      {/* Nó no eixo central, na altura do número: costura a métrica à linha
          vertical e cresce no hover. */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 hidden h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-500 group-hover:scale-150 md:block"
        style={{
          background: 'linear-gradient(135deg, #0ed8f6, #7c3aed)',
          boxShadow: '0 0 12px rgba(14,216,246,0.7)',
        }}
      />
      <div
        className={`flex flex-col gap-1.5 md:w-1/2 ${
          even
            ? 'items-start text-left md:items-end md:pr-8 md:text-right'
            : 'items-start text-left md:ml-auto md:pl-8'
        }`}
      >
        <div className={`flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#0079CB] ${even ? 'md:flex-row-reverse' : ''}`}>
          <span className="tabular-nums">{String(index + 1).padStart(2, '0')}</span>
          <span aria-hidden className={`h-px w-16 bg-gradient-to-r ${even ? 'md:bg-gradient-to-l' : ''} from-[#0079CB] to-transparent`} />
        </div>

        <div
          className="font-display font-black leading-[0.9] transition-transform duration-500 group-hover:scale-[1.04]"
          style={{
            fontVariantNumeric: 'tabular-nums',
            fontSize: 'clamp(2.25rem, 4.6vw, 4rem)',
            letterSpacing: '-0.055em',
            background: 'linear-gradient(135deg, #0079CB 0%, #0ed8f6 55%, #7c3aed 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'transparent',
            transformOrigin: even ? 'right center' : 'left center',
          }}
        >
          <span aria-hidden>{display}</span>
          <span aria-hidden className="text-[#0ed8f6]">{m.suffix}</span>
          <span className="sr-only">{m.value}{m.suffix}</span>
        </div>

        <p className="max-w-md text-base font-medium leading-relaxed text-[#3d5a80] md:text-lg">{m.label}</p>
      </div>
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
          <motion.span variants={vSubtitle} className="tag-section">
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
          {/* Eixo central com gradiente em movimento (utility .progress-line-v),
              mascarado nas pontas para não terminar em corte seco. */}
          <span
            aria-hidden
            className="progress-line-v pointer-events-none absolute left-1/2 top-0 hidden h-full w-[2px] -translate-x-1/2 opacity-60 md:block"
            style={{
              maskImage:
                'linear-gradient(180deg, transparent 0%, #000 10%, #000 90%, transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(180deg, transparent 0%, #000 10%, #000 90%, transparent 100%)',
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
