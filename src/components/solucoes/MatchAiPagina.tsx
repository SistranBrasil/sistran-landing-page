'use client';

/**
 * SIS-292 — O CORPO DA `/solucoes/match-ai`, na estrutura de seções de
 * `public/imagensexemplo/exemplodoquezer.png`.
 *
 * POR QUE UM COMPONENTE DEDICADO, e não props novas no template de
 * `/solucoes/[slug]`: o template renderiza `page.blocks.map(...)` — um título e um
 * corpo por bloco, no mesmo molde para as sete slugs. A mock não é um molde de
 * bloco: é hero dividido, grade 2×2 com imagem por card, faixa escura com trilho
 * de três passos e uma vitrine de irmãos. Tentar expressar isso como variação de
 * `Block`/`ItemList` mudaria o molde das SETE, e o item 1 da issue proíbe
 * literalmente redesenhar as outras seis.
 *
 * TODA A ESCRITA VEM DE `src/data/acceleratorPages.ts` — nada de copy digitada
 * aqui dentro. Este arquivo escolhe o ARRANJO; a escrita é a do site, mais o que a
 * mock completa, e cada completação está anotada no dado (não aqui, para não haver
 * duas versões da mesma justificativa).
 *
 * OS SLOTS DE IMAGEM AINDA SÃO PLACEHOLDER onde não há arte: hero e faixa escura
 * usam a MESMA capa do Match AI (`CAPAS_DE_ABERTURA['match-ai']`) até
 * existir arte definitiva. EXCEÇÕES, declaradas no ponto de uso: os
 * quatro cards de «O que o Match AI faz?», que receberam arte própria em
 * `public/images/solucoes/` (item 9 da SIS-292), «Conheça também», onde a arte de
 * cada solução já existia no repositório, e o Posicionamento, que usa
 * `public/images/solucoes/match.png` (SIS-288) — não a capa.
 *
 * ── MOVIMENTO (2ª volta da SIS-292) ──────────────────────────────────────────
 *
 * A ENTRADA MUDOU DE MECANISMO: era `variants` de `@/lib/motion` com
 * `initial={rm ? false : 'hidden'}` e `whileInView`, e passa a ser `RevealScope` +
 * `data-reveal`, que é o que a issue pede ao dizer «reveal e efeitos como em
 * /sistran-university». O par de calibre vem de `./reveal-calibre.ts` (reexporta o
 * canônico) — nunca escrito à mão aqui.
 *
 * POR QUE TROCAR E NÃO SOMAR: `variants` do `motion/react` escreve `transform` e
 * `opacity` INLINE no nó, e os presets do Efeito 4 escrevem `transform` pela
 * cascata. Dois donos do mesmo `transform` é a colisão que a University registra
 * (`palco`/`quadro`/`arte`): o inline vence, o preset viraria decoração morta e o
 * hover de escala — que é metade do que esta issue pede — perderia para a matriz
 * congelada. Somar os dois daria o pior dos dois. Junto com o `motion/react`
 * saíram `rm`, `inicial` e `VP`, que só existiam para alimentá-lo.
 *
 * O GANHO COLATERAL é que o corpo volta a nascer VISÍVEL no HTML do servidor: o
 * `initial="hidden"` inlinava `opacity: 0` no SSR, e o `data-reveal` só esconde
 * enquanto o escopo diz `data-in="false"` — sem JS, `data-in` nunca é escrito e
 * nada fica escondido.
 *
 * O MOVIMENTO EM LAÇO (fichas do hero, fio do trilho, passos pulsando, colunas
 * flutuando, pop do balão, vida das mídias) é TODO CSS, no bloco `SIS-292` do fim
 * do `globals.css`, junto das justificativas de cada escolha (por que `translate` e
 * não `transform`, por que atraso negativo, por que `paused` e não `none`, e os
 * DOIS canais de movimento reduzido). Aqui ficam só as classes-gancho.
 */

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  Database,
  FileSearch,
  Lightbulb,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Users,
} from 'lucide-react';
import CarimboBatida from '@/components/CarimboBatida';
import ContactModal from '@/components/ContactModal';
import RevealScope from '@/components/motion/RevealScope';
import { ACCELERATORS } from '@/data/accelerators';
import {
  ACCELERATOR_PAGES,
  idDoBloco,
  type AccelBlock,
  type AcceleratorPage,
} from '@/data/acceleratorPages';
import { CAPAS_DE_ABERTURA } from '@/data/capasSolucoes';
import { LIMIAR_REVEAL, MARGEM_REVEAL } from './reveal-calibre';

const CAPA = CAPAS_DE_ABERTURA['match-ai'].src;
/* SIS-288 — foto do slot Posicionamento. Caminho interno em `public/`, como o
   `next/image` do Next 16 documenta para ficheiro local (`src="/…"`). Hero,
   faixa, cards e vitrine não leem esta constante. */
const FOTO_POSICIONAMENTO = '/images/solucoes/match.png';

/* ── AJUSTE DE PEDIDO (4ª volta) — A CAPA NOVA, SANGRADA ──────────────────────
   Pedido: «faça a capa assim [mock] com a imagem
   `public/images/solucoes/possivelcapanovamatch.png`».

   A arte é 1672×941 (medido no IHDR) e já vem DESENHADA PARA ESTE ARRANJO: o
   terço da esquerda é navy chapado e vai escurecendo até a foto, e os quadradinhos
   de ramo (auto, residencial, vida, viagem) estão embutidos nela. Ou seja, ela não
   é «foto para uma coluna», é FUNDO DE FAIXA — e é isso que muda o hero de grade
   de duas colunas para banner sangrado com o texto sobre a parte chapada.

   O QUE SAIU DO HERO, e para onde foi: a linha de campanha «Ofertas inteligentes.
   Conversas mais relevantes.», a lead longa com PERSONALIZAÇÃO e as duas fichas
   flutuantes desceram para uma faixa clara nova, logo abaixo — exatamente onde a
   mock as põe. Nada foi descartado, e por isso os itens 3 e 8 da issue continuam
   de pé (o negrito da frase e o float/hover das fichas seguem medidos, só noutra
   faixa).

   A TAG TEXTUAL «Tecnologia Disruptiva» NÃO VOLTA, embora a mock a mostre: o item
   1 desta mesma issue a trocou pelo carimbo de propósito, e a mock é anterior à
   troca. O carimbo ocupa o lugar dela no canto de cima. Se a tag tiver de voltar, é
   pedido novo — desfazer um critério fechado sem dizer seria pior.

   A CAPA ANTIGA (`CAPAS_DE_ABERTURA['match-ai']`) NÃO SAIU DE CENA: ela é a foto
   da faixa clara nova, a mesma que a mock põe atrás das duas fichas. */
const CAPA_HERO = '/images/solucoes/possivelcapanovamatch.png';

/* ── AJUSTE DE PEDIDO (5ª volta) — A ARTE TROCOU DE ARQUIVO E DE PAPEL ────────
   Era:

     const CARIMBO = {
       src: '/images/carimbo-mach-ai-ticket-outline-ffffff.png',
       largura: 618,
       altura: 291,
     };

   DOIS motivos para a troca, e o segundo é o que o pedido pede:

   1. A ARTE ANTIGA ESCREVE «MACH AI». Composta sobre `#001A3D` e lida em captura,
      a cápsula de `carimbo-mach-ai-ticket-outline-ffffff.png` diz «SISTRAN | MACH
      AI» — o erro de grafia que eu já havia sinalizado e que ficava tolerável
      enquanto a arte era ETIQUETA ao lado do nome escrito em texto. Como manchete,
      o erro passa a SER o nome do produto na tela. A arte de
      `images/solucoes/carimbo-match-ai-ticket-outline-ffffff.png` é a mesma
      cápsula com a grafia corrigida («SISTRAN | Match AI»), conferida na mesma
      captura composta — é ela que entra.
   2. As dimensões são as INTRÍNSECAS do novo arquivo, medidas no IHDR: 720x309
      (razão 2,33:1 contra 2,12:1 da anterior). Elas não são tamanho de uso — o
      tamanho sai de `--carimbo-batida-w` em `.matchai-logo-hero` no `globals.css`
      — e sim o que monta a razão de aspecto dentro do componente, para a cápsula
      não achatar (ver o docblock de `CarimboBatida`). Deixar os 618x291 antigos
      com o arquivo novo achataria a arte em 10%.

   O NOME DA CONSTANTE mudou junto (`CARIMBO` → `LOGO`) porque o papel mudou: não é
   mais o carimbo que substitui uma tag textual, é a logo que substitui a manchete.
   `alt` deixa de ser vazio pela mesma razão — ver o `h1`. */
const CARIMBO = {
  src: '/images/solucoes/carimbo-match-ai-ticket-outline-ffffff.png',
  largura: 720,
  altura: 309,
};

/* ── AJUSTE DE PEDIDO (7ª volta) — O LETREIRO DA MARCA ────────────────────────
   Pedido: «diminua o carimbo e embaixo dele coloque a logo
   `public/images/logos/MatchAIlogo.png`».

   O nome da constante acima voltou a ser `CARIMBO` (era `LOGO` desde a 5ª volta)
   porque o PAPEL voltou: a cápsula é de novo a etiqueta pequena do canto de cima, e
   quem ocupa o lugar da manchete é este letreiro. Manter o nome `LOGO` na cápsula
   com uma logo de verdade na peça ao lado deixaria duas coisas com o mesmo nome no
   mesmo hero.

   2338x350 medido no IHDR (razão 6,68:1). A arte é a palavra «MATCH AI» em tinta
   CLARA com o aglomerado de ícones de ramo à direita, conferida composta sobre
   `#001A3D` e sobre branco: no navy se lê; no branco, quase não — ou seja, é arte de
   fundo escuro, que é onde este hero a usa. Em faixa clara ela NÃO serve, e é por
   isso que o letreiro não desce para a seção da campanha.

   O `alt` É O NOME DA ROTA e a cápsula acima passa a ter `alt=""`: o letreiro é o
   conteúdo do único `h1` da página, então é ELE que carrega o nome acessível. Com as
   duas artes nomeadas, leitor de tela anunciaria «Match AI Match AI» — e é a
   manchete, não a etiqueta, que tem de ser o nome. */
const MARCA = {
  src: '/images/logos/MatchAIlogo.png',
  largura: 2338,
  altura: 350,
};

/* Os blocos são achados POR TÍTULO, e não por índice, porque índice é uma
   dependência invisível: acrescentar um bloco no dado reordenaria silenciosamente
   as seções desta página. Bloco ausente devolve `undefined` e a seção
   correspondente simplesmente não monta — preferível a estourar a rota. */
function bloco(page: AcceleratorPage, heading: string) {
  return page.blocks.find((b) => b.heading === heading);
}
function itens(b: AccelBlock | undefined) {
  return b && b.kind === 'list' ? b.items : [];
}

