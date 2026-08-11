'use client';

import { motion } from 'motion/react';
import { Award, Users, Clock, Building2, ShieldCheck } from 'lucide-react';

const ITEMS = [
  { icon: Clock, text: '+35 anos no mercado segurador' },
  { icon: Users, text: '+850 profissionais' },
  { icon: Building2, text: '+130 clientes' },
  { icon: Award, text: '+23 prêmios e reconhecimentos' },
  { icon: ShieldCheck, text: '+25 implantações de sinistro' },
];

function Copy() {
  return (
    <>
      {ITEMS.map((it) => {
        const Icon = it.icon;
        return (
          <span
            key={it.text}
            className="inline-flex items-center gap-2 whitespace-nowrap text-xs font-medium text-ink-faint"
          >
            <Icon className="h-3.5 w-3.5 text-[#0ed8f6]" strokeWidth={1.8} />
            {it.text}
            <span className="ml-6 h-1 w-1 rounded-full bg-white/20" />
          </span>
        );
      })}
    </>
  );
}

export default function TrustTicker() {
  /* Duas cópias idênticas: o translate de -50% equivale exatamente à largura de
     uma cópia (o espaçamento final vai no `pr-10` de cada uma), então o loop
     fecha sem salto. Segue rodando com movimento reduzido — parado, os
     indicadores fora da tela ficariam inalcançáveis. */
  return (
    <div className="ticker-viewport" aria-label="Indicadores institucionais">
      <motion.div
        className="flex w-max items-center"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
      >
        <div className="ticker-copy flex items-center gap-10 pr-10">
          <Copy />
        </div>
        <div className="ticker-copy flex items-center gap-10 pr-10" aria-hidden="true">
          <Copy />
        </div>
      </motion.div>
    </div>
  );
}
