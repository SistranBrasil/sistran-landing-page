import Image from 'next/image';
import PageShell from '@/components/PageShell';
import RevealScope from '@/components/motion/RevealScope';
import { LIMIAR_REVEAL, MARGEM_REVEAL } from '@/lib/reveal-calibre';
import PageHero from '@/components/PageHero';
import CarimboBatida from '@/components/CarimboBatida';
import PartnerTerminalCards from '@/components/PartnerTerminalCards';
/* SIS-202 — `import PartnersTrail from '@/components/PartnersTrail';` saiu junto
   com a montagem: o arquivo fica no repositório, mas sem import o bundle desta
   rota não carrega mais a trilha antiga nem o seu CSS. Motivo completo na
   montagem, ao pé da seção de Implementações. */
/* SIS-202 — os dois imports da trilha saem junto com a montagem. Os arquivos ficam
   no repositório: `RoadmapTrail` continua montada em `/transformacao-legado`, e
   `partnersTrailStops` segue sendo a derivação de `TIMELINE_EVENTS` que aquela rota
   não usa mas que documenta o mapeamento. Sem import, o bundle DESTA rota deixa de
   carregar os dois — que é o ponto de "desmontar".
   import { RoadmapTrail } from '@/components/legacy/RoadmapTrail';
   import { partnersTrailStops } from '@/lib/partnersRoadmapStops'; */
import { TrajectorySection } from '@/components/trajectory/TrajectorySection';
import NotchDivider from '@/components/ui/NotchDivider';
import HeroImageBackdrop from '@/components/ui/HeroImageBackdrop';
/* SIS-236 — a terceira camada do plano desta rota: quadrados arredondados, linhas
   longas e o arco azul, geometria que gradiente não desenha. A malha de pontos e
   as linhas de grade continuam em CSS, no `::before` de `.parceiros-canvas`. */
