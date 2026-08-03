'use client';

/**
 * HeroCinematic — Hero cinematográfico controlado por scroll.
 *
 * Wrapper de 300vh (desktop) / 200vh (mobile) com cena sticky em 100svh.
 * Todo o texto/copy do Hero.tsx original é preservado — apenas apresentação e
 * timing mudam.
 *
 * Sequência (por progresso do wrapper, 0..1):
 *   0.00–0.15  Atmosfera + chip institucional
 *   0.15–0.40  Título (MorphingHeadline) revelado por linhas
 *   0.40–0.65  Evolução visual (parallax do PillarsCarousel + intensificação do mesh)
 *   0.65–0.82  Parágrafo + CTAs
 *   0.82–1.00  Indicadores (TrustTicker + peek "Quem somos") e transição
 *
 * ── Como plugar o vídeo real (quando disponível) ─────────────────────────────
 * Substitua o placeholder pela tag <video> abaixo (a estrutura já suporta):
 *
 *   <video
 *     ref={videoRef}
 *     data-video-src
 *     className="absolute inset-0 h-full w-full object-cover"
 *     muted
 *     playsInline
 *     preload="metadata"
 *     poster={POSTER_DESKTOP}
 *   >
 *     <source src={VIDEO_DESKTOP} type="video/mp4" />
 *   </video>
 *
 * Recomenda-se dois arquivos:
 *   VIDEO_DESKTOP: 1920x1080 MP4/H.264 (também aceita WebM/VP9), sem áudio,
 *                  8–12s em loop, CRF 28, +faststart.
 *   VIDEO_MOBILE : 720x1280 MP4 vertical, mesmas configurações.
 *   POSTER_*     : WebP/JPG 16:9 (desktop) / 9:16 (mobile).
 *
 * A função driveVideoByScroll() abaixo já está pronta para ativar o scrub de
 * currentTime pelo progresso do wrapper (basta remover o comentário).
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { DIFFERENTIALS } from '@/data/differentials';
import { getIcon } from '@/lib/icons';
import { useReducedMotion } from '@/lib/motion';
import HeroMesh from './ui/HeroMesh';
import PillarsCarousel from './ui/PillarsCarousel';
import MorphingHeadline from './ui/MorphingHeadline';
import TrustTicker from './ui/TrustTicker';

/**
 * Sincroniza video.currentTime com o progresso do scroll dentro do wrapper.
 * Ativar quando o <video> real estiver plugado. Retorna cleanup.
 */
