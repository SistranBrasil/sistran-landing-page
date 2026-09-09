import { notFound } from 'next/navigation';
import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import ContactCTA from '@/components/ContactCTA';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import {
  ACCELERATOR_PAGES,
  chaveDoBloco,
  getAcceleratorPage,
  idDoBloco,
  type AccelBlock,
} from '@/data/acceleratorPages';

/* Uma pagina por acelerador com conteudo real no site. No site essas paginas
   vivem em /service/<slug>/ (e duas delas na raiz); aqui ficam sob /solucoes,
   que é de onde os cards saem. O bloco "Fale com a Gente!" — que no site so
   existe na pagina do QA Integrado — fecha todas, via ContactCTA.
   Fonte: .claude/conteudo-site/servicos/*.md */

export function generateStaticParams() {
  return ACCELERATOR_PAGES.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getAcceleratorPage(slug);
  if (!page) return {};
  return {
    title: `${page.name} · Sistran`,
    description: page.lead,
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getAcceleratorPage(slug);
  if (!page) notFound();

  /* SIS-120 — `ACCELERATORS` deixou de ser lido aqui junto com o parágrafo solto
     que ele alimentava (o motivo está no comentário mais abaixo). Ficava assim:

     const accel = ACCELERATORS.find((a) => a.id === page.id);
  */

  return (
    <PageShell>
      {/* SIS-120 · item 3 — ESTAS SETE PÁGINAS SÃO TEXTUAIS, por decisão, e não
          por esquecimento. Não existe em `public/images` um único arquivo que
          corresponda a qualquer um dos sete slugs (conferido); pôr imagem aqui
          exigiria arte que só quem responde pelo conteúdo pode fornecer, e a
          própria issue avisa que 7 páginas × N assets sem peso e formato
          definidos vira a próxima issue de performance. O que a issue pedia era
          "definir imagem por produto OU decidir explicitamente que estas
          páginas são textuais" — é esta segunda, registrada aqui.

          SIS-120 · item 7 — a `eyebrow` FICA igual nas sete. Ela não descreve o
          produto: nomeia a família a que os sete pertencem, e é exatamente o
          título da seção de `/solucoes` (`#tecnologia-disruptiva`) de onde todos
          os cards saem. Diferenciá-la por produto inventaria sete rótulos de
          categoria que o site não tem. */}
      <PageHero
        eyebrow="Tecnologia Disruptiva"
        title={page.name}
        description={<p className="text-white/85">{page.lead}</p>}
      />

      {/* SIS-120 · itens 1 e 2 — O PARÁGRAFO SOLTO SAIU, e os dois defeitos caem
          juntos: era ele que repetia a ideia da abertura e era ele que morava
          fora de qualquer `<section>`.
          Das duas frases, a que fica é a `page.lead`, porque é a abertura do
          SITE para esta página; `accel.description` é a escrita do CARTÃO da
          vitrine — existe para ser lida em três linhas dentro de um cartão de
          `/solucoes`, ao lado de outros seis, e continua publicada lá, intacta.
          Trazê-la para dentro de um bloco seria publicar duas aberturas da mesma
          página, uma embaixo da outra, que é o que a issue mede.
          O código continua comentado no lugar, e não apagado:

          <div className="container-lp pb-4">
            {accel && (
              <p className="max-w-3xl text-lg leading-relaxed text-white/85">{accel.description}</p>
            )}
          </div>
      */}

      {page.blocks.map((block) => (
        <Block key={chaveDoBloco(block)} block={block} />
      ))}

      {/* SIS-120 · item 4 — a volta para a vitrine e o caminho para os outros
          seis. Vem ANTES do `ContactCTA` de propósito: quem chegou até aqui e
          não é o produto certo precisa do desvio antes do rodapé de conversão. */}
      <nav aria-labelledby="outras-solucoes" className="section-py">
        <div className="container-lp">
          <h2 id="outras-solucoes" className="font-display text-xl text-white">
            Outras soluções
          </h2>
          {/* Fichas com o NOME, não a vitrine repetida: o ponto de atenção da
              issue é justamente não recolar os sete cartões no pé de cada uma das
              sete páginas — seriam 49 cartões de conteúdo duplicado no site. */}
          <ul className="mt-5 flex flex-wrap gap-2.5">
            {ACCELERATOR_PAGES.map((p) => {
              const atual = p.id === page.id;
              return (
                <li key={p.id}>
                  {/* O atual NÃO é link: `aria-current` diz onde se está, e um
                      link para a página que já está aberta é um clique que não
                      leva a nada. Como `<span>`, ele também sai da ordem de
                      tabulação — sete fichas, seis paradas de teclado. */}
                  {atual ? (
                    <span
                      aria-current="page"
                      className="inline-block rounded-full border border-[#2AC4FF]/70 bg-[#2AC4FF]/14 px-4 py-2 text-sm font-semibold text-white"
                    >
                      {p.name}
                    </span>
                  ) : (
                    <Link
                      href={`/solucoes/${p.id}`}
                      className="inline-block rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white/85 transition-colors hover:border-[#2AC4FF]/50 hover:bg-white/10"
                    >
                      {p.name}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
          <Link
            href="/solucoes"
            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#A5F0FF] underline underline-offset-4"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2.4} aria-hidden />
            Ver todas as soluções e serviços
          </Link>
        </div>
      </nav>

      <ContactCTA />
    </PageShell>
  );
}

function Block({ block }: { block: AccelBlock }) {
  const heading = block.heading;
  /* SIS-120 · item 5 — o id vem de `idDoBloco`, a MESMA função que
     `pageSections.ts` usa para montar a lista do navegador lateral. Bloco sem
     título fica sem `id` e sem nome acessível, e é o comportamento certo: uma
     `<section>` sem nome não é anunciada como região, e o ponto de atenção da
     issue era exatamente não pendurar `aria-labelledby` apontando para nada.
     O id vai no `<h2>`, e não na `<section>`: é o padrão que este projeto já
     usa nas outras rotas e que o ScrollSpy resolve subindo para a `<section>`
     mais próxima (está escrito no cabeçalho de `pageSections.ts`). */
  const id = heading ? idDoBloco(heading) : undefined;

  return (
    <section className="section-py" aria-labelledby={id}>
      <div className="container-lp">
        {heading && (
          <h2 id={id} className="font-display text-section text-white">
            {heading}
          </h2>
        )}

        {block.kind === 'paragraphs' ? (
          <div className={heading ? 'mt-6 space-y-4' : 'space-y-4'}>
            {block.paragraphs.map((p) => (
              <p key={p.slice(0, 32)} className="max-w-3xl text-lg leading-relaxed text-white/85">
                {p}
              </p>
            ))}
          </div>
        ) : (
          <>
            {block.intro && (
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/85">{block.intro}</p>
            )}
            <ItemList block={block} />
          </>
        )}
      </div>
    </section>
  );
}

/* SIS-120 — `startIndex` saiu junto com o `index` do `Block`. Ele só servia para
   montar `key={`o-${startIndex}`}` no `<ol>`/`<ul>` logo abaixo, e `key` em
   elemento único (que não está dentro de um `map`) não é lido pelo React — era
   índice carregado por três assinaturas para nada. A `key` de cada bloco agora
   vem de `chaveDoBloco`, no lugar onde o `map` de verdade acontece. */
function ItemList({ block }: { block: Extract<AccelBlock, { kind: 'list' }> }) {
  const items = block.items.map((item, i) => (
    <li key={item.text} className="glass-card-hover relative overflow-hidden p-6">
      <span aria-hidden className="corner-accent" />
      {block.ordered && (
        <span
          aria-hidden
          /* SIS-155 — ordinal de lista é METADADO: `font-display` → `font-mono`.
             `text-sm` = 14px, acima do piso de 11px da issue. */
          /* SIS-155 — `font-semibold` NÃO é ênfase: a utilitária `font-mono` só troca a
             família, e sem peso declarado este nó pedia 400 — peso que o único corte
             carregado da Geist Mono (600) não tem. O navegador servia o 600 e o código
             dizia 400: se um dia entrar um corte 400 na Mono, oito pontos como este
             mudariam de aparência calados. Medido em 600 computado pela sonda. */
          className="font-mono font-semibold text-sm tabular-nums text-[#A5F0FF]"
          style={{ fontFeatureSettings: '"tnum" 1' }}
        >
          {String(i + 1).padStart(2, '0')}
        </span>
      )}
      {item.term ? (
        <>
          <h3 className="mt-2 font-display text-base leading-snug text-white">
            {item.term}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-white/85">{item.text}</p>
        </>
      ) : (
        <p className="mt-2 text-sm leading-relaxed text-white/90">{item.text}</p>
      )}
    </li>
  ));

  /* ol quando o site numera a lista, ul quando nao — a ordem tem significado
     apenas nas listas que o site apresenta numeradas. */
  const className = 'mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3';
  return block.ordered ? (
    <ol className={className}>{items}</ol>
  ) : (
    <ul className={className}>{items}</ul>
  );
}
