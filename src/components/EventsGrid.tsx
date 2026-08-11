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

function EventCard({ e, active }: { e: SistranEvent; active: boolean }) {
  const rm = useReducedMotion();
  const { hover, mouse, handlers, tiltTransform } = useTilt(!rm);
  const Icon = getIcon(e.icon);
  const tone = EVENT_KIND_META[e.kind].tone;
  const hasVideo = e.id === 'web-summit-ai' || e.id === 'suitability-ai';
  const pos = { x: mouse.x * 100, y: mouse.y * 100 };

  return (
    /* Wrapper com a perspective; o tilt vai no <article>. */
    <div
      /* items-center + transicao de opacidade/escala no wrapper: os cards
         inativos recuam para que o card do centro seja o destaque. Sem isto
         os tres apareciam com o mesmo peso e nada se destacava. */
      className={clsx(
        'w-[85vw] max-w-[380px] flex-none snap-center [perspective:1000px] sm:w-[380px]',
        'transition-opacity duration-500',
        active ? 'opacity-100' : 'opacity-55',
      )}
      style={{ transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
    >
    {/* Escala numa camada interna, nao no item flex: getBoundingClientRect (que
        scrollToIdx usa para mirar o card) reflete transform, e escalar o item
        deslocava o alvo do snap em ~11px por card. */}
    <div
      className="h-full transition-transform duration-500"
      style={{
        transform: rm ? undefined : `scale(${active ? 1 : 0.95})`,
        transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
    <article
      {...handlers}
      /* on-dark: mantem o card navy mesmo com a secao clara — sem isso os
         overrides de .section-light pintariam titulo/texto de navy sobre navy. */
      className="on-dark group relative flex h-full min-h-[520px] flex-col overflow-hidden rounded-3xl backdrop-blur-xl"
      style={{
        // Navy escuro: o card precisa contrastar com o fundo azul medio da
        // pagina. Um branco translucido ficava com a mesma cor do fundo.
        background:
          'linear-gradient(135deg, rgba(8,49,86,0.94), rgba(6,38,69,0.90) 55%, rgba(4,29,55,0.94))',
        // Borda no tone quando ativo: reforca qual card e o principal.
        border: `1px solid ${active ? `${tone}80` : 'rgba(255,255,255,0.12)'}`,
        transform: tiltTransform({ lift: 8, deg: 6 }),
        transformStyle: 'preserve-3d',
        transition: hover
          ? 'box-shadow .25s ease, border-color .2s ease'
          : 'transform .5s cubic-bezier(.22,1,.36,1), box-shadow .5s ease, border-color .4s ease',
        willChange: 'transform',
        boxShadow:
          hover || active
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

  /* activeIdx tambem num ref: o autoplay abaixo le o indice atual sem precisar
     do `setActiveIdx` como fonte, o que permite ao observer ser o unico dono do
     estado. Antes os dois escreviam em activeIdx e disputavam — o autoplay
     avancava, o observer reportava a posicao intermediaria do scroll suave, e o
     proximo tick partia do indice errado. Resultado: o carrossel parecia travar
     e voltar. */
  const activeRef = useRef(0);
  useEffect(() => {
    activeRef.current = activeIdx;
  }, [activeIdx]);

  /* Autoplay: apenas rola. Quem atualiza activeIdx e o observer.
     Sem guard de `rm`: o usuario tem botao de pausa, entao o movimento segue
     valendo com movimento reduzido — parado por padrao os cards seguintes
     passariam despercebidos. O respeito a preferencia esta em scrollToLeft, que
     pula direto para o card em vez de animar. */
  useEffect(() => {
    if (!playing || visible.length < 2) return;
    timer.current = window.setInterval(() => {
      scrollToIdx((activeRef.current + 1) % visible.length);
    }, 4200);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, visible.length]);

  // detectar card ativo pelo scroll — fonte unica de activeIdx
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const cards = Array.from(el.querySelectorAll<HTMLElement>('article'));
    if (!cards.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        /* Pega a entrada MAIS visivel do lote, em vez de aplicar cada uma em
           sequencia: com varios cards cruzando o threshold no mesmo frame, o
           `forEach` deixava vencer o ultimo do array, nao o card centralizado. */
        let best: IntersectionObserverEntry | null = null;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          if (!best || entry.intersectionRatio > best.intersectionRatio) best = entry;
        }
        if (!best) return;
        const idx = cards.indexOf(best.target as HTMLElement);
        if (idx >= 0) setActiveIdx(idx);
      },
      /* threshold em varios pontos: com um unico 0.6 o observer so disparava ao
         cruzar exatamente aquele valor e nao reavaliava qual card estava mais
         centralizado — outra origem da sensacao de travamento. */
      { root: el, threshold: [0.4, 0.6, 0.8, 0.95] },
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
    /* Fundo azul claro, alternando com o hero/strip escuros acima e Social
       abaixo. Os cards de evento seguem navy via .on-dark. */
    <section
      id="eventos"
      className="section-light section-light-blue section-py relative overflow-hidden"
    >
      {/* z-0, nao -z-10: .section-light aplica isolation:isolate e o fundo esta
          nesta section — z negativo esconderia os orbs atras do background. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-0 top-40 h-[380px] w-[380px] rounded-full bg-[#0079CB]/14 blur-[130px]" />
        <div className="absolute right-0 bottom-40 h-[420px] w-[420px] rounded-full bg-[#7c3aed]/10 blur-[130px]" />
      </div>

      <div className="container-lp relative z-10">
        {/* Toolbar: filtros + controles */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[#0079CB]/18 bg-white/70 p-2 shadow-[0_12px_34px_-24px_rgba(0,121,203,0.6)] backdrop-blur-lg">
            {filters.map((f) => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  className={clsx(
                    'relative inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-colors',
                    active ? '!text-white' : '!text-[#3C5A7A] hover:!text-[#0060a8]',
                  )}
                  aria-pressed={active}
                >
                  {active && (
                    <motion.span
                      layoutId="events-filter-pill"
                      className="absolute inset-0 rounded-xl bg-gradient-to-b from-[#0079CB] to-[#0060A8] ring-1 ring-inset ring-white/25"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{f.label}</span>
                  <span
                    className={clsx(
                      'relative z-10 rounded-full px-2 py-0.5 text-[10px] tabular-nums',
                      active ? 'bg-white/25 !text-white' : 'bg-[#0079CB]/10 !text-[#5c7a9e]',
                    )}
                  >
                    {f.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden text-xs font-semibold tabular-nums !text-[#5c7a9e] md:inline">
              {String(activeIdx + 1).padStart(2, '0')} / {String(visible.length).padStart(2, '0')}
            </span>
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#0079CB]/22 bg-white/75 !text-[#0060a8] shadow-[0_8px_20px_-16px_rgba(0,121,203,0.7)] transition-colors hover:border-[#0079CB]/50 hover:bg-white"
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
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#0079CB]/60 bg-[#0079CB] !text-white transition-colors hover:bg-[#0060A8]"
              aria-label={playing ? 'Pausar carrossel' : 'Reproduzir carrossel'}
            >
              {playing ? <Pause className="h-4 w-4" strokeWidth={1.8} /> : <Play className="h-4 w-4" strokeWidth={1.8} />}
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#0079CB]/22 bg-white/75 !text-[#0060a8] shadow-[0_8px_20px_-16px_rgba(0,121,203,0.7)] transition-colors hover:border-[#0079CB]/50 hover:bg-white"
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
            /* py em vez de pb: o card ativo agora escala para 1 e a sombra maior
               precisava de folga em cima, senao era cortada pelo overflow. */
            className="scrollbar-hide flex snap-x snap-mandatory gap-5 overflow-x-auto px-1 py-6"
            style={{
              /* Fade encurtado (era black ate 92%): o mask apagava boa parte do
                 terceiro card, que e justamente onde o card ativo cai com
                 frequencia — ele ficava lavado e nada parecia destacado. */
              maskImage:
                'linear-gradient(90deg, black 0, black 97%, transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(90deg, black 0, black 97%, transparent 100%)',
            }}
            role="region"
            aria-label="Carrossel de eventos"
            onMouseEnter={() => setPlaying(false)}
            onMouseLeave={() => {
              if (!userPaused.current) setPlaying(true);
            }}
          >
            {visible.map((e, i) => (
              <EventCard key={e.id} e={e} active={i === activeIdx} />
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
              className="group relative h-1.5 overflow-hidden rounded-full bg-[#0079CB]/18 transition-all"
              style={{ width: i === activeIdx ? 32 : 10 }}
            >
              <span
                className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                style={{
                  width: i === activeIdx ? '100%' : '0%',
                  background: '#0079CB',
                  boxShadow: i === activeIdx ? '0 0 10px rgba(0,121,203,0.7)' : 'none',
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
