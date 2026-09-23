'use client';

/**
 * SIS-280 — O CORPO DA `/solucoes/guru-de-seguros`, na MESMA ARQUITETURA DE SEÇÕES
 * da `/solucoes/match-ai` (`MatchAiPagina`) e com IDENTIDADE PRÓPRIA.
 *
 * IRMÃ DA SIS-279 (smart-miner) E DA SIS-287 (qa-integrado) — «tickets separados»:
 * o padrão é o que aquelas registraram, componente dedicado montado no
 * `[slug]/page.tsx` SÓ para esta slug, porque o template genérico renderiza
 * `page.blocks.map(...)` no mesmo molde para as sete e expressar hero sangrado,
 * grade de cards, faixa escura com trilho e vitrine de irmãs como variação de
 * `Block` mudaria o molde das SETE. Com esta, `CORPOS_PROPRIOS` passa a ter CINCO
 * entradas e as DUAS slugs restantes (`lumina-ai`, `connect-api`) seguem no caminho
 * genérico sem uma linha tocada.
 * SIS-280 (a segunda issue com este código, a do Luminna) — aquela contagem CADUCOU:
 * as duas slugs restantes ganharam corpo próprio, `CORPOS_PROPRIOS` tem SETE entradas
 * e o caminho genérico está sem acelerador nenhum. A que era `lumina-ai` também mudou
 * de grafia e é `luminna-ai`. Nada desta página mudou.
 *
 * ── TODA A ESCRITA VEM DO SITE ────────────────────────────────────────────────
 * Nada de copy das irmãs e nenhum claim novo. As fontes são as já publicadas:
 *   1. `src/data/acceleratorPages.ts` → o `lead` e os DOIS blocos de parágrafo
 *      («Como funciona?», cinco parágrafos; «De onde pode ser acessada?», um).
 *   2. `src/data/accelerators.ts` → a `description` do cartão da vitrine, usada UMA
 *      vez, como apoio do primeiro título.
 *
 * A DIFERENÇA DE DADO EM RELAÇÃO ÀS DUAS IRMÃS, e ela muda o trabalho: o QA tinha um
 * bloco `kind: 'list'` pronto para virar grade e o Smart Miner não tinha nada além de
 * parágrafos. Aqui são CINCO PARÁGRAFOS num bloco só, e DOIS deles são falas
 * literais da Alexa entre aspas curvas. A divisão entre a grade de cards (item 3) e a
 * faixa escura (item 4) é feita por esse traço do próprio texto — `ehFala()` testa a
 * aspa `“` — e não por índice: se o site acrescentar uma pergunta, ela vai para a
 * faixa das falas sozinha, e se retirar, o card correspondente desaparece sem deixar
 * buraco. Índice fixo ([2] e [3]) seria dependência invisível do dado.
 *
 * ── OS TÍTULOS DE FAIXA QUE O DADO NÃO TEM ────────────────────────────────────
 * O dado tem DOIS `heading` e a arquitetura do Match AI tem um título por faixa, logo
 * duas faixas precisavam de título e nenhum podia ser inventado. Os dois são
 * FRAGMENTOS VERBATIM do texto que a própria faixa publica, com só a inicial elevada:
 * «relacionamento por voz» está no `lead` que a faixa 2 publica inteiro, e «Logo,
 * você poderá perguntar» abre o primeiro dos dois parágrafos de fala que a faixa 4
 * publica. É a régua de «derivar rótulo, não inventar claim» das duas irmãs.
 *
 * ── `pageSections` / ÂNCORAS (item 5): AQUI TEM INDICADOR, ao contrário do QA ──
 * `SECOES_DE_ACELERADOR` monta as paradas percorrendo os blocos COM `heading` e
 * devolve `VAZIO` quando sobram menos de três. Esta slug tem DOIS `heading` →
 * «Início» + duas paradas = 3 → a rota TEM indicador lateral, e é a diferença
 * prática em relação à SIS-287 (um `heading` só, `VAZIO`, sem indicador). Logo:
 *   - os `id` das duas faixas de dado saem de `idDoBloco(heading)`, o mesmo dono que
 *     `pageSections.ts` usa — `como-funciona` e `de-onde-pode-ser-acessada`;
 *   - `id="topo"` no hero é OBRIGATÓRIO, porque é a âncora de «Início» e ela vinha do
 *     `PageHero`, que esta slug deixa de montar;
 *   - os dois títulos DERIVADOS acima (faixas 2 e 4) não são `heading` de bloco, então
 *     não entram na lista de paradas — e é o certo: parada tem de existir no dado.
 *   - a slug MIGROU de `TOM_MEDIO_DE_ACELERADOR` para `TOM_CLARO_DE_ACELERADOR` com as
 *     DUAS paradas, porque as duas faixas de dado deixaram de ser o raster azul do
 *     template genérico e são `.section-light` aqui. O contrato daquele par de mapas é
 *     «escuro = sem chave», e a linha removida ficou comentada lá com o motivo.
 *
 * ── IDENTIDADE PRÓPRIA (item 4: variar 1–2 componentes vs as irmãs) ───────────
 * O assunto desta solução é VOZ, e as quatro peças que divergem desenham isso:
 *   1. O GRAFISMO DE CANTO é `OndasDeVoz` — arcos concêntricos que se DESENHAM a
 *      partir de um ponto (a onda saindo do microfone) sobre uma fileira de barras de
 *      equalizador. Lá é circuito (Match AI), esteira de documentos (Smart Miner) e
 *      malha de casos (QA). A mecânica é a da casa: traço normalizado com
 *      `pathLength="1"`, máscara por elemento em vez de `<defs>`/`id`, porque o
 *      componente é montado várias vezes na mesma página.
 *   2. O SELO DO PASSO é PLACA EM LOSANGO com HALO QUE SE EXPANDE — disco liso no
 *      Match AI, placa quadrada reta no Smart Miner, anel tracejado girando no QA. O
 *      halo é o círculo de escuta se abrindo, e ele vive em `scale`/`opacity` de um nó
 *      IRMÃO do ícone, para não haver dois donos do `transform`.
 *   3. O FIO entre passos é UMA ONDA SENOIDAL que marcha, e não linha reta: o
 *      tracejado em marcha é do Smart Miner, a conta que corre é do QA e o degradê de
 *      200% é do Match AI. Aqui o que viaja entre os passos é som.
 *   4. O CARD da grade tem a arte em MEDALHÃO REDONDO no alto, com o ícone
 *      encavalando a borda — em vez da tira vertical (QA), da faixa 16/9 no topo
 *      (Smart Miner) ou da miniatura 28/32 na lateral (Match AI).
 * E uma peça que nenhuma irmã tem: as duas falas da Alexa são `<blockquote>` de
 * verdade na faixa escura, com a aspa desenhada e a onda embaixo. É citação no dado
 * («“Alexa, qual o status do meu sinistro?”»), então é citação na marcação.
 *
 * A COR é a do dado: `#0ED8F6` é o `tone` que `accelerators.ts` declara para o Guru
 * de Seguros (ciano elétrico; o do QA é ciano claro e o do Smart Miner é menta). Ela
 * vale SÓ nas faixas escuras — sobre folha clara um ciano a 12% é textura, mas como
 * TINTA reprova no piso de contraste (o número que reprovou o ciano do Match AI,
 * 1,03:1, foi medido na SIS-292 e vale para este). Nas faixas claras a tinta de
 * grafismo é o azul institucional `#0079CB`, como nas três irmãs.
 *
 * ── O LETREIRO É IMAGEM, ao contrário do QA ───────────────────────────────────
 * Existe arte de marca de LETRA CLARA para esta solução
 * (`images/logos/Guru-de-Seguros-letra-clara-2.png`, 1405×717, a mesma que
 * `accelerators.ts` já serve nos cartões), então o `h1` do hero pode carregá-la como
 * as irmãs Match AI e Smart Miner fazem — o que cumpre o item 1 («marca Guru de
 * Seguros em negrito») com a grafia oficial em vez de negrito de fonte. O `alt` é
 * `page.name` e NÃO vazio: `h1` cujo conteúdo inteiro é imagem com `alt=""` é
 * cabeçalho sem nome acessível.
 * O CARIMBO ENTRA (SIS-279), e a nota anterior deste docblock ficava assim:
 * «NÃO ENTRA CARIMBO: a issue condiciona ("carimbo se houver arte") e não existe
 * cápsula `carimbo-…-guru-de-seguros-…` em `public/` — as que existem são de
 * `match-ai`, `smart-miner`, `fast` e `connect-api`, e usar qualquer uma publicaria o
 * nome de OUTRO produto no topo desta rota (o defeito da 5ª volta do Match AI).»
 * Ela está preservada porque a PREMISSA caducou e a conclusão não: a arte própria
 * chegou (`carimbo-guru-de-seguros-ticket-outline-ffffff.png`, 897×342), então a
 * condição da issue passou a estar satisfeita — mas a proibição de montar a cápsula
 * de outra rota aqui continua valendo, e é ela que o portão «não publica nome de
 * outro produto» desta issue mede. A arte foi medida ANTES de montar, em
 * `docs/medidas/sis279-guru-arte.json`, nos três portões que `CarimboBatida` impõe:
 *
 *   1. TOMBO DE REPOUSO **−2,99°** (topo da tinta cai de y=45 em x=161 para y=15 em
 *      x=736). O componente assenta em `rotation: 0` porque as artes que ele serve
 *      já vêm tombadas dentro do arquivo (−3,07° / −3,03° / −3,02° / −3,04°): esta
 *      cai na mesma família, então NÃO é preciso o `tomboRepouso` que o docblock
 *      dele diz que uma arte reta exigiria. Era o portão que podia reprovar a arte.
 *   2. TINTA CLARA SOBRE TRANSPARÊNCIA: média `rgb(255, 255, 255)` nos 38.757
 *      pixels opacos, canto com alfa 0. Cápsula branca só se lê em faixa escura — e
 *      o hero navy é a única faixa desta rota onde ela pode entrar.
 *   3. GRAFIA conferida em captura composta sobre `#001A3D`
 *      (`docs/capturas/sis279-arte-guru-de-seguros.png`): a arte diz «GURU DE
 *      SEGUROS» com a marca da casa. É a conferência que a 5ª volta do Match AI
 *      teve de fazer DEPOIS de a arte errada já estar no ar.
 *
 * A arte chegou na RAIZ (`public/images/carimbo-seguros-ticket-outline-ffffff.png`) e
 * DESCEU para `public/images/solucoes/` com o nome da família, sem deixar cópia:
 * cápsula da mesma família em duas pastas foi a causa daquele mesmo defeito. Nenhum
 * arquivo do repositório referenciava o nome antigo (conferido antes de mover).
 *
 * ── MOVIMENTO ────────────────────────────────────────────────────────────────
 * `RevealScope` + `data-reveal` + `./reveal-calibre`, que é o mecanismo do Match AI (e
 * não o `variants` de `@/lib/motion` do `FastPagina`): a issue manda espelhar o
 * motion/reveal do Match AI, e a razão de não somar os dois está no docblock dele
 * (dois donos do mesmo `transform`). `esperarRota` SÓ no escopo do hero, pelo contrato
 * da SIS-269. O movimento em laço é todo CSS, no bloco `SIS-280` do fim do
 * `globals.css`, com os DOIS canais de movimento reduzido.
 */

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  AudioLines,
  GraduationCap,
  Mic,
  Plug,
  Server,
  Sparkles,
  Zap,
} from 'lucide-react';
import CarimboBatida from '@/components/CarimboBatida';
import ContactModal from '@/components/ContactModal';
import RevealScope from '@/components/motion/RevealScope';
import { ACCELERATORS } from '@/data/accelerators';
import { ACCELERATOR_PAGES, idDoBloco, type AcceleratorPage } from '@/data/acceleratorPages';
import { CAPAS_DE_ABERTURA } from '@/data/capasSolucoes';
import { LIMIAR_REVEAL, MARGEM_REVEAL } from './reveal-calibre';

