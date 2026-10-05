'use client';

/**
 * SIS-268 — O CORPO DA `/solucoes/connect-api`, na MESMA ARQUITETURA DE SEÇÕES
 * da `/solucoes/match-ai` (`MatchAiPagina`) e com IDENTIDADE PRÓPRIA.
 *
 * IRMÃ DA SIS-280 (guru-de-seguros), DA SIS-287 (qa-integrado) e DA SIS-279
 * (smart-miner/fast) — «tickets separados»: o padrão é o que aquelas registraram,
 * componente dedicado montado no `[slug]/page.tsx` SÓ para esta slug, porque o
 * template genérico renderiza `page.blocks.map(...)` no mesmo molde para as sete e
 * expressar hero sangrado, grade de jornadas, faixa escura com trilho e hub de raios
 * como variação de `Block` mudaria o molde das SETE. Com esta, `CORPOS_PROPRIOS`
 * passa a ter SEIS entradas e sobra UMA slug no caminho genérico (`lumina-ai`), sem
 * uma linha daquele ramo tocada.
 * SIS-280 — essa contagem CADUCOU: a slug que sobrava virou `luminna-ai` (dois n) e
 * ganhou corpo próprio, então `CORPOS_PROPRIOS` tem SETE entradas e o caminho genérico
 * está sem acelerador nenhum. O ramo segue de pé para a próxima solução do dado que
 * entrar sem cápsula — a razão está no `[slug]/page.tsx`. Nada desta página mudou.
 *
 * ── AS TRÊS REFERÊNCIAS DA ISSUE, E O QUE DELAS É COPY DA MOCK ────────────────
 * A issue descreve três prints («anexadas no chat»), e eles NÃO ESTÃO no repositório
 * — `public/imagensexemplo/` não tem nenhuma arte de Connect API (conferido). Então
 * esta página é montada pela DESCRIÇÃO ESCRITA das refs, e o relatório da issue
 * declara isso. As refs e o destino de cada uma:
 *   1. «Feito para cada jornada de distribuição» — eyebrow «SOLUÇÕES PARA CADA
 *      REALIDADE» + três cartões (Vida Individual / Empresarial / Grupo) com foto e
 *      ícone → FAIXA 3 desta página.
 *   2. «Da integração à experiência do cliente» — trilho Conectar → Configurar →
 *      Distribuir → Acompanhar → FAIXA 4 (a faixa escura).
 *   3. «Uma jornada, múltiplas possibilidades» — hub central Connect API com raios
 *      para as linhas de vida (esq.) e as capacidades (dir.) → FAIXA 6.
 *
 * O QUE VEM DO SITE e o que é COPY DA MOCK (a régua do item «alinhar ao site quando
 * houver; o que só estiver na mock, declarar»):
 *   DO SITE (`src/data/acceleratorPages.ts` → `connect-api`, e `accelerators.ts`):
 *     - o `lead`, os TRÊS parágrafos e o bloco `list` «Principais diferenciais»;
 *     - «Jornada de Distribuição de Seguros de Vida (Individual, Empresarial e Vida
 *       em Grupo)» — é ela que licencia os três cartões da ref 1 e a coluna esquerda
 *       do hub da ref 3; os nomes das linhas saem DESTE parêntese;
 *     - «ferramentas de Venda Consultiva e autosserviços aos estipulantes» e
 *       «Complementa as funcionalidades já disponibilizadas pelas Seguradoras» — são
 *       elas que licenciam a coluna direita do hub (a mock diz «Consulta/cotação,
 *       Autoserviço, Sistemas das seguradoras»; aqui os rótulos são os DO SITE);
 *     - «em qualquer lugar e em qualquer dispositivo» e «rápida publicação e
 *       integrações simples e flexíveis» — os textos dos quatro passos do trilho.
 *   SÓ DA MOCK (declarado no relatório, e é tudo o que não é do site):
 *     - os quatro VERBOS do trilho: «Conectar», «Configurar», «Distribuir»,
 *       «Acompanhar»;
 *     - os dois títulos de faixa «Da integração à experiência do cliente» e «Uma
 *       jornada, múltiplas possibilidades»;
 *     - o par título+eyebrow da grade: «Feito para cada jornada de distribuição» e
 *       «SOLUÇÕES PARA CADA REALIDADE».
 *   Nenhum desses seis itens afirma CAPACIDADE que o site não afirme — são rótulo,
 *   verbo e título. Todo claim (o que o produto faz) é do site, publicado verbatim.
 *
 * ── OS TÍTULOS QUE O DADO NÃO TEM ────────────────────────────────────────────
 * O dado tem UM `heading` só («Principais diferenciais») e a arquitetura do Match AI
 * tem um título por faixa. O da faixa 2 é FRAGMENTO VERBATIM do texto que a própria
 * faixa publica — «ecossistema totalmente orientado a serviços» abre o primeiro
 * parágrafo —, que é a régua de «derivar rótulo, não inventar claim» das irmãs. Os
 * outros três são os títulos das mocks, declarados acima.
 *
 * ── `pageSections` / ÂNCORAS: SEM INDICADOR, como no QA ───────────────────────
 * `SECOES_DE_ACELERADOR` monta as paradas percorrendo os blocos COM `heading` e
 * devolve `VAZIO` quando sobram menos de três. Esta slug tem UM `heading` →
 * «Início» + uma parada = 2 → a rota NÃO tem indicador lateral, e é o mesmo caso da
 * SIS-287 (`qa-integrado`); `pageSections.ts` já registra as duas por nome no
 * comentário do corte, e por isso NADA precisou mudar lá. Ainda assim:
 *   - `id="topo"` no hero é obrigatório: é o destino do «pular para o conteúdo», e
 *     ele vinha do `PageHero`, que esta slug deixa de montar;
 *   - o `id` da faixa de diferenciais sai de `idDoBloco(heading)`, o mesmo dono que
 *     `pageSections.ts` usa, para o dia em que um segundo `heading` entrar no dado e
 *     a rota ganhar indicador sem uma linha aqui;
 *   - os três títulos de mock e o derivado NÃO são `heading` de bloco, então não
 *     entram como parada — parada tem de existir no dado.
 *
 * ── IDENTIDADE PRÓPRIA (variar 1–2 componentes vs o Match AI e as irmãs) ──────
 * O assunto desta solução é INTEGRAÇÃO, e as peças que divergem desenham isso:
 *   1. O HUB DE RAIOS (`HubDeJornadas`) é peça que NENHUMA irmã tem: núcleo Connect
 *      API no centro e seis raios saindo para as linhas de vida (esq.) e as
 *      capacidades (dir.), com um pulso que percorre cada raio. É a ref 3 desenhada.
 *   2. O TRILHO TEM QUATRO PASSOS (as irmãs têm três) e o selo é HEXÁGONO — disco
 *      liso no Match AI, placa reta no Smart Miner, anel tracejado no QA, losango com
 *      halo no Guru.
 *   3. O FIO entre passos carrega um PACOTE que viaja: um segmento curto de traço
 *      correndo de um selo ao outro, e não o tracejado em marcha (Smart Miner), a
 *      conta que corre (QA), o degradê de 200% (Match AI) nem a senoide (Guru). É
 *      `stroke-dasharray` de fração com `pathLength="1"`, então a mesma peça serve
 *      vãos de larguras diferentes sem recalibrar nada.
 *   4. O GRAFISMO DE CANTO é `MalhaDeEndpoints` — um leque de curvas que CONVERGEM
 *      num ponto da borda, com um nó em cada uma: é o mesmo assunto do hub, repetido
 *      em escala de textura. Lá é circuito (Match AI), esteira (Smart Miner), malha
 *      de casos (QA) e onda de voz (Guru).
 *   5. O CARD da grade tem a arte em FAIXA 3/2 NO TOPO com o ícone encavalando a
 *      borda de baixo dela — em vez do medalhão redondo (Guru), da tira vertical
 *      (QA), da faixa 16/9 (Smart Miner) ou da miniatura 28/32 (Match AI).
 *
 * A COR é a do dado: `#C4A0FB` é o `tone` que `accelerators.ts` declara para o
 * Connect API (lilás). Ela vale SÓ nas faixas escuras — sobre folha clara um lilás a
 * 12% é textura, mas como TINTA reprova no piso de contraste (o número que reprovou o
 * ciano do Match AI, 1,03:1, foi medido na SIS-292 e a conta é a mesma). Nas faixas
 * claras a tinta de grafismo é o azul institucional `#0079CB`, como nas quatro irmãs.
 *
 * ── O LETREIRO É IMAGEM, e a CÁPSULA VEM COM ELE ─────────────────────────────
 * Existe arte de marca de letra clara (`images/logos/logoConnectAPI.png`, 635×350,
 * tinta média medida `rgb(236, 236, 236)` em 42.452 pixels opacos sobre canto
 * transparente — é arte de fundo escuro, que é onde este hero a põe), então o `h1`
 * carrega a marca como nas irmãs Match AI, Smart Miner e Guru. `alt={page.name}` e
 * NÃO vazio: `h1` cujo conteúdo inteiro é imagem com `alt=""` é cabeçalho sem nome
 * acessível.
 * A CÁPSULA da SIS-279 CONTINUA MONTADA, e é o ponto de atenção desta issue: ela
 * entrava por `CARIMBOS_DE_ABERTURA`/`eyebrowArte` do template genérico, e sair do
 * caminho genérico a desmontaria — seria regressão de uma issue já fechada. Então ela
 * vem para cá, com a MESMA arte, as mesmas dimensões intrínsecas medidas lá
 * (828×291) e a MESMA classe `connectapi-carimbo`, que é a que carrega
 * `--carimbo-batida-w` no `globals.css` e não mudou.
 *
 * ── MOVIMENTO ────────────────────────────────────────────────────────────────
 * `RevealScope` + `data-reveal` + `./reveal-calibre`, que é o mecanismo do Match AI (e
 * não o `variants` de `@/lib/motion` do `FastPagina`): a issue manda espelhar o
 * motion/reveal do Match AI, e a razão de não somar os dois está no docblock dele
 * (dois donos do mesmo `transform`). `esperarRota` SÓ no escopo do hero, pelo contrato
 * da SIS-269. O movimento em laço é todo CSS, no bloco `SIS-268` do fim do
 * `globals.css`, com os DOIS canais de movimento reduzido.
 */

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  Building2,
  MonitorSmartphone,
  Plug,
  Server,
  Share2,
  SlidersHorizontal,
  Sparkles,
  User,
  UserRoundCheck,
  Users,
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
   aqui. Já é a derivada WebP (1672×941 medido), o que importa porque com
   `images: { unoptimized: true }` (SIS-154) o `next/image` entrega o arquivo como ele
   está no disco e um PNG cru iria inteiro para o LCP do hero. */
