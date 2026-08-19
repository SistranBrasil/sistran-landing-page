import Link from 'next/link';
import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import About from '@/components/About';
import Differentials from '@/components/Differentials';
import Metrics from '@/components/Metrics';
import ContactCTA from '@/components/ContactCTA';
import {
  ABORDAGEM,
  COMO_AGIMOS,
  DIFERENCIAIS_6,
  ISG,
  OFFICES,
  PILARES,
  POR_QUE_SISTRAN,
  PREMIACOES,
  PREMIACOES_NOTAS,
} from '@/data/aSistran';

export const metadata = {
  title: 'Quem somos · Sistran',
  description:
    'Com ampla presença na América do Sul, contando com mais de 130 clientes e 850 colaboradores, a Sistran é referência em soluções tecnológicas para o setor de Seguros.',
};

/* Esta pagina reune toda a escrita de /a-sistran/. O sobretitulo e o titulo sao
   os do site ("Sobre nós" / "A Sistran"); as secoes seguem a ordem da origem:
   escritorios, diferenciais, missao/valores/pilares, abordagem, como agimos,
   numeros, premiacoes, ISG e "Por que SISTRAN?". As secoes que no site sao
   apenas imagem (Tecnologias, carrosseis dos escritorios) nao foram recriadas.
   Os links para Sistran Labs e Sistran University estao aqui porque é por dentro
   de Quem somos que o menu do site chega nelas.
   Fonte: .claude/conteudo-site/01-a-sistran.md */
