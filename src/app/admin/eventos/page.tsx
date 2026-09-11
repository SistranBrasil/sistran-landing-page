import Image from 'next/image';
import Link from 'next/link';
import { EVENT_KIND_META, type EventKind } from '@/data/events';
import { lerCatalogo } from '@/lib/eventosArquivo';
import { THUMB_ALTURA, THUMB_LARGURA } from './arte';

/**
 * SIS-216 — a lista dos eventos do site, para edição.
 *
 * `force-dynamic` porque a página lê `src/data/events.json` do DISCO a cada
 * requisição: prerenderizada, ela mostraria o catálogo do build e faria quem
 * editasse duas vezes sobrescrever a própria primeira edição com um formulário
 * preenchido com texto velho.
 *
 * A lista mostra a MINIATURA de cada evento, e não só o título: o trabalho anual
 * é trocar fotos, e reconhecer a foto errada é instantâneo enquanto ler quinze
 * títulos parecidos não é.
 */
export const dynamic = 'force-dynamic';

export default function AdminEventosPage() {
  const eventos = lerCatalogo();
  const semArte = eventos.filter((e) => !e.image || !e.thumb).length;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium tracking-tight text-[#0f172a]">Eventos</h1>
          <p className="mt-2 text-sm text-[#667085]">
            {eventos.length} eventos publicados em{' '}
            <span className="font-mono text-[#0079cb]">/eventos-inovacao</span>
          </p>
        </div>

        {/* O aviso só existe quando há o que avisar: um contador fixo em zero
            ensina a ignorar o lugar onde o aviso vai aparecer. */}
        {semArte > 0 && (
          <p className="rounded-full border border-amber-300/70 bg-amber-50 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-amber-700">
            {semArte} sem arte completa
          </p>
        )}
      </div>

      <p className="mt-6 max-w-2xl rounded-xl border border-black/[0.07] bg-white px-4 py-3 text-sm leading-relaxed text-[#475467]">
        Editar aqui grava <code className="font-mono text-[#0f172a]">src/data/events.json</code> e as
        imagens em <code className="font-mono text-[#0f172a]">public/images/EVENTOS/</code>. O
        visitante vê a mudança no próximo deploy.
      </p>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {eventos.map((evento, indice) => {
          const meta = EVENT_KIND_META[evento.kind as EventKind];
          return (
            <li key={evento.id}>
              <Link
                href={`/admin/eventos/${evento.id}`}
                className="group flex h-full flex-col gap-3 rounded-2xl border border-black/[0.07] bg-white p-3 no-underline shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-all hover:-translate-y-0.5 hover:border-[#0079cb]/40 hover:shadow-[0_8px_24px_rgba(16,24,40,0.08)]"
              >
                <div className="relative overflow-hidden rounded-xl bg-[#eceef1]">
                  {evento.thumb || evento.image ? (
                    <Image
                      src={(evento.thumb ?? evento.image) as string}
                      alt=""
                      width={THUMB_LARGURA}
                      height={THUMB_ALTURA}
                      className="h-auto w-full"
                      loading="lazy"
                    />
                  ) : (
                    <div className="grid aspect-video place-items-center font-mono text-[11px] uppercase tracking-[0.14em] text-[#98a2b3]">
                      sem imagem
                    </div>
                  )}
                  <span className="absolute left-2 top-2 rounded-md bg-white/90 px-1.5 py-0.5 font-mono text-[10px] text-[#667085]">
                    {String(indice + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="flex flex-1 flex-col">
                  <span className="text-[15px] font-medium leading-snug text-[#0f172a] group-hover:text-[#0079cb]">
                    {evento.title}
                  </span>
                  <span className="mt-auto pt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#98a2b3]">
                    {meta?.label ?? evento.kind}
                    {!evento.thumb && ' · sem miniatura'}
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
