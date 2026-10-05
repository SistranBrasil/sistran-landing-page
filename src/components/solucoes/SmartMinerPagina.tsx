'use client';

/**
 * SIS-279 — O CORPO DA `/solucoes/smart-miner`, na MESMA ARQUITETURA DE SEÇÕES da
 * `/solucoes/match-ai` (`MatchAiPagina`) e com IDENTIDADE PRÓPRIA.
 *
 * POR QUE UM COMPONENTE DEDICADO, e não props novas no template de
 * `/solucoes/[slug]`: a razão é a mesma que `MatchAiPagina` e `FastPagina` já
 * registram — o template renderiza `page.blocks.map(...)`, um título e um corpo por
 * bloco, no mesmo molde para as sete slugs. Expressar hero sangrado, grade de cards
 * com arte, faixa escura com trilho e vitrine de irmãs como variação de
 * `Block`/`ItemList` mudaria o molde das SETE. A issue proíbe redesenhar as outras
 * (escopo fora: «redesign de Match AI/Fast»), então esta slug ganha corpo próprio e
 * as outras CINCO continuam no caminho genérico sem uma linha tocada.
 * Com esta, o par de `if` no `[slug]/page.tsx` passa a ser TRÊS — a nota de lá já
 * previa a hipótese («se uma terceira chegar, o par de `if` vira um mapa»), e é o
 * que esta issue faz.
 *
 * ── TODA A ESCRITA VEM DO SITE ────────────────────────────────────────────────
 * Nada de copy do Match AI colada aqui (item 2 da issue) e nada de claim inventado.
 * As fontes são DUAS, as duas já publicadas:
 *   1. `src/data/acceleratorPages.ts` → `lead` e os TRÊS blocos de parágrafo
 *      («O que é o Smart Miner?», «Onde usar o Smart Miner?», «Como usar o Smart
 *      Miner?»).
 *   2. `src/data/accelerators.ts` → a `description` do cartão da vitrine, usada UMA
 *      vez, como apoio do primeiro título. Ela não se repete em nenhum outro ponto
 *      desta rota, então não há duas aberturas dizendo a mesma coisa (foi o defeito
 *      que a SIS-120 removeu do template).
 *
 * O DADO DO SMART MINER NÃO TEM BLOCO DE LISTA — e é a diferença estrutural com o
 * Match AI, que alimenta grade, trilho e colunas com `kind: 'list'`. As fichas desta
 * página (quatro cards e três passos) nascem de FRAGMENTOS VERBATIM dos parágrafos,
 * declarados nas constantes abaixo com a frase de origem citada ao lado. É o
 * precedente do `FastPagina` (`HUB_ORIGEM`/`HUB_DESTINOS`/`METRICAS`, derivados da
 * escrita dos blocos) e é o que evita a alternativa ruim: reescrever
 * `acceleratorPages.ts` para criar listas que o site não tem — o que mudaria os
 * `heading` e, com eles, as âncoras que `pageSections.ts` compartilha.
 *
 * ── A ORDEM DAS SEÇÕES É A ORDEM DO DADO, e isso não é gosto ──────────────────
 * «O que é» → «Onde usar» → «Como usar». `pageSections.ts` monta a lista do
 * navegador lateral percorrendo `page.blocks` NA ORDEM, com `idDoBloco` como único
 * dono das âncoras; renderizar numa ordem diferente da do dado deixaria o indicador
 * apontando para cima enquanto o visitante desce. Item 5 da issue («`pageSections`/
 * âncoras coerentes com os títulos») é cumprido assim: nenhum `heading` novo foi
 * inventado, então nenhuma âncora mudou de nome — o que mudou foi o TOM de duas
 * paradas, porque o fundo delas mudou (ver a nota em `pageSections.ts`).
 *
 * ── IDENTIDADE PRÓPRIA (item 4: «variar 1–2 componentes») ─────────────────────
 * Três coisas divergem do Match AI de propósito, para a página não ler como a mesma
 * peça renomeada:
 *   1. O GRAFISMO DE CANTO é outra arte. Lá é `CircuitoCanto` (trilha de circuito com
 *      quadradinhos); aqui é `EsteiraCanto` — dois trilhos horizontais com três
 *      documentos correndo por cima, que é literalmente o que o produto faz. A
 *      MECÂNICA é a mesma da casa (linha base + traço em `stroke-dashoffset`,
 *      `pathLength="1"`, máscara por elemento em vez de `<defs>`/`id`, porque o
 *      componente é montado várias vezes na mesma página); a GEOMETRIA é nova.
 *   2. O FIO DO TRILHO é TRACEJADO EM MARCHA, e não um degradê de 200% deslizando:
 *      documento andando em esteira é passo discreto, e o tracejado desenha isso.
 *   3. O CARD tem outra anatomia: a arte é FAIXA NO TOPO (16/9) com o ícone
 *      encavalando a borda, em vez de miniatura de 28/32 na lateral.
 * A COR também é própria, e vem do dado: `#6EE7B7` é o `tone` que
 * `accelerators.ts` declara para o Smart Miner (o do Match AI é ciano). Ela vale SÓ
 * nas faixas escuras — sobre folha clara a menta mede ~1,4:1 contra o branco, e o
 * número que reprova o ciano claro do Match AI (1,03:1, medido na SIS-292) reprova
 * esta também. Nas faixas claras a tinta de grafismo é o azul institucional
 * `#0079CB`, como lá.
 *
 * ── O CARIMBO ENTRA — a arte chegou ──────────────────────────────────────────
 * A issue condicionava: «carimbo se existir arte (senão omitir ou placeholder
 * documentado)». Na primeira entrega a arte não existia, e esta nota dizia:
 *
 *   «O CARIMBO NÃO ENTRA, e é registro, não esquecimento. Não existe arte de
 *   carimbo do Smart Miner em `public/` — a única cápsula do repositório é a do
 *   Match AI (`images/solucoes/carimbo-match-ai-ticket-outline-ffffff.png`), e
 *   usá-la aqui publicaria o nome do outro produto no topo desta rota. Quando a
 *   cápsula do Smart Miner chegar, o mount é `CarimboBatida` acima do `h1`,
 *   exatamente como em `MatchAiPagina`.»
 *
 * Ela chegou, e o mount é o que a nota previu — não um desenho novo. Ver `CARIMBO`.
 * O lugar da marca no `h1` continua sendo o LETREIRO: a cápsula é etiqueta acima
 * dele, com `alt=""`, que é o par da 7ª volta do Match AI.
 *
 * ── MOVIMENTO ────────────────────────────────────────────────────────────────
 * `RevealScope` + `data-reveal` + `./reveal-calibre`, que é o mecanismo do Match AI
 * (e NÃO o `variants` de `@/lib/motion` que o `FastPagina` ainda usa): a issue manda
 * espelhar o motion/reveal do Match AI, e a razão técnica de não somar os dois está
 * escrita no docblock dele (dois donos do mesmo `transform`).
 * `esperarRota` SÓ no escopo do hero, pelo contrato da SIS-269.
 * O movimento em laço é todo CSS, no bloco `SIS-279` do fim do `globals.css`, com os
 * DOIS canais de movimento reduzido. Aqui ficam só as classes-gancho.
 */

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Crop,
  FileOutput,
  FileStack,
  Layers,
  ScanLine,
  Sparkles,
  Workflow,
} from 'lucide-react';
import CarimboBatida from '@/components/CarimboBatida';
import ContactModal from '@/components/ContactModal';
import RevealScope from '@/components/motion/RevealScope';
import { ACCELERATORS } from '@/data/accelerators';
import {
  ACCELERATOR_PAGES,
  idDoBloco,
  type AcceleratorPage,
} from '@/data/acceleratorPages';
import { CAPAS_DE_ABERTURA } from '@/data/capasSolucoes';
import { LIMIAR_REVEAL, MARGEM_REVEAL } from './reveal-calibre';

