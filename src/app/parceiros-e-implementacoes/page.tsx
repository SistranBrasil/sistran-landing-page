import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import PartnerTerminalCards from '@/components/PartnerTerminalCards';
/* SIS-202 — `import PartnersTrail from '@/components/PartnersTrail';` saiu junto
   com a montagem: o arquivo fica no repositório, mas sem import o bundle desta
   rota não carrega mais a trilha antiga nem o seu CSS. Motivo completo na
   montagem, ao pé da seção de Implementações. */
import { RoadmapTrail } from '@/components/legacy/RoadmapTrail';
import { partnersTrailStops } from '@/lib/partnersRoadmapStops';
import NotchDivider from '@/components/ui/NotchDivider';
import HeroImageBackdrop from '@/components/ui/HeroImageBackdrop';
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
      {/* SIS-225 — a abertura deixa de ser navy chapado e ganha a capa de
          parceiros atrás da faixa inteira. É o `HeroImageBackdrop` já existente
          (SIS-113, mesmo caminho de `/contato` na SIS-126), sem componente novo:
          esta é a quinta abertura com mídia do site e a segunda com imagem
          estática. Nenhuma palavra da escrita muda — o eyebrow, o título com
          destaque e os dois parágrafos são exatamente os que já estavam aqui.

          DERIVADA. `public/fundocapaparceiros.png` tem 1,7 MB em 1672×941, e o
          componente marca `priority` — isto é, a capa entra no caminho crítico
          do LCP. Com `images: { unoptimized: true }` (ver
          `docs/images-unoptimized.md`) o `next/image` NÃO recomprime nada em
          tempo de execução: o arquivo do disco é o que chega no visitante, então
          1,7 MB ali seriam 1,7 MB acima da dobra. A derivada é
          `public/images/parceiros/parceiros-hero.webp`, 123 kB — 93% menos, sem
          reduzir a largura (a caixa é full-bleed e a 1440 o arquivo já é
          esticado; o que se ganha é só o formato). O PNG FICA onde está, como
          fonte para regerar: `scripts/otimizar-capa-parceiros-sis225.mjs`.

          `alt=""`. A capa é decorativa: o `h1` logo à frente já diz "Parceiros e
          Implementações", e as quatro marcas que aparecem nos cartões da arte
          (earnix, Microsoft Azure, núclea, AWS) já são publicadas em texto e em
          logo pela seção `#parceiros` desta mesma página. Descrevê-las aqui
          seria a terceira leitura das mesmas marcas na mesma tela.

          Sem `foco`: a prop escreve `object-position` em estilo inline, e aqui o
          valor precisa MUDAR com a largura — ver o porquê medido em
          `.hero-backdrop--parceiros .hero-backdrop-video` no `globals.css`.
          Estilo inline venceria a regra de `@media` sem `!important`, então o
          recorte fica todo em CSS escopado. */}
      <HeroImageBackdrop
        src="/images/parceiros/parceiros-hero.webp"
        alt=""
        className="hero-backdrop--parceiros"
      >
        <PageHero
          eyebrow="Parceiros e Implementações"
          title="Parceiros e"
          highlight="Implementações"
          description={
            <>
              <p>
                A Sistran Brasil, em colaboração com líderes globais em tecnologia da informação,
                traz para as Seguradoras soluções inovadoras e de ponta.
              </p>
              <p>
                Explore nosso portfolio de produtos e soluções, fruto de parcerias de excelência.
              </p>
            </>
          }
        />
      </HeroImageBackdrop>

      {/* Section: Parceiros — azul claro, alternando com o hero escuro acima.
          Os cards seguem navy (.on-dark). */}
      {/* SIS-236 — `mt-14` SAIU, e ele era a tarja azul clara da issue. Medido na
          coluna x=8 a 1440 (`docs/medidas/sis236/diagnostico.mjs`): o pé do hero
          morre em y=666 e esta seção abria em y=722, ou seja 56px — exatamente os
          `mt-14` — em que o que aparecia era o `body`, `#1273bc`. E ele não
          aparecia chapado: a faixa lia de `#1b81c7` a `#4d9bd2`, degradê, porque a
          sombra da SIS-93 (`0 0 54px 18px rgb(227 241 251 / 45%)`, na variante
          `section-light-blue`) clareia de baixo para cima o que estiver acima da
          borda. Daí a captura da issue — navy, tarja azul clara em degradê, claro.

          A CORREÇÃO É TIRAR O VÃO, e não pintar nada: é a primeira opção que a
          issue pede ("hero colado na próxima superfície"), e nenhum azul novo
          entra na paleta. Com o vão fechado a sombra passa a sangrar sobre o navy
          do hero, que é para o que ela foi escrita na SIS-93 ("bloco claro sobre o
          navy da página") — em vez de sobre o azul médio do body, onde ela virava
          uma terceira cor entre os dois blocos.

          E `mt-14` já era o ponto fora da curva: as outras onze montagens de
          `section-light section-light-blue` no repositório (`/solucoes`,
          `/quem-somos`, `/latam`, `/esg`, `/sistran-labs`, `MetricsBand`) não têm
          margem nenhuma — todas encostam na vizinha e deixam o respiro por conta
          do próprio `padding`. O `pt-16 md:pt-20` daqui fica, e é ele que segura a
          distância entre a emenda e o rótulo "Parceiros".

          `scroll-mt-32` (128px) não muda: ele já era maior que os 56px removidos,
          então o pulo para `#parceiros` continua parando abaixo do header fixo. */}
      <section
        id="parceiros"
        aria-labelledby="parceiros-titulo"
        /* scroll-mt: o header e fixo, entao ao pular para #parceiros o titulo
           ficava por baixo dele. */
        className="section-light section-light-blue relative scroll-mt-32 pt-16 md:pt-20"
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
        {/* SIS-201 — PartnersTrack foi desmontado deste mount e permanece
            preservado em src/components/PartnersTrack.tsx.
            SIS-188 — `PartnersGrid` (grade bento) também não entra aqui: a
            SIS-159 o substituiu pelo Track; a SIS-201 substituiu o Track por
            `PartnerTerminalCards`. O arquivo fica GUARDADO no repositório.
            Não há import comentado nesta página de propósito. */}
        <PartnerTerminalCards />
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
        {/* SIS-202 — o segundo chanfro (`<NotchDivider cor="#f5faff" />`, o
            não-invertido) SAIU. Ele existia para devolver o navy depois da faixa
            de logos, porque abaixo dela a seção continuava escura com a trilha
            antiga. Sem a trilha, o que vem abaixo é a seção creme, e o chanfro
            virava uma cunha azul de ~10px prensada entre dois blocos claros —
            exatamente o caso que a SIS-101 removeu da home: chanfro com nada do
            outro lado. Fotografado antes de remover (`1440-parceiros-0-emenda`).
            O chanfro invertido de cima FICA: lá a fronteira navy → faixa clara
            continua existindo, e é a que a SIS-75 manda resolver com chanfro.
            A emenda que sobra é #f5faff (faixa) → #e2effa (creme), dois tons
            claros vizinhos, que não pede transição nenhuma. */}

        {/* SIS-202 — `PartnersTrail` FOI DESMONTADA daqui, e o componente
            permanece preservado em `src/components/PartnersTrail.tsx` (com o seu
            `partners-trail.css`), sem nenhuma outra montagem no repositório.
            Motivo: a issue pede que a seção de etapas desta rota fique igual à
            "Casos e etapas" de `/transformacao-legado`, e o desenho serpentina
            com dots laranja/verde e cards "1ª GERAÇÃO" sai.

            O comentário anterior desta montagem segue valendo como registro do
            que ela mostrava, e é a razão pela qual ela sai sem perda de conteúdo
            publicado:
            | Trilha: o percurso das implementações se pintando com o scroll.
            | Os nomes e gerações vêm de src/data/timeline.ts — esse conteudo NAO
            | esta escrito em /parceiros-e-implementacoes/ (a secao do site é uma
            | unica imagem); ficou por pedido explicito de manter o visual.
            Ou seja: o que sai da tela não é texto do site, é conteúdo que existia
            só aqui. `src/data/timeline.ts` NÃO foi tocado — a lista continua no
            repositório para quem quiser a opção 2 da issue. */}
      </section>

      {/* SIS-202 · opção 2 — o LAYOUT de `/transformacao-legado`, o CONTEÚDO
          desta rota. A primeira entrega desta issue montou o `RoadmapTrail` com
          `roadmapIntro` + `roadmapStops` (Casos e etapas, Método Luminna) e foi
          reprovada: nenhuma escrita de legado/Luminna atravessa para cá.

          As paradas vêm de `partnersTrailStops`, derivadas das MESMAS
          `TIMELINE_EVENTS` que a `PartnersTrail` desmontada usava — geração,
          empresa e detalhe, sem uma linha nova de texto. O cabeçalho é o desta
          seção, não o do método.

          SIS-220 — o viajante VOLTA a ter arte. A SIS-202 o deixava sem
          (`traveler={null}`, "o símbolo da Luminna é do legado") e a pessoa que
          pediu revogou essa parte: a marca que anda na trilha tem de ser a mesma
          das duas rotas. O que a SIS-202 proibia e CONTINUA proibido é a copy —
          nenhuma linha de Método Luminna ou de etapa do método entra nos cards;
          os textos seguem vindo de `partnersTrailStops`/`TIMELINE_EVENTS`. Como
          o padrão de `RoadmapTrail` já é `/imagens/luminna-latam.png`, basta não
          passar `traveler`.

          Montada FORA da `<section id="implementacoes">`, e não no lugar exato da
          trilha antiga: `RoadmapTrail` é ela própria uma `<section>` de fundo
          claro (`.lp-section--cream`), e aninhá-la dentro da seção navy poria uma
          seção clara dentro de outra escura, logo depois do `NotchDivider` que
          justamente devolve o navy. Fora, a fronteira que sobra é cream → rodapé
          navy, que é a MESMA fronteira que `/transformacao-legado` já tem (lá esta
          seção também é a última antes do rodapé). Os dois chanfros da faixa de
          logos ficam como estão — eles pertencem à faixa, não à trilha. */}
      <RoadmapTrail
        id="linha-do-tempo"
        /* Título sem invenção: "Linha do tempo" é o nome que esta seção já tem no
           navegador lateral (`src/data/pageSections.ts`, e está em
           `copy-lock.json`), e "Implementações" é o rótulo que a seção acima já
           publica. Sem parágrafo de apoio — a `PartnersTrail` nunca teve um, e o
           do método está fora de escopo. */
        intro={{ kicker: 'Implementações', title: 'Linha do tempo' }}
        stops={partnersTrailStops}
      />
    </PageShell>
  );
}
