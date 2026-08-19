import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import PartnersGrid from '@/components/PartnersGrid';
import ClientWall from '@/components/ClientWall';
import ImplementationsMosaic from '@/components/ImplementationsMosaic';
import PartnersTrail from '@/components/PartnersTrail';

export const metadata = {
  title: 'Parceiros e Implementações · Sistran',
  description:
    'A Sistran Brasil, em colaboração com líderes globais em tecnologia da informação, traz para as Seguradoras soluções inovadoras e de ponta.',
};

/* Toda a escrita desta pagina vem de /parceiros-e-implementacoes/.
   Fonte: .claude/conteudo-site/05-parceiros-e-implementacoes.md
   A faixa de numeros que existia aqui ("Parcerias ativas", "Implementações
   mapeadas", "Início da trajetória") foi removida: nao ha nada disso escrito
   no site. */
export default function Page() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Parceiros e Implementações"
        title="Parceiros e"
        highlight="Implementações"
        description={
          <>
            <p>
              A Sistran Brasil, em colaboração com líderes globais em tecnologia da informação, traz
              para as Seguradoras soluções inovadoras e de ponta.
            </p>
            <p>
              Explore nosso portfolio de produtos e soluções, fruto de parcerias de excelência.
            </p>
          </>
        }
      />

      {/* Section: Parceiros — azul claro, alternando com o hero escuro acima.
          Os cards seguem navy (.on-dark). */}
      <section
        id="parceiros"
        aria-labelledby="parceiros-titulo"
        /* scroll-mt: o header e fixo, entao ao pular para #parceiros o titulo
           ficava por baixo dele. */
        className="section-light section-light-blue relative mt-14 scroll-mt-32 pt-16 md:pt-20"
      >
        <div className="container-lp">
          <span className="tag-section">01 · Parceiros</span>
          <h2
            id="parceiros-titulo"
            className="mt-3 font-display text-3xl font-bold leading-tight text-ink md:text-4xl"
          >
            Parceiros
          </h2>
        </div>
        <PartnersGrid />
      </section>

      {/* Section: Implementações — volta ao escuro. No site esta secao é UMA
          imagem (`Implementacoes-2026.jpg`) sem alt e sem uma linha de texto;
          aqui ela vira a parede de logos, que é a mesma informacao em HTML,
          indexavel e acessivel. Nenhum texto foi inventado para acompanhar. */}
      <section id="implementacoes" aria-labelledby="implementacoes-titulo" className="pt-16 md:pt-20">
        <div className="container-lp mb-6">
          <span className="eyebrow !text-[#A5F0FF]">02 · Implementações</span>
          <h2
            id="implementacoes-titulo"
            className="mt-3 font-display text-3xl font-bold leading-tight text-white md:text-4xl"
          >
            Implementações
          </h2>
        </div>
        {/* Mosaico: as marcas todas de uma vez, montando-se com o scroll. */}
        <div className="container-lp">
          <ImplementationsMosaic />
        </div>

        {/* Parede de logos em movimento contínuo, logo abaixo do mosaico. */}
        <ClientWall />

        {/* Trilha: o percurso das implementações se pintando com o scroll.
            Os nomes e gerações vêm de src/data/timeline.ts — esse conteudo NAO
            esta escrito em /parceiros-e-implementacoes/ (a secao do site é uma
            unica imagem); ficou por pedido explicito de manter o visual. */}
        <PartnersTrail id="linha-do-tempo" />
      </section>
    </PageShell>
  );
}
