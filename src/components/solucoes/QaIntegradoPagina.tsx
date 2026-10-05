'use client';

/**
 * SIS-287 — O CORPO DA `/solucoes/qa-integrado`, na MESMA ARQUITETURA DE SEÇÕES da
 * `/solucoes/match-ai` (`MatchAiPagina`) e com IDENTIDADE PRÓPRIA.
 *
 * IRMÃ DA SIS-279 («não misturar os tickets»): o padrão é o que aquela issue
 * registrou — componente dedicado, montado no `[slug]/page.tsx` SÓ para esta slug,
 * porque o template renderiza `page.blocks.map(...)` no mesmo molde para as sete e
 * expressar hero sangrado, grade de cards, faixa escura com trilho e vitrine de
 * irmãs como variação de `Block`/`ItemList` mudaria o molde das SETE. Com esta, o
 * mapa `CORPOS_PROPRIOS` passa a ter QUATRO entradas e as TRÊS slugs restantes
 * seguem no caminho genérico sem uma linha tocada.
 *
 * ── TODA A ESCRITA VEM DO SITE ────────────────────────────────────────────────
 * Nada de copy do Match AI nem do Smart Miner colada aqui, e nada de claim novo. As
 * fontes são as duas já publicadas:
 *   1. `src/data/acceleratorPages.ts` → `lead`, os dois parágrafos de abertura, o
 *      bloco `kind: 'list'` («Nossos serviços de QA Integrado incluem», cinco itens)
 *      e o parágrafo de fecho.
 *   2. `src/data/accelerators.ts` → a `description` do cartão da vitrine, usada UMA
 *      vez, como apoio do primeiro título.
 *
 * A DIFERENÇA DE DADO EM RELAÇÃO À IRMÃ, e ela muda o trabalho: o Smart Miner não
 * tem bloco de lista, então as fichas dele nasceram de FRAGMENTOS VERBATIM
 * declarados no componente. Aqui a lista EXISTE no dado — é a única slug com
 * `kind: 'list'` até agora —, então a grade de cards é alimentada pelos cinco
 * `items` de verdade (item 3 da issue), e o que este arquivo declara são só os
 * ÍCONES. Nenhum texto de card foi digitado aqui.
 *
 * ── OS TÍTULOS DE FAIXA QUE O DADO NÃO TEM ────────────────────────────────────
 * O dado desta slug tem UM `heading` só (o da lista). A arquitetura do Match AI tem
 * um título por faixa, então duas faixas precisavam de título e nenhum podia ser
 * inventado: os dois são FRAGMENTOS VERBATIM dos parágrafos que a própria faixa
 * publica — «Qualidade não é uma etapa final» abre o primeiro parágrafo, e «Uma
 * abordagem colaborativa» abre o segundo. É a mesma régua de «derivar rótulo, não
 * inventar claim» que a SIS-279 usou nos `termo` dos cards.
 * A faixa de fecho NÃO ganhou título: o parágrafo dela é a própria afirmação de
 * posicionamento («qualidade e agilidade caminham juntas…»), e um `h2` com um
 * pedaço dela em cima dela seria a mesma frase duas vezes.
 *
 * ── `pageSections` / ÂNCORAS (item 5 da issue): NADA A MUDAR, e com razão ──────
 * `SECOES_DE_ACELERADOR` monta as paradas percorrendo os blocos COM `heading` e
 * devolve `VAZIO` quando sobram menos de três (`paradas.length >= 3 ? paradas :
 * VAZIO`). Esta slug tem um `heading` só → «Início» + uma parada = 2 → `VAZIO`, e a
 * rota NÃO TEM indicador lateral. É o que o comentário de `pageSections.ts:240` já
 * previa nominalmente («exclui `qa-integrado` e `connect-api`, que têm um título
 * só»). Ela também não está em `TOM_MEDIO_DE_ACELERADOR` nem em
 * `TOM_CLARO_DE_ACELERADOR`, e não precisa estar: tom de parada só é lido se houver
 * parada.
 * A consequência prática é que os dois `h2` derivados acima NÃO desalinham nada —
 * não existe lista de paradas para eles contradizerem. A única âncora que este
 * arquivo tem de preservar é a do título que existe no dado, e ela sai de
 * `idDoBloco(heading)`, o mesmo dono de sempre. Se um dia um `heading` novo entrar
 * no dado desta slug, o `>= 3` passa a valer e os títulos derivados daqui precisam
 * virar `heading` de bloco — está escrito aqui para o próximo não descobrir isso na
 * tela.
 *
 * ── IDENTIDADE PRÓPRIA (item 4: variar 1–2 componentes vs Match AI E Smart Miner) ─
 * Três peças divergem das DUAS irmãs de propósito:
 *   1. O GRAFISMO DE CANTO é `MalhaDeCasos` — grade de casos de teste com três
 *      confirmações que se DESENHAM por `stroke-dashoffset` e apagam. Lá é circuito
 *      (Match AI) e esteira de documentos (Smart Miner); aqui é o quadro de casos
 *      passando, que é o que o produto faz. A mecânica é a da casa (linha base +
 *      traço normalizado com `pathLength="1"`, máscara por elemento em vez de
 *      `<defs>`/`id`, porque o componente é montado várias vezes na página).
 *   2. O SELO DO PASSO é REDONDO COM ANEL TRACEJADO QUE GIRA — disco liso no Match
 *      AI, placa quadrada no Smart Miner. Ciclo de qualidade é volta que se repete, e
 *      o anel girando desenha isso; o giro vive na propriedade `rotate` de um nó
 *      IRMÃO do ícone, para não haver dois donos do `transform` (a colisão que o
 *      bloco da University registra).
 *   3. O FIO entre passos leva uma CONTA que corre (ponto único deslizando por
 *      `background-position` de um `radial-gradient`), e não o tracejado em marcha do
 *      Smart Miner nem o degradê de 200% do Match AI.
 *   4. O CARD da grade tem a arte em TIRA VERTICAL na borda esquerda, com o ordinal
 *      encavalando a tira — em vez da faixa 16/9 no topo (Smart Miner) ou da
 *      miniatura 28/32 na lateral (Match AI). O ordinal aparece porque o dado DIZ
 *      `ordered: true`, e é o único dos três a dizer.
 * A COR é a do dado: `#7CCBF3` é o `tone` que `accelerators.ts` declara para o QA
 * Integrado (ciano claro; o do Smart Miner é menta e o do Match AI é outro ciano).
 * Ela vale SÓ nas faixas escuras — sobre folha clara um azul claro a 12% é textura,
 * mas como TINTA reprova no piso de contraste, e o número que reprovou o ciano do
 * Match AI (1,03:1, medido na SIS-292) vale para este. Nas faixas claras a tinta de
 * grafismo é o azul institucional `#0079CB`, como nas duas irmãs.
 *
 * ── O CARIMBO ENTRA (SIS-279) ─────────────────────────────────────────────────
 * A arte chegou: `carimbo-qa-integrado-ticket-outline-ffffff.png`. O mount é o que
 * esta nota prescrevia — `CarimboBatida` acima do `h1`, classe
 * `qaintegrado-carimbo`, tombo e tinta medidos ANTES (a apuração está na constante
 * `CARIMBO`, mais abaixo). Ao contrário do Fast e do Connect API, aqui NÃO HAVIA tag
 * textual «Tecnologia Disruptiva» para a cápsula substituir: este hero nunca montou
 * o `PageHero` genérico, e a manchete já era `page.name` direto. Então a cápsula
 * ACRESCENTA uma etiqueta acima da manchete, e não troca nada de lugar.
 *
 * O que esta nota dizia, para o registro de como a condição se resolveu:
 *
 * «── O CARIMBO NÃO ENTRA, e é registro, não esquecimento ──
 * A issue condiciona: "carimbo se houver arte". NÃO EXISTE arte de carimbo do QA
 * Integrado em `public/` — as duas cápsulas do repositório são
 * `images/solucoes/carimbo-match-ai-ticket-outline-ffffff.png` e a irmã
 * `…-smart-miner-…`, e usar qualquer uma delas aqui publicaria o nome de OUTRO
 * produto no topo desta rota (foi exatamente o defeito da 5ª volta do Match AI, com
 * a cópia que escrevia «MACH AI»). Quando a cápsula do QA chegar, o mount é
 * `CarimboBatida` acima do `h1`, com a classe `qaintegrado-carimbo` — e o tamanho
 * tem de sair da ALTURA da caixa, não da largura da irmã copiada (a conta está no
 * `globals.css`, no bloco do Smart Miner). Antes de montar, medir o TOMBO da arte:
 * o componente assenta em `rotation: 0` porque as duas artes que ele serve vêm
 * tombadas ~−3° dentro do arquivo, e arte reta exigiria um `tomboRepouso` novo.»
 *
 * ── A MARCA DESENHADA DENTRO DA CAPA (defeito declarado, não corrigido) ───────
 * A capa desta rota (`qa-integrado-hero.webp`) traz uma PLACA com «QA Integrado»
 * desenhada no MIOLO da arte, dentro do anel de ícones — não numa tira morta do
 * alto, como a do Smart Miner. Então a receita da irmã (véu opaco na faixa do
 * letreiro) NÃO se aplica: apagar o miolo apagaria o anel, que é o assunto da
 * imagem. O resultado é que o nome aparece duas vezes na dobra — uma como manchete,
 * à esquerda, e uma dentro da foto, à direita. Fica como número medido e declarado,
 * e a correção de verdade é arte nova sem a placa, o que está FORA do escopo desta
 * issue («sem novas artes finais»).
 *
 * ── MOVIMENTO ────────────────────────────────────────────────────────────────
 * `RevealScope` + `data-reveal` + `./reveal-calibre`, que é o mecanismo do Match AI
 * (e não o `variants` de `@/lib/motion` do `FastPagina`): a issue manda espelhar o
 * motion/reveal do Match AI, e a razão de não somar os dois está no docblock dele
 * (dois donos do mesmo `transform`). `esperarRota` SÓ no escopo do hero, pelo
 * contrato da SIS-269. O movimento em laço é todo CSS, no bloco `SIS-287` do fim do
 * `globals.css`, com os DOIS canais de movimento reduzido.
 */

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Bot,
  ClipboardList,
  Code2,
  LineChart,
  MessagesSquare,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import ContactModal from '@/components/ContactModal';