/* A CAPA DA ROTA, que a SIS-286 trouxe: `capasSolucoes.ts` é o dono do mapa (dois
   leitores — o template e as páginas com corpo próprio), e é de lá que ela sai em vez
   de um caminho digitado aqui.
   É a DERIVADA WebP de 95 kB, e não `public/capa-smart-mine.png` (1,7 MB): com
   `images: { unoptimized: true }` o `next/image` entrega o arquivo como ele está no
   disco, então o PNG cru iria inteiro para o LCP do hero. A ressalva de peso é a da
   SIS-120 e a conversão é a da SIS-286
   (`scripts/otimizar-capa-smart-miner-sis286.mjs`). */
const CAPA = CAPAS_DE_ABERTURA['smart-miner'].src;

/* ── A CÁPSULA DO HERO (arte entregue depois da primeira volta) ────────────────
   Pedido: «carimbo do `public/carimbo-smart-miner-ticket-outline-ffffff.png`
   adicione».

   O ARQUIVO MUDOU DE PASTA, e não é arrumação gratuita: a irmã vive em
   `images/solucoes/carimbo-match-ai-ticket-outline-ffffff.png`, e foi TER A MESMA
   ARTE EM DUAS PASTAS que produziu o defeito da 5ª volta do Match AI — a cópia da
   raiz escrevia «MACH AI» e foi ela que subiu para a tela. Duas cápsulas de produto
   irmãs em pastas diferentes é o mesmo convite ao erro. O caminho de origem era
   `public/carimbo-smart-miner-ticket-outline-ffffff.png` (arquivo ainda não
   versionado quando veio o pedido, então a mudança de lugar não reescreve histórico).

   MEDIDO ANTES DE MONTAR (`scripts/medir-carimbo-smartminer.mjs` →
   `docs/medidas/sis279-carimbo.json`), porque `CarimboBatida` só serve arte que
   atenda a três coisas — e as três foram conferidas, não presumidas:

   1. TOMBO DE REPOUSO ZERO. O componente assenta o carimbo em `rotation: 0` porque
      as artes que ele já serve vêm tombadas dentro do próprio arquivo (−3,05° em
      `/parceiros`, −3,03° em `/sistran-labs`). Esta mede **−3,04°** (topo da tinta
      cai de y=42 em x=149 para y=14 em x=677) — o mesmo tombo, então o repouso do
      componente vale para ela e NÃO é preciso o `tomboRepouso` que o docblock dele
      diz que uma arte reta exigiria. Era o portão que podia reprovar a arte.
   2. TINTA CLARA SOBRE TRANSPARÊNCIA: média `rgb(255, 255, 255)` nos 28.078 pixels
      opacos, canto transparente. Cápsula branca só se lê em faixa escura — que é
      onde este hero a põe. Em faixa clara ela não serve, e é a razão de a etiqueta
      não descer para «O que é» nem para «Onde usar».
   3. GRAFIA: composta sobre `#001A3D` e lida em captura, a arte diz «SISTRAN |
      Smart Miner» — correto. É a conferência que a 5ª volta do Match AI teve de
      fazer DEPOIS de a arte errada já estar no ar.

   825x291 no IHDR (razão 2,835:1). São as dimensões INTRÍNSECAS, não tamanho de uso:
   elas montam a razão de aspecto dentro do componente para a cápsula não achatar. O
   tamanho sai de `--carimbo-batida-w` em `.smartminer-carimbo` no `globals.css`. */
const CARIMBO = {
  src: '/images/solucoes/carimbo-smart-miner-ticket-outline-ffffff.png',
  largura: 825,
  altura: 291,
};

/* O LETREIRO DA MARCA. 2996x816 medido no IHDR (razão 3,67:1) — dimensões
   INTRÍNSECAS, que é o que reserva a caixa e mantém a razão com um dono só; a largura
   de uso mora em `.smartminer-marca-hero`.
   É o mesmo arquivo que `accelerators.ts` publica como logo desta solução, então não
   há duas artes de marca do Smart Miner no repositório para divergirem. Tinta clara
   (é o logo que a vitrine põe sobre véu navy), logo é arte de fundo escuro — que é
   onde este hero a usa, e a razão de ela não descer para as faixas claras. */
const MARCA = {
  src: '/images/logos/Logo-Smart-Miner-1.png',
  largura: 2996,
  altura: 816,
};

/* O apoio do primeiro título. Achado por `id` e não digitado: a frase é a do cartão
   da vitrine de `/solucoes`, e duas cópias dela (uma lá, uma aqui) divergiriam na
   primeira revisão de texto. */
const VITRINE = ACCELERATORS.find((a) => a.id === 'smart-miner');

/* ── OS QUATRO CARDS DE «O QUE É O SMART MINER?» ───────────────────────────────
   A FRASE DE ORIGEM é o parágrafo único daquele bloco, em `acceleratorPages.ts`:

     «O Smart Miner coleta imagens obtidas por celulares e/ou scanners em diversos
      formatos de arquivos (JPG, JPEG, PNG e PDF), faz ajustes em cada imagem
      (corrige inclinação, posição, separação de imagens), tipifica o documento —
      cartorários (nascimento, casamento, óbito), RG, CNH, comprovantes de endereço,
      notas fiscais, declaração de herdeiros, entre outros — e após estas validações
      realiza a extração das informações necessárias, por exemplo, para a abertura de
      um Sinistro.»

   Os quatro `texto` abaixo são FRAGMENTOS VERBATIM dela, em ordem, e juntos cobrem a
   frase inteira — é por isso que o parágrafo NÃO é publicado também em prosa acima da
   grade: não há escrita perdida, e publicar o parágrafo e os seus pedaços seria dizer
   a mesma coisa duas vezes na mesma faixa.
   Os `termo` são os VERBOS DA PRÓPRIA FRASE virados rótulo («coleta», «faz ajustes»,
   «tipifica», «extração»). Nenhum acrescenta informação que a frase não tenha — é o
   que separa «derivar rótulo» de «inventar claim». */