/* A CAPA DA ROTA vem de `capasSolucoes.ts`, que é o dono do mapa (dois leitores: o
   template genérico e as páginas com corpo próprio) — e não de um caminho digitado
   aqui. Já é a derivada WebP, o que importa porque com `images: { unoptimized: true }`
   (SIS-154) o `next/image` entrega o arquivo como ele está no disco e um PNG cru iria
   inteiro para o LCP do hero. */
const CAPA = CAPAS_DE_ABERTURA['guru-de-seguros'].src;

/* O cartão da vitrine desta solução: a `description` (apoio do primeiro título), a
   `capaCard` (a arte dos placeholders) e o LOGO de letra clara do letreiro do hero.
   Achado por `id` e não digitado — duas cópias do mesmo caminho divergiriam na
   primeira troca de arte. */
const VITRINE = ACCELERATORS.find((a) => a.id === 'guru-de-seguros');

/* A CÁPSULA DO HERO (SIS-279). As dimensões são as INTRÍNSECAS do arquivo medidas
   pela sonda, e não número redondo: é o par que `CarimboBatida` transforma em
   `--carimbo-batida-ar` para reservar a caixa e impedir a peça de achatar. O caminho
   fica numa constante de módulo, como nas irmãs, porque a folha (`globals.css`) e o
   mount precisam falar da mesma arte. */
