'use client';

/**
 * HeroCinematic — Hero cinematográfico controlado por scroll.
 *
 * Wrapper de 300vh (desktop) / 200vh (mobile) com cena sticky em 100svh.
 * Todo o texto/copy do Hero.tsx original é preservado — apenas apresentação e
 * timing mudam.
 *
 * Sequência:
 *   mount      Chip, título (MorphingHeadline), parágrafo e CTAs — o hero já
 *              está legível antes de qualquer scroll.
 *   0.03–0.22  CompanySignature (painel institucional orbital) entra
 *   0.24–0.40  Indicadores (TrustTicker) e peek "Quem somos"
 *   0.00–0.55  Órbita cresce; orbs e linhas fazem parallax em profundidades
 *              distintas
 *   0.55–1.00  A cena "afunda" (scale + fade + blur) para a próxima seção
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
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { DIFFERENTIALS } from '@/data/differentials';
import { getIcon } from '@/lib/icons';
import { useReducedMotion } from '@/lib/motion';
import HeroMesh from './ui/HeroMesh';
import CompanySignature from './ui/CompanySignature';
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

    const progress = scene.querySelector<HTMLElement>('[data-hero-progress-fill]');
    const orbit = scene.querySelector<HTMLElement>('[data-hero-orbit]');
    const orbs = scene.querySelectorAll<HTMLElement>('[data-hero-orb]');
    const lines = scene.querySelector<HTMLElement>('[data-hero-lines]');

    const initial = { opacity: 0, y: 34, filter: 'blur(10px)' };
    [chip, headline, paragraph, ctas, indicators, mobileChips].forEach((el) => {
      if (el) gsap.set(el, initial);
    });
    if (peek) gsap.set(peek, { opacity: 0, y: 10 });

    const ctx = gsap.context(() => {
      // ── Fase 0 (sem scroll): o essencial já está legível no primeiro frame.
      // Chip, headline, parágrafo e CTAs entram no mount — o usuário nunca vê
      // um hero vazio esperando scroll.
      const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.9 } });
      const reveal = (el: Element | null, at: string | number = '<0.12') => {
        if (!el) return;
        tl.to(el, { opacity: 1, y: 0, filter: 'blur(0px)' }, at);
      };
      // TUDO entra no mount. Nada de conteúdo do hero fica esperando scroll —
      // o primeiro quadro já mostra a cena completa, inclusive o painel da
      // direita. O scroll serve só para parallax e para a saída da cena.
      reveal(chip, 0);
      reveal(headline, '<0.12');
      reveal(paragraph, '<0.18');
      reveal(ctas, '<0.1');
      reveal(mobileChips, '<0.08');
      reveal(indicators, '<0.08');
      if (peek) tl.to(peek, { opacity: 1, y: 0 }, '<0.15');

      // Órbita: entrada com escala própria e depois parallax suave no scroll.
      if (orbit) {
        gsap.from(orbit, {
          scale: 0.82,
          rotate: -6,
          duration: 1.4,
          ease: 'power3.out',
          delay: 0.15,
        });
        gsap.to(orbit, {
          yPercent: -8,
          ease: 'none',
          scrollTrigger: { trigger: wrapper, start: 'top top', end: '55% top', scrub: 0.8 },
        });
      }

      // Barra de progresso do hero (0 → 1 ao longo de todo o wrapper).
      if (progress) {
        gsap.fromTo(
          progress,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: { trigger: wrapper, start: 'top top', end: 'bottom top', scrub: 0.4 },
          },
        );
      }

      // ── Profundidade: cada camada da atmosfera anda a uma velocidade
      // diferente, então o fundo "abre" em vez de deslizar em bloco.
      orbs.forEach((orbEl, idx) => {
        const depth = [0.18, 0.34, 0.5][idx] ?? 0.3;
        gsap.to(orbEl, {
          yPercent: -depth * 100,
          ease: 'none',
          scrollTrigger: { trigger: wrapper, start: 'top top', end: 'bottom top', scrub: 1 },
        });
      });
      if (lines) {
        gsap.to(lines, {
          yPercent: -12,
          ease: 'none',
          scrollTrigger: { trigger: wrapper, start: 'top top', end: 'bottom top', scrub: 1.2 },
        });
      }

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

      // Transição para a próxima seção: o hero "afunda" (scale + fade + blur + y).
      // Mesmos parâmetros do HeroScrollWrapper do padrão sistran-labs.
      gsap.set(scene, { transformOrigin: '50% 40%', willChange: 'transform, opacity, filter' });
      const sink = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: wrapper, start: '55% top', end: '100% top', scrub: 0.6 },
      });
      // 0 → 1 do percurso de saída: encolhe e sobe o tempo todo…
      sink.to(scene, { scale: 0.86, y: -80, duration: 1 }, 0);
      // …fade a partir de 55% (igual opacity [1, 0.85, 0])…
      sink.to(scene, { opacity: 0.85, duration: 0.55 }, 0);
      sink.to(scene, { opacity: 0, duration: 0.45 }, 0.55);
      // …e blur só no trecho final (70% → 100%).
      sink.to(scene, { filter: 'blur(6px)', duration: 0.3 }, 0.7);

      // ── Ativar quando <video> real estiver plugado ───────────────────────
      // const video = scene.querySelector<HTMLVideoElement>('video[data-video-src]');
      // if (video && wrapper) driveVideoByScroll(video, wrapper);
    }, wrapper);

    /* Rede de seguranca: o gsap.set acima (e o <style> do JSX) deixa o
       conteudo em opacity 0. Se a timeline nao rodar (erro de JS, GSAP nao
       carregado), o hero ficaria vazio para sempre. */
    const safety = window.setTimeout(() => {
      [chip, headline, paragraph, ctas, indicators, mobileChips, peek].forEach((el) => {
        if (el && Number(getComputedStyle(el).opacity) < 0.05) {
          gsap.set(el, { opacity: 1, y: 0, filter: 'none' });
        }
      });
    }, 2500);

    /* NAO pausar gsap.globalTimeline em visibilitychange. Isso congela TODAS
       as animacoes do site, inclusive as de outras secoes, e se o componente
       desmontar com a aba oculta o resume nunca acontece — a pagina fica
       estatica de forma permanente. Era a causa dos "efeitos travados" em
       algumas maquinas (abrir em nova aba de fundo, RDP, segundo monitor).
       O browser ja throttla o requestAnimationFrame em abas ocultas. */

    return () => {
      window.clearTimeout(safety);
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
          /* NOTA: [data-hero-evolve] fica de fora de propósito. O painel
             institucional nunca deve depender do JS para ficar visível — se o
             GSAP falhar, ele continua na tela. */
          [data-hero-chip],
          [data-hero-headline],
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
          {/* Base navy própria do hero. O body é um azul médio (#1273BC) e os
              acentos ciano/violeta somem em cima dele — este gradiente escuro
              devolve o contraste para as cores da marca aparecerem. */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 90% 70% at 72% 38%, rgba(4,32,66,0.45), transparent 62%),' +
                'linear-gradient(165deg, #041B3D 0%, #062B54 42%, #0A3E70 78%, #0F5590 100%)',
            }}
          />
          <div className="absolute inset-0 grid-mask opacity-70" />
          {/* Orbs mais saturados e maiores: com a base escura eles finalmente leem */}
          <div
            data-hero-orb
            className="orb orb-drift left-[2%] top-[6%] h-[520px] w-[520px]"
            style={{
              background:
                'radial-gradient(circle, rgba(14,216,246,0.55), rgba(14,216,246,0.08) 55%, transparent 72%)',
            }}
          />
          <div
            data-hero-orb
            className="orb orb-drift-slow right-[-4%] bottom-[-6%] h-[600px] w-[600px]"
            style={{
              background:
                'radial-gradient(circle, rgba(168,85,247,0.5), rgba(124,58,237,0.10) 55%, transparent 72%)',
            }}
          />
          {/* Terceiro orb só no desktop: menos camadas com blur no mobile */}
          <div
            data-hero-orb
            className="orb orb-drift left-[34%] top-[54%] hidden h-[420px] w-[420px] lg:block"
            style={{
              background:
                'radial-gradient(circle, rgba(0,180,255,0.42), transparent 68%)',
            }}
          />

          {/* Linhas SVG tracejadas em movimento (receita skill sistran-labs, camada 5) */}
          <svg
            data-hero-lines
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMid slice"
            className="absolute inset-0 h-full w-full"
            style={{ mixBlendMode: 'screen' }}
          >
            <defs>
              <linearGradient id="hero-lg1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0ed8f6" stopOpacity="0" />
                <stop offset="30%" stopColor="#57B7EE" stopOpacity="1" />
                <stop offset="70%" stopColor="#78C9F8" stopOpacity="1" />
                <stop offset="100%" stopColor="#78C9F8" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="hero-lg2" x1="100%" y1="0%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0" />
                <stop offset="35%" stopColor="#a855f7" stopOpacity="0.9" />
                <stop offset="75%" stopColor="#78C9F8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#78C9F8" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M -100 700 Q 300 200 720 380 T 1540 100"
              fill="none"
              stroke="url(#hero-lg1)"
              strokeWidth="1.4"
              strokeDasharray="6 6"
              opacity="0.55"
              style={{ animation: 'dash-march 2.5s linear infinite' }}
            />
            <path
              d="M -80 200 Q 380 620 780 460 T 1520 760"
              fill="none"
              stroke="url(#hero-lg2)"
              strokeWidth="1.2"
              strokeDasharray="6 6"
              opacity="0.42"
              style={{ animation: 'dash-march-rev 4.2s linear infinite' }}
            />
            <line x1="0" y1="520" x2="1440" y2="280" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            <line x1="0" y1="300" x2="1440" y2="640" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          </svg>
        </div>
        <HeroMesh />

        {/* Vinheta radial: escurece as bordas e joga o olho para o centro */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              'radial-gradient(ellipse 78% 68% at 50% 45%, transparent 40%, rgba(3,17,38,0.55) 100%)',
          }}
        />

        {/* Linha decorativa inferior */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 brand-line opacity-60"
        />

        {/* minmax(0, …) é obrigatório: sem ele a largura mínima automática do
            grid deixa a headline gigante empurrar a coluna da direita para
            fora da tela. */}
        {/* Em lg+ o hero abandona o max-w-container (1180px) e assume a MESMA
            caixa da navbar — min(1240px, 100%-32px) + pl-5 — para que a headline
            comece exatamente na vertical do logo. */}
        <div className="container-lp relative z-10 grid w-full grid-cols-1 items-center gap-14 pt-32 pb-24 lg:w-[min(1240px,calc(100%-32px))] lg:max-w-none lg:grid-cols-[minmax(0,1.18fr)_minmax(0,0.82fr)] lg:gap-10 lg:px-5 lg:pt-40">
          <div className="flex min-w-0 flex-col gap-7">
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
              {/* Link (nao <a href="#solucoes">): o CTA leva para a pagina
                  /solucoes, nao para a ancora da secao na home. Link faz a
                  navegacao client-side e o prefetch da rota. */}
              <Link
                href="/solucoes"
                className="btn-primary group focus-visible:ring-2 focus-visible:ring-[#0ed8f6] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                Veja como a Sistran pode ajudar
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  strokeWidth={1.8}
                />
              </Link>
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
              <div data-lenis-prevent
                className="-mx-2 flex snap-x snap-mandatory gap-2 overflow-x-auto px-2 pb-2">
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
            <div data-hero-orbit className="will-change-transform">
              <CompanySignature />
            </div>
          </div>
        </div>

        {/* Peek da próxima seção + progresso do percurso do hero */}
        {!rm && (
          <div
            data-hero-peek
            className="absolute inset-x-0 bottom-6 z-10 flex flex-col items-center gap-3"
          >
            <a
              href="#quem-somos"
              className="group flex flex-col items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/75 transition-colors hover:text-white"
            >
              <span>Quem somos</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 transition-colors group-hover:border-white/40">
                <ArrowDown className="h-3.5 w-3.5 animate-pulse-soft" strokeWidth={1.8} />
              </span>
            </a>
            {/* Trilha de progresso: quanto do percurso do hero já foi rolado */}
            <span
              aria-hidden
              className="h-[2px] w-[min(220px,40vw)] overflow-hidden rounded-full bg-white/10"
            >
              <span
                data-hero-progress-fill
                className="progress-line block h-full w-full origin-left rounded-full"
                style={{ transform: 'scaleX(0)' }}
              />
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