/* O índice da cascata do Efeito 4 vive em `--reveal-i`, e o atraso sai de
   `calc(var(--motion-stagger-reveal) * var(--reveal-i))`. Helper para não repetir
   o cast de CSS custom property em vinte pontos — é a única razão dele existir. */
const cascata = (i: number) => ({ '--reveal-i': i }) as React.CSSProperties;

/* Ícones por posição, e não por texto: são decoração de card (`aria-hidden`), e o
   que identifica cada item é o título ao lado. A ordem espelha a da mock. */
const ICONES_O_QUE_FAZ = [Users, FileSearch, BarChart3, ShieldCheck];

/* AS ARTES DEFINITIVAS DOS QUATRO CARDS (item 9 da SIS-292, acrescentado ao corpo
   da issue em 22/09). Aqui morre o placeholder desta seção — e SÓ dela: o hero e a
   faixa do trilho seguem na capa neste comentário de escopo da SIS-292. O
   Posicionamento saiu da capa na SIS-288 (`FOTO_POSICIONAMENTO` / `match.png`).
   MAPEADAS POR ÍNDICE, como a própria issue manda («mapear por índice/ordem dos
   itens»), e a ordem é a do dado: geraoferta · definepersonas · aumentavenda ·
   validaoferta. Índice é a dependência invisível que o resto deste arquivo evita de
   propósito (ver `bloco`), então fica dito: acrescentar um item em
   `acceleratorPages.ts` no meio desta lista troca as quatro artes de lugar. Vale
   assim mesmo porque é o pareamento que a issue fixou em tabela, e o dado não tem
   chave nenhuma para casar (os `term` são frases longas de campanha).
   `?? CAPA` no uso: item sem arte volta ao placeholder em vez de furar a coluna.
   As quatro são fotos 1254x1254 (medido no IHDR), e a coluna do card é um retrato
   estreito — daí `object-cover` continuar certo: recorta as laterais de uma foto,
   que é o que ela suporta. Se um dia entrar diagrama aqui, `object-cover` passa a
   ser o defeito. */
const ARTES_O_QUE_FAZ = [
  '/images/solucoes/geraoferta.png',
  '/images/solucoes/definepersonas.png',
  '/images/solucoes/aumentavenda.png',
  '/images/solucoes/validaoferta.png',
];
const ICONES_TRILHO = [Database, Users, Star];
const ICONES_POSICIONAMENTO = [Share2, Trophy, Lightbulb];

/* Qual dos parágrafos do "Posicionamento" vai para o balão sobre a foto. Constante
   nomeada e não `1` solto em dois lugares: o índice é lido duas vezes (para tirar da
   coluna e para pôr no balão), e os dois usos têm de concordar — escritos à mão,
   divergiriam e o parágrafo apareceria duas vezes ou nenhuma. */
const BALAO = 1;

/* ── AJUSTE DE PEDIDO (3ª volta) — O FUNDO TÉCNICO EM TODAS AS SEÇÕES ─────────
   Pedido: «faltou os efeitos com quadradinhos, as linhas dinâmicas, as linhas
   discretas atrás também — em tudo nessa página; tem essas referências em
   /sistran-university e /sistran-labs».

   As duas referências mandadas são DUAS COISAS DIFERENTES, e por isso são dois
   componentes e não um com props de cor:
   · a folha CLARA (1ª imagem) é malha de pontos em manchas mascaradas mais
     quadrados pálidos — o grafismo de `.university-programa-acentos`, que a
     `/sistran-labs` já reusou em `.labs-intro-acentos`;
   · o campo NAVY (2ª imagem) é grade de linhas mais quadradinho ciano ACESO com
     trilha de cotovelo — `.grade-tecnica` mais o `<svg>` de circuito do Unidep.

   O QUE NÃO É NOVO: as linhas discretas das seções claras JÁ ESTAVAM na página,
   e continuam de onde vêm — `.section-light::before` desenha a malha de 96px e
   `::after` o pontilhado. É por isso que os acentos são um NÓ e não um
   pseudo-elemento: os dois pseudos da seção estão ocupados, exatamente como a
   nota de `.labs-intro-acentos` registra. O que faltava nas seções claras eram
   as MANCHAS de ponto fino e os quadrados; nas escuras faltava tudo.

   A TRILHA É DINÂMICA AQUI e estática na University. É desvio consciente e tem
   razão: a issue pede a página «muito interativa» e o item 7 já fez o fio do
   trilho correr. Uma trilha de circuito parada ao lado de um fio correndo seria
   a mesma linguagem com duas leis. O movimento é um traço claro percorrendo o
   caminho por `stroke-dashoffset` (não `offset-path`, não um nó viajando): o
   caminho é o mesmo dado que a linha base desenha, então não há duas geometrias
   a manter em acordo. Os dois canais de movimento reduzido apagam o traço e
   deixam a linha base — que é a arte da referência.

   SEM `<defs>`, SEM `id`, SEM `<linearGradient>`: o circuito do Unidep é UM por
   rota, e este é montado QUATRO vezes na mesma página — quatro `id="…"` iguais
   no documento é `id` duplicado, e o `url(#…)` de cada instância passaria a
   apontar para a primeira. As pontas somem por `mask-image` no CSS, que é por
   elemento e não por documento. */
function AcentosClaros() {
  /* `aria-hidden` porque é grafismo puro: sem ele o leitor de tela anuncia um nó
     vazio antes do conteúdo da seção. */
  return <span aria-hidden className="matchai-acentos" />;
}

/* O CIRCUITO. `viewBox` FIXO e `preserveAspectRatio` no padrão (`meet`), ao
   contrário do Unidep, que usa `slice` com o `viewBox` na ALTURA MEDIDA da seção.
   A razão de divergir: com `slice` a arte depende da altura da caixa, e aqui são
   quatro caixas de alturas diferentes que ainda vão mudar de altura ao mudar
   copy — seria um número medido a recalibrar por seção, e a nota do Unidep conta
   que na 1ª volta dele esse acoplamento jogou os grafismos das pontas fora da
   tela. Como CANTO de tamanho próprio (o CSS dá a largura e `aspect-ratio: 1`),
   o quadrado continua quadrado em qualquer largura e nada depende de medição. */
function CircuitoCanto({ className }: { className: string }) {
  return (
    <svg aria-hidden className={`matchai-circuito ${className}`} viewBox="0 0 320 320">
      {/* O caminho é o da 2ª referência: sai do quadrado aceso, corre na
          horizontal, faz o cotovelo arredondado e desce. `pathLength="1"`
          normaliza o comprimento, e é isso que deixa o `stroke-dasharray` do
          traço em movimento ser escrito em FRAÇÃO no CSS — sem ele, cada
          caminho exigiria o seu próprio comprimento em px. */}
      <path className="matchai-circuito-linha" pathLength="1" d="M 46 40 H 214 Q 240 40 240 66 V 300" />
      <path className="matchai-circuito-linha" pathLength="1" d="M 320 148 H 118 Q 92 148 92 174 V 320" />
      {/* O MESMO `d` das duas linhas, por cima: é o traço que corre. Dois nós e
          não um, porque um `stroke` não pode ter dois `dasharray` ao mesmo tempo
          — e repetir o `d` numa variável não daria para fazer, já que este é
          markup e não haveria onde guardá-la sem inventar um terceiro conceito. */}
      <path className="matchai-circuito-pulso" pathLength="1" d="M 46 40 H 214 Q 240 40 240 66 V 300" />
      <path
        className="matchai-circuito-pulso matchai-circuito-pulso--2"
        pathLength="1"
        d="M 320 148 H 118 Q 92 148 92 174 V 320"
      />
      {/* O quadradinho ACESO (um por instância, como na referência: o aceso é
          evento, o pálido é textura) e dois pálidos. O halo e a pulsação moram no
          CSS — `filter` inline, como o Unidep faz, não daria onde desligar o
          brilho no movimento reduzido. */}
      <rect className="matchai-circuito-aceso" x="26" y="20" width="40" height="40" rx="9" />
      <rect className="matchai-circuito-palido" x="222" y="130" width="44" height="44" rx="10" />
      <rect className="matchai-circuito-palido" x="60" y="238" width="30" height="30" rx="7" />
    </svg>
  );
}

