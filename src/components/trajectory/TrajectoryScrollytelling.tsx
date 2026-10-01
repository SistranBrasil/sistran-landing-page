'use client';

import { Fragment, useEffect, useRef, useState, type CSSProperties } from 'react';
import {
  CAPITULO_POR_INDICE,
  TRAJECTORY_ITEMS,
  competenciasAcumuladas,
  type TrajectoryChapterId,
} from '@/data/trajectory';
import { prefersReducedMotion } from '@/lib/motion';
/* `CapabilityCheckpoint` fica importado como comentário e não apagado: desde 30/09 a
   fila é só de marcos (as competências viraram selos sobre a linha, ver
   `TimelineWaypoints`), então o ramo `item.type === 'capability'` nunca é alcançado.
   O componente continua no repositório porque a união `TrajectoryItem` continua
   admitindo o tipo — se a área devolver as competências à fila, é esta linha e o
   ternário do JSX que voltam.
// import { CapabilityCheckpoint } from './CapabilityCheckpoint'; */
import { MilestoneCard, type EstadoDoItem } from './MilestoneCard';
import { TimelineClosing } from './TimelineClosing';
import { TimelineContinue } from './TimelineContinue';
import { TimelineEvolving } from './TimelineEvolving';
import { TimelineColumnMarker, TimelineGapIcons } from './TimelineMobileRail';
import { TimelineOrigin } from './TimelineOrigin';
import { TimelinePath } from './TimelinePath';
import { TimelineProgress } from './TimelineProgress';
import { TimelineTraveler } from './TimelineTraveler';
import { TimelineWaypoints } from './TimelineWaypoints';
import { TimelineYearIntro } from './TimelineYearIntro';
import {
  FAIXA,
  alturaDaTrilha,
  deslocamentoDaTrilha,
  nosDaTrilha,
  pontoDoViajante,
} from './trajectoryGeometry';

const NOS = nosDaTrilha(TRAJECTORY_ITEMS);
const ULTIMO = TRAJECTORY_ITEMS.length - 1;

function estadoDoItem(i: number, ativo: number): EstadoDoItem {
  const distancia = Math.abs(i - ativo);
  if (distancia === 0) return 'ativo';
  if (distancia === 1) return 'vizinho';
  return 'distante';
}

/**
 * SIS-202 — o fluxo detalhado (§3 do doc).
 *
 * ── COMO O PROGRESSO É CALCULADO ─────────────────────────────────────────────
 * Uma conta só, sobre a posição REAL da seção, como o §3 manda:
 *
 *     curso   = altura da seção − altura da janela     (o quanto há para rolar)
 *     bruto   = (−rect.top) / curso                    (0 no topo, 1 no fim)
 *     p       = clamp(bruto, 0, 1) × (nº de itens − 1)
 *
 * `p` é a posição CONTÍNUA na fila (3,42 = entre o quarto e o quinto item). Ele vai
 * para o DOM como a variável CSS `--p`, e é o CSS que faz o resto: a trilha desliza
 * com `translate3d(calc(var(--meio) − (var(--p) + .5) × var(--passo)), 0, 0)` e a
 * linha se desenha com `stroke-dashoffset: calc(1 − var(--p) / var(--passos))`.
 *
 * Por que a variável e não estado React: `--p` muda a cada quadro de rolagem. Em
 * estado, seriam ~60 re-renders por segundo de uma árvore com 28 cards. Escrito por
 * `ref` no nó, o custo por quadro é uma atribuição de string e o React não acorda.
 * O ÚNICO estado é o índice ATIVO — inteiro, que muda 28 vezes no percurso inteiro
 * e é o que decide `data-estado` dos cards e o capítulo da barra.
 *
 * ── O QUE NÃO SE FAZ AQUI ────────────────────────────────────────────────────
 * Nada de `window.scrollTo`, nada de `preventDefault` em `wheel` ou `touchmove`,
 * nada de temporizador movendo o palco por conta própria. A rolagem é do usuário
 * (critério 9); este componente só LÊ. O listener é `passive` e só marca um pedido
 * de quadro — a leitura de layout acontece dentro do `requestAnimationFrame`, uma
 * vez por quadro, que é o que o §12 pede.
 *
 * ── MODO ESTÁTICO ────────────────────────────────────────────────────────────
 * Mobile (§10: «Sem palco sticky prolongado», «Sem rolagem horizontal
 * obrigatória») e movimento reduzido (§11) caem no MESMO modo: a fila vira uma
 * timeline vertical natural, tudo visível, linha em CSS na lateral. Quem decide é o
 * CSS — mas ao CONTRÁRIO do que seria intuitivo: o estático é o PADRÃO, e o palco é
 * que se habilita.
 *
 * ⚠️ E ESSA INVERSÃO É O PONTO. `data-modo="palco"` entra pelo JavaScript, depois de
 * confirmar largura e preferência de movimento; sem ele, o CSS desenha a timeline
 * vertical com tudo visível. Fosse o contrário — palco por padrão, estático por
 * `@media` —, sem JavaScript a página serviria o palco sem `--p`: 27 dos 28 cards em
 * `opacity: .15` e uma linha nunca desenhada. O critério 11 e o «conteúdo acessível
 * mesmo com JavaScript desabilitado» do §11 se cumprem por esta ordem, não por uma
 * regra a mais. Também é o que torna os três canais um só: largura, `@media
 * (prefers-reduced-motion)` e `html[data-motion='reduce']` são consultados aqui, em
 * JavaScript, e não replicados em três blocos de CSS que precisariam ficar iguais.
 */
