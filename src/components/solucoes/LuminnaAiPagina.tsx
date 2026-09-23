'use client';

/**
 * SIS-280 — O CORPO DA `/solucoes/luminna-ai`, na MESMA ARQUITETURA DE SEÇÕES da
 * `/solucoes/match-ai` (`MatchAiPagina`) e com IDENTIDADE PRÓPRIA.
 *
 * É A SÉTIMA E ÚLTIMA: com esta, `CORPOS_PROPRIOS` no `[slug]/page.tsx` passa a ter
 * SETE entradas e o caminho genérico (`page.blocks.map(...)` no template) fica SEM
 * NENHUMA slug de acelerador. O ramo NÃO foi removido — a razão está escrita lá, no
 * bloco que ele mesmo mantém: `AcceleratorPage` é um tipo público, e o dia em que uma
 * solução nova entrar no dado sem cápsula própria é o dia em que ele volta a servir.
 * Apagá-lo trocaria uma página genérica por uma tela de erro.
 *
 * A SLUG MUDOU DE GRAFIA NA MESMA ISSUE: a rota era `/solucoes/lumina-ai` (um n) e é
 * `/solucoes/luminna-ai`. O `id` é a slug — é ele que `accelerators.ts`,
 * `acceleratorPages.ts`, o sitemap e todo `/solucoes/${a.id}` montam —, então a troca
 * é de dado e não deste arquivo; o que este arquivo faz é ser registrado pela chave
 * nova. O endereço velho responde 308 por `next.config.mjs`.
 *
 * ── TODA A ESCRITA VEM DO SITE ────────────────────────────────────────────────
 * Nada de copy das irmãs e nenhum claim novo. As fontes são as já publicadas:
 *   1. `src/data/acceleratorPages.ts` → o `lead`, os TRÊS blocos `kind: 'list'`
 *      («Desafios no desenvolvimento de software», 4 itens; «Benefícios», 7;
 *      «Integração Versátil», `intro` + 4) e o bloco final de DOIS parágrafos.
 *   2. `src/data/accelerators.ts` → a `description` do cartão da vitrine, usada UMA
 *      vez, como apoio do primeiro título.
 *
 * A DIFERENÇA DE DADO EM RELAÇÃO ÀS IRMÃS, e ela muda o trabalho: esta é a slug com
 * MAIS conteúdo estruturado das sete — três listas, e duas delas com `term` + `text`.
 * O Guru tinha cinco parágrafos soltos, o Smart Miner só parágrafos, o QA uma lista.
 * Aqui não há nada a inferir do texto: cada lista já vem com a sua faixa pronta, e é
 * por isso que esta página não tem função de triagem (`ehFala()` do Guru) — inventar
 * uma seria acrescentar mecanismo para um dado que não precisa dele.
 * Os blocos são achados por `heading`, e não por índice: índice é dependência
 * invisível, e um bloco novo no dado reordenaria as faixas em silêncio.
 *
 * ── OS TÍTULOS DE FAIXA QUE O DADO NÃO TEM ────────────────────────────────────
 * Três blocos têm `heading` e o último não tem nenhum; a arquitetura do Match AI tem
 * um título por faixa, logo DUAS faixas precisavam de título (a de campanha e a de
 * fecho) e nenhum podia ser inventado. Os dois são FRAGMENTOS VERBATIM do texto que a
 * própria faixa publica, com só a inicial elevada:
 *   - «Todo o Ciclo de Vida de Desenvolvimento de Software» está no `lead`, que a
 *     faixa 2 publica INTEIRO logo abaixo;
 *   - «Uma revolução no desenvolvimento de software» está no primeiro dos dois
 *     parágrafos que a faixa 6 publica.
 * É a régua de «derivar rótulo, não inventar claim» das quatro irmãs.
 *
 * ── `pageSections` / ÂNCORAS: AQUI TEM INDICADOR ──────────────────────────────
 * `SECOES_DE_ACELERADOR` monta as paradas percorrendo os blocos COM `heading` e
 * devolve `VAZIO` quando sobram menos de três. Esta slug tem TRÊS `heading` →
 * «Início» + três paradas = 4 → a rota TEM indicador lateral. Logo:
 *   - os `id` das três faixas de dado saem de `idDoBloco(heading)`, o mesmo dono que
 *     `pageSections.ts` usa — `desafios-no-desenvolvimento-de-software`, `beneficios`
 *     e `integracao-versatil`;
 *   - `id="topo"` no hero é OBRIGATÓRIO, porque é a âncora de «Início» e ela vinha do
 *     `PageHero`, que esta slug deixa de montar;
 *   - os dois títulos DERIVADOS acima não são `heading` de bloco, então não entram na
 *     lista de paradas — e é o certo: parada tem de existir no dado;
 *   - a slug SAIU de `TOM_MEDIO_DE_ACELERADOR` e entrou em `TOM_CLARO_DE_ACELERADOR`
 *     com DUAS das três paradas. «Benefícios» é a faixa ESCURA aqui e fica sem chave,
 *     que é o contrato daquele par de mapas (escuro = ausência). A linha removida
 *     ficou comentada lá com o motivo, e ela trocou de grafia junto.
 *
 * ── IDENTIDADE PRÓPRIA (variar 1–2 componentes vs as irmãs) ───────────────────
 * O assunto desta solução é ESTEIRA DE DESENVOLVIMENTO — SDLC, DevOps, ferramentas
 * integradas —, e as três peças que divergem desenham isso:
 *   1. O GRAFISMO DE CANTO é `AnelDoCiclo`: órbitas concêntricas que GIRAM, com um
 *      ponto orbitando e marcas de borda — o ciclo de vida que não tem fim. Lá é
 *      circuito (Match AI), esteira de documentos (Smart Miner), malha de casos (QA),
 *      ondas de voz (Guru) e pacotes marchando no fio (Connect API). A mecânica é a
 *      da casa: traço normalizado com `pathLength="1"`, máscara por elemento em vez
 *      de `<defs>`/`id`, porque o componente é montado várias vezes na mesma página.
 *   2. O CARD da grade tem TRILHO DE ETAPA NO PÉ, uma barra que se preenche na base
 *      do cartão — não a tira vertical (QA), a faixa 16/9 no topo (Smart Miner), a
 *      miniatura na lateral (Match AI) nem o medalhão redondo (Guru). É o indicador
 *      de progresso de esteira, que é o vocabulário desta solução.
 *   3. O FIO da faixa escura é VERTICAL, com um pulso que DESCE — todas as irmãs têm
 *      fio horizontal entre passos lado a lado. Aqui os sete benefícios empilham numa
 *      coluna e o que viaja é o commit descendo o pipeline.
 * NÃO ENTRA CARIMBO: não existe cápsula `carimbo-…-luminna-…` em `public/` — as que
 * existem são de `match-ai`, `smart-miner`, `fast` e `connect-api`, e usar qualquer
 * uma publicaria o nome de OUTRO produto no topo desta rota.
 *
 * ── A CAPA: POR QUE ELA NÃO VEM DE `capasSolucoes.ts` ─────────────────────────
 * `CAPAS_DE_ABERTURA` tem SEIS entradas e a ausência desta é DELIBERADA — item 4 da
 * SIS-286, e está escrito no docblock daquele arquivo. Acrescentar entrada aqui
 * traria um `className: 'hero-backdrop--luminna-ai'` que é gancho de CSS sem regra
 * nenhuma do outro lado, e o único leitor do `className` do mapa é o template
 * genérico, que esta slug deixa de usar. Então a arte do hero é declarada LOCALMENTE,
 * a partir de `VITRINE.capaCard` — a mesma derivada WebP que o cartão da vitrine já
 * serve, o que importa porque com `images: { unoptimized: true }` (SIS-154) o
 * `next/image` entrega o arquivo como ele está no disco.
 *
 * ── A COR ────────────────────────────────────────────────────────────────────
 * `#57B7EE` é o `tone` que `accelerators.ts` declara para o Luminna AI (azul claro;
 * o do Guru e do Match são cianos, o do Smart Miner é menta). Ela vale SÓ nas faixas
 * escuras — sobre folha clara ela é textura a 12%, mas como TINTA reprova no piso de
 * contraste (o número que reprovou o ciano do Match AI, 1,03:1, foi medido na SIS-292
 * e a régua é a mesma). Nas faixas claras a tinta de grafismo é o azul institucional
 * `#0079CB`, como nas cinco irmãs.
 *
 * ── O LETREIRO É IMAGEM ───────────────────────────────────────────────────────
 * O `h1` carrega `images/solucoes/luminnadoisnn.png` (2172×724), a arte canônica
 * que `accelerators.ts` também serve nos cartões, achada pelo `id` e não digitada.
 * A imagem traz a grafia LUMINNA com dois n e a tagline; o `alt` é `page.name` —
 * «Luminna AI», também com dois n — e NÃO vazio: `h1` cujo conteúdo inteiro é
 * imagem com `alt=""` é cabeçalho sem nome acessível.
 *
 * ── MOVIMENTO ────────────────────────────────────────────────────────────────
 * `RevealScope` + `data-reveal` + `./reveal-calibre`, que é o mecanismo do Match AI (e
 * não o `variants` de `@/lib/motion` do `FastPagina`): a issue manda espelhar o
 * motion/reveal do Match AI, e a razão de não somar os dois está no docblock dele
 * (dois donos do mesmo `transform`). `esperarRota` SÓ no escopo do hero, pelo contrato
 * da SIS-269. O movimento em laço é todo CSS, no bloco `SIS-280 · luminna` do fim do
 * `globals.css`, com os DOIS canais de movimento reduzido.
 */

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  Coins,
  FileText,
  Gauge,
  GitBranch,
  ListChecks,
  Rocket,
  ScanSearch,
  ShieldCheck,
  Smile,
  Sparkles,
  Target,
  TrendingUp,
  Wrench,
} from 'lucide-react';
import ContactModal from '@/components/ContactModal';
import RevealScope from '@/components/motion/RevealScope';
import { ACCELERATORS } from '@/data/accelerators';
import { ACCELERATOR_PAGES, idDoBloco, type AcceleratorPage } from '@/data/acceleratorPages';
import { LIMIAR_REVEAL, MARGEM_REVEAL } from './reveal-calibre';

