'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { gsap } from 'gsap';
import { useReducedMotion } from '@/lib/motion';

const WORDS = ['Alta Performance', 'Comprometimento', 'Precisão', 'Escala'] as const;

export default function MorphingHeadline() {
  const rm = useReducedMotion();
  const [i, setI] = useState(0);
  const rootRef = useRef<HTMLHeadingElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line3Ref = useRef<HTMLSpanElement>(null);
  const morphSlotRef = useRef<HTMLSpanElement>(null);
  const [introDone, setIntroDone] = useState(false);

  // Intro sequencial estilo valientebrands: mask reveal linha a linha
  useEffect(() => {
    if (rm) {
      setIntroDone(true);
      return;
    }
    const l1 = line1Ref.current;
    const l3 = line3Ref.current;
    const slot = morphSlotRef.current;
    if (!l1 || !l3 || !slot) return;

    // estado inicial: máscara escondendo (translateY 100% + clip-path inset)
    gsap.set([l1, slot, l3], {
      yPercent: 110,
      opacity: 0,
      filter: 'blur(14px)',
      clipPath: 'inset(0 0 100% 0)',
    });

    const tl = gsap.timeline({
      defaults: { ease: 'power4.out' },
      onComplete: () => setIntroDone(true),
    });

    tl.to(l1, {
      yPercent: 0,
      opacity: 1,
      filter: 'blur(0px)',
      clipPath: 'inset(0 0 0% 0)',
      duration: 1.15,
    })
      .to(
        slot,
        {
          yPercent: 0,
          opacity: 1,
          filter: 'blur(0px)',
          clipPath: 'inset(0 0 0% 0)',
          duration: 1.25,
        },
        '-=0.85'
      )
      .to(
        l3,
        {
          yPercent: 0,
          opacity: 1,
          filter: 'blur(0px)',
          clipPath: 'inset(0 0 0% 0)',
          duration: 1.15,
        },
        '-=0.9'
      );

    return () => {
      tl.kill();
    };
  }, [rm]);

  // Após a intro terminar, começa o morph das palavras
  useEffect(() => {
    if (rm || !introDone) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % WORDS.length), 2600);
    return () => window.clearInterval(t);
  }, [rm, introDone]);

  return (
    <h1
      ref={rootRef}
      className="font-display text-hero font-black tracking-tight leading-[0.98] text-white"
    >
      <span className="block overflow-hidden">
        <span ref={line1Ref} className="block font-medium text-white/55 will-change-transform">
          Entrega com
        </span>
      </span>
      <span className="relative block overflow-hidden">
        <span ref={morphSlotRef} className="block will-change-transform">
          <AnimatePresence mode="wait">
            <motion.span
              key={WORDS[i]}
              initial={rm || !introDone ? false : { y: '0.4em', opacity: 0, filter: 'blur(10px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              exit={rm ? { opacity: 0 } : { y: '-0.4em', opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block font-black text-white"
            >
              {WORDS[i]}
            </motion.span>
          </AnimatePresence>
        </span>
      </span>
      <span className="block overflow-hidden">
        <span ref={line3Ref} className="block font-medium text-white/55 will-change-transform">
          e Comprometimento
        </span>
      </span>
    </h1>
  );
}
