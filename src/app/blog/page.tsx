import Link from 'next/link';
import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import ContactCTA from '@/components/ContactCTA';
import { POSTS } from '@/data/blog';

/* No site o <title> é "Blog Grid – Sistran", titulo de demonstracao do tema que
   ficou indexavel. Aqui o titulo é o da propria pagina. */
export const metadata = {
  title: 'Blog · Sistran',
};

/* Cabecalho verbatim de /blog/, com a concordancia corrigida ("Feito" ->
   "Feitos"). A grade tem o unico post que o site publica; a sidebar de
   Categorias/Arquivos foi reduzida a categoria do post, sem campo de busca —
   nao ha o que pesquisar com um post.
   Fonte: .claude/conteudo-site/10-blog-e-post.md (A) */
export default function Page() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Conhecimento, inovação e sucesso para o seu negócio."
        title="Os melhores conteúdos."
        highlight="Feitos por especialistas de tecnologia."
      />

      <section aria-label="Publicações" className="section-py">
        <div className="container-lp">
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {POSTS.map((p) => (
              <li key={p.slug} className="glass-card-hover relative overflow-hidden p-7">
                <span aria-hidden className="corner-accent" />
                {/* O card do site mostra "05 mar", sem ano; aqui a data é completa. */}
                <time
                  dateTime={p.dateISO}
                  className="text-xs font-semibold uppercase tracking-[0.16em] text-[#A5F0FF]"
                >
                  {p.dateLabel}
                </time>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-ink-faint">
                  {p.category}
                </p>
                <h2 className="mt-3 font-display text-lg font-bold leading-snug text-white">
                  <Link href={`/blog/${p.slug}`} className="hover:underline underline-offset-4">
                    {p.title}
                  </Link>
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-white/85">{p.excerpt}</p>
                <Link
                  href={`/blog/${p.slug}`}
                  className="mt-5 inline-block text-sm font-semibold text-[#A5F0FF] underline underline-offset-4"
                >
                  leia mais
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ContactCTA />
    </PageShell>
  );
}
