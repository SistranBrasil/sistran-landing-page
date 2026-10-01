'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
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
      if (larga.matches && !prefersReducedMotion()) ligar();
      else desligar();
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

                {TRAJECTORY_ITEMS.map((item, i) => (
                  <div
                    key={item.data.id}
                    className="trajetoria-celula"
                    data-ancora={NOS[i].ancora}
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