/* O cartão da vitrine desta solução: a `description` (apoio do primeiro título), a
   `capaCard` (a arte do hero e dos placeholders) e o LOGO do letreiro. Achado por `id`
   e não digitado — duas cópias do mesmo caminho divergiriam na primeira troca de arte.
   A razão de a capa sair daqui e não de `capasSolucoes.ts` está no docblock. */
const VITRINE = ACCELERATORS.find((a) => a.id === 'luminna-ai');

/* ── OS ÍCONES DOS CARDS DE «DESAFIOS» ─────────────────────────────────────────
   Na ordem dos itens do dado, e cada um é leitura literal do `term` que acompanha:
   curva ascendente (Demanda Crescente), chave inglesa (Débitos Técnicos), escudo
   (Segurança e Conformidade), folha de texto (Documentação Eficiente). São só ícones:
   nenhum texto de card nasce aqui. */
const ICONES_DESAFIOS = [TrendingUp, Wrench, ShieldCheck, FileText];

/* ── OS ÍCONES DOS SETE BENEFÍCIOS ─────────────────────────────────────────────
   Mesma regra, na ordem do dado: selo de aprovação (Qualidade e Confiabilidade),
   medidor (Produtividade), moedas (Retrabalho e Custos), rosto (Satisfação do
   Cliente), alvo (Previsões e Estimativas), foguete (Time to Market), escudo
   (Robustez de Sistemas). */
const ICONES_BENEFICIOS = [BadgeCheck, Gauge, Coins, Smile, Target, Rocket, ShieldCheck];

/* ── OS ÍCONES DAS QUATRO CATEGORIAS DE INTEGRAÇÃO ─────────────────────────────
   Ramificação (Repositórios de código), lupa de varredura (Ferramentas de Análise de
   Código), circuito (Serviços de IA), lista de checagem (Ferramentas de Gestão de
   Projetos). */
const ICONES_INTEGRACAO = [GitBranch, ScanSearch, BrainCircuit, ListChecks];

