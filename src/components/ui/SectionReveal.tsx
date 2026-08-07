'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type Props = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  /** Seletor opt-in. Default: só [data-reveal] (evita conflito com cards sticky/scroll-driven). */
  selector?: string;
  y?: number;
  duration?: number;
  stagger?: number;
  blur?: number;
};

export default function SectionReveal({
  children,
  className,
  id,
  selector = '[data-reveal]',
  y = 34,
  duration = 0.8,
  stagger = 0.12,
  blur = 10,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const el = ref.current;
    if (!el) return;

    const targets = Array.from(el.querySelectorAll<HTMLElement>(selector)).filter(
      (t) => !t.closest('[data-reveal-skip]')
    );
    if (!targets.length) return;

    /* Com reduced-motion nao escondemos nada: o conteudo simplesmente aparece.
       Antes havia um early return ANTES do gsap.set, o que funcionava, mas
       tambem impedia o fallback abaixo de existir. */
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    /* Rede de seguranca: o gsap.set abaixo deixa os alvos em opacity 0. Se o
       ScrollTrigger nao disparar (posicao medida errada por reflow de fonte,
       ancestral com overflow, erro de JS), o conteudo ficaria invisivel para
       sempre. Este IntersectionObserver revela por conta propria caso o GSAP
       nao tenha revelado dentro do tempo esperado. */
    let revealed = false;
    const forceVisible = () => {
      if (revealed) return;
      revealed = true;
      gsap.set(targets, { opacity: 1, y: 0, filter: 'none', clearProps: 'filter,transform' });
    };

    gsap.set(targets, { opacity: 0, y, filter: `blur(${blur}px)` });

    const ctx = gsap.context(() => {
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration,
        ease: 'power2.out',
        stagger,
        clearProps: 'filter',
        scrollTrigger: {
          trigger: el,
          start: 'top 82%',
          end: 'bottom 40%',
          toggleActions: 'play none none reverse',
          onEnter: () => {
            revealed = true;
          },
        },
      });
    }, el);

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          // Deixa o ScrollTrigger agir primeiro; so intervem se ele nao agiu.
          window.setTimeout(() => {
            if (!revealed) forceVisible();
          }, 600);
        }
      },
      { threshold: 0.01 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      ctx.revert();
    };
  }, [selector, y, duration, stagger, blur]);

  return (
    <div ref={ref} id={id} className={className}>
      {children}
    </div>
  );
}
