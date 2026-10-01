import Image from 'next/image';
import {
  TRAJECTORY_ANO_INICIAL,
  TRAJECTORY_CAPABILITIES,
  type TrajectoryCompetenciaAcumulada,
} from '@/data/trajectory';

/**
 * SIS-177 — as duas peças que o MODO ESTÁTICO (≤900px) não tinha.
 *
 * A fila vertical do mobile mostrava 24 cards navy empilhados e mais nada: nem a
 * bolinha que acompanha a rolagem, nem os ícones de competência que no palco ficam
 * pendurados no traço. Os dois existiam só em `[data-modo='palco']`, que o JavaScript
 * só liga a partir de 901px — ver a nota longa em `TrajectoryScrollytelling`.
 *
 * ⚠️ ESTAS PEÇAS NÃO SÃO UMA SEGUNDA VERSÃO DAS DO PALCO, E A DISTINÇÃO É O MOTIVO DE
 * SEREM COMPONENTES PRÓPRIOS. `TimelineWaypoints` e `TimelineTraveler` são
 * posicionados por coordenada absoluta dentro do `<svg>` 1:1 da trilha
 * (`--selo-x`/`--selo-y`, `--viajante-x`/`--viajante-y`), escritas por quadro a partir
 * da geometria horizontal do palco. No estático não existe esse `<svg>`: a linha é uma
 * `border-inline-start` da coluna. Reaproveitar aqueles nós obrigaria a folha a anular
 * `position: absolute` e a redefinir o eixo inteiro — foi assim que nasceram os
 * defeitos de `!important` que o arquivo documenta em três lugares. Em fluxo normal,
 * dentro da própria coluna, não há nada a desarmar.
 *
 * Por isso as duas são escondidas no palco por uma regra só, e o desktop fica
 * literalmente inalterado (critério 3 da issue).
 */

/* ⚠️ `vaoDepoisDoIndice` SAIU — 01/10, a captura mostrou o motivo e o pedido confirmou.
   Ela indexava os vãos por `Math.floor(selo.p)`, e os `p` dos selos são 0,5 · 3,5 · 9,5 ·
   13,5 · 14,5: ícone em CINCO vãos dos 23. Sompo é o índice 12 e AIG o 13, então os dois
   vãos da captura estavam vazios por construção — não por defeito de folha.

   Agora quem alimenta o vão é `competenciasAcumuladas`, a mesma função que preenche a
   lista dentro do card ativo: todo vão tem ícone, e o conjunto cresce ao longo da fila. É
   a leitura que o pedido descreve — «coloque os icones no meio assim tambem».

function vaoDepoisDoIndice(i: number) { return VAO_POR_INDICE.get(i); }
*/

/* As artes que JÁ TRAZEM FUNDO PRÓPRIO não entram na pastilha branca.

   `/iconerobo.png` é um medalhão redondo com anel ciano e fundo opaco; dentro do quadrado
   branco de 52px ele fica com duas molduras concêntricas. As `*fino.png` são o oposto —
   traço escuro sem fundo, feito para papel — e sem a pastilha desapareceriam sobre
   qualquer área escura.

   ⚠️ A DISTINÇÃO É DECLARADA, NÃO ADIVINHADA PELO NOME DO ARQUIVO. A lista de arte de
   competência é `TRAJECTORY_CAPABILITIES`; o que não está nela é arte avulsa, que o dado
   trouxe pronta. Testar por `endsWith('fino.png')` funcionaria hoje e quebraria no dia em
   que uma competência ganhasse arquivo com outro nome. */
const ARTE_DE_COMPETENCIA = new Set(TRAJECTORY_CAPABILITIES.map((c) => c.icon));

/**
 * Os ícones no vão entre dois cards da coluna — as competências acumuladas até ali.
 *
 * ⚠️ `aria-hidden`, como os selos do palco, e pelo mesmo motivo que vale ainda mais
 * aqui: as quatro competências estão escritas com título e descrição no painel
 * `.trajetoria-competencias` da mesma seção, que no estático está inteiro visível. Em
 * texto real estas artes seriam a segunda cópia do mesmo conteúdo, lida no meio da
 * fila de clientes — e agora em TODOS os 23 vãos, o que seria 23 repetições para o
 * leitor de tela. O `title` fica para quem aponta com o cursor.
 */
export function TimelineGapIcons({
  competencias,
}: {
  competencias: readonly TrajectoryCompetenciaAcumulada[];
}) {
  return (
    <div className="trajetoria-vao" aria-hidden>
      <span className="trajetoria-vao-no" />
      <span className="trajetoria-vao-icones">
        {competencias.map((ic) => (
          <span
            key={ic.src}
            className="trajetoria-vao-icone"
            data-arte={ARTE_DE_COMPETENCIA.has(ic.src) ? 'traco' : 'propria'}
            title={ic.titulo}
          >
            <Image
              src={ic.src}
              alt=""
              /* Intrínsecos generosos só reservam a caixa; o desenho é do CSS. Com
                 `images: { unoptimized: true }` (SIS-154) o arquivo do disco é servido
                 cru, então estes dois números não mudam um byte do que baixa. */
              width={160}
              height={160}
              loading="lazy"
              decoding="async"
            />
          </span>
        ))}
      </span>
    </div>
  );
}

