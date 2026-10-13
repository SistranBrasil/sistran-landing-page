'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { aplicarCarimboDeKind, type EstadoCarimbo } from './acoes';
import { fundoDaPrevia } from './fundoDaPrevia';
import type { CarimboBruto } from '@/lib/carimbosTipos';

/**
 * A ABA «CARIMBOS DE EVENTO» — as quatro categorias, cada uma com o seu carimbo.
 *
 * ⚠️ POR QUE UMA ABA SEPARADA, e não uma linha na lista de lugares: porque o
 * carimbo de evento não é um ponto do layout. Ele aparece uma vez por EVENTO, em
 * dois componentes (o palco e a lista estreita), e quem decide a arte é a
 * CATEGORIA do evento — ou seja, trocar aqui mexe em vários cartões de uma vez.
 * Misturado entre os dezoito lugares, esse alcance ficaria invisível.
 *
 * O que a tela NÃO faz, de propósito: escolher carimbo para um evento
 * específico. Isso é campo do registro e vive em `/admin/eventos`, dentro do
 * evento — é lá que ele é uma exceção, não uma regra.
 */
export function CarimbosDeEvento({
  categorias,
  carimbos,
  kinds,
}: {
  /** As quatro categorias, com rótulo, tom e a arte original de cada uma. */
  categorias: {
    kind: string;
    rotulo: string;
    tom: string;
    arte: { src: string; largura: number; altura: number; cor: string };
  }[];
  carimbos: CarimboBruto[];
  kinds: Record<string, string>;
}) {
  const [pendente, comTransicao] = useTransition();
  const [estado, setEstado] = useState<EstadoCarimbo>({ estado: 'inicial' });
  /* Controlado por este mapa, e não pela prop: entre o `onChange` e o fim da
     revalidação a prop ainda traz o valor antigo, e um campo não-controlado
     «pularia de volta» na frente do operador. Mesma razão da lista de lugares. */
  const [escolhas, setEscolhas] = useState<Record<string, string>>(kinds);

  const porId = new Map(carimbos.map((c) => [c.id, c]));

  const rotulo = 'font-mono text-[11px] uppercase tracking-[0.16em] text-[#667085]';
  const campo =
    'w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-[#0f172a] outline-none transition-colors focus:border-[#0079cb] focus:ring-4 focus:ring-[#0079cb]/10 disabled:cursor-not-allowed disabled:border-black/[0.06] disabled:bg-[#f2f4f7] disabled:text-[#98a2b3]';

  return (
    <div className="mt-8">
      <div aria-live="polite" className="min-h-[2.75rem]">
        {estado.estado === 'ok' && (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            {estado.recado}{' '}
            <span className="text-emerald-700/80">
              No site, a troca aparece em até cerca de um minuto.
            </span>
          </p>
        )}
        {estado.estado === 'erro' && (
          <ul role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {estado.problemas.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        )}
      </div>

      {carimbos.length === 0 && (
        <div className="mt-3 max-w-2xl rounded-xl border border-amber-300/70 bg-amber-50 px-4 py-4">
          <p className="text-sm leading-relaxed text-amber-900">
            <strong>Comece criando um carimbo.</strong> As quatro categorias abaixo estão na arte
            original. Enquanto não houver nenhum carimbo criado, não há o que escolher, e por isso
            os campos estão desligados.
          </p>
          <Link
            href="/admin/carimbo?aba=criar"
            className="mt-3 inline-block rounded-full bg-[#0f172a] px-5 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white no-underline transition-colors hover:bg-[#1d2939]"
          >
            Criar o primeiro carimbo
          </Link>
        </div>
      )}

      <ul className="mt-3 grid gap-3">
        {categorias.map((cat) => {
          const escolhido = escolhas[cat.kind] ?? '';
          const carimbo = porId.get(escolhido);
          const arte = carimbo
            ? {
                src: carimbo.arquivo,
                largura: carimbo.largura,
                altura: carimbo.altura,
                cor: carimbo.receita.cor,
              }
            : cat.arte;

          return (
            <li
              key={cat.kind}
              className="grid gap-4 rounded-2xl border border-black/[0.07] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:grid-cols-[180px_minmax(0,1fr)_260px] sm:items-center"
            >
              {/* O cartão de evento no site é BRANCO (medido: rgba(255,255,255,.96)),
                  e é por isso que a prévia aqui não usa o navy por padrão: o que
                  importa nesta aba é ver a arte como ela vai aparecer no cartão.
                  `fundoDaPrevia` ainda protege o caso de tinta clara. */}
              <div
                className="grid min-h-[86px] place-items-center rounded-xl p-2"
                style={{ background: fundoDaPrevia(arte.cor) }}
              >
                <Image
                  src={arte.src}
                  alt=""
                  width={arte.largura}
                  height={arte.altura}
                  className="h-auto w-full max-w-[140px]"
                  unoptimized
                />
              </div>

              <div>
                <p className="flex items-center gap-2 text-sm font-medium text-[#0f172a]">
                  {/* O tom da categoria como ponto de cor: é ele que distingue os
                      quatro no site, e ter o mesmo sinal aqui evita a confusão de
                      ler quatro linhas quase idênticas. */}
                  <span
                    aria-hidden
                    className="inline-block h-3 w-3 shrink-0 rounded-full"
                    style={{ background: cat.tom }}
                  />
                  {cat.rotulo}
                </p>
                <p className="mt-1 text-sm text-[#667085]">
                  Vale para todos os eventos desta categoria, no palco e na lista.
                </p>
                <p className={`mt-2 ${rotulo}`}>
                  /EVENTOS-INOVACAO{!carimbo && ' · ARTE ORIGINAL'}
                </p>
              </div>

              <div>
                <label className={`block ${rotulo}`} htmlFor={`kind-${cat.kind}`}>
                  Carimbo
                </label>
                <select
                  id={`kind-${cat.kind}`}
                  className={`mt-2 ${campo}`}
                  value={escolhido}
                  disabled={pendente || carimbos.length === 0}
                  title={
                    carimbos.length === 0
                      ? 'Crie um carimbo primeiro — não há nenhum para escolher.'
                      : undefined
                  }
                  onChange={(e) => {
                    const valor = e.target.value;
                    setEscolhas((antes) => ({ ...antes, [cat.kind]: valor }));
                    comTransicao(async () =>
                      setEstado(await aplicarCarimboDeKind(cat.kind, valor)),
                    );
                  }}
                >
                  <option value="">Arte original da categoria</option>
                  {carimbos.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  ))}
                </select>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-8 max-w-2xl rounded-xl border border-black/[0.07] bg-white px-4 py-3 text-sm leading-relaxed text-[#475467]">
        Um evento específico pode fugir da categoria: dentro dele, em{' '}
        <Link href="/admin/eventos" className="text-[#0079cb]">
          Eventos
        </Link>
        , o campo <strong>Carimbo</strong> vence o que está escolhido aqui. Vazio lá significa
        «seguir a categoria», que é esta tela.
      </p>
    </div>
  );
}