const CARIMBO = {
  src: '/images/solucoes/carimbo-guru-de-seguros-ticket-outline-ffffff.png',
  largura: 897,
  altura: 342,
};

/* ── OS ÍCONES DOS CARDS DE «COMO FUNCIONA?» ───────────────────────────────────
   Na ordem dos parágrafos que sobram depois de as duas falas saírem, e cada um é
   leitura literal do parágrafo que acompanha: capelo (base educativa com a ENS e a
   CNseg), tomada (aplicações transacionais INTEGRANDO LEGADOS), raio (modernidade,
   agilidade e flexibilidade). São só ícones: nenhum texto de card nasce aqui. */
const ICONES_CARDS = [GraduationCap, Plug, Zap];

/* ── OS TRÊS PASSOS DO TRILHO DA FAIXA ESCURA ─────────────────────────────────
   A issue pede o fluxo «voz → resposta → legado», «só copy do site». O dado não
   nomeia etapas — inventar «falar → entender → responder» seria claim novo. O que ele
   tem são os três elos dessa cadeia, ditos com estas palavras:

     lead: «interagindo através da LINGUAGEM NATURAL e recebendo INFORMAÇÕES ÚTEIS AO
            SEGURO, de forma mais dinâmica a qualquer hora, em qualquer lugar»
     «Como funciona?», 4º parágrafo: «através de acessos aos SISTEMAS LEGADOS das
            seguradoras»

   Cada `termo` é o substantivo dessa frase e cada `texto` é fragmento verbatim dela —
   nesta ordem, a cadeia é a voz que entra, a informação que volta e o legado de onde
   ela vem, que é exatamente o fluxo que a issue nomeia. */
const TRILHO = [
  {
    termo: 'Linguagem natural',
    texto: 'interagindo através da linguagem natural',
  },
  {
    termo: 'Informações úteis ao seguro',
    texto: 'recebendo informações úteis ao seguro, de forma mais dinâmica a qualquer hora, em qualquer lugar',
  },
  {
    termo: 'Sistemas legados',
    texto: 'através de acessos aos sistemas legados das seguradoras',
  },
];

const ICONES_TRILHO = [Mic, AudioLines, Server];

/* ── OS DISPOSITIVOS DA FAIXA DE ACESSO ───────────────────────────────────────
   Pastilhas, e cada uma é uma palavra QUE ESTÁ no parágrafo de «De onde pode ser
   acessada?». O filtro `paragrafo.includes(termo)` não é enfeite defensivo: é o que
   garante que a pastilha não sobreviva ao texto. Se o site trocar de dispositivo, a
   pastilha do antigo desaparece com a frase em vez de ficar afirmando sozinha o que a
   página não diz mais — o modo de falha de chips digitados à mão.
   O parágrafo continua publicado INTEIRO ao lado: as pastilhas são leitura rápida, não
   substituição do texto. */
const DISPOSITIVOS = [
  'Echo Dots',
  'Windows',
  'Android',
  'iOS',
  'LG',
  'Samsung',
  'BMW',
  'Mini',
  'Jeep Commander',
];

/* Os dois títulos de faixa que o dado não tem, como constantes e não literais no JSX:
   cada um é usado DUAS vezes (o `aria-labelledby` da seção e o `id` do `h2`), e duas
   cópias de string a virar âncora é o jeito de as duas divergirem. A procedência de
   cada um está no docblock. */
const TITULO_VOZ = 'Relacionamento por voz';
const TITULO_FALAS = 'Logo, você poderá perguntar';

/* A ASPA CURVA de abertura é o que separa as falas da Alexa dos parágrafos
   explicativos, e o teste vive numa função só porque ele é feito DUAS vezes (os cards
   ficam com o complemento exato do que a faixa escura leva). Um `includes` escrito nos
   dois pontos poderia divergir e um parágrafo cairia nas duas faixas — ou em
   nenhuma. */
const ehFala = (texto: string) => texto.includes('“');

/* O índice da cascata vive em `--reveal-i`; o atraso sai de
   `calc(var(--motion-stagger-reveal) * var(--reveal-i))`. Mesmo helper das irmãs, pela
   mesma razão: não repetir o cast de custom property em vinte pontos. */
const cascata = (i: number) => ({ '--reveal-i': i }) as React.CSSProperties;

/* As manchas de ponto fino e o quadrado pálido das faixas claras — a textura da casa
   (`/sistran-university`, `/sistran-labs`, `.matchai-acentos`, `.smartminer-acentos`,
   `.qaintegrado-acentos`). Nó e não pseudo-elemento porque `.section-light` já gastou
   os dois (`::before` malha de 96px, `::after` pontilhado). `aria-hidden` porque é
   grafismo: sem ele o leitor de tela anuncia um nó vazio antes do conteúdo. */
function AcentosClaros() {
  return <span aria-hidden className="gurudeseguros-acentos" />;
}

/* ── O GRAFISMO DE CANTO: AS ONDAS DE VOZ (item 4, a variação de componente) ───
   Geometria nova, mecânica da casa: quatro arcos concêntricos que se DESENHAM a partir
   do canto (a onda saindo do microfone) e uma fileira de barras de equalizador na base.
   O arco é desenhado por `stroke-dasharray`/`-dashoffset` — a receita de
   `svg-stroke-drawing` — e `pathLength="1"` normaliza o comprimento, o que deixa os
   quatro caminhos, de raios diferentes, compartilharem UM keyframe.

   `viewBox` FIXO com `preserveAspectRatio` padrão: são várias caixas de alturas
   diferentes que ainda vão mudar ao mudar copy, e amarrar a arte à altura da seção
   seria um número a recalibrar por faixa.

   SEM `<defs>`/`id`: este componente é montado QUATRO vezes na mesma página, e `id`
   repetido faz todo `url(#…)` apontar para o primeiro. As pontas morrem por
   `mask-image` no CSS, que é por elemento e não por documento. */