export function driveVideoByScroll(
  videoEl: HTMLVideoElement,
  wrapperEl: HTMLElement,
): () => void {
  let raf = 0;
  let targetTime = 0;
  let currentTime = 0;

  const st = ScrollTrigger.create({
    trigger: wrapperEl,
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    onUpdate: (self) => {
      const dur = videoEl.duration;
      if (!dur || Number.isNaN(dur)) return;
      targetTime = self.progress * dur;
    },
  });

  const tick = () => {
    currentTime += (targetTime - currentTime) * 0.15;
    if (Math.abs(targetTime - currentTime) > 0.01) {
      try {
        videoEl.currentTime = currentTime;
      } catch {
        /* ignore */
      }
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(raf);
    st.kill();
  };
}

export default function HeroCinematic() {
  const rm = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rm) return;
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);
    const wrapper = wrapperRef.current;
    const scene = sceneRef.current;
    if (!wrapper || !scene) return;

    // Seleciona elementos das cinco fases
    const chip = scene.querySelector<HTMLElement>('[data-hero-chip]');
    const headline = scene.querySelector<HTMLElement>('[data-hero-headline]');
    const evolve = scene.querySelector<HTMLElement>('[data-hero-evolve]');
    const paragraph = scene.querySelector<HTMLElement>('[data-hero-paragraph]');
    const ctas = scene.querySelector<HTMLElement>('[data-hero-ctas]');
    const indicators = scene.querySelector<HTMLElement>('[data-hero-indicators]');
    const peek = scene.querySelector<HTMLElement>('[data-hero-peek]');
    const atmosphere = scene.querySelector<HTMLElement>('[data-hero-atmosphere]');
    const mobileChips = scene.querySelector<HTMLElement>('[data-hero-mobilechips]');

    const initial = { opacity: 0, y: 34, filter: 'blur(10px)' };
    [chip, headline, evolve, paragraph, ctas, indicators, mobileChips].forEach((el) => {
      if (el) gsap.set(el, initial);
    });
    if (peek) gsap.set(peek, { opacity: 0, y: 10 });

    const ctx = gsap.context(() => {
      // Entrada do hero: timeline única no mount (não gated por scroll)
      const tl = gsap.timeline({ defaults: { ease: 'power2.out', duration: 0.8 } });
      const reveal = (el: Element | null, at: string | number = '<0.12') => {
        if (!el) return;
        tl.to(el, { opacity: 1, y: 0, filter: 'blur(0px)' }, at);
      };
      reveal(chip, 0);
      reveal(mobileChips, '<0.05');
      reveal(headline, '<0.1');
      reveal(evolve, '<0.05');
      reveal(paragraph, '<0.1');
      reveal(ctas, '<0.05');
      reveal(indicators, '<0.05');
      if (peek) tl.to(peek, { opacity: 1, y: 0 }, '<0.1');

      // Atmosfera: leve intensificação do mesh no meio, fade no fim
      if (atmosphere) {
        gsap.fromTo(
          atmosphere,
          { opacity: 0.55 },
          {
            opacity: 1,
            ease: 'none',
            scrollTrigger: { trigger: wrapper, start: '0% top', end: '50% top', scrub: 0.6 },
          },
        );
        gsap.to(atmosphere, {
          opacity: 0.35,
          ease: 'none',
          scrollTrigger: { trigger: wrapper, start: '80% top', end: '100% top', scrub: 0.6 },
        });
      }

      // Escala/fade geral da cena para transição para próxima seção
      gsap.to(scene, {
        scale: 0.97,
        ease: 'none',
        scrollTrigger: { trigger: wrapper, start: '85% top', end: '100% top', scrub: 0.6 },
      });

      // ── Ativar quando <video> real estiver plugado ───────────────────────
      // const video = scene.querySelector<HTMLVideoElement>('video[data-video-src]');
      // if (video && wrapper) driveVideoByScroll(video, wrapper);
    }, wrapper);

    // Pausar animações quando a aba está inativa
    const onVis = () => {
      if (document.hidden) gsap.globalTimeline.pause();
      else gsap.globalTimeline.resume();
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      document.removeEventListener('visibilitychange', onVis);
      ctx.revert();
    };
  }, [rm]);

  return (
    <section
      id="top"
      ref={wrapperRef}
      className="relative"
      style={{
        // 300vh desktop / 200vh mobile via CSS variables
        // Fallback quando reduced-motion: auto
        height: rm ? 'auto' : undefined,
      }}
    >
      {/* Wrapper de altura: 300vh desktop, 200vh mobile */}
      {!rm && (
        <style>{`
          #top { height: 200vh; }
          @media (min-width: 1024px) { #top { height: 320vh; } }
          [data-hero-chip],
          [data-hero-headline],
          [data-hero-evolve],
          [data-hero-paragraph],
          [data-hero-ctas],
          [data-hero-indicators],
          [data-hero-mobilechips] {
            opacity: 0;
            transform: translateY(34px);
            filter: blur(10px);
            will-change: transform, opacity, filter;
          }
          [data-hero-peek] { opacity: 0; transform: translateY(10px); }
        `}</style>
      )}

      <div
        ref={sceneRef}
        className={`${rm ? 'relative' : 'sticky top-0'} flex overflow-hidden`}
        style={{ minHeight: 'clamp(640px, 100svh, 960px)' }}
      >
        {/* Linha decorativa superior */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-[104px] z-10 brand-line opacity-70"
        />

        {/*
          Placeholder abstrato dentro da identidade.
          Para plugar vídeo real: adicione <video data-video-src ... /> aqui,
          com poster e as sources VIDEO_DESKTOP / VIDEO_MOBILE.
        */}
        <div
          data-hero-atmosphere
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute inset-0 grid-mask opacity-70" />
          <div className="orb orb-cyan orb-drift left-[4%] top-[10%] h-[420px] w-[420px]" />
          <div className="orb orb-violet orb-drift-slow right-[2%] bottom-[4%] h-[520px] w-[520px]" />
          <div className="orb orb-blue orb-drift left-[38%] top-[52%] h-[360px] w-[360px] opacity-60" />
        </div>
        <HeroMesh />

        {/* Linha decorativa inferior */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 brand-line opacity-60"
        />

        <div className="container-lp relative z-10 grid w-full grid-cols-1 items-center gap-14 pt-32 pb-24 lg:grid-cols-[1.15fr_1fr] lg:pt-40">
          <div className="flex flex-col gap-7">
            <span
              data-hero-chip
              className="shine-badge inline-flex w-fit items-center gap-2.5 rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#B8DDF6] backdrop-blur"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#0ed8f6] pulse-glow" />
              Especialistas em seguros desde 1988
            </span>

            <div data-hero-headline>
              <MorphingHeadline />
            </div>

            <p
              data-hero-paragraph
              className="max-w-xl text-lg leading-relaxed text-ink-muted"
            >
              Empresas que aderem a tecnologia em seus processos estão sempre a frente no mercado.
            </p>

            <div data-hero-ctas className="flex flex-wrap items-center gap-6 pt-1">
              <a
                href="#solucoes"
                className="btn-primary group focus-visible:ring-2 focus-visible:ring-[#0ed8f6] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                Veja como a Sistran pode ajudar
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  strokeWidth={1.8}
                />
              </a>
              <a
                href="#contato"
                className="group relative inline-flex items-center gap-2 text-sm font-semibold text-white/85 transition-colors hover:text-white"
              >
                Entre em contato conosco
                <span className="inline-block transition-transform group-hover:translate-x-0.5">
                  →
                </span>
                <span
                  aria-hidden
                  className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-white/40 transition-transform duration-300 group-hover:scale-x-100"
                />
              </a>
            </div>

            {/* Mobile chips */}
            <div className="lg:hidden" data-hero-mobilechips>
              <div className="-mx-2 flex snap-x snap-mandatory gap-2 overflow-x-auto px-2 pb-2">
                {DIFFERENTIALS.map((d) => {
                  const Icon = getIcon(d.icon);
                  return (
                    <span
                      key={d.id}
                      className="inline-flex flex-none snap-start items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      <Icon
                        className="h-3.5 w-3.5"
                        style={{ color: d.color }}
                        strokeWidth={1.8}
                      />
                      {d.title}
                    </span>
                  );
                })}
              </div>
            </div>

            <div data-hero-indicators className="mt-2 hidden lg:block">
              <TrustTicker />
            </div>
          </div>

          <div data-hero-evolve className="relative">
            <PillarsCarousel />
          </div>
        </div>

        {/* Peek próxima seção */}
        {!rm && (
          <a
            data-hero-peek
            href="#quem-somos"
            className="group absolute inset-x-0 bottom-6 z-10 flex flex-col items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/50 transition-colors hover:text-white"
          >
            <span>Quem somos</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 transition-colors group-hover:border-white/40">
              <ArrowDown
                className="h-3.5 w-3.5 animate-pulse-soft"
                strokeWidth={1.8}
              />
            </span>
          </a>
        )}
      </div>
    </section>
  );
}