/* ── AS MARCAS DE CADA CATEGORIA DE INTEGRAÇÃO (SIS-280 item 3) ────────────────
   A mock `public/images/integracao.png` mostra, em cada um dos quatro cartões, uma
   fileira de PÍLULAS BRANCAS com o logotipo de cada ferramenta. A issue amarra a
   origem: «logos SÓ de `public/images/solucoes/luminna/`». Então esta tabela é o
   inventário daquela pasta, distribuído pelas quatro categorias do dado — nenhum
   caminho vem de fora dela e nenhuma arte foi criada.
   AS DUAS LACUNAS DECLARADAS, e elas são da própria issue: a mock exibe GITHUB (no
   cartão de repositórios) e OPENAI (no de serviços de IA), e a pasta NÃO tem esses
   dois arquivos. A issue manda reportar, não inventar — então as duas pílulas
   simplesmente não existem aqui, e a falta está medida no comentário da issue. Não
   foi usado desenho parecido no lugar: pílula com o logo errado publica marca de
   terceiro que não é aquela.
   OS DOIS EXTRAS QUE FICAM DE FORA: `java` e `python` estão na pasta e a issue diz
   «não forçar». Eles são LINGUAGEM, não ferramenta integrada, e nenhuma das quatro
   categorias do dado é sobre linguagem — entrariam como enfeite numa fileira que a
   mock usa para dizer «com o quê o Luminna conversa».
   `largura` é a largura da pílula para ALTURA FIXA de 20px, calculada da proporção
   INTRÍNSECA de cada PNG (todos 2048px de lado maior). Com `images: { unoptimized:
   true }` (SIS-154) o par `width`/`height` não corta arquivo nenhum: ele reserva a
   caixa e impede que a marca chegue distorcida.
   `rotulo` é o `alt`, e não vazio: a pílula É a informação («integra com o Jira»), e
   logo de terceiro sem nome é conteúdo que não existe para leitor de tela. */
const MARCAS_DE_INTEGRACAO: { rotulo: string; arquivo: string; largura: number }[][] = [
  [
    { rotulo: 'Microsoft Azure', arquivo: 'azure-logo-hd-transparente.png', largura: 62 },
    { rotulo: 'Bitbucket', arquivo: 'bitbucket-logo-hd-transparente.png', largura: 52 },
  ],
  [
    { rotulo: 'OpenText Fortify', arquivo: 'fortify-logo-hd-transparente.png', largura: 51 },
    { rotulo: 'SonarQube', arquivo: 'sonarqube-logo-hd-transparente.png', largura: 71 },
  ],
  [
    { rotulo: 'AWS', arquivo: 'aws-logo-hd-transparente.png', largura: 31 },
    { rotulo: 'GitHub Copilot', arquivo: 'github-copilot-logo-hd-transparente.png', largura: 19 },
    { rotulo: 'Microsoft Copilot', arquivo: 'microsoft-copilot-logo-hd-transparente.png', largura: 21 },
  ],
  [
    { rotulo: 'Azure DevOps', arquivo: 'azure-devops-logo-hd-transparente.png', largura: 24 },
    { rotulo: 'Jira', arquivo: 'jira-logo-hd-transparente.png', largura: 53 },
  ],
];

/* A POSIÇÃO DE CADA CARTÃO NO ARRANJO DA MOCK, de `lg` para cima: dois à esquerda,
   dois à direita, o hub na coluna do meio. Abaixo de `lg` não há nada a posicionar —
   a grade colapsa numa coluna e a ordem do DOM (hub, depois os quatro cartões na
   ordem do dado) é a ordem de leitura.
   É tabela e não `nth-child` no CSS porque quem sabe a ordem é o dado: um quinto item
   entraria sem posição declarada em vez de cair em cima do hub. */
const POSICOES_DE_INTEGRACAO = [
  'lg:col-start-1 lg:row-start-1',
  'lg:col-start-3 lg:row-start-1',
  'lg:col-start-1 lg:row-start-2',
  'lg:col-start-3 lg:row-start-2',
];

/* ── AS LIGAÇÕES CURVAS DO HUB ATÉ OS CARTÕES (o desenho central da mock) ──────
   HTML/CSS e não a imagem da mock: a issue proíbe «`<img>` único da mock» — o que se
   reproduz é o LAYOUT, e num `<img>` nada disso é texto, nada responde a largura e
   nada respeita movimento reduzido.
   `preserveAspectRatio="none"` com `viewBox` de 0–100 nos dois eixos: as coordenadas
   passam a ser PORCENTAGEM da caixa da grade, então a curva encosta no hub e no canto
   interno de cada cartão em qualquer largura, sem recalibrar número por breakpoint. A
   distorção horizontal é desejada — a curva tem de acompanhar a caixa, que é larga.
   POR ISSO os PONTOS das pontas NÃO são `<circle>` daqui: círculo neste `viewBox`
   sairia elipse. Eles são nós posicionados em porcentagem pelo CSS (`.luminna-elo`),
   com as MESMAS coordenadas declaradas abaixo — uma fonte só para os dois.
   O pulso que percorre cada curva é `stroke-dashoffset` com `pathLength="1"`, a
   mecânica de traço da casa; ele para nos dois canais de movimento reduzido. */
const ELOS_DO_HUB = [
  { curva: 'M50 50 C 44 42 40 33 33 27', x: 33, y: 27 },
  { curva: 'M50 50 C 56 42 60 33 67 27', x: 67, y: 27 },
  { curva: 'M50 50 C 44 58 40 67 33 73', x: 33, y: 73 },
  { curva: 'M50 50 C 56 58 60 67 67 73', x: 67, y: 73 },
];

function LigacoesDoHub() {
  return (
    <>
      <svg
        aria-hidden
        className="luminna-elos pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {ELOS_DO_HUB.map((elo) => (
          <g key={elo.curva}>
            <path className="luminna-elo-base" d={elo.curva} />
            <path className="luminna-elo-pulso" pathLength="1" d={elo.curva} />
          </g>
        ))}
      </svg>
      {ELOS_DO_HUB.map((elo) => (
        <span
          key={`${elo.x}-${elo.y}`}
          aria-hidden
          className="luminna-elo-ponta"
          style={{ left: `${elo.x}%`, top: `${elo.y}%` }}
        />
      ))}
    </>
  );
}

/* Os dois títulos de faixa que o dado não tem, como constantes e não literais no JSX:
   cada um é usado DUAS vezes (o `aria-labelledby` da seção e o `id` do `h2`), e duas
   cópias de string a virar âncora é o jeito de as duas divergirem. A procedência de
   cada um está no docblock — os dois são fragmento verbatim do texto da própria
   faixa. */
const TITULO_SDLC = 'Todo o Ciclo de Vida de Desenvolvimento de Software';
const TITULO_REVOLUCAO = 'Uma revolução no desenvolvimento de software';

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
  return <span aria-hidden className="luminna-acentos" />;
}