const CAPA = CAPAS_DE_ABERTURA['connect-api'].src;

/* O cartão da vitrine desta solução: a `description` (apoio de um título), a
   `capaCard` (a arte dos placeholders) e o LOGO de letra clara do letreiro do hero.
   Achado por `id` e não digitado — duas cópias do mesmo caminho divergiriam na
   primeira troca de arte. */
const VITRINE = ACCELERATORS.find((a) => a.id === 'connect-api');

/* ── A CÁPSULA DO HERO (entregue e medida na SIS-279) ──────────────────────────
   Os números são os DAQUELA issue, não remedidos por palpite: 828×291 no IHDR (razão
   2,845:1), tombo de repouso −3,02°, tinta média `rgb(255, 255, 255)` em 27.922
   pixels opacos sobre canto transparente. As dimensões são as INTRÍNSECAS — elas
   montam a razão de aspecto dentro do componente para a cápsula não achatar; o
   TAMANHO sai de `--carimbo-batida-w` em `.connectapi-carimbo.carimbo-batida` no
   `globals.css`, regra que esta issue não toca. */
const CARIMBO = {
  src: '/images/solucoes/carimbo-connect-api-ticket-outline-ffffff.png',
  largura: 828,
  altura: 291,
};

/* ── AS TRÊS LINHAS DE VIDA (a ref 1 e a coluna esquerda do hub da ref 3) ──────
   Os NOMES saem do parêntese do primeiro parágrafo do site — «Jornada de Distribuição
   de Seguros de Vida (Individual, Empresarial e Vida em Grupo)» —, e é por isso que
   cada `nome` é a palavra do dado com «Vida» na frente, e não rótulo inventado. O
   `verbatim` é o trecho do dado que licencia a linha, e ele vive aqui para o filtro
   abaixo poder conferir a lista contra o texto publicado: se o site trocar de linha de
   vida, o cartão da antiga DESAPARECE com a frase em vez de ficar afirmando sozinho
   uma jornada que a página não oferece mais. É o modo de falha de card digitado à mão.
   NENHUM texto de cartão nasce aqui além do nome: descrever cada linha exigiria claim
   que o site não faz. */
