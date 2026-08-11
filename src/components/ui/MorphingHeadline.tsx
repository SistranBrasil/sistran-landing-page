'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { gsap } from 'gsap';
import { prefersReducedMotion, useReducedMotion } from '@/lib/motion';

const WORDS = ['Alta Performance', 'Precisão', 'Escala'] as const;

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
    /* `prefersReducedMotion()` além de `rm`: no primeiro passe o hook ainda
       devolve o snapshot do servidor (`false`), e sem a leitura síncrona o
       gsap.set abaixo escondia as três linhas um instante antes de o valor real
       chegar — aí o effect saía por aqui e ninguém mais as revelava. */
    if (rm || prefersReducedMotion()) {
      setIntroDone(true);
      return;
    }
    const l1 = line1Ref.current;
    const l3 = line3Ref.current;
    const slot = morphSlotRef.current;
    if (!l1 || !l3 || !slot) return;

    const ctx = gsap.context(() => {
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
    }, rootRef);

    /* `ctx.revert()`, não `tl.kill()`: matar a timeline no meio deixaria as
       linhas paradas no estado oculto em que o gsap.set as colocou. */
    return () => ctx.revert();
  }, [rm]);

  /* O rodízio das palavras roda mesmo com movimento reduzido: congelado, as
     outras duas ficariam inacessíveis. O que fica desligado é a intro com
     blur/clip acima, essa sim decorativa. */
  useEffect(() => {
    if (!introDone) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % WORDS.length), 2600);
    return () => window.clearInterval(t);
  }, [introDone]);

  return (
    <h1
      ref={rootRef}
      className="font-display font-black tracking-tight text-white"
      style={{
        // Escala pela coluna, não pela viewport: em 7vw o título estourava a
        // metade esquerda do grid do hero.
        // "e Comprometimento" é a linha mais longa: em 3.5vw ela ficava mais
        // larga que a coluna e era hifenizada ("Comprometi-/mento"). Em 3.2vw
        // cabe inteira, então a hifenização só age como rede de segurança.
        fontSize: 'clamp(2.25rem, 3.2vw, 4.1rem)',
        lineHeight: 1.0,
        letterSpacing: '-0.025em',
        hyphens: 'auto',
      }}
    >
      <span className="block overflow-hidden">
        <span ref={line1Ref} className="block font-medium text-white/80 will-change-transform">
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
              className="text-gradient-hero inline-block font-black"
            >
              {WORDS[i]}
            </motion.span>
          </AnimatePresence>
        </span>
      </span>
      <span className="block overflow-hidden">
        {/* lg:whitespace-nowrap: a partir de lg a coluna já acomoda a linha
            inteira, então proibimos a quebra em vez de aceitar o hífen. */}
        <span ref={line3Ref} className="block font-medium text-white/80 will-change-transform lg:whitespace-nowrap">
          e Comprometimento
        </span>
      </span>
    </h1>
  );
}
