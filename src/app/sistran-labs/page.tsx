import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
/* SIS-291 (2ª volta) — `BarChart3`, `Bot` e `FileText` saíram: os três cartões
   passaram a usar os PNGs de `public/images/sistran-labs/icones/`, que a issue
   nomeia um por um. `Mail` FICA, e fica só para o botão da barra (o motivo está
   escrito lá embaixo, na barra de contato). */
import { ArrowUpRight, Mail } from 'lucide-react';
import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import ContactCTA from '@/components/ContactCTA';
import HeroImageBackdrop from '@/components/ui/HeroImageBackdrop';
import RevealScope from '@/components/motion/RevealScope';
import CarimboBatida from '@/components/CarimboBatida';
import { LIMIAR_REVEAL, MARGEM_REVEAL } from './reveal-calibre';
import { CONTACT_EMAIL } from '@/data/contact';
import { ACCELERATORS } from '@/data/accelerators';
/* SIS-292 — `import { getIcon } from '@/lib/icons';` saiu com a vitrine de sete
   cartões de «Principais Soluções»: era o único consumidor dele nesta rota. */

export const metadata = {
  title: 'Sistran Labs · Sistran',
};

/* SIS-291 — OS QUATRO PRODUTOS, agora em DUAS listas porque a referência lhes dá
   dois papéis: o Guru é o HERÓI da esquerda (cápsula com arte, letreiro grande,
   lead e botão) e os outros três são os cartões empilhados da direita. Uma lista
   só de quatro obrigaria a marcação a perguntar «este é o primeiro?» para escolher
   a forma — e é a REFERÊNCIA que decide isso, não a ordem do array.

   A ESCRITA MUDOU, e mudou porque a issue manda: «copy: alinhar aos literais da
   PNG e atualizar `copy-lock.json` onde a redação mudar». Fica registrado o que
   estava escrito antes (a redação da SIS-122, telegráfica, com as tecnologias
   entre parênteses):
     'Guru de Seguros'   → 'AI, Comandos de voz, Assistente Conversacional (Alexa).'
     'Predição de Churn' → 'Data Science, com ações de Retenção e aumento da renovação.'
     'Fast Claims'       → 'Robots (linguagem natural) para otimizar Regulação.'
     'Smart Miner'       → 'AI na leitura e tipificação de documentos (inclusive não
                            padrão/formatados).'
   O «(Alexa)» sai porque a referência não o traz e nomear um assistente de
   terceiro numa vitrine própria é afirmação sobre integração viva — se ela existe,
   quem responde pelo conteúdo a devolve; inventá-la de volta aqui, não. */
const GURU = {
  name: 'Guru de Seguros',
  description: 'AI, comandos de voz e assistente conversacional.',
} as const;

const SOLUCOES = [
  {
    name: 'Predição de Churn',
    description: 'Data Science com ações de retenção e aumento da renovação.',
    /* SIS-291 (2ª volta) — O ÍCONE É O PNG ENTREGUE, não mais o `BarChart3` do
       lucide. A issue nomeia arquivo por arquivo (`icones/churn.png`,
       `fast.png`, `smart.png`) e diz «não lucide genérico».
       O que se perde, e fica registrado porque era o argumento da 1ª volta: o
       lucide herdava `currentColor`, então a plaqueta trocava a cor do traço no
       hover junto com o fundo. Um raster não herda cor nenhuma — os PNGs já vêm
       com o degradê azul da marca, e o hover da plaqueta continua existindo no
       FUNDO dela (`#eaf4fd` → `#dcedfb`, regra do `globals.css`).
       `icone` aponta para o WEBP derivado, e `w`/`h` são as dimensões dele
       (128×128, quadrado comum aos quatro): com `images.unoptimized` o
       `next/image` entrega o arquivo cru, então par divergente aqui é CLS.
       Ver o docblock de `scripts/gerar-icones-solucoes-sis291.mjs` para o motivo
       do recorte (a tinta ocupava frações diferentes da tela em cada PNG). */
    icone: '/images/sistran-labs/icones/churn.webp',
  },
  {
    name: 'Fast Claims',
    description: 'Robôs em linguagem natural para otimizar a regulação.',
    icone: '/images/sistran-labs/icones/fast.webp',
  },
  {
    name: 'Smart Miner',
    description: 'AI na leitura e tipificação de documentos, inclusive não padronizados.',
    icone: '/images/sistran-labs/icones/smart.webp',
  },
] as const;

/* SIS-291 — OS QUATRO VOLTAM A APARECER AQUI, e isto TROCA a saída que a SIS-122
   havia escolhido. O pedido nomeia os quatro numa tabela, e o item 1 diz por
   extenso «não deixar Guru/Smart Miner sumirem desta grade»: o filtro que os
   tirava é incompatível com a issue nova, então ele sai.
   Das DUAS saídas que a SIS-291 oferece, foi tomada a segunda — «manter link
   para /solucoes/… nos que têm página». O motivo é que ela desfaz o defeito que a
   SIS-122 mediu sem apagar nenhum dos quatro: o defeito de lá não era o nome
   aparecer duas vezes, era aparecer duas vezes SEM RELAÇÃO — uma cópia sem link e
   com uma descrição, outra clicável e com outra descrição, e nada dizendo ao
   leitor que eram o mesmo produto. Com o link, as duas menções passam a apontar
   para o MESMO destino: esta seção é a história («já desenvolvemos»), a vitrine
   de baixo é o catálogo, e quem reconhece o nome na primeira chega à página pela
   primeira. Não há terceira descrição inventada — cada seção continua com o texto
   travado que já tinha.
   O CASAMENTO CONTINUA DERIVADO de `ACCELERATORS` e por NOME, exatamente como o
   filtro anterior fazia, e pelo mesmo motivo: `SOLUCOES` não guarda slug, e uma
   lista curta escrita à mão aqui deixaria de acompanhar o dado no dia em que um
   dos quatro ganhasse (ou perdesse) página. O que era um `Set` de nomes virou um
   `Map` nome → slug, porque agora o slug é usado, não só a existência dele.
   Grafia conferida em `src/data/accelerators.ts` ('Guru de Seguros' →
   `guru-de-seguros`, 'Smart Miner' → `smart-miner'); nome que divergir por um
   acento não quebra nada — o cartão só deixa de ser link, e volta a ser o que era
   antes desta issue. É por isso que a leitura é por `Map.get` e não por índice.

   O filtro da SIS-122, que fica registrado porque a decisão dele foi revertida e
   não corrigida:
     const NOMES_COM_PAGINA_PROPRIA = new Set(ACCELERATORS.map((a) => a.name));
     const SOLUCOES_SO_AQUI = SOLUCOES.filter((s) => !NOMES_COM_PAGINA_PROPRIA.has(s.name)); */
const SLUG_POR_NOME = new Map(ACCELERATORS.map((a) => [a.name, a.id] as const));

