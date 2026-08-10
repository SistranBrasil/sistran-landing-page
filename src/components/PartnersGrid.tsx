'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import clsx from 'clsx';
import { PARTNERS, PARTNER_CATEGORIES, type PartnerCategory, type Partner } from '@/data/partners';
import { getIcon } from '@/lib/icons';
import { useReducedMotion } from '@/lib/motion';
import { useTilt } from '@/lib/useTilt';

type Filter = 'todos' | PartnerCategory;

const CATEGORY_TONES: Record<PartnerCategory, string> = {
  seguros: '#0ed8f6',
  plataforma: '#57B7EE',
  cloud: '#A78BFA',
  gestao: '#7CCBF3',
  dados: '#C4A0FB',
  inteligencia: '#6EE7B7',
};

const easeExpo = [0.22, 1, 0.36, 1] as const;

function PartnerCard({ p, index }: { p: Partner; index: number }) {
  const rm = useReducedMotion();
  const { hover, mouse, handlers, tiltTransform } = useTilt(!rm);
  const Icon = getIcon(p.icon);
  const tone = CATEGORY_TONES[p.category];
  const tilt = { x: mouse.x * 100, y: mouse.y * 100 };

  return (
    /* Camada externa: layout/entrada/saida (motion controla o transform).
       Camada interna: tilt 3D. Ver nota em useTilt. */
    <motion.div
      layout
      initial={rm ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12, transition: { duration: 0.2 } }}
      transition={{ duration: 0.65, ease: easeExpo, delay: rm ? 0 : Math.min(index * 0.04, 0.4) }}
      className="h-full [perspective:1000px]"
    >
    <article
      {...handlers}
      /* on-dark: o card mantem fundo navy mesmo quando a secao e clara.
         Sem isso os overrides de .section-light pintariam h3/p de navy sobre
         navy. Ver globals.css. */
      className="on-dark group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/12 p-7 backdrop-blur-xl"
      style={{
        // Navy escuro: o card precisa contrastar com o fundo azul medio da
        // pagina. Um branco translucido ficava com a mesma cor do fundo.
        background:
          'linear-gradient(135deg, rgba(8,49,86,0.94), rgba(6,38,69,0.90) 55%, rgba(4,29,55,0.94))',
        transform: tiltTransform({ lift: 8, deg: 7 }),
        transformStyle: 'preserve-3d',
        transition: hover
          ? 'box-shadow .25s ease, border-color .2s ease'
          : 'transform .5s cubic-bezier(.22,1,.36,1), box-shadow .5s ease',
        willChange: 'transform',
        boxShadow: hover
          ? `0 2px 6px rgba(3,26,52,0.20), 0 20px 40px -16px rgba(3,26,52,0.42), 0 44px 80px -32px rgba(3,26,52,0.50), 0 0 60px -18px ${tone}55, inset 0 1px 0 rgba(255,255,255,0.22)`
          : `0 1px 3px rgba(3,26,52,0.16), 0 12px 26px -14px rgba(3,26,52,0.34), 0 30px 60px -30px rgba(3,26,52,0.40), inset 0 1px 0 rgba(255,255,255,0.16)`,
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
      <div
        className="relative flex items-start justify-between gap-4"
        style={{ transform: 'translateZ(34px)' }}
      >
        <div
          className="relative flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
          style={{
            background: `linear-gradient(135deg, ${tone}33, ${tone}10)`,
            border: `1px solid ${tone}66`,
            boxShadow: `0 8px 24px -12px ${tone}99`,
          }}
        >
          <Icon className="h-7 w-7" style={{ color: tone }} strokeWidth={1.8} />
        </div>

        <div className="flex flex-col items-end gap-2">
          <span
            aria-hidden
            className="font-display text-4xl font-black leading-none"
            /* Branco translucido: o tone a 15% desaparecia no fundo azul claro. */
            style={{ color: 'rgba(255,255,255,0.30)', fontVariantNumeric: 'tabular-nums' }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <span
            className="inline-flex items-center rounded-full border border-white/12 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]"
            style={{ color: tone }}
          >
            {PARTNER_CATEGORIES[p.category].label}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3
        className="relative mt-6 font-display text-xl font-bold leading-tight text-white md:text-[1.35rem]"
        style={{ transform: 'translateZ(24px)' }}
      >
        {p.title}
      </h3>

      {/* Description */}
      <p
        className="relative mt-3 text-sm leading-relaxed text-white/85"
        style={{ transform: 'translateZ(14px)' }}
      >
        {p.description}
      </p>

      {/* Logo do parceiro */}
      {p.logo && (
        <div
          className="relative mt-6 flex flex-1 items-end"
          aria-hidden={p.logoAlt ? undefined : true}
        >
          <div className="flex h-24 w-full items-center justify-center rounded-2xl border border-white/40 bg-white px-6 py-4 shadow-[0_10px_30px_-12px_rgba(4,32,64,0.45)]">
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

      {/* Bottom line reveal */}
      <span
        aria-hidden
        className="absolute inset-x-7 bottom-0 h-px origin-left scale-x-0 transition-transform duration-700 group-hover:scale-x-100"
        style={{ background: `linear-gradient(90deg, transparent, ${tone}, transparent)` }}
      />
    </article>
    </motion.div>
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
        <div className="absolute left-0 top-40 h-[400px] w-[400px] rounded-full bg-[#0079CB]/14 blur-[130px]" />
        <div className="absolute right-0 bottom-40 h-[440px] w-[440px] rounded-full bg-[#7c3aed]/10 blur-[130px]" />
      </div>

      <div className="container-lp">
        {/* Filter bar */}
        {/* Barra de filtros: fica fora dos cards, direto sobre o fundo claro da
            secao — daí borda azul e base branca em vez de white/12 + white/3%,
            que sobre claro nao se enxergavam. */}
        <div className="mb-10 flex flex-wrap items-center gap-2 rounded-2xl border border-[#0079CB]/18 bg-white/70 p-2 shadow-[0_12px_34px_-24px_rgba(0,121,203,0.6)] backdrop-blur-lg">
          {filters.map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={clsx(
                  'relative inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-colors',
                  active
                    ? '!text-white'
                    : '!text-[#3C5A7A] hover:!text-[#0060a8]',
                )}
                aria-pressed={active}
              >
                {active && (
                  <motion.span
                    layoutId="partner-filter-pill"
                    className="absolute inset-0 rounded-xl bg-gradient-to-b from-[#0079CB] to-[#0060A8] ring-1 ring-inset ring-white/25"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{f.label}</span>
                <span
                  className={clsx(
                    'relative z-10 rounded-full px-2 py-0.5 text-[10px] tabular-nums',
                    active
                      ? 'bg-white/25 !text-white'
                      : 'bg-[#0079CB]/10 !text-[#5c7a9e]',
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