import AtmosferaQuadrados from '@/components/ui/AtmosferaQuadrados';
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
    <PageShell classeDoMain="parceiros-canvas">
      {/* SIS-236 — O PLANO CONTÍNUO DA ROTA, no mecanismo que a issue nomeia:
          classe própria no `<main>` + a camada de geometria, espelhando
          `/quem-somos` (e a home, na SIS-230). As faixas claras param de ter
          superfície própria e passam a ser janelas para UM fundo ancorado na
          janela do navegador — é isso, e não uma cor nova, que tira o degrau
          entre seções claras.

          ⚠️ A CAMADA VEM ANTES DO CONTEÚDO no markup, como em
          `quem-somos/page.tsx:195`: ela é `position: fixed` com `z-index: -1`, e
          o que decide a ordem de pilha é o `isolation: isolate` do `<main>`, não
          a posição no documento. Antes é o lugar honesto — quem lê o arquivo
          encontra a pintura antes do conteúdo que ela fica atrás.

          ⚠️ A PARIDADE DE `#implementacoes` NÃO SE MOVE, e isto era o risco real
          desta montagem. O navy daquela seção NÃO é escrito nela: vem da
          alternância de painéis (`:where(main > section:nth-of-type(even))`,
          `globals.css:18188`), que conta irmãos do tipo `section`. Esta rota já
          teve esse acidente uma vez — a primeira versão da SIS-225 entrou com um
          nó a mais e `#implementacoes` perdeu o painel, ficando texto branco
          sobre o `#1273bc` do body (medido em
          `docs/medidas/parceiros-abertura-sis225.json`: a emenda lia
          `75,149,204`). `AtmosferaQuadrados` devolve uma `<div>`, não uma
          `<section>`, então a contagem fica EXATAMENTE como estava:
          `#parceiros` (1), `#implementacoes` (2, navy), `#linha-do-tempo` (3). E
          o `HeroImageBackdrop` também é `<div>` — nunca contou.

          ⚠️ Nenhum ancestral de `<main>` pode ganhar `transform`, `filter` ou
          `perspective`: os três fazem `fixed` resolver contra a caixa do
          ancestral em vez da janela, e o plano voltaria a ser pintado por seção
          — o degrau de volta, calado. Não medido nesta rota (ver os portões da
          issue); a leitura é herdada de `/quem-somos`, onde o inventário deu
          zero e listou só `<body>` e `<html>`, que são os mesmos dois aqui
          porque o `PageShell` é o mesmo. */}
      <AtmosferaQuadrados classe="parceiros-atmosfera" />

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
        {/* SIS-225 — A CAPA FICA COM O TÍTULO E MAIS NADA.
            Duas coisas saem daqui, e as duas continuam na página, mais abaixo:

            · O CARIMBO. A SIS-277 o pôs nesta abertura, no lugar da tag textual
              `eyebrow="Parceiros e Implementações"`; agora ele desce para dentro
              de `#parceiros` e passa a ser o rótulo daquela seção (a montagem
              está lá, com a apuração da TINTA, que é o que essa mudança de
              superfície obriga). A prop era exatamente esta:

                eyebrowArte={
                  <CarimboBatida
                    src="/images/parceiros/carimbo-parcerias.webp"
                    alt="Parceiros e Implementações"
                    larguraIntrinseca={640}
                    alturaIntrinseca={200}
                  />
                }

              Com ela fora, o `PageHero` volta ao ramo do `eyebrow` textual — e
              ele NÃO é reposto. A palavra já está no `h1` logo abaixo, e a
              SIS-277 só tinha criado a tag por herança; repô-la agora seria
              devolver a redundância que ela mesma tirou.

            · OS DOIS PARÁGRAFOS, que eram a `description` e agora abrem a seção
              de intro. Sem eles o `PageHero` não monta o bloco de subtítulo, e a
              entrada fica com uma linha só de conteúdo — que é o pedido.

            `tituloForte` é a porta que a SIS-281 abriu para o `h1` em peso real
            (700, corte carregado; ver o docblock da prop). O título continua
            partido em `title` + `highlight` de propósito: é o MESMO par de
            valores travados no `copy-lock`, e juntá-los numa string só apagaria
            duas entradas para criar uma terceira — deriva de cópia para fazer
            uma mudança de peso. O negrito cai nos dois nós, porque `font-bold`
            está no `h1` e o `<span>` do destaque só troca a cor. */}
        <PageHero title="Parceiros e" highlight="Implementações" tituloForte />
      </HeroImageBackdrop>

      {/* SIS-225 — a intro que a capa deixou de carregar, no MOLDE de
            `#beyond-technology` em `/solucoes`: texto à esquerda, arte emoldurada
            à direita, fundo claro. O que se reaproveita é o LAYOUT — as classes
            `.solucoes-intro*` da SIS-279, que são globais e não escopadas ao
            canvas daquela rota, então esta seção não pede uma linha de CSS nova.
            O que NÃO se reaproveita é a escrita: o lema «Beyond Technology» é de
            lá e fica lá. Aqui os dois parágrafos são os MESMOS que estavam na
            `description` da capa, palavra por palavra — nenhuma entrada de
            `copy-lock` nasce ou morre, elas só trocam de nó no mesmo arquivo.

            Sem entrada no navegador lateral (`src/data/pageSections.ts`): é o
            mesmo tratamento que `#beyond-technology` recebe em `/solucoes`, que
            também não está na lista. A intro é o pé da abertura, não uma parada.

            A ARTE É `/images/escritoriopb/pb3.png` (SIS-225).

            ⚠️ O QUE ESTA TROCA DESFEZ, e está escrito para ninguém «restaurar»:
            a montagem anterior usava `/images/consultoria.png` com os mesmos
            `width`/`height`/`sizes` de `/solucoes`, e a razão declarada era
            COMPARTILHAR CACHE — as duas rotas pediam o mesmo arquivo e a segunda
            visita vinha de graça. Essa economia MORREU por decisão de conteúdo,
            não por engano: a issue troca a ilustração genérica (laço de vidro
            sobre mesa, arte de banco de imagens) por uma FOTO DO ESCRITÓRIO PB
            com as pessoas da casa. `/solucoes` segue com `consultoria.png` e
            está fora do escopo — então o arquivo antigo NÃO sai de `public/`, e
            quem tentar removê-lo quebra aquela rota.

            O ARGUMENTO DE CACHE, portanto, não justifica mais alinhar os
            atributos com `/solucoes`: são dois arquivos diferentes, e copiar de
            lá agora só produziria `width`/`height` errados. Os desta montagem
            saem do ARQUIVO, medidos: 1280x960.

            ⚠️ A RAZÃO MUDOU DE 16:9 PARA 4:3, e isso é geometria, não detalhe.
            `.solucoes-intro-arte-img` é `width: 100%; height: auto`, ou seja a
            moldura segue a razão do ARQUIVO e não uma caixa reservada (está
            comentado lá). A 1440 a coluna vale 530px, então a arte passa de
            ~298px de altura (530÷1,777) para ~398px (530÷1,333): cem pixels mais
            alta. Isto NÃO desalinha a intro porque `.solucoes-intro` é
            `align-items: center` — a coluna de texto continua centrada contra a
            arte, seja qual for a diferença. Se alguém trocar esse `center` por
            `start`, é AQUI que o vão morto vai aparecer, e maior do que antes.

            PESO: 2,0 MB (contra 1,8 MB da arte anterior) e com
            `images: { unoptimized: true }` (`docs/images-unoptimized.md`) é isso
            que chega no visitante. Não entra no caminho crítico — está abaixo da
            dobra e sem `priority`, logo `loading="lazy"` — mas uma derivada WebP
            continua sendo issue própria, agora para os dois arquivos.

            POR QUE É UMA `<div>`, E NÃO UMA `<section>`. Duas razões, e as duas
            foram medidas nesta issue:

            1. `globals.css` tem a alternância de painéis em `@layer base`,
               `:where(main > section:nth-of-type(even))` — e ela conta IRMÃOS DO
               TIPO `section`. Entrar aqui como `<section>` empurraria a paridade
               de tudo que vem depois: na primeira versão desta montagem
               `#implementacoes` PERDEU o painel navy (passou a par → ímpar) e
               ficou sobre o `#1273bc` do body, com o texto branco por cima.
               Medido em `docs/medidas/parceiros-abertura-sis225.json` antes da
               correção: a emenda de baixo lia `75,149,204` em vez do navy.
               Como `<div>`, a contagem de `section` de `<main>` fica EXATAMENTE
               como estava — `#parceiros` (1), `#implementacoes` (2, navy),
               `#linha-do-tempo` (3, creme próprio).

               Pelo mesmo motivo não há invólucro `<div>` em volta das duas: a
               regra também casa `main > div > section:nth-of-type(even)`, e com
               isso `#parceiros` virava o par de dentro e era pintado de NAVY —
               o carimbo saiu a 1,18:1 na primeira medição por causa disso.

            2. Semântica: este bloco não tem cabeçalho nem nome acessível. Uma
               `<section>` sem nome não é landmark útil — só engorda o sumário de
               regiões com uma entrada anônima. `<div>` é o nó honesto, e a
               continuidade de superfície com `#parceiros` fica por conta das
               MESMAS classes de fundo nos dois blocos (a emenda claro/claro que
               isso cria está medida no relatório da issue). */}
      <div id="parcerias-intro" className="section-light section-light-blue section-py">
        <div className="container-lp">
          <RevealScope
            className="solucoes-intro"
            limiar={LIMIAR_REVEAL}
            margem={MARGEM_REVEAL}
            data-reveal-nome="intro-parcerias"
          >
            <div className="solucoes-intro-texto">
              <p data-reveal="fade-up" className="solucoes-intro-frase">
                A Sistran Brasil, em colaboração com líderes globais em tecnologia da informação,
                traz para as Seguradoras soluções inovadoras e de ponta.
              </p>
              {/* O segundo parágrafo é apoio, não manchete: fica no corpo do
                    texto em vez de repetir `.solucoes-intro-frase`, que é a
                    escala de abertura. A cor vem de `.section-light p`. */}
              <p
                data-reveal="fade-up"
                style={{ '--reveal-i': 1 } as React.CSSProperties}
                className="mt-5 max-w-[42ch] text-lg leading-relaxed"
              >
                Explore nosso portfolio de produtos e soluções, fruto de parcerias de excelência.
              </p>
            </div>
            <figure
              data-reveal="fade-up"
              style={{ '--reveal-i': 1 } as React.CSSProperties}
              className="solucoes-intro-arte"
            >
              {/* `alt` DESCRITIVO e não decorativo: a foto não repete o que os dois
                    parágrafos dizem — eles falam de parcerias e portfolio, ela mostra
                    a equipe trabalhando. Conteúdo novo para quem não vê a imagem,
                    logo `alt` com texto e não `alt=""`.
                    O que ele NÃO faz: contar pessoas nem descrever roupas. Número
                    exato envelhece à primeira troca de foto, e o que a imagem
                    comunica é «equipe em operação num escritório aberto», não um
                    inventário. A parede com o manifesto e o painel SISTRAN entram
                    porque são a única informação de MARCA na cena.

                    `sizes` ganhou a parada de 1180px. Ele é inerte hoje
                    (`unoptimized`, SIS-154) e por isso mesmo tem de ser verdadeiro:
                    `46vw` sozinho MENTE acima de 1180, porque o `container-lp`
                    satura ali — a 1440 a coluna vale (1180 − 64 de padding − 56 de
                    gap) ÷ 2 = 530px, e `46vw` pediria 662px, 25% a mais. */}
              <Image
                src="/images/escritoriopb/pb3.png"
                alt="Equipe da Sistran trabalhando em bancadas de um escritório aberto, vista do alto, com a parede de vidro do manifesto «eu sou parte de uma equipe» e um painel azul com a marca SISTRAN ao fundo."
                width={1280}
                height={960}
                sizes="(min-width: 1180px) 530px, (min-width: 64rem) 46vw, 92vw"
                className="solucoes-intro-arte-img"
              />
            </figure>
          </RevealScope>
        </div>
      </div>

      {/* Section: Parceiros — azul claro, agora em continuidade com a intro logo
          acima (que usa as mesmas classes) e não mais alternando com o hero
          escuro. Os cards seguem navy (.on-dark). */}
      {/* SIS-236 — `mt-14` SAIU, e ele era a tarja azul clara daquela issue. Medido
          na coluna x=8 a 1440 (`docs/medidas/sis236/diagnostico.mjs`): o pé do hero
          morria em y=666 e esta seção abria em y=722, ou seja 56px — exatamente os
          `mt-14` — em que o que aparecia era o `body`, `#1273bc`, clareado de baixo
          para cima pela sombra da SIS-93 (`0 0 54px 18px rgb(227 241 251 / 45%)`, da
          variante `section-light-blue`). Daí a captura daquela issue: navy, tarja
          azul clara em degradê, claro.

          A CORREÇÃO FOI TIRAR O VÃO, e não pintar nada, e ela CONTINUA valendo: aqui
          também não entra margem nenhuma. O que mudou na SIS-225 é a VIZINHA DE
          CIMA — não é mais o hero navy, é a intro, que usa as MESMAS classes de
          fundo. A sombra da SIS-93 continua existindo nas duas pontas do campo
          claro (sobre o navy do hero e sobre o navy de Implementações, que é para
          o que ela foi escrita), e na junta interna intro→`#parceiros` ela cai sobre
          papel claro, onde um brilho claro de 45% não se vê. Os dois degradês são
          por elemento, então essa junta É uma emenda de tom: medida em
          `docs/medidas/parceiros-abertura-sis225.json` e relatada na issue.

          O `pt-16 md:pt-20` que a SIS-236 manteve SAIU nesta issue, e este é o
          registro do motivo: ele existia para «segurar a distância entre a emenda e
          o rótulo Parceiros». O respiro acima do rótulo agora é o `py` de baixo da
          intro — 80px a 128px pelo `.section-py`, MAIS que os 64/80 que ele dava.
          Somar os dois empilharia ~192px de nada antes do carimbo.

          `scroll-mt-32` (128px) não muda: é ele que faz o pulo para `#parceiros`
          parar abaixo do header fixo. */}
      <section
        id="parceiros"
        aria-labelledby="parceiros-titulo"
        /* As classes de fundo FICAM aqui, e isso é o que faz esta seção vencer
             a alternância de painéis: a regra vale 0,0,0 em `@layer base` e a sua
             própria nota diz «pinte SÓ se ninguém reivindicar esta superfície».
             Sem elas, `#parceiros` é o `section` par de dentro de um invólucro e
             recebe `--fundo-marca`, que é NAVY. */
        className="section-light section-light-blue relative scroll-mt-32"
      >
        {/* SIS-225 — O RÓTULO DESTA SEÇÃO É O CARIMBO, e mais nada. Saíram os
              dois nós textuais que estavam aqui:

                <span className="tag-section">Parceiros</span>
                <h2 id="parceiros-titulo" className="mt-3 font-display text-3xl
                  leading-tight text-ink md:text-4xl">Parceiros</h2>

              (o `span` era `01 · Parceiros` até a SIS-108, que tirou o número
              porque um "01" sozinho numerava uma lista de um item.) Os dois diziam
              a MESMA palavra um debaixo do outro, e a arte que desceu da capa já a
              desenha — três leituras de «Parceiros» em 150px de tela.

              O NOME ACESSÍVEL NÃO SE PERDE, e é isso que a issue exige: o
              `aria-labelledby` FICA, e o `id="parceiros-titulo"` migra para a
              caixa do carimbo. O cálculo de nome acessível atravessa a subárvore
              referenciada e colhe o `alt` da imagem, então `#parceiros` continua
              se chamando «Parceiros» para leitor de tela e para o sumário de
              regiões. Preferido a `aria-label` (a outra opção da issue) porque
              com `aria-label` a palavra ficaria escrita DUAS vezes — no rótulo e
              no `alt` — e as duas poderiam divergir na próxima edição.

              `gatilho="viewport"`: obrigatório aqui, e não preferência. Na capa a
              peça batia com a liberação da rota porque estava acima da dobra;
              nesta altura o padrão `'rota'` faria a batida acontecer com a seção
              fora de tela, e — nas palavras do docblock do componente — «quem
              rolasse até a seção encontraria o carimbo já assentado». Isto também
              tira a peça do `priority`, que é o certo para imagem abaixo da dobra.

              A TINTA é outra, e o arquivo é outro por isso: `#0757c7` em vez do
              ciano da capa. A arte da capa é de tinta única ~#0ed8f6 (apurado no
              PNG de origem) e este papel é `section-light-blue`, ~#e3f1fb — a
              mesma arte daria 1,2:1 num elemento que agora é o ÚNICO rótulo
              visual da seção. #0757C7 é a tinta que a casa já usa em carimbo
              sobre este papel, em quatro peças, e fecha 5,69:1. A derivação, a
              medição e o porquê de não ser o #0079CB da marca estão em
              `scripts/gerar-carimbo-parcerias-claro-sis225.mjs`. O arquivo ciano
              FICA no repositório — é a peça da capa escura. */}
        {/* SIS-201 (3ª volta) — O CARIMBO SAIU DAQUI e agora é o primeiro filho de
            `.partner-terminal__stage`, dentro de `PartnerTerminalCards`. O motivo é
            o pin: o palco é `sticky; top: 0` no desktop, então um carimbo montado
            AQUI, irmão do componente, rolava para fora no instante em que o palco
            grudava — os cards ficavam sob o header e o vão até o carimbo era
            insolúvel por padding (itens 1 e 2 da issue). Dentro do palco os dois
            grudam e descem juntos. A nota de cor logo acima segue valendo: quem
            trocar a arte troca no novo mount.

            O `id="parceiros-titulo"` foi COM ele, e é por isso que o
            `aria-labelledby` desta `<section>` continua resolvendo. Não recriar o id
            aqui: dois nós com o mesmo id quebrariam a referência.

            O JSX de então, na íntegra:

            <div className="container-lp">
              <div id="parceiros-titulo">
                <CarimboBatida
                  src="/images/parceiros/carimbo-parcerias-0757c7.webp"
                  alt="Parceiros"
                  larguraIntrinseca={640}
                  alturaIntrinseca={200}
                  gatilho="viewport"
                />
              </div>
            </div>

            (O import de `CarimboBatida` FICA neste arquivo — a capa, mais acima,
            monta outro carimbo.) */}
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
      <section
        id="implementacoes"
        aria-labelledby="implementacoes-titulo"
        className="pt-16 md:pt-20"
      >
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
          o padrão de `RoadmapTrail` já é a arte canônica
          `/images/solucoes/luminnadoisnn.png`, basta não passar `traveler`.

          Montada FORA da `<section id="implementacoes">`, e não no lugar exato da
          trilha antiga: `RoadmapTrail` é ela própria uma `<section>` de fundo
          claro (`.lp-section--cream`), e aninhá-la dentro da seção navy poria uma
          seção clara dentro de outra escura, logo depois do `NotchDivider` que
          justamente devolve o navy. Fora, a fronteira que sobra é cream → rodapé
          navy, que é a MESMA fronteira que `/transformacao-legado` já tem (lá esta
          seção também é a última antes do rodapé). Os dois chanfros da faixa de
          logos ficam como estão — eles pertencem à faixa, não à trilha. */}
      {/* SIS-202 — A TRILHA SAI, A TRAJETÓRIA ENTRA. `RoadmapTrail` desce abaixo,
          comentada e não apagada, com o motivo: ela contava a mesma lista como uma
          sequência de paradas numeradas, e a especificação de `docs/implantacoes.md`
          pede outra coisa — preview de síntese + fluxo detalhado conduzido pela
          rolagem, com as quatro competências intercaladas e nenhuma numeração
          (critério 5). Não é um ajuste da trilha: é outra estrutura.

          ⚠️ `RoadmapTrail` SEGUE MONTADA EM `/transformacao-legado`, que a issue
          manda deixar intacta. Portanto nada de tocar no componente nem no
          `legacy.css` — o que muda é só quem esta rota monta.

          ⚠️ A CONTAGEM DE `<section>` NÃO SE MOVE. `TrajectorySection` devolve
          EXATAMENTE uma `<section>`, como `RoadmapTrail` devolvia: a rota continua
          `#parceiros` (1), `#implementacoes` (2, navy), `#linha-do-tempo` (3,
          creme). Ver o aviso longo no topo deste arquivo — esta paridade já se
          perdeu uma vez aqui por um nó a mais. */}
      <TrajectorySection id="linha-do-tempo" />
      {/* A montagem anterior, preservada (o título vinha do navegador lateral, em
          `src/data/pageSections.ts` e travado em `copy-lock.json`, e o kicker era o
          rótulo da seção acima — os DOIS textos continuam iguais em
          `TrajectorySection`, então nada de escrita mudou nesta rota):

          <RoadmapTrail
            id="linha-do-tempo"
            intro={{ kicker: 'Implementações', title: 'Linha do tempo' }}
            stops={partnersTrailStops}
          /> */}
    </PageShell>
  );
}
