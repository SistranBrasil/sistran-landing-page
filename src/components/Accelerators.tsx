'use client';

import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ACCELERATORS, type Accelerator } from '@/data/accelerators';
import { getIcon } from '@/lib/icons';
import { vGrid, vCard, vHeader, vTitle, vSubtitle, VP, useReducedMotion } from '@/lib/motion';

function AccelCard({ a, index }: { a: Accelerator; index: number }) {
  const rm = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const Icon = getIcon(a.icon);

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    if (rm || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  return (
    <motion.article
      ref={ref}
      variants={vCard}
      onMouseMove={onMove}
      whileHover={rm ? undefined : { y: -4 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[rgba(0,45,92,0.72)] to-[rgba(0,77,138,0.42)] p-7 backdrop-blur-xl"
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

      <div className="relative flex items-start justify-between gap-3">
        <div
          className="flex h-13 w-13 items-center justify-center rounded-2xl p-3"
          style={{
            background: `linear-gradient(135deg, ${a.tone}22, ${a.tone}08)`,
            border: `1px solid ${a.tone}55`,
            boxShadow: `0 8px 24px -12px ${a.tone}88`,
          }}
        >
          <Icon className="h-6 w-6" style={{ color: a.tone }} strokeWidth={1.8} />
        </div>
        <span
          aria-hidden
          className="font-display text-3xl font-black opacity-15 leading-none"
          style={{ color: a.tone, fontVariantNumeric: 'tabular-nums' }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <h3 className="relative mt-6 font-display text-xl font-bold leading-tight text-white">
        {a.name}
      </h3>
      <p
        className="relative mt-1 text-xs font-semibold uppercase tracking-[0.14em]"
        style={{ color: a.tone }}
      >
        {a.tagline}
      </p>
      <p className="relative mt-4 text-sm leading-relaxed text-ink-muted">{a.description}</p>
    </motion.article>
  );
}

export default function Accelerators() {
  const rm = useReducedMotion();
  return (
    <section id="tecnologia-disruptiva" className="section-py relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-0 top-32 h-[380px] w-[380px] rounded-full bg-[#0079CB]/15 blur-[130px]" />
        <div className="absolute right-0 bottom-32 h-[420px] w-[420px] rounded-full bg-[#7c3aed]/12 blur-[130px]" />
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
            <motion.span variants={vSubtitle} className="eyebrow !text-[#0ed8f6]">
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
          <span className="inline-flex h-fit items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0ed8f6]">
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
