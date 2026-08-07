'use client';

import { motion } from 'motion/react';
import { vHeader, vTitle, vSubtitle, vEyebrow, VP, useReducedMotion } from '@/lib/motion';

type Props = {
  eyebrow?: string;
  title: string;
  highlight?: string;
  description?: React.ReactNode;
};

export default function PageHero({ eyebrow, title, highlight, description }: Props) {
  const rm = useReducedMotion();
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/4 h-[480px] w-[480px] rounded-full bg-[#57B7EE]/25 blur-[130px]" />
        <div className="absolute -bottom-24 right-0 h-[400px] w-[400px] rounded-full bg-[#0ed8f6]/15 blur-[130px]" />
      </div>
      <div className="container-lp">
        <motion.div
          variants={vHeader}
          initial={rm ? false : 'hidden'}
          animate="visible"
          viewport={VP}
          className="max-w-3xl"
        >
          {eyebrow && (
            <motion.span variants={vEyebrow} className="eyebrow !text-[#A5F0FF]">
              {eyebrow}
            </motion.span>
          )}
          <motion.h1
            variants={vTitle}
            className="mt-4 font-display text-section font-black tracking-tight text-white"
          >
            {title}
            {highlight && <span className="text-[#A5F0FF]"> {highlight}</span>}
          </motion.h1>
          {description && (
            <motion.div
              variants={vSubtitle}
              className="mt-5 space-y-4 text-lg leading-relaxed text-white/85"
            >
              {description}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
