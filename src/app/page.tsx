import Header from '@/components/Header';
import HeroCinematic from '@/components/HeroCinematic';
/* SIS-196 — CSS estrutural importado pelo entry point servidor da rota. Assim o
   App Router inclui a folha no HTML inicial também quando JavaScript não roda. */
import '@/components/solutions-story.css';
// Import comentado junto com o consumo da seção logo abaixo (ver o comentário
// em volta de `<Differentials />`): deixá-lo ativo quebraria o lint por import
// não utilizado, e removê-lo apagaria a pista de como religar a seção.
// import Differentials from '@/components/Differentials';
/* SIS-272 (2ª correção de curso, 29/09) — `Metrics` SAI OUTRA VEZ, agora pelo motivo
   certo: o pedido é a escrita dos sete no DESENHO da faixa de `/quem-somos`, e quem
   desenha aquilo é `FaixaIndicadores`, não a `Metrics`. Comentado e não apagado —
   ativo e sem consumo, o lint quebra por import não utilizado.

   A apuração de que `Metrics` é o ÚNICO capítulo inscrito na jornada
   (`jornada.registrar('metrics', …)` em `Metrics.tsx:755`) continua verdadeira, e
   agora ela TEM consequência: `ProofJourney` fica montado dirigindo ZERO capítulos.
   Fica de propósito, e não por inércia — os irmãos que vivem dentro do wrapper
   (emendas, parceiros) dependem dele como ancestral, e `useJornada` sem wrapper
   devolve `dirigindo: false` fazendo cada um recriar o seu próprio trigger. Um
   wrapper sem capítulo é inofensivo; tirá-lo mexeria em seções que esta issue manda
   não tocar.
// import Metrics from '@/components/Metrics'; */
import ProofJourney from '@/components/ProofJourney';
/* SIS-272 (2ª correção de curso) — A FAIXA VOLTA À HOME, com a escrita dos SETE
   (`fonte="metricas"`) e não com 1988/150+/18. É o layout que a usuária pediu, e é o
   que o docblock de `FaixaIndicadores.tsx` sempre deu como razão de a peça existir.
   `About.tsx` continua montando a MESMA peça em `/quem-somos` com o default de três
   e com aresta — as duas rotas dividem um desenho só, que era o ponto da extração. */