const LINHAS_DE_VIDA = [
  { nome: 'Vida Individual', verbatim: 'Individual' },
  { nome: 'Vida Empresarial', verbatim: 'Empresarial' },
  { nome: 'Vida em Grupo', verbatim: 'Vida em Grupo' },
];

const ICONES_LINHAS = [User, Building2, Users];

/* ── OS QUATRO PASSOS DO TRILHO DA FAIXA ESCURA (a ref 2) ─────────────────────
   Os VERBOS são da mock (declarado no docblock). Cada `texto` é FRAGMENTO VERBATIM do
   site, e nenhum se repete na faixa de diferenciais — o terceiro parágrafo é dividido
   entre os dois primeiros passos, o `lead` de venda consultiva alimenta o terceiro e a
   frase de dispositivo alimenta o quarto:

     1º parágrafo: «…ferramentas de Venda Consultiva e autosserviços aos estipulantes»
     2º parágrafo: «prontos para ter sua solicitação atendida em qualquer lugar e em
                    qualquer dispositivo, com ampla gama de alternativas e benefícios»
     3º parágrafo: «Pode ser usado em sua totalidade ou apenas APIs específicas com
                    rápida publicação e integrações simples e flexíveis»

   Nesta ordem a cadeia é a integração que entra, o escopo que se escolhe, a
   distribuição que sai e a jornada que se acompanha — que é exatamente o fluxo que a
   ref 2 nomeia. */
const TRILHO = [
  {
    termo: 'Conectar',
    texto: 'rápida publicação e integrações simples e flexíveis',
  },
  {
    termo: 'Configurar',
    texto: 'pode ser usado em sua totalidade ou apenas APIs específicas',
  },
  {
    termo: 'Distribuir',
    texto: 'ferramentas de Venda Consultiva e autosserviços aos estipulantes',
  },
  {
    termo: 'Acompanhar',
    texto: 'em qualquer lugar e em qualquer dispositivo, com ampla gama de alternativas e benefícios',
  },
];

const ICONES_TRILHO = [Plug, SlidersHorizontal, Share2, Activity];

/* ── AS TRÊS CAPACIDADES (a coluna direita do hub da ref 3) ───────────────────
   A mock diz «Consulta/cotação, Autoserviço, Sistemas das seguradoras». Os RÓTULOS
   aqui são os DO SITE para as mesmas três coisas — «Venda Consultiva» e
   «autosserviços aos estipulantes» estão no primeiro parágrafo e «Complementa as
   funcionalidades já disponibilizadas pelas Seguradoras» é o terceiro diferencial —,
   porque a régua da issue é alinhar ao site quando houver. */
const CAPACIDADES = [
  { nome: 'Venda Consultiva', icone: UserRoundCheck },
  { nome: 'Autosserviço ao estipulante', icone: MonitorSmartphone },
  { nome: 'Sistemas das seguradoras', icone: Server },
];

/* Os títulos de faixa como constantes e não literais no JSX: cada um é usado DUAS
   vezes (o `aria-labelledby` da seção e o `id` do `h2`), e duas cópias de string a
   virar âncora é o jeito de as duas divergirem. A procedência de cada um (site
   derivado ou copy da mock) está no docblock. */
const TITULO_ECOSSISTEMA = 'Ecossistema orientado a serviços';
const TITULO_JORNADAS = 'Feito para cada jornada de distribuição';
const TITULO_TRILHO = 'Da integração à experiência do cliente';
const TITULO_HUB = 'Uma jornada, múltiplas possibilidades';

/* O índice da cascata vive em `--reveal-i`; o atraso sai de
   `calc(var(--motion-stagger-reveal) * var(--reveal-i))`. Mesmo helper das irmãs, pela
   mesma razão: não repetir o cast de custom property em vinte pontos. */
const cascata = (i: number) => ({ '--reveal-i': i }) as React.CSSProperties;

/* As manchas de ponto fino e o quadrado pálido das faixas claras — a textura da casa
   (`/sistran-university`, `/sistran-labs`, `.matchai-acentos`, `.smartminer-acentos`,
   `.qaintegrado-acentos`, `.gurudeseguros-acentos`). Nó e não pseudo-elemento porque
   `.section-light` já gastou os dois (`::before` malha de 96px, `::after` pontilhado).
   `aria-hidden` porque é grafismo: sem ele o leitor de tela anuncia um nó vazio antes
   do conteúdo. */
function AcentosClaros() {
  return <span aria-hidden className="connectapi-acentos" />;
}

/* ── O GRAFISMO DE CANTO: A MALHA DE ENDPOINTS (a variação de componente) ──────
   Geometria nova, mecânica da casa: cinco curvas que CONVERGEM num ponto da borda
   direita — o mesmo assunto do hub da ref 3, repetido em escala de textura — com um nó
   na ponta de cada uma. As curvas são desenhadas por `stroke-dasharray`/`-dashoffset`
   (a receita de `svg-stroke-drawing`) e `pathLength="1"` normaliza o comprimento, o que
   deixa as cinco, de curvaturas diferentes, compartilharem UM keyframe.

   `viewBox` FIXO com `preserveAspectRatio` padrão: são várias caixas de alturas
   diferentes que ainda vão mudar ao mudar copy, e amarrar a arte à altura da seção
   seria um número a recalibrar por faixa.

   SEM `<defs>`/`id`: este componente é montado QUATRO vezes na mesma página, e `id`
   repetido faz todo `url(#…)` apontar para o primeiro. As pontas morrem por
   `mask-image` no CSS, que é por elemento e não por documento. */