function OndasDeVoz({ className }: { className: string }) {
  return (
    <svg aria-hidden className={`gurudeseguros-ondas ${className}`} viewBox="0 0 320 320">
      {/* OS QUATRO ARCOS, todos centrados no mesmo ponto (296, 40) — o canto alto
          direito, que é de onde a máscara faz a arte nascer. Raios em progressão para
          a leitura ser «uma onda se abrindo», e cada `d` é um quarto de círculo
          desenhado com um só arco elíptico. */}
      {[56, 96, 136, 176].map((raio, i) => (
        <path
          key={raio}
          className={`gurudeseguros-arco${i > 0 ? ` gurudeseguros-arco--${i + 1}` : ''}`}
          pathLength="1"
          d={`M ${296 - raio} 40 A ${raio} ${raio} 0 0 1 296 ${40 + raio}`}
        />
      ))}
      {/* AS BARRAS DO EQUALIZADOR, na base do quadro: a onda que se abre acima e o som
          medido embaixo. Alturas declaradas (e não aleatórias) porque o desenho tem de
          ser o mesmo em todo mount; o que se move é o `scale-y` no CSS. */}
      {[26, 48, 34, 62, 40, 72, 30].map((altura, i) => (
        <rect
          key={i}
          className={`gurudeseguros-barra gurudeseguros-barra--${(i % 4) + 1}`}
          x={176 + i * 20}
          y={276 - altura}
          width="8"
          height={altura}
          rx="4"
        />
      ))}
    </svg>
  );
}

/* ── O FIO DO TRILHO: UMA ONDA QUE MARCHA (item 4) ────────────────────────────
   Uma senoide, e não a linha de 1px das irmãs: o que viaja entre os passos desta rota
   é som. `pathLength="1"` outra vez, para o tracejado da marcha ser fração e não
   medida — e é o que deixa a mesma peça servir vãos de larguras diferentes sem
   recalibrar nada, porque o SVG estica.
   `preserveAspectRatio="none"`: aqui a distorção é desejada — a onda tem de ocupar
   exatamente o vão entre dois selos, qualquer que seja ele. */
function OndaDoFio() {
  return (
    <svg
      aria-hidden
      className="gurudeseguros-onda-fio absolute left-14 right-[-2rem] top-[1.35rem] hidden h-3 w-auto sm:block"
      viewBox="0 0 120 12"
      preserveAspectRatio="none"
    >
      <path
        className="gurudeseguros-onda-linha"
        pathLength="1"
        d="M 0 6 Q 7.5 0 15 6 T 30 6 T 45 6 T 60 6 T 75 6 T 90 6 T 105 6 T 120 6"
      />
    </svg>
  );
}

