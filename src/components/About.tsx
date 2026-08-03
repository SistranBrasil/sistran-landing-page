'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { vHeader, vTitle, vSubtitle, VP, useReducedMotion } from '@/lib/motion';

const HIGHLIGHTS = [
  { value: '1988', label: 'Ano de fundação', num: 1988, suffix: '', start: 1900 },
  { value: '850+', label: 'Profissionais', num: 850, suffix: '+', start: 0 },
  { value: '3', label: 'Unidades no Brasil', num: 3, suffix: '', start: 0 },
];

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function CountUpNumber({
  target,
  start,
  suffix,
  active,
  color,
}: {
  target: number;
  start: number;
  suffix: string;
  active: boolean;
  color: string;
}) {
  const rm = useReducedMotion();
  const [val, setVal] = useState(rm ? target : start);
  useEffect(() => {
    if (!active || rm) return;
    setVal(start);
    const dur = 1600;
    const t0 = performance.now();
    let id = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      setVal(Math.round(start + (target - start) * easeOut(p)));
      if (p < 1) id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [active, rm, start, target]);
  return (
    <span
      className="font-display font-black leading-none tabular-nums"
      style={{
        fontSize: 'clamp(3rem, 7vw, 5.5rem)',
        letterSpacing: '-0.045em',
        background: `linear-gradient(135deg, ${color} 0%, #0ed8f6 60%, #7c3aed 100%)`,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        color: 'transparent',
      }}
    >
      <span aria-hidden>
        {val}
        {suffix}
      </span>
    </span>
  );
}

export default function About() {
  const rm = useReducedMotion();
  const railRef = useRef<HTMLDivElement>(null);
  const [countActive, setCountActive] = useState(false);
  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        setCountActive(e.isIntersecting);
      },
      { threshold: 0.25 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <section id="quem-somos" className="section-py relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="orb orb-cyan orb-drift-slow -left-24 top-24 h-[380px] w-[380px] opacity-50" />
        <div className="orb orb-violet orb-drift right-[-6%] bottom-10 h-[420px] w-[420px] opacity-40" />
      </div>

      <div className="container-lp">
        {/* Layout editorial assimétrico: título à esquerda, texto deslocado à direita */}
        <div className="grid grid-cols-1 gap-x-16 gap-y-10 lg:grid-cols-12">
          <motion.div
            variants={vHeader}
            initial={rm ? false : 'hidden'}
            whileInView="visible"
            viewport={VP}
            className="lg:col-span-5 lg:col-start-1"
          >
            <motion.span variants={vSubtitle} className="eyebrow">
              Quem somos
            </motion.span>
            <motion.h2
              variants={vTitle}
              className="mt-4 font-display font-bold text-ink"
              style={{
                fontSize: 'clamp(2.25rem, 4.6vw, 4rem)',
                lineHeight: 1.02,
                letterSpacing: '-0.032em',
              }}
            >
              Especialistas em <span className="text-gradient-brand">tecnologia</span> para seguradoras
            </motion.h2>
          </motion.div>

          <motion.div
            variants={vHeader}
            initial={rm ? false : 'hidden'}
            whileInView="visible"
            viewport={VP}
            className="lg:col-span-6 lg:col-start-7 lg:pt-4"
          >
            <motion.p
              variants={vSubtitle}
              className="max-w-xl text-lg leading-relaxed text-ink-muted md:text-xl"
            >
              Há mais de três décadas transformando processos, sistemas e operações de seguradoras no
              Brasil e no exterior. Combinamos domínio profundo do negócio com tecnologia pragmática
              para entregar resultados mensuráveis.
            </motion.p>
            <motion.p variants={vSubtitle} className="mt-5 max-w-xl text-base leading-relaxed text-ink-muted">
              Da subscrição ao sinistro, do vida ao P&amp;C, da sustentação ao delivery de novos
              produtos: nosso time atua no core do negócio das principais seguradoras do país.
            </motion.p>
          </motion.div>
        </div>

        {/* Régua horizontal de indicadores */}
        <motion.div
          ref={railRef}
          initial={rm ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-20 md:mt-28"
        >
          {/* linha gradient horizontal passando por trás (~50% altura) */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-8 right-8 top-1/2 hidden h-[2px] -translate-y-1/2 sm:block"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(14,216,246,0.55), rgba(0,121,203,0.75), rgba(124,58,237,0.55), transparent)',
              boxShadow: '0 0 20px rgba(14,216,246,0.25)',
            }}
          />
          {/* dots decorativos ao longo da linha */}
          <span aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 hidden -translate-y-1/2 justify-around sm:flex">
            {Array.from({ length: 9 }).map((_, i) => (
              <span
                key={i}
                className="block h-1 w-1 rounded-full"
                style={{ background: 'rgba(0,121,203,0.35)' }}
              />
            ))}
          </span>
          <ul className="relative grid grid-cols-1 gap-10 sm:grid-cols-3">
            {HIGHLIGHTS.map((h, i) => {
              const color = i === 0 ? '#0ed8f6' : i === 1 ? '#0079CB' : '#7c3aed';
              return (
                <li
                  key={h.label}
                  className="group relative flex flex-col rounded-2xl border border-[#0079CB]/15 bg-white/70 p-6 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1"
                  style={{
                    boxShadow: `0 20px 40px -30px ${color}66`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 30px 60px -24px ${color}88, 0 0 0 1px ${color}55 inset`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 40px -30px ${color}66`;
                  }}
                >
                  {/* corner-accents */}
                  <span aria-hidden className="pointer-events-none absolute left-2 top-2 h-3 w-3 border-l-2 border-t-2" style={{ borderColor: color }} />
                  <span aria-hidden className="pointer-events-none absolute right-2 top-2 h-3 w-3 border-r-2 border-t-2" style={{ borderColor: color }} />
                  <span aria-hidden className="pointer-events-none absolute left-2 bottom-2 h-3 w-3 border-l-2 border-b-2" style={{ borderColor: color }} />
                  <span aria-hidden className="pointer-events-none absolute right-2 bottom-2 h-3 w-3 border-r-2 border-b-2" style={{ borderColor: color }} />

                  <div className="flex items-center gap-3">
                    <CountUpNumber
                      target={h.num}
                      start={h.start}
                      suffix={h.suffix}
                      active={countActive}
                      color={color}
                    />
                    <span
                      aria-hidden
                      className="mt-4 inline-block h-2 w-2 rounded-full"
                      style={{
                        background: color,
                        boxShadow: `0 0 12px ${color}`,
                        animation: 'halo-pulse 2.2s ease-in-out infinite',
                      }}
                    />
                    <span className="sr-only">{h.value}</span>
                  </div>
                  <p className="mt-3 max-w-[220px] text-sm font-medium uppercase tracking-[0.14em] text-[#3d5a80]">
                    {h.label}
                  </p>
                </li>
              );
            })}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