function MalhaDeEndpoints({ className }: { className: string }) {
  /* Os cinco pontos de partida na lateral esquerda do quadro; todos chegam ao MESMO
     ponto de convergência (300, 160), que é o «hub» desta textura. As curvas são
     declaradas (e não geradas com aleatório) porque o desenho tem de ser o mesmo em
     todo mount — o que se move é o traço. */
  const PARTIDAS = [20, 90, 160, 230, 300];
  return (
    <svg aria-hidden className={`connectapi-malha ${className}`} viewBox="0 0 320 320">
      {PARTIDAS.map((y, i) => (
        <path
          key={y}
          className={`connectapi-curva${i > 0 ? ` connectapi-curva--${i + 1}` : ''}`}
          pathLength="1"
          d={`M 8 ${y} C 120 ${y} 150 160 296 160`}
        />
      ))}
      {PARTIDAS.map((y, i) => (
        <circle
          key={`no-${y}`}
          className={`connectapi-no connectapi-no--${(i % 3) + 1}`}
          cx="8"
          cy={y}
          r="4"
        />
      ))}
      {/* O nó do ponto de convergência é maior: é o que diz que as cinco chegam ao
          mesmo lugar. */}
      <circle className="connectapi-no connectapi-no--hub" cx="296" cy="160" r="7" />
    </svg>
  );
}

/* ── O FIO DO TRILHO: UM PACOTE QUE VIAJA (a variação de componente) ──────────
   Duas peças no mesmo caminho: a LINHA, que existe sem animação (é ela que liga os
   passos, e é por isso que o fio continua sendo fio quando o movimento morre), e o
   PACOTE, um segmento curto de traço que corre de um selo ao outro. `pathLength="1"`
   outra vez, para o segmento ser fração e não medida — e é o que deixa a mesma peça
   servir vãos de larguras diferentes sem recalibrar nada, porque o SVG estica.
   `preserveAspectRatio="none"`: aqui a distorção é desejada — o fio tem de ocupar
   exatamente o vão entre dois selos, qualquer que seja ele. */
function FioComPacote() {
  return (
    <svg
      aria-hidden
      className="connectapi-fio absolute left-14 right-[-2rem] top-[1.6rem] hidden h-2 w-auto sm:block"
      viewBox="0 0 120 8"
      preserveAspectRatio="none"
    >
      <path className="connectapi-fio-linha" pathLength="1" d="M 0 4 H 120" />
      <path className="connectapi-fio-pacote" pathLength="1" d="M 0 4 H 120" />
    </svg>
  );
}

/* ── O HUB DE RAIOS (a ref 3, e a peça que nenhuma irmã tem) ──────────────────
   Os RÓTULOS são HTML (duas listas de verdade, com título cada uma), e o SVG é só o
   desenho dos raios: hub desenhado em SVG com o texto dentro dele seria conteúdo preso
   numa arte, e num telefone as duas colunas empilham sem raio nenhum — o que é o certo,
   porque raio horizontal entre itens empilhados ligaria coisas que não estão em linha.
   `preserveAspectRatio="none"` pelo mesmo motivo do fio: o quadro tem de casar com a
   grade, qualquer que seja a largura.
   Seis raios saindo do núcleo (300, 160): três para a esquerda e três para a direita,
   nas alturas das três linhas da grade. */
function RaiosDoHub() {
  const ALTURAS = [40, 160, 280];
  return (
    <svg
      aria-hidden
      className="connectapi-raios absolute inset-0 hidden h-full w-full lg:block"
      viewBox="0 0 600 320"
      preserveAspectRatio="none"
    >
      {ALTURAS.map((y, i) => (
        <path
          key={`esq-${y}`}
          className={`connectapi-raio connectapi-raio--${i + 1}`}
          pathLength="1"
          d={`M 60 ${y} C 170 ${y} 200 160 268 160`}
        />
      ))}
      {ALTURAS.map((y, i) => (
        <path
          key={`dir-${y}`}
          className={`connectapi-raio connectapi-raio--${i + 4}`}
          pathLength="1"
          d={`M 332 160 C 400 160 430 ${y} 540 ${y}`}
        />
      ))}
    </svg>
  );
}