import CarimboBatida from '@/components/CarimboBatida';
import RevealScope from '@/components/motion/RevealScope';
import { ACCELERATORS } from '@/data/accelerators';
import {
  ACCELERATOR_PAGES,
  idDoBloco,
  type AcceleratorPage,
} from '@/data/acceleratorPages';
import { CAPAS_DE_ABERTURA } from '@/data/capasSolucoes';
import { LIMIAR_REVEAL, MARGEM_REVEAL } from './reveal-calibre';

/* A CAPA DA ROTA vem de `capasSolucoes.ts`, que é o dono do mapa (dois leitores: o
   template genérico e as páginas com corpo próprio) — e não de um caminho digitado
   aqui. Já é a derivada WebP, o que importa porque com `images: { unoptimized: true }`
   (SIS-154) o `next/image` entrega o arquivo como ele está no disco e um PNG cru iria
   inteiro para o LCP do hero. */
const CAPA = CAPAS_DE_ABERTURA['qa-integrado'].src;

/* ── SIS-279 — A CÁPSULA DO HERO, QUE AGORA EXISTE ────────────────────────────
   O docblock acima registrava «NÃO EXISTE arte de carimbo do QA Integrado em
   `public/`» e prescrevia o mount para quando ela chegasse. Ela chegou, e o mount é
   exatamente o prescrito: `CarimboBatida` acima do `h1`, classe
   `qaintegrado-carimbo`, tombo medido ANTES.

   O arquivo desceu da raiz de `public/` para `public/images/solucoes/`, junto das
   quatro irmãs — a razão é a que o Smart Miner registra: a mesma família de cápsula
   em duas pastas foi o que produziu o defeito da 5ª volta do Match AI.

   MEDIDO (`scripts/medir-carimbos-sis279.mjs` → `docs/medidas/sis279-carimbos.json`):

   1. TOMBO DE REPOUSO **−3,03°** (topo da tinta cai de y=43 em x=154 para y=14 em
      x=701) — o mesmo da arte de `/parceiros` até a segunda decimal. O repouso em
      `rotation: 0` que `CarimboBatida` assume vale para ela, e o `tomboRepouso` que
      uma arte reta exigiria continua não sendo preciso. Era o portão que podia
      reprovar a arte.
   2. TINTA CLARA SOBRE TRANSPARÊNCIA: média `rgb(255, 255, 255)` nos 29.594 pixels
      opacos, canto com alfa 0. Cápsula branca só se lê em faixa escura — e é por
      isso que ela entra NO HERO e não desce para as faixas claras desta rota.
   3. GRAFIA conferida em captura sobre `#001A3D`: «SISTRAN | QA Integrado».

   855×291 (razão 2,938:1) — dimensões INTRÍNSECAS, que montam `--carimbo-batida-ar`
   para a cápsula não achatar. O tamanho sai de `--carimbo-batida-w` em
   `.qaintegrado-carimbo`, e é calibrado pela ALTURA da caixa e não pela largura da
   irmã copiada — que é o que o docblock prescreveu e a conta está no `globals.css`. */