import FaixaIndicadores from '@/components/FaixaIndicadores';
import SolutionsStory from '@/components/SolutionsStory';
import Social from '@/components/Social';
import Contact from '@/components/Contact';
// Import comentado junto com o consumo do bloco "Fale com a Gente!" no fim do
// `main` (ver o comentário no lugar dele): deixá-lo ativo quebraria o lint por
// import não utilizado, e removê-lo apagaria a pista de como religar.
// import ContactCTA from '@/components/ContactCTA';
import Footer from '@/components/Footer';
import ScrollSpy from '@/components/ui/ScrollSpy';
// Import comentado junto com o consumo do fio condutor logo abaixo (ver o
// comentário em volta de `<ScrollSpine />`): deixá-lo ativo quebraria o lint por
// import não utilizado, e removê-lo apagaria a pista de como religar o fio.
// import ScrollSpine from '@/components/ui/ScrollSpine';
import BackToTop from '@/components/ui/BackToTop';
// SIS-230 — a terceira camada do plano claro, a mesma peça de `/solucoes` e
// `/quem-somos`. Montada com a classe da rota (ver a nota no mount).
import AtmosferaQuadrados from '@/components/ui/AtmosferaQuadrados';
// SIS-192 — o handoff saiu da home junto com o mosaico (não há tile de origem
// para viajar). Import comentado junto com o consumo (ver a nota no lugar dele):
// deixá-lo ativo quebraria o lint por import não utilizado, e removê-lo apagaria
// a pista de como religar.
// import MosaicHandoff from '@/components/ui/MosaicHandoff';
// Import comentado junto com o consumo do condutor Soluções -> Números (ver o
// comentário no lugar dele, depois de `<Metrics />`): deixá-lo ativo quebraria o
// lint por import não utilizado, e removê-lo apagaria a pista de como religar.
// import SolutionsToMetrics from '@/components/ui/SolutionsToMetrics';
// Import comentado junto com os wrappers que saíram da home (ver a nota acima de
// `<Contact />`): o componente continua no projeto, mas a home não o consome mais
// — deixá-lo importado quebraria o lint por import não utilizado.
// import SectionReveal from '@/components/ui/SectionReveal';
import OptionalMorphIntro from '@/components/intro/OptionalMorphIntro';
// Imports comentados junto com a saída do chanfro e da faixa de logos daqui (ver
// a nota SIS-101 dentro do `<ProofJourney>`): deixá-los ativos quebraria o lint
// por import não utilizado, e removê-los apagaria a pista do que havia ali.
// import NotchDivider from '@/components/ui/NotchDivider';
// SIS-192 — o mosaico saiu da HOME. Import comentado junto com o consumo (ver a
// nota no lugar dele): deixá-lo ativo quebraria o lint por import não utilizado, e
// removê-lo apagaria a pista de como religar. SIS-279 apagou
// `/transformacao-legado`, que era o outro lugar que montava o componente — hoje
// ele não está em rota nenhuma (o porquê de continuar no repo está na nota do
// consumo, abaixo).
// import { StackScenes } from '@/components/legacy/StackScenes';
// Import comentado junto com o consumo da faixa logo abaixo (ver o comentário em
// volta de `<MetricsStrip />`): deixá-lo ativo quebraria o lint por import não
// utilizado, e removê-lo apagaria a pista de como religar a faixa.
// import { MetricsStrip } from '@/components/legacy/MetricsStrip';
// SIS-101 — a faixa de logos agora é montada por `Metrics.tsx`, como rodapé da
// seção dos números. A home não a consome mais diretamente.
// SIS-156 — e na home ela deixou de ser faixa: o rodapé daquela seção passou a ser
// a grade estática `BrandGrid`, montada no mesmo lugar. A faixa rolante segue viva
// em `/contato` e `/parceiros-e-implementacoes`; a home não a consome de nenhuma
// forma.
// SIS-179 — "montada no mesmo lugar" já não vale: a grade voltou a ser montada
// AQUI, e não mais por `Metrics.tsx`. Só que não como faixa de logos solta no fim
// da página, como na SIS-101: ela abre a home, logo depois do hero. O que continua
// valendo é a última frase — a home não consome o `SignalMarquee` de nenhuma forma.
// import { SignalMarquee } from '@/components/legacy/SignalMarquee';
import { BrandGrid } from '@/components/BrandGrid';
import { ImpactSequence } from '@/components/legacy/ImpactSequence';

