'use client';

import { motion } from 'motion/react';
import { Award, Users, Clock, Building2, ShieldCheck } from 'lucide-react';
import { useReducedMotion } from '@/lib/motion';

const ITEMS = [
  { icon: Clock, text: '+35 anos no mercado segurador' },
  { icon: Users, text: '+850 profissionais' },
  { icon: Building2, text: '+130 clientes' },
  { icon: Award, text: '+23 prêmios e reconhecimentos' },
  { icon: ShieldCheck, text: '+25 implantações de sinistro' },
];

export default function TrustTicker() {
  const rm = useReducedMotion();
  const loop = [...ITEMS, ...ITEMS];

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        maskImage:
          'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
        WebkitMaskImage:
          'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
      }}
      aria-label="Indicadores institucionais"
    >
      <motion.div
        className="flex w-max items-center gap-10"
        animate={rm ? undefined : { x: ['0%', '-50%'] }}
        transition={rm ? undefined : { duration: 32, repeat: Infinity, ease: 'linear' }}
      >
        {loop.map((it, idx) => {
          const Icon = it.icon;
          return (
            <span
              key={idx}
              className="inline-flex items-center gap-2 whitespace-nowrap text-xs font-medium text-ink-faint"
            >
              <Icon className="h-3.5 w-3.5 text-[#0ed8f6]" strokeWidth={1.8} />
              {it.text}
              <span className="ml-6 h-1 w-1 rounded-full bg-white/20" />
            </span>
          );
        })}
      </motion.div>
    </div>
  );
}
