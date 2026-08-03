'use client';

import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { vFadeUp, VP, useReducedMotion } from '@/lib/motion';

type Props = {
  title?: string;
  description?: string;
  eyebrow?: string;
};

export default function ContactCTA({
  eyebrow = 'Fale com a gente',
  title = 'Quer conversar com um de nossos especialistas?',
  description = 'Temos uma equipe qualificada para atender as suas necessidades.',
}: Props) {
  const rm = useReducedMotion();
  return (
    <section className="section-py relative overflow-hidden">
      <div className="container-lp">
        <motion.div
          variants={vFadeUp}
          initial={rm ? false : 'hidden'}
          whileInView="visible"
          viewport={VP}
          className="relative overflow-hidden rounded-3xl border border-white/12 p-10 md:p-14"
          style={{
            background:
              'linear-gradient(135deg, rgba(0,77,138,0.9) 0%, rgba(0,121,203,0.75) 50%, rgba(124,58,237,0.5) 100%)',
            boxShadow: '0 30px 80px -30px rgba(0,77,138,0.8)',
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/12 blur-[110px]"
          />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#B8DDF6]">
                {eyebrow}
              </span>
              <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-white md:text-4xl">
                {title}
              </h2>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-white/85">{description}</p>
            </div>
            <Link
              href="/#contato"
              className="inline-flex flex-none items-center gap-3 self-start rounded-full bg-white px-6 py-3 text-sm font-bold md:self-auto"
              style={{ color: '#0b2550', boxShadow: '0 10px 30px rgba(0,0,0,0.24)' }}
            >
              Fale com a Sistran
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