export default function Page() {
  return (
    <>
      {/* Abertura opcional: so na home, so uma vez por sessao, e sempre por
          cima de uma pagina que ja terminou de renderizar por baixo. */}
      <OptionalMorphIntro />
      <Header />
      <ScrollSpy />
      {/* TIPOGRAFIA.md — a serifa editorial saiu daqui: ela é do layout raiz
          agora, para o site inteiro, e não mais uma fonte declarada por rota. O
          `<main>` continua sendo irmão direto das seções por outro motivo, que
          segue valendo: um `<div>` em volta do hero quebraria `#top + *` no
          `globals.css` — a seção seguinte deixaria de ser irmã do hero e perderia
          o `z-index` que a faz subir por cima dele. */}
      {/* SIS-199 — `home-canvas` é o backdrop claro da home: `--fundo-claro-secao`
          mais a grade leve de "Soluções de Negócios", os dois ancorados na JANELA
          para serem UMA superfície ao longo dos ~11.000px da página em vez de uma
          por seção. Regra e decisões (opção 1, palcos escuros que ficam) em
          `globals.css`, no bloco "SIS-199 — O CANVAS DA HOME É CLARO".

          A classe fica AQUI, no `<main>`, e não no `body`: pintar o `body` levaria
          o claro para as outras treze rotas, que são desenhadas contra o navy.

          ⚠️ Some com o canvas se este `<main>` — ou qualquer ancestral dele —
          ganhar `transform`, `filter` ou `perspective`: os três fazem o
          `background-attachment: fixed` voltar a resolver por caixa, e o degrau de
          cor entre as seções volta calado. */}
      <main id="conteudo" className="home-canvas" tabIndex={-1}>
        {/* SIS-230 — A TERCEIRA CAMADA DO PLANO CLARO: quadrados arredondados
            translúcidos e o arco azul, que gradiente não desenha. Primeiro nó do
            `<main>` porque é fundo — e, sendo `position: fixed` com `z-index: -1`,
            a posição na árvore não muda o que se vê; o que ela faz é deixar a
            leitura do arquivo na mesma ordem das camadas. É a mesma ordem e a mesma
            justificativa do mount em `/quem-somos`.

            A classe é própria da rota (`.home-atmosfera`, no bloco da home do
            `globals.css`): a folha de `/solucoes` é da SIS-204 e reusar o seletor
            dela faria a próxima passada lá mexer aqui sem saber.

            Ela NÃO conta como "embrulhar as seções" — é um irmão que vem antes do
            hero, e `#top + *` continua casando com a `.marcas-grade`, porque o
            seletor de irmão adjacente ignora quem está antes do `#top`. Conferido
            na sonda: a grade segue com `z-index: 1`. */}
        <AtmosferaQuadrados classe="home-atmosfera" />

        {/* Fio condutor comentado a pedido: a linha lateral que costurava hero
            -> contato e acendia um nó por seção passava por cima do conteúdo e
            incomodava mais do que orientava.

            Comentado, e não removido: `src/components/ui/ScrollSpine.tsx` e o
            bloco `.spine` do `globals.css` continuam intactos, então religar é
            descomentar esta linha e o import no topo do arquivo. Se voltar,
            precisa continuar aqui — irmão direto das seções, nunca dentro de um
            wrapper animado: `position: fixed` morre sob ancestral com
            `transform`/`filter`/`clip`, e a home tem vários.

            Nada de conteúdo se perde com a saída: o fio era decorativo e
            `aria-hidden`.
        <ScrollSpine />
        */}
        <HeroCinematic />
        {/* SIS-179 — a GRADE DE MARCAS abre a página, logo depois do hero. Era
            rodapé de "Sistran em números" (mount comentado em `Metrics.tsx`), e
            subiu: as marcas que a Sistran opera são prova de credibilidade, e
            prova serve mais no começo do que no fim.

            ── ELA É O `#top + *`, E ISSO NÃO É DETALHE
            `globals.css` dá `z-index: 1` ao irmão seguinte do hero, para que ele
            SUBA por cima do hero enquanto a cena afunda. Esse irmão era o `<div>`
            do mosaico; agora é esta seção. Duas consequências, as duas conferidas:
              1. o `<BrandGrid />` tem de ficar aqui, irmão DIRETO, nunca dentro de
                 um wrapper — é a mesma razão escrita na nota do `<main>` acima;
              2. a faixa tem fundo opaco (`#f5faff`) e passa por cima do hero. Foi
                 medido que ela não corta o card antes da hora: a aresta de cima da
                 grade chega a `top: 900` (o rodapé da janela) exatamente em `t = 1`
                 do percurso do `#top`, nas duas larguras medidas — ou seja ela só
                 encosta no card quando o percurso termina.
                 SIS-198 — ERA: "o card fecha e desce (`drop`) dentro das 320svh do
                 `#top` … é exatamente o encontro que o `drop` existe para
                 produzir". O `drop` e o `scale` saíram (o card não encolhe mais), e
                 com eles esse motivo. O encontro continua no mesmo lugar, mas quem
                 o produz agora é só a geometria do percurso, medida em
                 `scripts/capturar-hero-sis198.mjs`.
            SIS-187 — ERA: "A emenda de cor com o hero é deliberadamente
            invisível: a `.hero-sheet` é `#f4f8fc` e esta seção é `#f5faff`."
            Não era invisível — as duas cores diferem por 1, 2, 3, e um delta de 3
            concentrado em UM pixel de largura cheia lê como risco. Medido por
            raster em `scripts/medir-emenda-hero-grade.mjs`.
            O estado atual: a emenda é DISSOLVIDA. A borda de cima desta seção
            recebe o `#f4f8fc` da folha do hero em degradê até o `#f5faff` dela, em
            `clamp(56px, 7svh, 96px)` — saída 2 da issue, com aval da dona do
            produto. A nota de `brand-grid.css` tem os números e registra por que as
            duas cores continuam NÃO podendo ser unificadas.
            A dissolução é só de COR e não toca em geometria: nada aqui muda a
            geometria do hero nem o empilhamento `#top + *` acima.
            SIS-198 — abaixo de 1024px essa dissolução ganhou um espelho ACIMA da
            aresta (`.marcas-grade::before`), porque sem o `drop` quem a grade
            encontra em sangria é o VÍDEO e não a folha: o degrau medido era 167. A
            nota em `brand-grid.css` tem os números dos dois lados. */}
        <BrandGrid />
        {/* ── SIS-192 · O MOSAICO SAIU DA HOME ─────────────────────────────────
            Aqui ficava o `<StackScenes variante="home" />`: a abertura "Entrega
            com Alta Performance e Comprometimento", o apoio, os quatro pilares e
            os tiles de arquitetura ao lado.

            O MOTIVO É A ESCRITA, NÃO O DESENHO. Essa abertura passou a ser a
            manchete do hero, na coluna ao lado do vídeo (`ui/HeroPitch.tsx`), e
            é a MESMA escrita — `mosaicIntroHome` e os títulos de `DIFFERENTIALS`,
            os dois arquivos intactos. Mantendo o mosaico, a home diria a mesma
            frase duas vezes, a segunda com menos força e a duas telas de rolagem
            da primeira. Os tiles e a travessia saem com ela: eram a moldura
            daquele bloco de texto, não conteúdo próprio.

            A nota antiga que ficava aqui explicava por que o bloco não precisava
            de separador acima (o hero fecha em card e já entrega a cor da seção
            de baixo) e por que o mosaico e o Método eram um componente só. A
            primeira parte continua valendo e mudou de dono: quem recebe o card
            do hero é a `<BrandGrid />` logo acima, com o `border-bottom` de
            `--line` que ela já tem. A segunda era história de
            `/transformacao-legado`, que era onde o `StackScenes` continuava vivo.

            SIS-279 — AQUELA ROTA FOI APAGADA, e com ela o único lugar onde este
            componente ainda chegava ao DOM: `StackScenes` passa a não estar
            montado em nenhuma rota (esta chamada aqui está comentada desde a
            SIS-192, e era a outra). Ele FICA no repositório, e não é descuido:
            a issue que apagou a página manda remover só o que ficasse órfão POR
            CAUSA dela, e este ficou órfão por duas — religar a home é
            descomentar este bloco e o import no topo, que é exatamente a pista
            que apagar o arquivo destruiria. Quem quiser retirá-lo de vez precisa
            de uma decisão de produto sobre a home, não desta faxina.

            Continuam intactos: `legacy/StackScenes.tsx`, os tiles, o CSS de
            `legacy/legacy.css` e os dados de `src/data/legacy.ts` — este último
            também alimenta o que a home e `/parceiros-e-implementacoes` ainda
            montam.
        <div>
          <StackScenes variante="home" />
        </div>
        */}
        {/* SIS-196 — quatro etapas em fluxo na coluna esquerda e mídia sticky
            independente na direita. Fora de wrappers animados para preservar a
            referência da viewport do sticky. */}
        <SolutionsStory />
        {/* ── Jornada de prova: UM percurso, UM relógio ──────────────────────
            Soluções, o handoff, "Sistran em números" e os parceiros eram três
            seções independentes em sequência, cada uma com o seu ScrollTrigger.
            Agora são capítulos de um percurso só: o `ProofJourney` mede a faixa
            de rolagem de cada um e entrega a fração local a quem se inscreveu.
            Nenhum capítulo tem gatilho próprio enquanto está aqui dentro — e
            todos continuam funcionando sozinhos fora daqui, porque sem a jornada
            em volta o `useJornada` devolve `dirigindo: false` e cada um recria o
            gatilho dele.

            O wrapper não pode ganhar `transform`, `filter`, `contain` nem
            `overflow`: os três primeiros matariam o `position: fixed` dos
            condutores decorativos e o último viraria scrollport, matando os
            `sticky` internos dos capítulos. A nota está também no `globals.css`,
            em `.proof-journey`. */}
        {/* SIS-196 — opção 2: Soluções fica irmã da ProofJourney. Seus passos
            precisam de altura real e sua mídia sticky precisa soltar no fim da
            própria seção; colocá-la no palco absoluto criaria dois stickies.
            A jornada passa a começar em Metrics. */}
        {/* SIS-272 (reparo 29/09) — A JORNADA VOLTOU, com o capítulo que ela dirige.
            A nota longa acima vale inteira, e as suas exigências são as de sempre: nada
            de `transform`/`filter`/`contain`/`overflow` neste wrapper, senão morrem os
            condutores `fixed` e os `sticky` dos capítulos.
            Do INVENTÁRIO que a nota cita, só um capítulo se inscreve de fato: Soluções
            virou irmã na SIS-196, o handoff e os parceiros nunca se inscreveram, e
            `Metrics` é o único `registrar()` vivo. A jornada com um capítulo é o estado
            que valia antes desta issue, e é o estado que o reparo devolve. */}
        <ProofJourney>
        {/* "Sistran em números" subiu para cá, a pedido: passa a ocupar o lugar
            que era do bloco "Resultados | evidências dos casos", logo depois do
            mosaico e de Soluções.

            Fora do wrapper da serifa, fora do `SectionReveal` e fora do
            `.section-light`: ela tem percurso de scroll próprio (seção alta +
            `sticky`) e um ancestral com `transform` faria o `sticky` perder a
            referência da viewport. Ela também desenha os próprios dois fundos —
            faixa clara em cima, palco escuro embaixo.

            Emenda de entrada: Soluções fecha em palco escuro e a faixa clara da
            Metrics abria em corte reto. Quem resolve é `.impact-emenda`, dentro
            do próprio componente — um degradê do navy na borda de cima da faixa,
            que se dissipa conforme a seção entra (`--impact-entrada`, variável
            que o único ScrollTrigger da seção já escreve). */}
        {/* SIS-272 (2ª correção de curso, 29/09) — A ESCRITA É A DOS SETE, O DESENHO É O
            DA FAIXA DE `/quem-somos`.
            A passada anterior leu «manter layout Metrics» ao pé da letra e devolveu o
            scrollytelling de sete células — cartão com moldura, ícone em caixa acima do
            número, trilho de pontos no rodapé. Errado: o pedido era o CONTEÚDO dos sete
            («850+ Membros do Grupo Sistran» … «25+ Implantações de Sinistro») no LAYOUT
            da faixa do 1988 — ícone e número na mesma linha, rótulo em caixa alta, régua
            de 1px entre as células, sem moldura e sem pontos.
            É, aliás, o que o docblock de `FaixaIndicadores.tsx` sempre descreveu como
            razão de a peça existir: «a seção Números da HOME leia como esta faixa».

            `fonte="metricas"` é o que troca os três indicadores pelos sete. A escrita sai
            de `src/data/metrics.ts` dentro do componente, e não daqui, para não haver uma
            segunda cópia dos rótulos fora de `src/data/` — ver a nota lá.

            `sobre-metricas--sete` é só ESCALA (número, ícone, recuo e a régua que muda de
            lugar quando os sete caem em 4+3 abaixo de 90rem). A identidade do desenho é a
            da faixa, sem modificador.

            `aresta={false}` continua pelo motivo geométrico de sempre: o degrau em
            `clip-path` acompanha a coluna da foto de `/quem-somos`, e aqui não há foto
            acima — os 22px vazados abririam um talho sem origem. */}
        <section id="resultados" aria-label="Sistran em números">
          <FaixaIndicadores
            aresta={false}
            fonte="metricas"
            className="sobre-metricas--avulsa sobre-metricas--sete"
          />
        </section>
        {/* SIS-272 (2ª correção de curso) — `<Metrics />` SAI DA HOME, e com ele o
            `id="resultados"` + `aria-label="Sistran em números"` que eram DELE
            (`Metrics.tsx:807` e `:818`). É por isso que a `<section>` acima os declara
            à mão: sem isso a parada `resultados` do `ScrollSpy` da rota
            (`top`/`solucoes`/`resultados`/`contato`/`social`) ficaria sem alvo. E é por
            isso que há UMA só: duas no mesmo documento seriam `id` duplicado.

            Comentado, não apagado. `Metrics.tsx` fica intacto — com o palco, os atalhos
            01–07, `[data-fio-chegada]` e o `registrar()` da jornada. Religar é
            descomentar esta linha e o import, e tirar a `<section>` acima junto (senão o
            `id` duplica).
        <Metrics />
        */}
        {/* Condutor da emenda Soluções -> Números: o fio que se dissipa à direita
            do último nó de Soluções se estende com o scroll até a boca de entrada
            da onda da Metrics, para os dois traços lerem como um só.

            Fica DEPOIS das duas seções e é irmão direto delas, pelo mesmo motivo
            do `MosaicHandoff` logo acima: o condutor é `position: fixed`, que
            morre sob ancestral com `transform`/`filter`, e a ordem na árvore é o
            que o faz pintar por cima dos dois fundos sem disputa de `z-index`.
            Decorativo e `aria-hidden` — sem ele o fio de Soluções termina onde
            terminava e a onda começa onde começava.

            COMENTADO: o condutor não tem como ficar discreto, e o motivo é
            geométrico, não de calibragem. A saída do fio de Soluções fica na
            DIREITA da tela e a boca de entrada da onda da Metrics na ESQUERDA,
            então o traço precisa cruzar a largura inteira da janela — e com
            `stroke` ciano e `drop-shadow` ele lê como uma diagonal acesa por
            cima do título "Sistran em números", que é exatamente a parte que
            ficou feia. Religar sem mudar as duas âncoras traz a diagonal de
            volta.

            Comentado, e não removido: `ui/SolutionsToMetrics.tsx` e a marca
            `[data-fio-chegada]` em `Metrics.tsx` continuam intactos.
            Se voltar, precisa continuar aqui: irmão direto das duas seções,
            nunca dentro de um wrapper animado.
        <SolutionsToMetrics />
        */}
        {/* Evidências de terceiros fecham o bloco de números: o chanfro leva o
            navy do palco da Metrics para dentro da faixa clara de parceiros.
            Marcas em `src/data/clients.ts`.

            `<MetricsStrip />` comentado a pedido: com a Metrics aqui em cima, as
            duas faixas de indicadores numéricos ficariam coladas e repetiriam a
            mesma figura retórica duas vezes seguidas — e a Metrics já traz os
            sete indicadores institucionais. Comentado, e não removido: o
            componente `src/components/legacy/MetricsStrip.tsx` e os dados em
            `src/data/legacy.ts` (`metrics`, `metricsIntro`) continuam intactos,
            então religar é descomentar a linha abaixo e o import no topo.
            <MetricsStrip />
        */}
        {/* SIS-101 — o `<NotchDivider cor="#f5faff" invertido />` e o
            `<SignalMarquee />` ficavam aqui, num wrapper de serifa editorial.
            Os dois saíram deste lugar, por motivos diferentes:

            O CHANFRO foi REMOVIDO. Ele existia para negociar a fronteira entre o
            palco da Metrics e a faixa de logos, e já vinha sendo recalibrado duas
            vezes (SIS-75 o pintava de `--deep`, para uma fronteira escuro↔escuro;
            SIS-91 o inverteu e o pintou de `#f5faff`, quando a faixa virou
            off-white). SIS-101 corta a premissa em vez de recalibrar de novo: com
            a faixa dentro da seção dos números, não há duas seções para chanfrar.
            Um chanfro precisa de dois blocos; com um só, a diagonal termina no
            vazio — que é exatamente o defeito relatado.

            A FAIXA foi MOVIDA para dentro de `Metrics.tsx`, depois do percurso do
            palco, como rodapé da seção "Escala que transforma o mercado de
            seguros." A nota longa está lá. O wrapper da serifa não foi com ela: a
            faixa é só logos, não tem uma palavra de texto.

            O componente `ui/NotchDivider.tsx` continua no projeto e é usado por
            outras páginas — só este consumo saiu. */}
        </ProofJourney>

        {/* ── NÚMEROS — A FAIXA DE TRÊS INDICADORES SAIU DAQUI (SIS-272, reparo 29/09)
            Ela ocupou este lugar por uma passada só, sob a leitura anterior desta issue
            («home com o layout da faixa 1988/150+/18»). A usuária corrigiu o curso no
            mesmo dia: o layout de Números da home é o `Metrics` de sete, logo acima.
            Não fica comentário de religar apontando para cá, porque religar isto é
            justamente o que o escopo agora proíbe («não voltar a pedir layout de 3 na
            home»). O que fica é o registro de que a peça não se perdeu: a faixa é
            `src/components/FaixaIndicadores.tsx`, viva e montada por `About.tsx` em
            `/quem-somos` — que é a rota onde ela foi pedida e onde continua intacta,
            com aresta e degrau, porque lá existem a foto e o bloco editorial de que a
            geometria dela depende.
            A `<section id="resultados" aria-label="Sistran em números">` que a envolvia
            saiu com ela, e tinha de sair: os dois atributos são do próprio `Metrics`. */}
        {/* SIS-192 — A TRAVESSIA SAIU COM O MOSAICO, e não por escolha de
            desenho: ela era o tile "Arquitetura modular e escalável" viajando até
            a foto do card 01 de Soluções, e sem mosaico não existe ponto de
            partida. Deixá-la montada não quebraria nada (o `medir()` de
            `MosaicHandoff` não encontra `[data-carrier-origem]` e chama
            `desligar()`), mas seria um efeito `fixed` medindo o DOM a cada
            rolagem para concluir que não tem o que fazer.

            CONFERIDO que Soluções abre sem ela, e é o ponto que a issue manda
            conferir: a foto do card 01 é escondida durante a viagem por
            `[data-carrier-alvo] .solution-image { opacity: var(--carrier-destino, 1) }`
            (`globals.css`). A variável só é escrita PELO handoff — sem ele o
            fallback do `var()` é `1`, e a foto nasce visível. Nenhum estado
            inicial de Soluções depende do pouso.

            Comentado, e não removido: `ui/MosaicHandoff.tsx` e as regras
            `[data-carrier-origem]` / `[data-carrier-alvo]` do `globals.css`
            continuam intactas. Religar depende de definir um novo destino.
        <MosaicHandoff />
        */}
        {/* "Sobre nós / A Sistran" saiu da home a pedido: o texto institucional
            agora vive só em `/quem-somos`, que já monta o mesmo `<About />`.
            Duplicá-lo aqui repetia a apresentação da empresa duas vezes no
            mesmo funil — e era a cópia da home que ainda dizia "150 clientes"
            em vez de 130. Componente preservado; só o consumo daqui saiu. */}
        {/* Montagem presa ao scroll. Portada da apresentação de legado junto com
            o vídeo. O wrapper existia para gravar `--font-legacy-serif`; com a
            serifa no layout raiz (TIPOGRAFIA.md) ele não carrega mais nada, e
            ficou só como o `<div>` que já delimitava a seção. Conteúdo em
            `src/data/legacy.ts` (`impactSequence`). Fora do `SectionReveal`: a
            seção já tem o próprio percurso de scroll.
            SIS-275 — a legenda (`h2` / lead / kicker) já entra por
            `[data-reveal]` + `useRevealTrigger` no sticky (SIS-197), agora com
            calibre canônico `-12%` / `0.15`. Sem wrapper `RevealScope` aqui:
            o sticky precisa continuar sem ancestral com `transform`. */}
        <div>
          <ImpactSequence />
        </div>
        {/* "Entrega com Alta Performance e Comprometimento" comentada a pedido —
            os quatro cards numerados (01 Conhecimento em Seguros, 02
            Flexibilidade, 03 Tecnologia, 04 Solidez e permanência) e a linha
            "Empresas que aderem a tecnologia em seus processos estão sempre a
            frente no mercado!". Comentada, e não removida: o componente
            `src/components/Differentials.tsx` e os dados em
            `src/data/differentials.ts` continuam intactos, então religar é
            descomentar este bloco e o import no topo do arquivo.
        <div className="section-light">
          <SectionReveal><Differentials /></SectionReveal>
        </div>
        */}
        {/* `<Metrics />` saía daqui: subiu para depois de Soluções. */}
        {/* Ordem da home do site: contato -> LinkedIn -> "Fale com a Gente!"

            Os três `SectionReveal` que envolviam Contato, Social e ContactCTA
            saíram: eles não faziam nada. O wrapper anima só os nós marcados com
            `data-reveal`, e esse atributo não existia em NENHUM lugar do projeto
            — era um invólucro inerte. Pior: as três seções já se encenam
            sozinhas, cada uma do seu jeito (o Contato pelo `--ct-surgir` do
            próprio percurso sticky, o Social e o ContactCTA por `whileInView` do
            Motion, mais a digitação do título no último). Marcar `data-reveal`
            dentro delas criaria DUAS animações de entrada disputando o mesmo
            elemento. O componente `ui/SectionReveal.tsx` fica no lugar, intacto,
            para quem precisar de reveal em bloco numa seção que não tenha o
            próprio. */}
        {/* `emenda-de-escuro` saiu daqui junto com a subida da Metrics: a classe
            existia porque "Sistran em números" fechava em palco escuro
            (`#041a33`) e o Contato abria em branco. Quem encosta no Contato
            agora é a montagem (`lp-section--cream`), que já é clara — manter o
            navy pintado na borda de cima deste bloco criaria uma faixa escura
            onde não há nada de escuro para emendar.

            A regra `.emenda-de-escuro` continua no `globals.css`, intacta, para
            a próxima emenda escuro -> claro que aparecer. */}
        {/* SIS-103 — `emenda-luminna` é o que resolve a fronteira com a montagem
            logo acima: tira o fio branco de 1px que `.section-light` pinta no topo
            (feito para bloco claro sobre navy, e aqui em cima não há navy) e traz
            o `--cream` da montagem como primeira camada do fundo, dissolvido em
            26svh. Regra e justificativa completas em `globals.css`.

            A classe é só desta emenda: se a montagem sair daqui ou deixar de ser
            a vizinha de cima, ela sai com ela. */}
        <div className="section-light emenda-luminna">
          <Contact />
        </div>
        {/* SIS-107 — a EMENDA 6 (o `#d2e5ed` do fim do contato dissolvido em
            220px) saiu da regra base de `.palco-reativo` e virou esta classe: ela
            só faz sentido onde a vizinha de cima é clara, e isso só acontece na
            home. Nas outras duas rotas que montam a Social o que vem acima é
            escuro, e lá o degradê era uma faixa clara sobre navy. */}
        <Social className="palco-emenda-de-claro" />
        {/* "Fale com a Gente!" comentado a pedido — o cartão azul com o título,
            as duas linhas ("Quer conversar com um de nossos especialistas?..." /
            "Temos uma equipe qualificada...") e o botão "Fale com a SISTRAN".
            Quem fecha a página agora é o `<Social />`, e o `<Footer />` vem logo
            depois.

            Comentado, e não removido: `src/components/ContactCTA.tsx` continua
            intacto e fecha OUTRAS OITO páginas (`/blog`, `/blog/[slug]`, `/esg`,
            `/quem-somos`, `/sistran-labs`, `/sistran-university`, `/solucoes`,
            `/solucoes/[slug]`) — todas seguem como estavam. Religar é descomentar
            a linha abaixo e o import no topo do arquivo.

            Eram nove, e `/eventos-inovacao` estava na lista: a SIS-152 comentou o
            bloco lá também, pelo mesmo motivo e do mesmo jeito. Contagem conferida
            uma a uma (`grep '<ContactCTA' src/app`): dez chamadas no repositório,
            duas comentadas — esta e a de `/eventos-inovacao`.

            A prop `motionShowcase` (digitação do título, entrada encadeada e
            grafismo técnico) só era usada aqui, então é a única coisa que sai de
            circulação junto: quem religar precisa saber que esse modo existe.
        <ContactCTA motionShowcase />
        */}
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
