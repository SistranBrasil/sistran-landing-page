import Link from 'next/link';
/* SIS-279 — a imagem da seção de introdução. `next/image` pela caixa reservada
   (`width`/`height`), que é o que evita o salto de layout; com
   `images.unoptimized` (SIS-154) o arquivo em si é servido como está. */
import Image from 'next/image';
import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import HeroVideoBackdrop from '@/components/ui/HeroVideoBackdrop';
import Accelerators from '@/components/Accelerators';
import Consulting from '@/components/Consulting';
import ContactCTA from '@/components/ContactCTA';
/* SIS-268 — o import da pilha sticky sai junto com o mount (o motivo está lá
   embaixo, na seção de Serviços); um import sem uso é erro de lint, então ele não
   pode ficar comentado ao lado do novo:

       import ServicesJourneyStage from '@/components/ui/ServicesJourneyStage';   */
import ServicosPalco from '@/components/ui/ServicosPalco';
import AtmosferaQuadrados from '@/components/ui/AtmosferaQuadrados';
import RevealScope from '@/components/motion/RevealScope';
import { LIMIAR_REVEAL, MARGEM_REVEAL } from './reveal-calibre';

export const metadata = {
  title: 'Soluções, Serviços e Consultoria · Sistran',
  description:
    'Soluções, serviços e consultoria sob medida para modernização e otimização do desempenho da sua seguradora. Beyond Technology.',
};

