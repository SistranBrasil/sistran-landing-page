'use client';

import { motion } from 'motion/react';
import { ACCELERATORS, type Accelerator } from '@/data/accelerators';
import { getIcon } from '@/lib/icons';
import { vGrid, vCard, vHeader, vTitle, vSubtitle, VP, useReducedMotion } from '@/lib/motion';
import { useTilt } from '@/lib/useTilt';

function AccelCard({ a, index }: { a: Accelerator; index: number }) {
  const rm = useReducedMotion();
  const { hover, mouse, handlers, tiltTransform } = useTilt(!rm);
  const Icon = getIcon(a.icon);
  const pos = { x: mouse.x * 100, y: mouse.y * 100 };

  return (
    /* Camada externa: entrada via variants (motion controla o transform).
       Camada interna: tilt 3D. Ver nota em useTilt. */
    <motion.div variants={vCard} className="h-full [perspective:1000px]">
    <article
      {...handlers}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/12 p-7 backdrop-blur-xl"
      style={{
        // Navy escuro: o card precisa contrastar com o fundo azul medio da
        // pagina. Um branco translucido ficava com a mesma cor do fundo.
        background:
          'linear-gradient(135deg, rgba(8,49,86,0.94), rgba(6,38,69,0.90) 55%, rgba(4,29,55,0.94))',
        transform: tiltTransform({ lift: 8, deg: 7 }),
        transformStyle: 'preserve-3d',
        transition: hover
          ? 'box-shadow .25s ease, border-color .2s ease'
          : 'transform .5s cubic-bezier(.22,1,.36,1), box-shadow .5s ease',
        willChange: 'transform',
        // Sombra em camadas + halo do tone: da volume real ao card.
        boxShadow: hover
          ? `0 2px 6px rgba(3,26,52,0.20), 0 20px 40px -16px rgba(3,26,52,0.42), 0 44px 80px -32px rgba(3,26,52,0.50), 0 0 60px -18px ${a.tone}55, inset 0 1px 0 rgba(255,255,255,0.22)`
          : `0 1px 3px rgba(3,26,52,0.16), 0 12px 26px -14px rgba(3,26,52,0.34), 0 30px 60px -30px rgba(3,26,52,0.40), inset 0 1px 0 rgba(255,255,255,0.16)`,
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-40 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          padding: 1,
          background: `linear-gradient(135deg, ${a.tone}, transparent 60%)`,
          WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(300px circle at ${pos.x}% ${pos.y}%, ${a.tone}22, transparent 55%)` }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-40"
        style={{ background: a.tone }}
      />

      <div
        className="relative flex items-start justify-between gap-3"
        style={{ transform: 'translateZ(34px)' }}
      >
        <div
          className="flex h-13 w-13 items-center justify-center rounded-2xl p-3 transition-transform duration-300 group-hover:scale-110"
          style={{
            background: `linear-gradient(135deg, ${a.tone}33, ${a.tone}10)`,
            border: `1px solid ${a.tone}66`,
            boxShadow: `0 8px 24px -12px ${a.tone}99`,
          }}
        >
          <Icon className="h-6 w-6" style={{ color: a.tone }} strokeWidth={1.8} />
        </div>
        <span
          aria-hidden
          className="font-display text-3xl font-black leading-none"
          style={{
            // Branco translucido: o tone em opacity 15% desaparecia no fundo azul.
            color: 'rgba(255,255,255,0.30)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <h3
        className="relative mt-6 font-display text-xl font-bold leading-tight text-white"
        style={{ transform: 'translateZ(24px)' }}
      >
        {a.name}
      </h3>
      <p
        className="relative mt-1 text-xs font-semibold uppercase tracking-[0.14em]"
        style={{ color: a.tone, transform: 'translateZ(18px)' }}
      >
        {a.tagline}
      </p>
      <p
        className="relative mt-4 text-sm leading-relaxed text-white/85"
        style={{ transform: 'translateZ(12px)' }}
      >
        {a.description}
      </p>
    </article>
    </motion.div>
  );
}

export default function Accelerators() {
  const rm = useReducedMotion();
  return (
    <section id="tecnologia-disruptiva" className="section-py relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-0 top-32 h-[380px] w-[380px] rounded-full bg-[#57B7EE]/15 blur-[130px]" />
        <div className="absolute right-0 bottom-32 h-[420px] w-[420px] rounded-full bg-[#A78BFA]/12 blur-[130px]" />
      </div>

      <div className="container-lp">
        <motion.div
          variants={vHeader}
          initial={rm ? false : 'hidden'}
          whileInView="visible"
          viewport={VP}
          className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-2xl">
            <motion.span variants={vSubtitle} className="tag-section">
              Tecnologia Disruptiva · Soluções
            </motion.span>
            <motion.h2
              variants={vTitle}
              className="mt-3 font-display text-section font-bold text-white"
            >
              Aceleradores para os melhores resultados
            </motion.h2>
            <motion.p variants={vSubtitle} className="mt-4 text-lg leading-relaxed text-white/75">
              Desenvolvemos aceleradores para entregar os melhores resultados. Ouvimos seu desafio,
              fazemos Discovery para o seu negócio e desenhamos uma solução personalizada,
              entregando resultados assertivos com excelência.
            </motion.p>
          </div>
          <span className="inline-flex h-fit items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A5F0FF]">
            {ACCELERATORS.length} aceleradores
          </span>
        </motion.div>

        <motion.div
          variants={vGrid}
          initial={rm ? false : 'hidden'}
          whileInView="visible"
          viewport={VP}
          className="grid auto-rows-[minmax(300px,1fr)] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {ACCELERATORS.map((a, i) => (
            <AccelCard key={a.id} a={a} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
