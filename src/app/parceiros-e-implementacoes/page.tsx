import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
/* SIS-159 — a grade bento saiu de cena; ver a nota no lugar da montagem, abaixo.
   Comentada, e não removida: import ativo sem uso quebra o lint, e apagar
   apagaria a pista de como religar.
// import PartnersGrid from '@/components/PartnersGrid'; */
import PartnersTrack from '@/components/PartnersTrack';
import PartnersTrail from '@/components/PartnersTrail';
import NotchDivider from '@/components/ui/NotchDivider';
import { SignalMarquee } from '@/components/legacy/SignalMarquee';

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
          {/* SIS-108 — era `01 · Parceiros`. O número saiu junto com o `02 ·` da
              seção de baixo: tirar só um deixaria um "01" sozinho numerando uma
              lista de um item. */}
          <span className="tag-section">Parceiros</span>
          <h2
            id="parceiros-titulo"
            className="mt-3 font-display text-3xl leading-tight text-ink md:text-4xl"
          >
            Parceiros
          </h2>
        </div>
        {/* ── SIS-159: A GRADE BENTO SAIU DAQUI ──────────────────────────────
            Aqui ficava `<PartnersGrid />`: dezesseis cards em até três colunas,
            com barra de sete filtros e tilt 3D. No lugar entra a trilha
            horizontal presa (`PartnersTrack`), que mostra um parceiro por vez com
            muito mais destaque. `PartnersGrid.tsx` continua no repositório,
            intacto — o import está comentado no topo deste arquivo.

            O QUE SE PERDE, e vale dizer em voz alta (item 13 da issue): a grade
            mostrava os dezesseis de uma vez (varredura rápida em desktop),
            permitia filtrar, e não sequestrava a rolagem. A trilha troca
            densidade por narrativa. É a decisão do pedido, mas não é ganho puro.
            O filtro não desapareceu: virou atalho que PULA para a categoria, sem
            mudar a largura da trilha — a apuração está no cabeçalho de
            `PartnersTrack.tsx`.

            Abaixo de 1024px, ou com `prefers-reduced-motion: reduce`, a trilha
            não entra e os dezesseis aparecem em grade vertical completa. Nada
            aqui é pinado com ScrollTrigger: é `position: sticky`, e por isso o
            `PartnersTrail` logo abaixo continua sem conflito nenhum. */}
        <PartnersTrack />
      </section>

      {/* Section: Implementações — volta ao escuro. No site esta secao é UMA
          imagem (`Implementacoes-2026.jpg`) sem alt e sem uma linha de texto;
          aqui ela vira a parede de logos, que é a mesma informacao em HTML,
          indexavel e acessivel. Nenhum texto foi inventado para acompanhar. */}
      <section id="implementacoes" aria-labelledby="implementacoes-titulo" className="pt-16 md:pt-20">
        <div className="container-lp mb-6">
          <span className="eyebrow !text-[#A5F0FF]">Implementações</span>
          <h2
            id="implementacoes-titulo"
            className="mt-3 font-display text-3xl leading-tight text-white md:text-4xl"
          >
            Implementações
          </h2>
        </div>
        {/* SIS-108 — aqui havia DUAS apresentações da mesma lista: o mosaico de
            placas brancas (`ImplementationsMosaic`, dentro do `container-lp`) e,
            logo abaixo, a parede de logos em duas trilhas (`ClientWall`). As duas
            liam `CLIENTS` de `src/data/clients.ts`, então a seção mostrava as
            mesmas marcas duas vezes seguidas, com dois desenhos diferentes.

            No lugar entra a faixa clara da home (`SignalMarquee`), que lê a MESMA
            lista — nenhuma marca se perde na troca, e não há lista nova a montar.
            Os dois componentes antigos ficaram sem nenhum outro uso no
            repositório e foram removidos junto (verificado por busca em `src/`:
            estas eram as únicas duas montagens).

            A faixa traz o próprio fundo off-white (`#f5faff`), e é isso que cria
            aqui uma fronteira claro/escuro que não existia — a seção é escura. Ela
            é resolvida com os dois chanfros abaixo, que é a linguagem que esta
            página já usa nas outras fronteiras (decisão registrada na SIS-75: em
            claro↔escuro o chanfro FICA, porque dissolver navy em branco por
            gradiente pediria uma faixa de ~200px de tom intermediário — o remendo
            que a nota de `globals.css` proíbe). Aqui os chanfros são legítimos
            porque há dois blocos em cada junta; o caso da SIS-101, que os removeu
            da home, era o contrário: um chanfro com nada do outro lado.

            Sem eyebrow "PARCEIROS" acima da faixa: a seção 01 desta mesma página
            já se chama Parceiros, e a faixa não carrega mais eyebrow nenhum desde
            a SIS-101 — repetir a palavra aqui seria o terceiro rótulo em duas
            telas. */}
        <NotchDivider cor="#f5faff" invertido />
        <div className="implementacoes-faixa">
          <SignalMarquee />
        </div>
        <NotchDivider cor="#f5faff" />

        {/* Trilha: o percurso das implementações se pintando com o scroll.
            Os nomes e gerações vêm de src/data/timeline.ts — esse conteudo NAO
            esta escrito em /parceiros-e-implementacoes/ (a secao do site é uma
            unica imagem); ficou por pedido explicito de manter o visual. */}
        <PartnersTrail id="linha-do-tempo" />
      </section>
    </PageShell>
  );
}