export default function GuruDeSegurosPagina({ page }: { page: AcceleratorPage }) {
  /* Os blocos por `heading`, e não por índice: índice é dependência invisível, e um
     bloco novo no dado reordenaria as seções em silêncio (a nota é a do Match AI). O
     guarda de `kind` é o que deixa o TypeScript saber que `paragraphs` existe.
     Os DOIS blocos desta slug TÊM título, então aqui a busca é pelo título — que é
     também o que vira âncora, logo é o mesmo dado que `pageSections.ts` lê. */
  const comoFunciona = page.blocks.find((b) => b.heading === 'Como funciona?');
  const acesso = page.blocks.find((b) => b.heading === 'De onde pode ser acessada?');

  /* A DIVISÃO DOS CINCO PARÁGRAFOS entre a grade (faixa 3) e as citações (faixa 4),
     pelo traço do próprio texto e não por índice — a razão está no docblock. Os dois
     lados são complementos exatos: nenhum parágrafo se perde e nenhum aparece duas
     vezes, porque o mesmo teste decide os dois. */
  const paragrafos = comoFunciona?.kind === 'paragraphs' ? comoFunciona.paragraphs : [];
  const cards = paragrafos.filter((p) => !ehFala(p));
  const falas = paragrafos.filter((p) => ehFala(p));

  /* O SUBTÍTULO DO HERO é a PRIMEIRA ORAÇÃO do `lead` — «É uma assistente
     conversacional acessada através da Alexa» —, cortada na primeira vírgula do
     próprio dado. O `lead` desta slug tem ~460 caracteres numa frase só: embaixo de um
     letreiro ele viraria parágrafo de abertura na dobra, e a dobra é onde a pessoa
     decide se continua. O resto NÃO se perde: a faixa 2 publica o `lead` INTEIRO,
     incluindo esta oração. Sem vírgula, a cauda é o `lead` todo — nenhuma escrita
     desaparece num dado que mude de forma. */
  const subtitulo = page.lead.includes(',')
    ? page.lead.slice(0, page.lead.indexOf(','))
    : page.lead;

  /* Um estado só para o modal: `ContactModal` cuida de `showModal()`, do portal, da
     pausa do scroll suave e da devolução do foco ao gatilho. */
  const [contatoAberto, setContatoAberto] = useState(false);

  return (
    <>
      {/* ── 1. HERO: A ARTE SANGRADA ─────────────────────────────────────────
          O molde e os NÚMEROS são os das irmãs, e reaproveitá-los é o que garante que a
          emenda feche: `-top-28 md:-top-36` é exatamente o `pt-28 md:pt-36` que o
          `PageShell` põe no `<main id="conteudo">` (7rem e 9rem), a distância entre o
          topo da janela e o começo do conteúdo. É o que faz a arte subir ATRÁS do
          cabeçalho em vez de parar embaixo dele.
          Por isso NÃO há `overflow-clip` aqui: qualquer recorte corta exatamente o
          pedaço que sobe atrás do cabeçalho, e `overflow-x-clip` não serve de
          meio-termo (CSS Overflow 3: com um eixo em `clip`, o `visible` computa
          `clip`). O cabeçalho continua na frente — `Header.tsx` é `fixed … z-50` e a
          arte nasce em `z-index: auto`.
          `id="topo"` é a âncora de «Início» do indicador lateral (que NESTA rota monta,
          ver o docblock) e o destino do «pular para o conteúdo». */}
      <section
        id="topo"
        className="relative flex min-h-[26rem] items-center py-16 md:py-24 lg:min-h-[33rem]"
      >
        {/* A ARTE E A SOMBRA. `box-shadow` no embrulho e só para BAIXO: o embrulho é
            caixa opaca do tamanho da faixa, então o deslocamento vertical positivo
            desenha a sombra sobre a seção clara seguinte; para cima ela cairia na tira
            atrás do cabeçalho, repintando ali a faixa escura que este arranjo existe
            para eliminar. `box-shadow` e não `filter: drop-shadow` porque `filter` cria
            contexto de empilhamento e faz o `fixed` do cabeçalho se ancorar no nó
            filtrado.
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
            className="object-cover object-[center_42%]"
          />
          {/* DOIS VÉUS, um por eixo, e não um só: a leitura do texto muda de eixo com a
              largura. Abaixo de `lg` o texto cai sobre o miolo da arte e o véu é
              vertical; de `lg` para cima o texto ocupa o terço esquerdo e o véu é
              horizontal, terminando transparente antes da metade direita para não
              apagar o assunto da foto.
              GRADIENTE EXPLÍCITO com `rgba`, e não o trio `from-/via-/to-` com barra de
              opacidade: `from-[#001A3D]/97` NÃO GERA REGRA nesta versão do Tailwind, e
              o resultado medido na SIS-279 foi faixa escura SEM VÉU NENHUM.
              Os degraus estão medidos pelo pixel COMPOSTO sob o texto na sonda desta
              issue; nenhuma opacidade aqui é palpite de olho. */}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,26,61,0.93)_0%,rgba(0,26,61,0.88)_46%,rgba(0,26,61,0.58)_80%,rgba(0,26,61,0.38)_100%)] lg:hidden" />
          <div className="absolute inset-0 hidden lg:block lg:bg-[linear-gradient(90deg,#001A3D_0%,rgba(0,26,61,0.94)_30%,rgba(0,26,61,0.72)_46%,rgba(0,26,61,0.2)_68%,rgba(0,26,61,0)_84%)]" />
        </div>
        {/* SEM MALHA E SEM GRAFISMO NESTA FAIXA, e é decisão herdada: a 6ª volta da
            SIS-292 retirou os dois do hero do Match AI porque sobre FOTO eles viram
            grade riscada na cara das pessoas (sobre fundo chapado são a textura da
            casa). Os grafismos seguem montados nas faixas seguintes. */}
        {/* `esperarRota` SÓ AQUI, pelo contrato da SIS-269: espera quem está NA DOBRA,
            onde a cortina do `RouteLoadGate` esconderia a animação. Os escopos das
            outras seções nascem abaixo dela e não esperam.
            O teto de leitura vive no PARÁGRAFO e não no container: `.container-lp` é
            `max-width` + `mx-auto`, então um teto neste nó encolheria o container
            centrado e jogaria o bloco para o meio da tela (o defeito medido na 5ª volta
            do Match AI). */}
        <RevealScope
          className="container-lp relative z-10"
          esperarRota
          limiar={LIMIAR_REVEAL}
          margem={MARGEM_REVEAL}
          data-reveal-nome="gurudeseguros-hero"
        >
          <div>
            {/* A CÁPSULA, ACIMA DO LETREIRO — a ordem das cinco irmãs, e o lugar que a
                issue nomeia («carimbo entra acima do letreiro/h1»).

                `alt=""` porque ela é ETIQUETA e não manchete: o nome do produto já é
                o conteúdo do `h1` logo abaixo (`alt={page.name}` na marca desenhada),
                e um `alt` com o nome aqui o faria ser anunciado DUAS vezes seguidas.

                `gatilho="rota"` porque a peça vive ACIMA da dobra, onde liberar o
                portão do `RouteLoadGate` e entrar em quadro são o mesmo instante — o
                gatilho de viewport existe para quem nasce a milhares de px do topo
                (SIS-188). A batida, a espera do portão e os DOIS canais de movimento
                reduzido já vivem no componente; refazer isso à mão aqui seria GSAP ad
                hoc num hero acima da dobra.

                DUAS CLASSES no nó, e é o componente que as concatena
                (`['carimbo-batida', className]`): `carimbo-batida.css` é importado por
                ele e entra DEPOIS do `globals.css`, então `.gurudeseguros-carimbo`
                sozinha (0,1,0) empataria em especificidade com o
                `clamp(15rem, 19vw, 17.5rem)` da folha dele e PERDERIA na ordem.

                A cápsula NÃO é `data-reveal` — quem a faz entrar é a própria batida —,
                então ela fica FORA da cascata e os índices do texto abaixo seguem como
                estavam (`h1` sem `cascata`, parágrafo 1, pílula 2). Empurrá-los para
                abrir lugar faria cada nó esperar uma batida de stagger por um nó que
                não participa dela. */}
            <CarimboBatida
              src={CARIMBO.src}
              alt=""
              larguraIntrinseca={CARIMBO.largura}
              alturaIntrinseca={CARIMBO.altura}
              className="gurudeseguros-carimbo"
              gatilho="rota"
            />
            {/* O LETREIRO É A MARCA DESENHADA (item 1), como nas irmãs Match AI e Smart
                Miner e ao contrário do QA — aqui EXISTE arte de letra clara, e ela é a
                mesma que `accelerators.ts` já serve nos cartões, achada pelo `id` e não
                digitada. `alt={page.name}` e não vazio: este `h1` não tem outro
                conteúdo, e cabeçalho sem nome acessível é cabeçalho que não existe para
                leitor de tela.
                `width`/`height` são as dimensões INTRÍNSECAS do dado: com
                `images: { unoptimized: true }` o que baixa é o arquivo do disco, então o
                par serve para reservar a caixa e não distorcer a marca. `priority`
                porque está na dobra e é o nome da página. */}
            {/* `mt-4` entrou com a cápsula (SIS-279) e é o mesmo respiro que o `h1` do
                Smart Miner usa entre as duas peças: sem ele a marca desenhada encosta
                na borda inferior tombada do carimbo. */}
            <h1 data-reveal="fade-up" className="gurudeseguros-letreiro mt-4">
              {VITRINE && (
                <Image
                  src={VITRINE.logo}
                  alt={page.name}
                  width={VITRINE.logoWidth}
                  height={VITRINE.logoHeight}
                  priority
                  className="h-auto w-full"
                />
              )}
            </h1>
            <p
              data-reveal="fade-up"
              style={cascata(1)}
              className="mt-5 max-w-[46ch] text-lg leading-relaxed text-white/85 lg:max-w-[52ch]"
            >
              {subtitulo}
            </p>
            {/* AÇÃO NA PRÓPRIA PÁGINA, então `<button>` e não `<a>`: link que não vai a
                lugar nenhum é link falso para leitor de tela e para o teclado. O molde é
                o do cabeçalho (`Header.tsx`), que monta `ContactModal` SEM
                `title`/`description` de propósito — os defaults do componente são a
                escrita «Fale com a gente», e passar texto próprio faria a mesma peça
                dizer duas coisas diferentes na mesma rota.
                A PÍLULA É O CIANO DO PRODUTO (`tone` do dado, `#0ED8F6`) com tinta navy
                `#04212B`: tinta escura sobre fundo claro, que é o que a família de heros
                da casa usa. NÃO é `.btn-primary` — o degradê da casa com tinta branca
                não passa no piso na ponta clara (medido na SIS-292). O número desta
                pílula está na sonda desta issue. */}
            <p data-reveal="fade-up" style={cascata(2)}>
              <button
                type="button"
                onClick={() => setContatoAberto(true)}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#0ED8F6] px-6 py-3 text-sm font-semibold text-[#04212B] transition-colors hover:bg-[#7FE9FA]"
              >
                Fale com um especialista
                <ArrowRight className="h-4 w-4" strokeWidth={2.2} aria-hidden />
              </button>
            </p>
          </div>
        </RevealScope>
      </section>

      {/* ── 2. RELACIONAMENTO POR VOZ (a «faixa de campanha/lead» do item 2) ──
          Texto + foto, que é o arranjo da «Campanha» do Match AI. O título é fragmento
          verbatim do `lead` (ver o docblock) e o corpo é o `lead` INTEIRO — a frase de
          onde o título saiu continua publicada, então nada se perde no corte, e é aqui
          que a escrita que o hero resumiu aparece completa.
          `.section-light` pinta título e texto de navy sozinho: é por isso que nada aqui
          leva `on-dark`.
          `overflow-clip` e não `hidden`: a malha de 96px de `.section-light::before` é
          `background-attachment: fixed` pela SIS-76, e `hidden` cria contêiner de
          rolagem, que é o que desancora o `fixed`. `clip` recorta o mesmo sem criar
          contêiner. */}
      <section
        className="section-light section-light-blue section-py relative overflow-clip"
        aria-labelledby={idDoBloco(TITULO_VOZ)}
      >
        <AcentosClaros />
        <OndasDeVoz className="gurudeseguros-ondas--claro" />
        <RevealScope
          className="container-lp relative z-10"
          limiar={LIMIAR_REVEAL}
          margem={MARGEM_REVEAL}
          data-reveal-nome="gurudeseguros-voz"
        >
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
            <div>
              <h2
                data-reveal="fade-up"
                id={idDoBloco(TITULO_VOZ)}
                className="font-display text-section font-bold text-ink"
              >
                {TITULO_VOZ}
              </h2>
              <p
                data-reveal="fade-up"
                style={cascata(1)}
                className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted"
              >
                {page.lead}
              </p>
            </div>
            {/* A FOTO É A CAPA DO CARTÃO da vitrine, e não a do hero: a do hero é
                panorâmica e num quadro 4/3 entra cortada pelo meio. `VITRINE?.capaCard
                ?? CAPA` é o mesmo guarda das irmãs — sem entrada no dado a faixa monta
                com a capa do hero em vez de estourar a rota. Decorativa (`alt=""`)
                porque o título e o parágrafo ao lado já dizem o que ela ilustra. */}
            <div
              data-reveal="scale-soft"
              style={cascata(2)}
              className="gurudeseguros-midia relative aspect-[4/3] overflow-hidden rounded-3xl border border-[#0079CB]/18"
            >
              <Image
                src={VITRINE?.capaCard ?? CAPA}
                alt=""
                aria-hidden
                fill
                sizes="(min-width: 1180px) 500px, 100vw"
                loading="lazy"
                className="gurudeseguros-midia-arte object-cover"
              />
            </div>
          </div>
        </RevealScope>
      </section>

      {/* ── 3. COMO FUNCIONA? (a grade de cards do item 3) ───────────────────
          Título, ordem e textos são do dado; o que este arquivo declara são os ícones.
          `<ul>` e não `<ol>`: o bloco é `kind: 'paragraphs'` e não diz `ordered` — a
          leitura aqui é «o que já está de pé e o que está em construção», não uma
          sequência numerada (foi o QA, com `ordered: true` no dado, que ganhou
          ordinal desenhado).
          A âncora sai de `idDoBloco(heading)`, e ela É uma parada do indicador lateral
          nesta rota (`como-funciona`) — ver o docblock. */}
      {comoFunciona?.heading && cards.length > 0 && (
        <section
          className="section-light section-py relative overflow-clip"
          aria-labelledby={idDoBloco(comoFunciona.heading)}
        >
          <AcentosClaros />
          <OndasDeVoz className="gurudeseguros-ondas--claro gurudeseguros-ondas--baixo" />
          <RevealScope
            className="container-lp relative z-10"
            limiar={LIMIAR_REVEAL}
            margem={MARGEM_REVEAL}
            data-reveal-nome="gurudeseguros-como-funciona"
          >
            <h2
              data-reveal="fade-up"
              id={idDoBloco(comoFunciona.heading)}
              className="font-display text-section font-bold text-ink"
            >
              {comoFunciona.heading}
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
            <ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
              {cards.map((texto, i) => {
                const Icone = ICONES_CARDS[i] ?? Sparkles;
                return (
                  <li
                    key={texto.slice(0, 40)}
                    data-reveal="fade-up"
                    style={cascata(i + 2)}
                    /* A ANATOMIA VARIADA (item 4): a arte é MEDALHÃO REDONDO no alto e o
                       ícone encavala a borda dele — não a tira vertical (QA), a faixa
                       16/9 no topo (Smart Miner) nem a miniatura 28/32 na lateral
                       (Match AI). Redondo porque o assunto é voz, e a peça que a casa
                       usa para voz é o círculo (é o mesmo desenho do halo do trilho).
                       `gurudeseguros-cartao` é o laço de flutuação + o realce sob o
                       ponteiro; `gurudeseguros-midia` é o quadro cujo hover move a
                       ARTE (dois nós, porque um só seria dono do `transform` duas
                       vezes — a colisão que a University registra).
                       `bg-white` chapado e não translúcido: o cartão sobe e escala sobre
                       a folha, e com fundo translúcido o vizinho apareceria por baixo no
                       instante da sobreposição. */
                    className="gurudeseguros-cartao relative flex flex-col items-start rounded-2xl border border-[#0079CB]/18 bg-white p-5"
                  >
                    <span className="relative mb-4 block">
                      <span
                        aria-hidden
                        className="gurudeseguros-midia relative block h-20 w-20 overflow-hidden rounded-full border border-[#0079CB]/18"
                      >
                        {/* PLACEHOLDER DECLARADO (item 3 da issue: «imagem = capa Guru
                            até haver artes»). Não existe arte por parágrafo — o Match AI
                            só ganhou as dele na SIS-292 —, e criar arte nova está fora
                            do escopo desta issue. */}
                        <Image
                          src={VITRINE?.capaCard ?? CAPA}
                          alt=""
                          aria-hidden
                          fill
                          sizes="80px"
                          loading="lazy"
                          className="gurudeseguros-midia-arte object-cover"
                        />
                        <span aria-hidden className="absolute inset-0 bg-[#001A3D]/35" />
                      </span>
                      {/* O ícone ENCAVALA o medalhão, que é o que costura a arte ao
                          assunto do card em vez de deixar duas peças soltas. Caixa
                          branca chapada porque ele cai metade sobre a foto. */}
                      <span
                        aria-hidden
                        className="absolute -right-2 bottom-0 flex h-10 w-10 items-center justify-center rounded-xl border border-[#0079CB]/18 bg-white"
                      >
                        <Icone className="h-5 w-5 text-[#0079CB]" strokeWidth={1.6} />
                      </span>
                    </span>
                    <p className="text-sm leading-relaxed text-ink-muted">{texto}</p>
                  </li>
                );
              })}
            </ul>
          </RevealScope>
        </section>
      )}

      {/* ── 4. LOGO, VOCÊ PODERÁ PERGUNTAR (a faixa escura com o trilho) ─────
          O `bg-[#001A3D]` é DECLARADO e não herdado, e isso está medido nas irmãs: o
          `body` deste site é `#1273bc` (azul MÉDIO), e sem fundo próprio as tintas
          brancas do trilho medem ~4,1:1 e ~3,2:1 contra ele, reprovadas no piso de 4,5.
          Com o navy profundo chapado o mesmo texto passa com folga.
          A CAPA ENTRA COMO FUNDO sob um véu e o chapado NÃO sai: ele é o piso de
          contraste para o caso de a arte não carregar, e é o véu que garante que o
          número medido não dependa de qual pedaço da foto caiu atrás de qual passo.
          SEM `z-index` negativo na camada da arte — foi o defeito medido no Match AI: a
          seção não cria contexto de empilhamento por `position: relative` sozinha, e um
          filho negativo desce para trás do `background` da PRÓPRIA seção, que aqui é
          chapado; a imagem pintava embaixo do fundo. A ordem de documento resolve. */}
      {falas.length > 0 && (
        <section
          className="section-py relative overflow-clip bg-[#001A3D]"
          aria-labelledby={idDoBloco(TITULO_FALAS)}
        >
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <Image
              src={CAPA}
              alt=""
              fill
              sizes="100vw"
              loading="lazy"
              className="object-cover object-[center_42%]"
            />
            {/* VÉU QUASE FECHADO NOS TRÊS TERÇOS, e não um gradiente que abre à direita:
                as citações e o trilho ocupam a faixa inteira, então há texto branco
                sobre o terço direito também. O leve degradê que sobra existe só para a
                arte não ficar uniformemente apagada.
                O NÚMERO É O DA IRMÃ SIS-287, e herdá-lo é decisão medida e não cópia: lá
                ele subiu DUAS vezes, cada uma contra uma captura, porque a capa tinha
                uma placa de nome desenhada no miolo que se lia como fantasma atrás do
                texto a 98,5%. A capa desta rota também traz letreiro desenhado, então o
                piso de partida é o que já sobreviveu àquela prova — e o portão que
                confirma é o desvio de pixel na janela do letreiro, na sonda desta issue,
                não a minha leitura da captura. */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,26,61,0.995)_0%,rgba(0,26,61,0.995)_50%,rgba(0,26,61,0.99)_100%)]" />
          </div>
          {/* A malha e o grafismo ENTRAM DEPOIS da foto e do véu, de propósito: o véu
              apaga a arte quase por inteiro e a malha tem de ficar SOBRE ele, senão a
              grade seria a coisa mais apagada da faixa. O par 0/1 entre irmãos não é
              preferência: `.grade-tecnica` nasce em `z-index: -1`, e como esta seção tem
              fundo chapado o negativo a jogaria para trás dele — `.gurudeseguros-grade`
              reescreve para 0. */}
          <div aria-hidden className="grade-tecnica gurudeseguros-grade" />
          <OndasDeVoz className="gurudeseguros-ondas--escuro" />
          <RevealScope
            className="container-lp relative z-10"
            limiar={LIMIAR_REVEAL}
            margem={MARGEM_REVEAL}
            data-reveal-nome="gurudeseguros-falas"
          >
            <div>
              <h2
                data-reveal="fade-up"
                id={idDoBloco(TITULO_FALAS)}
                className="font-display text-section font-bold text-white"
              >
                {TITULO_FALAS}
              </h2>
              {/* AS DUAS FALAS COMO CITAÇÃO DE VERDADE (a peça que nenhuma irmã tem): o
                  dado traz a pergunta entre aspas curvas dentro do parágrafo, então o
                  elemento é `<blockquote>` e o texto entra INTEIRO, com as aspas do
                  próprio site — não há aspa desenhada por CSS repetindo as que já estão
                  escritas. O que o CSS desenha é a onda embaixo, que é o que diz «isto
                  foi falado».
                  Sem `<cite>`: quem fala é a Alexa dentro da frase, e um `cite` com
                  «Alexa» seria atribuição inventada de uma citação que o dado não
                  atribui. */}
              <ul className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
                {falas.map((fala, i) => (
                  <li key={fala.slice(0, 40)} data-reveal="fade-up" style={cascata(i + 1)}>
                    <blockquote
                      className={[
                        'gurudeseguros-citacao relative h-full rounded-2xl border border-[#0ED8F6]/25 bg-[#001A3D]/70 px-5 py-6',
                        i === 1 && 'gurudeseguros-citacao--2',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      <p className="text-base leading-relaxed text-white/90">{fala}</p>
                    </blockquote>
                  </li>
                ))}
              </ul>
              {/* O TRILHO «voz → resposta → legado» (item 4 da issue). Selo em LOSANGO
                  com halo que se expande — não o disco liso do Match AI, a placa reta do
                  Smart Miner nem o anel tracejado do QA. O fio é UM nó por par de passos
                  (o último não tem para onde apontar) e só a partir de `sm`, onde os três
                  estão lado a lado; empilhado não há fio nenhum, que é o certo, porque um
                  segmento horizontal entre passos empilhados ligaria coisas que não estão
                  em linha. */}
              <ol className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
                {TRILHO.map((passo, i, todos) => {
                  const Icone = ICONES_TRILHO[i] ?? Sparkles;
                  return (
                    <li
                      key={passo.termo}
                      data-reveal="fade-up"
                      style={cascata(i + 3)}
                      className="relative"
                    >
                      <span
                        aria-hidden
                        className="gurudeseguros-selo relative flex h-14 w-14 items-center justify-center"
                      >
                        {/* A PLACA é nó irmão do ícone e leva o `rotate: 45deg`: o
                            losango é ela, e o glifo dentro fica de pé — girar o nó que
                            contém o ícone deixaria o desenho tombado junto. */}
                        <span aria-hidden className="gurudeseguros-placa absolute inset-1" />
                        {/* O HALO é o círculo de escuta se abrindo, e também é nó IRMÃO:
                            quem recebe `scale` é ele. `scale` isolado (e não
                            `transform: scale`) porque o `li` tem `data-reveal`, que é
                            dono do `transform` — dois donos da mesma propriedade é a
                            colisão que zera o reveal. */}
                        <span
                          aria-hidden
                          className={[
                            'gurudeseguros-halo absolute inset-0 rounded-full',
                            i === 1 && 'gurudeseguros-halo--2',
                            i === 2 && 'gurudeseguros-halo--3',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                        />
                        <Icone className="relative h-6 w-6 text-[#B6F1FB]" strokeWidth={1.6} />
                      </span>
                      {i < todos.length - 1 && <OndaDoFio />}
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

      {/* ── 5. DE ONDE PODE SER ACESSADA? (o item 5 da issue) ────────────────
          O bloco de dispositivos, com o parágrafo do dado publicado INTEIRO e as
          pastilhas como leitura rápida do que ele nomeia — a lista é filtrada contra o
          próprio texto (ver `DISPOSITIVOS`), então nenhuma pastilha afirma dispositivo
          que a frase não diga.
          Título e âncora vêm do dado (`de-onde-pode-ser-acessada`), e esta é a SEGUNDA
          parada do indicador lateral desta rota; o rótulo dela no indicador é o
          `navLabel: 'Acesso'` que o dado já declara. */}
      {acesso?.kind === 'paragraphs' && acesso.heading && (
        <section
          className="section-light section-py relative overflow-clip"
          aria-labelledby={idDoBloco(acesso.heading)}
        >
          <AcentosClaros />
          <OndasDeVoz className="gurudeseguros-ondas--claro" />
          <RevealScope
            className="container-lp relative z-10"
            limiar={LIMIAR_REVEAL}
            margem={MARGEM_REVEAL}
            data-reveal-nome="gurudeseguros-acesso"
          >
            <h2
              data-reveal="fade-up"
              id={idDoBloco(acesso.heading)}
              className="font-display text-section font-bold text-ink"
            >
              {acesso.heading}
            </h2>
            <p
              data-reveal="fade-up"
              style={cascata(1)}
              className="mt-6 max-w-3xl text-lg leading-relaxed text-ink-muted"
            >
              {acesso.paragraphs[0]}
            </p>
            {/* `aria-hidden` na fileira: cada pastilha é um pedaço do parágrafo que o
                leitor de tela acabou de ouvir por inteiro, e repetir nove nomes soltos
                depois da frase é ruído, não informação. É grafismo de leitura. */}
            <ul
              aria-hidden
              data-reveal="fade-up"
              style={cascata(2)}
              className="mt-8 flex flex-wrap gap-2"
            >
              {DISPOSITIVOS.filter((d) => acesso.paragraphs[0].includes(d)).map((d) => (
                <li
                  key={d}
                  className="rounded-full border border-[#0079CB]/25 bg-white/70 px-3.5 py-1.5 text-xs font-semibold text-[#0a1f44]"
                >
                  {d}
                </li>
              ))}
            </ul>
          </RevealScope>
        </section>
      )}

      {/* ── 6. CONHEÇA TAMBÉM ────────────────────────────────────────────────
          A mesma peça de fecho das irmãs, e de propósito: ela é a versão desta família
          de páginas do `<nav>` «Outras soluções» do template, com as pílulas (a atual
          como `<span aria-current="page">`, fora da ordem de tabulação) e os seis
          cartões de irmã. Não é copy de ninguém — são o nome e a capa de cada solução,
          vindos de `accelerators.ts`/`ACCELERATOR_PAGES`, e a única frase própria é a
          linha de apoio, que é a mesma nas quatro rotas porque descreve a FAMÍLIA e não
          o produto.
          A faixa é a mais baixa da página (`py-12`), então leva os pontos e NÃO a arte
          de canto: uma peça de 320px de lado numa faixa de ~176px de miolo seria
          recortada em quase tudo e o pedaço restante encostaria nos cartões.
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
          data-reveal-nome="gurudeseguros-conheca"
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
                  className="gurudeseguros-midia group relative block aspect-[16/10] overflow-hidden rounded-xl border border-[#0079CB]/18 transition-colors hover:border-[#0079CB]/55"
                >
                  <Image
                    src={a.capaCard}
                    alt=""
                    aria-hidden
                    fill
                    sizes="(min-width: 1180px) 176px, (min-width: 640px) 33vw, 50vw"
                    loading="lazy"
                    className="gurudeseguros-midia-arte object-cover"
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
            /* `on-dark` É OBRIGATÓRIO: pílula de fundo cheio DENTRO de `.section-light`,
               cujos overrides pintam de navy tudo que traga `text-white`
               (`[class*="text-white"] { color: #0a1f44 }`, globals.css:1115). O fundo é
               `#0060A8` e não `#0079CB` pelo número medido na SIS-292: branco 0,88 sobre
               o primário dá ~4,2:1, abaixo do piso; sobre o azul de hover da paleta
               passa com folga. */
            className="on-dark mt-6 inline-flex items-center gap-2 rounded-full bg-[#0060A8] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#004D8A]"
          >
            Ver todas as soluções e serviços
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden />
          </Link>
        </RevealScope>
      </nav>
      {/* O modal montado no FIM da árvore, como em `Header.tsx`, e sem
          `title`/`description`: os defaults são a escrita «Fale com a gente». Ele se
          portala para fora daqui, então a posição no markup não afeta o desenho — o que
          ela evita é nascer dentro de uma seção com `transform`/`filter`, que ancoraria
          o `fixed` do `<dialog>` no lugar errado. */}
      <ContactModal open={contatoAberto} onClose={() => setContatoAberto(false)} />
    </>
  );
}
