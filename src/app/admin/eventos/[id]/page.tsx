import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ICONS } from '@/lib/icons';
import { EVENT_KINDS, EVENT_KIND_META, type EventKind } from '@/data/events';
import { artesDisponiveis, buscarEvento } from '@/lib/eventosArquivo';
import FormularioEvento from './FormularioEvento';

/** Lê do disco a cada requisição — mesma razão da lista. */
export const dynamic = 'force-dynamic';

export default async function AdminEventoPage({ params }: { params: Promise<{ id: string }> }) {
  /* `params` é Promise no App Router deste projeto (mesmo padrão de
     `src/app/blog/[slug]/page.tsx`). */
  const { id } = await params;
  const evento = buscarEvento(id);
  if (!evento) notFound();

  const { imagens, miniaturas } = artesDisponiveis();

  return (
    <>
      <Link
        href="/admin/eventos"
        className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#667085] no-underline hover:text-[#0079cb]"
      >
        ← todos os eventos
      </Link>
      <h1 className="mt-5 text-3xl font-medium tracking-tight text-[#0f172a]">{evento.title}</h1>
      <p className="mt-2 font-mono text-xs text-[#98a2b3]">id: {evento.id}</p>

      <FormularioEvento
        evento={evento}
        categorias={EVENT_KINDS.map((valor) => ({
          valor,
          rotulo: EVENT_KIND_META[valor as EventKind].label,
        }))}
        icones={Object.keys(ICONS).sort()}
        imagens={imagens}
        miniaturas={miniaturas}
      />
    </>
  );
}
