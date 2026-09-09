import { notFound } from 'next/navigation';
import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import ContactCTA from '@/components/ContactCTA';
import { POSTS, type PostBlock } from '@/data/blog';

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  return { title: post ? `${post.title} · Sistran` : 'Blog · Sistran' };
}

/* SIS-118 — o corpo do post SAIU DAQUI e virou dado (`Post.body`, em
   `src/data/blog.ts`, com o formato e o porquê registrados lá). Antes este
   arquivo trazia o artigo do webinar de 5 de março de 2024 escrito à mão no JSX,
   e `generateStaticParams` gerava uma rota por slug — quer dizer que o segundo
   post a existir seria publicado com o texto do primeiro. Hoje esta página não
   contém texto de artigo nenhum: ela só sabe desenhar blocos.
   Fonte do conteúdo: .claude/conteudo-site/10-blog-e-post.md (B) */
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
            {post.body.map((bloco) => (
              <Bloco key={chaveDoBloco(bloco)} bloco={bloco} />
            ))}

            {/* SIS-118 — OS TRÊS RÓTULOS DE SESSÃO SAÍRAM DA TELA. "ASSISTA A 1ª
                SESSÃO:", "2ª" e "3ª" eram texto puro: no site cada um vem seguido
                do embed do vídeo, e aqui os embeds não existem — o `TODO` que
                estava neste lugar registrava isso desde o início. Um rótulo
                imperativo com dois-pontos e nada depois é pior que a ausência:
                promete vídeo, não é clicável, e em leitor de tela é lido como item
                de lista sem destino.
                A issue dá as duas saídas — "com as URLs, viram link/player; sem
                elas, saem" — e as URLs são informação que só quem responde pelo
                conteúdo tem. Então saem, e o código fica aqui para o dia em que as
                três URLs chegarem: basta trocar o `<li>` por um link com `href` e
                o texto acessível do destino.

                <ul className="space-y-2">
                  {['ASSISTA A 1ª SESSÃO:', 'ASSISTA A 2ª SESSÃO:', 'ASSISTA A 3ª SESSÃO:'].map((s) => (
                    <li key={s} className="font-display text-base text-white">
                      {s}
                    </li>
                  ))}
                </ul>
            */}
          </article>
        </div>
      </section>

      <ContactCTA />
    </PageShell>
  );
}

/* `key` vinda do CONTEÚDO, e não do índice do `map`: índice como chave reordena
   errado no dia em que um bloco for inserido no meio, e o texto do bloco é
   estável e único dentro de um post. Mesmo critério do `chaveDoBloco` de
   `acceleratorPages.ts`. */
function chaveDoBloco(bloco: PostBlock): string {
  return bloco.runs
    .map((r) => (typeof r === 'string' ? r : r.strong))
    .join('')
    .slice(0, 48);
}

/* Um `switch` no `kind`, e não um `if`: quando `PostBlock` ganhar variante
   (subtítulo, lista), o `never` do `default` deixa de compilar e obriga a tratá-la
   aqui — em vez de o bloco novo simplesmente não aparecer na tela. */
function Bloco({ bloco }: { bloco: PostBlock }) {
  switch (bloco.kind) {
    case 'paragraph':
      return (
        <p className="text-base leading-relaxed text-white/85">
          {bloco.runs.map((run) =>
            typeof run === 'string' ? (
              run
            ) : (
              <strong key={run.strong} className="font-bold text-white">
                {run.strong}
              </strong>
            ),
          )}
        </p>
      );
    default: {
      const naoTratado: never = bloco.kind;
      throw new Error(`Bloco de post não tratado: ${String(naoTratado)}`);
    }
  }
}
