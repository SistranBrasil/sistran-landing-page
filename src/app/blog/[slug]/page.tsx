import { notFound } from 'next/navigation';
import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import ContactCTA from '@/components/ContactCTA';
import { POSTS } from '@/data/blog';

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  return { title: post ? `${post.title} · Sistran` : 'Blog · Sistran' };
}

/* Corpo do post na integra, como publicado. Os tres rotulos "ASSISTA A …
   SESSÃO:" no site sao seguidos de embed de video e nao tem texto de link nem
   URL: ficam aqui como estao escritos, sem inventar destino.
   Fonte: .claude/conteudo-site/10-blog-e-post.md (B) */
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <PageShell>
      <PageHero eyebrow={`${post.category} · ${post.dateLabel}`} title={post.title} />

      <section className="section-py">
        <div className="container-lp">
          <article className="glass-card max-w-3xl space-y-6 p-8 md:p-12">
            <p className="text-base leading-relaxed text-white/85">
              O mercado de seguros vive um cenário de transformações e de readequação das ofertas de
              produtos e serviços, com vistas a uma relação acurada e perene com seus clientes. O
              desafio é como atender demandas de consumidores cada vez mais exigentes: atualizados,
              acostumados com autosserviços e informações instantâneas, eles esperam um nível mais
              sofisticado de serviços digitais, que já experimentam em outros setores. Essa
              &ldquo;facilidade&rdquo; traz para o segurado uma expectativa de maior aderência das
              ofertas às suas necessidades. Esse e outros temas foram discutidos em um{' '}
              <strong className="font-bold text-white">
                ciclo de webinars nos dias 25 de novembro, 2 e 9 de dezembro
              </strong>
              , por iniciativa da <strong className="font-bold text-white">Sistran Informática</strong>{' '}
              – referência em TI do mercado segurador.
            </p>

            {/* TODO: os embeds das tres sessoes nao existem neste projeto; quando
                as URLs dos videos forem fornecidas, cada rotulo abaixo deve virar
                link/player. Ordinais formatados (1ª, 2ª, 3ª). */}
            <ul className="space-y-2">
              {['ASSISTA A 1ª SESSÃO:', 'ASSISTA A 2ª SESSÃO:', 'ASSISTA A 3ª SESSÃO:'].map((s) => (
                <li key={s} className="font-display text-base font-bold text-white">
                  {s}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <ContactCTA />
    </PageShell>
  );
}
