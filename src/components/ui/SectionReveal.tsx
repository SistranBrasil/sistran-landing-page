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
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const el = ref.current;
    if (!el) return;

    const targets = Array.from(el.querySelectorAll<HTMLElement>(selector)).filter(
      (t) => !t.closest('[data-reveal-skip]')
    );
    if (!targets.length) return;

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
        },
      });
    }, el);

    return () => ctx.revert();
  }, [selector, y, duration, stagger, blur]);

  return (
    <div ref={ref} id={id} className={className}>
      {children}
    </div>
  );
}
