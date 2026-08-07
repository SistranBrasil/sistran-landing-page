'use client';

import { motion } from 'motion/react';
import { CONSULTING_AREAS } from '@/data/consulting';
import { getIcon } from '@/lib/icons';
import { vGrid, vCard, vHeader, vTitle, vSubtitle, VP, useReducedMotion } from '@/lib/motion';
import { useTilt } from '@/lib/useTilt';
import type { ConsultingArea } from '@/data/consulting';

function ConsultCard({ c, index }: { c: ConsultingArea; index: number }) {
  const rm = useReducedMotion();
  const { hover, mouse, handlers, tiltTransform } = useTilt(!rm);
  const Icon = getIcon(c.icon);
  const pos = { x: mouse.x * 100, y: mouse.y * 100 };

  return (
    /* Camada externa: entrada via variants (motion controla o transform).
       Camada interna: tilt 3D. Ver nota em useTilt. */
    <motion.div variants={vCard} className="h-full [perspective:1000px]">
      <article
        {...handlers}
        className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/12 p-8 backdrop-blur-xl"
        style={{
          background:
            'linear-gradient(135deg, rgba(8,49,86,0.94), rgba(6,38,69,0.90) 55%, rgba(4,29,55,0.94))',
          transform: tiltTransform({ lift: 8, deg: 6 }),
          transformStyle: 'preserve-3d',
          transition: hover
            ? 'box-shadow .25s ease, border-color .2s ease'
            : 'transform .5s cubic-bezier(.22,1,.36,1), box-shadow .5s ease',
          willChange: 'transform',
          boxShadow: hover
            ? `0 2px 6px rgba(3,26,52,0.20), 0 20px 40px -16px rgba(3,26,52,0.42), 0 44px 80px -32px rgba(3,26,52,0.50), 0 0 60px -18px ${c.tone}55, inset 0 1px 0 rgba(255,255,255,0.22)`
            : `0 1px 3px rgba(3,26,52,0.16), 0 12px 26px -14px rgba(3,26,52,0.34), 0 30px 60px -30px rgba(3,26,52,0.40), inset 0 1px 0 rgba(255,255,255,0.16)`,
        }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-40 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            padding: 1,
            background: `linear-gradient(135deg, ${c.tone}, transparent 60%)`,
            WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(320px circle at ${pos.x}% ${pos.y}%, ${c.tone}22, transparent 55%)`,
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-25 blur-3xl transition-opacity duration-500 group-hover:opacity-45"
          style={{ background: c.tone }}
        />

        <div
          className="relative flex items-start justify-between gap-3"
          style={{ transform: 'translateZ(34px)' }}
        >
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
            style={{
              background: `linear-gradient(135deg, ${c.tone}33, ${c.tone}10)`,
              border: `1px solid ${c.tone}66`,
              boxShadow: `0 8px 24px -12px ${c.tone}99`,
            }}
          >
            <Icon className="h-7 w-7" style={{ color: c.tone }} strokeWidth={1.8} />
          </div>
          <span
            aria-hidden
            className="font-display text-4xl font-black leading-none"
            /* Branco translucido: o tone a 15% desaparecia no fundo azul claro. */
            style={{ color: 'rgba(255,255,255,0.30)', fontVariantNumeric: 'tabular-nums' }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
        <h3
          className="relative mt-5 font-display text-xl font-bold leading-tight text-white"
          style={{ transform: 'translateZ(24px)' }}
        >
          {c.title}
        </h3>
        <p
          className="relative mt-3 text-sm leading-relaxed text-white/85"
          style={{ transform: 'translateZ(14px)' }}
        >
          {c.description}
        </p>
      </article>
    </motion.div>
  );
}

export default function Consulting() {
  const rm = useReducedMotion();
  return (
    <section id="consultoria" className="section-py relative overflow-hidden">
      <div className="container-lp">
        <motion.div
          variants={vHeader}
          initial={rm ? false : 'hidden'}
          whileInView="visible"
          viewport={VP}
          className="mb-12 max-w-3xl"
        >
          <motion.span variants={vSubtitle} className="eyebrow">
            Consultoria
          </motion.span>
          <motion.h2 variants={vTitle} className="mt-3 font-display text-section font-bold text-ink">
            Expertise que <span className="text-gradient">impulsiona crescimento</span>
          </motion.h2>
          <motion.p variants={vSubtitle} className="mt-4 text-lg leading-relaxed text-white/85">
            Consultoria personalizada, projetada para impulsionar o crescimento e a eficiência do
            seu negócio. Nosso time de consultores está preparado para entender suas necessidades e
            oferecer soluções que promovem inovação, eficiência e escala.
          </motion.p>
        </motion.div>

        <motion.div
          variants={vGrid}
          initial={rm ? false : 'hidden'}
          whileInView="visible"
          viewport={VP}
          className="grid grid-cols-1 gap-5 md:grid-cols-2"
        >
          {CONSULTING_AREAS.map((c, i) => (
            <ConsultCard key={c.id} c={c} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
