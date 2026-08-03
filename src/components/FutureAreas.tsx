'use client';

import { motion } from 'motion/react';
import { FUTURE_AREAS } from '@/data/futureAreas';
import { getIcon } from '@/lib/icons';
import { vFadeUp, VP, useReducedMotion } from '@/lib/motion';

export default function FutureAreas() {
  const rm = useReducedMotion();
  return (
    <>
      {FUTURE_AREAS.map((a) => (
        <span key={`anchor-${a.id}`} id={a.id} className="block h-0" aria-hidden />
      ))}
      <section aria-label="Áreas em construção" className="py-8 md:py-12">
        <div className="container-lp">
          <motion.div
            variants={vFadeUp}
            initial={rm ? false : 'hidden'}
            whileInView="visible"
            viewport={VP}
            className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5 backdrop-blur-lg"
          >
            <div className="flex flex-wrap items-center gap-4">
              <span className="inline-flex h-7 items-center rounded-full border border-[#0ed8f6]/40 bg-[#0079CB]/15 px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#0ed8f6]">
                Em breve
              </span>
              <span className="text-sm text-white/70">Novas áreas em construção:</span>
            </div>

            {/* Régua horizontal com marcadores */}
            <div className="relative mt-5 pt-6">
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-2 top-[14px] h-px"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgba(14,216,246,0.6), rgba(0,121,203,0.5), rgba(124,58,237,0.4), transparent)',
                }}
              />
              <ul className="relative grid grid-cols-1 gap-4 sm:grid-cols-3">
                {FUTURE_AREAS.map((a, i) => {
                  const Icon = getIcon(a.icon);
                  const dot = i === 0 ? '#0ed8f6' : i === 1 ? '#0079CB' : '#7c3aed';
                  return (
                    <li key={a.id} className="relative flex items-center gap-3 sm:flex-col sm:items-start sm:pt-4">
                      <span
                        aria-hidden
                        className="pointer-events-none absolute left-0 top-0 hidden h-3 w-3 -translate-y-[6px] rounded-full sm:block"
                        style={{ background: dot, boxShadow: `0 0 12px ${dot}aa`, border: '2px solid #04122A' }}
                      />
                      <span
                        className="flex h-8 w-8 flex-none items-center justify-center rounded-lg sm:hidden"
                        style={{ background: `${dot}22`, border: `1px solid ${dot}55` }}
                      >
                        <Icon className="h-4 w-4" style={{ color: dot }} strokeWidth={1.8} />
                      </span>
                      <div className="flex items-center gap-2">
                        <Icon
                          className="hidden h-4 w-4 sm:inline"
                          style={{ color: dot, filter: `drop-shadow(0 0 6px ${dot}88)` }}
                          strokeWidth={1.8}
                        />
                        <span className="text-sm font-semibold text-white/90">{a.title}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
