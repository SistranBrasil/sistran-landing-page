'use client';

import { useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import clsx from 'clsx';
import { ArrowUpRight } from 'lucide-react';
import { PARTNERS, PARTNER_CATEGORIES, type PartnerCategory, type Partner } from '@/data/partners';
import { getIcon } from '@/lib/icons';
import { useReducedMotion } from '@/lib/motion';

type Filter = 'todos' | PartnerCategory;

const CATEGORY_TONES: Record<PartnerCategory, string> = {
  seguros: '#0ed8f6',
  plataforma: '#0079CB',
  cloud: '#7c3aed',
  gestao: '#0099E6',
  dados: '#a855f7',
  inteligencia: '#34d399',
};

const easeExpo = [0.22, 1, 0.36, 1] as const;

function PartnerCard({ p, index }: { p: Partner; index: number }) {
  const rm = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, x: 50, y: 50 });
  const Icon = getIcon(p.icon);
  const tone = CATEGORY_TONES[p.category];

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    if (rm || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setTilt({ rx: (0.5 - py) * 4, ry: (px - 0.5) * 6, x: px * 100, y: py * 100 });
  };
  const onLeave = () => setTilt({ rx: 0, ry: 0, x: 50, y: 50 });

  return (
    <motion.article
      layout
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={rm ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12, transition: { duration: 0.2 } }}
      transition={{ duration: 0.65, ease: easeExpo, delay: rm ? 0 : Math.min(index * 0.04, 0.4) }}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[rgba(0,45,92,0.72)] to-[rgba(0,77,138,0.42)] p-7 backdrop-blur-xl [transform-style:preserve-3d]"
      style={{
        transform: rm ? undefined : `perspective(1200px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transition: 'transform 220ms cubic-bezier(0.22,1,0.36,1), border-color 300ms, box-shadow 300ms',
      }}
    >
      {/* Gradient border reveal via mask */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-40 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          padding: 1,
          background: `linear-gradient(135deg, ${tone}, transparent 55%)`,
          WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Orb glow following cursor */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(320px circle at ${tilt.x}% ${tilt.y}%, ${tone}22, transparent 55%)`,
        }}
      />

      {/* Corner accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-40"
        style={{ background: tone }}
      />

      {/* Header */}
      <div className="relative flex items-start justify-between gap-4">
        <div
          className="relative flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:-translate-y-0.5"
          style={{
            background: `linear-gradient(135deg, ${tone}22, ${tone}08)`,
            border: `1px solid ${tone}55`,
            boxShadow: `0 8px 24px -12px ${tone}88`,
          }}
        >
          <Icon className="h-7 w-7" style={{ color: tone }} strokeWidth={1.8} />
        </div>

        <div className="flex flex-col items-end gap-2">
          <span
            aria-hidden
            className="font-display text-4xl font-black leading-none opacity-15"
            style={{ color: tone, fontVariantNumeric: 'tabular-nums' }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <span
            className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]"
            style={{ color: tone }}
          >
            {PARTNER_CATEGORIES[p.category].label}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 className="relative mt-6 font-display text-xl font-bold leading-tight text-white md:text-[1.35rem]">
        {p.title}
      </h3>

      {/* Description */}
      <p className="relative mt-3 text-sm leading-relaxed text-ink-muted">{p.description}</p>

      {/* Logo do parceiro */}
      {p.logo && (
        <div
          className="relative mt-6 flex flex-1 items-end"
          aria-hidden={p.logoAlt ? undefined : true}
        >
          <div className="flex h-24 w-full items-center justify-center rounded-2xl border border-white/40 bg-white px-6 py-4 shadow-[0_10px_30px_-12px_rgba(0,30,70,0.5)]">
            <Image
              src={p.logo}
              alt={p.logoAlt ?? ''}
              width={320}
              height={96}
              className="max-h-16 w-auto object-contain"
            />
          </div>
        </div>
      )}
      {!p.logo && <div className="flex-1" />}

      {/* Footer arrow */}
      <div className="relative mt-6 flex items-center gap-2 text-xs font-semibold text-white/60 transition-colors group-hover:text-white">
        <span className="tracking-[0.16em] uppercase">Saiba mais</span>
        <span
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 transition-all duration-500 group-hover:border-white/40 group-hover:bg-white/10"
          style={{ boxShadow: `inset 0 0 0 0 ${tone}` }}
        >
          <ArrowUpRight
            className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            strokeWidth={1.8}
          />
        </span>
      </div>

      {/* Bottom line reveal */}
      <span
        aria-hidden
        className="absolute inset-x-7 bottom-0 h-px origin-left scale-x-0 transition-transform duration-700 group-hover:scale-x-100"
        style={{ background: `linear-gradient(90deg, transparent, ${tone}, transparent)` }}
      />
    </motion.article>
  );
}

export default function PartnersGrid() {
  const [filter, setFilter] = useState<Filter>('todos');

  const visible = useMemo(
    () => (filter === 'todos' ? PARTNERS : PARTNERS.filter((p) => p.category === filter)),
    [filter],
  );

  const filters: { key: Filter; label: string; count: number }[] = [
    { key: 'todos', label: 'Todos', count: PARTNERS.length },
    ...(Object.keys(PARTNER_CATEGORIES) as PartnerCategory[]).map((k) => ({
      key: k as Filter,
      label: PARTNER_CATEGORIES[k].label,
      count: PARTNERS.filter((p) => p.category === k).length,
    })),
  ];

  return (
    <section className="section-py relative overflow-hidden">
      {/* Ambient orbs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-0 top-40 h-[400px] w-[400px] rounded-full bg-[#0079CB]/15 blur-[130px]" />
        <div className="absolute right-0 bottom-40 h-[440px] w-[440px] rounded-full bg-[#7c3aed]/12 blur-[130px]" />
      </div>

      <div className="container-lp">
        {/* Filter bar */}
        <div className="mb-10 flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-2 backdrop-blur-lg">
          {filters.map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={clsx(
                  'relative inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-colors',
                  active ? 'text-white' : 'text-ink-muted hover:text-white',
                )}
                aria-pressed={active}
              >
                {active && (
                  <motion.span
                    layoutId="partner-filter-pill"
                    className="absolute inset-0 rounded-xl bg-gradient-to-b from-[#0079CB]/40 to-[#004D8A]/40 ring-1 ring-inset ring-white/15"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{f.label}</span>
                <span
                  className={clsx(
                    'relative z-10 rounded-full px-2 py-0.5 text-[10px] tabular-nums',
                    active ? 'bg-white/20 text-white' : 'bg-white/[0.06] text-ink-faint',
                  )}
                >
                  {f.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bento grid — proportional cards, consistent aspect ratio */}
        <motion.div
          layout
          className="grid auto-rows-[minmax(320px,1fr)] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => (
              <PartnerCard key={p.id} p={p} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state (shouldn't happen but safe) */}
        {visible.length === 0 && (
          <div className="glass-card mt-8 p-10 text-center text-ink-muted">
            Nenhum parceiro nesta categoria.
          </div>
        )}
      </div>
    </section>
  );
}