export default function Page() {
  return (
    <PageShell>
      <PageHero eyebrow="Sobre nós" title="A" highlight="Sistran" />

      <div className="section-light">
        <About />

        {/* Escritórios BRASIL */}
        <section aria-labelledby="escritorios" className="section-py">
          <div className="container-lp">
            <h2 id="escritorios" className="font-display text-section font-bold text-ink">
              Escritórios <span className="text-gradient-brand">BRASIL</span>
            </h2>
            {/* O site descreve apenas SP e Pato Branco; o Rio de Janeiro aparece
                no rodape e em "São 3 escritórios no Brasil", mas nao tem texto. */}
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
              {OFFICES.map((o) => (
                <article key={o.id} className="glass-card relative overflow-hidden p-7">
                  <span aria-hidden className="corner-accent" />
                  <h3 className="font-display text-xl font-bold text-ink">{o.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">{o.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Diferenciais — os 6 itens, so titulo, como no site */}
        <section aria-labelledby="diferenciais-6" className="section-py">
          <div className="container-lp">
            <h2 id="diferenciais-6" className="font-display text-section font-bold text-ink">
              Diferenciais
            </h2>
            <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {DIFERENCIAIS_6.map((d) => (
                <li
                  key={d}
                  className="glass-card p-6 font-display text-base font-bold leading-snug text-ink"
                >
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <Differentials />
      </div>

      {/* Missão · Valores · Pilares */}
      <section aria-labelledby="missao-valores-pilares" className="section-py">
        <div className="container-lp">
          <h2 id="missao-valores-pilares" className="sr-only">
            Missão, Valores e Pilares
          </h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <article className="glass-card p-7">
              <h3 className="font-display text-xl font-bold text-white">Missão</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/85">
                Oferecer soluções de negócios escaláveis, de baixo TCO*, baseadas em tecnologia para
                companhias de Seguros, considerando suas necessidades atuais e futuras.
              </p>
              <p className="mt-3 text-xs italic leading-relaxed text-ink-faint">
                *Total Cost of Ownership, uma estimativa financeira de custos diretos e indiretos de
                investimentos.
              </p>
            </article>

            <article className="glass-card p-7">
              <h3 className="font-display text-xl font-bold text-white">Valores</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/85">
                Conhecimento em Seguros, Flexibilidade, Tecnologia, Solidez e permanência.
              </p>
            </article>

            <article className="glass-card p-7">
              <h3 className="font-display text-xl font-bold text-white">Pilares</h3>
              <ul className="mt-3 space-y-2">
                {PILARES.map((p) => (
                  <li key={p} className="text-sm leading-relaxed text-white/85">
                    {p}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* Abordagem de projetos */}
      <section aria-labelledby="abordagem" className="section-py section-light section-light-blue">
        <div className="container-lp">
          <h2 id="abordagem" className="max-w-3xl font-display text-section font-bold text-ink">
            Temos uma abordagem completa de projetos para o mercado Segurador
          </h2>
          <ol className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ABORDAGEM.map((etapa, i) => (
              <li key={etapa} className="glass-card p-6">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1273BC]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-2 font-display text-lg font-bold text-ink">{etapa}</h3>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Como Agimos */}
      <section aria-labelledby="como-agimos" className="section-py">
        <div className="container-lp">
          <h2 id="como-agimos" className="font-display text-section font-bold text-white">
            Como <span className="text-gradient-brand">Agimos</span>
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85">
            Nossos valores são a base da nossa cultura organizacional. Respeitando as
            individualidades, prezamos pela:
          </p>
          <ol className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {COMO_AGIMOS.map((v, i) => (
              <li key={v} className="glass-card-hover p-6">
                <span className="text-xs font-semibold tracking-[0.18em] text-[#A5F0FF]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-2 font-display text-base font-bold text-white">{v}</h3>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Metrics />

      {/* Premiações, Certificações e Reconhecimentos */}
      <section aria-labelledby="premiacoes" className="section-py">
        <div className="container-lp">
          <h2 id="premiacoes" className="font-display text-section font-bold text-white">
            Premiações, Certificações e{' '}
            <span className="text-gradient-brand">Reconhecimentos</span>
          </h2>
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PREMIACOES.map((p) => (
              <li key={p.label} className="glass-card-hover p-6">
                <span className="font-display text-4xl font-black text-[#A5F0FF]">{p.value}</span>
                <p className="mt-2 text-sm leading-relaxed text-white/85">{p.label}</p>
              </li>
            ))}
          </ul>
          <div className="mt-8 space-y-4">
            {PREMIACOES_NOTAS.map((n) => (
              <p key={n.slice(0, 24)} className="max-w-3xl text-lg leading-relaxed text-white/85">
                {n}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ISG Provider Lens */}
      <section aria-labelledby="isg" className="section-py section-light section-light-blue">
        <div className="container-lp">
          <h2 id="isg" className="font-display text-section font-bold text-ink">
            ISG Provider Lens
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {ISG.map((i) => (
              <blockquote key={i.term} className="glass-card p-7">
                <p className="font-display text-base font-bold text-ink">{i.term}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  &ldquo;{i.quote}&rdquo;
                </p>
              </blockquote>
            ))}
          </div>
          <p className="mt-8 text-xs leading-relaxed text-ink-faint">
            (*) ISG —{' '}
            <a
              href="https://isg-one.com/index/isg-index"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
            >
              Consultores Globais em Gestão de Outsourcing
            </a>
            . Reprint autorizado por ISG Provider Lens ©, Brasil.
          </p>
        </div>
      </section>

      {/* Por que SISTRAN? */}
      <section aria-labelledby="por-que-sistran" className="section-py">
        <div className="container-lp">
          {/* No site o titulo termina com uma aspa dupla solta; removida. */}
          <h2 id="por-que-sistran" className="font-display text-section font-bold text-white">
            Por que <span className="text-gradient-brand">SISTRAN?</span>
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
            {POR_QUE_SISTRAN.map((b) => (
              <article key={b.title} className="glass-card-hover relative overflow-hidden p-7">
                <span aria-hidden className="corner-accent" />
                <h3 className="font-display text-lg font-bold leading-snug text-white">
                  {b.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/85">{b.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Caminho para as outras duas paginas do submenu "Quem somos". */}
      <section aria-labelledby="mais-quem-somos" className="section-py section-light section-light-blue">
        <div className="container-lp">
          <h2 id="mais-quem-somos" className="font-display text-section font-bold text-ink">
            Conheça também
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            <Link href="/sistran-labs" className="glass-card block p-7 transition-transform hover:-translate-y-1">
              <h3 className="font-display text-xl font-bold text-ink">
                Sistran Labs: Laboratório de INOVAÇÃO
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                Formado por uma equipe de nativos digitais, o Sistran Labs é o laboratório de
                inovações da Sistran.
              </p>
            </Link>
            <Link
              href="/sistran-university"
              className="glass-card block p-7 transition-transform hover:-translate-y-1"
            >
              <h3 className="font-display text-xl font-bold text-ink">Sistran University</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                Autossuficiência em capacitação de recursos: programa de capacitação intensiva da
                Sistran.
              </p>
            </Link>
          </div>
        </div>
      </section>

      <ContactCTA />
    </PageShell>
  );
}
