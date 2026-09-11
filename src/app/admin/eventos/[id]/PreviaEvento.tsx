'use client';

import Image from 'next/image';
import { EVENT_KIND_META, type EventKind } from '@/data/events';
import type { EventoBruto } from '@/lib/eventosArquivo';
import { ARTE_ALTURA, ARTE_LARGURA, ONDE_APARECE, PROPORCAO, THUMB_ALTURA, THUMB_LARGURA } from '../arte';

/**
 * SIS-216 — como o evento vai ficar em `/eventos-inovacao`.
 *
 * É APROXIMAÇÃO, e o rótulo na tela diz isso. A cena real é `EventsSpotlight`, um
 * componente de cliente com rolagem, colunas animadas e um palco que muda de
 * tamanho; embutir a cena de verdade aqui exigiria montar todo o catálogo e a
 * rolagem dentro do admin, e uma cópia parada dela seria mais mentirosa do que
 * uma maquete declarada.
 *
 * O que a maquete precisa acertar, e acerta: o RECORTE (16:9, as mesmas medidas de
 * `arte.ts`), o fundo escuro sobre o qual a arte aparece no site — a mesma foto
 * muda de leitura sobre branco — e quanto TEXTO cabe antes de a descrição virar um
 * bloco que ninguém lê.
 */
export default function PreviaEvento({ valores }: { valores: EventoBruto }) {
  const meta = EVENT_KIND_META[valores.kind as EventKind];
  const arte = valores.image ?? valores.thumb;
  const mini = valores.thumb ?? valores.image;

  return (
    <div className="rounded-2xl border border-black/[0.07] bg-white p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-lg font-medium text-[#0f172a]">Prévia</h2>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#98a2b3]">
          aproximação
        </span>
      </div>

      {/* O palco: fundo escuro porque é o da cena real. */}
      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[#667085]">
        Palco · desktop
      </p>
      <div className="mt-2 overflow-hidden rounded-xl bg-[#07243a] p-3">
        <div className="overflow-hidden rounded-lg bg-black/40" style={{ aspectRatio: PROPORCAO }}>
          {arte ? (
            <Image
              src={arte}
              alt=""
              width={ARTE_LARGURA}
              height={ARTE_ALTURA}
              className="h-full w-full object-cover"
            />
          ) : (
            <p className="grid h-full place-items-center font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">
              sem arte
            </p>
          )}
        </div>
        <div className="mt-3">
          {meta && (
            <span className="inline-block rounded-full bg-white/90 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#0b3a5c]">
              {meta.label}
            </span>
          )}
          <p className="mt-2 text-[15px] font-medium leading-snug text-white">
            {valores.title || '(sem título)'}
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-white/70">
            {valores.description || '(sem descrição)'}
          </p>
        </div>
      </div>

      {/* A miniatura, no tamanho em que ela é servida de verdade. */}
      <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-[#667085]">
        Coluna lateral · miniatura
      </p>
      <div className="mt-2 w-[240px] max-w-full overflow-hidden rounded-lg bg-[#07243a]">
        {mini ? (
          <Image
            src={mini}
            alt=""
            width={THUMB_LARGURA}
            height={THUMB_ALTURA}
            className="h-auto w-full"
          />
        ) : (
          <p className="grid aspect-video place-items-center font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">
            sem miniatura
          </p>
        )}
      </div>

      <dl className="mt-6 space-y-3 border-t border-black/[0.07] pt-4 text-[13px] leading-relaxed">
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#98a2b3]">
            Onde a arte aparece
          </dt>
          <dd className="text-[#475467]">{ONDE_APARECE.arte}</dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#98a2b3]">
            Onde a miniatura aparece
          </dt>
          <dd className="text-[#475467]">{ONDE_APARECE.thumb}</dd>
        </div>
      </dl>
    </div>
  );
}