/* ── O GRAFISMO DE CANTO: O ANEL DO CICLO (a variação de componente nº 1) ──────
   Geometria nova, mecânica da casa: três órbitas concêntricas que GIRAM em velocidades
   e sentidos diferentes, uma delas tracejada, com um ponto percorrendo a do meio e
   marcas curtas na borda externa. É o Ciclo de Vida que o `lead` nomeia — um laço que
   não termina —, e nenhuma irmã tem rotação como peça principal.

   `pathLength="1"` nos arcos normaliza o comprimento, o que deixa caminhos de raios
   diferentes compartilharem UM keyframe de desenho.

   `viewBox` FIXO com `preserveAspectRatio` padrão: são várias caixas de alturas
   diferentes que ainda vão mudar ao mudar copy, e amarrar a arte à altura da seção
   seria um número a recalibrar por faixa.

   SEM `<defs>`/`id`: este componente é montado QUATRO vezes na mesma página, e `id`
   repetido faz todo `url(#…)` apontar para o primeiro. As pontas morrem por
   `mask-image` no CSS, que é por elemento e não por documento.

   O CENTRO é (240, 80) — o canto alto direito do quadro, de onde a máscara faz a arte
   nascer, como nas irmãs. */
function AnelDoCiclo({ className }: { className: string }) {
  return (
    <svg aria-hidden className={`luminna-ciclo ${className}`} viewBox="0 0 320 320">
      {/* AS TRÊS ÓRBITAS. Círculos completos (e não arcos) porque o que se lê aqui é a
          volta inteira; o recorte de quadrante fica com a máscara do CSS, que é quem
          sabe onde a faixa termina. A do meio é a tracejada — o sentido de giro dela é
          invertido no CSS, e é o contraste entre os dois sentidos que faz o desenho
          parecer engrenagem de esteira em vez de um alvo parado. */}
      {[64, 104, 144].map((raio, i) => (
        <circle
          key={raio}
          className={`luminna-orbita luminna-orbita--${i + 1}`}
          pathLength="1"
          cx="240"
          cy="80"
          r={raio}
        />
      ))}
      {/* O PONTO QUE ORBITA. Ele não recebe `transform` próprio: quem gira é um grupo
          centrado no mesmo ponto das órbitas, e o ponto mora deslocado dentro dele —
          é a única forma de o movimento ser translação circular de verdade sem
          calcular seno e cosseno em keyframe. */}
      <g className="luminna-orbita-giro">
        <circle className="luminna-ponto" cx="240" cy="-24" r="7" />
      </g>
      {/* AS MARCAS DE BORDA: oito riscos curtos na órbita externa, as estações do
          ciclo. Ângulos declarados (e não aleatórios) porque o desenho tem de ser o
          mesmo em todo mount; o que se move é a opacidade em fase no CSS. */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angulo, i) => (
        <line
          key={angulo}
          className={`luminna-marca luminna-marca--${(i % 4) + 1}`}
          x1="240"
          y1="-80"
          x2="240"
          y2="-64"
          transform={`rotate(${angulo} 240 80)`}
        />
      ))}
    </svg>
  );
}

/* ── O FIO VERTICAL DA FAIXA ESCURA (a variação de componente nº 3) ────────────
   Todas as irmãs ligam passos lado a lado com fio HORIZONTAL. Aqui os sete benefícios
   empilham numa coluna e o fio é VERTICAL, com um pulso que desce — o commit
   percorrendo a esteira.
   `preserveAspectRatio="none"`: a distorção é desejada, porque o fio tem de ocupar
   exatamente a altura da coluna, qualquer que seja ela. A linha é um segmento reto e o
   pulso é um tracejado curto em marcha (`pathLength="1"`, então a fração vale para
   qualquer altura, sem recalibrar nada). */
function FioVertical() {
  return (
    <svg
      aria-hidden
      className="luminna-fio pointer-events-none absolute left-[1.4rem] top-2 bottom-2 hidden w-1 sm:block"
      viewBox="0 0 4 100"
      preserveAspectRatio="none"
    >
      <line className="luminna-fio-base" x1="2" y1="0" x2="2" y2="100" />
      <line className="luminna-fio-pulso" pathLength="1" x1="2" y1="0" x2="2" y2="100" />
    </svg>
  );
}

