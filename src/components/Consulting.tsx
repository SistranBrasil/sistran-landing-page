'use client';

import { motion } from 'motion/react';
import { CONSULTING_AREAS } from '@/data/consulting';
import { getIcon } from '@/lib/icons';
import { vGrid, vCard, vHeader, vTitle, vSubtitle, VP, useReducedMotion } from '@/lib/motion';

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
          <motion.p variants={vSubtitle} className="mt-4 text-lg leading-relaxed text-ink-muted">
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
          {CONSULTING_AREAS.map((c, i) => {
            const Icon = getIcon(c.icon);
            return (
              <motion.article
                key={c.id}
                variants={vCard}
                whileHover={rm ? undefined : { y: -4 }}
                className="glass-card-hover group relative flex h-full flex-col overflow-hidden p-8"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-25 blur-3xl transition-opacity duration-500 group-hover:opacity-45"
                  style={{ background: c.tone }}
                />
                <div className="relative flex items-start justify-between gap-3">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${c.tone}22, ${c.tone}08)`,
                      border: `1px solid ${c.tone}55`,
                      boxShadow: `0 8px 24px -12px ${c.tone}88`,
                    }}
                  >
                    <Icon className="h-7 w-7" style={{ color: c.tone }} strokeWidth={1.8} />
                  </div>
                  <span
                    aria-hidden
                    className="font-display text-4xl font-black leading-none opacity-15"
                    style={{ color: c.tone, fontVariantNumeric: 'tabular-nums' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="relative mt-5 font-display text-xl font-bold leading-tight text-ink">
                  {c.title}
                </h3>
                <p className="relative mt-3 text-sm leading-relaxed text-ink-muted">{c.description}</p>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