const CARIMBO = {
  src: '/images/solucoes/carimbo-qa-integrado-ticket-outline-ffffff.png',
  largura: 855,
  altura: 291,
};

/* O cartão da vitrine desta solução: a `description` (apoio do primeiro título) e a
   `capaCard` (a arte dos placeholders). Achado por `id` e não digitado — duas cópias
   da mesma frase divergiriam na primeira revisão de texto. */
const VITRINE = ACCELERATORS.find((a) => a.id === 'qa-integrado');

/* ── OS ÍCONES DOS CINCO SERVIÇOS ──────────────────────────────────────────────
   Na ordem dos `items` do bloco `kind: 'list'`, e cada um é leitura literal do item
   que acompanha: prancheta (planejamento e design de cases), escudo (funcionalidade,
   desempenho e SEGURANÇA), ciclo (melhoria CONTÍNUA dos processos), autômato
   (automação de testes), conversa (feedback contínuo e colaboração direta).
   São só ícones: nenhum texto de card nasce aqui — os cinco vêm do dado. */
const ICONES_SERVICOS = [ClipboardList, ShieldCheck, RefreshCw, Bot, MessagesSquare];

/* ── OS TRÊS PASSOS DO TRILHO DA FAIXA ESCURA ─────────────────────────────────
   A issue pede «trilho/processo adaptado ao ciclo de qualidade, só copy do site». O
   dado NÃO tem etapas de ciclo nomeadas — inventar «planejar → testar → corrigir»
   seria claim novo. O que ele tem, no segundo parágrafo, é quem trabalha lado a lado:

     «Com uma abordagem colaborativa, nossos especialistas em QA trabalham lado a
      lado com desenvolvedores, analistas de negócios e outros stakeholders,
      promovendo um desenvolvimento mais eficiente e prevenindo problemas antes que
      se tornem grandes desafios.»

   Os três `termo` abaixo são os TRÊS SUBSTANTIVOS dessa frase, na ordem em que ela
   os diz, e cada `texto` é fragmento verbatim dela ou do parágrafo de abertura da
   mesma slug. O trilho é, portanto, o ciclo de quem revisa o quê — que é a única
   sequência que esta escrita sustenta. */
const TRILHO = [
  {
    termo: 'Desenvolvedores',
    texto: 'feedback contínuo e colaboração direta com desenvolvedores',
  },
  {
    termo: 'Analistas de negócios',
    texto: 'testes e validações incorporados desde o início do projeto',
  },
  {
    termo: 'Outros stakeholders',
    texto: 'prevenindo problemas antes que se tornem grandes desafios',
  },
];

const ICONES_TRILHO = [Code2, LineChart, Users];

/* Os dois títulos de faixa que o dado não tem, como constantes e não literais no
   JSX: eles são usados DUAS vezes cada (o `aria-labelledby` da seção e o `id` do
   `h2`), e duas cópias de string a virar âncora é o jeito de as duas divergirem. A
   procedência de cada um está no docblock. */
const TITULO_ABERTURA = 'Qualidade não é uma etapa final';
const TITULO_COLABORACAO = 'Uma abordagem colaborativa';

/* O índice da cascata vive em `--reveal-i`; o atraso sai de
   `calc(var(--motion-stagger-reveal) * var(--reveal-i))`. Mesmo helper das irmãs,
   pela mesma razão: não repetir o cast de custom property em vinte pontos. */
const cascata = (i: number) => ({ '--reveal-i': i }) as React.CSSProperties;

/* As manchas de ponto fino e o quadrado pálido das faixas claras — a textura da casa
   (`/sistran-university`, `/sistran-labs`, `.matchai-acentos`, `.smartminer-acentos`).
   Nó e não pseudo-elemento porque `.section-light` já gastou os dois (`::before`
   malha de 96px, `::after` pontilhado). `aria-hidden` porque é grafismo: sem ele o
   leitor de tela anuncia um nó vazio antes do conteúdo da seção. */
function AcentosClaros() {
  return <span aria-hidden className="qaintegrado-acentos" />;
}

/* ── O GRAFISMO DE CANTO: A MALHA DE CASOS (item 4, a variação de componente) ───
   Geometria nova, mecânica da casa: uma grade de casos de teste (quadrados de canto
   arredondado) e TRÊS confirmações que se desenham por cima. O `<path>` do «visto» é
   desenhado com `stroke-dasharray`/`-dashoffset` — a receita de `svg-stroke-drawing`
   — e `pathLength="1"` normaliza o comprimento, o que deixa o CSS escrever a fração
   em vez de medir cada caminho.

   `viewBox` FIXO com `preserveAspectRatio` padrão: são quatro caixas de alturas
   diferentes que ainda vão mudar ao mudar copy, e amarrar a arte à altura da seção
   seria um número a recalibrar por faixa (o defeito da 1ª volta dos grafismos do
   Unidep).

   SEM `<defs>`/`id`: este componente é montado QUATRO vezes na mesma página, e `id`
   repetido faz todo `url(#…)` apontar para o primeiro. As pontas morrem por
   `mask-image` no CSS, que é por elemento e não por documento. */
function MalhaDeCasos({ className }: { className: string }) {
  return (
    <svg aria-hidden className={`qaintegrado-malha ${className}`} viewBox="0 0 320 320">
      {/* A GRADE. Nove células em três linhas, encostadas no canto alto direito, que é
          de onde a máscara faz a arte nascer. */}
      {[0, 1, 2].map((linha) =>
        [0, 1, 2].map((coluna) => (
          <rect
            key={`${linha}-${coluna}`}
            className="qaintegrado-caso"
            x={168 + coluna * 56}
            y={40 + linha * 56}
            width="44"
            height="44"
            rx="10"
          />
        )),
      )}
      {/* AS TRÊS CONFIRMAÇÕES, uma por linha e em colunas diferentes, para a leitura
          ser «casos sendo aprovados» e não «uma coluna piscando». Cada `d` é o mesmo
          visto transladado — dois segmentos, o curto descendo e o longo subindo. */}
      <path className="qaintegrado-visto" pathLength="1" d="M 178 60 L 186 70 L 202 50" />
      <path
        className="qaintegrado-visto qaintegrado-visto--2"
        pathLength="1"
        d="M 290 116 L 298 126 L 314 106"
      />
      <path
        className="qaintegrado-visto qaintegrado-visto--3"
        pathLength="1"
        d="M 234 172 L 242 182 L 258 162"
      />
    </svg>
  );
}