export function TrajectoryScrollytelling({ anoFinal }: { anoFinal: number }) {
  const secaoRef = useRef<HTMLDivElement>(null);
  const palcoRef = useRef<HTMLDivElement>(null);
  const [ativo, setAtivo] = useState(0);
  /* Espelho do estado, para o laço de quadro não entrar no array de dependências
     nem forçar `setState` redundante a cada quadro. Escrito ao lado do `setAtivo`,
     nunca durante o render. */
  const ativoRef = useRef(0);
  /* SIS-177 — o índice em foco na COLUNA ESTÁTICA, que é outro eixo de informação e não
     o mesmo `ativo` com outro nome. No estático `ativo` é fixado em 0 de propósito (ver
     `desligar()`): é ele que decide `data-estado` dos cards, e lá todos têm de ficar
     legíveis de uma vez. Este aqui só alimenta o rótulo do marcador que desce pela
     linha, e começa em −1 porque antes de a seção entrar em quadro não há foco algum. */
  const [focoBase, setFocoBase] = useState(-1);

  useEffect(() => {
    const secao = secaoRef.current;
    const palco = palcoRef.current;
    if (!secao || !palco) return;

    /* ⚠️ `ULTIMO + 1`, E O `+ 1` NÃO É MARGEM DE SEGURANÇA. Desde 01/10 o caminho tem
       um segmento a MAIS no começo — o trecho da `ORIGEM` (a pílula de 1988) até o nó 0.
       São 28 segmentos onde havia 27. `--passos` é o denominador do
       `stroke-dashoffset`, que trabalha em `pathLength={1}`: deixá-lo em `ULTIMO` faria
       o traço aceso correr 28/27 do caminho e chegar ao fim antes do último card. O
       numerador ganhou o mesmo `+ 1` na folha (`(--p + 1) / --passos`), porque alcançar
       o nó `i` passou a significar `i + 1` segmentos desenhados. */
    palco.style.setProperty('--passos', String(ULTIMO + 1));

    const larga = window.matchMedia('(min-width: 901px)');
    let pedido = 0;
    let ligado = false;

    const medir = () => {
      pedido = 0;
      const caixa = secao.getBoundingClientRect();
      const curso = caixa.height - window.innerHeight;
      const bruto = curso > 0 ? -caixa.top / curso : 0;
      const progresso = Math.min(1, Math.max(0, bruto));
      const p = progresso * ULTIMO;

      palco.style.setProperty('--p', p.toFixed(4));
      /* ⚠️ `--meio` DEIXOU DE EXISTIR na inversão do eixo de 30/09, e a remoção é
         deliberada — não é uma variável esquecida.

         Ela trazia `palco.clientWidth / 2` porque, com a fila andando para o lado, o
         que centrava o card ativo era metade da largura, e `50vw` não servia (inclui
         a barra de rolagem). Descendo, quem centra é `top: 50%` na folha: a
         porcentagem é resolvida contra a viewport do palco, que é o pai posicionado —
         já sem a barra de capítulos e sem a pista. A transposição ingênua
         (`clientHeight / 2`) teria ficado ERRADA por metade da barra, e o defeito se
         leria como "a linha está torta", não como um número trocado.

         Uma leitura de layout a menos por quadro, de lambuja. */

      /* O marcador viajante, no MESMO quadro e a partir do MESMO `p`: duas
         atribuições de string, sem tocar no documento para ler nada. A conta é
         analítica (`pontoDaTrilha` avalia a cúbica que o `d` do caminho escreve),
         justamente para não cair em `getPointAtLength`, que o §12 proíbe por
         quadro. Se fossem dois `p` diferentes, a pílula deslizaria atrasada em
         relação ao traço aceso. */
      /* ⚠️ `pontoDoViajante` E NÃO `pontoDaTrilha` desde 01/10 (noite) — «esse eu quero
         que inicie desdo 1988 nao do primeiro card». A diferença entre as duas é só o
         primeiro meio passo, que a lista de nós não cobre porque a origem não é um nó;
         o resto do percurso é a mesma conta. Ver a nota lá. */
      const ponto = pontoDoViajante(NOS, p);
      palco.style.setProperty('--viajante-x', `${ponto.x.toFixed(1)}px`);
      palco.style.setProperty('--viajante-y', `${ponto.y.toFixed(1)}px`);

      /* O deslize da trilha, que até 01/10 (noite) o CSS calculava como
         `(--p + 1) × --passo`. Com vãos de tamanhos diferentes aquele produto deixou de
         valer; agora o número vem da MESMA lista de nós que posiciona os cards. */
      palco.style.setProperty('--trilha-y', `${deslocamentoDaTrilha(NOS, p).toFixed(1)}px`);

      const proximo = Math.round(p);
      if (proximo !== ativoRef.current) {
        ativoRef.current = proximo;
        setAtivo(proximo);
      }
    };

    const agendar = () => {
      if (pedido) return;
      pedido = requestAnimationFrame(medir);
    };

    /* ══ A TRILHA DO MODO ESTÁTICO — SIS-177 ══════════════════════════════════════
       Mobile (≤900px) e movimento reduzido caem na coluna vertical, e até aqui a coluna
       era inteiramente CSS: linha em `border-inline-start`, nó fixo por célula, nada
       acompanhando a rolagem. O palco tem viajante e traço que se desenha; a coluna não
       tinha equivalente nenhum.

       ⚠️ ESTE LAÇO É O IRMÃO DO DE CIMA, NÃO UMA SEGUNDA FONTE DE VERDADE. Os dois nunca
       correm juntos: `decidir()` liga exatamente um, e `ligar()`/`desligar()` desligam o
       outro na mesma chamada. Por isso `--p` e `--p-base` são variáveis DISTINTAS — se
       fossem a mesma, o significado mudaria com o modo (posição na fila de 0 a 27 contra
       fração de 0 a 1) e a folha teria de saber em que modo está para interpretá-la.

       ⚠️ E A CONTA É OUTRA, DE PROPÓSITO. O palco mede `−rect.top / (altura − janela)`,
       porque lá a seção é um curso de rolagem com `position: sticky` dentro. Aqui a
       seção tem a altura do próprio conteúdo e nada está preso: o que faz sentido medir
       é onde a LINHA DE LEITURA (55% da janela, logo acima do centro óptico) cruza a
       coluna. Transpor a fórmula do palco daria `curso` negativo em seção mais curta que
       a janela, e o marcador nasceria no fim. */
    let pedidoBase = 0;
    let baseLigada = false;
    let observador: IntersectionObserver | null = null;
    const focoRef = { atual: -1 };

    const medirBase = () => {
      pedidoBase = 0;
      const caixa = secao.getBoundingClientRect();
      if (caixa.height <= 0) return;
      const bruto = (window.innerHeight * 0.55 - caixa.top) / caixa.height;
      palco.style.setProperty('--p-base', Math.min(1, Math.max(0, bruto)).toFixed(4));
    };

    const agendarBase = () => {
      if (pedidoBase) return;
      pedidoBase = requestAnimationFrame(medirBase);
    };

    const ligarBase = () => {
      if (baseLigada) return;
      baseLigada = true;
      window.addEventListener('scroll', agendarBase, { passive: true });
      window.addEventListener('resize', agendarBase);
      medirBase();

      /* ⚠️ DOIS ATRIBUTOS E NÃO UM, porque são duas perguntas diferentes:
         · `data-visto` é CUMULATIVO — nunca é retirado. É ele que acende o nó da célula,
           e o que ele diz é «a rolagem já passou por aqui». Retirá-lo na saída faria os
           nós apagarem atrás de quem rola, ou seja o progresso andaria para trás.
         · `data-foco` é MOMENTÂNEO — entra e sai. É o «ativo sobe» que a issue pede, e
           tem de haver no máximo um por vez, senão meia fila ficaria em destaque.

         A faixa de −45%/−45% deixa passar só a célula que cruza a banda central da
         janela, que é o que torna «no máximo um» verdade sem o JavaScript comparar
         distâncias. */
      observador = new IntersectionObserver(
        (entradas) => {
          for (const entrada of entradas) {
            const alvo = entrada.target as HTMLElement;
            const indice = Number(alvo.dataset.indice ?? -1);
            if (entrada.isIntersecting) {
              alvo.dataset.visto = 'sim';
              alvo.dataset.foco = 'sim';
              if (indice !== focoRef.atual) {
                focoRef.atual = indice;
                setFocoBase(indice);
              }
            } else {
              delete alvo.dataset.foco;
            }
          }
        },
        { rootMargin: '-45% 0px -45% 0px' },
      );
      for (const celula of secao.querySelectorAll('.trajetoria-celula')) {
        observador.observe(celula);
      }
    };

    const desligarBase = () => {
      if (!baseLigada) return;
      baseLigada = false;
      if (pedidoBase) {
        cancelAnimationFrame(pedidoBase);
        pedidoBase = 0;
      }
      window.removeEventListener('scroll', agendarBase);
      window.removeEventListener('resize', agendarBase);
      observador?.disconnect();
      observador = null;
      /* Limpeza obrigatória, e não higiene opcional: quem desliga a coluna é o palco
         ligando (giro de tela, janela redimensionada). Os atributos deixados para trás
         seriam lidos pelas regras `[data-visto]`/`[data-foco]` se um dia elas valessem
         também no palco, e o `--p-base` pendurado faria o marcador reaparecer sobre o
         `<svg>`. Deixar o estado morto no DOM é o que transforma um giro de tela em
         defeito que não se reproduz recarregando. */
      palco.style.removeProperty('--p-base');
      for (const celula of secao.querySelectorAll<HTMLElement>('.trajetoria-celula')) {
        delete celula.dataset.visto;
        delete celula.dataset.foco;
      }
      focoRef.atual = -1;
      setFocoBase(-1);
    };

    /* ⚠️ `desligar()` NÃO liga a coluna, e a assimetria é deliberada: ele também é o
       caminho de desmontagem (o `return` do efeito), onde ligar observador e listeners
       seria vazar os dois. Quem decide quem está ligado é `decidir()`, um nível acima. */
    const desligar = () => {
      if (!ligado) return;
      ligado = false;
      if (pedido) {
        cancelAnimationFrame(pedido);
        pedido = 0;
      }
      window.removeEventListener('scroll', agendar);
      window.removeEventListener('resize', agendar);
      secao.removeAttribute('data-modo');
      /* Linha inteira desenhada: no modo estático o CSS mostra todos os cards em
         opacidade cheia, então "percorrido" deixa de significar "o que já se pode
         ler" e vira só o traço completo do percurso. */
      palco.style.setProperty('--p', String(ULTIMO));
      ativoRef.current = 0;
      setAtivo(0);
    };

    const ligar = () => {
      if (ligado) return;
      ligado = true;
      secao.setAttribute('data-modo', 'palco');
      window.addEventListener('scroll', agendar, { passive: true });
      window.addEventListener('resize', agendar);
      medir();
    };

    const decidir = () => {
      if (larga.matches && !prefersReducedMotion()) {
        desligarBase();
        ligar();
      } else {
        desligar();
        /* ⚠️ A COLUNA NÃO GANHA EXCEÇÃO DE MOVIMENTO REDUZIDO AQUI, e é por isso que o
           laço é tão barato. Ele não anima nada: escreve uma fração e marca atributos,
           e o que ela move é o marcador de posição — informação de onde a leitura está,
           não enfeite. Quem decide se o deslocamento é suave ou instantâneo é a folha,
           nos dois canais da casa. Desligar o laço em movimento reduzido apagaria o
           marcador e os nós acesos justamente para quem mais depende de saber onde
           está; e sem JavaScript a coluna já é legível por inteiro (critério 11), que é
           o piso que esta peça não pode baixar. */
        ligarBase();
      }
    };

    decidir();
    larga.addEventListener('change', decidir);
    /* Reavaliado também quando a preferência de movimento muda no sistema durante a
       visita — é a mesma exigência do hook da casa, e sem isto o palco continuaria
       ligado para quem acabou de pedir menos movimento. */
    const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)');
    semMovimento.addEventListener('change', decidir);

    return () => {
      larga.removeEventListener('change', decidir);
      semMovimento.removeEventListener('change', decidir);
      desligar();
      desligarBase();
    };
  }, []);

  const capituloAtivo: TrajectoryChapterId = CAPITULO_POR_INDICE[ativo] ?? 'inicio';

  return (
    <>
      {/* A altura desta caixa é a DURAÇÃO da experiência (§3: «O container externo
          controla a duração»). `svh` e não `vh`, como o §10 pede: em mobile a barra
          de URL muda a `vh` durante a própria rolagem, e o percurso encolheria
          debaixo dos pés de quem rola. */}
      <div
        ref={secaoRef}
        className="trajetoria-scroll"
        style={{ '--itens': ULTIMO } as CSSProperties}
      >
        <div ref={palcoRef} className="trajetoria-palco">
          <TimelineProgress ativo={capituloAtivo} />

          <div className="trajetoria-palco-corpo">
            <TimelineYearIntro />

            <div className="trajetoria-viewport">
              <div
                className="trajetoria-trilha"
                /* ⚠️ A DIMENSÃO FIXA AGORA É A LARGURA. Antes a trilha tinha altura
                   `FAIXA` e largura crescente; descendo, é o contrário — a faixa é a
                   banda horizontal em que a linha serpenteia, e a altura é o percurso.

                   ⚠️ E AS DUAS VÃO EM VARIÁVEL, NÃO EM `width`/`height` INLINE. Esta é
                   a MESMA armadilha das células, e ela me pegou de novo nesta leva:
                   escritas inline, as dimensões só podiam ser desarmadas no modo
                   estático com `width: auto !important` — e o `!important` valia
                   também no palco, que não tinha como devolver o valor. Medido a
                   1440px: trilha com `width: 0px`, `translateX(-50%)` resolvendo para
                   zero e a banda de 900px inteira deslocada meia tela para a direita.

                   Em variável o valor não dimensiona nada por conta própria: quem
                   aplica é a folha, no bloco onde o palco está ligado, e o estado base
                   não precisa retirar nada. Nenhum `!important` nos dois lados. */
                style={
                  {
                    /* ⚠️ `--passo` SAIU EM 01/10 (NOITE): não há mais um passo só. Quem
                       consumia era o deslize, que passou a ler `--trilha-y` escrito por
                       quadro — ver `deslocamentoDaTrilha`. */
                    '--faixa': `${FAIXA}px`,
                    '--percurso': `${alturaDaTrilha(NOS)}px`,
                  } as CSSProperties
                }
              >
                <TimelinePath nos={NOS} ativo={ativo} />

                {/* A pílula de 1988 sobre o PRIMEIRO PONTO do caminho — 01/10. Dentro da
                    trilha, como os selos, para herdar o sistema 1:1 do `<svg>`: assim
                    `--origem-x`/`--origem-y` em px de `viewBox` são px de layout e o nó
                    ciano cai sobre o `M` do `d`, sem conversão. Depois do caminho no
                    documento para ficar por cima do traço. */}
                <TimelineOrigin />

                {/* Os selos de competência sobre o traço, nos vãos entre cards. Antes
                    do marcador viajante no documento para que a pílula da Luminna passe
                    POR CIMA deles ao deslizar, e não por baixo. */}
                <TimelineWaypoints nos={NOS} ativo={ativo} />

                {/* A pílula da Luminna sobre o traço — a metade do desenho publicado
                    que faltava. Fica DENTRO da trilha para herdar o mesmo sistema de
                    coordenadas do `<svg>` 1:1, e não ao lado dele; assim `--viajante-x`
                    em px de `viewBox` é px de layout, sem conversão. No modo estático a
                    folha a esconde: sem `--p` por quadro, ela não tem onde estar. */}
                {/* Arte trocada em 30/09 a pedido da área. ⚠️ NÃO É SÓ O ARQUIVO:
                    `luminnadoisnn.png` era 2172×724 (pílula 3:1) e este é 889×760
                    (quase quadrado), então os intrínsecos do `Image` e a largura de
                    desenho no CSS mudaram junto — ver `TimelineTraveler`. */}
                <TimelineTraveler arte="/imagens/luminna-latam.png" />

                {/* A bolinha que desce pela linha da coluna no modo estático — SIS-177.
                    Irmã do `TimelineTraveler` logo acima, no eixo que o estático tem.
                    ANTES das células no documento porque o `z-index` dela é baixo: o
                    marcador passa por TRÁS dos cards e aparece no vão entre eles, que é
                    onde há linha visível. Ver a nota em `TimelineMobileRail`. */}
                <TimelineColumnMarker
                  rotulo={
                    focoBase >= 0
                      ? (TRAJECTORY_ITEMS[focoBase]?.data.tags?.[0] ?? null)
                      : null
                  }
                />

                {TRAJECTORY_ITEMS.map((item, i) => (
                  <Fragment key={item.data.id}>
                    <div
                      className="trajetoria-celula"
                      data-ancora={NOS[i].ancora}
                      /* O índice no DOM para o observador da coluna estática poder dizer
                         QUAL célula entrou em foco. Em `dataset` e não num `Map` de nó para
                         índice: as `IntersectionObserverEntry` só trazem o nó, e o atributo
                         sobrevive a qualquer remontagem da lista sem segunda estrutura para
                         manter em sincronia. */
                      data-indice={i}
                      /* Coordenadas como VARIÁVEL, e não como `left`/`top` inline — e a
                         troca conserta o empilhamento de todos os cards num ponto só.
                         Escritas como `left`/`top`, elas entravam em disputa de
                         especificidade com a folha: o bloco base (coluna estática) anula
                         o posicionamento com `inset: auto !important`, porque é o único
                         jeito de um seletor vencer estilo inline; e o bloco do palco
                         devolvia `position: absolute !important` mas NÃO devolvia o
                         `inset`. Resultado medido a 1440px: `left` inline de 210px lido
                         como `0px` nas 28 células, todas sobrepostas no canto da trilha.
                         Em variável, o valor não posiciona nada por si — quem posiciona é
                         a folha, no bloco onde o palco está ligado. Ver o par de blocos
                         em `trajectory.css` («A COORDENADA É CONSUMIDA AQUI»). */
                      style={
                        {
                          '--celula-x': `${NOS[i].x}px`,
                          '--celula-y': `${NOS[i].y}px`,
                        } as CSSProperties
                      }
                    >
                      {/* Sem ternário desde 30/09: a fila é só de marcos. O ramo de
                          competência ficava aqui e está guardado junto do import
                          comentado no topo, com o motivo. */}
                      {item.type === 'milestone' ? (
                        <MilestoneCard
                          data={item.data}
                          estado={estadoDoItem(i, ativo)}
                          /* A conta é do ÍNDICE da parada, e o índice só existe aqui —
                             dentro do card, «ativo» não diz qual parada é. Ver a nota em
                             `competenciasAcumuladas`: a lista sai dos mesmos selos
                             pendurados na linha, filtrados por `seloRevelado`, então o que
                             o card soma é exatamente o que a linha já mostrou. */
                          competencias={competenciasAcumuladas(i)}
                        />
                      ) : null}
                    </div>

                  {/* Os ícones de competência NO VÃO entre este card e o próximo —
                      SIS-177. Em fluxo, entre as duas células, que é por que eles
                      aparecem na coluna sem a folha ter de anular nada: o mesmo conteúdo
                      que o palco pendura no traço por coordenada absoluta
                      (`TimelineWaypoints`, que o estático esconde). Montados sempre, nos
                      dois modos, e o palco os retira com uma regra só — assim o desktop
                      não muda e o mobile não depende de JavaScript para TER os ícones:
                      sem script eles já estão na página, parados.

                      ⚠️ EM TODOS OS VÃOS, E A FONTE É `competenciasAcumuladas` — 01/10.
                      Antes a fonte era `vaoDepoisDoIndice`, que lia `Math.floor(selo.p)`
                      dos cinco selos (0,5 · 3,5 · 9,5 · 13,5 · 14,5) e portanto enchia
                      CINCO vãos dos 23. A captura do pedido mostra o trecho Sompo (índice
                      12) / AIG (13), onde não há selo: os vãos estavam vazios por
                      construção. Agora cada vão mostra o conjunto já acumulado até ali — a
                      MESMA lista que o card em destaque exibe, no mesmo índice, então os
                      dois nunca discordam.

                      ⚠️ NÃO NO ÚLTIMO ÍNDICE: depois do último card não há vão, há o fecho
                      (`TimelineEvolving`). Um nó com guia pontilhada ali apontaria para o
                      nada. */}
                  {i < ULTIMO ? (
                    <TimelineGapIcons competencias={competenciasAcumuladas(i)} />
                  ) : null}
                  </Fragment>
                ))}

                {/* O fim ABERTO da linha, depois do último marco — pedido de 01/10.
                    Por último no documento para ficar por cima do card do último nó se
                    as duas caixas se tocarem; e DENTRO da trilha, como os selos, para
                    herdar o sistema de coordenadas do `<svg>` 1:1 em que
                    `pontoDaTrilha` calcula. Não substitui `TimelineContinue`: um é
                    conteúdo sobre a linha, o outro é navegação no pé do palco — ver a
                    nota em `TimelineEvolving`. */}
                <TimelineEvolving nos={NOS} ultimo={ULTIMO} visivel={ativo >= ULTIMO} />
              </div>
            </div>
          </div>

          {/* O aviso de saída, no último card. `ativo >= ULTIMO` e não `=== ULTIMO`:
              o arredondamento de `p` não passa de `ULTIMO`, mas a comparação por
              maior-ou-igual sobrevive a um dia em que a fila ganhe um item de fecho. */}
          <TimelineContinue visivel={ativo >= ULTIMO} />

          {/* Pista fina de progresso no pé do palco, como no mock. Decorativa: a
              barra de capítulos acima já diz onde a pessoa está, em texto. */}
          <div className="trajetoria-pista" aria-hidden>
            <span className="trajetoria-pista-preenchida" />
          </div>
        </div>
      </div>

      <TimelineClosing anoFinal={anoFinal} />
    </>
  );
}