export default function Page() {
  return (
    /* SIS-204 — o plano de fundo da rota inteira vive no `<main>` (`solucoes-canvas`,
       `globals.css`): claro ancorado na janela + malha de pontos e linhas finas no
       `::before`. É a mecânica da `home-canvas` (SIS-199), e o comentário do bloco no
       CSS traz as medidas de antes faixa por faixa e a lista do que continua com
       superfície própria (hero, Serviços, fecho) com o motivo de cada um. */
    <PageShell classeDoMain="solucoes-canvas">
      {/* A terceira camada do fundo: quadrados arredondados translúcidos e o arco
          azul, que gradiente não desenha. Primeiro nó do `<main>` porque é fundo —
          e `position: fixed` com `z-index: -1`, então a posição na árvore não muda o
          que se vê; o que ela faz é deixar a leitura do arquivo na mesma ordem das
          camadas. ⚠️ O print 3 da conversa NÃO está no repositório: o desenho saiu da
          descrição escrita na issue, e isso está declarado na nota do componente. */}
      <AtmosferaQuadrados />

      {/* SIS-94— o vídeo cobre a abertura INTEIRA: o hero e a barra "NESTA
          PÁGINA". Elas são irmãs, e um vídeo dentro do `PageHero` deixaria a
          barra abrindo já sobre o navy, com uma emenda no meio da abertura. */}
      {/* O arquivo é o `-loop`, e nao o `-scroll`: aquele foi cortado para ser
          BUSCADO quadro a quadro e a volta dele nao fecha (o ultimo quadro esta
          tao longe do primeiro quanto um quadro qualquer do meio, medido). Este
          tem a cauda dissolvida no proprio comeco, entao o ponto de emenda fica
          abaixo do ruido de compressao entre quadros vizinhos. */}
      <HeroVideoBackdrop
        src="/videos/solucoes-hero-loop.mp4"
        poster="/videos/solucoes-hero-loop-poster.webp"
      >
      {/* SIS-279 — A CAPA FICA SÓ COM O TÍTULO.
          Antes, verbatim, era a abertura inteira do site empilhada no hero:

          | <PageHero
          |   eyebrow="Soluções, Serviços e Consultoria"
          |   title="Oferecemos SOLUÇÕES, SERVIÇOS e CONSULTORIA sob medida para modernização e otimização do desempenho da sua"
          |   highlight="Seguradora."
          |   description={<p className="text-[#A5F0FF]">Beyond Technology: é o nosso lema!</p>}
          | />

          A frase, o `highlight` e o lema NÃO foram apagados: eles descem para a
          seção de introdução logo abaixo da abertura, com imagem ao lado, e o lema
          ganha lá o tratamento manuscrito de `docs/fonte2.md`. O que muda aqui é
          QUEM é o título — e o `eyebrow` sai porque ele já dizia exatamente a frase
          que agora é o `title`: mantidos os dois, a mesma linha apareceria duas
          vezes, uma em caixa alta pequena e outra como manchete.

          A escala do `h1` acompanha sozinha, e isso é consequência do contrato do
          componente e não coincidência: `escalaDoTitulo` classifica por
          COMPRIMENTO, e o título passa de 118 caracteres (degrau da sentença,
          `text-pagehero-longo`) para 32 (degrau da frase curta,
          `text-pagehero-medio`) — a manchete cresce porque encurtou. */}
      {/* A manchete em NEGRITO e em TRÊS LINHAS, exatamente na divisão pedida:
          «Soluções,» / «Serviços» / «e Consultoria».

          `quebrasDoTitulo={[1, 2]}` e não três strings: o título continua sendo
          UMA string — a mesma de antes — e as linhas são derivadas dela por
          índice de palavra. Trocá-la por um array removeria um valor do
          `copy-lock` e acrescentaria três, ou seja deriva de CÓPIA para fazer
          mudança de LAYOUT. Ver a prop em `PageHero.tsx`.

          «e Consultoria» fica junto na terceira linha porque é a leitura que ela
          descreveu («na terceira e Consultoria»): a conjunção abre a linha, não
          fecha a segunda. */}
      <PageHero title="Soluções, Serviços e Consultoria" tituloForte quebrasDoTitulo={[1, 2]} />

      {/* Anchor nav abaixo do hero.
          Era um bloco quase invisivel (bg branco a 3%, borda a 10%, texto a 80%)
          sobre o azul da pagina. Agora tem base navy opaca, borda ciano e um
          rotulo que explica o que a barra e — sem isso os tres links pareciam
          decoracao, nao navegacao. */}
      {/* SIS-100 — a barra passa a ser SÓ de tela estreita (`xl:hidden`).

          De 1280px para cima quem navega esta página é o navegador lateral de
          seções (montado no `PageShell`), com os mesmos três destinos: manter
          as duas seria a mesma navegação duas vezes na mesma tela, e a barra é a
          que atrapalha, porque ocupa altura logo abaixo do hero.

          Abaixo de 1280 ela FICA, e é por isso que não foi removida: o navegador
          lateral não existe nessas larguras (a coluna disputaria a borda com o
          conteúdo), e sem a barra a página perderia a navegação interna
          justamente onde a rolagem é mais longa. Uma navegação por largura, nunca
          duas ao mesmo tempo — nem zero. */}
      {/* SIS-273 — escopo 1 de 3 do reveal por scroll: a barra de âncoras.
          O `RevealScope` ASSUME o `<div>` que já existia (mesmas classes), em vez
          de embrulhá-lo: um nó a mais aqui entraria entre o `container-lp` e a
          `<nav>` sem precisar.
          Quem recebe o preset é a `<nav>`, não as pílulas: elas têm
          `hover:-translate-y-0.5`, e `[data-in='true'] [data-reveal]` declara
          `transform: none` FORA de `@layer` — venceria a utilitária de hover e
          desligaria o levantar da pílula. Marcar o pai não toca nelas, porque a
          regra de estado casa só com quem tem o atributo.
          Nota de largura: acima de 1280 este escopo é `display: none`
          (`xl:hidden`, SIS-100), então o observador nunca acende ali — e não
          precisa: o que está oculto não tem entrada para orquestrar. Ao
          redimensionar para baixo de 1280 ele volta a interseccionar e acende.
          `esperarRota` porque este é o ÚNICO escopo da rota que nasce DENTRO da
          dobra: medido a 390×844, o topo da barra fica em 582px do documento, ou
          seja inteiramente visível sem rolar. É exatamente o caso que a SIS-269
          reserva para a espera — sem ela a barra animaria por trás da cortina do
          `RouteLoadGate` e a pessoa encontraria o gesto já terminado. Os outros
          dois escopos nascem abaixo da dobra e não esperam nada. */}
      <RevealScope
        className="container-lp -mt-6 mb-6 xl:hidden"
        esperarRota
        limiar={LIMIAR_REVEAL}
        margem={MARGEM_REVEAL}
        data-reveal-nome="nav-ancoras"
      >
        <nav
          data-reveal="fade-up"
          /* Nome próprio, diferente do "Seções desta página" do navegador
             lateral: as duas navs coexistem na árvore (a de cá só está oculta por
             CSS acima de 1280), e dois landmarks de navegação com o MESMO nome
             acessível são indistinguíveis na lista de landmarks do leitor de
             tela. O nome aqui é o rótulo que já está escrito na barra. */
          aria-label="Nesta página"
          className="flex flex-col gap-3 rounded-2xl border border-[#0ed8f6]/30 p-3 backdrop-blur-lg sm:flex-row sm:items-center sm:gap-4"
          style={{
            background:
              'linear-gradient(135deg, rgba(6,38,69,0.72), rgba(4,29,55,0.60))',
            boxShadow:
              '0 18px 40px -24px rgba(3,26,52,0.55), inset 0 1px 0 rgba(255,255,255,0.10)',
          }}
        >
          <span className="shrink-0 pl-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#A5F0FF]">
            Nesta página
          </span>
          <span
            aria-hidden
            className="hidden h-6 w-px shrink-0 bg-white/15 sm:block"
          />
          <div className="flex flex-wrap items-center gap-2">
            <AnchorPill href="#tecnologia-disruptiva" label="Tecnologia Disruptiva" />
            <AnchorPill href="#servicos-diferenciais" label="Serviços" />
            <AnchorPill href="#consultoria" label="Consultoria" />
          </div>
        </nav>
      </RevealScope>
      </HeroVideoBackdrop>

      {/* SIS-279 — A SEÇÃO DE INTRODUÇÃO, entre a abertura e os cards.
          Ela recebe a escrita que saiu do hero (a frase, «Seguradora.» e o lema),
          e existe como seção própria porque o pedido é justamente o que o hero não
          conseguia dar: a frase ao LADO de uma imagem. Dentro da capa não havia
          onde pôr a imagem sem disputar o vídeo de fundo.

          `section-light section-light-blue`, as mesmas classes das outras duas
          faixas claras da rota, e não uma faixa nova: nesta rota a regra
          `.solucoes-canvas .section-light` (SIS-204) já zera o fundo dessas classes
          e apaga a malha do `::before`, então o que a seção mostra é o PLANO do
          `<main>` — nenhuma cor nova entra na página, e o fundo da rota continua
          fora de escopo, como a issue manda. O que as classes trazem de fato é a
          família de overrides de texto para navy, que é o que a escrita precisa
          para ser legível sobre o plano claro.

          `RevealScope`: é o QUARTO escopo da rota, e a calibragem é a mesma dos
          outros três (`LIMIAR_REVEAL`/`MARGEM_REVEAL`, SIS-273). Sem ele o risco
          ciano do lema — animação CSS — se desenharia na montagem da página, longe
          dos olhos: a seção nasce ABAIXO da dobra (o hero tem `pagehero-entrada`,
          com altura mínima de janela), então a pessoa chegaria aqui e encontraria o
          gesto já terminado. É a lição da SIS-188, aqui por CSS em vez de GSAP: o
          traço só parte quando o escopo acende (`[data-in='true']`).
          Por isso também NÃO leva `esperarRota`: quem espera a cortina é só o
          escopo que nasce dentro da dobra (a barra de âncoras). */}
      <section id="beyond-technology" className="section-light section-light-blue section-py">
        <div className="container-lp">
          <RevealScope
            className="solucoes-intro"
            limiar={LIMIAR_REVEAL}
            margem={MARGEM_REVEAL}
            data-reveal-nome="intro-beyond-technology"
          >
            <div className="solucoes-intro-texto">
              {/* As duas frases chegam com o MESMO valor que tinham no hero
                  (`title` e `highlight`), em dois nós, para que a troca seja de
                  POSIÇÃO e não de escrita: o lock (`scripts/copy-lock.mjs`) compara
                  o conjunto por valor, e juntar as duas num nó só apagaria duas
                  entradas para criar uma terceira. */}
              <p data-reveal="fade-up" className="solucoes-intro-frase">
                Oferecemos SOLUÇÕES, SERVIÇOS e CONSULTORIA sob medida para
                modernização e otimização do desempenho da sua{' '}
                <strong className="solucoes-intro-destaque">Seguradora.</strong>
              </p>

              {/* O LEMA com o tratamento de `docs/fonte2.md`, pelos mesmos números
                  que a `.luminna-frase` já usa (Kalam com Caveat de reserva, peso
                  400, `line-height: 0.95`, `clamp(30px, 3vw, 50px)`, `-4deg` e o
                  risco ciano de ~45px desenhado da esquerda para a direita).
                  A frase manuscrita é só «Beyond Technology», como a issue pede; o
                  fecho «é o nosso lema!» fica em parágrafo normal ao lado, porque
                  ele é prosa e não assinatura.
                  SEM `<span>` em volta da frase, e isto é a armadilha desta rota:
                  `.section-light span:not(...)` pinta QUALQUER span de #0a1f44 com
                  especificidade (0,5,1) — um span aqui levaria a cor errada e a
                  única saída seria `!important`. Com a cor no próprio `<p>`, basta
                  vencer `.section-light p`, e é o que `.solucoes-canvas` faz.
                  A ROTAÇÃO é `rotate` e não `transform` pelo mesmo motivo da
                  `.luminna-frase`: `data-reveal` é o dono do `transform` deste nó. */}
              <p
                data-reveal="fade-up"
                style={{ '--reveal-i': 1 } as React.CSSProperties}
                className="solucoes-lema"
              >
                Beyond Technology
                <svg aria-hidden className="solucoes-lema-traco" viewBox="0 0 45 8">
                  <line
                    className="solucoes-lema-risco"
                    pathLength="1"
                    x1="1.5"
                    y1="6.4"
                    x2="43.5"
                    y2="1.6"
                  />
                </svg>
              </p>
              <p
                data-reveal="fade-up"
                style={{ '--reveal-i': 2 } as React.CSSProperties}
                className="solucoes-lema-fecho"
              >
                é o nosso lema!
              </p>
            </div>

            {/* A IMAGEM AO LADO, em arranjo próprio e não em card: a arte é uma
                placa inclinada com uma moldura ciano deslocada por trás, que é o
                oposto do cartão genérico (caixa branca, borda fina, sombra igual à
                dos vizinhos) — e a inclinação conversa com o `-4deg` do manuscrito.
                `/images/consultoria.png` é a arte declarada: já estava no
                repositório, não tinha nenhum consumidor em `src/` (conferido) e não
                traz texto embutido — nada para legendar errado nem para traduzir.
                `width`/`height` são as dimensões INTRÍNSECAS do arquivo (1672×941);
                com `images.unoptimized` (SIS-154) elas só reservam a caixa e evitam
                o salto de layout, o arquivo é servido como está. */}
            <figure
              data-reveal="fade-up"
              style={{ '--reveal-i': 1 } as React.CSSProperties}
              className="solucoes-intro-arte"
            >
              <Image
                src="/images/consultoria.png"
                alt="Executivo apoiando um laço infinito de vidro com uma malha de dados em azul, sobre uma mesa de escritório clara."
                width={1672}
                height={941}
                sizes="(min-width: 64rem) 46vw, 92vw"
                className="solucoes-intro-arte-img"
              />
            </figure>
          </RevealScope>
        </div>
      </section>

      {/* 1. Tecnologia Disruptiva — SIS-93: passou a usar o mesmo fundo azul
             claro da Consultoria (`section-light section-light-blue`). A
             alternância da página deixou de ser escuro→escuro→claro→escuro e
             virou claro→escuro→claro→escuro→escuro: cada bloco claro fica
             cercado por escuros, que é a leitura que a página já tinha na
             Consultoria. */}
      <Accelerators />

      {/* 2. Serviços — no site esta secao tem sobretitulo "Diferenciais",
             titulo "Serviços", dois paragrafos e os mesmos 4 cards da home,
             fechando com o botao "Quero um serviço exclusivo". */}
      {/* SIS-76 — grade técnica, mesma malha ancorada na janela das demais
          seções escuras do site. Ver a nota em `.grade-tecnica` no globals.css. */}
      {/* `overflow-x-clip`, e NÃO `overflow-hidden`: a pilha de serviços aqui
          dentro depende de `position: sticky`, e `overflow: hidden` em qualquer
          ancestral cria um contêiner de rolagem — o `sticky` passaria a se
          prender a ele em vez de à janela, o que na prática o desliga. `clip`
          num eixo só recorta sem criar esse contêiner, e continua contendo a
          `.grade-tecnica`, que é o motivo do recorte. */}
      {/* SIS-204 — `solucoes-palco-servicos`: esta é a ÚNICA faixa da rota que não
          pintava nada e mostrava o azul do `body`. Com o plano claro no `<main>`, o
          que ela via por baixo virou claro — e o texto daqui é branco (h2 a 4,19:1
          medido na janela — baixo, e assim já era: o palco declarado devolve o mesmo
          pixel do emprestado, e re-tingir a seção é conteúdo, fora de escopo). Então ela passa a DECLARAR o palco escuro que tomava emprestado,
          com o mesmo valor e o mesmo ancoramento na janela. A classe também traz o
          `isolation: isolate` de que a `.grade-tecnica` abaixo depende para não cair
          atrás do fundo novo — o porquê está no bloco do CSS. */}
      {/* SIS-268 — A SEÇÃO PASSOU A SER A MOCK `public/imagensexemplo/imagemserviços.png`,
          seguindo `docs/servicos.md`: vídeo de fundo full-bleed, carimbo no lugar da
          tag textual, colunas 42/58 e grade 2×2 de cards claros com as fotos
          `/images/solucoes/1.png`–`4.png`. Tudo o que é superfície vive em
          `src/components/ui/servicos-palco.css`.

          O `section-py` SAIU DA SEÇÃO e virou `padding` do `.svc-palco`: a mídia do
          vídeo é `inset: 0` sobre o palco, então respiração vertical na seção
          deixaria uma faixa sem take em cima e embaixo do vídeo.

          A `.grade-tecnica` SAIU, e o motivo é de empilhamento, não de gosto — a
          linha era:

              <div aria-hidden className="grade-tecnica" />

          Ela é `z-index: -1` e só se vê graças ao `isolation: isolate` que
          `.solucoes-palco-servicos` declara (SIS-204). Com o vídeo de fundo em
          `z-index: 0` dentro do mesmo contexto, a malha ficaria ATRÁS do vídeo: nó
          que pinta e ninguém vê. O que o fundo desta faixa é agora é o take mais o
          véu navy — e a malha continua existindo em todas as outras seções escuras
          do site, que não têm vídeo.

          `.solucoes-palco-servicos` FICA, e por dois motivos: é a base navy que
          aparece enquanto o arquivo do vídeo não chega (e no movimento reduzido,
          onde o laço não toca), e é ela que devolve a esta faixa o mesmo pixel
          escuro que a SIS-204 mediu quando o palco era emprestado do `body`.
          `overflow-x-clip` também fica — nunca `overflow-hidden`: a rota tem
          camadas ancoradas na janela e um contêiner de rolagem as prenderia aqui. */}
      <section
        id="servicos-diferenciais"
        className="relative overflow-x-clip solucoes-palco-servicos"
      >
        <ServicosPalco
          titulo="Serviços"
          /* A escrita continua morando na PÁGINA, e não no componente: é escrita da
             página, e `scripts/copy-lock.mjs` compara por valor — passá-la por prop
             não mexe no conteúdo travado. O segundo parágrafo é o de
             `docs/servicos.md`, que a issue declara como fonte, e ele difere do que
             estava aqui («acumulamos experiências e lições aprendidas em mais de 30
             implementações»): a frase do doc é a da mock. */
          paragrafos={[
            'Dedicada ao mercado segurador, com experiência em todos os ramos, a Sistran atua como integradora de sistemas para clientes com grandes carteiras.',
            'Somos uma empresa de TI 100% focada no segmento de Seguros no Brasil, com experiência acumulada em mais de 30 implementações de ERP bem-sucedidas.',
          ]}
          indicadores={[
            { valor: '30+', legenda: 'implementações' },
            { valor: '100%', legenda: 'Seguros' },
          ]}
          /* O CTA ENTROU NA COLUNA, logo abaixo dos indicadores «30+
             implementações / 100% Seguros» — pedido em chat, contra a captura em
             que ele caía muito abaixo dos números. Ele estava no
             `<div className="container-lp pb-20 md:pb-24">` logo abaixo desta
             chamada (que segue existindo, comentado, com o motivo).

             Por que só mover não bastava e virou SLOT: o palco tem
             `min-height: 100vh` e `align-items: center`, então entre o fim dos
             indicadores e o fim da seção há a metade de baixo do palco mais o
             `padding` dele — ou seja o botão não estava com margem grande, estava
             em OUTRO bloco. Para ficar «logo abaixo dos números» ele tem de estar
             no fluxo da mesma coluna, e a coluna é do componente.

             O `RevealScope` próprio SAIU com ele: dentro da coluna o botão entra
             no escopo `servicos-abertura`, que é o dos números que ele acompanha.
             O `data-reveal` do nó continua vivendo no invólucro (o `.svc-palco-rodape`
             do componente) e NUNCA no `.btn-primary` — a lição da SIS-271, que o
             comentário do bloco comentado abaixo registra por inteiro. */
          rodape={
            <Link href="/contato" className="btn-primary inline-flex">
              Quero um serviço exclusivo
            </Link>
          }
        />

        {/* ══════════════════════════════════════════════════════════════════════
            A FAIXA QUE FECHAVA A SEÇÃO SAIU DE CENA, porque o CTA subiu para dentro
            da coluna de texto (ver a prop `rodape` acima). Era, verbatim:

                <div className="container-lp pb-20 md:pb-24">
                  <RevealScope
                    limiar={LIMIAR_REVEAL}
                    margem={MARGEM_REVEAL}
                    data-reveal-nome="servicos-cta"
                  >
                    <span data-reveal="fade-up" className="mt-10 block">
                      <Link href="/contato" className="btn-primary inline-flex">
                        Quero um serviço exclusivo
                      </Link>
                    </span>
                  </RevealScope>
                </div>

            O `mt-10` e o `pb-20 md:pb-24` não vieram junto de propósito: eles
            mediam a distância até o FIM da seção, e agora o respiro é o `gap` da
            coluna (`.svc-palco-abertura`) mais o `padding` do palco.

            O escopo `servicos-cta` (escopo 3 de 3 da SIS-273) deixou de existir
            como escopo próprio — o botão entrou no `servicos-abertura`. A LIÇÃO que
            ele carregava continua valendo e é a razão de o `rodape` ser embrulhado
            pelo componente: o `data-reveal` NUNCA vai no `.btn-primary`. O botão
            tem `:hover { transform: translateY(-2px) }` em `@layer components`, e
            `[data-in='true'] [data-reveal] { transform: none }` está FORA de
            qualquer camada — regra sem camada vence regra em camada seja qual for a
            especificidade, então o botão marcado perderia o levantar do hover para
            sempre (SIS-271). O invólucro leva a marca, o botão fica intacto.

            Do bloco antigo saíram também duas notas de conteúdo, que ficam
            registradas aqui: no site original cada card levava a uma página de
            serviço com Lorem Ipsum em inglês e nenhuma delas foi recriada — o botão
            aponta para o contato, que é o destino real da intenção.

            ── E A HISTÓRIA MAIS ANTIGA DESTA FAIXA (SIS-268) ──
            A PILHA STICKY SAIU DE CENA. A linha era, verbatim:

                  <ServicesJourneyStage
                    eyebrow="Diferenciais"
                    title="Serviços"
                    paragraphs={[…os dois parágrafos…]}
                  />

              …e o componente CONTINUA em `src/components/ui/ServicesJourneyStage.tsx`,
              sem outro consumidor: ele é o layout portado da seção "Transição visual |
              do sinal ao entendimento" da apresentação de Transformação de Legado, e
              apagá-lo não é o pedido desta issue — o pedido é que esta seção passe a
              ser a mock.

              Por que ele não podia ficar: a mock quer o vídeo como FUNDO da seção
              inteira (nele o vídeo é uma figura presa numa coluna), os quatro cards
              visíveis ao mesmo tempo numa grade 2×2 (nele são uma pilha percorrida
              por rolagem) e a issue PROÍBE nominalmente os ordinais 01–04, que são a
              espinha da pilha. Não é ajuste de props, é outro layout.

              O que o substitui é o `<ServicosPalco>` logo acima, e a abertura
              (carimbo / «Serviços» / os dois parágrafos / os indicadores) foi com
            ele: na mock ela é a coluna de 42%, ao lado da grade.
            ══════════════════════════════════════════════════════════════════════ */}
      </section>

      {/* 3. Consultoria — azul claro (a classe vive no proprio componente) e,
             desde a SIS-93, a MESMA classe usada em Tecnologia Disruptiva. */}
      <Consulting />

      {/* 4. CTA final */}
      {/* SIS-286 — O FECHO PASSA A SER O DE `/esg`, e a mudança são PROPS: linha
          anterior, para o registro, `<ContactCTA />`. Nada de markup novo —
          `ContactCTA` já bifurca para `ContactCTAReferencia` (vidro + fio ciano +
          blob/selo + botão com círculo) quando `layoutReferencia` está ligada, e
          `contatoNoModal` é a porta que faz o botão abrir o `ContactModal` em vez
          de navegar para `/#contato`. Duplicar a árvore aqui é o que o item 3 da
          issue proíbe. É o terceiro mount da referência, depois de `/esg`
          (SIS-253) e `/sistran-university` (SIS-283).

          A ESCRITA NÃO VEM POR PROP: título e parágrafo são os PADRÃO do
          componente, que é o que o `copy-lock` guarda, e «Fale com a SISTRAN» é
          literal do arquivo da referência. Repetir o texto aqui criaria uma
          segunda fonte da verdade para a mesma frase — e o item 4 pede copy
          intacta.

          `revelar` ENTRA AQUI, ao contrário do primeiro mount da University: esta
          rota TEM calibre próprio (`./reveal-calibre.ts`, da SIS-273) e o resto da
          página revela ao rolar. Sem a prop, o bloco da referência entra sem
          orquestração nenhuma — o cartão navy de antes ao menos tinha o
          `whileInView` do `vFadeUp`, então deixar `revelar` de fora TIRARIA
          movimento desta rota em vez de manter. Os números não são inventados
          aqui: são os mesmos que os outros blocos desta página já usam.

          `className` NÃO seria aproveitado nem se eu passasse: o ramo da
          referência não o encaminha (`ContactCTA.tsx:172`), de propósito, porque
          `.cta-ref` traz o próprio campo claro e o `box-shadow` de 54px da SIS-93.
          E a emenda aqui é o caso de `/sistran-labs`, não o de `/esg`: a seção de
          cima é `Consulting`, que é `section-light section-light-blue` — claro
          contra claro, com as duas rampas na mesma cor de base. O número está
          medido no comentário da issue.

          `haloClaro`, `reativo` e `motionShowcase` seguem desligados (nunca
          estiveram ligados nesta rota): os três decoram a SUPERFÍCIE NAVY que a
          referência substitui. */}
      <ContactCTA
        layoutReferencia
        contatoNoModal
        revelar={{ limiar: LIMIAR_REVEAL, margem: MARGEM_REVEAL }}
      />
    </PageShell>
  );
}

function AnchorPill({ href, label }: { href: string; label: string }) {
  return (
    /* Pill com fundo proprio: o estado de repouso ja precisa ser legivel, o
       hover so intensifica. Antes o link so existia visualmente no hover. */
    <a
      href={href}
      className="group inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/[0.07] px-4 py-2.5 text-sm min-h-[44px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-[#0ed8f6]/60 hover:bg-[#0ed8f6]/12"
    >
      <span
        className="h-1.5 w-1.5 rounded-full bg-[#0ed8f6] transition-transform duration-300 group-hover:scale-150"
        style={{ boxShadow: '0 0 8px rgba(14,216,246,0.9)' }}
      />
      {label}
    </a>
  );
}