/**
 * O MEDALHÃO QUE ACOMPANHA A ROLAGEM pela linha da coluna.
 *
 * Desce pela linha da coluna em `top: calc(var(--p-base) * 100%)`, onde `--p-base` é
 * escrita por quadro pelo mesmo laço que o palco usa — uma atribuição de string, sem
 * re-render. É o papel que `TimelineTraveler` faz no palco, no eixo que o estático tem.
 *
 * ⚠️ ELE NÃO CARREGA RÓTULO DE TEMPO, e a razão de fundo é o dado — não só o pedido de
 * 01/10 que tirou a pílula. `timeline.ts` não guarda ano por evento: o campo é
 * `generation` («1ª geração», «Implantação», …), e `MilestoneCardData.year` existe no
 * tipo mas nasce `undefined` em todos os 24 marcos — está escrito em `marcoDoEvento`, «a
 * geração é a única marca de tempo que os dados têm». Interpolar 1988→2026 pelos 24
 * índices daria um ano por card, mas seria número inventado em material que vai para
 * cliente. Ou seja: a pílula que saiu nunca pôde dizer ano, e nenhum dos dois modos diz.
 *
 * O ANO QUE A ISSUE PEDE CONTINUA EM CENA, e é o 1988 do início: no estático é
 * `TimelineColumnStart`, logo abaixo neste arquivo; no palco é `TimelineOrigin`. Há sempre
 * um 1988 só na tela — a pílula `.trajetoria-abertura-ano` saiu em 01/10, ver a nota lá.
 */
export function TimelineColumnMarker({ rotulo }: { rotulo: string | null }) {
  return (
    <div className="trajetoria-andador" data-ativo={rotulo ? 'sim' : 'nao'} aria-hidden>
      {/* ⚠️ A ARTE É A MESMA DO MARCADOR DO PALCO — 01/10: «quero que seja esse icone
          igual tem no web da Luminna LATAM». `/imagens/luminna-latam.png` é o arquivo que
          `TimelineTraveler` já recebe em `TrajectoryScrollytelling`, então os dois modos
          passaram a mostrar a MESMA marca descendo a linha, em eixos diferentes. Antes
          aqui estava `/iconerobo.png`, que é o mesmo glifo redesenhado com disco e anel
          embutidos — parecido na tela, outro arquivo, e divergia do desktop.

          ⚠️ E A TROCA OBRIGA O DISCO NO CSS. Esta arte é BRANCA sobre transparente (traço,
          estrelas e sombra, todos brancos); `iconerobo` trazia fundo marinho pronto. Sobre
          o papel claro da seção, branco sobre branco é o defeito de contraste que a folha
          já documenta no bloco do marcador do palco — a razão de ele ter ganhado disco em
          01/10 (noite). O estático recebe o mesmo tratamento, na mesma linguagem.

          234×200 é a razão MEDIDA do cabeçalho do PNG (889×760, ~1,17:1) — os mesmos
          intrínsecos de `TimelineTraveler`, e não os 160×160 de antes, que pertenciam a uma
          arte quadrada. Eles só reservam a caixa (`images: { unoptimized: true }`,
          SIS-154); o tamanho de desenho é do CSS.

          `priority` não: ele vive no meio da seção, não é o LCP da rota. */}
      <span className="trajetoria-andador-no">
        <Image
          src="/imagens/luminna-latam.png"
          alt=""
          width={234}
          height={200}
          loading="lazy"
          decoding="async"
        />
      </span>
      {/* ⚠️ A PÍLULA DE GERAÇÃO SAIU — 01/10: «troque esse por o componente [medalhão]».
          Ela escrevia «2ª GERAÇÃO» ao lado do medalhão, na faixa, e era repetição: a MESMA
          geração está escrita em `.trajetoria-card-geracao`, no topo do card que está em
          foco, a centímetros dela. O medalhão fica sendo a única marca que desce com a
          rolagem, que é o que o pedido descreve.

          `rotulo` CONTINUA SENDO PARÂMETRO, e não é sobra: ele é o sinal de que existe
          parada em foco, e é só isso que `data-ativo` lê — sem ele o medalhão apareceria
          colado no topo antes de a rolagem começar.

      {rotulo ? <span className="trajetoria-andador-rotulo">{rotulo}</span> : null} */}
    </div>
  );
}

/**
 * A DATA DE COMEÇO NO ALTO DA FAIXA — 01/10: «coloque aqui no começo a data de começo 1988».
 *
 * ⚠️ NÃO É UMA SEGUNDA PÍLULA DE 1988 NA TELA, e vale dizer por quê. Quem mostrava o ano no
 * estático era `.trajetoria-abertura-ano`, no bloco de abertura ACIMA da coluna — longe da
 * linha, e portanto sem dizer que a linha começa em 1988. Esta marca o começo da LINHA, que
 * é o que o pedido aponta; a pílula da abertura perde o papel de marco temporal e o CSS a
 * reduz a texto do bloco (ver a nota na folha). Continua havendo um só 1988 por modo.
 *
 * O número vem de `TRAJECTORY_ANO_INICIAL`, a mesma constante que a abertura lê — não um
 * literal digitado aqui, senão os dois poderiam discordar.
 *
 * SEM `aria-hidden`, ao contrário do medalhão e dos ícones: é texto, é informação que não
 * está escrita em nenhum outro lugar da coluna, e é o critério 2 («o primeiro ano visível
 * for 1988») sem depender de JavaScript.
 */
export function TimelineColumnStart() {
  return (
    <p className="trajetoria-coluna-inicio">
      <span>{TRAJECTORY_ANO_INICIAL}</span>
    </p>
  );
}
