'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { CLIENTS, type Client } from '@/data/clients';
import { vGrid, vCard, VP, useReducedMotion } from '@/lib/motion';

/**
 * Mosaico das implementações.
 *
 * Grid denso de placas em tamanhos alternados que se monta conforme a seção
 * entra na tela (stagger de `vGrid` → `vCard`). Não é marquee: aqui todas as
 * marcas ficam visíveis ao mesmo tempo, sem nada rolando.
 *
 * Só o layout é nosso — os nomes vêm de `@/data/clients`, nenhum texto novo.
 *
 * Movimento reduzido: `initial={false}` desliga a entrada e as placas nascem
 * no estado final. Nada fica inalcançável, porque o mosaico é estático.
 */
export default function ImplementationsMosaic() {
  const rm = useReducedMotion();

  return (
    <motion.ul
      variants={vGrid}
      initial={rm ? false : 'hidden'}
      whileInView="visible"
      viewport={VP}
      /* auto-rows fixo + span de 2 em alguns itens é o que dá o desencontro do
         mosaico; `grid-flow-dense` reaproveita os buracos que o span abre. */
      className="grid auto-rows-[92px] grid-flow-row-dense grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
    >
      {CLIENTS.map((c, i) => (
        <Tile key={c.name} c={c} wide={i % 7 === 0} />
      ))}
    </motion.ul>
  );
}

function Tile({ c, wide }: { c: Client; wide: boolean }) {
  return (
    <motion.li
      variants={vCard}
      className={wide ? 'sm:col-span-2' : undefined}
    >
      {c.logo ? (
        /* Placa branca: mesma receita do PartnersGrid/ClientWall — logos
           coloridas somem no fundo azul sem ela. */
        <span className="flex h-full w-full items-center justify-center rounded-2xl border border-white/40 bg-white p-4 shadow-[0_10px_30px_-14px_rgba(4,32,64,0.45)] transition-all duration-300 hover:-translate-y-1 hover:border-[#0ed8f6]/60 hover:shadow-[0_16px_36px_-12px_rgba(14,216,246,0.55)]">
          <Image
            src={c.logo}
            alt={c.name}
            width={280}
            height={96}
            className="max-h-11 w-auto object-contain"
          />
        </span>
      ) : (
        <span className="flex h-full w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center text-sm font-semibold leading-snug text-white/80 backdrop-blur transition-all duration-300 hover:border-[#0ed8f6]/50 hover:bg-white/[0.08] hover:text-white">
          <span aria-hidden className="h-1.5 w-1.5 flex-none rounded-full bg-[#0ed8f6]/70" />
          {c.name}
        </span>
      )}
    </motion.li>
  );
}
