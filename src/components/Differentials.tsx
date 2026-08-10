'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DIFFERENTIALS } from '@/data/differentials';
import { getIcon } from '@/lib/icons';
import { vHeader, vTitle, vSubtitle, VP, useReducedMotion } from '@/lib/motion';

const CARD_COLORS = ['#0ed8f6', '#0079CB', '#7c3aed', '#B8DDF6'] as const;

/* Numeracao em azul escuro fixo, nao no `color` do card: dois dos quatro tons
   (#0ed8f6, #B8DDF6) sao claros e sumiam sobre o card claro. Um navy unico
   mantem o contraste igual nos quatro passos. */
const NUM_COLOR = '#062B52';

export default function Differentials() {
  const rm = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (rm || !isDesktop) return;
    const el = wrapperRef.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress;
        setProgress(p);
        const idx = Math.min(
          DIFFERENTIALS.length - 1,
          Math.floor(p * DIFFERENTIALS.length),
        );
        setActiveIdx(idx);
      },
    });
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('resize', refresh);
    return () => {
      window.removeEventListener('resize', refresh);
      st.kill();
    };
  }, [rm, isDesktop]);

  // Mobile fallback (lista vertical) ou reduced motion
  if (!isDesktop || rm) {
    return (
      <section id="diferenciais" className="section-py relative overflow-hidden">
        <div className="container-lp">
          <motion.div
            variants={vHeader}
            initial={rm ? false : 'hidden'}
            whileInView="visible"
            viewport={VP}
            className="mb-12 max-w-2xl"
          >
            <motion.span variants={vSubtitle} className="tag-section">Diferenciais</motion.span>
            <motion.h2 variants={vTitle} className="mt-3 font-display text-section font-bold text-ink">
              O que nos torna <span className="text-gradient-brand">parceiros estratégicos</span>
            </motion.h2>
          </motion.div>
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {DIFFERENTIALS.map((d, i) => {
              const Icon = getIcon(d.icon);
              const color = CARD_COLORS[i] ?? d.color;
              return (
                <li
                  key={d.id}
                  className="glass-card-hover relative overflow-hidden p-6"
                  style={{ boxShadow: `0 20px 40px -24px ${color}55` }}
                >
                  <span aria-hidden className="corner-accent" />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-2 -top-4 select-none font-display text-[4.5rem] font-black leading-none opacity-15"
                    style={{ color: NUM_COLOR }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div
                    className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{
                      background: `linear-gradient(135deg, ${color}22, ${color}0a)`,
                      border: `1px solid ${color}55`,
                    }}
                  >
                    <Icon className="h-6 w-6" style={{ color }} strokeWidth={1.8} />
                  </div>
                  <h3 className="relative font-display text-lg font-bold text-ink">{d.title}</h3>
                  <p className="relative mt-3 text-sm leading-relaxed text-ink-muted">{d.description}</p>
                  <span className="sr-only">{d.id}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    );
  }

  const wrapperHeight = `${DIFFERENTIALS.length * 100}vh`;

  return (
    <section id="diferenciais" className="relative">
      <div ref={wrapperRef} className="relative" style={{ height: wrapperHeight }}>
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <div className="container-lp relative w-full">
            {/* Header */}
            <div className="mb-8 flex items-end justify-between gap-6">
              <div className="max-w-2xl">
                <span className="tag-section">Diferenciais</span>
                <h2 className="mt-3 font-display text-section font-bold text-ink">
                  O que nos torna <span className="text-gradient-brand">parceiros estratégicos</span>
                </h2>
              </div>
              {/* Dots de progresso lateral */}
              <div aria-hidden className="hidden shrink-0 md:flex md:flex-col md:items-center md:gap-3">
                {DIFFERENTIALS.map((_, i) => {
                  const isActive = i === activeIdx;
                  return (
                    <span
                      key={i}
                      className="relative block rounded-full transition-all duration-500"
                      style={{
                        width: isActive ? 14 : 6,
                        height: isActive ? 14 : 6,
                        background: isActive ? CARD_COLORS[i] : 'rgba(16, 91, 154,0.25)',
                        boxShadow: isActive ? `0 0 18px ${CARD_COLORS[i]}, 0 0 0 4px ${CARD_COLORS[i]}22` : undefined,
                        opacity: isActive ? 1 : 0.6,
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* 52vh: com 62vh o bloco (header + card) passava da altura da
                viewport e o topo — onde fica a tag "Diferenciais" — era cortado
                pelo header fixo. min-h menor pela mesma razao. */}
            <div className="relative h-[52vh] min-h-[360px]">
              {DIFFERENTIALS.map((d, i) => {
                const Icon = getIcon(d.icon);
                const color = CARD_COLORS[i] ?? d.color;
                const step = 1 / DIFFERENTIALS.length;
                const localStart = i * step;
                const localP = Math.min(1, Math.max(0, (progress - localStart) / step));
                const isActive = i === activeIdx;
                const isBelow = i > activeIdx;
                const isDone = i < activeIdx;
                const y = isBelow ? '100%' : isDone ? '0%' : `${(1 - localP) * 6}%`;
                const scale = isBelow ? 0.95 : isDone ? 0.96 : 1;
                const opacity = isDone ? 0 : 1;
                const blur = isBelow ? 6 : 0;
                return (
                  <article
                    key={d.id}
                    aria-hidden={!isActive}
                    className="glass-card absolute inset-0 flex flex-col justify-between overflow-hidden p-7 md:p-10"
                    style={{
                      transform: `translateY(${y}) scale(${scale})`,
                      opacity,
                      filter: `blur(${blur}px)`,
                      transition:
                        'transform 750ms var(--ease-out), opacity 500ms var(--ease-out), filter 500ms var(--ease-out)',
                      zIndex: 10 + i,
                      boxShadow: `0 40px 80px -30px ${color}66, 0 0 0 1px ${color}55 inset`,
                    }}
                  >
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -right-16 -top-24 h-96 w-96 rounded-full opacity-40 blur-[120px]"
                      style={{ background: color }}
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute right-4 top-2 select-none font-display font-black leading-none opacity-[0.14]"
                      style={{ color: NUM_COLOR, fontSize: 'clamp(7rem, 15vw, 13rem)' }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>

                    <div className="relative flex items-start justify-between">
                      <span
                        className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em]"
                        style={{
                          color: NUM_COLOR,
                          borderColor: `${NUM_COLOR}33`,
                          background: `${NUM_COLOR}0f`,
                        }}
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ background: NUM_COLOR }}
                        />
                        {String(i + 1).padStart(2, '0')} / {String(DIFFERENTIALS.length).padStart(2, '0')}
                      </span>
                    </div>

                    <div className="relative max-w-3xl">
                      <div
                        className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
                        style={{
                          background: `linear-gradient(135deg, ${color}26, ${color}0a)`,
                          border: `1px solid ${color}66`,
                          boxShadow: `0 16px 40px -14px ${color}99`,
                        }}
                      >
                        <Icon className="h-8 w-8" style={{ color, filter: `drop-shadow(0 0 10px ${color}88)` }} strokeWidth={1.6} />
                      </div>
                      <h3
                        className="font-display font-bold text-white"
                        style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em', lineHeight: 1.05 }}
                      >
                        {d.title}
                      </h3>
                      <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
                        {d.description}
                      </p>
                    </div>

                    <div className="relative flex items-center gap-4">
                      <span
                        aria-hidden
                        className="h-px flex-1"
                        style={{ background: `linear-gradient(90deg, ${color}88, transparent)` }}
                      />
                      <span
                        className="text-[11px] font-semibold uppercase tracking-[0.22em]"
                        style={{ color: `${NUM_COLOR}99` }}
                      >
                        {d.id}
                      </span>
                    </div>

                    {/* Progress line vertical (dentro do card) */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute right-6 top-10 bottom-10 hidden w-[2px] overflow-hidden rounded-full md:block"
                      style={{ background: 'rgba(255,255,255,0.08)' }}
                    >
                      <span
                        className="absolute inset-x-0 top-0 rounded-full transition-[height] duration-500"
                        style={{
                          height: `${isActive ? localP * 100 : isDone ? 100 : 0}%`,
                          background: `linear-gradient(180deg, ${color}, ${color}55)`,
                          boxShadow: `0 0 12px ${color}`,
                        }}
                      />
                    </span>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
