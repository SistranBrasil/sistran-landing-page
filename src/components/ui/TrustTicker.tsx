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
  // Com movimento reduzido nao duplicamos: sem animacao a 2a copia seria
  // conteudo repetido e inalcancavel.
  const loop = rm ? ITEMS : [...ITEMS, ...ITEMS];

  return (
    <div
      className="relative w-full"
      style={{
        // O mask degrade sugere "tem mais conteudo rolando". Parado, ele apenas
        // apaga as bordas do que o usuario precisa ler.
        maskImage: rm
          ? undefined
          : 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
        WebkitMaskImage: rm
          ? undefined
          : 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
        // Ticker e CONTEUDO: parar a animacao esconderia os itens fora da tela.
        // Sem movimento, viramos lista rolavel para tudo seguir alcancavel.
        overflowX: rm ? 'auto' : 'hidden',
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
