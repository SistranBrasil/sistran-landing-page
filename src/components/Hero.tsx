'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
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

export default function Hero() {
  const rm = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  const y = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.15]);

  // Scroll-driven reveal (estilo antigravity.google): headline aparece primeiro,
  // demais elementos surgem conforme o usuário rola. Cada etapa faz scrub com ScrollTrigger.
  useEffect(() => {
    if (rm) return;
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);
    const scope = ref.current;
    if (!scope) return;

    const steps = Array.from(scope.querySelectorAll<HTMLElement>('[data-hero-step]'));
    if (!steps.length) return;

    gsap.set(steps, { opacity: 0, y: 40, filter: 'blur(12px)' });

    const ctx = gsap.context(() => {
      steps.forEach((el, i) => {
        const total = steps.length;
        const startPct = 6 + i * (70 / total);
        const endPct = startPct + 70 / total;
        gsap.to(el, {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          ease: 'none',
          scrollTrigger: {
            trigger: scope,
            start: `${startPct}% top`,
            end: `${endPct}% top`,
            scrub: 0.6,
          },
        });
      });
    }, scope);

    return () => ctx.revert();
  }, [rm]);

  return (
    <section id="top" ref={ref} className="relative" style={{ height: rm ? 'auto' : '200vh' }}>
      <div
        className={`${rm ? 'relative' : 'sticky top-0'} flex overflow-hidden`}
        style={{ minHeight: 'clamp(640px, 100vh, 960px)' }}
      >
        {/* Linha decorativa superior */}
        <span aria-hidden className="pointer-events-none absolute inset-x-0 top-[104px] z-10 brand-line opacity-70" />

        {/* Malha animada + orbs locais + grid mask */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 grid-mask opacity-70" />
          <div className="orb orb-cyan orb-drift left-[4%] top-[10%] h-[420px] w-[420px]" />
          <div className="orb orb-violet orb-drift-slow right-[2%] bottom-[4%] h-[520px] w-[520px]" />
          <div className="orb orb-blue orb-drift left-[38%] top-[52%] h-[360px] w-[360px] opacity-60" />
        </div>
        <HeroMesh />

        {/* Linha decorativa inferior */}
        <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-10 brand-line opacity-60" />

        <div className="container-lp relative z-10 grid w-full grid-cols-1 items-center gap-14 pt-32 pb-24 lg:grid-cols-[1.15fr_1fr] lg:pt-40">
          <motion.div
            style={rm ? undefined : { y, scale, opacity }}
            className="flex flex-col gap-7"
          >
            <span data-hero-step className="shine-badge inline-flex w-fit items-center gap-2.5 rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#B8DDF6] backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0ed8f6] pulse-glow" />
              Especialistas em seguros desde 1988
            </span>

            <MorphingHeadline />

            <p data-hero-step className="max-w-xl text-lg leading-relaxed text-ink-muted">
              Empresas que aderem a tecnologia em seus processos estão sempre a frente no mercado.
            </p>

            <div data-hero-step className="flex flex-wrap items-center gap-6 pt-1">
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
            <div className="lg:hidden">
              <div data-lenis-prevent
                className="-mx-2 flex snap-x snap-mandatory gap-2 overflow-x-auto px-2 pb-2">
                {DIFFERENTIALS.map((d) => {
                  const Icon = getIcon(d.icon);
                  return (
                    <span
                      key={d.id}
                      className="inline-flex flex-none snap-start items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      <Icon className="h-3.5 w-3.5" style={{ color: d.color }} strokeWidth={1.8} />
                      {d.title}
                    </span>
                  );
                })}
              </div>
            </div>

            <div data-hero-step className="mt-2 hidden lg:block">
              <TrustTicker />
            </div>
          </motion.div>

          <motion.div data-hero-step style={rm ? undefined : { opacity }} className="relative">
            <PillarsCarousel />
          </motion.div>
        </div>

        {/* Peek próxima seção */}
        {!rm && (
          <a
            href="#quem-somos"
            className="group absolute inset-x-0 bottom-6 z-10 flex flex-col items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/75 transition-colors hover:text-white"
          >
            <span>Quem somos</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 transition-colors group-hover:border-white/40">
              <ArrowDown className="h-3.5 w-3.5 animate-pulse-soft" strokeWidth={1.8} />
            </span>
          </a>
        )}
      </div>
    </section>
  );
}
