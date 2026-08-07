'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import clsx from 'clsx';
import { ArrowLeft, ArrowRight, MapPin, Pause, Play, PlayCircle } from 'lucide-react';
import { EVENTS, EVENT_KIND_META, type EventKind, type SistranEvent } from '@/data/events';
import { getIcon } from '@/lib/icons';
import { useReducedMotion } from '@/lib/motion';
import { useTilt } from '@/lib/useTilt';

type Filter = 'todos' | EventKind;

function EventCard({ e }: { e: SistranEvent }) {
  const rm = useReducedMotion();
  const { hover, mouse, handlers, tiltTransform } = useTilt(!rm);
  const Icon = getIcon(e.icon);
  const tone = EVENT_KIND_META[e.kind].tone;
  const hasVideo = e.id === 'web-summit-ai' || e.id === 'suitability-ai';
  const pos = { x: mouse.x * 100, y: mouse.y * 100 };

  return (
    /* Wrapper com a perspective; o tilt vai no <article>. */
    <div className="h-full w-[85vw] max-w-[380px] flex-none snap-center [perspective:1000px] sm:w-[380px]">
    <article
      {...handlers}
      className="group relative flex h-full min-h-[520px] flex-col overflow-hidden rounded-3xl border border-white/12 backdrop-blur-xl"
      style={{
        // Navy escuro: o card precisa contrastar com o fundo azul medio da
        // pagina. Um branco translucido ficava com a mesma cor do fundo.
        background:
          'linear-gradient(135deg, rgba(8,49,86,0.94), rgba(6,38,69,0.90) 55%, rgba(4,29,55,0.94))',
        transform: tiltTransform({ lift: 8, deg: 6 }),
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
      {/* Imagem de capa */}
      {e.image && (
        <div className="relative h-44 w-full overflow-hidden">
          <Image
            src={e.image}
            alt={e.title}
            fill
            sizes="380px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(9,63,109,0.92), rgba(9,63,109,0.35) 55%, transparent)',
            }}
          />
        </div>
      )}
      <div className={clsx('relative flex flex-1 flex-col', e.image ? 'p-7 pt-5' : 'p-7')}>
      {/* Gradient border */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-40 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          padding: 1,
          background: `linear-gradient(135deg, ${tone}, transparent 60%)`,
          WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(320px circle at ${pos.x}% ${pos.y}%, ${tone}22, transparent 55%)` }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full opacity-25 blur-3xl transition-opacity duration-500 group-hover:opacity-45"
        style={{ background: tone }}
      />

      <div
        className="relative flex items-start justify-between gap-3"
        style={{ transform: 'translateZ(34px)' }}
      >
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
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
            className="inline-flex items-center rounded-full border border-white/12 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]"
            style={{ color: tone }}
          >
            {EVENT_KIND_META[e.kind].label}
          </span>
          {e.location && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-white/75">
              <MapPin className="h-3 w-3" strokeWidth={1.8} />
              {e.location}
            </span>
          )}
        </div>
      </div>

      <h3
        className="relative mt-6 font-display text-xl font-bold leading-tight text-white"
        style={{ transform: 'translateZ(24px)' }}
      >
        {e.title}
      </h3>
      <p
        className="relative mt-3 flex-1 text-sm leading-relaxed text-white/85"
        style={{ transform: 'translateZ(14px)' }}
      >
        {e.description}
      </p>

      {hasVideo && (
        <div
          className="relative mt-6 inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em]"
          style={{ borderColor: `${tone}55`, background: `${tone}12`, color: tone }}
        >
          <PlayCircle className="h-3.5 w-3.5" strokeWidth={1.8} />
          Assista no YouTube
        </div>
      )}

      </div>

      <span
        aria-hidden
        className="absolute inset-x-7 bottom-0 h-px origin-left scale-x-0 transition-transform duration-700 group-hover:scale-x-100"
        style={{ background: `linear-gradient(90deg, transparent, ${tone}, transparent)` }}
      />
    </article>
    </div>
  );
}

export default function EventsGrid() {
  const rm = useReducedMotion();
  const [filter, setFilter] = useState<Filter>('todos');
  const [playing, setPlaying] = useState(true);
  const userPaused = useRef(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | null>(null);

  const visible = useMemo(
    () => (filter === 'todos' ? [...EVENTS] : EVENTS.filter((e) => e.kind === filter)),
    [filter],
  );

  const filters: { key: Filter; label: string; count: number }[] = [
    { key: 'todos', label: 'Todos', count: EVENTS.length },
    ...(Object.keys(EVENT_KIND_META) as EventKind[]).map((k) => ({
      key: k as Filter,
      label: EVENT_KIND_META[k].label,
      count: EVENTS.filter((e) => e.kind === k).length,
    })),
  ];

  /* Filhos diretos da trilha (cada um envolve um <article>). Usar
     getBoundingClientRect + scrollLeft em vez de offsetLeft: offsetLeft e
     relativo ao offsetParent, que nao e a trilha (ela nao tem position),
     entao a conta antiga errava o alvo. */
  const slides = () =>
    trackRef.current ? Array.from(trackRef.current.children) as HTMLElement[] : [];

  /* `behavior: 'smooth'` em elemento + scroll-snap mandatory e inconsistente
     no WebKit/Safari (o snap re-snapa no meio da animacao e o carrossel
     "congela"). Fazemos o scroll instantaneo e animamos so quando o browser
     suporta de forma confiavel. */
  const supportsSmooth =
    typeof document !== 'undefined' && 'scrollBehavior' in document.documentElement.style;

  const scrollToLeft = (left: number) => {
    const el = trackRef.current;
    if (!el) return;
    if (rm || !supportsSmooth) el.scrollLeft = left;
    else el.scrollTo({ left, behavior: 'smooth' });
  };

  const scrollBy = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const first = slides()[0];
    const step = first ? first.offsetWidth + 20 : 400;
    scrollToLeft(el.scrollLeft + step * dir);
  };

  const scrollToIdx = (idx: number) => {
    const el = trackRef.current;
    if (!el) return;
    const card = slides()[idx];
    if (!card) return;
    const left =
      card.getBoundingClientRect().left - el.getBoundingClientRect().left + el.scrollLeft;
    scrollToLeft(left);
  };

  // autoplay
  useEffect(() => {
    if (!playing || rm) return;
    timer.current = window.setInterval(() => {
      setActiveIdx((i) => {
        const next = (i + 1) % visible.length;
        scrollToIdx(next);
        return next;
      });
    }, 3600);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [playing, rm, visible.length]);

  // detectar card ativo pelo scroll
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const cards = el.querySelectorAll<HTMLElement>('article');
    if (!cards.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Array.from(cards).indexOf(entry.target as HTMLElement);
            if (idx >= 0) setActiveIdx(idx);
          }
        });
      },
      { root: el, threshold: 0.6 },
    );
    cards.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, [visible]);

  // resetar índice ao trocar filtro
  useEffect(() => {
    setActiveIdx(0);
    trackRef.current?.scrollTo({ left: 0, behavior: 'auto' });
  }, [filter]);

  return (
    <section id="eventos" className="section-py relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-0 top-40 h-[380px] w-[380px] rounded-full bg-[#57B7EE]/15 blur-[130px]" />
        <div className="absolute right-0 bottom-40 h-[420px] w-[420px] rounded-full bg-[#A78BFA]/12 blur-[130px]" />
      </div>

      <div className="container-lp">
        {/* Toolbar: filtros + controles */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/12 bg-white/[0.03] p-2 backdrop-blur-lg">
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
                      layoutId="events-filter-pill"
                      className="absolute inset-0 rounded-xl bg-gradient-to-b from-[#57B7EE]/40 to-[#1885CE]/40 ring-1 ring-inset ring-white/15"
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

          <div className="flex items-center gap-2">
            <span className="hidden text-xs font-semibold tabular-nums text-white/60 md:inline">
              {String(activeIdx + 1).padStart(2, '0')} / {String(visible.length).padStart(2, '0')}
            </span>
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/12 bg-white/[0.04] text-white transition-colors hover:border-[#0ed8f6]/50 hover:bg-white/10"
              aria-label="Evento anterior"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
            </button>
            <button
              type="button"
              onClick={() =>
                setPlaying((p) => {
                  userPaused.current = p;
                  return !p;
                })
              }
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#0ed8f6]/40 bg-[#57B7EE]/25 text-white transition-colors hover:border-[#0ed8f6]/70 hover:bg-[#57B7EE]/40"
              aria-label={playing ? 'Pausar carrossel' : 'Reproduzir carrossel'}
            >
              {playing ? <Pause className="h-4 w-4" strokeWidth={1.8} /> : <Play className="h-4 w-4" strokeWidth={1.8} />}
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/12 bg-white/[0.04] text-white transition-colors hover:border-[#0ed8f6]/50 hover:bg-white/10"
              aria-label="Próximo evento"
            >
              <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
            </button>
          </div>
        </div>

        {/* Track scrollável */}
        <div className="relative">
          <div
            ref={trackRef}
            data-lenis-prevent
            className="scrollbar-hide flex snap-x snap-mandatory gap-5 overflow-x-auto pb-6 pl-1 pr-6"
            style={{
              maskImage:
                'linear-gradient(90deg, black 0, black 92%, transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(90deg, black 0, black 92%, transparent 100%)',
            }}
            role="region"
            aria-label="Carrossel de eventos"
            onMouseEnter={() => setPlaying(false)}
            onMouseLeave={() => {
              if (!userPaused.current) setPlaying(true);
            }}
          >
            {visible.map((e) => (
              <EventCard key={e.id} e={e} />
            ))}
          </div>
        </div>

        {/* Dots progressivos */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5">
          {visible.map((e, i) => (
            <button
              key={e.id}
              type="button"
              onClick={() => {
                scrollToIdx(i);
                setActiveIdx(i);
              }}
              aria-label={`Ir para o evento ${i + 1}`}
              aria-current={i === activeIdx ? 'true' : undefined}
              className="group relative h-1.5 overflow-hidden rounded-full bg-white/10 transition-all"
              style={{ width: i === activeIdx ? 32 : 10 }}
            >
              <span
                className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                style={{
                  width: i === activeIdx ? '100%' : '0%',
                  background: '#0ed8f6',
                  boxShadow: i === activeIdx ? '0 0 10px #0ed8f6' : 'none',
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
