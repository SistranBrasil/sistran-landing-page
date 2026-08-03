'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SOLUTIONS } from '@/data/solutions';
import { getIcon } from '@/lib/icons';
import { vHeader, vTitle, vSubtitle, VP, useReducedMotion } from '@/lib/motion';

export default function Solutions() {
  const rm = useReducedMotion();
  const [active, setActive] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [openMobile, setOpenMobile] = useState<number | null>(0);
  const listRef = useRef<HTMLOListElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;
    gsap.registerPlugin(ScrollTrigger);
    const triggers: ScrollTrigger[] = [];
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 45%',
          onEnter: () => setActive(i),
          onEnterBack: () => setActive(i),
        }),
      );
    });
    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, [isDesktop]);

  const onKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        setActive((v) => Math.min(SOLUTIONS.length - 1, v + 1));
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        setActive((v) => Math.max(0, v - 1));
      }
    },
    [],
  );

  return (
    <section id="servicos" className="section-py relative">
      <div className="container-lp">
        <motion.div
          variants={vHeader}
          initial={rm ? false : 'hidden'}
          whileInView="visible"
          viewport={VP}
          className="mb-14 max-w-3xl"
        >
          <motion.span variants={vSubtitle} className="eyebrow">Serviços</motion.span>
          <motion.h2 variants={vTitle} className="mt-3 font-display text-section font-bold text-ink">
            Integradora de sistemas <span className="text-gradient-brand">100% focada em Seguros</span>
          </motion.h2>
          <motion.p variants={vSubtitle} className="mt-4 text-lg leading-relaxed text-ink-muted">
            Dedicada ao mercado segurador, com experiência em todos os ramos. A Sistran atua como
            integradora de sistemas para clientes com grandes carteiras. Somos uma empresa de TI
            100% focada no segmento de Seguros no Brasil, com mais de 30 implementações de ERP
            bem-sucedidas.
          </motion.p>
        </motion.div>

        {/* Desktop: sticky list + panel */}
        <div className="hidden lg:grid lg:grid-cols-[minmax(280px,360px)_1fr] lg:gap-16">
          <div className="relative">
            <div className="sticky top-32">
              <ol
                ref={listRef}
                role="tablist"
                aria-orientation="vertical"
                onKeyDown={onKey}
                className="flex flex-col gap-1"
              >
                {SOLUTIONS.map((s, i) => {
                  const num = String(i + 1).padStart(2, '0');
                  const isActive = i === active;
                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        tabIndex={isActive ? 0 : -1}
                        onClick={() => {
                          setActive(i);
                          itemRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }}
                        className={`group relative flex w-full items-baseline gap-4 rounded-lg py-3 pl-4 pr-3 text-left transition-colors ${
                          isActive ? 'text-ink' : 'text-ink/50'
                        }`}
                      >
                        <span
                          aria-hidden
                          className="absolute left-0 top-1/2 h-8 w-[3px] -translate-y-1/2 rounded-full transition-all duration-500"
                          style={{
                            background: isActive ? s.color : 'rgba(10,31,68,0.12)',
                            boxShadow: isActive ? `0 0 12px ${s.color}88` : 'none',
                            height: isActive ? '2.5rem' : '1rem',
                          }}
                        />
                        <span
                          className="font-display text-sm font-bold tabular-nums"
                          style={{ color: isActive ? s.color : 'rgba(10,31,68,0.4)' }}
                        >
                          {num}
                        </span>
                        <span className="flex-1 font-display text-lg font-bold leading-tight">
                          {s.title}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
              {/* Barra de progresso */}
              <div className="mt-8 h-[3px] w-full overflow-hidden rounded-full bg-[#0079CB]/10">
                <div
                  aria-hidden
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${((active + 1) / SOLUTIONS.length) * 100}%`,
                    background: 'linear-gradient(90deg, #0079CB, #0ed8f6, #7c3aed)',
                  }}
                />
              </div>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#3d5a80]">
                {String(active + 1).padStart(2, '0')} / {String(SOLUTIONS.length).padStart(2, '0')}
              </p>
            </div>
          </div>

          <div className="relative">
            {SOLUTIONS.map((s, i) => {
              const Icon = getIcon(s.icon);
              return (
                <div
                  key={s.id}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  data-idx={i}
                  className="mb-8 flex min-h-[70vh] flex-col justify-center"
                >
                  <AnimatePresence mode="wait">
                    <motion.article
                      key={`panel-${active === i ? 'a' : 'b'}-${i}`}
                      initial={rm ? false : { opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="glass-card-hover relative overflow-hidden p-10"
                      style={{
                        borderColor: `${s.color}44`,
                        boxShadow: `0 30px 60px -30px ${s.color}55`,
                      }}
                    >
                      <div
                        aria-hidden
                        className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full opacity-30 blur-3xl"
                        style={{ background: s.color }}
                      />
                      <span
                        aria-hidden
                        className="pointer-events-none absolute -right-2 -top-6 select-none font-display font-black leading-none opacity-[0.12]"
                        style={{ color: s.color, fontSize: 'clamp(6rem, 10vw, 9rem)' }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div
                        className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
                        style={{
                          background: `linear-gradient(135deg, ${s.color}26, ${s.color}0a)`,
                          border: `1px solid ${s.color}66`,
                          boxShadow: `0 12px 32px -12px ${s.color}88`,
                        }}
                      >
                        <Icon
                          className="h-8 w-8"
                          style={{ color: s.color, filter: `drop-shadow(0 0 10px ${s.color}99)` }}
                          strokeWidth={1.6}
                        />
                      </div>
                      <h3 className="relative max-w-2xl font-display text-2xl font-bold leading-tight text-ink md:text-3xl">
                        {s.title}
                      </h3>
                      <p className="relative mt-4 max-w-2xl text-base leading-relaxed text-ink/80 md:text-lg">
                        {s.description}
                      </p>
                    </motion.article>
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile: acordeão */}
        <ol className="flex flex-col gap-3 lg:hidden">
          {SOLUTIONS.map((s, i) => {
            const Icon = getIcon(s.icon);
            const num = String(i + 1).padStart(2, '0');
            const isOpen = openMobile === i;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`solution-panel-${s.id}`}
                  onClick={() => setOpenMobile(isOpen ? null : i)}
                  className="glass-card-hover flex w-full items-center justify-between gap-4 p-5 text-left"
                  style={{ borderColor: isOpen ? `${s.color}66` : undefined }}
                >
                  <span className="flex items-center gap-4">
                    <span
                      className="font-display text-sm font-bold tabular-nums"
                      style={{ color: s.color }}
                    >
                      {num}
                    </span>
                    <span className="font-display text-base font-bold leading-tight text-ink">
                      {s.title}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="ml-2 flex h-8 w-8 flex-none items-center justify-center rounded-full transition-transform"
                    style={{
                      background: `${s.color}22`,
                      color: s.color,
                      transform: isOpen ? 'rotate(45deg)' : 'rotate(0)',
                    }}
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <div
                    id={`solution-panel-${s.id}`}
                    className="mt-2 rounded-2xl border p-5"
                    style={{
                      borderColor: `${s.color}33`,
                      background: `linear-gradient(135deg, ${s.color}0a, transparent)`,
                    }}
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <span
                        className="flex h-11 w-11 items-center justify-center rounded-xl"
                        style={{
                          background: `linear-gradient(135deg, ${s.color}26, ${s.color}0a)`,
                          border: `1px solid ${s.color}55`,
                        }}
                      >
                        <Icon className="h-5 w-5" style={{ color: s.color }} strokeWidth={1.8} />
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-ink-muted">{s.description}</p>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