/* SIS-293 — as três fotos do ambiente, na ordem em que a issue as lista.
   A lista mora AQUI e não em `src/data/`: são três itens de UMA seção de UMA
   rota, sem segundo consumidor, e `src/data/` é onde o `copy-lock` trava TODOS os
   literais de um arquivo — mover os `alt` para lá não os protegeria mais do que o
   `PROPS_DE_TEXTO` do extrator já protege daqui (`alt` está na lista declarada).

   `w`/`h` são as dimensões dos WEBP DERIVADOS (1600px de largura, gerados por
   `scripts/gerar-fotos-ambiente-sis293.mjs`), não as dos JPGs entregues: o par
   existe para reservar a proporção antes de a imagem carregar, e a proporção é a
   do arquivo que o navegador vai buscar. Os JPGs de 2383 a 3352px continuam no
   repo como matriz — o motivo do derivado está no docblock do script (com
   `images.unoptimized` o `next/image` entrega o arquivo cru, e os três originais
   somam 5,7 MiB).

   O `lado` é o preset lateral do `globals.css`, e o valor diz DE ONDE a foto vem
   (convenção do §2.1 de `docs/scroll.md`). Ele está no dado, e não calculado de
   `i % 2`, porque a ordem pedida (esquerda, direita, esquerda) é uma ESCOLHA de
   composição sobre estas três fotos — a do time, que é a mais cheia, é a que
   encosta à direita — e não uma regra de paridade que valeria para uma quarta
   foto qualquer.

   Os `alt` DESCREVEM O QUADRO, como a issue pede, e não repetem o nome do
   arquivo: são as três únicas frases novas de escrita desta issue, junto do
   título `sr-only` e do rótulo do ScrollSpy. Nenhum deles é texto de marketing —
   é a descrição do que está na foto, que é o que `alt` é. */
/* SIS-294 — OS TRÊS `lado` INVERTERAM, e é só isso que mudou aqui: os arquivos,
   os `alt` e as dimensões nativas são os mesmos que a SIS-293 mediu.
   O preset diz DE ONDE a peça vem (a convenção está escrita no bloco dos presets
   laterais do `globals.css`), então ele tem de acompanhar o lado em que a foto
   PASSA A VIVER. Na galeria antiga as fotos ficavam encostadas em 1 esquerda,
   2 direita, 3 esquerda; no zigzag desta issue a foto é a coluna que sobra do
   parágrafo — 1 direita, 2 esquerda, 3 direita. Inverter o preset é o que mantém
   a regra da SIS-293 de «o movimento termina no lado em que a composição já
   estava»; deixar os valores antigos faria cada foto entrar cruzando a fileira,
   passando por cima do próprio texto. */
const AMBIENTE = [
  {
    src: '/images/sistran-labs/1-aba-sistran-labs.webp',
    alt: 'Fachada da Sistran: prédio branco com vitrines espelhadas e o letreiro azul da marca com a assinatura Beyond Technology.',
    lado: 'fade-right',
    w: 1600,
    h: 976,
  },
  {
    src: '/images/sistran-labs/2-aba-sistran-labs.webp',
    alt: 'O time da Sistran reunido na escada do prédio: dezenas de pessoas de crachá, em camisetas azuis, posando para a foto.',
    lado: 'fade-left',
    w: 1600,
    h: 969,
  },
  {
    src: '/images/sistran-labs/3-aba-sistran-labs.webp',
    alt: 'Sala de trabalho do Sistran Labs: bancadas compartilhadas com monitores e notebooks, a equipe em atividade e a marca Sistran na parede ao fundo.',
    lado: 'fade-right',
    w: 1600,
    h: 964,
  },
] as const;

/* Toda a escrita desta pagina vem de /sistran-labs/.
   Fonte: .claude/conteudo-site/02-sistran-labs.md

   SIS-80 — "Principais Soluções Sistran Labs" entra. O comentário anterior aqui
   dizia que a seção não fora recriada porque no site ela é só um PNG sem alt e
   sem escrita, e isso continua verdade: o que ela lista não estava perdido, mas
   sim publicado em OUTRO lugar do site, como texto, na vitrine de aceleradores
   de `/solucoes-servicos-e-consultoria/` — que é o que `ACCELERATORS` guarda.
   Então a seção não inventa conteúdo: ela nomeia em texto os sete produtos que a
   imagem mostrava como logos, e cada um leva à sua própria página, que já existe
   em `/solucoes/[slug]`. É a correção do defeito de origem (nome de produto só
   dentro de imagem, invisível para busca e para leitor de tela), não um enfeite.

   Sem `Accelerators.tsx`, o componente que já desenha esses cards: a escrita dele
   é a de `/solucoes` ("Tecnologia Disruptiva" / "Conheça nossos aceleradores") e
   trazê-la para cá colaria o cabeçalho de outra página no meio desta. */