export default function MatchAiPagina({ page }: { page: AcceleratorPage }) {
  const oQueFaz = bloco(page, 'O que o Match AI faz?');
  const trilho = bloco(page, 'Da base à oferta mais relevante');
  const posicionamento = bloco(page, 'Posicionamento');
  /* As três colunas do Posicionamento são o único bloco de lista SEM título do
     dado — ver a nota lá. Achá-lo por ausência de `heading` é o que evita
     depender da posição dele. */
  const colunas = itens(page.blocks.find((b) => b.kind === 'list' && !b.heading));
  /* 6ª VOLTA — o modal «Fale com a gente» do CTA do hero. Um estado só: o
     `ContactModal` já cuida de `showModal()`, do portal, da pausa do scroll suave
     e da devolução do foco ao gatilho. */
  const [contatoAberto, setContatoAberto] = useState(false);

  return (
    <>
      {/* ── 1. HERO DIVIDIDO ─────────────────────────────────────────────────
          A abertura desta slug deixa de ser `PageHero` + `HeroImageBackdrop`: a
          mock põe título e lead numa coluna e a foto na outra, e a capa que a
          SIS-286 trouxe continua em cena — ela migra de fundo da abertura para
          foto da direita. Nada da arte foi descartado.

          `id="topo"` é obrigatório e não decorativo: é a âncora que o item
          "Início" do indicador lateral usa (`src/data/pageSections.ts`), e ela
          vinha do `PageHero`, que esta slug não monta mais.

          O fundo segue o NAVY da rota, e essa é a divergência consciente em
          relação à mock (que é clara de cima a baixo): o cabeçalho fixo do site é
          desenhado para tinta clara, e abrir esta rota em fundo claro deixaria a
          navegação sem contraste — problema de outra issue. As seções claras da
          mock vêm abaixo, em `.section-light`, que é como as outras rotas da casa
          alternam. Está reportado no comentário da issue. */}
      {/* `overflow-clip` NO LUGAR DE `overflow-hidden` (era
          `className="relative overflow-hidden py-16 md:py-24"`), e a troca é
          exigência da malha: `.grade-tecnica` resolve o tile com
          `background-attachment: fixed` para que TODA seção escura do site mostre
          a mesma linha na mesma altura de tela (a correção da SIS-76, com a razão
          escrita no `globals.css`), e `overflow: hidden` cria contêiner de rolagem
          — que é o que faz `fixed` deixar de se ancorar na janela. A `/solucoes`
          e o Unidep resolvem isso com `overflow-x-clip`, que aqui NÃO serve: os
          dois orbes de `blur(130px)` estouram a caixa em cima e embaixo e
          invadiriam as seções vizinhas. `overflow: clip` recorta nos dois eixos
          SEM criar contêiner de rolagem — é o único valor que atende às duas
          coisas. */}
      {/* ── AJUSTE DE PEDIDO (4ª volta): O HERO É A ARTE SANGRADA ──────────────
          A grade de duas colunas saiu. Era:

            <section id="topo" className="relative overflow-clip py-16 md:py-24">
            …
            <RevealScope className="container-lp relative z-10 grid items-center gap-10
                                    lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]" …>

          e com ela saíram OS DOIS ORBES de `blur(130px)`:

            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute -top-32 left-1/4 h-[480px] w-[480px] rounded-full bg-[#57B7EE]/25 blur-[130px]" />
              <div className="absolute -bottom-24 right-0 h-[400px] w-[400px] rounded-full bg-[#0ed8f6]/15 blur-[130px]" />
            </div>

          Eles existiam para dar relevo a um fundo CHAPADO; sobre foto viram névoa
          azul em cima da cara das pessoas. (De lambuja, eram eles que impediam o
          `overflow-x-clip` — sem os orbes, `clip` nos dois eixos continua certo,
          agora porque é a ARTE que precisa ser recortada na caixa.)

          A ALTURA MÍNIMA é o que garante que a arte apareça como arte: sem ela a
          faixa passa a ter a altura do texto, e num idioma mais curto o banner
          viraria uma tira. `min-h` e não `aspect-ratio` porque o texto é que não
          pode ser cortado — se a copy crescer, a faixa cresce. */}
      {/* ── AJUSTE DE PEDIDO (5ª volta): «faça igual a capa de /esg» ───────────
          A altura era `min-h-[27rem] … lg:min-h-[34rem]`. A capa de `/esg` é mais
          ALTA, e o número dela não é redondo: `.pagehero-entrada` (`globals.css`)
          é `min-height: 46svh` e `58svh` de `1024px` para cima. A 900px de janela
          — a altura medida no relatório — isso dá 414px (25,9rem) e 522px
          (32,6rem); a 1080px, 497px e 626px (38,9rem).
          Aqui a altura fica em `rem` e não em `svh`, e é desvio consciente: esta
          faixa é um BANNER, não uma superfície de cor — em `svh` o recorte de
          `cover` da arte mudaria de enquadramento com a barra de URL do celular no
          meio da rolagem, que é justamente o que `svh` existe para acompanhar numa
          faixa de fundo chapado. Os dois valores são os de `/esg` MEDIDOS na janela
          de 900px da sonda (414px = 25,9rem e 528px = 33rem), arredondados para
          cima na casa do rem — a primeira tentativa desta volta foi 28/38rem e a
          sonda mostrou a faixa 80px mais ALTA que a referência a 1440. Em janela
          mais alta que 900 a `/esg` cresce e esta não: é o preço de não usar `svh`,
          e é o preço certo aqui, porque o que não pode escorregar é o recorte da
          arte. */}
      {/* ── AJUSTE DE PEDIDO (6ª volta): «a imagem deve estar atrás do navbar
          também», «tirar essa faixa azul que tem atrás» ────────────────────────
          Era:

            className="relative flex min-h-[26rem] items-center overflow-clip py-16 md:py-24 lg:min-h-[33rem]"

          O `overflow-clip` SAIU, e a razão é aritmética: a arte agora estoura a
          caixa POR CIMA (ver o `-top-28 md:-top-36` do embrulho) para cobrir a
          faixa de `pt-28 md:pt-36` que o `PageShell` põe no `<main>` — e é essa
          faixa de padding, pintada com o fundo navy da rota, que aparece na
          captura do pedido como «faixa azul atrás do navbar». Qualquer recorte
          nesta seção corta exatamente o pedaço que o pedido manda mostrar, e
          `overflow-x-clip` não serve de meio-termo: pela CSS Overflow 3, com um
          eixo em `clip` o eixo `visible` computa `clip` também.
          O clip existia por um motivo que esta volta REMOVEU: ele era exigência
          de `.grade-tecnica` (`background-attachment: fixed`, SIS-76) e do
          circuito, os dois nós que saíram daqui na mesma volta. Sem eles não há
          nada dentro da seção que precise ser recortado — a arte é `fill` com
          `object-cover`, que não vaza do próprio embrulho.
          O cabeçalho continua NA FRENTE da arte, e isso é medido, não sorte:
          `Header.tsx:468` é `fixed … z-50` e a arte nasce em `z-index: auto`. */}
      <section
        id="topo"
        className="relative flex min-h-[26rem] items-center py-16 md:py-24 lg:min-h-[33rem]"
      >
        {/* A ARTE. `object-[68%_center]` abaixo de `lg` e centro a partir dali: em
            tela estreita o recorte de `cover` comeria justamente o lado direito, que
            é onde estão as pessoas e os quadradinhos de ramo — o lado esquerdo é
            navy chapado e não perde nada ao ser cortado. A partir de `lg` a faixa é
            larga o bastante para mostrar a composição inteira.
            `data-route-critical-media` MIGROU PARA CÁ da foto da coluna: o portão de
            rota (`loading/RouteLoadGate.tsx`) tem de esperar a maior imagem acima da
            dobra, e agora é esta. */}
        {/* ── AJUSTE DE PEDIDO (6ª volta): A ARTE SOBE ATRÁS DO NAVBAR ─────────
            Era `className="absolute inset-0"`.

            Os dois valores NÃO são escolha estética: são o `pt-28 md:pt-36` que o
            `PageShell` põe no `<main id="conteudo">` — 7rem e 9rem —, que é
            exatamente a distância entre o topo da janela e o começo do conteúdo.
            É a MESMA receita já medida em `/esg`: `.hero-backdrop-midia`/`-veu`
            valem `inset: -7rem 0 0 0` e `-9rem` de 768px para cima, com a razão
            escrita no `globals.css` («sobe atrás do header em vez de parar
            embaixo dele»). Reaproveitar o número em vez de inventar um é o que
            garante que a emenda feche: sobrar 1px deixa a linha dura de volta.
            Não uso a classe `.hero-backdrop-midia` porque ela traz o degradê de
            base navy e `overflow: hidden` do vídeo do `HeroImageBackdrop` — aqui
            a mídia é uma foto sangrada, e o degradê ficaria por baixo sem nunca
            aparecer.

            A SOMBRA LEVE («coloque a sombra levemente para imagem que está na
            capa») fica NO EMBRULHO e só para BAIXO: o embrulho é uma caixa opaca
            do tamanho da faixa, então um `box-shadow` com deslocamento vertical
            positivo desenha a sombra sobre a seção clara seguinte — é o relevo que
            o pedido descreve, e a faixa passa a ler como peça apoiada sobre a
            página. Deslocamento só para baixo, e não `0 0`: com espalhamento para
            cima a sombra cairia justamente na tira que esta volta acabou de
            descobrir atrás do cabeçalho, pintando de novo uma faixa escura ali.
            `box-shadow` e não `filter: drop-shadow`: `filter` cria contexto de
            empilhamento e faz o `position: fixed` do cabeçalho se ancorar no nó
            filtrado (está anotado na habilidade de `filters`), o que devolveria o
            defeito do navbar pelo outro lado. */}
        <div
          aria-hidden
          className="absolute -top-28 right-0 bottom-0 left-0 shadow-[0_18px_44px_-18px_rgba(0,12,30,0.55)] md:-top-36"
        >
          <Image
            data-route-critical-media=""
            src={CAPA_HERO}
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover object-[68%_center] lg:object-center"
          />
          {/* DOIS VÉUS, um por eixo, e não um só: a leitura do texto muda de eixo
              com a largura. Abaixo de `lg` o texto cai SOBRE a foto (o recorte
              empurrou o navy chapado para fora), então o véu é vertical; de `lg`
              para cima o texto volta para a região chapada da própria arte e o véu é
              horizontal, só reforçando o que a arte já faz — daí ele terminar em
              transparente antes da metade direita, para não apagar a foto.
              Os dois são medidos na sonda pelo pixel COMPOSTO sob o texto; nenhuma
              das opacidades aqui é palpite de olho. */}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,26,61,0.94)_0%,rgba(0,26,61,0.88)_42%,rgba(0,26,61,0.55)_78%,rgba(0,26,61,0.35)_100%)] lg:hidden" />
          <div className="absolute inset-0 hidden lg:block lg:bg-[linear-gradient(90deg,#001A3D_0%,rgba(0,26,61,0.94)_28%,rgba(0,26,61,0.72)_44%,rgba(0,26,61,0.18)_62%,rgba(0,26,61,0)_78%)]" />
        </div>
        {/* A malha da casa para seção escura, e o circuito por cima dela — a ordem
            da 2ª referência (linhas de grade no plano de trás, trilha e quadrados
            na frente). O empilhamento é o par 0/1 entre irmãos, escrito no CSS, e
            não `z-index: -1`: com negativo «o quanto atrás» depende de qual
            ancestral é o contexto de empilhamento, e o próprio defeito está medido
            duas vezes neste arquivo (a foto do trilho, que sumia) e no Unidep. */}
        {/* ── AJUSTE DE PEDIDO (6ª volta): «retire esses quadrados da capa» ─────
            Saíram os dois nós de grafismo DESTA faixa. Eram:

              <div aria-hidden className="grade-tecnica matchai-grade" />
              <CircuitoCanto className="matchai-circuito--hero" />

            A malha (`.grade-tecnica`) é que desenha os quadradinhos de 96px
            riscados por cima da foto na captura do pedido, e o circuito é que põe
            os três retângulos arredondados com halo no canto de cima. Sobre fundo
            CHAPADO os dois são a textura da casa; sobre a foto do banner viram
            grade riscada na cara das pessoas — e é essa grade que o pedido aponta.

            O ITEM 10 DA SIS-292 («quadradinhos e linhas em tudo nessa página»)
            CONTINUA CUMPRIDO: os dois grafismos seguem montados nas outras faixas
            da rota (faixa clara da campanha, «O que o Match AI faz?», trilho,
            Posicionamento e «Conheça também»). O que esta volta retira é a
            instância do HERO, que é a única sobre foto — e é retirada por pedido
            explícito, o que é diferente de abrir buraco no critério.

            OS QUADRADINHOS DE RAMO (auto, residencial, vida, viagem) NÃO SAEM, e
            não é escolha minha: eles estão desenhados DENTRO de
            `possivelcapanovamatch.png` (ver o docblock de `CAPA_HERO`). Tirá-los
            exigiria arte nova, não CSS. `CircuitoCanto` segue em uso nas demais
            faixas, então a função permanece. */}
        {/* `esperarRota` SÓ AQUI, e é o contrato que a SIS-269 fixou: espera quem
            está NA DOBRA, onde a cortina do `RouteLoadGate` esconderia a animação.
            Os escopos das outras quatro seções nascem abaixo dela e não esperam —
            ganhar um observador no instante em que a cortina sobe é como se produz
            o «acendeu tudo depois do load». A COLUNA DA FOTO ENCOLHEU (item 1,
            «capa menor no topo»): a grade era `1fr_1fr` e passa a dar mais peso ao
            texto, e a foto ainda recebe um teto próprio de largura.
            4ª VOLTA: UMA COLUNA SÓ — a arte ocupa a faixa inteira e o texto tem de
            caber na região chapada dela. O teto é em medida de TEXTO (`ch`) e não
            `max-w-xl`, porque o que limita aqui é a linha: ~46 caracteres é a faixa
            confortável de leitura, e é ela que mantém o bloco longe das pessoas na
            arte em qualquer largura. */}
        {/* ── AJUSTE DE PEDIDO (5ª volta): O BLOCO ENCOSTA NA ESQUERDA ──────────
            Era:

              className="container-lp relative z-10 max-w-[46ch] lg:max-w-[52ch]"

            e era ISSO que fazia a capa ler como "texto flutuando no meio", que é o
            que a captura do pedido mostra. O defeito é de camada, não de gosto:
            `.container-lp` é `max-width` + `mx-auto`, então um `max-w-[46ch]` no
            MESMO nó não limita o texto dentro do container — encolhe o container
            centrado, e um container estreito centrado fica no meio da tela por
            definição. O teto desce para o PARÁGRAFO (abaixo, `max-w-[46ch]`), que é
            o único nó aqui que precisa de medida de leitura, e o container volta a
            ter a largura da página: o bloco nasce na borda esquerda dele, como em
            `/esg` — que resolve o mesmo problema com `max-width: none` no CSS pela
            razão oposta (lá o container é do `PageHero`, que serve outras treze
            rotas e não pode receber classe nova).

            O RECUO EXTRA DE `/esg` (`padding-left: 10rem` de 1280px para cima, em
            `.hero-backdrop--esg`) NÃO vem junto, e a razão está escrita na nota
            daquela regra: os 10rem existem para a manchete não encavalar a coluna
            do navegador lateral de seções (`ui/ScrollSpy`), que ali desenha o
            rótulo aberto a ~112px da borda. Este hero está na mesma rota do mesmo
            indicador, então o respiro é necessário — mas `.container-lp` já o dá
            pelo próprio padding, e somar 10rem por cima jogaria o bloco para o
            meio outra vez, desfazendo o pedido. O alinhamento medido é o da borda
            do container. */}
        <RevealScope
          className="container-lp relative z-10"
          esperarRota
          limiar={LIMIAR_REVEAL}
          margem={MARGEM_REVEAL}
          data-reveal-nome="matchai-hero"
        >
          <div>
            {/* O CARIMBO SUBSTITUI A TAG TEXTUAL (item 1). Era:

                  <motion.span variants={vSubtitle} className="eyebrow !text-[#A5F0FF]">
                    Tecnologia Disruptiva
                  </motion.span>

                É o padrão de `/parceiros` e `/sistran-labs`: mesma peça, mesma
                batida de entrada, mesmo tratamento dos dois canais de movimento
                reduzido — nada de GSAP ad hoc aqui.
                `gatilho="rota"` porque esta arte vive ACIMA da dobra, e ali
                liberar o portão e entrar em quadro são o mesmo instante (o
                gatilho de viewport existe para quem nasce a milhares de px do
                topo, como a seção da SIS-188).
                O `alt` e o TAMANHO mudaram na 5ª volta — ver o `h1` logo abaixo,
                que é onde a arte passou a morar. */}
            {/* ── AJUSTE DE PEDIDO (5ª volta): A LOGO NO LUGAR DA ESCRITA ────────
                Pedido: «no lugar da escrita Matchai coloque a logo». Saíram DOIS
                nós e entrou um. Era, em sequência:

                  <CarimboBatida
                    src={CARIMBO.src}
                    alt=""
                    larguraIntrinseca={CARIMBO.largura}
                    alturaIntrinseca={CARIMBO.altura}
                    className="matchai-carimbo"
                    gatilho="rota"
                  />
                  <h1 data-reveal="fade-up" style={cascata(1)} className="mt-4 font-display tracking-tight text-white">
                    <strong className="block text-pagehero-medio font-bold">{page.name}</strong>
                  </h1>

                — a arte como etiqueta pequena EM CIMA e o nome escrito logo abaixo,
                que é o par que o pedido manda desfazer. A arte não é um terceiro
                elemento novo: ela DESCE para dentro do `h1` e ocupa o lugar do
                texto, e é por isso que a peça continua sendo o `CarimboBatida` e não
                um `<Image>` cru — a batida de entrada, os dois canais de movimento
                reduzido e a espera do `RouteLoadGate` já vivem nele, e refazer isso
                à mão aqui seria GSAP ad hoc num hero acima da dobra.

                O `alt` DEIXA DE SER VAZIO, e isso é obrigatório, não estilo: este é
                o ÚNICO `h1` da rota, e um `h1` cujo conteúdo inteiro é uma imagem
                com `alt=""` é um cabeçalho sem nome acessível — a rota perderia a
                manchete para leitor de tela e para o sumário de documento. O texto
                do `alt` é `page.name`, o mesmo dado que a escrita usava: a grafia na
                tela e a grafia anunciada saem da mesma fonte e não podem divergir.
                (A arte NOVA também escreve «Match AI» corretamente — ver `LOGO`; com
                a antiga, este `alt` contradiria o pixel.)

                `className` com as DUAS classes: `.matchai-logo-hero` dá a largura de
                manchete e `carimbo-batida` é a que o componente concatena — o
                empate de especificidade está explicado no `globals.css`.
                `gatilho="rota"` continua: a arte vive acima da dobra, onde liberar o
                portão e entrar em quadro são o mesmo instante. */}
            {/* ── AJUSTE DE PEDIDO (7ª volta): CARIMBO MENOR, LOGO EMBAIXO ───────
                Pedido: «diminua o carimbo e embaixo dele coloque a logo». Era UM nó
                (a cápsula DENTRO do `h1`, fazendo de manchete) e voltam a ser DOIS,
                na ordem do pedido: a cápsula SAI do `h1` e volta a ser etiqueta
                acima dele, e o `h1` passa a conter o letreiro da marca. Era:

                  <h1 data-reveal="fade-up" style={cascata(1)} className="font-display">
                    <CarimboBatida … className="matchai-logo-hero" gatilho="rota" />
                  </h1>

                O «DIMINUA» é de CSS e não daqui: a cápsula volta à classe
                `.matchai-carimbo`, cujo `clamp(8.5rem, 11vw, 10.5rem)` é o tamanho de
                etiqueta JÁ MEDIDO desta arte (158px a 1440) — a regra ficou no
                `globals.css` de propósito quando ficou dormente, exatamente para esta
                hipótese. Não inventei um terceiro valor.

                `alt=""` DE VOLTA na cápsula, e é obrigatório: o nome acessível da
                rota passa para o letreiro, que é o conteúdo do `h1`. Duas artes
                nomeadas fariam o leitor de tela dizer o nome do produto duas vezes.
                `gatilho="rota"` continua — a peça vive acima da dobra, onde liberar o
                portão e entrar em quadro são o mesmo instante. */}
            <CarimboBatida
              src={CARIMBO.src}
              alt=""
              larguraIntrinseca={CARIMBO.largura}
              alturaIntrinseca={CARIMBO.altura}
              className="matchai-carimbo"
              gatilho="rota"
            />
            {/* O LETREIRO É A MANCHETE. `<Image>` cru e não `CarimboBatida`: a
                entrada de carimbo é a pancada da CÁPSULA, que está logo acima —
                repeti-la aqui seria a mesma peça duas vezes na mesma dobra. O
                letreiro entra pela cascata de `fade-up` do próprio `h1`, que é a
                entrada das manchetes desta rota, e por isso também não há GSAP ad hoc
                nem canal de movimento reduzido a tratar à mão: `data-reveal` já é
                desligado nos dois canais.
                `priority` porque é a manchete acima da dobra; `data-route-critical-media`
                NÃO vem para cá, e é escolha: o portão de rota espera a MAIOR mídia da
                dobra, que continua sendo a foto sangrada da capa (1672x941).
                As dimensões intrínsecas vão nas props — é o que reserva a caixa e o
                que mantém a razão 6,68:1 com um único dono; a largura de uso mora em
                `.matchai-marca-hero`. */}
            <h1 data-reveal="fade-up" style={cascata(1)} className="mt-4 font-display">
              <Image
                src={MARCA.src}
                alt={page.name}
                width={MARCA.largura}
                height={MARCA.altura}
                priority
                className="matchai-marca-hero"
              />
            </h1>
            {/* 4ª VOLTA: A LEAD DO HERO É A `lead` DO DADO — a frase curta que a
                mock põe sob o nome («Permite à seguradora capacitar o corretor…»),
                e que é literalmente `page.lead` em `acceleratorPages.ts`. O
                parágrafo longo com PERSONALIZAÇÃO desceu para a faixa clara, onde a
                mock o desenha; ele estava aqui assim:

                  Uso da IA para gerar acurácia em ofertas inteligentes, maximizando
                  a <mark …>PERSONALIZAÇÃO</mark> da proposta (suitability) e
                  empoderando o corretor ou agente na venda individualizada.

                Nada de copy digitada: a lead vem do dado, como o nome. */}
            <p
              data-reveal="fade-up"
              style={cascata(2)}
              /* `max-w-[46ch]` DESCEU DO `RevealScope` para cá na 5ª volta (ver a
                 nota lá): a medida de leitura é deste parágrafo, e no container ela
                 encolhia o próprio container centrado. `ch` e não `max-w-xl` porque
                 o que limita é a LINHA — ~46 caracteres é a faixa confortável, e é
                 ela que mantém o texto longe das pessoas na arte em qualquer
                 largura. */
              className="mt-5 max-w-[46ch] text-lg leading-relaxed text-white/85 lg:max-w-[52ch]"
            >
              {page.lead}
            </p>
            {/* O BOTÃO da mock. `/contato` e não `#contato`: esta rota não monta
                formulário — quem monta é a página de contato, e o CTA «Fale com a
                Gente» do fim da rota leva ao mesmo lugar. Rótulo com a seta que a
                mock desenha.
                NÃO É `.btn-primary`: a pílula da casa é degradê de `#0ed8f6` a
                `#0079cb` com tinta branca, e branco sobre a ponta clara do degradê
                não passa no piso de 4,5 — usá-la aqui seria importar um defeito de
                contraste para dentro de um hero novo. A combinação escolhida é a que
                já está MEDIDA nesta rota em 8,9:1 (ciano chapado `#0ed8f6` com tinta
                navy `#032033`, a mesma do realce PERSONALIZAÇÃO) — e é também o que a
                mock desenha: pílula clara com letra escura. O piso da pílula da casa
                é assunto de outra issue. */}
            {/* ── AJUSTE DE PEDIDO (6ª volta): «no botão fale com especialista
                abra o modal Fale com a gente» ───────────────────────────────────
                Era:

                  <Link href="/contato" className="mt-8 inline-flex …">

                Deixa de ser NAVEGAÇÃO e passa a ser AÇÃO na própria página, então
                deixa de ser `<Link>` e passa a ser `<button type="button">` — um
                `<a>` que não vai a lugar nenhum é link falso para leitor de tela e
                para o teclado. As classes de aparência são as mesmas, letra por
                letra: a pílula medida em 9,67:1 não muda de desenho, só de papel.
                (`Link` continua importado: é ele que monta «Conheça também».)

                O MOLDE É O DO CABEÇALHO, não um arranjo novo: `Header.tsx:916`
                monta `<ContactModal open={contactOpen} onClose={() =>
                setContactOpen(false)} />` SEM `title`/`description`, de propósito —
                os defaults do componente são justamente a escrita «Fale com a
                gente» que o pedido nomeia. Passar texto próprio aqui faria a mesma
                peça dizer duas coisas diferentes na mesma rota.
                O estado vive neste componente porque ele já é `'use client'` (linha
                1) — nada foi convertido para isso. */}
            <p data-reveal="fade-up" style={cascata(3)}>
              <button
                type="button"
                onClick={() => setContatoAberto(true)}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#0ed8f6] px-6 py-3 text-sm font-semibold text-[#032033] transition-colors hover:bg-[#A5F0FF]"
              >
                Fale com um especialista
                <ArrowRight className="h-4 w-4" strokeWidth={2.2} aria-hidden />
              </button>
            </p>
          </div>
        </RevealScope>
      </section>

      {/* ── 1b. FAIXA CLARA DA CAMPANHA (4ª volta) ───────────────────────────
          A segunda metade da mock: fundo claro, a frase de campanha como título
          de seção, o parágrafo longo com PERSONALIZAÇÃO e a foto com as duas
          fichas flutuantes. Não é seção nova de CONTEÚDO — é o conteúdo que
          estava no hero, realocado; nenhuma linha de texto foi inventada aqui.
          `aria-labelledby` aponta para o `h2`: a faixa é uma região nomeada, como
          as outras quatro, e não um pedaço solto do hero.
          `overflow-clip` e não `hidden`, pelo mesmo motivo das demais faixas: o
          `hidden` cria contêiner de rolagem e desancora o `background-attachment:
          fixed` da malha de 96px de `.section-light::before` (SIS-76).
          Os dois grafismos do item 10 entram aqui também — «em tudo nessa
          página» passa a incluir esta faixa, senão a 4ª volta abriria um buraco
          no critério que a 3ª acabou de fechar. */}
      <section
        className="section-light section-light-blue section-py relative overflow-clip"
        aria-labelledby="matchai-campanha"
      >
        <AcentosClaros />
        <CircuitoCanto className="matchai-circuito--claro" />
        {/* SEM `esperarRota`: esta faixa nasce abaixo da dobra, e o contrato da
            SIS-269 é que só o escopo da dobra espera o portão de rota. */}
        <RevealScope
          className="container-lp relative z-10 grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
          limiar={LIMIAR_REVEAL}
          margem={MARGEM_REVEAL}
          data-reveal-nome="matchai-campanha"
        >
          <div>
            {/* A FRASE DE CAMPANHA, que era a segunda linha do `h1`. Ela continua
                em negrito — é o primeiro item da lista fechada de negritos (item
                3) — e aqui vira `h2`, o que ela sempre foi na prática: título de
                uma faixa, não parte do nome do produto. A tinta vem de
                `.section-light` (navy), como nos outros `h2` claros. */}
            <h2
              data-reveal="fade-up"
              id="matchai-campanha"
              className="font-display text-section font-bold text-ink"
            >
              Ofertas inteligentes. Conversas mais relevantes.
            </h2>
            {/* A LEAD LONGA, vinda do hero sem uma palavra trocada. O realce é
                `<mark>` e não um `<span>` colorido: a palavra está realçada por
                relevância, que é exatamente o que o elemento significa — e assim o
                realce sobrevive a quem lê sem CSS. O `background` é reescrito
                porque o padrão do navegador é amarelo.
                A PALETA MUDOU DE FUNDO, então mudou de tinta: sobre faixa clara o
                ciano `#0ed8f6` a 14% mede 1,03:1 (medido na 3ª volta), logo o
                realce aqui é o azul institucional `#0079CB` com tinta branca — a
                mesma combinação do Fast, medida acima de 4,5. O par ciano+navy do
                hero continua válido LÁ, sobre navy. */}
            <p
              data-reveal="fade-up"
              style={cascata(1)}
              className="mt-5 max-w-2xl text-lg leading-relaxed text-muted"
            >
              Uso da IA para gerar acurácia em ofertas inteligentes, maximizando a{' '}
              {/* `!text-white` E NÃO `text-white`, e a razão está MEDIDA: a rede de
                  segurança de `.section-light` (`[class*="text-white"] { color:
                  #0a1f44 }`, globals.css:1115) existe porque tinta branca em faixa
                  clara é quase sempre defeito — e ela pintou este realce de navy
                  sobre azul, 2,51:1 na primeira execução da sonda. Aqui o `<mark>`
                  é uma ILHA ESCURA dentro da faixa clara, o caso que a própria
                  rede prevê; a saída da casa é `.on-dark`, mas ela dá
                  `rgba(255,255,255,0.88)` a tudo dentro do nó, e para um realce de
                  uma palavra a tinta chapada é o número que se pode medir sem
                  compor alfa. */}
              <mark className="rounded bg-[#0060A8] px-1.5 py-0.5 font-semibold !text-white">
                PERSONALIZAÇÃO
              </mark>{' '}
              da proposta (suitability) e empoderando o corretor ou agente na venda
              individualizada.
            </p>
          </div>

          {/* A FOTO. `alt=""` + `aria-hidden` pelo mesmo critério da SIS-286: a
              arte desenha o que o título nomeia e o parágrafo explica, e o
              letreiro «MATCH AI» que ela traz é desenho, não texto a publicar.

              4ª VOLTA: ELA DESCEU PARA CÁ, e por isso PERDEU DUAS MARCAS. Era:

                data-route-critical-media=""
                priority

              As duas eram certas enquanto esta era a maior imagem ACIMA da dobra:
              o portão de rota espera pelo nó marcado (`loading/RouteLoadGate.tsx`)
              e `priority` tira a imagem da fila preguiçosa. Agora quem está na
              dobra é o banner sangrado do hero, e foi para lá que as duas foram —
              manter a marca aqui faria o portão esperar por uma imagem que o
              visitante só vê depois de rolar, atrasando a subida da cortina.

              O TETO DE LARGURA (`max-w-[26rem]` / `30rem` a partir de `lg`) vem do
              item 1 da 2ª volta e continua valendo: a foto é uma coluna da faixa,
              não uma abertura sangrada. `mx-auto` para ela não encostar na borda da
              coluna quando o teto morde.

              AS DUAS FICHAS FLUTUANTES ENTRAM — e isto REVERTE o que estava
              escrito aqui e no comentário da issue. Era:

                "PLACEHOLDER: as duas fichas flutuantes da mock («Oferta ideal»,
                 «Melhor aderência / 98% de compatibilidade») NÃO entram. A de
                 baixo afirma um número que o site não publica em lugar nenhum, e
                 a issue declara as sobreposições opcionais «sem assets»."

              A recusa era minha, por causa do «98%»; foi pedido depois, com
              estas palavras: «deve ficar exatamente assim [mock] com os cards
              flutuantes na frente». Então elas entram, e o cuidado com o número
              vira OUTRA coisa em vez de virar ausência: as duas fichas são
              `aria-hidden` e decorativas, exatamente como a foto que elas cobrem.
              Elas SIMULAM a interface do produto (rótulo, barra de aderência) —
              é desenho de tela, do mesmo tipo que a arte já traz embutido —, e
              assim o «98%» não é publicado como afirmação da Sistran para quem lê
              por leitor de tela nem entra no fluxo de texto da página. Se um dia
              o número virar claim oficial, ele sai daqui para o dado e perde o
              `aria-hidden`. */}
          <div
            data-reveal="scale-soft"
            style={cascata(2)}
            className="relative mx-auto w-full max-w-[26rem] lg:max-w-[30rem]"
          >
            {/* A MOLDURA em faixa clara: a borda passa de `white/12` (invisível
                sobre branco) para o azul institucional a 12%, e a sombra perde a
                profundidade de fundo escuro. */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-[#0079CB]/12 shadow-[0_32px_80px_-40px_rgba(0,26,61,0.35)]">
              <Image
                src={CAPA}
                alt=""
                aria-hidden
                fill
                sizes="(min-width: 1180px) 480px, 100vw"
                className="object-cover"
              />
            </div>

            {/* As fichas ficam FORA do nó com `overflow-hidden` da foto, e é por
                isso que o recorte da imagem não as corta: na mock elas avançam
                para fora da moldura («na frente»), o que dentro do recorte seria
                impossível.
                O ENVELOPE CONTINUA `pointer-events-none`, e são as fichas que
                reabrem o ponteiro (`pointer-events: auto` em `.matchai-ficha`) —
                item 8, «reagir ao hover liberando o necessário sem atrapalhar a
                foto». Assim o vão entre as duas segue atravessável: só os dois
                retângulos capturam o cursor, e arrastar sobre a foto não encontra
                uma caixa morta do tamanho dela. */}
            <div aria-hidden className="pointer-events-none absolute inset-0">
              {/* FICHA DE CIMA, à esquerda. Fundo branco chapado e tinta navy:
                  é ficha de interface clara sobre foto, como a mock desenha, e
                  cor chapada é a única forma de o contraste não depender do pixel
                  da foto que passa atrás. `on-dark` NÃO entra — a tinta aqui é
                  escura de propósito, e na 4ª volta isso deixou de ser exceção:
                  a ficha branca com tinta navy agora vive numa faixa CLARA, que é
                  o mesmo par de cores que `.section-light` já aplica em volta. */}
              <div className="matchai-ficha absolute -left-2 top-6 w-[13.5rem] max-w-[62%] rounded-2xl bg-white/95 p-3.5 shadow-[0_18px_40px_-18px_rgba(0,20,48,0.55)] backdrop-blur-sm sm:-left-4">
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 shrink-0 text-[#0079CB]" strokeWidth={2} />
                  <span data-ficha="titulo" className="font-display text-sm text-[#0a1f44]">Oferta ideal</span>
                </span>
                <span data-ficha="apoio" className="mt-1 block text-xs leading-snug text-[#3C5A7A]">
                  Para o perfil do cliente
                </span>
                {/* A BARRA é `<span>` com largura em `style`, e não `<progress>`:
                    `<progress>` é controle de formulário com semântica de valor, e
                    aqui não há valor publicado — o nó inteiro é `aria-hidden`.
                    A largura é a da mock (parcial nesta, cheia na de baixo). */}
                <span className="mt-2.5 block h-1.5 overflow-hidden rounded-full bg-[#0079CB]/15">
                  <span className="block h-full w-[62%] rounded-full bg-[#0079CB]" />
                </span>
              </div>

              {/* FICHA DE BAIXO, à direita. `--baixo` é só a DEFASAGEM do laço: as
                  duas flutuam no mesmo tempo e a de baixo entra com meio ciclo de
                  atraso, senão as duas sobem e descem em uníssono e a foto inteira
                  parece respirar. */}
              <div className="matchai-ficha matchai-ficha--baixo absolute -right-2 bottom-6 w-[14.5rem] max-w-[66%] rounded-2xl bg-white/95 p-3.5 shadow-[0_18px_40px_-18px_rgba(0,20,48,0.55)] backdrop-blur-sm sm:-right-4">
                <span className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 shrink-0 text-[#0079CB]" strokeWidth={2} />
                  <span data-ficha="titulo" className="font-display text-sm text-[#0a1f44]">Melhor aderência</span>
                </span>
                <span data-ficha="apoio" className="mt-1 block text-xs leading-snug text-[#3C5A7A]">
                  98% de compatibilidade
                </span>
                <span className="mt-2.5 block h-1.5 overflow-hidden rounded-full bg-[#0079CB]/15">
                  <span className="block h-full w-[98%] rounded-full bg-[#0ed8f6]" />
                </span>
              </div>
            </div>
          </div>
        </RevealScope>
      </section>

      {/* ── 2. O QUE O MATCH AI FAZ? ─────────────────────────────────────────
          Grade 2×2 em seção clara, cada card com ícone, título, apoio e a imagem
          à direita. `.section-light` pinta título e texto de navy sozinho — é por
          isso que estes cards NÃO levam `on-dark` (o oposto do que os cartões da
          vitrine precisam). */}
      {oQueFaz && (
        <section
          className="section-light section-light-blue section-py relative overflow-clip"
          aria-labelledby={idDoBloco(oQueFaz.heading!)}
        >
          {/* As manchas de ponto fino e os quadrados pálidos (a 1ª referência). A
              grade discreta de 96px e o pontilhado largo já vêm dos dois
              pseudo-elementos de `.section-light` — daí estes serem um nó.
              `overflow-clip` TAMBÉM AQUI (era `overflow-hidden`): a malha de 96px
              de `.section-light::before` é `background-attachment: fixed` pela
              mesma SIS-76 da versão escura, então o contêiner de rolagem do
              `hidden` a desancorava nesta seção — defeito que já existia e que a
              troca corrige de lambuja. Nada nesta seção estoura a caixa, então
              `clip` recorta exatamente o mesmo que `hidden` recortava. */}
          <AcentosClaros />
          <CircuitoCanto className="matchai-circuito--claro" />
          <RevealScope
            className="container-lp relative z-10"
            limiar={LIMIAR_REVEAL}
            margem={MARGEM_REVEAL}
            data-reveal-nome="matchai-o-que-faz"
          >
            {/* NEGRITO da lista fechada (item 3). O peso é real pelo mesmo
                argumento do `h1` — ver lá. */}
            <h2
              data-reveal="fade-up"
              id={idDoBloco(oQueFaz.heading!)}
              className="font-display text-section font-bold text-ink"
            >
              {oQueFaz.heading}
            </h2>
            <ol className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
              {itens(oQueFaz).map((item, i) => {
                const Icone = ICONES_O_QUE_FAZ[i] ?? Sparkles;
                return (
                  <li
                    key={item.term ?? item.text}
                    data-reveal="fade-up"
                    style={cascata(i + 1)}
                    /* `matchai-cartao` é o COMPORTAMENTO (flutuação em laço +
                       realce sob o ponteiro), pedido com estas palavras: «os cards
                       devem agir igual dos /sistran-university da sessao». A
                       receita está no `globals.css`, ao lado da original, e o
                       porquê de cada escolha (por que `translate` e não
                       `transform`, por que `paused` e não `none`, os dois canais de
                       movimento reduzido) está escrito lá para não haver duas
                       versões da mesma justificativa.
                       `matchai-midia` no PRÓPRIO CARD, e não no quadro da imagem:
                       o gesto da University é a arte deslizar quando o cartão
                       inteiro está sob o ponteiro, não quando o cursor acerta os
                       28px da miniatura.
                       `relative` porque o anel (`matchai-halo`) é `absolute` sobre
                       a borda; `bg-white` chapado em vez de `bg-white/80` porque o
                       cartão SOBE e ESCALA sobre a folha — com fundo translúcido o
                       vizinho aparecia por baixo no instante da sobreposição. */
                    className="matchai-cartao matchai-midia relative flex items-stretch gap-4 rounded-2xl border border-[#0079CB]/18 bg-white p-5"
                  >
                    <span aria-hidden className="matchai-halo" />
                    <div className="relative flex min-w-0 flex-1 flex-col">
                      <Icone
                        aria-hidden
                        className="h-8 w-8 shrink-0 text-[#0079CB]"
                        strokeWidth={1.6}
                      />
                      {/* O ORDINAL SAIU, a pedido («retire os numeros dos cards»).
                          Era, e fica registrado porque a nota de tipografia é a
                          única do arquivo sobre a Mono — ordinal é METADADO, daí
                          `font-mono`, com o peso 600 declarado porque é o único
                          corte da Mono carregado (SIS-155):

                            <span
                              aria-hidden
                              className="mt-4 font-mono text-sm font-semibold tabular-nums text-[#0079CB]"
                              style={{ fontFeatureSettings: '"tnum" 1' }}
                            >
                              {String(i + 1).padStart(2, '0')}
                            </span>

                          O `<ol>` FICA `<ol>`: o site apresenta esta lista numerada
                          (`ordered: true` no dado) e a ordem das quatro etapas
                          continua significando algo para quem lê por leitor de tela.
                          O que saiu é o ordinal DESENHADO, que era `aria-hidden` e
                          portanto nunca foi a semântica — tirar o `<ol>` junto
                          perderia informação que ninguém pediu para perder. */}
                      {/* `font-bold` cobre as QUATRO palavras que o item 3 lista
                          para os cards («hiperpersonalizadas», «Define», «match»,
                          «Aumenta», «Valida ofertas»): todas estão dentro dos
                          `term` deste `h3` — verificado em `acceleratorPages.ts`.
                          Engrossar o título inteiro é o que evita marcar palavra
                          por palavra com `<strong>` dentro de texto que vem do
                          dado, o que exigiria partir a escrita em pedaços aqui. */}
                      <h3 className="mt-4 font-display text-lg font-bold leading-snug text-ink">
                        {item.term}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.text}</p>
                    </div>
                    {/* A ARTE DEFINITIVA DO CARD (item 9). O placeholder saiu; a
                        nota que estava aqui dizia:

                          "PLACEHOLDER: a mock tem uma arte por card; até existirem
                           as quatro, é a capa do Match AI nos quatro, por pedido da
                           issue."

                        …e caducou no momento em que as quatro chegaram a
                        `public/images/solucoes/`. Segue decorativa (`alt=""`) pelo
                        mesmo motivo do hero: o título e o apoio ao lado já dizem o
                        que a foto ilustra.
                        Este nó é o QUADRO (recorta) e a imagem é a ARTE (se move):
                        dois nós, porque um só seria dono do `transform` duas
                        vezes — a colisão que a University registra. */}
                    <div className="relative hidden w-28 shrink-0 overflow-hidden rounded-xl sm:block md:w-32">
                      <Image
                        src={ARTES_O_QUE_FAZ[i] ?? CAPA}
                        alt=""
                        aria-hidden
                        fill
                        sizes="128px"
                        loading="lazy"
                        className="matchai-midia-arte object-cover"
                      />
                    </div>
                  </li>
                );
              })}
            </ol>
          </RevealScope>
        </section>
      )}

      {/* ── 3. DA BASE À OFERTA MAIS RELEVANTE ───────────────────────────────
          Faixa ESCURA, como na mock, e o fundo é DECLARADO aqui.
          A primeira versão desta seção não declarava nada, com o comentário «é o
          navy da própria rota». Isso estava ERRADO e a sonda pegou: o `body` deste
          site é `#1273bc` (`globals.css:385`), azul MÉDIO, não navy. Sem fundo
          próprio, a seção herdava aquele azul e as tintas brancas do trilho
          mediram 4,08:1 (`text-white`) e 3,17:1 (`text-white/80`) contra ele —
          reprovadas no piso de 4,5. Com `#001A3D` chapado, que é o navy profundo
          da marca, o mesmo texto branco passa com folga E a faixa fica escura como
          a mock pede: o defeito de contraste e o item do layout tinham a mesma
          correção. `overflow-hidden` porque o disco do ícone de cada passo sobe
          `-top-6` sobre a borda.

          A CAPA PASSOU PARA TRÁS DA FAIXA, a pedido («melhore deixe mais perto
          dessa deixando a imagem atras»): ela era um cartão na coluna da direita e
          agora é o FUNDO da seção, sob um véu navy. O `bg-[#001A3D]` chapado NÃO
          saiu — ele continua sendo o piso de contraste, e é o véu (`/78` a `/92`,
          mais escuro à esquerda, onde vive o texto) que garante que o número
          medido não passe a depender do pixel da foto. Sem o véu, texto branco
          sobre a metade acesa da arte voltaria ao defeito de 4,08:1 que esta mesma
          seção já teve.
          O cartão da direita SAIU junto, porque a arte não pode estar nos dois
          lugares — seria a mesma imagem duas vezes na mesma faixa. Era:

            <motion.div variants={vCard} className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/12">
                <Image src={CAPA} alt="" aria-hidden fill
                  sizes="(min-width: 1180px) 520px, 100vw" loading="lazy" className="object-cover" />
              </div>
            </motion.div>

          Com ele fora, a grade de duas colunas perdeu a razão de existir e a faixa
          passa a ser uma coluna só, com o trilho ocupando a largura — que é como a
          referência desenha. */}
      {trilho && (
        <section
          className="section-py relative overflow-clip bg-[#001A3D]"
          aria-labelledby={idDoBloco(trilho.heading!)}
        >
          {/* A FOTO DE FUNDO e o véu, os dois `aria-hidden`/decorativos pelo mesmo
              critério da SIS-286.
              `object-position: right` porque a metade ACESA da arte é a direita e a
              esquerda é a escura — é justamente essa assimetria que a torna
              utilizável atrás de texto (a mesma nota está em `capasSolucoes.ts`).

              O `-z-10` QUE ESTAVA AQUI ESCONDIA A FOTO POR COMPLETO, e é a armadilha
              exata que o comentário anterior descrevia ao contrário. Ele dizia: «a
              seção não cria contexto de empilhamento por `position: relative`
              sozinha, e o par negativo mantém o fundo atrás de tudo». A premissa é
              verdadeira e a conclusão é o defeito — justamente PORQUE a seção não
              cria contexto, um filho com z-index negativo desce para trás do
              `background` da PRÓPRIA seção, que aqui é `bg-[#001A3D]` chapado. A
              sonda registrava a imagem montada em 1440×533 e a captura mostrava navy
              liso: ela pintava embaixo do fundo.
              Sem z-index nenhum, a ordem de documento resolve: esta camada vem
              primeiro, o conteúdo (que é `relative`) vem depois e pinta em cima. O
              `bg-[#001A3D]` da seção fica como PISO de contraste por baixo da foto,
              para o caso de a arte não carregar. */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <Image
              src={CAPA}
              alt=""
              fill
              sizes="100vw"
              loading="lazy"
              className="object-cover object-right"
            />
            {/* O VÉU É QUASE FECHADO NOS TRÊS TERÇOS, e não um gradiente que abre para
                a direita como no hero. A razão é a tinta: aqui o trilho é uma grade de
                TRÊS colunas ocupando a faixa inteira, então existe texto branco sobre
                o terço direito também — e o terço direito é a metade ACESA da arte
                (cubos claros, reflexos), a pior possível para branco por cima. Um véu
                que abrisse à direita, como o do hero (onde não há texto naquele lado),
                deixaria o «Oferta personalizada» ilegível sobre os ícones claros; foi
                o que a captura de 88/80/58 mostrou.
                Números anteriores, para o registro: `/92 /88 /78` — corretos de
                intenção, mas medidos contra uma foto que naquele momento não aparecia
                (o `-z-10` acima), então não valiam como calibração de nada.
                O leve degradê que sobra (95→90) existe só para a arte não ficar
                uniformemente apagada: é o suficiente para a composição aparecer sem
                que a leitura dependa de qual pedaço da foto caiu atrás de qual passo. */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#001A3D]/95 via-[#001A3D]/92 to-[#001A3D]/90" />
          </div>
          {/* A malha e o circuito ENTRAM DEPOIS da foto e do véu, de propósito: o
              véu apaga a arte a 90–95% e a malha tem de ficar SOBRE ele, senão a
              grade seria a coisa mais apagada da faixa. Aqui o par 0/1 não é
              preferência de estilo, é obrigação: `.grade-tecnica` nasce em
              `z-index: -1`, e como esta seção tem `bg-[#001A3D]` chapado, o
              negativo a jogaria para trás do fundo da própria seção — o defeito
              que a foto desta mesma faixa já cometeu e que está descrito acima.
              `.matchai-grade` reescreve para 0. */}
          <div aria-hidden className="grade-tecnica matchai-grade" />
          <CircuitoCanto className="matchai-circuito--trilho" />
          <RevealScope
            className="container-lp relative z-10"
            limiar={LIMIAR_REVEAL}
            margem={MARGEM_REVEAL}
            data-reveal-nome="matchai-trilho"
          >
            <div>
              {/* NEGRITO da lista fechada (item 3): «Da base à oferta mais
                  relevante». */}
              <h2
                data-reveal="fade-up"
                id={idDoBloco(trilho.heading!)}
                className="font-display text-section font-bold text-white"
              >
                {trilho.heading}
              </h2>
              {trilho.kind === 'list' && trilho.intro && (
                <p
                  data-reveal="fade-up"
                  style={cascata(1)}
                  className="mt-4 max-w-2xl text-lg leading-relaxed text-white/85"
                >
                  {trilho.intro}
                </p>
              )}
              {/* O TRILHO, AGORA CÍRCULO + FIO, como a referência desenha. A
                  versão anterior usava a BORDA SUPERIOR de cada item como linha,
                  com o disco subindo sobre ela (`border-t` + `-top-6`):

                    <li className="relative border-t border-[#0ed8f6]/35 pt-8">
                      <span className="absolute -top-6 left-0 flex h-12 w-12 …rounded-full…">

                  O motivo daquele desenho era que a régua quebrava junto com a
                  grade a 390. O fio de agora resolve a mesma coisa de outro jeito e
                  sem fingir que a linha atravessa: ele é um nó por passo, só a
                  partir de `sm` (onde os três estão lado a lado) e só entre pares —
                  o último não tem para onde apontar. Empilhado, não há fio nenhum,
                  que é o certo: um segmento horizontal entre passos empilhados
                  ligaria coisas que não estão em linha.
                  O fio nasce no CENTRO do círculo (`top-7` = metade de `h-14`) e
                  atravessa o vão da grade (`-right-8` = `gap-8`) até encostar no
                  círculo seguinte.

                  ITEM 7 — «linhas sempre em movimento, balões pulsando»: o fio
                  recebe `matchai-fio` (degradê de 200% deslizando por
                  `background-position`, com um clarão no meio que faz de partícula)
                  e cada disco recebe `matchai-passo` com defasagem, que pulsa por
                  ANEL de sombra. As duas receitas e o porquê de não animar `left`
                  de um ponto nem `scale` do disco estão no `globals.css`. O
                  `bg-[#0ed8f6]/35` FICA no fio: é o piso de cor para quando o laço
                  está desligado (movimento reduzido mata a animação, e a linha do
                  trilho não pode desaparecer com ela). */}
              <ol className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
                {itens(trilho).map((passo, i, todos) => {
                  const Icone = ICONES_TRILHO[i] ?? Sparkles;
                  return (
                    <li
                      key={passo.term}
                      data-reveal="fade-up"
                      style={cascata(i + 2)}
                      className="relative"
                    >
                      <span
                        aria-hidden
                        className={[
                          'matchai-passo flex h-14 w-14 items-center justify-center rounded-full border border-[#0ed8f6]/55 bg-[#001A3D]/60',
                          i === 1 && 'matchai-passo--2',
                          i === 2 && 'matchai-passo--3',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        <Icone className="h-6 w-6 text-[#A5F0FF]" strokeWidth={1.6} />
                      </span>
                      {i < todos.length - 1 && (
                        <span
                          aria-hidden
                          className="matchai-fio absolute left-14 right-[-2rem] top-7 hidden h-px bg-[#0ed8f6]/35 sm:block"
                        />
                      )}
                      <h3 className="mt-5 font-display text-base leading-snug text-white">
                        {passo.term}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/80">{passo.text}</p>
                    </li>
                  );
                })}
              </ol>
            </div>
          </RevealScope>
        </section>
      )}

      {/* ── 4. POSICIONAMENTO ────────────────────────────────────────────────
          Texto + foto, e as três colunas embaixo — as duas partes debaixo do
          MESMO título, como na mock (o dado tem dois blocos porque `AccelBlock` é
          uma união; a razão está lá). */}
      {posicionamento && posicionamento.kind === 'paragraphs' && (
        <section
          className="section-light section-py relative overflow-clip"
          aria-labelledby={idDoBloco(posicionamento.heading!)}
        >
          {/* Mesmo grafismo e mesma razão da seção clara acima. A variante
              `--baixo` espelha o canto: o circuito desta seção nasce embaixo à
              esquerda, porque o alto à direita é onde a foto do Posicionamento
              fica — grafismo atrás de foto é grafismo jogado fora. */}
          <AcentosClaros />
          <CircuitoCanto className="matchai-circuito--claro matchai-circuito--baixo" />
          {/* O ESCOPO É A SEÇÃO INTEIRA, e isso é o item 6: o «pop» do balão do
              ISG usa o `data-in` DESTE escopo (`[data-in='false'] .matchai-balao`
              no `globals.css`) em vez de um sétimo preset ou de um segundo
              observador. É por isso que as três colunas de baixo ficam dentro do
              mesmo escopo e não num próprio — o balão e elas entram na mesma
              passagem, e é uma só ignição a medir. */}
          <RevealScope
            className="container-lp relative z-10"
            limiar={LIMIAR_REVEAL}
            margem={MARGEM_REVEAL}
            data-reveal-nome="matchai-posicionamento"
          >
            <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
              <div>
                {/* NEGRITO da lista fechada (item 3): «Posicionamento». */}
                <h2
                  data-reveal="fade-up"
                  id={idDoBloco(posicionamento.heading!)}
                  className="font-display text-section font-bold text-ink"
                >
                  {posicionamento.heading}
                </h2>
                {/* O SEGUNDO PARÁGRAFO NÃO ESTÁ AQUI: ele é o que vai dentro do
                    balão sobre a foto (logo abaixo). O `filter` por índice é o que
                    garante que ele apareça UMA vez só — o balão não é uma citação
                    decorativa repetindo texto que já está na coluna. */}
                <div className="mt-6 space-y-4">
                  {posicionamento.paragraphs
                    .filter((_, i) => i !== BALAO)
                    .map((p, i) => (
                      <p
                        key={p.slice(0, 32)}
                        data-reveal="fade-up"
                        style={cascata(i + 1)}
                        className="max-w-2xl text-lg leading-relaxed text-ink-muted"
                      >
                        {p}
                      </p>
                    ))}
                </div>
              </div>
              {/* A FOTO COM BALÃO POR CIMA, pedido assim: «faça igual essa deixando
                  a imagem no formato com balao por cima».
                  O `pb-14` é estrutural e não estético: o balão desce
                  `-bottom-8` para FORA da moldura (é o que faz dele um balão
                  sobreposto e não uma legenda dentro da foto), e sem a reserva ele
                  encostaria no que vem embaixo — que são as três colunas.
                  O conteúdo do balão é ESCRITA DO SITE, o parágrafo do ISG Provider
                  Lens: das três frases do bloco é a única que se sustenta sozinha
                  fora do fio do texto, e é do tipo que a referência põe no balão
                  (uma afirmação curta de credibilidade). Nada de copy nova. */}
              <div data-reveal="scale-soft" style={cascata(2)} className="relative pb-14 lg:pb-16">
                <div className="matchai-midia relative aspect-[4/3] overflow-hidden rounded-3xl border border-[#0079CB]/18">
                  <Image
                    src={FOTO_POSICIONAMENTO}
                    alt=""
                    aria-hidden
                    fill
                    sizes="(min-width: 1180px) 500px, 100vw"
                    loading="lazy"
                    className="matchai-midia-arte object-cover"
                  />
                </div>
                {/* O BALÃO (item 6). A SOMBRA ATRÁS FICOU MAIS FUNDA e ganhou um
                    segundo degrau curto: um balão que «sobe» precisa parecer
                    descolado da foto, e a sombra rasa de antes o deixava chapado
                    nela. Era:

                      shadow-[0_22px_50px_-24px_rgba(0,30,70,0.45)]

                    `matchai-balao` é o POP: sobe e cresce com repique quando o
                    escopo da seção acende, pela transição em `translate`/`scale`
                    que o `globals.css` liga ao `[data-in]`. */}
                <div className="matchai-balao absolute bottom-0 left-4 right-4 rounded-2xl border border-[#0079CB]/18 bg-white p-4 shadow-[0_10px_18px_-12px_rgba(0,30,70,0.35),0_30px_60px_-26px_rgba(0,30,70,0.55)] sm:left-8 sm:right-8">
                  {/* O BICO. Quadrado girado 45° com as duas bordas de cima
                      pintadas e o resto herdando o fundo do balão: é o que dá a
                      ponta SEM um segundo nó e sem `clip-path`, que cortaria a
                      borda de 1px. Ele aponta para CIMA, para a foto de onde o
                      balão sai. `-top-[7px]` = metade da diagonal menos a borda. */}
                  <span
                    aria-hidden
                    className="absolute -top-[7px] left-8 h-3 w-3 rotate-45 border-l border-t border-[#0079CB]/18 bg-white"
                  />
                  <p data-balao="" className="relative text-sm leading-relaxed text-ink-muted">
                    {posicionamento.paragraphs[BALAO]}
                  </p>
                </div>
              </div>
            </div>

            <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {colunas.map((c, i) => {
                const Icone = ICONES_POSICIONAMENTO[i] ?? Sparkles;
                return (
                  <li
                    key={c.term}
                    data-reveal="fade-up"
                    style={cascata(i + 3)}
                    /* ITEM 5 — «os 3 cards do Posicionamento flutuando, com ação no
                       hover». `matchai-coluna` é o laço (mesma peça dos cards de
                       «O que o Match AI faz?», com defasagem por `nth-child`) mais
                       o realce sob o ponteiro; a receita está no `globals.css`.
                       `bg-white/80` VIROU `bg-white` chapado pelo motivo já
                       apurado nos outros cards: o cartão escala sobre a folha e,
                       translúcido, o vizinho aparecia por baixo no instante da
                       sobreposição. */
                    className="matchai-coluna rounded-2xl border border-[#0079CB]/18 bg-white p-6 shadow-[0_18px_44px_-30px_rgba(0,55,100,0.45)]"
                  >
                    <Icone aria-hidden className="h-8 w-8 text-[#0079CB]" strokeWidth={1.6} />
                    {/* NEGRITO da lista fechada (item 3): «Complementa o
                        ecossistema» · «Reconhecimento ISG» · «Inovação Sistran
                        Labs» são exatamente os três `term` deste `h3`. */}
                    <h3 className="mt-4 font-display text-base font-bold leading-snug text-ink">
                      {c.term}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">{c.text}</p>
                  </li>
                );
              })}
            </ul>
          </RevealScope>
        </section>
      )}

      {/* ── 5. CONHEÇA TAMBÉM ────────────────────────────────────────────────
          É o «Outras soluções» do template com a cara da mock: as fichas em
          pílula continuam existindo (a atual como `<span aria-current="page">`,
          fora da ordem de tabulação, exatamente como lá) e ganham em cima delas a
          fileira de cartões com a arte de cada irmã, mais o botão «Ver todas as
          soluções e serviços».

          O QUE DIVERGE DA ISSUE, de propósito: a issue manda usar a capa do Match
          AI em «todo slot de imagem», e aqui cada cartão usa a arte DA SUA
          solução (`ACCELERATORS[].capaCard`). Não é arte nova nem arte inventada —
          são as sete capas de cartão que a vitrine de `/solucoes` já publica, uma
          por produto, todas no repositório. Pintar seis irmãs com a capa do Match
          AI produziria uma fileira de seis imagens idênticas anunciando produtos
          diferentes, que é pior do que o problema que o placeholder resolve. Está
          reportado no comentário da issue.

          A SEÇÃO INTEIRA É MENOR, a pedido («deixe menor dessa forma»), e o
          encolhimento é de ESCALA, não de conteúdo — nenhuma solução, pílula ou
          linha de escrita saiu.

          2ª VOLTA (item 4) — OS CARTÕES FICARAM MUITO MENORES E PERDERAM A
          DESCRIÇÃO. Eram quatro colunas a partir de `lg`, com `aspect-[16/9]`,
          nome em `text-sm` e a descrição do produto em `text-xs`:

            <span className="block p-4">
              <span className="block font-display text-sm text-ink">{a.name}</span>
              <span className="mt-1.5 block text-xs leading-relaxed text-ink-muted">
                {a.description}
              </span>
            </span>

          A issue pede «cards bem menores, menos descrição, o ideal é só o logo com
          a imagem atrás». Então o cartão passa a ser UM bloco só: a capa do
          produto ao fundo, um véu navy por cima e o LOGO centralizado. Seis
          cabem numa fileira a partir de `lg`, o que é metade da altura de antes.

          O VÉU NÃO É ESTÉTICA. As sete logos do `accelerators.ts` são de tinta
          CLARA (arquivos «-branca», «letra-clara», ou marcas brancas) — sobre as
          capas, que têm regiões claras, elas desapareceriam. O `/55` de `#001A3D`
          é o mesmo recurso que a faixa do trilho usa, e pela mesma razão: tirar a
          legibilidade da dependência de qual pedaço da foto caiu atrás.

          O NOME NÃO SUMIU. Ele sai do fluxo visual e continua publicado no `alt`
          do logo (`alt={a.name}`) — o logo é a única coisa que identifica o
          destino do link, e sem texto acessível seriam seis links indistinguíveis
          (WCAG 2.4.4). É a razão pela qual o `alt` do logo NÃO é vazio aqui,
          ao contrário de todas as outras imagens desta página. */}
      <nav
        aria-labelledby="conheca-tambem"
        className="section-light relative overflow-clip py-12 md:py-16"
      >
        {/* A faixa de fecho é a mais baixa da página (py-12), então leva os pontos
            e NÃO o circuito: uma trilha de 320px de lado numa faixa de ~176px de
            miolo seria recortada em quase tudo, e o pedaço que sobra encostaria
            nos seis cartões. «Em tudo nessa página» é sobre a atmosfera estar em
            toda parte, não sobre repetir o mesmo desenho onde ele não cabe. */}
        <AcentosClaros />
        <RevealScope
          className="container-lp relative z-10"
          limiar={LIMIAR_REVEAL}
          margem={MARGEM_REVEAL}
          data-reveal-nome="matchai-conheca"
        >
          {/* NEGRITO da lista fechada (item 3): «Conheça também». */}
          <h2
            id="conheca-tambem"
            data-reveal="fade-up"
            className="font-display text-xl font-bold text-ink"
          >
            Conheça também
          </h2>
          <p
            data-reveal="fade-up"
            style={cascata(1)}
            className="mt-2 max-w-xl text-sm leading-relaxed text-ink-muted"
          >
            Soluções que trabalham juntas para uma seguradora mais inteligente e conectada.
          </p>

          <ul data-reveal="fade-up" style={cascata(2)} className="mt-5 flex flex-wrap gap-2">
            {ACCELERATOR_PAGES.map((p) => {
              const atual = p.id === page.id;
              return (
                <li key={p.id}>
                  {atual ? (
                    <span
                      aria-current="page"
                      className="inline-block rounded-full border border-[#0079CB]/70 bg-[#0079CB]/12 px-3 py-1.5 text-xs font-semibold text-[#0a1f44]"
                    >
                      {p.name}
                    </span>
                  ) : (
                    <Link
                      href={`/solucoes/${p.id}`}
                      className="inline-block rounded-full border border-[#0079CB]/20 bg-white/70 px-3 py-1.5 text-xs font-semibold text-[#0a1f44] transition-colors hover:border-[#0079CB]/60 hover:bg-white"
                    >
                      {p.name}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>

          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {ACCELERATORS.filter((a) => a.id !== page.id).map((a, i) => (
              <li key={a.id} data-reveal="fade-up" style={cascata(i + 3)}>
                {/* O cartão INTEIRO é o link: alvo grande e um único destino. */}
                <Link
                  href={`/solucoes/${a.id}`}
                  className="matchai-midia group relative block aspect-[16/10] overflow-hidden rounded-xl border border-[#0079CB]/18 transition-colors hover:border-[#0079CB]/55"
                >
                  <Image
                    src={a.capaCard}
                    alt=""
                    aria-hidden
                    fill
                    sizes="(min-width: 1180px) 176px, (min-width: 640px) 33vw, 50vw"
                    loading="lazy"
                    className="matchai-midia-arte object-cover"
                  />
                  <span aria-hidden className="absolute inset-0 bg-[#001A3D]/55" />
                  <span className="absolute inset-0 flex items-center justify-center p-3">
                    {/* `width`/`height` são as dimensões INTRÍNSECAS do dado (e não
                        um par inventado), e o tamanho de uso sai das utilitárias —
                        com `images: { unoptimized: true }` o que baixa é o arquivo
                        do disco, então o par serve para reservar a caixa e não
                        distorcer a marca. */}
                    <Image
                      src={a.logo}
                      alt={a.name}
                      width={a.logoWidth}
                      height={a.logoHeight}
                      loading="lazy"
                      className="h-auto max-h-[62%] w-auto max-w-[78%] object-contain"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/solucoes"
            data-reveal="fade-up"
            style={cascata(9)}
            /* `on-dark` É OBRIGATÓRIO AQUI, não decoração: esta é uma pílula de
               fundo cheio DENTRO de `.section-light`, e os overrides daquela classe
               pintam de navy tudo que traga `text-white` — a primeira execução da
               sonda mediu a tinta computada em `rgb(10,31,68)` sobre o azul, 3,56:1,
               reprovado. Com `on-dark` a tinta volta ao branco 0,88 da casa.
               O fundo é `#0060A8` e não `#0079CB` pelo mesmo número: branco 0,88
               sobre o azul primário dá ~4,2:1, abaixo do piso; sobre o azul de hover
               da paleta passa com folga (medido na sonda). O hover desce mais um
               degrau, para `#004D8A`, que é o azul profundo da marca — nenhum hex
               novo entrou. */
            className="on-dark mt-6 inline-flex items-center gap-2 rounded-full bg-[#0060A8] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#004D8A]"
          >
            Ver todas as soluções e serviços
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden />
          </Link>
        </RevealScope>
      </nav>
      {/* 6ª VOLTA — o modal montado no FIM da árvore, como em `Header.tsx:916`, e
          sem `title`/`description`: os defaults do componente são a escrita «Fale
          com a gente» que o pedido nomeia. Ele se portala para fora daqui, então a
          posição no markup não afeta o desenho — o que ela evita é nascer dentro de
          uma seção com `transform`/`filter`, que ancoraria o `fixed` do `<dialog>`
          no lugar errado. */}
      <ContactModal open={contatoAberto} onClose={() => setContatoAberto(false)} />
    </>
  );
}