const O_QUE_E = [
  {
    termo: 'Coleta',
    texto:
      'imagens obtidas por celulares e/ou scanners em diversos formatos de arquivos (JPG, JPEG, PNG e PDF)',
  },
  {
    termo: 'Ajuste de imagem',
    texto: 'corrige inclinação, posição, separação de imagens',
  },
  {
    termo: 'Tipificação',
    texto:
      'cartorários (nascimento, casamento, óbito), RG, CNH, comprovantes de endereço, notas fiscais, declaração de herdeiros, entre outros',
  },
  {
    termo: 'Extração',
    texto:
      'após estas validações realiza a extração das informações necessárias, por exemplo, para a abertura de um Sinistro',
  },
];

/* Um ícone por card, na ordem da esteira: entrada de imagem, recorte, pilha de tipos,
   saída de dados. */
const ICONES_O_QUE_E = [ScanLine, Crop, FileStack, FileOutput];

/* ── OS TRÊS PASSOS DO TRILHO ─────────────────────────────────────────────────
   Os NOMES são os da issue, literalmente: «adaptar passos ao produto: tipificação →
   extração → esteira». O TEXTO de cada um é fragmento verbatim do site:
     · tipificação e extração — do parágrafo de «O que é» (citado acima);
     · esteira — do primeiro parágrafo de «Onde usar o Smart Miner?»:
       «Agrega valor e agiliza processos nas esteiras de abertura/comunicado de
        Sinistros, bem como na validação dos processos de subscrição para Emissão de
        apólices e certificados.»
   A sobreposição com a grade de «O que é» é de uma oração e é deliberada: a grade é
   o inventário de capacidades e o trilho é a SEQUÊNCIA — é a mesma divisão de
   trabalho que o Match AI faz entre «O que o Match AI faz?» e «Da base à oferta mais
   relevante». */
const TRILHO = [
  {
    termo: 'Tipificação',
    texto: 'tipifica o documento — cartorários, RG, CNH, comprovantes de endereço, notas fiscais',
  },
  {
    termo: 'Extração',
    texto: 'realiza a extração das informações necessárias, por exemplo, para a abertura de um Sinistro',
  },
  {
    termo: 'Esteira',
    texto:
      'agiliza processos nas esteiras de abertura/comunicado de Sinistros, bem como na validação dos processos de subscrição',
  },
];

const ICONES_TRILHO = [Layers, FileOutput, Workflow];

/* O índice da cascata do Efeito 4 vive em `--reveal-i`; o atraso sai de
   `calc(var(--motion-stagger-reveal) * var(--reveal-i))`. Mesmo helper do Match AI,
   pela mesma razão: não repetir o cast de custom property em vinte pontos. */
const cascata = (i: number) => ({ '--reveal-i': i }) as React.CSSProperties;

/* Blocos achados POR TÍTULO e não por índice, pelo motivo já registrado no Match AI:
   índice é dependência invisível, e um bloco novo no dado reordenaria as seções em
   silêncio. Bloco ausente devolve `undefined` e a seção não monta. */
function bloco(page: AcceleratorPage, heading: string) {
  const b = page.blocks.find((x) => x.heading === heading);
  return b && b.kind === 'paragraphs' ? b : undefined;
}

/* As manchas de ponto fino e o quadrado pálido das faixas claras — a textura da casa
   (`/sistran-university`, `/sistran-labs`, e o `.matchai-acentos` da irmã desta
   issue). Nó e não pseudo-elemento porque `.section-light` já gastou os dois
   (`::before` malha de 96px, `::after` pontilhado). `aria-hidden` porque é grafismo:
   sem ele o leitor de tela anuncia um nó vazio antes do conteúdo da seção. */
function AcentosClaros() {
  return <span aria-hidden className="smartminer-acentos" />;
}

/* ── O GRAFISMO DE CANTO: A ESTEIRA (item 4, a variação de componente) ─────────
   Geometria NOVA, mecânica da casa. O desenho é o do produto: dois trilhos que
   correm na horizontal, o cotovelo arredondado que desvia, três documentos (o aceso é
   evento, os pálidos são textura) e o traço que percorre o trilho.

   `viewBox` FIXO com `preserveAspectRatio` padrão, e não o `slice` com altura medida
   do Unidep: são três caixas de alturas diferentes que ainda vão mudar ao mudar copy,
   e amarrar a arte à altura da seção seria um número a recalibrar por faixa (foi o
   que jogou os grafismos do Unidep fora da tela na 1ª volta dele).

   SEM `<defs>`/`id`: este componente é montado TRÊS vezes na mesma página, e três
   `id` iguais no documento fazem todo `url(#…)` apontar para o primeiro. As pontas
   morrem por `mask-image` no CSS, que é por elemento e não por documento. */
function EsteiraCanto({ className }: { className: string }) {
  return (
    <svg aria-hidden className={`smartminer-esteira ${className}`} viewBox="0 0 320 320">
      {/* `pathLength="1"` normaliza o comprimento, e é isso que deixa o
          `stroke-dasharray` do traço em movimento ser escrito em FRAÇÃO no CSS —
          sem ele cada caminho exigiria o próprio comprimento em px. */}
      <path className="smartminer-esteira-linha" pathLength="1" d="M 320 74 H 128 Q 96 74 96 106 V 320" />
      <path className="smartminer-esteira-linha" pathLength="1" d="M 320 170 H 216 Q 192 170 192 194 V 320" />
      {/* O MESMO `d` por cima: é o traço que corre. Dois nós e não um, porque um
          `stroke` não pode ter dois `dasharray` ao mesmo tempo. */}
      <path className="smartminer-esteira-pulso" pathLength="1" d="M 320 74 H 128 Q 96 74 96 106 V 320" />
      <path
        className="smartminer-esteira-pulso smartminer-esteira-pulso--2"
        pathLength="1"
        d="M 320 170 H 216 Q 192 170 192 194 V 320"
      />
      {/* OS DOCUMENTOS. Retângulos em pé (razão de folha, 3:4), e não os quadrados do
          circuito do Match AI — é a diferença que faz o canto ler como esteira de
          papel e não como placa de circuito. O canto dobrado de cada um é uma
          diagonal no topo direito, desenhada como `<path>` sobre o retângulo. */}
      <rect className="smartminer-esteira-doc" x="60" y="42" width="48" height="64" rx="8" />
      <path className="smartminer-esteira-dobra" d="M 92 42 V 58 H 108" />
      <rect
        className="smartminer-esteira-doc smartminer-esteira-doc--palido"
        x="168"
        y="140"
        width="44"
        height="58"
        rx="8"
      />
      <rect
        className="smartminer-esteira-doc smartminer-esteira-doc--palido"
        x="228"
        y="236"
        width="34"
        height="44"
        rx="6"
      />
    </svg>
  );
}