export default function ConnectApiPagina({ page }: { page: AcceleratorPage }) {
  /* OS BLOCOS POR FORMA E POR TÍTULO, e não por índice: índice é dependência
     invisível, e um bloco novo no dado reordenaria as seções em silêncio (a nota é a do
     Match AI). O de parágrafos desta slug NÃO tem `heading` — é o único da rota com
     `kind: 'paragraphs'`, então a busca é pelo `kind`; o de lista tem, e é por ele que
     se acha, porque é o mesmo dado que vira âncora e que `pageSections.ts` lê. */
  const texto = page.blocks.find((b) => b.kind === 'paragraphs');
  const diferenciais = page.blocks.find((b) => b.heading === 'Principais diferenciais');

  const paragrafos = texto?.kind === 'paragraphs' ? texto.paragraphs : [];
  const itens = diferenciais?.kind === 'list' ? diferenciais.items : [];

  /* AS LINHAS DE VIDA CONFERIDAS CONTRA O TEXTO PUBLICADO. O filtro não é enfeite
     defensivo: é o que garante que o cartão não sobreviva à frase que o licencia (ver
     `LINHAS_DE_VIDA`). O texto conferido é o dos parágrafos juntos, porque é o que a
     página publica. */
  const publicado = paragrafos.join(' ');
  const linhas = LINHAS_DE_VIDA.filter((l) => publicado.includes(l.verbatim));

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
          `id="topo"` é o destino do «pular para o conteúdo», e ele vinha do `PageHero`
          que esta slug deixa de montar. */}
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
              o resultado medido na SIS-279 foi faixa escura SEM VÉU NENHUM. */}
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
          data-reveal-nome="connectapi-hero"
        >
          <div>
            {/* A CÁPSULA É ETIQUETA, NÃO MANCHETE: ela vem ACIMA do `h1` e com
                `alt=""`. O par é o da 7ª volta do Match AI, e o `alt` vazio é
                obrigatório e não estilo — o nome acessível da rota é o do letreiro, que
                é o conteúdo do `h1`; com as duas artes nomeadas o leitor de tela diria
                «Connect API Connect API».
                É A MESMA CÁPSULA DA SIS-279, com a mesma arte, as mesmas dimensões
                intrínsecas e a mesma classe: ela entrava pelo `eyebrowArte` do template
                genérico, e esta issue tira a slug daquele caminho — sem este mount, a
                SIS-279 regrediria nesta rota.
                `gatilho="rota"` porque a peça vive ACIMA da dobra, onde liberar o portão
                do `RouteLoadGate` e entrar em quadro são o mesmo instante — o gatilho de
                viewport existe para quem nasce a milhares de px do topo (SIS-188).
                A batida, os dois canais de movimento reduzido e a espera do portão já
                vivem no componente; refazer isso à mão aqui seria GSAP ad hoc num hero
                acima da dobra.
                DUAS CLASSES no nó, e o componente concatena: o empate de especificidade
                com `carimbo-batida.css` está explicado no `globals.css`.
                Ela NÃO é `data-reveal` — quem a faz entrar é a própria batida —, então
                a cascata do letreiro e do lead começa em 0 como nas irmãs. */}
            <CarimboBatida
              src={CARIMBO.src}
              alt=""
              larguraIntrinseca={CARIMBO.largura}
              alturaIntrinseca={CARIMBO.altura}
              className="connectapi-carimbo"
              gatilho="rota"
            />
            {/* O LETREIRO É A MARCA DESENHADA, como nas irmãs Match AI, Smart Miner e
                Guru — aqui EXISTE arte de letra clara (medida: `rgb(236, 236, 236)`), e
                ela é a mesma que `accelerators.ts` já serve nos cartões, achada pelo
                `id` e não digitada. `alt={page.name}` e não vazio: este `h1` não tem
                outro conteúdo, e cabeçalho sem nome acessível é cabeçalho que não
                existe para leitor de tela.
                `width`/`height` são as dimensões INTRÍNSECAS do dado: com
                `images: { unoptimized: true }` o que baixa é o arquivo do disco, então o
                par serve para reservar a caixa e não distorcer a marca. `priority`
                porque está na dobra e é o nome da página. */}
            <h1 data-reveal="fade-up" className="mt-4 font-display">
              {VITRINE && (
                <Image
                  src={VITRINE.logo}
                  alt={page.name}
                  width={VITRINE.logoWidth}
                  height={VITRINE.logoHeight}
                  priority
                  className="connectapi-letreiro h-auto"
                />
              )}
            </h1>
            {/* O `lead` desta slug tem 52 caracteres («Connect API: Plataforma para
                distribuição de Seguros»), então ele entra INTEIRO na dobra — não há o
                corte na primeira vírgula que o Guru precisou fazer num `lead` de ~460.
                E ele NÃO se repete na faixa 2: lá o que se publica é o primeiro
                parágrafo. */}
            <p
              data-reveal="fade-up"
              style={cascata(1)}
              className="mt-5 max-w-[46ch] text-lg leading-relaxed text-white/85 lg:max-w-[52ch]"
            >
              {page.lead}
            </p>
            {/* AÇÃO NA PRÓPRIA PÁGINA, então `<button>` e não `<a>`: link que não vai a
                lugar nenhum é link falso para leitor de tela e para o teclado. O molde é
                o do cabeçalho (`Header.tsx`), que monta `ContactModal` SEM
                `title`/`description` de propósito — os defaults do componente são a
                escrita «Fale com a gente», e passar texto próprio faria a mesma peça
                dizer duas coisas diferentes na mesma rota.
                A PÍLULA É O LILÁS DO PRODUTO (`tone` do dado, `#C4A0FB`) com tinta navy
                `#1B1036`: tinta escura sobre fundo claro, que é o que a família de heros
                da casa usa. NÃO é `.btn-primary` — o degradê da casa com tinta branca
                não passa no piso na ponta clara (medido na SIS-292). O número desta
                pílula está na sonda desta issue. */}
            <p data-reveal="fade-up" style={cascata(2)}>
              <button
                type="button"
                onClick={() => setContatoAberto(true)}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#C4A0FB] px-6 py-3 text-sm font-semibold text-[#1B1036] transition-colors hover:bg-[#DCC6FD]"
              >
                Fale com um especialista
                <ArrowRight className="h-4 w-4" strokeWidth={2.2} aria-hidden />
              </button>
            </p>
          </div>
        </RevealScope>
      </section>

      {/* ── 2. ECOSSISTEMA ORIENTADO A SERVIÇOS (a faixa de campanha/lead) ────
          Texto + foto, que é o arranjo da «Campanha» do Match AI. O título é fragmento
          verbatim do primeiro parágrafo, que a faixa publica INTEIRO logo abaixo — então
          nada se perde no corte e nenhuma escrita nova entra.
          `.section-light` pinta título e texto de navy sozinho: é por isso que nada aqui
          leva `on-dark`.
          `overflow-clip` e não `hidden`: a malha de 96px de `.section-light::before` é
          `background-attachment: fixed` pela SIS-76, e `hidden` cria contêiner de
          rolagem, que é o que desancora o `fixed`. `clip` recorta o mesmo sem criar
          contêiner. */}
      {paragrafos.length > 0 && (
        <section
          className="section-light section-light-blue section-py relative overflow-clip"
          aria-labelledby={idDoBloco(TITULO_ECOSSISTEMA)}
        >
          <AcentosClaros />
          <MalhaDeEndpoints className="connectapi-malha--claro" />
          <RevealScope
            className="container-lp relative z-10"
            limiar={LIMIAR_REVEAL}
            margem={MARGEM_REVEAL}
            data-reveal-nome="connectapi-ecossistema"
          >
            <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
              <div>
                <h2
                  data-reveal="fade-up"
                  id={idDoBloco(TITULO_ECOSSISTEMA)}
                  className="font-display text-section font-bold text-ink"
                >
                  {TITULO_ECOSSISTEMA}
                </h2>
                <p
                  data-reveal="fade-up"
                  style={cascata(1)}
                  className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted"
                >
                  {paragrafos[0]}
                </p>
                {/* O TERCEIRO PARÁGRAFO publicado INTEIRO aqui, e é onde ele fecha a
                    faixa: os fragmentos dele que o trilho usa são leitura rápida da
                    frase, não substituição dela. */}
                {paragrafos[2] && (
                  <p
                    data-reveal="fade-up"
                    style={cascata(2)}
                    className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-muted"
                  >
                    {paragrafos[2]}
                  </p>
                )}
              </div>
              {/* A FOTO É A CAPA DO CARTÃO da vitrine, e não a do hero: a do hero é
                  panorâmica (1672×941) e num quadro 4/3 entra cortada pelo meio.
                  `VITRINE?.capaCard ?? CAPA` é o mesmo guarda das irmãs — sem entrada no
                  dado a faixa monta com a capa do hero em vez de estourar a rota.
                  Decorativa (`alt=""`) porque o título e o parágrafo ao lado já dizem o
                  que ela ilustra. */}
              <div
                data-reveal="scale-soft"
                style={cascata(3)}
                className="connectapi-midia relative aspect-[4/3] overflow-hidden rounded-3xl border border-[#0079CB]/[18%]"
              >
                <Image
                  src={VITRINE?.capaCard ?? CAPA}
                  alt=""
                  aria-hidden
                  fill
                  sizes="(min-width: 1180px) 500px, 100vw"
                  loading="lazy"
                  className="connectapi-midia-arte object-cover"
                />
              </div>
            </div>
          </RevealScope>
        </section>
      )}

      {/* ── 3. FEITO PARA CADA JORNADA DE DISTRIBUIÇÃO (a ref 1) ─────────────
          Grade de três cartões, um por linha de vida. O TÍTULO e o EYEBROW são da mock
          (declarado no docblock); os NOMES das três linhas são o parêntese do site, e a
          lista é filtrada contra o texto publicado — nenhum cartão afirma jornada que a
          página não ofereça.
          O apoio é o SEGUNDO parágrafo do site, publicado inteiro: é ele que diz o que
          as três jornadas têm em comum («os clientes-usuário se mantêm no centro»), e
          assim a faixa não é só três rótulos soltos.
          O EYEBROW é `<p>` e não cabeçalho: é etiqueta da seção, e um `h3` antes do `h2`
          quebraria a ordem de níveis do documento. */}
      {linhas.length > 0 && (
        <section
          className="section-light section-py relative overflow-clip"
          aria-labelledby={idDoBloco(TITULO_JORNADAS)}
        >
          <AcentosClaros />
          <MalhaDeEndpoints className="connectapi-malha--claro connectapi-malha--baixo" />
          <RevealScope
            className="container-lp relative z-10"
            limiar={LIMIAR_REVEAL}
            margem={MARGEM_REVEAL}
            data-reveal-nome="connectapi-jornadas"
          >
            <p
              data-reveal="fade-up"
              className="text-xs font-semibold tracking-[0.18em] text-[#0060A8] uppercase"
            >
              Soluções para cada realidade
            </p>
            <h2
              data-reveal="fade-up"
              style={cascata(1)}
              id={idDoBloco(TITULO_JORNADAS)}
              className="mt-3 font-display text-section font-bold text-ink"
            >
              {TITULO_JORNADAS}
            </h2>
            {paragrafos[1] && (
              <p
                data-reveal="fade-up"
                style={cascata(2)}
                className="mt-4 max-w-2xl text-lg leading-relaxed text-muted"
              >
                {paragrafos[1]}
              </p>
            )}
            <ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
              {linhas.map((linha, i) => {
                const Icone = ICONES_LINHAS[i] ?? Sparkles;
                return (
                  <li
                    key={linha.nome}
                    data-reveal="fade-up"
                    style={cascata(i + 3)}
                    /* A ANATOMIA VARIADA: a arte é FAIXA 3/2 NO TOPO e o ícone encavala
                       a borda de baixo dela — não o medalhão redondo (Guru), a tira
                       vertical (QA), a faixa 16/9 (Smart Miner) nem a miniatura 28/32
                       (Match AI).
                       `connectapi-cartao` é o laço de flutuação + o realce sob o
                       ponteiro; `connectapi-midia` é o quadro cujo hover move a ARTE
                       (dois nós, porque um só seria dono do `transform` duas vezes — a
                       colisão que a University registra).
                       `bg-white` chapado e não translúcido: o cartão sobe e escala sobre
                       a folha, e com fundo translúcido o vizinho apareceria por baixo no
                       instante da sobreposição. */
                    className="connectapi-cartao relative overflow-hidden rounded-2xl border border-[#0079CB]/[18%] bg-white"
                  >
                    <span
                      aria-hidden
                      className="connectapi-midia relative block aspect-[3/2] overflow-hidden"
                    >
                      {/* PLACEHOLDER DECLARADO (o item da issue: «imagem = capa Connect
                          API até haver artes»). Não existe arte por jornada — o Match AI
                          só ganhou as dele na SIS-292 —, e criar arte nova está fora do
                          escopo desta issue. */}
                      <Image
                        src={VITRINE?.capaCard ?? CAPA}
                        alt=""
                        aria-hidden
                        fill
                        sizes="(min-width: 768px) 360px, 100vw"
                        loading="lazy"
                        className="connectapi-midia-arte object-cover"
                      />
                      <span aria-hidden className="absolute inset-0 bg-[#001A3D]/35" />
                    </span>
                    <span className="relative block px-5 pt-5 pb-6">
                      {/* O ícone ENCAVALA a faixa de arte, que é o que costura a foto ao
                          assunto do cartão em vez de deixar duas peças soltas. Caixa
                          branca chapada porque ele cai metade sobre a foto. */}
                      <span
                        aria-hidden
                        className="absolute -top-5 left-5 flex h-10 w-10 items-center justify-center rounded-xl border border-[#0079CB]/[18%] bg-white"
                      >
                        <Icone className="h-5 w-5 text-[#0079CB]" strokeWidth={1.6} />
                      </span>
                      <h3 className="mt-6 font-display text-base leading-snug text-ink">
                        {linha.nome}
                      </h3>
                    </span>
                  </li>
                );
              })}
            </ul>
          </RevealScope>
        </section>
      )}

      {/* ── 4. DA INTEGRAÇÃO À EXPERIÊNCIA DO CLIENTE (a faixa escura, ref 2) ─
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
      <section
        className="section-py relative overflow-clip bg-[#001A3D]"
        aria-labelledby={idDoBloco(TITULO_TRILHO)}
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
          {/* VÉU QUASE FECHADO NOS TRÊS TERÇOS, e não um gradiente que abre à direita: o
              trilho de quatro passos ocupa a faixa inteira, então há texto branco sobre o
              terço direito também. O leve degradê que sobra existe só para a arte não
              ficar uniformemente apagada. O número é o da irmã SIS-287, herdado porque a
              capa desta rota também traz letreiro desenhado no miolo — o que reprovou
              98,5% lá. O portão que confirma é o desvio de pixel na sonda desta issue. */}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,26,61,0.995)_0%,rgba(0,26,61,0.995)_50%,rgba(0,26,61,0.99)_100%)]" />
        </div>
        {/* A malha e o grafismo ENTRAM DEPOIS da foto e do véu, de propósito: o véu
            apaga a arte quase por inteiro e a malha tem de ficar SOBRE ele, senão a
            grade seria a coisa mais apagada da faixa. O par 0/1 entre irmãos não é
            preferência: `.grade-tecnica` nasce em `z-index: -1`, e como esta seção tem
            fundo chapado o negativo a jogaria para trás dele — `.connectapi-grade`
            reescreve para 0. */}
        <div aria-hidden className="grade-tecnica connectapi-grade" />
        <MalhaDeEndpoints className="connectapi-malha--escuro" />
        <RevealScope
          className="container-lp relative z-10"
          limiar={LIMIAR_REVEAL}
          margem={MARGEM_REVEAL}
          data-reveal-nome="connectapi-trilho"
        >
          <div>
            <h2
              data-reveal="fade-up"
              id={idDoBloco(TITULO_TRILHO)}
              className="font-display text-section font-bold text-white"
            >
              {TITULO_TRILHO}
            </h2>
            {/* O TRILHO DE QUATRO PASSOS. Selo em HEXÁGONO — não o disco liso do Match
                AI, a placa reta do Smart Miner, o anel tracejado do QA nem o losango com
                halo do Guru. O fio é UM nó por par de passos (o último não tem para onde
                apontar) e só a partir de `sm`, onde os quatro estão lado a lado;
                empilhado não há fio nenhum, que é o certo, porque um segmento horizontal
                entre passos empilhados ligaria coisas que não estão em linha.
                `<ol>` porque a ordem É o assunto da faixa: os quatro passos são uma
                sequência, ao contrário da grade de jornadas (três realidades paralelas,
                `<ul>`). */}
            <ol className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {TRILHO.map((passo, i, todos) => {
                const Icone = ICONES_TRILHO[i] ?? Sparkles;
                return (
                  <li
                    key={passo.termo}
                    data-reveal="fade-up"
                    style={cascata(i + 1)}
                    className="relative"
                  >
                    <span
                      aria-hidden
                      className="connectapi-selo relative flex h-14 w-14 items-center justify-center"
                    >
                      {/* O HEXÁGONO é nó IRMÃO do ícone e leva o `clip-path`: recortar o
                          nó que contém o glifo cortaria as pontas do desenho. */}
                      <span aria-hidden className="connectapi-hexagono absolute inset-0" />
                      <Icone className="relative h-6 w-6 text-[#E4D4FE]" strokeWidth={1.6} />
                    </span>
                    {/* O fio some no último de cada linha da grade também não é problema:
                        ele nasce em `left-14 right-[-2rem]` e o vão entre colunas é o
                        mesmo em todas, então o pacote atravessa a calha da grade. */}
                    {i < todos.length - 1 && <FioComPacote />}
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

      {/* ── 5. PRINCIPAIS DIFERENCIAIS (o único `heading` do dado) ───────────
          Título, ordem e textos são do dado; o que este arquivo declara é o desenho. O
          ORDINAL é desenhado porque o dado DIZ `ordered: true` — é o mesmo critério do
          QA, e é por isso que aqui é `<ol>` e a grade de jornadas é `<ul>`.
          A âncora sai de `idDoBloco(heading)`, o mesmo dono que `pageSections.ts` usa —
          e esta rota não tem indicador lateral (um `heading` só), o que está explicado no
          docblock. */}
      {diferenciais?.heading && itens.length > 0 && (
        <section
          className="section-light section-py relative overflow-clip"
          aria-labelledby={idDoBloco(diferenciais.heading)}
        >
          <AcentosClaros />
          <MalhaDeEndpoints className="connectapi-malha--claro" />
          <RevealScope
            className="container-lp relative z-10"
            limiar={LIMIAR_REVEAL}
            margem={MARGEM_REVEAL}
            data-reveal-nome="connectapi-diferenciais"
          >
            <h2
              data-reveal="fade-up"
              id={idDoBloco(diferenciais.heading)}
              className="font-display text-section font-bold text-ink"
            >
              {diferenciais.heading}
            </h2>
            {/* O APOIO é a `description` da vitrine — a única frase desta rota que vem de
                `accelerators.ts`, usada UMA vez, e por isso não há duas aberturas dizendo
                a mesma coisa (o defeito que a SIS-120 removeu do template). */}
            {VITRINE && (
              <p
                data-reveal="fade-up"
                style={cascata(1)}
                className="mt-4 max-w-2xl text-lg leading-relaxed text-muted"
              >
                {VITRINE.description}
              </p>
            )}
            <ol className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
              {itens.map((item, i) => (
                <li
                  key={item.term}
                  data-reveal="fade-up"
                  style={cascata(i + 2)}
                  className="connectapi-cartao relative flex flex-col items-start rounded-2xl border border-[#0079CB]/[18%] bg-white p-5"
                >
                  {/* O ORDINAL numa pastilha, e `aria-hidden`: a marcação já é `<ol>`, e
                      o número lido em voz alta depois do ordinal que o leitor de tela
                      anuncia diria «um um». */}
                  <span
                    aria-hidden
                    className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl border border-[#0079CB]/25 bg-[#0079CB]/10 font-display text-sm font-bold text-[#0a1f44]"
                  >
                    {i + 1}
                  </span>
                  <h3 className="font-display text-base leading-snug text-ink">{item.term}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.text}</p>
                </li>
              ))}
            </ol>
          </RevealScope>
        </section>
      )}

      {/* ── 6. UMA JORNADA, MÚLTIPLAS POSSIBILIDADES (o hub da ref 3) ────────
          Núcleo Connect API no meio, as três linhas de vida à esquerda e as três
          capacidades à direita, com os raios desenhados atrás. O título é da mock
          (declarado no docblock); TODO rótulo é do site.
          As duas colunas são LISTAS DE VERDADE com título cada uma, e os títulos delas
          são fragmentos verbatim do site — «Jornada de Distribuição de Seguros de Vida» e
          «Venda Consultiva e autosserviços». Os raios são SVG decorativo: num telefone
          eles não montam e as duas listas empilham, que é o certo, porque raio horizontal
          entre itens empilhados ligaria coisas que não estão em linha.
          Faixa CLARA, e não escura: duas faixas escuras seguidas (o trilho e esta)
          deixariam a página com o miolo todo navy e a folha só nas pontas. */}
      {linhas.length > 0 && (
        <section
          className="section-light section-light-blue section-py relative overflow-clip"
          aria-labelledby={idDoBloco(TITULO_HUB)}
        >
          <AcentosClaros />
          <RevealScope
            className="container-lp relative z-10"
            limiar={LIMIAR_REVEAL}
            margem={MARGEM_REVEAL}
            data-reveal-nome="connectapi-hub"
          >
            <h2
              data-reveal="fade-up"
              id={idDoBloco(TITULO_HUB)}
              className="font-display text-section font-bold text-ink"
            >
              {TITULO_HUB}
            </h2>
            <div
              data-reveal="fade-up"
              style={cascata(1)}
              className="connectapi-hub relative mt-10 grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-4"
            >
              <RaiosDoHub />
              {/* COLUNA ESQUERDA: as jornadas. */}
              <div className="relative z-10">
                <h3 className="font-display text-sm font-bold text-ink">
                  Jornada de Distribuição de Seguros de Vida
                </h3>
                <ul className="mt-4 grid gap-3">
                  {linhas.map((linha, i) => {
                    const Icone = ICONES_LINHAS[i] ?? Sparkles;
                    return (
                      <li
                        key={linha.nome}
                        className="flex items-center gap-3 rounded-2xl border border-[#0079CB]/[18%] bg-white px-4 py-3 text-sm font-semibold text-[#0a1f44] lg:justify-end lg:text-right"
                      >
                        <Icone
                          className="h-4 w-4 shrink-0 text-[#0079CB] lg:order-2"
                          strokeWidth={1.8}
                          aria-hidden
                        />
                        {linha.nome}
                      </li>
                    );
                  })}
                </ul>
              </div>
              {/* O NÚCLEO. A marca desenhada outra vez, e aqui com `alt=""`: o nome da
                  rota já é o `h1`, e um segundo nome acessível idêntico no meio da página
                  é repetição para leitor de tela. O núcleo é fundo NAVY chapado porque a
                  arte da marca é de tinta clara (medida `rgb(236, 236, 236)`) — sobre a
                  folha ela desapareceria. */}
              <div className="relative z-10 flex justify-center">
                <span className="connectapi-nucleo flex h-32 w-32 items-center justify-center rounded-full bg-[#001A3D] p-6 lg:h-36 lg:w-36">
                  {VITRINE && (
                    <Image
                      src={VITRINE.logo}
                      alt=""
                      aria-hidden
                      width={VITRINE.logoWidth}
                      height={VITRINE.logoHeight}
                      loading="lazy"
                      className="h-auto w-full object-contain"
                    />
                  )}
                </span>
              </div>
              {/* COLUNA DIREITA: as capacidades. */}
              <div className="relative z-10">
                <h3 className="font-display text-sm font-bold text-ink">
                  Venda Consultiva e autosserviços
                </h3>
                <ul className="mt-4 grid gap-3">
                  {CAPACIDADES.map((cap) => (
                    <li
                      key={cap.nome}
                      className="flex items-center gap-3 rounded-2xl border border-[#0079CB]/[18%] bg-white px-4 py-3 text-sm font-semibold text-[#0a1f44]"
                    >
                      <cap.icone
                        className="h-4 w-4 shrink-0 text-[#0079CB]"
                        strokeWidth={1.8}
                        aria-hidden
                      />
                      {cap.nome}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </RevealScope>
        </section>
      )}

      {/* ── 7. CONHEÇA TAMBÉM ────────────────────────────────────────────────
          A mesma peça de fecho das irmãs, e de propósito: ela é a versão desta família
          de páginas do `<nav>` «Outras soluções» do template, com as pílulas (a atual
          como `<span aria-current="page">`, fora da ordem de tabulação) e os seis
          cartões de irmã. Não é copy de ninguém — são o nome e a capa de cada solução,
          vindos de `accelerators.ts`/`ACCELERATOR_PAGES`, e a única frase própria é a
          linha de apoio, que é a mesma nas cinco rotas porque descreve a FAMÍLIA e não o
          produto.
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
          data-reveal-nome="connectapi-conheca"
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
                  className="connectapi-midia group relative block aspect-[16/10] overflow-hidden rounded-xl border border-[#0079CB]/[18%] transition-colors hover:border-[#0079CB]/55"
                >
                  <Image
                    src={a.capaCard}
                    alt=""
                    aria-hidden
                    fill
                    sizes="(min-width: 1180px) 176px, (min-width: 640px) 33vw, 50vw"
                    loading="lazy"
                    className="connectapi-midia-arte object-cover"
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
               (`[class*="text-white"] { color: #0a1f44 }`). O fundo é `#0060A8` e não
               `#0079CB` pelo número medido na SIS-292: branco 0,88 sobre o primário dá
               ~4,2:1, abaixo do piso; sobre o azul de hover da paleta passa com folga. */
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