export default function QaIntegradoPagina({ page }: { page: AcceleratorPage }) {
  /* Os blocos por TIPO e por `heading`, e não por índice: índice é dependência
     invisível, e um bloco novo no dado reordenaria as seções em silêncio (a nota é a
     do Match AI). O guarda de `kind` é o que deixa o TypeScript saber que
     `paragraphs`/`items` existem.
     São DOIS blocos de parágrafo sem título nenhum, então aqui eles são distinguidos
     por POSIÇÃO RELATIVA à lista: o de abertura é o que vem antes dela, o de fecho é
     o que vem depois. É mais estável que `[0]`/`[2]`, porque continua certo se um
     terceiro parágrafo entrar em qualquer ponta. */
  const iDaLista = page.blocks.findIndex((b) => b.kind === 'list');
  const lista = iDaLista >= 0 ? page.blocks[iDaLista] : undefined;
  const abertura = page.blocks.find((b, i) => b.kind === 'paragraphs' && i < iDaLista);
  const fecho = page.blocks.find((b, i) => b.kind === 'paragraphs' && i > iDaLista);

  /* O SUBTÍTULO DO HERO é a CAUDA do `lead`. O dado é «QA Integrado – Qualidade
     desde o Primeiro Código»: com a manchete já dizendo «QA Integrado» em negrito
     (item 1 da issue), publicar o `lead` inteiro embaixo dela escreveria o nome do
     produto duas vezes em duas linhas seguidas. O corte é no travessão do próprio
     dado, e se ele não existir a cauda é o `lead` inteiro — nenhuma escrita se perde
     num dado que mude de forma. */
  const subtitulo = page.lead.includes('–')
    ? page.lead.slice(page.lead.indexOf('–') + 1).trim()
    : page.lead;

  /* Um estado só para o modal: `ContactModal` cuida de `showModal()`, do portal, da
     pausa do scroll suave e da devolução do foco ao gatilho. */
  const [contatoAberto, setContatoAberto] = useState(false);

  return (
    <>
      {/* ── 1. HERO: A ARTE SANGRADA ─────────────────────────────────────────
          O molde e os NÚMEROS são os das irmãs, e reaproveitá-los é o que garante que
          a emenda feche: `-top-28 md:-top-36` é exatamente o `pt-28 md:pt-36` que o
          `PageShell` põe no `<main id="conteudo">` (7rem e 9rem), a distância entre o
          topo da janela e o começo do conteúdo. É o que faz a arte subir ATRÁS do
          cabeçalho em vez de parar embaixo dele, deixando visível a tira de fundo da
          rota (a receita medida em `/esg`).
          Por isso NÃO há `overflow-clip` aqui: qualquer recorte corta exatamente o
          pedaço que sobe atrás do cabeçalho, e `overflow-x-clip` não serve de
          meio-termo (CSS Overflow 3: com um eixo em `clip`, o `visible` computa
          `clip`). O cabeçalho continua na frente — `Header.tsx` é `fixed … z-50` e a
          arte nasce em `z-index: auto`.
          `id="topo"` é obrigatório: é a âncora do item «Início» do indicador lateral,
          e ela vinha do `PageHero`, que esta slug deixa de montar. Que o indicador
          não monte NESTA rota (ver o docblock) não muda isso — a âncora também é o
          destino do «pular para o conteúdo».
          A ALTURA MÍNIMA é a das irmãs, que é a de `/esg` medida na janela de 900px
          (414px = 25,9rem e 528px = 33rem); sem ela a faixa fica com a altura do
          texto e o banner vira uma tira. */}
      <section
        id="topo"
        className="relative flex min-h-[26rem] items-center py-16 md:py-24 lg:min-h-[33rem]"
      >
        {/* A ARTE E A SOMBRA. `box-shadow` no embrulho e só para BAIXO: o embrulho é
            caixa opaca do tamanho da faixa, então o deslocamento vertical positivo
            desenha a sombra sobre a seção clara seguinte e a faixa lê como peça
            apoiada na página; para cima ela cairia na tira atrás do cabeçalho,
            repintando ali a faixa escura que este arranjo existe para eliminar.
            `box-shadow` e não `filter: drop-shadow` porque `filter` cria contexto de
            empilhamento e faz o `fixed` do cabeçalho se ancorar no nó filtrado.
            `object-[center_38%]` e não o 50% de fábrica: nesta arte o assunto (o anel
            de ícones e o notebook) ocupa a metade de baixo e o alto é céu de cidade —
            a 1440 a caixa é mais larga que a proporção do arquivo, o recorte é
            VERTICAL, e subir o enquadramento mantém o anel inteiro em quadro em vez
            de cortá-lo pela base.
            `data-route-critical-media` aqui porque o portão de rota
            (`loading/RouteLoadGate.tsx`) espera a maior imagem acima da dobra. */}
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
            className="object-cover object-[center_38%]"
          />
          {/* DOIS VÉUS, um por eixo, e não um só: a leitura do texto muda de eixo com
              a largura. Abaixo de `lg` o texto cai sobre o miolo da arte e o véu é
              vertical; de `lg` para cima o texto ocupa o terço esquerdo e o véu é
              horizontal, terminando transparente antes da metade direita para não
              apagar o anel de ícones.
              A DIFERENÇA EM RELAÇÃO ÀS IRMÃS é que esta arte JÁ TEM o terço esquerdo
              quase chapado (azul profundo, sem assunto): o véu horizontal aqui
              REFORÇA o que a arte faz, e por isso ele pode abrir mais cedo (44%) do
              que o do Smart Miner (52%), onde o véu era o único responsável pelo
              contraste. Os degraus estão medidos pelo pixel COMPOSTO sob o texto na
              sonda desta issue; nenhuma opacidade aqui é palpite de olho.
              GRADIENTE EXPLÍCITO com `rgba`, e não o trio `from-/via-/to-` com barra
              de opacidade: `from-[#001A3D]/97` NÃO GERA REGRA nesta versão do
              Tailwind, e o resultado medido na SIS-279 foi faixa escura SEM VÉU
              NENHUM. */}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,26,61,0.92)_0%,rgba(0,26,61,0.88)_46%,rgba(0,26,61,0.58)_80%,rgba(0,26,61,0.38)_100%)] lg:hidden" />
          <div className="absolute inset-0 hidden lg:block lg:bg-[linear-gradient(90deg,#001A3D_0%,rgba(0,26,61,0.92)_28%,rgba(0,26,61,0.7)_44%,rgba(0,26,61,0.18)_66%,rgba(0,26,61,0)_82%)]" />
        </div>
        {/* SEM MALHA E SEM GRAFISMO NESTA FAIXA, e é decisão herdada: a 6ª volta da
            SIS-292 retirou os dois do hero do Match AI porque sobre FOTO eles viram
            grade riscada na cara das pessoas (sobre fundo chapado são a textura da
            casa). Aqui vale com mais força — a arte já traz anel, ícones e código
            desenhados. Os grafismos seguem montados nas faixas seguintes. */}
        {/* `esperarRota` SÓ AQUI, pelo contrato da SIS-269: espera quem está NA DOBRA,
            onde a cortina do `RouteLoadGate` esconderia a animação. Os escopos das
            outras seções nascem abaixo dela e não esperam — ganhar observador no
            instante em que a cortina sobe é como se produz o «acendeu tudo depois do
            load».
            O teto de leitura vive no PARÁGRAFO e não no container: `.container-lp` é
            `max-width` + `mx-auto`, então um teto neste nó encolheria o container
            centrado e jogaria o bloco para o meio da tela (o defeito medido na 5ª
            volta do Match AI). */}
        <RevealScope
          className="container-lp relative z-10"
          esperarRota
          limiar={LIMIAR_REVEAL}
          margem={MARGEM_REVEAL}
          data-reveal-nome="qaintegrado-hero"
        >
          <div>
            {/* SIS-279 — A CÁPSULA, ETIQUETA ACIMA DA MANCHETE. `alt=""` é
                obrigatório e não estilo: o nome acessível da rota é o conteúdo do
                `h1` logo abaixo (`page.name` = «QA Integrado»), e com as duas
                nomeadas o leitor de tela diria «QA Integrado QA Integrado» — o
                mesmo par da 7ª volta do Match AI.
                `gatilho="rota"` porque a peça vive ACIMA da dobra, onde liberar o
                portão do `RouteLoadGate` e entrar em quadro são o mesmo instante.
                A batida, a espera do portão e os DOIS canais de movimento reduzido
                vivem no componente.
                Ela NÃO é `data-reveal` — quem a faz entrar é a batida —, então a
                cascata do bloco não muda: o `h1` já era o índice 0 e o parágrafo
                segue no 1. */}
            <CarimboBatida
              src={CARIMBO.src}
              alt=""
              larguraIntrinseca={CARIMBO.largura}
              alturaIntrinseca={CARIMBO.altura}
              className="qaintegrado-carimbo"
              gatilho="rota"
            />
            {/* A MANCHETE É TEXTO, com a marca em NEGRITO — é o item 1 da issue
                literalmente («capa + marca QA Integrado em negrito»), e não o letreiro
                em imagem das irmãs. Duas razões técnicas somam-se ao pedido: o
                `h1` desta rota passa a ter nome acessível próprio sem depender de
                `alt` (um `h1` cujo conteúdo inteiro é imagem com `alt=""` é cabeçalho
                sem nome), e a capa JÁ TRAZ a placa «QA Integrado» desenhada no miolo —
                montar também o `QA-2-logo.png` poria a mesma marca três vezes na
                mesma dobra. O defeito que sobra (duas, uma na foto) está declarado no
                docblock.
                O texto é `page.name`, o mesmo dado que a grafia na tela desenha. */}
            <h1
              data-reveal="fade-up"
              /* `mt-4` entrou com a cápsula (SIS-279): antes o `h1` abria o bloco
                 e não tinha nada acima de que se afastar. É a mesma folga que o
                 Fast e o Smart Miner põem entre etiqueta e manchete. */
              className="qaintegrado-manchete mt-4 font-display font-bold text-white"
            >
              {page.name}
            </h1>
            <p
              data-reveal="fade-up"
              style={cascata(1)}
              className="mt-4 max-w-[46ch] text-lg leading-relaxed text-white/85 lg:max-w-[52ch]"
            >
              {subtitulo}
            </p>
            {/* AÇÃO NA PRÓPRIA PÁGINA, então `<button>` e não `<a>`: link que não vai
                a lugar nenhum é link falso para leitor de tela e para o teclado. O
                molde é o do cabeçalho (`Header.tsx`), que monta `ContactModal` SEM
                `title`/`description` de propósito — os defaults do componente são a
                escrita «Fale com a gente», e passar texto próprio faria a mesma peça
                dizer duas coisas diferentes na mesma rota.
                A PÍLULA É O CIANO DO PRODUTO (`tone` do dado) com tinta navy
                `#032033`: é tinta escura sobre fundo claro, que é o que a família de
                heros da casa usa. NÃO é `.btn-primary` — o degradê da casa com tinta
                branca não passa no piso na ponta clara (medido na SIS-292). O número
                desta pílula está na sonda desta issue. */}
            <p data-reveal="fade-up" style={cascata(2)}>
              <button
                type="button"
                onClick={() => setContatoAberto(true)}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#7CCBF3] px-6 py-3 text-sm font-semibold text-[#032033] transition-colors hover:bg-[#B3E1F9]"
              >
                Fale com um especialista
                <ArrowRight className="h-4 w-4" strokeWidth={2.2} aria-hidden />
              </button>
            </p>
          </div>
        </RevealScope>
      </section>

      {/* ── 2. A FAIXA DE ABERTURA (a «faixa de campanha/lead» do item 2) ────
          Texto + foto, que é o arranjo do «Posicionamento» do Match AI. O título é
          fragmento verbatim da primeira frase (ver o docblock) e o corpo é o parágrafo
          de abertura INTEIRO — a frase de onde o título saiu continua publicada, então
          nada se perde no corte.
          `.section-light` pinta título e texto de navy sozinho: é por isso que nada
          aqui leva `on-dark`.
          `overflow-clip` e não `hidden`: a malha de 96px de `.section-light::before` é
          `background-attachment: fixed` pela SIS-76, e `hidden` cria contêiner de
          rolagem, que é o que desancora o `fixed`. `clip` recorta o mesmo sem criar
          contêiner. */}
      {abertura?.kind === 'paragraphs' && (
        <section
          className="section-light section-py relative overflow-clip"
          aria-labelledby={idDoBloco(TITULO_ABERTURA)}
        >
          <AcentosClaros />
          <MalhaDeCasos className="qaintegrado-malha--claro" />
          <RevealScope
            className="container-lp relative z-10"
            limiar={LIMIAR_REVEAL}
            margem={MARGEM_REVEAL}
            data-reveal-nome="qaintegrado-abertura"
          >
            <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
              <div>
                <h2
                  data-reveal="fade-up"
                  id={idDoBloco(TITULO_ABERTURA)}
                  className="font-display text-section font-bold text-ink"
                >
                  {TITULO_ABERTURA}
                </h2>
                <p
                  data-reveal="fade-up"
                  style={cascata(1)}
                  className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted"
                >
                  {abertura.paragraphs[0]}
                </p>
              </div>
              {/* A FOTO É A CAPA DO CARTÃO da vitrine, e não a do hero: a do hero tem
                  a placa «QA Integrado» desenhada no miolo, e num quadro 4/3 ela entra
                  cortada. `VITRINE?.capaCard ?? CAPA` é o mesmo guarda das irmãs — sem
                  entrada no dado a faixa monta com a capa do hero em vez de estourar a
                  rota. Decorativa (`alt=""`) porque o título e o parágrafo ao lado já
                  dizem o que ela ilustra. */}
              <div
                data-reveal="scale-soft"
                style={cascata(2)}
                className="qaintegrado-midia relative aspect-[4/3] overflow-hidden rounded-3xl border border-[#0079CB]/[18%]"
              >
                <Image
                  src={VITRINE?.capaCard ?? CAPA}
                  alt=""
                  aria-hidden
                  fill
                  sizes="(min-width: 1180px) 500px, 100vw"
                  loading="lazy"
                  className="qaintegrado-midia-arte object-cover"
                />
              </div>
            </div>
          </RevealScope>
        </section>
      )}

      {/* ── 3. NOSSOS SERVIÇOS DE QA INTEGRADO INCLUEM ───────────────────────
          A grade de cards do item 3, alimentada pelos CINCO `items` do bloco
          `kind: 'list'` do dado — o título, a ordem e os textos são todos dele, e é a
          diferença de trabalho em relação à SIS-279 (lá não havia lista e as fichas
          nasceram de fragmentos declarados no componente).
          `<ol>` porque o dado diz `ordered: true`: aqui a ordem é do próprio site e o
          ordinal é DESENHADO, ao contrário das duas irmãs — é uma das variações do
          item 4. */}
      {lista?.kind === 'list' && (
        <section
          className="section-light section-light-blue section-py relative overflow-clip"
          aria-labelledby={idDoBloco(lista.heading!)}
        >
          <AcentosClaros />
          <MalhaDeCasos className="qaintegrado-malha--claro qaintegrado-malha--baixo" />
          <RevealScope
            className="container-lp relative z-10"
            limiar={LIMIAR_REVEAL}
            margem={MARGEM_REVEAL}
            data-reveal-nome="qaintegrado-servicos"
          >
            <h2
              data-reveal="fade-up"
              id={idDoBloco(lista.heading!)}
              className="font-display text-section font-bold text-ink"
            >
              {lista.heading}
            </h2>
            {/* O APOIO é a `description` da vitrine — a única frase desta rota que vem
                de `accelerators.ts`, usada UMA vez, e por isso não há duas aberturas
                dizendo a mesma coisa (o defeito que a SIS-120 removeu do template). */}
            {VITRINE && (
              <p
                data-reveal="fade-up"
                style={cascata(1)}
                className="mt-4 max-w-2xl text-lg leading-relaxed text-muted"
              >
                {VITRINE.description}
              </p>
            )}
            <ol className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {lista.items.map((item, i) => {
                const Icone = ICONES_SERVICOS[i] ?? Sparkles;
                return (
                  <li
                    key={item.text.slice(0, 40)}
                    data-reveal="fade-up"
                    style={cascata(i + 2)}
                    /* A ANATOMIA VARIADA (item 4): a arte é TIRA VERTICAL na borda
                       esquerda e o ordinal encavala a tira — não a faixa 16/9 no topo
                       (Smart Miner) nem a miniatura 28/32 na lateral (Match AI).
                       `qaintegrado-cartao` é o laço de flutuação + o realce sob o
                       ponteiro; `qaintegrado-midia` é o quadro cujo hover move a ARTE
                       (dois nós, porque um só seria dono do `transform` duas vezes — a
                       colisão que a University registra).
                       `bg-white` chapado e não translúcido: o cartão sobe e escala
                       sobre a folha, e com fundo translúcido o vizinho apareceria por
                       baixo no instante da sobreposição. */
                    className="qaintegrado-cartao qaintegrado-midia relative flex overflow-hidden rounded-2xl border border-[#0079CB]/[18%] bg-white"
                  >
                    <div className="relative w-16 shrink-0 overflow-hidden sm:w-20">
                      {/* PLACEHOLDER DECLARADO (item 3 da issue: «imagem = capa QA até
                          haver artes»). Não existe arte por serviço — o Match AI só
                          ganhou as dele na SIS-292 —, e criar arte nova está fora do
                          escopo desta issue. */}
                      <Image
                        src={VITRINE?.capaCard ?? CAPA}
                        alt=""
                        aria-hidden
                        fill
                        sizes="80px"
                        loading="lazy"
                        className="qaintegrado-midia-arte object-cover"
                      />
                      {/* O véu é o que garante que o ordinal branco se leia sobre
                          QUALQUER pedaço da foto que caia atrás dele — sem ele o
                          contraste passaria a depender do recorte. */}
                      <span aria-hidden className="absolute inset-0 bg-[#001A3D]/70" />
                      {/* O ORDINAL, e ele é `aria-hidden` de propósito: o `<ol>` já
                          numera a lista para o leitor de tela, e o número desenhado
                          repetiria isso em voz. `i + 1` e não `counter()` porque o
                          número também é o dado da ordem, não só enfeite.
                          `on-dark` É OBRIGATÓRIO e a primeira captura desta issue
                          provou: a tira é ilha ESCURA (foto + véu navy a 70%) dentro
                          de `.section-light`, cujos overrides pintam de navy tudo que
                          traga `text-white` (`[class*="text-white"] { color: #0a1f44 }`,
                          globals.css:1115). Sem a classe, o número saía navy sobre
                          navy e a tira aparecia com o fiozinho ciano e mais nada. */}
                      <span
                        aria-hidden
                        className="qaintegrado-ordinal on-dark absolute inset-0 flex items-start justify-center pt-5 font-display text-lg font-bold text-white"
                      >
                        {i + 1}
                      </span>
                    </div>
                    <div className="relative flex-1 p-5">
                      <span
                        aria-hidden
                        className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-[#0079CB]/[18%] bg-[#0079CB]/[8%]"
                      >
                        <Icone className="h-5 w-5 text-[#0079CB]" strokeWidth={1.6} />
                      </span>
                      <p className="text-sm leading-relaxed text-ink-muted">{item.text}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </RevealScope>
        </section>
      )}

      {/* ── 4. UMA ABORDAGEM COLABORATIVA (a faixa escura com o trilho) ──────
          O `bg-[#001A3D]` é DECLARADO e não herdado, e isso está medido nas irmãs: o
          `body` deste site é `#1273bc` (azul MÉDIO), e sem fundo próprio as tintas
          brancas do trilho medem ~4,1:1 e ~3,2:1 contra ele, reprovadas no piso de
          4,5. Com o navy profundo chapado o mesmo texto passa com folga.
          A CAPA ENTRA COMO FUNDO sob um véu e o chapado NÃO sai: ele é o piso de
          contraste para o caso de a arte não carregar, e é o véu que garante que o
          número medido não dependa de qual pedaço da foto caiu atrás de qual passo.
          SEM `z-index` negativo na camada da arte — foi o defeito medido no Match AI:
          a seção não cria contexto de empilhamento por `position: relative` sozinha, e
          um filho negativo desce para trás do `background` da PRÓPRIA seção, que aqui
          é chapado; a imagem pintava embaixo do fundo. A ordem de documento resolve. */}
      {abertura?.kind === 'paragraphs' && abertura.paragraphs[1] && (
        <section
          className="section-py relative overflow-clip bg-[#001A3D]"
          aria-labelledby={idDoBloco(TITULO_COLABORACAO)}
        >
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <Image
              src={CAPA}
              alt=""
              fill
              sizes="100vw"
              loading="lazy"
              className="object-cover object-[center_38%]"
            />
            {/* VÉU QUASE FECHADO NOS TRÊS TERÇOS, e não um gradiente que abre à
                direita: o trilho é grade de TRÊS colunas ocupando a faixa inteira,
                então há texto branco sobre o terço direito também — e o terço direito
                desta arte é o anel aceso, o pior possível para branco por cima. O leve
                degradê que sobra existe só para a arte não ficar uniformemente apagada.
                O NÚMERO SUBIU DUAS VEZES, cada uma contra uma captura — e a segunda
                volta corrige o que esta nota afirmava antes. A 96% a placa «QA
                Integrado» desenhada no miolo da arte se lia atrás do parágrafo e a
                faixa dizia o nome do produto uma terceira vez. A 98,5% ela AINDA se
                lia como fantasma (`docs/capturas/sis287-trilho2.png`, 1440×900): a
                placa é branco cheio sobre azul, então 1,5% dela ainda é mais claro que
                o véu. A 99,5% o resíduo cai abaixo do que o olho separa do ruído da
                grade, e o portão que mede isso é o desvio de pixel na janela da placa,
                não a minha leitura da captura. A arte continua entrando como textura —
                o que se perde é só o contorno, que é o que tinha de sair. */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,26,61,0.995)_0%,rgba(0,26,61,0.995)_50%,rgba(0,26,61,0.99)_100%)]" />
          </div>
          {/* A malha e o grafismo ENTRAM DEPOIS da foto e do véu, de propósito: o véu
              apaga a arte a ~96% e a malha tem de ficar SOBRE ele, senão a grade seria
              a coisa mais apagada da faixa. O par 0/1 entre irmãos não é preferência:
              `.grade-tecnica` nasce em `z-index: -1`, e como esta seção tem fundo
              chapado o negativo a jogaria para trás dele — `.qaintegrado-grade`
              reescreve para 0. */}
          <div aria-hidden className="grade-tecnica qaintegrado-grade" />
          <MalhaDeCasos className="qaintegrado-malha--escuro" />
          <RevealScope
            className="container-lp relative z-10"
            limiar={LIMIAR_REVEAL}
            margem={MARGEM_REVEAL}
            data-reveal-nome="qaintegrado-colaboracao"
          >
            <div>
              <h2
                data-reveal="fade-up"
                id={idDoBloco(TITULO_COLABORACAO)}
                className="font-display text-section font-bold text-white"
              >
                {TITULO_COLABORACAO}
              </h2>
              <p
                data-reveal="fade-up"
                style={cascata(1)}
                className="mt-4 max-w-3xl text-lg leading-relaxed text-white/85"
              >
                {abertura.paragraphs[1]}
              </p>
              {/* O TRILHO. Selo REDONDO com anel tracejado que gira (item 4) — não o
                  disco liso do Match AI nem a placa quadrada do Smart Miner. O fio é
                  UM nó por par de passos (o último não tem para onde apontar) e só a
                  partir de `sm`, onde os três estão lado a lado; empilhado não há fio
                  nenhum, que é o certo, porque um segmento horizontal entre passos
                  empilhados ligaria coisas que não estão em linha. Ele nasce no CENTRO
                  do selo (`top-7` = metade de `h-14`) e atravessa o vão da grade
                  (`-right-8` = `gap-8`).
                  `bg-[#7CCBF3]/35` FICA no fio: é o piso de cor para quando o laço
                  está desligado — movimento reduzido mata a animação, e a linha do
                  trilho não pode desaparecer com ela. */}
              <ol className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
                {TRILHO.map((passo, i, todos) => {
                  const Icone = ICONES_TRILHO[i] ?? Sparkles;
                  return (
                    <li
                      key={passo.termo}
                      data-reveal="fade-up"
                      style={cascata(i + 2)}
                      className="relative"
                    >
                      <span
                        aria-hidden
                        className="qaintegrado-selo relative flex h-14 w-14 items-center justify-center rounded-full border border-[#7CCBF3]/40 bg-[#001A3D]/60"
                      >
                        {/* O ANEL é nó IRMÃO do ícone e não o próprio selo: quem gira é
                            ele, e o glifo dentro fica parado — um ícone girando junto
                            leria como carregando, não como ciclo. O tracejado é
                            `repeating-conic-gradient` com máscara de anel, porque
                            `border-style: dashed` não gira sozinho e `rotate` no nó da
                            borda arrastaria o conteúdo. */}
                        <span
                          aria-hidden
                          className={[
                            'qaintegrado-anel absolute inset-0 rounded-full',
                            i === 1 && 'qaintegrado-anel--2',
                            i === 2 && 'qaintegrado-anel--3',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                        />
                        <Icone className="relative h-6 w-6 text-[#B3E1F9]" strokeWidth={1.6} />
                      </span>
                      {i < todos.length - 1 && (
                        <span
                          aria-hidden
                          className="qaintegrado-fio absolute left-14 right-[-2rem] top-7 hidden h-px bg-[#7CCBF3]/35 sm:block"
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
            </div>
          </RevealScope>
        </section>
      )}

      {/* ── 5. O FECHO / POSICIONAMENTO ──────────────────────────────────────
          «Com o QA Integrado da Sistran, qualidade e agilidade caminham juntas…» — o
          parágrafo de fecho do dado, publicado como AFIRMAÇÃO e não como corpo de
          texto: é a única frase desta slug que fala do resultado, e é o que a issue
          pede no item 5.
          SEM `h2`, e é decisão e não esquecimento: qualquer título aqui seria um
          pedaço desta mesma frase escrito acima dela. Por isso a seção também não tem
          `aria-labelledby` — apontar para um título que não existe é pior que não
          apontar.
          NOTA DE ESCRITA HERDADA DO DADO: no site esta frase aparece ACIMA da lista
          que ela fecha; o comentário de `acceleratorPages.ts` registra que ela foi
          movida para depois. Esta faixa é onde esse «depois» acontece. */}
      {fecho?.kind === 'paragraphs' && (
        <section className="section-light section-py relative overflow-clip">
          <AcentosClaros />
          <MalhaDeCasos className="qaintegrado-malha--claro" />
          <RevealScope
            className="container-lp relative z-10"
            limiar={LIMIAR_REVEAL}
            margem={MARGEM_REVEAL}
            data-reveal-nome="qaintegrado-fecho"
          >
            {/* ILHA ESCURA DENTRO DE FAIXA CLARA, então `on-dark` é OBRIGATÓRIO: os
                overrides de `.section-light` pintam de navy tudo que traga `text-white`
                (`[class*="text-white"] { color: #0a1f44 }`, globals.css:1115), e sem a
                classe a frase ficaria navy sobre navy. É a mesma rede de segurança que
                a pílula de «Ver todas as soluções» precisa driblar mais abaixo. */}
            <div
              data-reveal="scale-soft"
              className="on-dark relative overflow-hidden rounded-3xl bg-[#001A3D] px-6 py-10 md:px-12 md:py-14"
            >
              <span aria-hidden className="qaintegrado-selo-fundo" />
              <p
                data-reveal="fade-up"
                style={cascata(1)}
                className="relative max-w-3xl font-display text-2xl leading-snug font-bold text-white md:text-3xl"
              >
                {fecho.paragraphs[0]}
              </p>
              {/* O BOTÃO repete a ação do hero, e isso é deliberado: é o fecho da
                  página, o ponto em que quem leu tudo decide. Mesmo `ContactModal` e
                  mesmo estado — não há um segundo modal na rota. */}
              <p data-reveal="fade-up" style={cascata(2)} className="relative">
                <button
                  type="button"
                  onClick={() => setContatoAberto(true)}
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#7CCBF3] px-6 py-3 text-sm font-semibold text-[#032033] transition-colors hover:bg-[#B3E1F9]"
                >
                  Fale com um especialista
                  <ArrowRight className="h-4 w-4" strokeWidth={2.2} aria-hidden />
                </button>
              </p>
            </div>
          </RevealScope>
        </section>
      )}

      {/* ── 6. CONHEÇA TAMBÉM ────────────────────────────────────────────────
          A mesma peça de fecho das irmãs, e de propósito: ela é a versão desta família
          de páginas do `<nav>` «Outras soluções» do template, com as pílulas (a atual
          como `<span aria-current="page">`, fora da ordem de tabulação) e os seis
          cartões de irmã. Não é copy de ninguém — são o nome e a capa de cada solução,
          vindos de `accelerators.ts`/`ACCELERATOR_PAGES`, e a única frase própria é a
          linha de apoio, que é a mesma nas três rotas porque descreve a FAMÍLIA e não
          o produto.
          A faixa é a mais baixa da página (`py-12`), então leva os pontos e NÃO a
          malha: uma arte de 320px de lado numa faixa de ~176px de miolo seria recortada
          em quase tudo e o pedaço restante encostaria nos cartões.
          O VÉU sobre cada capa não é estética: as logos de `accelerators.ts` são de
          tinta clara e sobre as capas (que têm regiões claras) desapareceriam.
          O `alt` do logo NÃO é vazio, ao contrário das outras imagens desta página: o
          logo é a única coisa que identifica o destino do link, e sem texto acessível
          seriam seis links indistinguíveis (WCAG 2.4.4). */}
      <nav
        aria-labelledby="conheca-tambem"
        className="section-light relative overflow-clip py-12 md:py-16"
      >
        <AcentosClaros />
        <RevealScope
          className="container-lp relative z-10"
          limiar={LIMIAR_REVEAL}
          margem={MARGEM_REVEAL}
          data-reveal-nome="qaintegrado-conheca"
        >
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
                  className="qaintegrado-midia group relative block aspect-[16/10] overflow-hidden rounded-xl border border-[#0079CB]/[18%] transition-colors hover:border-[#0079CB]/55"
                >
                  <Image
                    src={a.capaCard}
                    alt=""
                    aria-hidden
                    fill
                    sizes="(min-width: 1180px) 176px, (min-width: 640px) 33vw, 50vw"
                    loading="lazy"
                    className="qaintegrado-midia-arte object-cover"
                  />
                  <span aria-hidden className="absolute inset-0 bg-[#001A3D]/55" />
                  <span className="absolute inset-0 flex items-center justify-center p-3">
                    {/* `width`/`height` são as dimensões INTRÍNSECAS do dado: com
                        `images: { unoptimized: true }` o que baixa é o arquivo do
                        disco, então o par serve para reservar a caixa e não distorcer
                        a marca. */}
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
            /* `on-dark` É OBRIGATÓRIO: pílula de fundo cheio DENTRO de
               `.section-light`, cujos overrides pintam de navy tudo que traga
               `text-white`. O fundo é `#0060A8` e não `#0079CB` pelo número medido na
               SIS-292: branco 0,88 sobre o primário dá ~4,2:1, abaixo do piso; sobre o
               azul de hover da paleta passa com folga. */
            className="on-dark mt-6 inline-flex items-center gap-2 rounded-full bg-[#0060A8] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#004D8A]"
          >
            Ver todas as soluções e serviços
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden />
          </Link>
        </RevealScope>
      </nav>
      {/* O modal montado no FIM da árvore, como em `Header.tsx`, e sem
          `title`/`description`: os defaults são a escrita «Fale com a gente». Ele se
          portala para fora daqui, então a posição no markup não afeta o desenho — o
          que ela evita é nascer dentro de uma seção com `transform`/`filter`, que
          ancoraria o `fixed` do `<dialog>` no lugar errado. */}
      <ContactModal open={contatoAberto} onClose={() => setContatoAberto(false)} />
    </>
  );
}