export default function SmartMinerPagina({ page }: { page: AcceleratorPage }) {
  const oQueE = bloco(page, 'O que é o Smart Miner?');
  const ondeUsar = bloco(page, 'Onde usar o Smart Miner?');
  const comoUsar = bloco(page, 'Como usar o Smart Miner?');
  /* Um estado só para o modal: `ContactModal` já cuida de `showModal()`, do portal, da
     pausa do scroll suave e da devolução do foco ao gatilho. */
  const [contatoAberto, setContatoAberto] = useState(false);

  return (
    <>
      {/* ── 1. HERO: A ARTE SANGRADA ─────────────────────────────────────────
          O molde é o do Match AI depois da 6ª volta, e os números NÃO são novos:
          `-top-28 md:-top-36` é o `pt-28 md:pt-36` que o `PageShell` põe no
          `<main id="conteudo">` (7rem e 9rem), que é a distância entre o topo da
          janela e o começo do conteúdo. É o que faz a arte subir ATRÁS do cabeçalho
          em vez de parar embaixo dele, deixando a tira de fundo da rota visível — a
          mesma receita medida em `/esg` (`.hero-backdrop-midia`/`-veu`, `inset: -7rem
          0 0 0` e `-9rem` de 768px para cima). Reaproveitar o número em vez de
          inventar um é o que garante que a emenda feche.
          Por isso NÃO há `overflow-clip` nesta seção: qualquer recorte corta
          exatamente o pedaço que sobe atrás do cabeçalho, e `overflow-x-clip` não
          serve de meio-termo (CSS Overflow 3: com um eixo em `clip`, o `visible`
          computa `clip` também).
          O cabeçalho continua NA FRENTE: `Header.tsx:468` é `fixed … z-50` e a arte
          nasce em `z-index: auto`.

          `id="topo"` é obrigatório e não decorativo: é a âncora do item «Início» do
          indicador lateral (`src/data/pageSections.ts`), e ela vinha do `PageHero`,
          que esta slug deixa de montar.

          A ALTURA MÍNIMA é o que garante que a arte apareça como arte: sem ela a
          faixa passa a ter a altura do texto e o banner vira uma tira. Os dois
          valores são os do Match AI, que por sua vez são os de `/esg` medidos na
          janela de 900px (414px = 25,9rem e 528px = 33rem) — não inventei um
          terceiro par para a mesma peça. */}
      <section
        id="topo"
        className="relative flex min-h-[26rem] items-center py-16 md:py-24 lg:min-h-[33rem]"
      >
        {/* A ARTE E A SOMBRA. `box-shadow` no embrulho e só para BAIXO: o embrulho é
            uma caixa opaca do tamanho da faixa, então o deslocamento vertical positivo
            desenha a sombra sobre a seção clara seguinte, e a faixa lê como peça
            apoiada na página. Com espalhamento para cima a sombra cairia na tira atrás
            do cabeçalho, repintando ali a faixa escura que este arranjo existe para
            eliminar. `box-shadow` e não `filter: drop-shadow`: `filter` cria contexto
            de empilhamento e faz o `position: fixed` do cabeçalho se ancorar no nó
            filtrado.

            `object-[center_15%]` É NÚMERO MEDIDO, e é o da própria SIS-286 para esta
            arte (`.hero-backdrop--smart-miner` no `globals.css`, com a derivação ao
            lado da regra): a 1440 a caixa é mais larga que a proporção do arquivo, o
            recorte é VERTICAL, e o letreiro «Smart Miner» embutido na arte começa em
            y=76 — manter o letreiro inteiro exige Y ≤ 22%, e 15% é o valor que já foi
            renderizado e conferido lá (letreiro inteiro, a esteira inteira, o painel e
            a mão com o telefone). Reaproveitar esse número em vez de aceitar o 50% de
            fábrica é o que evita o pior resultado possível, que é o letreiro cortado
            no meio das letras.
            `data-route-critical-media` aqui porque o portão de rota
            (`loading/RouteLoadGate.tsx`) tem de esperar a maior imagem acima da
            dobra, e é esta. */}
        <div
          aria-hidden
          className="absolute -top-28 right-0 bottom-0 left-0 shadow-[0_18px_44px_-18px_rgba(0,12,30,0.55)] md:-top-36"
        >
          <Image
            data-route-critical-media=""
            src={CAPA}
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover object-[center_15%]"
          />
          {/* DOIS VÉUS, um por eixo, e não um só: a leitura do texto muda de eixo com
              a largura. Abaixo de `lg` o texto cai sobre o miolo da arte e o véu é
              vertical; de `lg` para cima o texto ocupa o terço esquerdo e o véu é
              horizontal, terminando transparente antes da metade direita para não
              apagar o painel e a esteira de luz.
              A DIFERENÇA EM RELAÇÃO AO MATCH AI é que esta arte NÃO TEM terço
              esquerdo chapado — lá o véu horizontal só reforçava o que a arte já
              fazia, e aqui ele é o único responsável pelo contraste do texto. Por
              isso ele começa em `#001A3D` cheio e abre mais tarde (52% em vez de
              44%). Os degraus estão medidos pelo pixel COMPOSTO sob o texto na sonda
              desta issue; nenhuma opacidade aqui é palpite de olho. */}
          {/* O TERCEIRO VÉU, e ele não é estético: A ARTE TRAZ O LETREIRO «Smart
              Miner» DESENHADO no alto à direita (medido na SIS-286: começa em y=76 do
              arquivo de 1672×941, ocupando x 880..1672). Com o letreiro do `h1`
              montado, a capa passaria a ter DUAS vezes a mesma marca — foi o que a
              captura de 1440 desta issue mostrou.
              Recortar não resolve: a caixa é mais larga que a proporção do arquivo, o
              recorte é VERTICAL e sobram ~138px de folga contra os ~172px que o
              letreiro ocupa; qualquer `object-position` deixa pedaço dele em quadro,
              e o pior resultado possível é letreiro cortado no meio das letras.
              Então a faixa do letreiro é APAGADA: opaco até 140px (que é a tira atrás
              do cabeçalho, onde não há nada a ver) e dissolvendo até 240px, logo acima
              de onde o miolo começa. Vale nas duas larguras, porque o letreiro está na
              arte e não no layout. */}
          <div className="absolute inset-x-0 top-0 h-60 bg-[linear-gradient(180deg,#001A3D_0%,#001A3D_58%,rgba(0,26,61,0.72)_82%,rgba(0,26,61,0)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,26,61,0.94)_0%,rgba(0,26,61,0.9)_46%,rgba(0,26,61,0.6)_80%,rgba(0,26,61,0.4)_100%)] lg:hidden" />
          <div className="absolute inset-0 hidden lg:block lg:bg-[linear-gradient(90deg,#001A3D_0%,rgba(0,26,61,0.95)_32%,rgba(0,26,61,0.78)_52%,rgba(0,26,61,0.22)_70%,rgba(0,26,61,0)_84%)]" />
        </div>
        {/* SEM MALHA E SEM ESTEIRA NESTA FAIXA, e é decisão herdada: a 6ª volta da
            SIS-292 retirou os dois grafismos do hero do Match AI porque sobre FOTO eles
            viram grade riscada na cara das pessoas (sobre fundo chapado são a textura da
            casa). O mesmo vale aqui, e com mais força — a arte do Smart Miner já traz
            esteira, painel e fios acesos desenhados. Os grafismos seguem montados nas
            três faixas seguintes. */}
        {/* `esperarRota` SÓ AQUI, pelo contrato da SIS-269: espera quem está NA DOBRA,
            onde a cortina do `RouteLoadGate` esconderia a animação. Os escopos das
            outras seções nascem abaixo dela e não esperam — ganhar observador no
            instante em que a cortina sobe é como se produz o «acendeu tudo depois do
            load».
            O teto de leitura vive no PARÁGRAFO e não no container: `.container-lp` é
            `max-width` + `mx-auto`, então um teto neste nó encolheria o container
            centrado e jogaria o bloco para o meio da tela — o defeito que a 5ª volta do
            Match AI mediu. */}
        <RevealScope
          className="container-lp relative z-10"
          esperarRota
          limiar={LIMIAR_REVEAL}
          margem={MARGEM_REVEAL}
          data-reveal-nome="smartminer-hero"
        >
          <div>
            {/* O LETREIRO É A MANCHETE, e o `alt` É O NOME DA ROTA: este é o único
                `h1` da página, e um `h1` cujo conteúdo inteiro é imagem com `alt=""`
                é cabeçalho sem nome acessível — a rota perderia a manchete para leitor
                de tela e para o sumário do documento. O texto do `alt` é `page.name`,
                o mesmo dado que a grafia na tela desenha.
                `<Image>` cru e não `CarimboBatida`: a batida de carimbo é o gesto da
                CÁPSULA, que agora está logo acima — repeti-la aqui seria a mesma peça
                duas vezes na mesma dobra. O letreiro entra pela cascata de `fade-up` do
                próprio `h1`, que é a entrada das manchetes desta rota — e por isso
                também não há canal de movimento reduzido a tratar à mão aqui:
                `data-reveal` já é desligado nos dois.
                `priority` porque é a manchete acima da dobra; `data-route-critical-media`
                fica com a capa, que é a maior mídia da dobra. */}
            {/* A CÁPSULA É ETIQUETA, NÃO MANCHETE: ela vem ACIMA do `h1` e com
                `alt=""`. O par é o da 7ª volta do Match AI, e o `alt` vazio é
                obrigatório e não estilo — o nome acessível da rota é o do letreiro, que
                é o conteúdo do `h1`; com as duas artes nomeadas o leitor de tela diria
                «Smart Miner Smart Miner».
                `gatilho="rota"` porque a peça vive ACIMA da dobra, onde liberar o portão
                do `RouteLoadGate` e entrar em quadro são o mesmo instante — o gatilho de
                viewport existe para quem nasce a milhares de px do topo (SIS-188).
                A batida, os dois canais de movimento reduzido e a espera do portão já
                vivem no componente; refazer isso à mão aqui seria GSAP ad hoc num hero
                acima da dobra.
                DUAS CLASSES no nó, e o componente concatena: o empate de
                especificidade com `carimbo-batida.css` está explicado no `globals.css`.
                Ela fica FORA do `h1` e antes dele na ordem do documento, então também é
                a primeira da cascata — o `cascata()` do letreiro e do lead não muda,
                porque a cápsula não é `data-reveal`: quem a faz entrar é a própria
                batida. */}
            <CarimboBatida
              src={CARIMBO.src}
              alt=""
              larguraIntrinseca={CARIMBO.largura}
              alturaIntrinseca={CARIMBO.altura}
              className="smartminer-carimbo"
              gatilho="rota"
            />
            <h1 data-reveal="fade-up" className="mt-4 font-display">
              <Image
                src={MARCA.src}
                alt={page.name}
                width={MARCA.largura}
                height={MARCA.altura}
                priority
                className="smartminer-marca-hero"
              />
            </h1>
            <p
              data-reveal="fade-up"
              style={cascata(1)}
              className="mt-5 max-w-[46ch] text-lg leading-relaxed text-white/85 lg:max-w-[52ch]"
            >
              {page.lead}
            </p>
            {/* AÇÃO NA PRÓPRIA PÁGINA, então `<button>` e não `<a>`: um link que não
                vai a lugar nenhum é link falso para leitor de tela e para o teclado.
                O molde é o do cabeçalho (`Header.tsx:916`), que monta `ContactModal`
                SEM `title`/`description` de propósito — os defaults do componente são a
                escrita «Fale com a gente». Passar texto próprio aqui faria a mesma peça
                dizer duas coisas diferentes na mesma rota.
                A PÍLULA É A MENTA DO PRODUTO (`tone` do dado) com tinta navy
                `#032033`: medido em 10,9:1, acima do piso, e é a tinta escura sobre
                fundo claro que a família de heros da casa usa. NÃO é `.btn-primary` —
                o degradê da casa com tinta branca não passa no piso na ponta clara, e
                importar esse defeito para um hero novo é o que a SIS-292 já registrou
                aqui ao lado. */}
            <p data-reveal="fade-up" style={cascata(2)}>
              <button
                type="button"
                onClick={() => setContatoAberto(true)}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#6EE7B7] px-6 py-3 text-sm font-semibold text-[#032033] transition-colors hover:bg-[#A7F3D0]"
              >
                Fale com um especialista
                <ArrowRight className="h-4 w-4" strokeWidth={2.2} aria-hidden />
              </button>
            </p>
          </div>
        </RevealScope>
      </section>

      {/* ── 2. O QUE É O SMART MINER? ────────────────────────────────────────
          Faixa clara com a grade de cards (item 3 da issue). `.section-light` pinta
          título e texto de navy sozinho — é por isso que estes cards NÃO levam
          `on-dark`, o oposto do que os cartões da vitrine precisam.
          `overflow-clip` e não `hidden`: a malha de 96px de `.section-light::before` é
          `background-attachment: fixed` pela SIS-76, e `hidden` cria contêiner de
          rolagem, que é o que desancora o `fixed`. `clip` recorta o mesmo sem criar
          contêiner. */}
      {oQueE && (
        <section
          className="section-light section-light-blue section-py relative overflow-clip"
          aria-labelledby={idDoBloco(oQueE.heading!)}
        >
          <AcentosClaros />
          <EsteiraCanto className="smartminer-esteira--claro" />
          <RevealScope
            className="container-lp relative z-10"
            limiar={LIMIAR_REVEAL}
            margem={MARGEM_REVEAL}
            data-reveal-nome="smartminer-o-que-e"
          >
            <h2
              data-reveal="fade-up"
              id={idDoBloco(oQueE.heading!)}
              className="font-display text-section font-bold text-ink"
            >
              {oQueE.heading}
            </h2>
            {/* O APOIO é a `description` da vitrine (ver a nota de `VITRINE`), a única
                frase desta rota que vem de `accelerators.ts`. O guarda existe porque o
                dado é achado por `find`: sem entrada, a faixa monta sem apoio em vez de
                estourar a rota. */}
            {VITRINE && (
              <p
                data-reveal="fade-up"
                style={cascata(1)}
                className="mt-4 max-w-2xl text-lg leading-relaxed text-muted"
              >
                {VITRINE.description}
              </p>
            )}
            {/* `<ol>` e não `<ul>`: as quatro etapas são uma SEQUÊNCIA (coleta →
                ajuste → tipificação → extração), e a ordem significa algo para quem lê
                por leitor de tela. É a mesma razão pela qual o Match AI manteve o `<ol>`
                depois de tirar o ordinal desenhado. */}
            <ol className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {O_QUE_E.map((item, i) => {
                const Icone = ICONES_O_QUE_E[i] ?? Sparkles;
                return (
                  <li
                    key={item.termo}
                    data-reveal="fade-up"
                    style={cascata(i + 2)}
                    /* A ANATOMIA VARIADA (item 4): arte em FAIXA NO TOPO e o ícone
                       encavalando a borda dela, em vez da miniatura lateral do Match AI.
                       `smartminer-cartao` é o laço de flutuação + o realce sob o
                       ponteiro; `smartminer-midia` é o quadro cujo hover move a ARTE
                       (dois nós, porque um só seria dono do `transform` duas vezes — a
                       colisão que a University registra). `bg-white` chapado e não
                       translúcido: o cartão sobe e escala sobre a folha, e com fundo
                       translúcido o vizinho aparece por baixo no instante da
                       sobreposição. */
                    className="smartminer-cartao smartminer-midia relative overflow-hidden rounded-2xl border border-[#0079CB]/[18%] bg-white"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden">
                      {/* PLACEHOLDER DECLARADO (item 3 da issue: «slots de imagem sem
                          arte = capa do Smart Miner»). Não existe arte por etapa —
                          o Match AI só ganhou as quatro dele na SIS-292, e criar arte
                          nova está fora do escopo desta issue. Segue decorativa
                          (`alt=""`) porque o título e o apoio ao lado já dizem o que a
                          imagem ilustra. */}
                      <Image
                        src={VITRINE?.capaCard ?? CAPA}
                        alt=""
                        aria-hidden
                        fill
                        sizes="(min-width: 1180px) 280px, (min-width: 640px) 50vw, 100vw"
                        loading="lazy"
                        className="smartminer-midia-arte object-cover"
                      />
                      <span aria-hidden className="absolute inset-0 bg-[#001A3D]/25" />
                    </div>
                    <div className="relative p-5">
                      {/* O ícone encavala a faixa de arte: disco branco com metade
                          para dentro da imagem (`-mt-9` contra `h-12`). Fundo chapado
                          porque a arte passa atrás — com disco translúcido o contraste
                          do glifo passaria a depender de qual pixel da foto caiu ali. */}
                      <span
                        aria-hidden
                        className="-mt-9 mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-[#0079CB]/[18%] bg-white shadow-[0_10px_24px_-14px_rgba(0,55,100,0.5)]"
                      >
                        <Icone className="h-6 w-6 text-[#0079CB]" strokeWidth={1.6} />
                      </span>
                      <h3 className="font-display text-base font-bold leading-snug text-ink">
                        {item.termo}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.texto}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </RevealScope>
        </section>
      )}

      {/* ── 3. ONDE USAR O SMART MINER? ──────────────────────────────────────
          Texto + foto com balão por cima — o arranjo do «Posicionamento» do Match AI.
          Os DOIS parágrafos do bloco aparecem UMA vez cada: o primeiro na coluna de
          texto, o segundo dentro do balão. O balão não é citação decorativa repetindo
          o que já está ao lado, e é o `slice(1)`/`[1]` abaixo que garante isso.
          O segundo parágrafo é justamente o que se sustenta sozinho fora do fio do
          texto (a integração com o Console de Pré Análise e com o Fast), que é o tipo
          de afirmação que a referência põe no balão. */}
      {ondeUsar && (
        <section
          className="section-light section-py relative overflow-clip"
          aria-labelledby={idDoBloco(ondeUsar.heading!)}
        >
          {/* A variante `--baixo` espelha o canto: aqui o alto à direita é onde a foto
              fica, e grafismo atrás de foto é grafismo jogado fora. */}
          <AcentosClaros />
          <EsteiraCanto className="smartminer-esteira--claro smartminer-esteira--baixo" />
          {/* O ESCOPO É A SEÇÃO INTEIRA porque o «pop» do balão usa o `data-in` DESTE
              escopo (`[data-in='false'] .smartminer-balao` no `globals.css`), em vez de
              um preset novo ou de um segundo observador — o gesto não é nenhum dos seis
              presets (sobe E cresce com repique) e o escopo desta seção já existe. */}
          <RevealScope
            className="container-lp relative z-10"
            limiar={LIMIAR_REVEAL}
            margem={MARGEM_REVEAL}
            data-reveal-nome="smartminer-onde-usar"
          >
            <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
              <div>
                <h2
                  data-reveal="fade-up"
                  id={idDoBloco(ondeUsar.heading!)}
                  className="font-display text-section font-bold text-ink"
                >
                  {ondeUsar.heading}
                </h2>
                <div className="mt-6 space-y-4">
                  {ondeUsar.paragraphs.slice(0, 1).map((p, i) => (
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
              {/* O `pb-14` é estrutural e não estético: o balão desce para FORA da
                  moldura (é o que faz dele balão sobreposto e não legenda dentro da
                  foto), e sem a reserva ele encostaria no que vem embaixo. */}
              <div data-reveal="scale-soft" style={cascata(2)} className="relative pb-14 lg:pb-16">
                {/* A FOTO É A CAPA DO CARTÃO, e não a capa do hero: a do hero tem o
                    letreiro «Smart Miner» desenhado no alto à direita (ver a nota do
                    terceiro véu lá em cima), e num quadro 4/3 ele entra CORTADO no meio
                    das letras — foi o que a captura de 1440 desta issue mostrou. A capa
                    do cartão é a mesma arte da vitrine desta solução, sem letreiro. */}
                <div className="smartminer-midia relative aspect-[4/3] overflow-hidden rounded-3xl border border-[#0079CB]/[18%]">
                  <Image
                    src={VITRINE?.capaCard ?? CAPA}
                    alt=""
                    aria-hidden
                    fill
                    sizes="(min-width: 1180px) 500px, 100vw"
                    loading="lazy"
                    className="smartminer-midia-arte object-cover"
                  />
                </div>
                {ondeUsar.paragraphs[1] && (
                  <div className="smartminer-balao absolute bottom-0 left-4 right-4 rounded-2xl border border-[#0079CB]/[18%] bg-white p-4 shadow-[0_10px_18px_-12px_rgba(0,30,70,0.35),0_30px_60px_-26px_rgba(0,30,70,0.55)] sm:left-8 sm:right-8">
                    {/* O BICO: quadrado girado 45° com as duas bordas de cima pintadas
                        e o resto herdando o fundo do balão — a ponta SEM um segundo nó e
                        sem `clip-path`, que cortaria a borda de 1px. Aponta para CIMA,
                        para a foto de onde o balão sai. `-top-[7px]` = metade da
                        diagonal menos a borda. */}
                    <span
                      aria-hidden
                      className="absolute -top-[7px] left-8 h-3 w-3 rotate-45 border-l border-t border-[#0079CB]/[18%] bg-white"
                    />
                    <p data-balao="" className="relative text-sm leading-relaxed text-ink-muted">
                      {ondeUsar.paragraphs[1]}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </RevealScope>
        </section>
      )}

      {/* ── 4. COMO USAR O SMART MINER? ──────────────────────────────────────
          Faixa ESCURA com o trilho «tipificação → extração → esteira», que é o que a
          issue nomeia.
          O `bg-[#001A3D]` é DECLARADO e não herdado, e isso está medido na irmã desta
          issue: o `body` deste site é `#1273bc` (`globals.css:385`), azul MÉDIO — sem
          fundo próprio, as tintas brancas do trilho medem 4,08:1 e 3,17:1 contra ele,
          reprovadas no piso de 4,5. Com o navy profundo chapado o mesmo texto passa
          com folga.
          A CAPA ENTRA COMO FUNDO sob um véu, e o chapado NÃO sai: ele é o piso de
          contraste para o caso de a arte não carregar, e é o véu que garante que o
          número medido não dependa de qual pedaço da foto caiu atrás de qual passo.
          SEM `z-index` negativo na camada da arte — foi o defeito medido no Match AI:
          a seção não cria contexto de empilhamento por `position: relative` sozinha, e
          um filho negativo desce para trás do `background` da PRÓPRIA seção, que aqui é
          chapado; a imagem pintava embaixo do fundo. A ordem de documento resolve. */}
      {comoUsar && (
        <section
          className="section-py relative overflow-clip bg-[#001A3D]"
          aria-labelledby={idDoBloco(comoUsar.heading!)}
        >
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <Image
              src={CAPA}
              alt=""
              fill
              sizes="100vw"
              loading="lazy"
              className="object-cover object-[center_15%]"
            />
            {/* VÉU QUASE FECHADO NOS TRÊS TERÇOS, e não um gradiente que abre à
                direita: o trilho é uma grade de TRÊS colunas ocupando a faixa inteira,
                então há texto branco sobre o terço direito também — e o terço direito
                desta arte é o painel aceso, o pior possível para branco por cima. O
                leve degradê que sobra existe só para a arte não ficar uniformemente
                apagada. */}
            {/* O VÉU É GRADIENTE EXPLÍCITO, e não o trio `from-/via-/to-` com barra de
                opacidade: `from-[#001A3D]/97` NÃO GERA REGRA nesta versão do Tailwind, e
                a captura saiu com a faixa escura SEM VÉU NENHUM — arte crua, letreiro
                gigante e o texto do trilho ilegível por cima. Escrito como
                `linear-gradient` com `rgba`, o valor é o que está aqui.
                A opacidade SUBIU de 95/93/90 para 97/96,5/95,5 depois da primeira captura
                de 1440: a 93% o letreiro «Smart Miner» desenhado na arte atravessava o
                `h2` como marca-fantasma, dizendo o nome do produto uma terceira vez na
                mesma rota. A 96% a arte ainda dá profundidade à faixa e o letreiro
                deixa de se ler. */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,26,61,0.97)_0%,rgba(0,26,61,0.965)_50%,rgba(0,26,61,0.955)_100%)]" />
          </div>
          {/* A malha e a esteira ENTRAM DEPOIS da foto e do véu, de propósito: o véu
              apaga a arte a 90–95% e a malha tem de ficar SOBRE ele, senão a grade
              seria a coisa mais apagada da faixa. O par 0/1 entre irmãos não é
              preferência: `.grade-tecnica` nasce em `z-index: -1`, e como esta seção tem
              fundo chapado, o negativo a jogaria para trás dele. `.smartminer-grade`
              reescreve para 0. */}
          <div aria-hidden className="grade-tecnica smartminer-grade" />
          <EsteiraCanto className="smartminer-esteira--escuro" />
          <RevealScope
            className="container-lp relative z-10"
            limiar={LIMIAR_REVEAL}
            margem={MARGEM_REVEAL}
            data-reveal-nome="smartminer-como-usar"
          >
            <div>
              <h2
                data-reveal="fade-up"
                id={idDoBloco(comoUsar.heading!)}
                className="font-display text-section font-bold text-white"
              >
                {comoUsar.heading}
              </h2>
              {/* O PRIMEIRO PARÁGRAFO é a introdução do bloco (a API interligada aos
                  canais de entrada, chamada a cada upload). O segundo desce para o
                  cartão depois do trilho — cada um aparece uma vez. */}
              <p
                data-reveal="fade-up"
                style={cascata(1)}
                className="mt-4 max-w-3xl text-lg leading-relaxed text-white/85"
              >
                {comoUsar.paragraphs[0]}
              </p>
              {/* O TRILHO. Placa quadrada arredondada e não disco (item 4): documento em
                  esteira não é balão. O fio é UM nó por par de passos — o último não tem
                  para onde apontar — e só a partir de `sm`, onde os três estão lado a
                  lado; empilhado não há fio nenhum, que é o certo, porque um segmento
                  horizontal entre passos empilhados ligaria coisas que não estão em
                  linha. O fio nasce no CENTRO da placa (`top-7` = metade de `h-14`) e
                  atravessa o vão da grade (`-right-8` = `gap-8`) até a placa seguinte.
                  `bg-[#6EE7B7]/35` FICA no fio: é o piso de cor para quando o laço está
                  desligado — movimento reduzido mata a animação, e a linha do trilho não
                  pode desaparecer com ela. */}
              <ol className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
                {TRILHO.map((passo, i, todos) => {
                  const Icone = ICONES_TRILHO[i] ?? Sparkles;
                  return (
                    <li key={passo.termo} data-reveal="fade-up" style={cascata(i + 2)} className="relative">
                      <span
                        aria-hidden
                        className={[
                          'smartminer-passo flex h-14 w-14 items-center justify-center rounded-xl border border-[#6EE7B7]/55 bg-[#001A3D]/60',
                          i === 1 && 'smartminer-passo--2',
                          i === 2 && 'smartminer-passo--3',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        <Icone className="h-6 w-6 text-[#A7F3D0]" strokeWidth={1.6} />
                      </span>
                      {i < todos.length - 1 && (
                        <span
                          aria-hidden
                          className="smartminer-fio absolute left-14 right-[-2rem] top-7 hidden h-px bg-[#6EE7B7]/35 sm:block"
                        />
                      )}
                      <h3 className="mt-5 font-display text-base leading-snug text-white">
                        {passo.termo}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/80">{passo.texto}</p>
                    </li>
                  );
                })}
              </ol>
              {/* O SEGUNDO PARÁGRAFO (os kits de documentos por ramo/natureza/cobertura
                  e os avisos) como cartão ao pé do trilho: é o que vem DEPOIS da
                  esteira, trabalhando junto com o Console de Pré Análise, e num cartão
                  ele não se confunde com um quarto passo.
                  Ilha escura dentro de faixa escura, então tinta branca direto — nenhuma
                  rede de segurança de `.section-light` alcança aqui. */}
              {comoUsar.paragraphs[1] && (
                <div
                  data-reveal="fade-up"
                  style={cascata(5)}
                  className="mt-10 flex max-w-3xl items-start gap-4 rounded-2xl border border-[#6EE7B7]/25 bg-white/[0.06] p-5"
                >
                  <FileStack
                    aria-hidden
                    className="mt-0.5 h-6 w-6 shrink-0 text-[#A7F3D0]"
                    strokeWidth={1.6}
                  />
                  <p className="text-sm leading-relaxed text-white/85">{comoUsar.paragraphs[1]}</p>
                </div>
              )}
            </div>
          </RevealScope>
        </section>
      )}

      {/* ── 5. CONHEÇA TAMBÉM ────────────────────────────────────────────────
          A mesma peça de fecho do Match AI, e de propósito: ela é a versão desta
          família de páginas do `<nav>` «Outras soluções» do template, com as pílulas
          (a atual como `<span aria-current="page">`, fora da ordem de tabulação) e os
          seis cartões de irmã. Não é copy do Match AI — são o nome e a capa de cada
          solução, vindos de `accelerators.ts`/`ACCELERATOR_PAGES`, e a única frase
          própria é a linha de apoio, que é a mesma nas duas rotas porque descreve a
          FAMÍLIA e não o produto.
          A faixa é a mais baixa da página (`py-12`), então leva os pontos e NÃO a
          esteira: uma arte de 320px de lado numa faixa de ~176px de miolo seria
          recortada em quase tudo e o pedaço restante encostaria nos cartões.
          O VÉU sobre cada capa não é estética: as logos de `accelerators.ts` são de
          tinta clara, e sobre as capas (que têm regiões claras) elas desapareceriam.
          O `alt` do logo NÃO é vazio, ao contrário de todas as outras imagens desta
          página: o logo é a única coisa que identifica o destino do link, e sem texto
          acessível seriam seis links indistinguíveis (WCAG 2.4.4). */}
      <nav
        aria-labelledby="conheca-tambem"
        className="section-light relative overflow-clip py-12 md:py-16"
      >
        <AcentosClaros />
        <RevealScope
          className="container-lp relative z-10"
          limiar={LIMIAR_REVEAL}
          margem={MARGEM_REVEAL}
          data-reveal-nome="smartminer-conheca"
        >
          <h2 id="conheca-tambem" data-reveal="fade-up" className="font-display text-xl font-bold text-ink">
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
                      className="inline-block rounded-full border border-[#0079CB]/70 bg-[#0079CB]/[12%] px-3 py-1.5 text-xs font-semibold text-[#0a1f44]"
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
                  className="smartminer-midia group relative block aspect-[16/10] overflow-hidden rounded-xl border border-[#0079CB]/[18%] transition-colors hover:border-[#0079CB]/55"
                >
                  <Image
                    src={a.capaCard}
                    alt=""
                    aria-hidden
                    fill
                    sizes="(min-width: 1180px) 176px, (min-width: 640px) 33vw, 50vw"
                    loading="lazy"
                    className="smartminer-midia-arte object-cover"
                  />
                  <span aria-hidden className="absolute inset-0 bg-[#001A3D]/55" />
                  <span className="absolute inset-0 flex items-center justify-center p-3">
                    {/* `width`/`height` são as dimensões INTRÍNSECAS do dado: com
                        `images: { unoptimized: true }` o que baixa é o arquivo do disco,
                        então o par serve para reservar a caixa e não distorcer a marca. */}
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
            /* `on-dark` É OBRIGATÓRIO: esta é uma pílula de fundo cheio DENTRO de
               `.section-light`, cujos overrides pintam de navy tudo que traga
               `text-white` (`[class*="text-white"] { color: #0a1f44 }`,
               globals.css:1115). O fundo é `#0060A8` e não `#0079CB` pelo número
               medido na SIS-292: branco 0,88 sobre o primário dá ~4,2:1, abaixo do
               piso; sobre o azul de hover da paleta passa com folga. */
            className="on-dark mt-6 inline-flex items-center gap-2 rounded-full bg-[#0060A8] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#004D8A]"
          >
            Ver todas as soluções e serviços
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden />
          </Link>
        </RevealScope>
      </nav>
      {/* O modal montado no FIM da árvore, como em `Header.tsx:916`, e sem
          `title`/`description`: os defaults são a escrita «Fale com a gente». Ele se
          portala para fora daqui, então a posição no markup não afeta o desenho — o que
          ela evita é nascer dentro de uma seção com `transform`/`filter`, que ancoraria
          o `fixed` do `<dialog>` no lugar errado. */}
      <ContactModal open={contatoAberto} onClose={() => setContatoAberto(false)} />
    </>
  );
}