export default function LuminnaAiPagina({ page }: { page: AcceleratorPage }) {
  /* Os blocos por `heading`, e não por índice: índice é dependência invisível, e um
     bloco novo no dado reordenaria as seções em silêncio (a nota é a do Match AI). O
     guarda de `kind` é o que deixa o TypeScript saber que `items`/`paragraphs` existem.
     O bloco de fecho é o ÚNICO sem `heading`, e é por essa ausência que ele é achado —
     não por ser o último. Se o site acrescentar parágrafos com título, este `find`
     continua achando o que não tem, que é o que a faixa 6 publica. */
  const desafios = page.blocks.find((b) => b.heading === 'Desafios no desenvolvimento de software');
  const beneficios = page.blocks.find((b) => b.heading === 'Benefícios');
  const integracao = page.blocks.find((b) => b.heading === 'Integração Versátil');
  const fecho = page.blocks.find((b) => b.kind === 'paragraphs' && !b.heading);

  /* O SUBTÍTULO DO HERO é a PRIMEIRA ORAÇÃO do `lead`, cortada na primeira vírgula do
     próprio dado. O `lead` tem ~180 caracteres numa frase só: embaixo de um letreiro a
     cauda («agilizando processos e integrando ferramentas líderes de mercado») viraria
     parágrafo de abertura na dobra, e a dobra é onde a pessoa decide se continua. O
     resto NÃO se perde: a faixa 2 publica o `lead` INTEIRO. Sem vírgula, a cauda é o
     `lead` todo — nenhuma escrita desaparece num dado que mude de forma. */
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
          com quatro paradas — ver o docblock) e o destino do «pular para o conteúdo». */}
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
            (`loading/RouteLoadGate.tsx`) espera a maior imagem acima da dobra.
            A fonte é `VITRINE.capaCard` e não `CAPAS_DE_ABERTURA` — a razão está no
            docblock. `VITRINE &&` porque o `find` é tipado como possivelmente ausente:
            sem a entrada no dado a faixa monta só com o navy chapado do véu, em vez de
            derrubar a rota. */}
        {VITRINE && (
          <div
            aria-hidden
            className="absolute -top-28 right-0 bottom-0 left-0 bg-[#001A3D] shadow-[0_18px_44px_-18px_rgba(0,12,30,0.55)] md:-top-36"
          >
            <Image
              data-route-critical-media=""
              src={VITRINE.capaCard}
              alt=""
              fill
              sizes="100vw"
              priority
              className="object-cover object-[center_42%]"
            />
            {/* DOIS VÉUS, um por eixo, e não um só: a leitura do texto muda de eixo com
                a largura. Abaixo de `lg` o texto cai sobre o miolo da arte e o véu é
                vertical; de `lg` para cima o texto ocupa o terço esquerdo e o véu é
                horizontal, terminando transparente antes da metade direita para não
                apagar o assunto da foto.
                GRADIENTE EXPLÍCITO com `rgba`, e não o trio `from-/via-/to-` com barra
                de opacidade: `from-[#001A3D]/97` NÃO GERA REGRA nesta versão do
                Tailwind, e o resultado medido na SIS-279 foi faixa escura SEM VÉU
                NENHUM. Os degraus são os das irmãs, cujo pixel COMPOSTO sob o texto foi
                medido; o portão desta issue remede contra ESTA capa. */}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,26,61,0.93)_0%,rgba(0,26,61,0.88)_46%,rgba(0,26,61,0.58)_80%,rgba(0,26,61,0.38)_100%)] lg:hidden" />
            <div className="absolute inset-0 hidden lg:block lg:bg-[linear-gradient(90deg,#001A3D_0%,rgba(0,26,61,0.94)_30%,rgba(0,26,61,0.72)_46%,rgba(0,26,61,0.2)_68%,rgba(0,26,61,0)_84%)]" />
          </div>
        )}
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
          data-reveal-nome="luminna-hero"
        >
          <div>
            {/* O LETREIRO É A MARCA DESENHADA, como nas irmãs Match AI, Smart Miner e
                Guru: a arte canônica com dois n e tagline é a mesma que
                `accelerators.ts` serve nos cartões, achada pelo `id` e não digitada.
                `alt={page.name}` («Luminna AI», dois n) e não vazio: este `h1` não tem
                outro conteúdo, e cabeçalho sem nome acessível é cabeçalho que não
                existe para leitor de tela.
                `width`/`height` são as dimensões INTRÍNSECAS do dado: com
                `images: { unoptimized: true }` o que baixa é o arquivo do disco, então o
                par serve para reservar a caixa e não distorcer a marca. `priority`
                porque está na dobra e é o nome da página. */}
            <h1 data-reveal="fade-up" className="luminna-letreiro">
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
                A PÍLULA É O AZUL DO PRODUTO (`tone` do dado, `#57B7EE`) com tinta navy
                `#04212B`: tinta escura sobre fundo claro, que é o que a família de heros
                da casa usa. NÃO é `.btn-primary` — o degradê da casa com tinta branca
                não passa no piso na ponta clara (medido na SIS-292). O número desta
                pílula está na sonda desta issue. */}
            <p data-reveal="fade-up" style={cascata(2)}>
              <button
                type="button"
                onClick={() => setContatoAberto(true)}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#57B7EE] px-6 py-3 text-sm font-semibold text-[#04212B] transition-colors hover:bg-[#8FD2F7]"
              >
                Fale com um especialista
                <ArrowRight className="h-4 w-4" strokeWidth={2.2} aria-hidden />
              </button>
            </p>
          </div>
          {/* ── A FRASE MANUSCRITA DO HERO (SIS-280 item 4, `docs/fonte2.md`) ──
              TEXTO HTML, não pixel: a especificação abre exigindo que a frase seja
              «editável» e que NÃO esteja embutida na arte — então ela é um `<p>` de
              verdade, indexável, selecionável e traduzível, e não uma camada do PNG.
              AS QUATRO LINHAS SÃO QUATRO NÓS, e não uma frase com `max-width` deixando
              o navegador quebrar: a especificação pede EXATAMENTE quatro linhas
              («Grandes / ideias / constroem / amanhã.»), e quebra por largura muda com
              a fonte, com o zoom e com a tradução. Cada `span` é `display: block` no
              CSS. Não entram `<br>`: a frase continua uma frase só para leitor de tela,
              que ignora a caixa de bloco e lê a sequência inteira.
              O TRAÇO CIANO é SVG e não `border-bottom`, por dois motivos: a
              especificação pede um risco LEVEMENTE INCLINADO (borda é sempre
              horizontal) e DESENHADO DA ESQUERDA PARA A DIREITA, que é
              `stroke-dashoffset` — o mecanismo da casa, com `pathLength="1"` para o
              comprimento não depender da geometria. `aria-hidden` porque é grafismo.
              POSIÇÃO: em fluxo normal abaixo do botão até `lg`, e absoluta sobre a
              metade direita — a área clara/envidraçada da arte — de `lg` para cima,
              onde o texto ocupa só o terço esquerdo. Quem decide isso é o CSS, não um
              segundo nó condicional: duas cópias da mesma frase seriam duas leituras
              para leitor de tela e dois lugares para a escrita divergir.
              A ENTRADA é `data-reveal="fade-up"` — o mecanismo de reveal da casa, que
              já respeita movimento reduzido — e a cascata a põe DEPOIS do botão. */}
          <p data-reveal="fade-up" style={cascata(3)} className="luminna-frase">
            <span className="luminna-frase-linha">Grandes</span>
            <span className="luminna-frase-linha">ideias</span>
            <span className="luminna-frase-linha">constroem</span>
            <span className="luminna-frase-linha">amanhã.</span>
            <svg aria-hidden className="luminna-frase-traco" viewBox="0 0 45 8">
              <line className="luminna-frase-risco" pathLength="1" x1="1.5" y1="6.4" x2="43.5" y2="1.6" />
            </svg>
          </p>
        </RevealScope>
      </section>

      {/* ── 2. TODO O CICLO DE VIDA… (a «faixa de campanha/lead») ─────────────
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
        aria-labelledby={idDoBloco(TITULO_SDLC)}
      >
        <AcentosClaros />
        <AnelDoCiclo className="luminna-ciclo--claro" />
        <RevealScope
          className="container-lp relative z-10"
          limiar={LIMIAR_REVEAL}
          margem={MARGEM_REVEAL}
          data-reveal-nome="luminna-sdlc"
        >
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
            <div>
              <h2
                data-reveal="fade-up"
                id={idDoBloco(TITULO_SDLC)}
                className="font-display text-section font-bold text-ink"
              >
                {TITULO_SDLC}
              </h2>
              <p
                data-reveal="fade-up"
                style={cascata(1)}
                className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted"
              >
                {page.lead}
              </p>
            </div>
            {/* A FOTO É A CAPA DO CARTÃO da vitrine — a mesma do hero, porque esta slug
                não tem uma segunda arte, e é justamente por isso que aqui ela entra num
                quadro 4/3 com recorte diferente em vez de repetir o panorama.
                Decorativa (`alt=""`) porque o título e o parágrafo ao lado já dizem o
                que ela ilustra. */}
            {VITRINE && (
              <div
                data-reveal="scale-soft"
                style={cascata(2)}
                className="luminna-midia relative aspect-[4/3] overflow-hidden rounded-3xl border border-[#0079CB]/18"
              >
                <Image
                  src={VITRINE.capaCard}
                  alt=""
                  aria-hidden
                  fill
                  sizes="(min-width: 1180px) 500px, 100vw"
                  loading="lazy"
                  className="luminna-midia-arte object-cover"
                />
              </div>
            )}
          </div>
        </RevealScope>
      </section>

      {/* ── 3. DESAFIOS NO DESENVOLVIMENTO DE SOFTWARE (a grade de cards) ─────
          Título, ordem e textos são do dado; o que este arquivo declara são os ícones.
          `<ul>` e não `<ol>`: o bloco não diz `ordered` — os quatro desafios são
          simultâneos, não uma sequência (foi o QA, com `ordered: true` no dado, que
          ganhou ordinal desenhado).
          Os quatro itens têm `term` E `text`, e os dois entram: o `term` é o `h3` do
          card e o `text` é a pergunta que o site faz. Publicar só um dos dois deixaria
          de fora escrita já publicada.
          A âncora sai de `idDoBloco(heading)` e É a primeira parada de conteúdo do
          indicador lateral (`desafios-no-desenvolvimento-de-software`); o rótulo dela
          no indicador é o `navLabel: 'Desafios'` que o dado já declara. */}
      {desafios?.kind === 'list' && desafios.heading && (
        <section
          className="section-light section-py relative overflow-clip"
          aria-labelledby={idDoBloco(desafios.heading)}
        >
          <AcentosClaros />
          <AnelDoCiclo className="luminna-ciclo--claro luminna-ciclo--baixo" />
          <RevealScope
            className="container-lp relative z-10"
            limiar={LIMIAR_REVEAL}
            margem={MARGEM_REVEAL}
            data-reveal-nome="luminna-desafios"
          >
            <h2
              data-reveal="fade-up"
              id={idDoBloco(desafios.heading)}
              className="font-display text-section font-bold text-ink"
            >
              {desafios.heading}
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
            <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {desafios.items.map((item, i) => {
                const Icone = ICONES_DESAFIOS[i] ?? Sparkles;
                return (
                  <li
                    key={item.term ?? item.text}
                    data-reveal="fade-up"
                    style={cascata(i + 2)}
                    /* A ANATOMIA VARIADA (variação nº 2): o cartão tem TRILHO DE ETAPA
                       NO PÉ — uma barra que se preenche na base — e o ícone num disco
                       com arco girando. Não é a tira vertical (QA), a faixa 16/9 no topo
                       (Smart Miner), a miniatura 28/32 na lateral (Match AI) nem o
                       medalhão redondo (Guru). Trilho porque o vocabulário desta solução
                       é esteira: o indicador de progresso é o desenho nativo do assunto.
                       `pb-7` abre o espaço do trilho, que é `::after` do próprio cartão.
                       `luminna-cartao` é o laço de flutuação + o realce sob o ponteiro.
                       `bg-white` chapado e não translúcido: o cartão sobe e escala sobre
                       a folha, e com fundo translúcido o vizinho apareceria por baixo no
                       instante da sobreposição. */
                    className="luminna-cartao relative flex flex-col items-start overflow-hidden rounded-2xl border border-[#0079CB]/18 bg-white p-5 pb-7"
                  >
                    <span aria-hidden className="luminna-selo relative mb-4 block h-12 w-12">
                      {/* O ARCO é nó IRMÃO do ícone e é ele que recebe a rotação: girar
                          o nó que contém o glifo deixaria o desenho tombando junto. */}
                      <span aria-hidden className="luminna-arco absolute inset-0" />
                      <span className="absolute inset-0 flex items-center justify-center">
                        <Icone className="h-5 w-5 text-[#0079CB]" strokeWidth={1.6} />
                      </span>
                    </span>
                    <h3 className="font-display text-base leading-snug text-ink">{item.term}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.text}</p>
                  </li>
                );
              })}
            </ul>
          </RevealScope>
        </section>
      )}

      {/* ── 4. BENEFÍCIOS (a faixa escura, com o fio vertical) ────────────────
          O `bg-[#001A3D]` é DECLARADO e não herdado, e isso está medido nas irmãs: o
          `body` deste site é `#1273bc` (azul MÉDIO), e sem fundo próprio as tintas
          brancas medem ~4,1:1 e ~3,2:1 contra ele, reprovadas no piso de 4,5. Com o
          navy profundo chapado o mesmo texto passa com folga.
          A CAPA ENTRA COMO FUNDO sob um véu e o chapado NÃO sai: ele é o piso de
          contraste para o caso de a arte não carregar, e é o véu que garante que o
          número medido não dependa de qual pedaço da foto caiu atrás de qual item.
          SEM `z-index` negativo na camada da arte — foi o defeito medido no Match AI: a
          seção não cria contexto de empilhamento por `position: relative` sozinha, e um
          filho negativo desce para trás do `background` da PRÓPRIA seção, que aqui é
          chapado; a imagem pintava embaixo do fundo. A ordem de documento resolve.
          ESTA É A FAIXA QUE SAIU DE `TOM_MEDIO_DE_ACELERADOR`: a parada `beneficios`
          era o azul médio do template genérico e hoje é escura, e escuro é ausência de
          chave nos dois mapas de tom. */}
      {beneficios?.kind === 'list' && beneficios.heading && (
        <section
          className="section-py relative overflow-clip bg-[#001A3D]"
          aria-labelledby={idDoBloco(beneficios.heading)}
        >
          {VITRINE && (
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <Image
                src={VITRINE.capaCard}
                alt=""
                fill
                sizes="100vw"
                loading="lazy"
                className="object-cover object-[center_42%]"
              />
              {/* VÉU QUASE FECHADO NOS TRÊS TERÇOS, e não um gradiente que abre à
                  direita: a coluna de benefícios e o fio ocupam a faixa inteira, então
                  há texto branco sobre o terço direito também. O leve degradê que sobra
                  existe só para a arte não ficar uniformemente apagada.
                  O NÚMERO É O DAS IRMÃS SIS-287/SIS-280, e herdá-lo é decisão medida e
                  não cópia: lá ele subiu duas vezes, cada uma contra uma captura, porque
                  a capa tinha placa de nome desenhada no miolo que se lia como fantasma
                  atrás do texto a 98,5%. A capa desta rota também traz letreiro
                  desenhado, então o piso de partida é o que já sobreviveu àquela prova —
                  e o portão que confirma é o desvio de pixel na janela do letreiro, na
                  sonda desta issue, não a minha leitura da captura. */}
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,26,61,0.995)_0%,rgba(0,26,61,0.995)_50%,rgba(0,26,61,0.99)_100%)]" />
            </div>
          )}
          {/* A malha e o grafismo ENTRAM DEPOIS da foto e do véu, de propósito: o véu
              apaga a arte quase por inteiro e a malha tem de ficar SOBRE ele, senão a
              grade seria a coisa mais apagada da faixa. O par 0/1 entre irmãos não é
              preferência: `.grade-tecnica` nasce em `z-index: -1`, e como esta seção tem
              fundo chapado o negativo a jogaria para trás dele — `.luminna-grade`
              reescreve para 0. */}
          <div aria-hidden className="grade-tecnica luminna-grade" />
          <AnelDoCiclo className="luminna-ciclo--escuro" />
          <RevealScope
            className="container-lp relative z-10"
            limiar={LIMIAR_REVEAL}
            margem={MARGEM_REVEAL}
            data-reveal-nome="luminna-beneficios"
          >
            <h2
              data-reveal="fade-up"
              id={idDoBloco(beneficios.heading)}
              className="font-display text-section font-bold text-white"
            >
              {beneficios.heading}
            </h2>
            {/* A COLUNA DE SETE, e o fio vertical ao lado dela. Uma coluna e não grade
                de três: sete itens numa grade de três deixa uma fileira órfã de um, e é
                a coluna que dá sentido ao fio descendo. De `sm` para cima o conteúdo
                recua (`sm:pl-16`) para abrir a calha do fio; empilhado abaixo de `sm` o
                fio não monta — é o mesmo critério das irmãs (fio só onde os passos
                estão na direção que ele liga). */}
            <div className="relative mt-8">
              <FioVertical />
              <ul className="space-y-4 sm:pl-16">
                {beneficios.items.map((item, i) => {
                  const Icone = ICONES_BENEFICIOS[i] ?? Sparkles;
                  return (
                    <li
                      key={item.term ?? item.text}
                      data-reveal="fade-up"
                      style={cascata(i + 1)}
                      className="luminna-etapa relative flex items-start gap-4 rounded-2xl border border-[#57B7EE]/25 bg-[#001A3D]/70 px-5 py-4"
                    >
                      {/* O DISCO do item encosta no fio: é ele que faz a leitura «cada
                          benefício é uma estação da esteira» em vez de «lista com
                          bolinhas». Caixa chapada porque cai sobre a arte velada. */}
                      <span
                        aria-hidden
                        className="luminna-no flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#57B7EE]/40 bg-[#001A3D]"
                      >
                        <Icone className="h-5 w-5 text-[#B6DFF9]" strokeWidth={1.6} />
                      </span>
                      <span className="block">
                        <h3 className="font-display text-base leading-snug text-white">
                          {item.term}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-white/80">{item.text}</p>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </RevealScope>
        </section>
      )}

      {/* ── 5. INTEGRAÇÃO VERSÁTIL — O ARRANJO DA MOCK (SIS-280 item 3) ───────
          O LAYOUT é o de `public/images/integracao.png`: um HUB redondo escuro no
          centro, QUATRO cartões ao redor (dois à esquerda, dois à direita) e curvas
          cianas ligando o hub a cada um, com ponto na ponta. Cada cartão traz o ícone
          grande num disco pálido, o nome da categoria e a fileira de pílulas brancas
          com os logotipos.
          O QUE É HTML/CSS E POR QUÊ: a issue proíbe publicar a mock como `<img>`
          único. Então nada aqui é a imagem — as curvas são SVG com `viewBox` em
          porcentagem, as pílulas são `next/image` dos PNG da pasta, e o hub é caixa
          com anel girando. É o que faz o bloco responder a largura, ser texto de
          verdade e parar nos dois canais de movimento reduzido.
          A ESCRITA NÃO VEM DA MOCK, e esta é a divergência declarada: a mock tem
          eyebrow («ECOSSISTEMA»), uma linha de apoio própria, o selo «CONECTA IDEIAS A
          RESULTADOS» no hub e uma descrição de duas linhas por cartão — NADA disso
          existe em `acceleratorPages.ts`. Copiar seria escrever claim de marketing
          novo, que é justamente o que as sete páginas não fazem. Então o título e o
          apoio são o `heading` e o `intro` do dado, o nome de cada cartão é o
          `items[].text` do dado, e o hub diz `page.name` — a marca, que é o que a mock
          escreve lá em cima do selo. A ausência está relatada no comentário da issue.
          Título e âncora vêm do dado (`integracao-versatil`), e esta é a TERCEIRA
          parada do indicador lateral. */}
      {integracao?.kind === 'list' && integracao.heading && (
        <section
          className="section-light section-py relative overflow-clip"
          aria-labelledby={idDoBloco(integracao.heading)}
        >
          <AcentosClaros />
          <AnelDoCiclo className="luminna-ciclo--claro" />
          <RevealScope
            className="container-lp relative z-10"
            limiar={LIMIAR_REVEAL}
            margem={MARGEM_REVEAL}
            data-reveal-nome="luminna-integracao"
          >
            <h2
              data-reveal="fade-up"
              id={idDoBloco(integracao.heading)}
              className="font-display text-section font-bold text-ink"
            >
              {integracao.heading}
            </h2>
            {integracao.intro && (
              <p
                data-reveal="fade-up"
                style={cascata(1)}
                className="mt-6 max-w-3xl text-lg leading-relaxed text-ink-muted"
              >
                {integracao.intro}
              </p>
            )}
            {/* A GRADE DO ARRANJO. De `lg` para cima são três colunas (cartões,
                hub, cartões) e duas linhas; abaixo disso é uma coluna só, e aí as
                curvas e as pontas desaparecem — linha ligando caixas empilhadas não
                diz nada e viraria risco atravessado no meio do texto.
                `relative` porque as curvas e as pontas são absolutas sobre ela. */}
            <div className="luminna-ecossistema relative mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center lg:gap-x-12 lg:gap-y-10">
              <LigacoesDoHub />
              {/* O HUB. PRIMEIRO no DOM de propósito: empilhado no telefone ele é o
                  título visual do arranjo, e no `lg` a coluna do meio o põe no centro
                  sem mexer na ordem de leitura. Não é cabeçalho (`h3`) — é a marca
                  repetida em forma de selo, e o cabeçalho da faixa é o `h2` acima.
                  `aria-hidden` NO ÍCONE só; o nome fica legível. */}
              <div
                data-reveal="fade-up"
                style={cascata(2)}
                className="luminna-hub relative z-10 mx-auto flex h-40 w-40 flex-col items-center justify-center gap-1 rounded-full bg-[#001A3D] text-center lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:h-44 lg:w-44"
              >
                <span aria-hidden className="luminna-hub-anel absolute inset-0" />
                <Sparkles className="h-6 w-6 text-[#57B7EE]" strokeWidth={1.6} aria-hidden />
                <span className="font-display px-4 text-base leading-snug font-semibold text-white">
                  {page.name}
                </span>
              </div>
              {integracao.items.map((item, i) => {
                const Icone = ICONES_INTEGRACAO[i] ?? Sparkles;
                const marcas = MARCAS_DE_INTEGRACAO[i] ?? [];
                return (
                  <div
                    key={item.text}
                    data-reveal="fade-up"
                    style={cascata(i + 3)}
                    className={`luminna-cartao relative z-10 overflow-hidden rounded-2xl border border-[#0079CB]/18 bg-white px-5 py-5 pb-7 ${POSICOES_DE_INTEGRACAO[i] ?? ''}`}
                  >
                    <span aria-hidden className="luminna-selo relative block h-12 w-12">
                      <span aria-hidden className="luminna-arco absolute inset-0" />
                      <span className="absolute inset-0 flex items-center justify-center">
                        <Icone className="h-6 w-6 text-[#0079CB]" strokeWidth={1.5} />
                      </span>
                    </span>
                    <p className="font-display mt-4 text-base leading-snug font-semibold text-ink">
                      {item.text}
                    </p>
                    {/* AS PÍLULAS. Lista de verdade porque são vários itens de mesma
                        natureza, e o nome de cada marca sai no `alt`. A pílula é branca
                        com borda finíssima, como na mock — o cartão já é branco, então
                        quem separa é a borda e não o fundo. */}
                    {marcas.length > 0 && (
                      <ul className="mt-4 flex flex-wrap items-center gap-2">
                        {marcas.map((marca) => (
                          <li
                            key={marca.arquivo}
                            className="flex h-8 items-center rounded-lg border border-[#001A3D]/10 bg-white px-2.5 shadow-[0_1px_2px_rgba(0,26,61,0.06)]"
                          >
                            <Image
                              src={`/images/solucoes/luminna/${marca.arquivo}`}
                              alt={marca.rotulo}
                              width={marca.largura}
                              height={20}
                              className="h-5 w-auto"
                            />
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </RevealScope>
        </section>
      )}

      {/* ── 6. UMA REVOLUÇÃO NO DESENVOLVIMENTO DE SOFTWARE (o fecho escuro) ──
          Os DOIS parágrafos do bloco sem `heading`, publicados inteiros, sob um título
          que é fragmento verbatim do primeiro deles. Faixa escura outra vez pelo mesmo
          contrato de contraste da faixa 4 — e sem capa de fundo aqui: duas faixas
          escuras com a MESMA arte velada na mesma rota é a arte repetida a 0,5% de
          visibilidade, custo de download sem leitura nenhuma. O que esta faixa tem é a
          malha e o anel.
          Esta faixa NÃO é parada do indicador: o título é derivado, não `heading` de
          bloco — e é o certo, parada tem de existir no dado. */}
      {fecho?.kind === 'paragraphs' && (
        <section
          className="section-py relative overflow-clip bg-[#001A3D]"
          aria-labelledby={idDoBloco(TITULO_REVOLUCAO)}
        >
          <div aria-hidden className="grade-tecnica luminna-grade" />
          <AnelDoCiclo className="luminna-ciclo--escuro luminna-ciclo--baixo" />
          <RevealScope
            className="container-lp relative z-10"
            limiar={LIMIAR_REVEAL}
            margem={MARGEM_REVEAL}
            data-reveal-nome="luminna-fecho"
          >
            <h2
              data-reveal="fade-up"
              id={idDoBloco(TITULO_REVOLUCAO)}
              className="font-display text-section font-bold text-white"
            >
              {TITULO_REVOLUCAO}
            </h2>
            <div className="mt-6 max-w-3xl space-y-4">
              {fecho.paragraphs.map((p, i) => (
                <p
                  key={p.slice(0, 40)}
                  data-reveal="fade-up"
                  style={cascata(i + 1)}
                  className="text-lg leading-relaxed text-white/85"
                >
                  {p}
                </p>
              ))}
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
          linha de apoio, que é a mesma nas cinco rotas porque descreve a FAMÍLIA e não
          o produto.
          Os `href` saem de `${p.id}`/`${a.id}`, então a slug nova propaga sozinha aqui e
          nas cinco irmãs — é exatamente por isso que a troca de grafia foi feita no dado
          e não em links escritos à mão.
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
          data-reveal-nome="luminna-conheca"
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
                  className="luminna-midia group relative block aspect-[16/10] overflow-hidden rounded-xl border border-[#0079CB]/18 transition-colors hover:border-[#0079CB]/55"
                >
                  <Image
                    src={a.capaCard}
                    alt=""
                    aria-hidden
                    fill
                    sizes="(min-width: 1180px) 176px, (min-width: 640px) 33vw, 50vw"
                    loading="lazy"
                    className="luminna-midia-arte object-cover"
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
