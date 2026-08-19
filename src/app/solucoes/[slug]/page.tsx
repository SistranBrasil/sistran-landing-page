import { notFound } from 'next/navigation';
import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import ContactCTA from '@/components/ContactCTA';
import { ACCELERATOR_PAGES, getAcceleratorPage, type AccelBlock } from '@/data/acceleratorPages';
import { ACCELERATORS } from '@/data/accelerators';

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

  const accel = ACCELERATORS.find((a) => a.id === page.id);

  return (
    <PageShell>
      <PageHero
        eyebrow="Tecnologia Disruptiva"
        title={page.name}
        description={<p className="text-white/85">{page.lead}</p>}
      />

      <div className="container-lp pb-4">
        {accel && (
          <p className="max-w-3xl text-lg leading-relaxed text-white/85">{accel.description}</p>
        )}
      </div>

      {page.blocks.map((block, i) => (
        <Block key={i} block={block} index={i} />
      ))}

      <ContactCTA />
    </PageShell>
  );
}

function Block({ block, index }: { block: AccelBlock; index: number }) {
  const heading = block.heading;

  return (
    <section className="section-py">
      <div className="container-lp">
        {heading && (
          <h2 className="font-display text-section font-bold text-white">{heading}</h2>
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
            <ItemList block={block} startIndex={index} />
          </>
        )}
      </div>
    </section>
  );
}

function ItemList({
  block,
  startIndex,
}: {
  block: Extract<AccelBlock, { kind: 'list' }>;
  startIndex: number;
}) {
  const items = block.items.map((item, i) => (
    <li key={item.text} className="glass-card-hover relative overflow-hidden p-6">
      <span aria-hidden className="corner-accent" />
      {block.ordered && (
        <span
          aria-hidden
          className="font-display text-sm font-bold tabular-nums text-[#A5F0FF]"
        >
          {String(i + 1).padStart(2, '0')}
        </span>
      )}
      {item.term ? (
        <>
          <h3 className="mt-2 font-display text-base font-bold leading-snug text-white">
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
    <ol className={className} key={`o-${startIndex}`}>
      {items}
    </ol>
  ) : (
    <ul className={className} key={`u-${startIndex}`}>
      {items}
    </ul>
  );
}