export default function Page() {
  return (
    <PageShell>
      {/* SIS-122 — a abertura ficou SEM `description`, e não com uma descrição
          encurtada. Os três parágrafos desceram para a seção `#labs-o-que-e`,
          logo abaixo, PALAVRA POR PALAVRA: resumir aqui exigiria cortar no meio
          de frase travada em `copy-lock.json`, e repetir a primeira frase nos
          dois lugares publicaria o mesmo texto duas vezes — que é o defeito do
          item 1 desta issue, só com escrita em vez de produto.
          O degrau de fonte do título NÃO muda: `PageHero` mede
          `title + highlight` (37 caracteres, faixa `<= 64`) e nenhum dos dois
          mudou de tamanho — "Laboratório de INOVAÇÃO" e "Laboratório de
          Inovação" têm os mesmos 23 caracteres.
          A altura da abertura também não desaba: `pagehero-entrada` tem
          `min-height` própria (o comentário está em `PageHero.tsx`), e era
          justamente esta rota que ocupava 104% da janela a 1440 — o caso extremo
          que a normalização existe para conter. */}
      {/* SIS-227 — a arte é decorativa: o h1 já identifica o Labs e
          "Technology First!" permanece apenas desenhado na capa, sem duplicação
          na árvore acessível. O recorte responsivo e o véu ficam escopados em
          `.hero-backdrop--labs`, pois a área livre e escura está à esquerda e o
          S/logo com sua escrita precisam permanecer visíveis à direita. */}
      <HeroImageBackdrop
        src="/images/sistran-labs/labs-hero.webp"
        alt=""
        className="hero-backdrop--labs"
      >
        <PageHero
          title="Sistran Labs:"
          /* Caixa mista, das duas saídas que a issue oferece para o item 3 ("passar
             para CSS, ou reescrever em caixa mista"): aqui `highlight` é `string`
             tipada, não nó, então não há onde pendurar um `uppercase` sem trocar a
             forma da prop que as outras treze rotas usam. Nos dois trechos do corpo,
             onde é JSX, foi feita a outra saída — o texto volta a caixa mista e o
             `uppercase` vai para a classe, então a tela continua igual. */
          highlight="Laboratório de Inovação"
          /* SIS-216 — a manchete da capa em PESO REAL. `tituloForte` e não uma
             classe escrita aqui: o `h1` é montado dentro do `PageHero` e a prop
             é a porta que a SIS-281 abriu justamente para isso (docblock lá).
             Ela cobre o par INTEIRO — `title` e `highlight` são o mesmo `<h1>`,
             então «Sistran Labs: Laboratório de Inovação» engrossa junto, que é
             o que o pedido nomeia. Peso 700 REAL: `layout.tsx` carrega
             400/500/600/700 na Geist Sans, e `html` declara
             `font-synthesis: none` — sem o corte, este `font-bold` não
             engrossaria nada e o CSS mentiria em silêncio.
             As outras treze rotas seguem em 400: a prop é opt-in, e o desvio
             contra a normalização da SIS-155 vale só onde foi pedido. */
          tituloForte
        />
      </HeroImageBackdrop>

      {/* `id` novo, registrado em `src/data/pageSections.ts` na mesma leva: o
          `ui/ScrollSpy` desta rota lista as âncoras dali, e seção com conteúdo
          fora do mapa é seção que o navegador lateral não alcança. */}
      {/* SIS-290 — A INTRO SAI DO NAVY E VAI PARA A FOLHA CLARA, a mesma
          superfície de `#university-programa`. Linha anterior, para o registro:
          `<section aria-labelledby="labs-o-que-e" className="section-py">`.

          A ORDEM DAS CLASSES é a que a rota já usa em «Principais Soluções»
          (`labs-principais section-py section-light section-light-blue`): nome da
          seção, ritmo, superfície. E aqui é `section-light` PURO, sem
          `section-light-blue` — a issue manda igualar O PROGRAMA, que é a folha
          quase branca do `--fundo-claro-secao`; a variante azul é a de baixo, e
          usá-la aqui deixaria as duas seções claras da rota com a MESMA cor,
          apagando a separação entre elas.

          `labs-intro` carrega uma linha só, a sangria da SIS-93, e o motivo está
          no `globals.css`: este bloco tem DUAS fronteiras com navy (o hero acima
          e os cards abaixo), não uma. */}
      <section
        aria-labelledby="labs-o-que-e"
        className="labs-intro section-py section-light"
      >
        {/* AJUSTE DE PEDIDO — os «quadradinhos» da `/sistran-university` no fundo
            desta seção. NÓ, e não pseudo-elemento: os dois de `.section-light` já
            estão ocupados (grade técnica e pontilhado), que é a mesma razão pela
            qual a referência (`sistran-university/page.tsx`) também usa um
            `<span>`. `aria-hidden` porque é grafismo: não há informação aqui, e
            sem isso o leitor de tela anuncia um nó vazio antes do conteúdo.
            Irmão ANTES do `container-lp`, com o par `z-index` 0/1 escrito no CSS. */}
        <span aria-hidden className="labs-intro-acentos" />
        <div className="container-lp">
          {/* `sr-only`: o `aria-labelledby` precisa de um título de verdade para
              apontar, e um `<h2>` visível aqui abriria um capítulo que a escrita
              do site não tem — o primeiro parágrafo JÁ apresenta o Labs, e o
              título visível da rota é o `<h1>` logo acima. */}
          <h2 id="labs-o-que-e" className="sr-only">
            O Sistran Labs
          </h2>
          {/* SIS-290 — `text-white/85` SAIU, e não foi trocado por outra cor.
              Linha anterior: `className="max-w-2xl space-y-4 text-lg
              leading-relaxed text-white/85"`.

              Sem cor nenhuma na marcação é o que a referência faz: os parágrafos
              do O PROGRAMA também não declaram cor, e quem pinta é
              `.section-light p` (navy `#0a1f44`, medido 14,92:1 lá). Escrever
              `text-ink` aqui daria o MESMO pixel por um segundo caminho — e um
              dia em que o token do fundo claro mudar, o override acompanha e a
              classe escrita à mão não.

              Deixar `text-white/85` também «funcionaria», porque
              `.section-light [class*="text-white"]` intercepta a família inteira
              — mas seria uma cor branca declarada e revogada no mesmo elemento, e
              a próxima pessoa a ler tem de descobrir o override para saber de que
              cor é o texto. Os dois `<span class="uppercase">` de dentro não
              precisam de nada: são nós de texto sem cor própria, e o contraste
              deles está medido no comentário da issue. */}
          {/* SIS-294 — A INTRO E AS FOTOS VIRAM UMA COISA SÓ: cada parágrafo ao
              lado da sua foto, lado alternando. Linha anterior deste nó, para o
              registro: `<div className="max-w-2xl space-y-4 text-lg
              leading-relaxed">`, com os três `<p>` empilhados dentro.

              `max-w-2xl` SAIU e não foi substituído por outro teto: quem limita a
              medida da linha agora é a COLUNA da fileira (~48% do
              `container-lp`, ≈530px a 1440 — dentro da faixa de 45–75
              caracteres). Manter o `max-w-2xl` (42rem = 672px) aqui seria um teto
              maior que a própria coluna, ou seja um número que nunca morde.
              `space-y-4` também saiu: o respiro entre os blocos passou a ser o
              `gap` da pilha, porque agora o que se separa é fileira de fileira e
              não parágrafo de parágrafo.

              UM `RevealScope` POR FILEIRA, e não um para a seção inteira: é o
              mesmo argumento medido da SIS-293, que esta seção herda junto com as
              fotos — a pilha passa de 2000px de altura a 1440, e um escopo único
              acenderia a terceira fileira mais de uma tela antes de ela chegar.
              A cadência é a da rolagem. */}
          <div className="labs-intro-pilha">
            <RevealScope
              className="labs-intro-fileira"
              limiar={LIMIAR_REVEAL}
              margem={MARGEM_REVEAL}
              data-reveal-nome="labs-intro-1"
            >
              {/* O TEXTO ENTRA SUBINDO, e é a única troca deliberada em relação
                  ao «reveal lateral por fileira» que a issue escreve. O gesto
                  lateral da fileira é o da FOTO, que é quem alterna de lado e
                  quem desenha o zigzag; o parágrafo sobe.
                  A razão é medida, não de gosto: `--motion-distance-md` (48px)
                  foi calibrado na SIS-293 para uma foto de ~760px de largura, e
                  48px numa coluna de texto de ~530px é 9% da medida da linha
                  atravessando o EIXO DE LEITURA — o olho que já está buscando o
                  começo da linha recebe o texto deslizando para o lado. Vertical
                  não cruza a leitura, e `fade-up` é o preset que a casa usa para
                  bloco de texto em todas as outras seções da rota.
                  `--reveal-i: 1` põe o parágrafo um degrau depois da foto no
                  mesmo escopo: a foto abre a fileira, o texto assenta. */}
              <div
                className="labs-intro-texto text-lg leading-relaxed"
                data-reveal="fade-up"
                style={{ '--reveal-i': 1 } as CSSProperties}
              >
                <p>
                  Formado por uma equipe de nativos digitais, o Sistran Labs é o laboratório de inovações
                  da Sistran. Aqui, as ideias se transformam em verdadeiras soluções assertivas que
                  impulsionam o crescimento das Seguradoras. O Sistran Labs possui foco em{' '}
                  {/* Caixa alta por CSS, não no conteúdo: leitor de tela lê
                      "inteligência de negócios em seguros" como palavras, e não
                      letra por letra, enquanto na tela o texto continua em
                      maiúsculas — a mesma solução que os nomes dos cards abaixo já
                      usavam (`uppercase` no `<h3>`). */}
                  {/* SIS-216 — o negrito abraça O TRECHO PEDIDO, «Inteligência de
                      Negócios em Seguros 100%», e não só o `<span>` que já
                      existia: o `100%` está FORA da caixa alta (é número, não
                      palavra) mas DENTRO da ênfase, então o `<strong>` é o nó de
                      fora e o `uppercase` continua sendo o de dentro. Dois nós
                      com dois papéis — um pinta peso, o outro pinta caixa.
                      `<strong>` e não `<span className="font-bold">` porque aqui
                      a ênfase é de conteúdo (é o foco do laboratório), e é o
                      mesmo idioma da `/sistran-university`. `font-bold` escrito
                      junto porque o peso do `<strong>` do agente de usuário é
                      `bolder`, relativo: sobre um pai em 400 ele resolve para
                      700 hoje, mas é o valor que o projeto declara em ponto
                      nenhum — a utilitária fixa 700 absoluto. */}
                  <strong className="font-bold">
                    <span className="uppercase">Inteligência de Negócios em Seguros</span> 100%
                  </strong>{' '}
                  voltados ao estudo/aplicação das soluções mais eficientes para transformação digital,
                  utilizando/criando tecnologia disruptiva (DS/AI/ML/
                  {/* DS, AI e ML ficam como estão: são siglas, e sigla em maiúscula é
                      a grafia correta dela. "CLOUD" é palavra inteira em caixa alta
                      no meio de uma enumeração, então recebe o mesmo tratamento dos
                      dois trechos maiores. */}
                  <span className="uppercase">cloud</span>/No &amp; Low-code).
                </p>
              </div>
              {/* A FOTO É A PEÇA QUE ALTERNA. `AMBIENTE[0]` e não um `src`
                  escrito à mão: os `alt` descritivos e as dimensões nativas
                  continuam num lugar só, como a SIS-293 deixou. */}
              {/* AJUSTE DE PEDIDO — «as fotos devem ter as mesmas ações que a
                  imagem» de «Principais Soluções». As classes de lá são vestidas
                  aqui, em vez de copiadas para regras novas: é o que faz «as
                  mesmas ações» ser literal, e o que garante que um ajuste no
                  hover daquela arte chegue às três fotos sozinho.
                  O INVÓLUCRO É NOVO e é o palco: é ele que lê o ponteiro (para
                  que placa de sombra, quadro e quadradinho ciano reajam a um
                  gesto só) e é ele que passou a carregar o `data-reveal` lateral.
                  Antes o preset estava na `<figure>`; se ficasse lá, o
                  `transform` de entrada e o `transform` de hover disputariam a
                  mesma propriedade do mesmo nó. Separados, o palco entra e o
                  quadro sobe. */}
              <div className="labs-intro-palco labs-principais-palco" data-reveal={AMBIENTE[0].lado}>
                <figure className="labs-intro-figura labs-principais-quadro">
                  <Image
                    src={AMBIENTE[0].src}
                    alt={AMBIENTE[0].alt}
                    width={AMBIENTE[0].w}
                    height={AMBIENTE[0].h}
                    sizes="(min-width: 64rem) 536px, calc(100vw - 2.5rem)"
                    className="labs-intro-imagem labs-principais-imagem"
                  />
                </figure>
              </div>
            </RevealScope>

            {/* A FILEIRA ESPELHADA: foto à esquerda, texto à direita. A ordem no
                DOM é a MESMA das outras duas (texto e depois foto) e a troca é só
                de coluna, dentro da media query — assim a ordem de leitura e a de
                tabulação seguem parágrafo → foto nas três fileiras, e o empilhado
                do mobile já sai com o texto acima sem precisar de `order`. */}
            <RevealScope
              className="labs-intro-fileira labs-intro-fileira--espelhada"
              limiar={LIMIAR_REVEAL}
              margem={MARGEM_REVEAL}
              data-reveal-nome="labs-intro-2"
            >
              <div
                className="labs-intro-texto text-lg leading-relaxed"
                data-reveal="fade-up"
                style={{ '--reveal-i': 1 } as CSSProperties}
              >
                <p>
                  O Sistran Labs com sua expertise tecnológica, é a solução ideal para{' '}
                  {/* SIS-216 — o trecho JÁ estava em caixa alta e ganhou o peso.
                      Aqui o `<strong>` recebe as duas classes em vez de aninhar
                      um `<span>`: a caixa alta e a ênfase cobrem exatamente o
                      mesmo texto, e um nó a mais não teria o que carregar. */}
                  <strong className="font-bold uppercase">testar, desenvolver e/ou homologar</strong>{' '}
                  as tecnologias e
                  soluções de negócio mais adequadas com foco em automatizar processos, adicionar
                  segurança, melhorar a experiência do usuário.
                </p>
              </div>
              <div className="labs-intro-palco labs-principais-palco" data-reveal={AMBIENTE[1].lado}>
                <figure className="labs-intro-figura labs-principais-quadro">
                  <Image
                    src={AMBIENTE[1].src}
                    alt={AMBIENTE[1].alt}
                    width={AMBIENTE[1].w}
                    height={AMBIENTE[1].h}
                    sizes="(min-width: 64rem) 536px, calc(100vw - 2.5rem)"
                    className="labs-intro-imagem labs-principais-imagem"
                  />
                </figure>
              </div>
            </RevealScope>

            <RevealScope
              className="labs-intro-fileira"
              limiar={LIMIAR_REVEAL}
              margem={MARGEM_REVEAL}
              data-reveal-nome="labs-intro-3"
            >
              <div
                className="labs-intro-texto text-lg leading-relaxed"
                data-reveal="fade-up"
                style={{ '--reveal-i': 1 } as CSSProperties}
              >
                <p>
                  {/* SIS-216 — «Seguradora “Staff Augmentation”» em negrito, COM as
                      aspas dentro: elas são parte do termo citado, e deixá-las
                      finas de fora do `<strong>` partiria a mancha do trecho no
                      meio de uma expressão só. A vírgula que vem depois fica de
                      fora — ela pertence à frase, não ao termo. */}
                  Nosso time de experts, amplia a capacidade da{' '}
                  <strong className="font-bold">
                    Seguradora &ldquo;Staff Augmentation&rdquo;
                  </strong>
                  , com custos racionais, eventualmente interligando-se aos Labs de
                  referência (da seguradora / internacional), validando e localizando soluções.
                  Selecionamos, treinamos e capacitamos recursos para as seguradoras, recebendo
                  colaboradores e devolvendo profissionais em outro patamar de competência. Estamos
                  falando da excelência operacional certeira de um time especializado em Seguros.
                  {/* SIS-216 — o mote fecha o parágrafo em negrito, aspas incluídas
                      pela mesma razão do trecho acima.
                      O `{' '}` NÃO é enfeite: sem ele a sonda leu
                      «…especializado em Seguros.“Innovation that matters!”», sem
                      o espaço entre a frase e o mote. JSX descarta a linha em
                      branco que fica entre um nó de texto e o elemento seguinte,
                      e o comentário acima é justamente essa fronteira — o espaço
                      tem de ser escrito para existir. */}{' '}
                  <strong className="font-bold">&ldquo;Innovation that matters!&rdquo;</strong>
                </p>
              </div>
              <div className="labs-intro-palco labs-principais-palco" data-reveal={AMBIENTE[2].lado}>
                <figure className="labs-intro-figura labs-principais-quadro">
                  <Image
                    src={AMBIENTE[2].src}
                    alt={AMBIENTE[2].alt}
                    width={AMBIENTE[2].w}
                    height={AMBIENTE[2].h}
                    sizes="(min-width: 64rem) 536px, calc(100vw - 2.5rem)"
                    className="labs-intro-imagem labs-principais-imagem"
                  />
                </figure>
              </div>
            </RevealScope>
          </div>
        </div>
      </section>

      {/* SIS-294 — A SEÇÃO SÓ-FOTOS `#labs-ambiente` SAIU DAQUI, e as três fotos
          NÃO foram deletadas: elas subiram para dentro da intro logo acima, uma
          por parágrafo, que é o que esta issue pede (item 3, «fundi-la na intro —
          sem duplicar as três imagens na página»). O código não fica comentado
          porque ele não desapareceu: `AMBIENTE`, os `alt`, as dimensões nativas,
          o `RevealScope` por foto e os presets laterais estão todos vivos nas
          fileiras da intro. O que morreu é a CASCA — `<section
          aria-labelledby="labs-ambiente" className="section-py">` com o `<h2
          id="labs-ambiente" className="sr-only">` e a `.labs-ambiente-pilha` —,
          e o motivo dela existir (a SIS-293 punha a galeria «na emenda que já
          existia, claro → navy») deixou de valer no instante em que as fotos
          passaram a viver na folha clara.

          DUAS CONSEQUÊNCIAS QUE ESTA ISSUE CRIA e paga:
          • a âncora `labs-ambiente` saiu de `src/data/pageSections.ts` na mesma
            leva. Parada no navegador lateral apontando para `id` que não existe
            mais é parada que não rola para lugar nenhum;
          • a galeria navy era o que SEPARAVA a intro clara de «Já desenvolvemos»,
            que a SIS-291 também deixou `section-light`. Sem ela as duas folhas
            claras se encostam, e a fronteira volta como uma linha de 1px no
            `.labs-intro` (o número e o argumento estão lá, no `globals.css`).
          O CSS `.labs-ambiente-*` fica comentado em bloco no `globals.css`, com o
          mesmo registro. */}

      {/* SIS-291 · A SEÇÃO PASSA A SER CLARA. É a mudança mais estrutural desta
          volta e vem do pedido por escrito: a referência é folha quase branca com
          grade sutil e quadrados translúcidos. `section-light` PURO (e não
          `section-light-blue`) porque a variante azul é a de «Principais Soluções»
          duas seções abaixo — usar a mesma nas duas apagaria a fronteira entre
          elas, que foi exatamente o defeito que a SIS-290 anotou. A galeria navy
          logo acima continua fazendo a separação de cima.
          CONSEQUÊNCIA DIRETA: as classes `text-white` e `text-white/85` que este
          bloco tinha SAÍRAM todas. Não foram trocadas por uma cor navy escrita à
          mão: `.section-light` já pinta h2/h3/p, e (nota da SIS-290) o seletor
          `.section-light [class*="text-white"]` intercepta a família inteira do
          branco — escrever `text-white` aqui seria declarar e revogar cor no mesmo
          elemento. */}
      <section
        aria-labelledby="labs-solucoes"
        className="labs-desenvolvemos section-py section-light"
      >
        {/* Os quadrados translúcidos da referência. `aria-hidden` e sem texto: é
            grafismo, e são quatro `<span>` porque quadrado de canto arredondado
            não existe como camada de `background-image`. */}
        <div className="labs-desenvolvemos-grafismo" aria-hidden>
          <span />
          <span />
          <span />
          <span />
        </div>

        <div className="container-lp">
          {/* UM escopo para toda a seção, e não um por peça: a issue pede
              «stagger hero → cards → barra», e um stagger é uma ordem DENTRO de um
              escopo — cinco escopos independentes disparariam cada um no seu
              limiar e a ordem viria da rolagem, não do desenho. Calibre canônico
              de `./reveal-calibre`, o mesmo das outras seções desta rota. */}
          <RevealScope
            className="labs-desenvolvemos-escopo"
            limiar={LIMIAR_REVEAL}
            margem={MARGEM_REVEAL}
            data-reveal-nome="labs-desenvolvemos"
          >
            {/* SIS-216 — `font-bold` ENTROU. A linha anterior era exatamente esta:

                  className="labs-desenvolvemos-titulo font-display text-section"

                Utilitária do Tailwind e não `font-weight` em
                `.labs-desenvolvemos-titulo`: aquele bloco existe para a MEDIDA
                do título (`max-width: 22ch` + `text-wrap: balance`), e peso
                escrito lá viveria em `@layer` fora das utilitárias, onde
                `font-bold` de qualquer outro ponto passaria por cima sem aviso.
                A ordem também importa a favor: `.font-display` só declara
                família, então não há especificidade a vencer (a nota longa do
                `globals.css` sobre a SIS-155 explica por que a normalização
                para 400 foi feita nas classes, não com `!important`). */}
            <h2
              id="labs-solucoes"
              className="labs-desenvolvemos-titulo font-display font-bold text-section"
              data-reveal="fade-up"
            >
              Já desenvolvemos muitas soluções, entre elas:
            </h2>
            <span
              className="labs-desenvolvemos-risco"
              data-reveal="line-up"
              style={{ '--reveal-i': 1 } as CSSProperties}
              aria-hidden
            />

            <div className="labs-desenvolvemos-grade">
              {/* O HERÓI. `<article>` e não `<div>`: é a peça de um produto com
                  nome, descrição e destino próprios. */}
              <article
                className="labs-guru"
                data-reveal="fade-right"
                style={{ '--reveal-i': 2 } as CSSProperties}
              >
                {/* `width`/`height` são as dimensões REAIS do WebP derivado
                    (596×682, medidas por `scripts/gerar-arte-guru-sis291.mjs`) —
                    com `images.unoptimized` o `next/image` entrega o arquivo cru,
                    então par divergente aqui seria CLS puro.
                    `alt` DESCREVE, não repete: o nome do produto já é texto no
                    `<h3>` ao lado, e `alt` que duplica o título vizinho faz o
                    leitor de tela dizer duas vezes a mesma coisa. */}
                <Image
                  src="/images/sistran-labs/guru-de-seguros-arte.webp"
                  alt="Guru meditando ao centro de um anel de ícones de seguros: residência, viagem, vida, família, saúde e automóvel."
                  width={596}
                  height={682}
                  className="labs-guru-arte"
                />
                <div className="labs-guru-corpo">
                  {/* SIS-291 (2ª volta) — O LETREIRO VOLTA A SER IMAGEM, e isto
                      TROCA a decisão da 1ª volta (que ficou registrada, comentada
                      com o motivo, no bloco «O LETREIRO» do `globals.css`, onde
                      as regras `.labs-guru-nome`/`-fraco` saíram de cena): a
                      issue nomeia o arquivo
                      e diz «não texto HTML "guru / de seguros"».
                      O `<h3>` NÃO desaparece — ele fica `sr-only`, com o nome do
                      produto por escrito. Um letreiro que é o TÍTULO do card
                      precisa ser título de verdade: o `aria-labelledby` da grade,
                      a ordem de leitura e o `copy-lock` dependem de texto, e
                      `alt` de imagem não é cabeçalho para leitor de tela nenhum.
                      Assim o nome continua travado no lock e o pixel é o da
                      marca, que é o que a issue pede.
                      A RESSALVA DA 1ª VOLTA CONTINUA VERDADEIRA e o asset não a
                      resolve: «de seguros» é BRANCO no arquivo. A chave de alfa
                      (ver o script) tira o fundo preto e, com ele, a sombra que
                      dava contorno à palavra; a separação sobre a cápsula clara
                      volta como `drop-shadow` na regra `.labs-guru-letreiro`, que
                      é filtro e segue o canal alfa. O número medido está no
                      comentário de lá e em `docs/medidas/sis291-2volta.json`. */}
                  <h3 className="labs-guru-nome sr-only">guru de seguros</h3>
                  <Image
                    src="/images/sistran-labs/icones/guru1.webp"
                    alt=""
                    width={800}
                    height={351}
                    className="labs-guru-letreiro"
                  />

                  <p className="labs-guru-lead">{GURU.description}</p>
                  {/* O botão da referência. Só existe porque o destino existe:
                      `guru-de-seguros` está em `src/data/accelerators.ts`, e o
                      `SLUG_POR_NOME` continua sendo quem responde por isso. */}
                  {SLUG_POR_NOME.get(GURU.name) ? (
                    <Link
                      href={`/solucoes/${SLUG_POR_NOME.get(GURU.name)}`}
                      className="labs-guru-botao"
                    >
                      Conheça a solução
                      <ArrowUpRight className="h-4 w-4" strokeWidth={2.4} aria-hidden />
                    </Link>
                  ) : null}
                </div>
              </article>

              <div className="labs-desenvolvemos-lado">
                {/* O FIO CIANO que liga o herói aos três cartões. `viewBox`
                    estreito e alto com `preserveAspectRatio="none"` para preencher
                    o vão da grade; `pathLength="1"` normaliza os três traços, de
                    modo que o par dasharray/dashoffset do desenho na entrada é
                    1/1 nos três e não três comprimentos medidos à mão.
                    Os NÓS não estão aqui: são o `::before` de cada cartão, porque
                    um `<circle>` dentro de um SVG esticado sem proporção sairia
                    elipse. */}
                <svg
                  className="labs-desenvolvemos-fio"
                  viewBox="0 0 60 300"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  {/* AS PONTAS ENCOSTAM NAS BOLINHAS, e agora sem número
                      escolhido: `y = 0` e `y = 300` são as BORDAS da faixa, e a
                      faixa é recortada por CSS exatamente entre o centro do 1º e
                      o centro do 3º cartão (a conta está na regra
                      `.labs-desenvolvemos-fio`). Os antigos 40 e 260 de 300 eram
                      frações escolhidas dentro de uma faixa que ocupava a coluna
                      inteira, e erravam a bolinha por 5,9px para cada lado —
                      medido a 1440. A folga horizontal do 2º e do 3º cartão, que a
                      cascata abria (28px e 12px), é fechada pelo toco
                      `.labs-solucao-cartao::after`.

                      O FIO NÃO ENCOSTA MAIS NO CARD DO GURU: o leque parte de
                      `x = 14` de 60 e não de `x = 0`, ou seja começa ~13px depois
                      da borda da cápsula (o vão mede 56px a 1440). Era `M0`, que
                      colava a raiz do leque exatamente na borda direita do card
                      (medido: 0px de troco). Pedido da dona do conteúdo — o
                      leque agora nasce solto no vão e só as pontas tocam algo. */}
                  <path pathLength="1" d="M14 150 C 36 150, 36 0, 60 0" />
                  <path pathLength="1" d="M14 150 H 60" />
                  <path pathLength="1" d="M14 150 C 36 150, 36 300, 60 300" />
                </svg>

                <ul className="labs-desenvolvemos-pilha">
                  {SOLUCOES.map((s, i) => {
                    const slug = SLUG_POR_NOME.get(s.name);
                    /* O miolo é o mesmo nos três; o que varia é a CASCA. No que
                       tem página o cartão inteiro é um `<a>` — alvo grande, um só
                       destino, o nome do produto como texto acessível do link.
                       Nos outros é uma `<div>`: `<a>` sem `href` não é link para
                       ninguém, e cartão com aparência de clicável e sem destino é
                       pior que cartão estático. A referência desenha a seta nos
                       três; duas delas não têm para onde ir nesta base. */
                    const miolo = (
                      <>
                        {/* `alt=""` e a plaqueta segue `aria-hidden`: o nome do
                            produto é o `<h3>` ao lado, e um `alt` aqui faria o
                            leitor de tela dizer o mesmo nome duas vezes. É a
                            mesma regra da arte do herói. */}
                        <span className="labs-solucao-plaqueta" aria-hidden>
                          <Image
                            src={s.icone}
                            alt=""
                            width={128}
                            height={128}
                            className="labs-solucao-icone"
                          />
                        </span>
                        <span>
                          {/* SIS-216 — o nome do cartão em negrito. A classe entra no
                              `<h3>`, que é o único lugar onde os três nomes que a
                              issue lista («Predição de Churn», «Fast Claims» e
                              «Smart Miner») são escritos: eles vêm de `SOLUCOES`
                              por `map`, então marcar o dado seria pôr apresentação
                              dentro do conteúdo — e o `name` também alimenta o
                              `Map` de slugs do link. Linha anterior:
                                className="labs-solucao-nome font-display text-base uppercase leading-tight" */}
                          <h3 className="labs-solucao-nome font-display font-bold text-base uppercase leading-tight">
                            {s.name}
                          </h3>
                          <p className="labs-solucao-texto text-sm leading-snug">
                            {s.description}
                          </p>
                        </span>
                        {slug ? (
                          <span className="labs-solucao-seta" aria-hidden>
                            <ArrowUpRight className="h-4 w-4" strokeWidth={2.4} />
                          </span>
                        ) : (
                          <span />
                        )}
                      </>
                    );

                    return (
                      <li
                        key={s.name}
                        className="labs-solucao-cartao"
                        data-reveal="fade-left"
                        style={{ '--reveal-i': 3 + i } as CSSProperties}
                      >
                        {slug ? (
                          <Link href={`/solucoes/${slug}`} className="labs-solucao-alvo">
                            {miolo}
                          </Link>
                        ) : (
                          <div className="labs-solucao-alvo">{miolo}</div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* A BARRA DE CONTATO da referência. É a MESMA chamada que a SIS-122
                decidiu manter aqui, e a decisão dela continua valendo: o
                `ContactCTA` que fecha a rota leva a `/#contato`, ou seja a um
                FORMULÁRIO em outra tela, enquanto aqui o gesto é `mailto:` com o
                endereço legível — é o único lugar da rota onde o endereço aparece
                escrito. O que esta issue muda é só a FORMA (parágrafo solto →
                pílula com selo e botão) e a redação, que passa a ser a da PNG.
                Ficam registradas as palavras que saíram: «Entre em contato
                conosco através do e-mail: comercial@sistran.com.br e saiba como
                podemos orientá-lo na busca pela inovação e transformação
                digital.» — o endereço deixou o meio da frase e virou o rótulo do
                botão, que é onde a referência o põe. */}
            <div
              className="labs-desenvolvemos-barra"
              data-reveal="fade-up"
              style={{ '--reveal-i': 6 } as CSSProperties}
            >
              {/* SIS-291 (2ª volta) — `icones/email.png` (derivado em WebP) no
                  selo claro, no lugar do `Mail` do lucide, como manda o item 3.
                  O ENVELOPE DO BOTÃO CONTINUA LUCIDE, de propósito: o PNG é um
                  envelope de degradê AZUL com fundo transparente, e o botão é a
                  pílula de degradê azul — azul sobre azul não se vê. Ali o ícone
                  precisa ser branco, e branco é o que o lucide dá de graça por
                  herdar `currentColor` do botão. É a mesma leitura da referência,
                  que desenha o envelope do botão em branco e o do selo em azul. */}
              <span className="labs-desenvolvemos-selo" aria-hidden>
                <Image
                  src="/images/sistran-labs/icones/email.webp"
                  alt=""
                  width={128}
                  height={128}
                  className="labs-desenvolvemos-selo-icone"
                />
              </span>
              <p className="labs-desenvolvemos-barra-texto">
                Entre em contato conosco e saiba como podemos orientá-lo na busca pela inovação e
                transformação digital.
              </p>
              <a href={`mailto:${CONTACT_EMAIL}`} className="labs-desenvolvemos-barra-botao">
                <Mail className="h-4 w-4" strokeWidth={2.2} aria-hidden />
                {CONTACT_EMAIL}
                <ArrowUpRight className="h-4 w-4" strokeWidth={2.4} aria-hidden />
              </a>
            </div>
          </RevealScope>
        </div>
      </section>

      <section
        aria-labelledby="labs-principais"
        className="labs-principais section-py section-light section-light-blue"
      >
        <div className="container-lp">
          {/* SIS-188 — A TAG TEXTUAL DESTA SEÇÃO VIROU CARIMBO. A linha era
              exatamente esta:

                <span className="tag-section">Sistran Labs</span>

              Ela fica registrada porque a palavra não desapareceu do site: ela
              migrou para o `alt` da arte, que é onde o sentido é lido por quem não
              vê a imagem. O `h2` («Principais Soluções Sistran Labs») CONTINUA
              intacto, com o mesmo `id` que serve de `aria-labelledby` da seção — a
              issue manda não mexer nele, e a redundância entre a arte e o título é
              a mesma que a tag textual já criava.

              O `alt` é «Realizado pela Sistran Labs», que é o que a arte DIZ
              (duas linhas: «REALIZADO PELA» / «Sistran Labs»). A issue oferece as
              duas redações e esta é a fiel ao desenho; «Sistran Labs» sozinho
              descreveria menos do que está impresso.

              `gatilho="viewport"` E NÃO O PADRÃO DE ROTA: esta seção começa a
              ~3.070px do topo do documento (medido), muito abaixo da dobra. Bater
              na montagem faria a batida acontecer com a peça fora de quadro, e
              quem rolasse até aqui encontraria o carimbo já assentado — nunca
              veria o efeito que é o pedido inteiro desta issue. O calibre do
              observador é o canônico da casa; ver "DUAS FORMAS DE ENTRAR EM CENA"
              no `CarimboBatida`.

              A arte é a derivada de 640px (43 kB) e não o PNG de 996px (112 kB) —
              apuração de peso no cabeçalho de
              `scripts/gerar-carimbo-labs-sis188.mjs`. As dimensões passadas são as
              do arquivo derivado, e é delas que sai a razão de aspecto. */}
          {/* O carimbo e o título passam a ficar LADO A LADO (carimbo à esquerda,
              h2 à direita) — pedido da dona do conteúdo. Antes eram irmãos diretos
              do `.container-lp`, um debaixo do outro; agora dividem esta linha, que
              é o único motivo deste `div` existir. Ela volta a EMPILHAR abaixo de
              768px: nessa largura o carimbo e duas linhas de manchete não caberiam
              na mesma faixa sem espremer o h2 a uma palavra por linha. */}
          <div className="labs-principais-cabeca">
          <CarimboBatida
            src="/images/sistran-labs/carimbo-sistran-labs.webp"
            alt="Realizado pela Sistran Labs"
            larguraIntrinseca={640}
            alturaIntrinseca={224}
            className="labs-principais-carimbo"
            gatilho="viewport"
          />
          {/* SIS-216 — `font-bold` ENTROU. Linha anterior:
                className="mt-4 max-w-2xl font-display text-section text-ink"
              As duas manchetes da rota engrossam na mesma leva de propósito: uma
              só em 700 e a outra em 400 leria como descuido, não como
              hierarquia. */}
          <h2
            id="labs-principais"
            className="mt-4 max-w-2xl font-display font-bold text-section text-ink"
          >
            Principais Soluções Sistran Labs
          </h2>
          </div>

          {/* SIS-292 — A ARTE PASSA A SER A SEÇÃO INTEIRA, dentro de um quadro
              RETO com o vocabulário do quadro de O PROGRAMA. O que havia aqui,
              para o registro:

              `<figure className="labs-principais-arte">` com
              `src="/images/sistran-labs/principais-solucoes.webp"`,
              `alt="Hub tecnológico conectado a seis frentes de soluções digitais"`
              e a nota da SIS-229 («peça principal em largura generosa, sem card
              ou aresta dura… a grade abaixo continua sendo a fonte textual e
              clicável dos produtos»). A segunda metade daquela frase caducou
              nesta issue: a grade saiu, e por isso a fonte textual passou a ser
              o `figcaption` daqui — ver a nota dele.

              PALCO + QUADRO, dois elementos, como no Programa: o palco guarda a
              placa de sombra e o quadradinho ciano (que moram FORA do recorte),
              e o quadro tem `overflow: hidden` para clipar o parallax da arte.
              A diferença com o Programa é a que a issue manda: ZERO rotação —
              nem `rotateY`, nem `rotateX`, nem `rotate` plano, nem
              `perspective`. A dinâmica é a borda, o glow e um deslocamento
              vertical curto. Os valores e cada desvio estão anotados regra por
              regra no `globals.css`.

              O ARQUIVO É O WEBP DERIVADO de `principais-solucoes1.webp.png`
              (`scripts/gerar-arte-principais-sis292.mjs`): 2,08 MiB → 224 KiB,
              mesmo desenho e mesmas dimensões. Com `images.unoptimized` ligado
              o `next/image` entrega o arquivo cru, e este é o LCP da seção. O
              PNG entregue fica no repo como matriz.

              `width`/`height` seguem 1672×941 porque a arte nova tem EXATAMENTE
              as mesmas dimensões da anterior (medido) — o par existe para
              reservar a proporção, e não mudou. */}
          <figure className="labs-principais-palco">
            <div className="labs-principais-quadro">
              <Image
                src="/images/sistran-labs/principais-solucoes1.webp"
                alt="Hub central de dados ligado por feixes luminosos a seis plataformas: Data Analytics, Cloud Migration, AI &amp; Machine Learning, App Modernization, IoT e Data Mining &amp; Enrichment"
                width={1672}
                height={941}
                /* SIS-292 — `sizes="(min-width: 1180px) 1116px, calc(100vw -
                   2.5rem)"` saiu daqui porque MEDI e ele não chega ao HTML: com
                   `images: { unoptimized: true }` (SIS-154) o `next/image` não
                   emite `srcset`, e sem `srcset` o navegador ignora `sizes` —
                   a sonda leu `sizes: null` no atributo renderizado, nas duas
                   larguras. Prop que não produz atributo é comentário disfarçado
                   de código; o comentário fica sendo comentário. Se algum dia
                   `unoptimized` cair, a linha está aqui verbatim para voltar. */
                className="labs-principais-imagem"
              />
            </div>

            {/* A LEGENDA NÃO É DECORAÇÃO: com os cartões fora, os seis rótulos
                da seção existem SÓ COMO PIXEL dentro do arquivo — e rótulo em
                raster não é texto para leitor de tela, para busca, para tradutor
                automático nem para quem aumenta a fonte. O `alt` sozinho
                resolveria o leitor de tela e mais nada, porque `alt` não se
                pinta. Daí a legenda visível, com as seis frentes na mesma
                escrita da arte — inventar nome novo aqui criaria uma segunda
                versão dos rótulos, divergente do desenho no primeiro retoque
                dele. */}
            {/* A ORDEM DECLARADA foi corrigida contra a captura: os seis nós estão
                em DUAS fileiras em volta do hub (acima Data Analytics, Cloud
                Migration e AI & Machine Learning; abaixo App Modernization, IoT e
                Data Mining & Enrichment), então «da esquerda para a direita» —
                como estava — descrevia um arranjo que a arte não tem. Legenda que
                erra a posição é pior que legenda nenhuma para quem cruza o texto
                com o desenho. */}
            <figcaption className="labs-principais-legenda">
              Seis frentes em torno do hub de dados — acima: Data Analytics, Cloud
              Migration e AI &amp; Machine Learning; abaixo: App Modernization, IoT e
              Data Mining &amp; Enrichment.
            </figcaption>
          </figure>

          {/* SIS-292 — A VITRINE DE SETE CARTÕES SAIU DAQUI. O que havia,
              resumido para o registro (o corpo completo está no histórico do
              arquivo): `<ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2
              lg:grid-cols-3">` mapeando `ACCELERATORS` em `<Link
              href={`/solucoes/${a.id}`} className="glass-card-hover group flex
              h-full flex-col p-7">` com a placa de ícone tingida por `a.tone`, o
              `<h3>{a.name}</h3>`, o `<p>{a.description}</p>` e o rótulo
              «Conhecer» com a seta — Match AI, Lumina AI, Fast, QA Integrado,
              Connect API, Smart Miner e Guru de Seguros.

              POR QUE SAI e não fica escondida: a issue supersede o item de
              cartões da SIS-229 nesta seção; a peça pedida é a arte sozinha.
              Nenhum produto perde caminho no site — `/solucoes/[slug]` continua
              existindo para os sete, a vitrine própria deles é a rota
              `/solucoes-servicos-e-consultoria/`, e nesta mesma página os dois
              com página («Guru de Seguros» e «Smart Miner») seguem linkados nos
              cartões da SIS-291, logo acima. Ou seja: link perdido aqui, zero.

              `ACCELERATORS` CONTINUA IMPORTADO — não é sobra: é dele que sai o
              `SLUG_POR_NOME` da seção da SIS-291 (topo do arquivo). `getIcon`
              era usado SÓ aqui e o import foi removido junto; `ArrowUpRight`
              fica, porque é a seta dos cartões daquela outra seção. */}
        </div>
      </section>

      {/* SIS-286 — O FECHO PASSA A SER O DA REFERÊNCIA, e a mudança são DUAS
          PROPS, exatamente como na SIS-283 de `/sistran-university`. Linha
          anterior, para o registro: `<ContactCTA />`.

          Nada de markup novo: `ContactCTA` já bifurca para `ContactCTAReferencia`
          (vidro + fio ciano + blob/selo + botão com círculo) quando
          `layoutReferencia` está ligada, e `contatoNoModal` é a porta que faz o
          botão abrir o `ContactModal` em vez de navegar para `/#contato`.
          Duplicar a árvore aqui é o que o item 2 da issue proíbe — ela é mantida
          em um lugar só, e hoje três rotas a montam.

          O MAILTO DO MEIO DA PÁGINA (nota da SIS-122 acima) segue de pé e ganhou
          razão: o botão daqui deixou de navegar para o formulário em outra tela e
          passou a abrir painel, então o endereço escrito continua sendo o único
          caminho por e-mail da rota.

          A ESCRITA NÃO VEM POR PROP: título e parágrafo são os PADRÃO do
          componente («Fale com a Gente!» / «Quer conversar com um de nossos
          especialistas?…»), que é o que o `copy-lock` guarda, e o rótulo «Fale com
          a SISTRAN» é literal do arquivo da referência. Repetir o texto aqui
          criaria uma segunda fonte da verdade para a mesma frase.

          `className` NÃO SERIA APROVEITADO nem se eu passasse: o ramo da
          referência não o encaminha (`ContactCTA.tsx:169`), de propósito, porque
          `.cta-ref` traz o próprio campo claro e o `box-shadow` de 54px da SIS-93.
          E aqui a emenda é caso NOVO em relação a `/esg` e à University: nas duas
          a seção de cima é navy, e nesta rota a de cima é
          `section-light section-light-blue` — claro contra claro. Medido: as duas
          paradas de base são as mesmas a 1/255 (`#f2f9fe/#e3f1fb/#cfe7f7` contra
          `#f3f9fe/#e4f1fb/#cfe7f7`) e as duas espalham a MESMA sombra
          `0 0 54px 18px rgb(227 241 251 / 45%)`, então a fronteira é interna a uma
          rampa da mesma cor, não um encontro de dois campos diferentes. O número
          da emenda está no comentário da issue.

          `haloClaro`, `reativo` e `motionShowcase` ficam desligados (nunca
          estiveram ligados nesta rota) pelo motivo já registrado nos mounts de
          `/esg` e da University: os três decoram a SUPERFÍCIE NAVY que a
          referência substitui. `revelar` também fica fora — ele carrega o calibre
          DA ROTA (SIS-271) e `/sistran-labs` não tem `reveal-calibre.ts`; inventar
          um par de números aqui, sem medição e sem pedido, faria o trabalho da
          issue de reveal desta rota. */}
      <ContactCTA layoutReferencia contatoNoModal />
    </PageShell>
  );
}
