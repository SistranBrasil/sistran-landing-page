import Image from 'next/image';
import Link from 'next/link';
import { EVENT_KIND_META, type EventKind } from '@/data/events';
import { lerCatalogoPublicado, naNuvem } from '@/lib/eventosLoja';
import { ARTE_ALTURA, ARTE_LARGURA, THUMB_ALTURA, THUMB_LARGURA } from './arte';
import AcoesDoEvento from './AcoesDoEvento';

/**
 * SIS-216 — a lista dos eventos do site, para edição.
 *
 * `force-dynamic` porque a página lê o catálogo PUBLICADO a cada requisição:
 * prerenderizada, ela mostraria o catálogo do build e faria quem editasse duas
 * vezes sobrescrever a própria primeira edição com um formulário preenchido com
 * texto velho.
 *
 * A lista mostra a MINIATURA de cada evento, e não só o título: o trabalho anual
 * é trocar fotos, e reconhecer a foto errada é instantâneo enquanto ler quinze
 * títulos parecidos não é.
 *
 * ⚠️ A FONTE MUDOU — 01/10: era `lerCatalogo()`, que lê `src/data/events.json` do disco, e
 * passou a ser `lerCatalogoPublicado()` de `eventosLoja.ts`. Com a leitura em disco esta
 * página mostraria, em produção, o catálogo congelado no build — ou seja, a lista do admin
 * contradiria o site depois da primeira edição, que é a pior forma possível de errar aqui.
 *
 * ⚠️ E ELA DEIXOU DE SER SÓ LEITURA: ganhou criar, excluir e reordenar. Os dois últimos
 * ficam em `AcoesDoEvento`, FORA do `<Link>` do cartão — ver a nota de lá.
 */
export const dynamic = 'force-dynamic';

export default async function AdminEventosPage() {
  const eventos = await lerCatalogoPublicado();
  const semArte = eventos.filter((e) => !e.image || !e.thumb).length;
  const naLoja = naNuvem();

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
        <div className="flex flex-wrap items-center gap-3">
          {semArte > 0 && (
            <p className="rounded-full border border-amber-300/70 bg-amber-50 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-amber-700">
              {semArte} sem arte completa
            </p>
          )}
          <Link
            href="/admin/eventos/novo"
            className="rounded-full bg-[#0f172a] px-5 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white no-underline transition-opacity hover:opacity-85"
          >
            + novo evento
          </Link>
        </div>
      </div>

      {/* ⚠️ A FRASE ANTIGA ERA «Editar aqui grava src/data/events.json e as imagens em
          public/images/EVENTOS/. O visitante vê a mudança no próximo deploy.» Ela descrevia
          o destino certo até 01/10 e virou mentira com a loja no Blob: não há arquivo para
          commitar e o visitante já está vendo. Sem token o texto antigo continua verdadeiro
          — daí os dois, e não um só «já publicado» que mentiria na máquina de quem
          desenvolve. */}
      <p className="mt-6 max-w-2xl rounded-xl border border-black/[0.07] bg-white px-4 py-3 text-sm leading-relaxed text-[#475467]">
        {naLoja ? (
          <>
            Criar, editar, excluir e reordenar aqui já muda{' '}
            <span className="font-mono text-[#0079cb]">/eventos-inovacao</span> na hora — não
            depende de deploy. A ordem dos cartões abaixo é a ordem da cena no site.
          </>
        ) : (
          <>
            Sem <code className="font-mono text-[#0f172a]">BLOB_READ_WRITE_TOKEN</code>, editar
            aqui grava <code className="font-mono text-[#0f172a]">src/data/events.json</code> e as
            imagens em <code className="font-mono text-[#0f172a]">public/images/EVENTOS/</code>.
            Faça commit dos arquivos para publicar.
          </>
        )}
      </p>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {eventos.map((evento, indice) => {
          const meta = EVENT_KIND_META[evento.kind as EventKind];
          return (
            <li key={evento.id} className="flex flex-col">
              <Link
                href={`/admin/eventos/${evento.id}`}
                className="group flex flex-1 flex-col gap-3 rounded-2xl border border-black/[0.07] bg-white p-3 no-underline shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-all hover:-translate-y-0.5 hover:border-[#0079cb]/40 hover:shadow-[0_8px_24px_rgba(16,24,40,0.08)]"
              >
                {/* ⚠️ A ARTE GRANDE, e não a miniatura — corrigido em 01/10 depois de a
                    imagem ser descrita como «muito ruim» aqui. Era `thumb ?? image` com
                    `width={240}` e `w-full`, e o defeito é de ARITMÉTICA, não de gosto: o
                    `main` do admin é `max-w-6xl` (1152 px) menos `px-8` (64), ou 1088 px de
                    conteúdo; em `xl:grid-cols-3` com `gap-3` cada cartão fica em ~355 px e,
                    menos o `p-3`, a caixa da imagem em ~331 px. Servir ali um arquivo de
                    240 px é AMPLIAR 1,38× em CSS — 2,76× nos pixels de uma tela retina — e
                    ampliação é exatamente o que não tem conserto depois.

                    `image` tem 1672 px, então no mesmo lugar ele é REDUZIDO, que é o caso
                    em que o navegador acerta. O preço são ~15 × 180 kB = ~2,7 MB nesta
                    página, e é o preço certo a pagar AQUI e não no site: a nota da SIS-106
                    em `src/data/events.ts` recusa essa troca para o visitante, que não
                    precisa julgar arte nenhuma. Nesta página, julgar a arte é o trabalho.
                    `loading="lazy"` continua: só o que entra na tela baixa. */}
                <div className="relative overflow-hidden rounded-xl bg-[#eceef1]">
                  {evento.image || evento.thumb ? (
                    <Image
                      src={(evento.image ?? evento.thumb) as string}
                      alt=""
                      /* As medidas acompanham o arquivo que está sendo servido: com
                         `unoptimized: true` elas não escolhem nada, mas são a proporção que
                         reserva o espaço antes de baixar — declarar 240×135 para um arquivo
                         de 1672 px seria uma afirmação falsa que por acaso dá no mesmo 16:9. */
                      width={evento.image ? ARTE_LARGURA : THUMB_LARGURA}
                      height={evento.image ? ARTE_ALTURA : THUMB_ALTURA}
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

              <AcoesDoEvento
                id={evento.id}
                titulo={evento.title}
                primeiro={indice === 0}
                ultimo={indice === eventos.length - 1}
              />
            </li>
          );
        })}
      </ul>

      {/* Catálogo vazio não é estado esperado — o site tem quinze eventos e a loja cai no
          JSON do pacote quando está vazia (ver `eventosLoja.ts`). Mas se chegar aqui, uma
          grade em branco não diz nada e o botão de criar está lá no topo, fora do campo de
          visão de quem está olhando o meio da página. */}
      {eventos.length === 0 && (
        <p className="mt-8 rounded-xl border border-dashed border-black/15 px-4 py-8 text-center text-sm text-[#667085]">
          Nenhum evento no catálogo.{' '}
          <Link href="/admin/eventos/novo" className="text-[#0079cb]">
            Criar o primeiro
          </Link>
          .
        </p>
      )}
    </>
  );
}
