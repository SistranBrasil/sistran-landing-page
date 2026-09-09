'use client';

/**
 * Metrics — "Sistran em números" como scrollytelling horizontal.
 *
 * A rolagem é vertical, como no resto do site; o que anda na horizontal é a
 * trilha, empurrada por `transform` para deixar o indicador da vez no centro da
 * tela. Nunca há barra de rolagem horizontal.
 *
 * ── SIS-73: agora há clique, e continua não sendo carrossel ──────────────────
 * Até aqui esta nota dizia "não há clique: não é carrossel". A segunda metade
 * segue verdadeira; a primeira mudou, e a distinção é o ponto todo.
 *
 * Os sete indicadores só eram alcançáveis rolando a trilha inteira (520vh na
 * época; 340vh depois da orquestração visual) — quem queria o quarto número
 * rolava várias telas, e por teclado a cena era inalcançável. A faixa de atalhos
 * no pé do palco resolve os dois, e depois da Prioridade 2 ela é um dos DOIS
 * canais de progresso que restaram, junto com o `03 / 07` em texto: o trilho de
 * pontos e a régua do pé do palco saíram (notas nos respectivos lugares).
 *
 * O que a mantém fora da categoria "carrossel" é o que o clique NÃO faz: ele não
 * escolhe o indicador. O índice ativo continua saindo de um lugar só — o
 * progresso do único ScrollTrigger da seção. O botão apenas leva a ROLAGEM até a
 * altura em que aquele indicador é o da vez, e o gatilho reage a isso exatamente
 * como reagiria à roda do mouse. Um `setAtivo(i)` no `onClick` seria sobrescrito
 * no quadro seguinte pelo `onUpdate`; por isso não existe estado novo aqui, e
 * depois de clicar a rolagem segue do ponto onde parou, sem salto.
 *
 * Desenho da seção, de cima para baixo: uma faixa clara com o sobretítulo, o
 * título e o marcador `03 / 07`; abaixo dela o palco escuro, separado por uma
 * curva larga (não um corte reto); dentro do palco, uma única curva que passa
 * pelos sete indicadores, e o indicador ativo é a própria lente — anéis
 * incompletos, número monumental e um componente contextual.
 *
 * ── Como o progresso é calculado ────────────────────────────────────────────
 * Um ScrollTrigger só, `scrub: 1`, do topo ao fim da seção alta (padrão da casa:
 * seção alta + interior `sticky`, nunca `pin: true`, que remonta o nó e
 * desalinha com o Lenis). Do progresso saem variáveis CSS escritas no nó do
 * palco — nunca estado React, que a 60 Hz re-renderizaria a seção inteira. O
 * único estado é o índice ativo, que muda sete vezes no percurso todo.
 *
 * ── Estado final é o default ────────────────────────────────────────────────
 * Sem JavaScript, abaixo de 1024px ou com movimento reduzido a seção é a lista
 * completa dos sete indicadores, com os valores finais no HTML. O CSS do
 * scrollytelling vive todo atrás de `[data-dirigindo]`, atributo que só o
 * JavaScript escreve: não existe estado em que a seção fique presa sem quem a
 * dirija.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animate } from 'motion/react';
import { METRICS } from '@/data/metrics';
import { prefersReducedMotion } from '@/lib/motion';
import ImpactVisual from '@/components/ui/impact/ImpactVisuais';
import { useJornada } from '@/components/ProofJourney';
/* SIS-101 — a faixa de logos passa a ser o rodapé desta seção (antes era uma
   seção independente montada na `page.tsx`). Ver a nota no lugar do consumo.
   SIS-156 — o rodapé continua sendo as marcas, mas PARADAS: entrou a grade
   estática e o import da faixa fica comentado junto com o mount. Comentado, e não
   deletado, é a pista de como religar; ativo, quebraria o lint por import não
   utilizado.
   import { SignalMarquee } from '@/components/legacy/SignalMarquee';

   SIS-179 — e agora a GRADE também saiu: ela subiu para logo depois do hero, e
   quem a importa é `src/app/page.tsx`. Esta seção deixou de ter rodapé de marcas.
   O import fica comentado pelo mesmo motivo do de cima — ativo, o lint quebraria
   por import não utilizado; apagado, ninguém saberia que já esteve aqui:
   import { BrandGrid } from '@/components/BrandGrid'; */
/* SIS-165 — este import NAO acompanhou o modo dirigido para fora, e a razao foi
   verificada no build, nao presumida: `geometria.ts` continua com consumidor vivo
   e incondicional fora daqui — `coord` é usado por
   `src/components/ui/impact/ImpactVisuais.tsx`, que desenha o visual de CADA um
   dos sete indicadores tambem no modo lista. Comentar o modulo derrubaria os sete
   visuais, que ficam.
   Dentro deste arquivo os seis nomes seguem usados pelo `useMemo` da geometria e
   pelo SVG das curvas: aquele markup ainda é renderizado, e fica inerte pelo CSS
   (`.impact-lente` em `display: none` e as regras prefixadas por
   `[data-dirigindo]`), nao por gate no TSX — ver a nota dos blocos inertes em
   `globals.css`. Conferir com:
     grep -rn "impact/geometria" src/ */
import {
  DESVIOS_TRILHO,
  coord,
  criarOnda,
  criarPlano,
  pontoNaOnda,
  vaoEntreEtapas,
} from '@/components/ui/impact/geometria';

const TOTAL = METRICS.length;

/* ── Partitura ──────────────────────────────────────────────────────────────
   Fracoes do percurso da secao. Numeros com nome, nunca soltos no meio do
   codigo. */
/** Entrada: a curva escura sobe, a grade aparece, o primeiro trecho se desenha. */
const ENTRADA_FIM = 0.14;
/** Trecho em que os sete indicadores se sucedem. Sobra folga no fim para o
    estado de conclusao (path todo aceso, `07 / 07`) antes de liberar a rolagem. */
const ETAPAS_INICIO = 0.16;
/** Fim das etapas — MEDIDO, não constante, e a SIS-156 é a razão.
 *
 * O gatilho está ancorado na SEÇÃO (`top top` → `bottom bottom`), que mede a
 * caixa do percurso (`340vh`) MAIS a altura do rodapé de marcas. Já o palco
 * `sticky` viaja só a caixa do percurso: ele desencosta do topo quando ela
 * termina, e o resto do progresso da seção acontece com a cena subindo para fora
 * de quadro.
 *
 * O `0.94` que estava escrito aqui não era folga escolhida: era exatamente esse
 * ponto de soltura, para a altura do rodapé DAQUELA época — medido a 1440×900 com
 * a faixa rolante (rodapé de ~130px), `(3060 − 900) / (3190 − 900) = 0,943`. Com a
 * grade estática o rodapé passou a ~690px, o denominador foi para `3750 − 900` e o
 * mesmo ponto de soltura caiu em `0,758`. Deixar `0.94` fixo faria a sétima etapa
 * ser alcançada 527px DEPOIS de o palco ter começado a sair — medido, e é o modo
 * silencioso de quebrar que a issue avisava: a cena continua bonita, e o `07 / 07`
 * acontece fora de quadro.
 *
 * Então o número certo não é 0,94 nem 0,758: é a razão entre os dois percursos,
 * lida do DOM. Assim qualquer mudança futura na altura deste rodapé — outra
 * geometria de grade, um título de duas linhas, o retorno da faixa — reescala a
 * partitura sozinha, em vez de exigir que alguém se lembre de recalibrar uma
 * constante que não parece ter relação com a altura de um rodapé.
 *
 * O valor fica como reserva para antes da primeira medição e para o caso de a
 * caixa não ser encontrada: é o comportamento anterior, e nunca é pior que ele.
 *
 * ── SIS-179: O RODAPÉ FOI EMBORA, E O NÚMERO NÃO MUDA
 * A grade de marcas saiu desta seção e subiu para logo depois do hero, então o
 * rodapé de ~690px descrito acima não existe mais: o gatilho passa a medir a caixa
 * do percurso mais quase nada. Isto está escrito para impedir o recálculo que a
 * leitura dos parágrafos acima sugere.
 * O `0.94` NÃO foi recalculado, e não precisa ser, porque é exatamente o caso que
 * a SIS-156 previu ao trocar constante por medição: "qualquer mudança futura na
 * altura deste rodapé reescala a partitura sozinha". A altura mudou para zero, que
 * é uma mudança de altura como outra qualquer — `etapasFimRef` é reescrito na
 * primeira medição e a partitura segue a razão real.
 * Ou seja: a saída da grade não é um número a corrigir, é a PROVA de que o
 * mecanismo funciona. Se alguém trocar isto por um valor "mais atual", perde-se a
 * reserva correta para antes da primeira medição e a próxima mudança de altura
 * volta a quebrar em silêncio. */
const ETAPAS_FIM_PADRAO = 0.94;
/** O pulso aparece no meio da passagem entre dois indicadores e some ao chegar. */
const PULSO_SUBIDA = 0.2;
/** Trecho final em que a onda perde amplitude e vira a linha-base horizontal que
    entrega a narrativa aos parceiros (orquestração visual, Prioridade 1). Começa
    em `ETAPAS_FIM`: o sétimo indicador já é o da vez, `07 / 07` está na tela, e o
    que resta do percurso é a passagem — não sobra tempo morto entre as duas
    coisas, que era o "reset visual" a evitar.
   Segue igual a `ETAPAS_FIM` — que agora é medido —, e por isso deixou de ser
   constante: a aterragem tem de começar onde as etapas acabam, e não num ponto
   fixo que ficaria ora antes, ora depois. */

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const doisDigitos = (n: number) => String(n).padStart(2, '0');

/* Medida usada no servidor e ate a primeira medicao do cliente. Nao é chute
   cosmetico: o modo dirigido so existe a partir de 1024px e com JavaScript, e o
   HTML do servidor é sempre o modo lista — em que a geometria da curva nao
   aparece. Ter valores fixos aqui garante que servidor e cliente rendam
   exatamente o mesmo `d`, sem aviso de hidratacao. */
const MEDIDA_PADRAO = { larguraTela: 1440, alturaPalco: 620 };

/** Fracao da altura do palco onde fica a linha-base da curva e o centro da lente.
 *
 * 0.55 -> 0.50 com a refatoracao proporcional: o quadro ativo passou a ter 64svh
 * de altura e o palco sobrou com ~66svh depois da faixa do titulo. Centrado em
 * 55% ele ultrapassava a aresta de baixo (que o `overflow: clip` do palco
 * cortava); em 50% ele cabe com folga igual nos dois lados. */
const LINHA_BASE = 0.5;

/**
 * Contador do indicador.
 *
 * O `CountUp` do projeto nao serve aqui, e a razao é concreta: ele dispara por
 * `useInView`, e nesta secao a trilha é mais larga que a tela — os sete numeros
 * estao TODOS dentro da viewport ao mesmo tempo, entao todos contariam juntos no
 * primeiro quadro. O gatilho certo aqui é "virou o indicador ativo".
 *
 * O numero final é filho REAL do span: é isso que o servidor renderiza, e é o
 * que fica na tela sem JavaScript ou com movimento reduzido. A contagem so
 * acontece quando o indicador fica ativo, e uma unica vez — voltar e reavancar a
 * rolagem nao reinicia o numero.
 *
 * A contagem escreve `textContent` por ref em vez de passar um MotionValue como
 * filho de `motion.span`. Nao é preferencia de estilo: com o MotionValue como
 * filho, o texto do servidor e o do cliente se somavam na hidratacao e o span
 * ficava com o numero DUAS vezes ("850850"); como ele tem largura reservada e
 * `line-height: 0.95`, o excedente quebrava linha e as duas linhas se
 * sobrepunham. Por ref nao ha texto vindo de dois lugares.
 */
/**
 * ── SIS-85: a largura reservada passa a ser um GABARITO, não uma conta em `ch` ──
 * A versão anterior reservava `Nch` (N = digitos do pico da mola) e alinhava o
 * texto à direita, para o `+` não escorregar durante a contagem. As duas coisas
 * juntas eram a origem do número deslocado: medido em 1440, o `ch` da fonte do
 * número mede ~145px enquanto o digito tabular renderizado mede ~87px — a
 * reserva saía 1,7x maior que o texto, e o `text-align: right` empurrava o número
 * 45px para a direita do eixo do rótulo. `ch` é a largura do "0" da fonte; com
 * `letter-spacing: -0.045em` e `tabular-nums` ela deixou de descrever o que
 * aparece na tela.
 *
 * O gabarito é o próprio valor final, invisível (`visibility: hidden`) e
 * `aria-hidden`, empilhado na MESMA célula de grid do número vivo. A largura passa
 * SIS-155 · ponto 12 — esta é a única constante da varredura que já nasceu imune,
 * e vale registrar por quê: o gabarito mede o TEXTO, então a troca de Inter por
 * Geist Mono 600 não pede recálculo nenhum. Conferido no navegador: `.impact-valor`
 * em Geist Mono 600 a 32px, número e gabarito na mesma célula, `+` no eixo. Os
 * "~145px" e "~87px" acima são da Inter e ficam como registro do defeito antigo —
 * se fossem reaproveitados como alvo hoje estariam errados. Tabela das outras
 * constantes em `globals.css:82`.
 *
 * a ser exatamente a do texto final, em qualquer fonte e qualquer tamanho: o `+`
 * continua parado e a primeira glifa do número nasce no eixo, ao pixel.
 *
 * Grid e não `position: absolute`: o gradiente do número é `background-clip: text`
 * no `.impact-valor`, e um descendente posicionado é pintado noutra passagem —
 * arriscaria o número sair sem cor. Em grid os dois filhos continuam em fluxo.
 */
function ImpactNumero({ valor, ativo }: { valor: number; ativo: boolean }) {
  const alvo = useRef<HTMLSpanElement>(null);
  const jaContou = useRef(false);

  useEffect(() => {
    if (!ativo || jaContou.current) return;
    jaContou.current = true;
    if (prefersReducedMotion()) return;
    const no = alvo.current;
    if (!no) return;
    /* SIS-72: era `duration: 1.1` com `ease: [0.22, 1, 0.36, 1]`. Aquela curva
       desacelera forte, mas é MONOTONA — o numero nunca passa do alvo. O pedido
       ("contagem rapida e desaceleracao elastica") é mola, e mola precisa
       ultrapassar para voltar.

       `damping: 30` no `stiffness: 120` sugerido fica praticamente critico: nao
       sobra elasticidade visivel, seria a curva de antes com outro nome. Em 22 a
       mola passa do alvo em ~3-4% e volta — em 850 isso é um pico por volta de
       880, dois ou tres quadros, exatamente o "elastico" pedido.

       `restDelta: 0.5` fecha em meio digito: com `Math.round` no `onUpdate`,
       perseguir 0.01 seria gastar quadros num movimento que a tela nao mostra
       mais. */
    const controle = animate(0, valor, {
      type: 'spring',
      stiffness: 120,
      damping: 22,
      restDelta: 0.5,
      onUpdate: (v) => {
        no.textContent = String(Math.round(v));
      },
      /* Fecha exatamente no valor. Com mola isso passou a ser obrigatorio, nao
         zelo: `restDelta: 0.5` interrompe a meio digito do alvo, e o ultimo
         quadro pode ser o retorno do overshoot. Sem esta linha o indicador
         poderia descansar em 851. */
      onComplete: () => {
        no.textContent = String(valor);
      },
    });
    /* Se a secao desmontar no meio da contagem, o que fica é o valor certo. */
    return () => {
      controle.stop();
      no.textContent = String(valor);
    };
  }, [ativo, valor]);

  return (
    <span className="impact-numero">
      {/* Gabarito de largura. SIS-72 embutia no cálculo o PICO da mola (`valor *
          1.08`), porque um `99+` que passa por 103 ganha um dígito e empurraria o
          `+`. A margem continua aqui, agora como texto real medido pelo motor de
          layout em vez de contagem de caracteres. */}
      <span aria-hidden className="impact-numero-gabarito">
        {Math.ceil(valor * 1.08)}
      </span>
      {/* O número vivo é o texto ACESSÍVEL e o que o servidor entrega: sem
          JavaScript ou com movimento reduzido é ele que fica na tela. */}
      <span ref={alvo} className="impact-numero-vivo">
        {valor}
      </span>
    </span>
  );
}

export default function Metrics() {
  /* -1 antes de a rolagem entrar nas etapas; no modo lista fica em 0, e o CSS
     do modo lista ignora `data-estado` de qualquer forma. */
  const [ativo, setAtivo] = useState(0);
  /**
   * SIS-165 — O MODO DIRIGIDO SAI DE DESKTOP, e é esta constante que o desliga.
   *
   * A seção volta a ser o que já era abaixo de 1024px e com movimento reduzido:
   * os sete indicadores numa fileira só, sempre no mesmo lugar, acendendo
   * conforme a rolagem passa por essa linha estática. Sai o percurso de 340vh, o
   * interior `sticky`, a trilha horizontal, a lente, a onda, os nós, a faixa de
   * atalhos e o marcador `03 / 07`.
   *
   * POR QUE UMA CONSTANTE, E NÃO APAGAR O MODO DIRIGIDO. A issue pede o modo
   * dirigido comentado no lugar, com o motivo e com os valores — e nem JSX nem
   * CSS têm comentário que ANINHA. A cena dirigida são ~500 linhas de markup e
   * ~1700 de CSS, todas cheias de `{/* … *\/}` e `/* … *\/` por dentro: envolver
   * qualquer um dos dois num comentário maior fecharia o bloco no primeiro `*\/`
   * interno e quebraria o arquivo. Então o mecanismo é o único que a linguagem
   * permite sem perder uma linha de história: `dirigindo` deixa de ser medido e
   * passa a ser `false`, e tudo o que pendia dele fica inerte de uma vez —
   *   · o `@media (min-width: 1024px)` de `globals.css`, inteiro, porque cada
   *     regra dele é prefixada por `.impact-scroll[data-dirigindo]` e o atributo
   *     nunca mais é escrito (a nota está na abertura do bloco lá);
   *   · os dois relógios (gatilho local e inscrição na `ProofJourney`), que
   *     retornam na primeira linha;
   *   · a faixa de atalhos e o marcador `03 / 07`, que já rendiam sob `dirigindo`.
   * A curva, a lente e os nós continuam no markup e continuam `display: none`
   * pelo CSS base — exactamente como já ficavam em 390px hoje.
   *
   * `: boolean` de propósito: sem a anotação o TypeScript estreitaria o tipo para
   * o literal `false` e os ramos do outro modo passariam a `never`, o que é o
   * mesmo que apagá-los — e apagá-los é o que esta nota existe para não fazer.
   *
   * RELIGAR é devolver as três linhas comentadas logo abaixo (estado + efeito da
   * media query) e apagar esta constante. Nenhum CSS precisa mudar.
   *
   * const [dirigindo, setDirigindo] = useState(false);
   */
  const dirigindo: boolean = false;
  /**
   * SIS-165 — os SETE ACESOS, e a garantia de alcance POR CONSTRUÇÃO.
   *
   * A faixa de atalhos era o canal de TECLADO da cena dirigida. Ela sai, e o que
   * a substitui não é outro canal: é o conteúdo estar todo no DOM e todo visível,
   * sem depender de gatilho nenhum. Daí a inversão que importa aqui — o
   * `data-observando` da fileira só é escrito DEPOIS de existir quem acenda os sete
   * `<li>` e de a primeira conferência ter corrido. Enquanto ele não estiver lá, o
   * CSS base pinta os sete acesos.
   *
   * O atributo é escrito no DOM pelo efeito, e NÃO é estado do React: ele existe só
   * para o CSS, nada aqui o lê, e como estado ele custava um render inteiro da
   * fileira logo depois da montagem — que é justamente o que
   * `react-hooks/set-state-in-effect` aponta. Escrever no DOM é o que um efeito
   * deve fazer: sincronizar com o sistema de fora.
   *
   * Ou seja: se o efeito não rodar, se a
   * seção montar fora da tela, se houver movimento reduzido — os sete estão
   * legíveis. Nada fica preso em `opacity: 0` esperando gatilho que pode não
   * disparar. É a mesma disciplina do `entrada.play()` de segurança da SIS-161,
   * com o sinal trocado: lá o gatilho era garantido, aqui o gatilho é dispensável.
   *
   * `Set` que só CRESCE: acender é de mão única. Rolar de volta para cima não
   * apaga ninguém — apagar seria transformar movimento decorativo em movimento
   * que esconde conteúdo, que é a régua de `reduced-motion-conteudo`.
   */
  const [acesos, setAcesos] = useState<ReadonlySet<number>>(new Set());
  const fileiraRef = useRef<HTMLOListElement>(null);
  /* Fora da `ProofJourney` devolve `dirigindo: false`, e a seção volta a criar o
     gatilho dela — é o que a mantém utilizável sozinha. */
  const jornada = useJornada();
  const secaoRef = useRef<HTMLElement>(null);
  const palcoRef = useRef<HTMLDivElement>(null);
  const cenaRef = useRef<HTMLDivElement>(null);
  const ativoRef = useRef(0);
  /* SIS-73: o gatilho guardado para os atalhos alcançarem `start`/`end` — as duas
     alturas de rolagem que delimitam o percurso. É a única coisa que a faixa de
     botões precisa saber, e ela vem do MESMO gatilho que dita o índice ativo:
     nenhum segundo medidor do percurso. */
  const gatilhoRef = useRef<ScrollTrigger | null>(null);
  const percursoRef = useRef<HTMLDivElement>(null);
  /* SIS-156 — fim das etapas, medido. Ver a nota longa em `ETAPAS_FIM_PADRAO`.
     Em `ref` e não em estado: quem lê é a partitura, que roda a cada quadro de
     rolagem, e um `setState` aqui remontaria os gatilhos a cada resize sem que
     nada da geometria da cena tivesse mudado. */
  const etapasFimRef = useRef(ETAPAS_FIM_PADRAO);
  /* Largura da tela e altura util do palco. Sao a UNICA entrada da geometria, e
     mudam so em resize — nao em rolagem. */
  const [medida, setMedida] = useState(MEDIDA_PADRAO);

  /* Mesma decisao do `OfficesScene`: o scrollytelling é de tela larga e sem
     movimento reduzido. A avaliacao vive num efeito porque durante o render o
     valor precisa ser o do servidor. */
  /* SIS-165 — medição da largura COMENTADA junto com o modo dirigido. Ver a nota
     longa em `dirigindo`, logo acima: era este efeito o único lugar que escrevia
     `true` ali, e por isso desligá-lo desliga a cena inteira.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const avaliar = () => setDirigindo(mq.matches && !prefersReducedMotion());
    avaliar();
    mq.addEventListener('change', avaliar);
    return () => mq.removeEventListener('change', avaliar);
  }, []);
  */

  /**
   * SIS-165 — quais indicadores já passaram pela linha de leitura.
   *
   * MEDIÇÃO DE RETÂNGULO, e NÃO `IntersectionObserver`. A primeira versão era um
   * observador com `threshold: 0.55`, e ele foi trocado por um limite do contrato
   * da própria API, não por gosto: o observador avisa quando o estado de interseção
   * MUDA. Num salto, o indicador vai de "abaixo da janela, sem interseção" para
   * "acima da janela, sem interseção" — o estado não mudou, e a função de retorno
   * nunca corre. Não há `rootMargin` nem `threshold` que resolva, porque o que
   * falha é a premissa de que existiria uma notificação; e nenhuma verificação
   * dentro da função de retorno resolve, porque ela não é chamada. Atinge âncora,
   * `scrollTo`, restauração de posição do navegador e F5 no meio da página.
   *
   * ⚠️ Isto é raciocínio sobre a API, e não uma leitura que eu tenha feito da
   * versão com observador: o cenário está COBERTO por sonda
   * (`docs/medidas/sis165/comportamento.mjs` salta para depois da fileira e exige
   * zero apagados), e é ela que garante o comportamento, seja qual for o mecanismo
   * de quem vier depois. O que não fica registrado como fato é uma reprovação do
   * observador que não foi medida.
   *
   * Legível não seria o mesmo que correto: 0,55 de opacidade passa o contraste (é
   * por isso que o piso é 0,55, ver `globals.css`), então nada ficaria escondido —
   * mas a seção pareceria meio apagada por um gatilho sem como disparar. É a
   * armadilha que a issue manda evitar, e a saída é a disciplina do
   * `entrada.play()` de segurança da SIS-161: não confiar no aviso, CONFERIR o
   * estado.
   *
   * `conferir()` lê o retângulo dos que ainda não acenderam e acende todo aquele
   * cujo topo já esteja acima da linha de leitura — o que inclui, sem caso
   * especial, quem passou há muito. Roda uma vez ao montar e a cada rolagem.
   *
   * O CUSTO é conhecido e pequeno: no máximo sete `getBoundingClientRect` por
   * quadro de rolagem, e o laço encolhe a cada aceso porque a lista de pendentes
   * é consumida. Chegando a zero, o ouvinte se remove — o estado final não custa
   * nada. Não há `setState` sem mudança: `conferir` só escreve quando há novos.
   *
   * `passive: true` no ouvinte: isto nunca chama `preventDefault`, e sem a flag o
   * navegador tem de esperar pelo retorno antes de rolar.
   *
   * A linha de leitura é 82% da altura da janela: o indicador acende quando o topo
   * dele entra no último quinto da tela, um pouco antes de estar confortavelmente
   * lido. Em telas altas os sete cruzam juntos, e isso é o comportamento certo —
   * o escalonado é do CSS (`transition-delay` por índice), não daqui.
   *
   * Com movimento reduzido nada disto corre: o efeito retorna na primeira linha,
   * `data-observando` nunca é escrito, o CSS ignora os `data-aceso` e os sete
   * nascem acesos com o valor final. É também o que garante o valor final nunca ser
   * 0 (ver `ImpactNumero`).
   */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const fileira = fileiraRef.current;
    if (!fileira) return;
    /* Mapa de pendentes, não array: acender é remover, e remover de um `Map` não
       reindexa nada. A chave é o índice do indicador. */
    const pendentes = new Map<number, HTMLElement>();
    fileira.querySelectorAll<HTMLElement>('[data-indicador-i]').forEach((n) => {
      const i = Number(n.dataset.indicadorI);
      if (Number.isFinite(i)) pendentes.set(i, n);
    });
    if (!pendentes.size) return;

    const conferir = () => {
      const linha = window.innerHeight * 0.82;
      const novos: number[] = [];
      pendentes.forEach((n, i) => {
        if (n.getBoundingClientRect().top < linha) {
          novos.push(i);
          pendentes.delete(i);
        }
      });
      if (novos.length) {
        setAcesos((antes) => {
          const depois = new Set(antes);
          for (const i of novos) depois.add(i);
          return depois;
        });
      }
      /* Todos acesos: o trabalho acabou e o ouvinte sai. */
      if (!pendentes.size) window.removeEventListener('scroll', conferir);
    };

    window.addEventListener('scroll', conferir, { passive: true });
    /* A primeira conferência num quadro de animação, e NÃO aqui no corpo do efeito.
       Dois motivos, e os dois valem por si:

       1. É ela que cobre a seção montada já dentro da tela e o salto que aconteceu
          antes deste efeito correr — mas no corpo do efeito ela chamaria `setAcesos`
          de forma síncrona, o que é render em cascata (o `react-hooks` avisa, e o
          aviso está certo: a fileira renderizaria duas vezes só para assentar).
       2. Dentro do `raf` o layout já está resolvido, e é de layout que ela vive:
          `getBoundingClientRect` no mesmo tique da montagem pode ler a caixa antes
          de as fontes assentarem.

       O `data-observando` é escrito DEPOIS dessa primeira passagem, no mesmo quadro:
       é esta ordem que faz o estado apagado ser inalcançável antes de existir quem o
       acenda. Enquanto o atributo não estiver lá, o CSS pinta os sete acesos. */
    const quadro = requestAnimationFrame(() => {
      conferir();
      fileira.dataset.observando = '1';
    });
    return () => {
      cancelAnimationFrame(quadro);
      window.removeEventListener('scroll', conferir);
      delete fileira.dataset.observando;
    };
  }, []);

  /* Medicao da cena. `ResizeObserver` no proprio palco em vez de `resize` na
     janela: a altura util depende do cabecalho (que é fluido) e da barra de URL
     do navegador, e nenhum dos dois avisa por `resize`. A guarda de meio pixel
     evita o laco de render que `getBoundingClientRect` (float) provocaria. */
  useEffect(() => {
    if (!dirigindo) return;
    const cena = cenaRef.current;
    if (!cena) return;

    const medir = () => {
      const larguraTela = window.innerWidth;
      const alturaPalco = cena.getBoundingClientRect().height;
      if (larguraTela < 1 || alturaPalco < 1) return;
      setMedida((anterior) =>
        Math.abs(anterior.larguraTela - larguraTela) < 0.5 &&
        Math.abs(anterior.alturaPalco - alturaPalco) < 0.5
          ? anterior
          : { larguraTela, alturaPalco },
      );
    };

    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(cena);
    return () => ro.disconnect();
  }, [dirigindo]);

  /* SIS-156 — a razão entre o percurso PRESO e o percurso da SEÇÃO, que é o fim
     real das etapas. Ver a nota de `ETAPAS_FIM_PADRAO`.
     Observador nas DUAS caixas: a de baixo (a seção) cresce quando o rodapé de
     marcas cresce — e é justamente essa a mudança que a razão precisa acompanhar —,
     e a de cima (o percurso) é `340vh`, que muda com a altura da janela. Observar
     só uma deixaria a razão velha em metade dos casos.
     A guarda de um milésimo é a mesma ideia da de meio pixel acima: o
     `getBoundingClientRect` devolve float, e sem ela cada quadro reescreveria o
     valor. Aqui não há render em jogo (é `ref`), mas gravar sem mudança é ruído. */
  useEffect(() => {
    if (!dirigindo) return;
    const secao = secaoRef.current;
    const percurso = percursoRef.current;
    if (!secao || !percurso) return;

    const medirFatia = () => {
      const vh = window.innerHeight;
      const presa = percurso.getBoundingClientRect().height - vh;
      const total = secao.getBoundingClientRect().height - vh;
      if (presa <= 0 || total <= 0) return;
      /* Sem `clamp01`: uma razão > 1 significaria seção MENOR que o percurso, que
         não existe (o percurso é filho dela) — e um teto silencioso aqui
         esconderia o erro em vez de o expor. O piso de `ETAPAS_INICIO` é o que
         importa: abaixo dele as etapas não teriam trecho nenhum para acontecer. */
      const fatia = Math.max(ETAPAS_INICIO + 0.05, Math.min(1, presa / total));
      if (Math.abs(etapasFimRef.current - fatia) < 0.001) return;
      etapasFimRef.current = fatia;
      /* O atalho da faixa de botões inverte esta mesma conta, então o novo valor
         tem de estar em vigor antes de qualquer clique — e a partitura recalcula
         no próximo quadro de rolagem sozinha. */
    };

    medirFatia();
    const ro = new ResizeObserver(medirFatia);
    ro.observe(secao);
    ro.observe(percurso);
    return () => ro.disconnect();
  }, [dirigindo]);

  /**
   * Geometria da cena. UM vao alimenta tudo: posicao do conteudo de cada
   * indicador, posicao dos nodes, largura do SVG, deslocamento da trilha e o
   * path. É essa unificacao que faz o indicador ativo cair exatamente no centro
   * da tela e os vizinhos imediatos ficarem sempre visiveis.
   */
  const geo = useMemo(() => {
    const vao = vaoEntreEtapas(medida.larguraTela);
    const centroX = medida.larguraTela / 2;
    const centroY = medida.alturaPalco * LINHA_BASE;
    /* Margem em TRECHOS: meia tela de cada lado, arredondada para cima. É o que
       garante que a onda atravesse o quadro em QUALQUER etapa — no primeiro
       indicador ela já vem da borda esquerda, no último ela segue para fora da
       direita. Com a margem de um vão só, as duas pontas morriam a 150–250px do
       centro e metade da tela abria vazia. */
    const margem = Math.ceil(centroX / vao);
    const onda = criarOnda(centroX, centroY, vao, TOTAL, margem);
    /* Mesmo caminho com amplitude zero, para a passagem aos parceiros. Calculado
       junto porque depende das MESMAS entradas — dois `useMemo` sobre a mesma
       medida seriam duas chances de divergirem. */
    const dPlano = criarPlano(centroX, centroY, vao, TOTAL, margem);
    return { vao, centroX, centroY, altura: medida.alturaPalco, dPlano, ...onda };
  }, [medida]);

  /**
   * Um quadro do capítulo, dado o progresso 0..1 do percurso de Números.
   *
   * Extraído do `onUpdate` do gatilho que vivia aqui, sem mudar uma conta: dentro
   * da `ProofJourney` quem chama é o relógio único da jornada (que recorta o
   * progresso dela nesta faixa); fora dela, o gatilho local logo abaixo. Nunca os
   * dois — dois relógios escrevendo `--impact-etapa` no mesmo nó fariam a trilha
   * tremer.
   */
  /**
   * SIS-89 — `chegada` é "quanto esta seção já chegou", 0..1, e é ela que move a
   * entrada. Antes a entrada saía de `p / ENTRADA_FIM`, com `p` medido do pixel em
   * que o palco PRENDE: a seção subia a janela inteira ainda vazia (título fora do
   * recorte, curva escura embaixo, grade apagada) e só começava a se montar depois
   * de já ocupar a tela toda. Era a metade "travada" da emenda reportada.
   *
   * Dentro da jornada quem informa é o relógio único, que mede a aproximação e
   * ainda a faz invadir a saída de Soluções (ver `SOBREPOSICAO` em
   * `ProofJourney.tsx`). Fora dela o gatilho local passa a MESMA conta de antes —
   * `p / ENTRADA_FIM` — então a seção montada sozinha em outra página não muda em
   * nada.
   */
  const aplicar = useCallback(
    (p: number, chegada: number) => {
      const palco = palcoRef.current;
      if (!palco) return;
      palco.style.setProperty('--impact-p', String(p));
        /* Lido UMA vez por quadro, e as três contas abaixo usam o mesmo valor: se
           uma delas relesse a `ref` depois de um resize no meio do quadro, a
           aterragem e as etapas discordariam sobre onde o percurso acaba. */
        const etapasFim = etapasFimRef.current;
        const aterrarInicio = etapasFim;
        palco.style.setProperty('--impact-entrada', String(clamp01(chegada)));
        /* Aterragem: 0 enquanto a cena é a onda, 1 quando ela já é a linha-base.
           O CSS cruza as duas camadas de path com esta variável. */
        palco.style.setProperty(
          '--impact-aterrar',
          String(clamp01((p - aterrarInicio) / (1 - aterrarInicio))),
        );

        /* Posicao continua na sequencia, em indices: 0 = primeiro indicador,
           TOTAL-1 = ultimo. É dela que sai TUDO — deslocamento da trilha, trecho
           aceso da curva, pulso e indice ativo. Um progresso, uma fonte. */
        const etapa =
          clamp01((p - ETAPAS_INICIO) / (etapasFim - ETAPAS_INICIO)) * (TOTAL - 1);

        /* Posicao continua em ETAPAS, nao em fracao de trilha: o CSS multiplica
           por `--impact-vao` e a trilha anda exatamente um vao por indicador.
           Em etapa inteira o ativo cai no centro da tela ao pixel. */
        palco.style.setProperty('--impact-etapa', String(etapa));

        /* O trecho aceso termina no ponto da vez, em pixels da trilha. Como esse
           ponto é sempre o centro da tela, a borda dura do corte fica dentro do
           buraco da mascara da lente — nunca aparece como risco vertical. */
        palco.style.setProperty(
          '--impact-aceso-x',
          `${coord(geo.centroX + etapa * geo.vao)}px`,
        );

        /* Pulso: só durante a passagem, seguindo a curva, sumindo ao chegar.
           Nao é laco — a opacidade zera nas duas pontas da passagem. */
        const passagem = etapa - Math.floor(etapa);
        const opacidade =
          etapa >= TOTAL - 1
            ? 0
            : passagem < 0.5
              ? clamp01((passagem - 0.05) / PULSO_SUBIDA)
              : clamp01((0.95 - passagem) / PULSO_SUBIDA);
        const ponto = pontoNaOnda(etapa, geo.centroX, geo.centroY, geo.vao);
        palco.style.setProperty('--impact-pulso-x', `${coord(ponto.x)}px`);
        palco.style.setProperty('--impact-pulso-y', `${coord(ponto.y)}px`);
        palco.style.setProperty('--impact-pulso-op', String(opacidade));

        /* Sinal de PASSAGEM: 0 com a etapa parada, 1 no meio do caminho entre
           duas. É o que faz a lente reagir ao avanco em vez de so trocar o
           conteudo por baixo — o sintoma de "tela travada" vinha de a moldura nao
           ter nenhuma resposta continua ao scroll, e nao da lente estar centrada
           (ela DEVE ficar centrada: é ela que define o centro da cena).

           Seno, e nao triangulo (`1 - |2t - 1|`): o triangulo tem quina nas duas
           pontas e a quina aparece como estalo no fim de cada passagem.

           Zera na ultima etapa, senao o estado de conclusao ficaria pulsando. */
        palco.style.setProperty(
          '--impact-passagem',
          String(etapa >= TOTAL - 1 ? 0 : Math.sin(passagem * Math.PI)),
        );

        /* Unica coisa que vira estado React: muda sete vezes na secao inteira. */
      const indice = Math.min(TOTAL - 1, Math.round(etapa));
      if (indice === ativoRef.current) return;
      ativoRef.current = indice;
      setAtivo(indice);
    },
    /* A geometria entra nas dependências porque a função lê `geo`: em resize ela
       é recriada com as medidas novas. Fora de resize nada aqui muda. */
    [geo],
  );

  /** Limpa tudo o que `aplicar` escreve. Usada nos dois modos de relógio. */
  const limpar = useCallback(() => {
    const palco = palcoRef.current;
    if (!palco) return;
    delete palco.dataset.visivel;
    for (const nome of [
      '--impact-p',
      '--impact-entrada',
      '--impact-aterrar',
      '--impact-etapa',
      '--impact-aceso-x',
      '--impact-pulso-x',
      '--impact-pulso-y',
      '--impact-pulso-op',
      '--impact-passagem',
    ]) {
      palco.style.removeProperty(nome);
    }
  }, []);

  /* Relógio local: só FORA da jornada (outras páginas que montem a seção). */
  useEffect(() => {
    if (!dirigindo || jornada.dirigindo) return;
    const secao = secaoRef.current;
    const palco = palcoRef.current;
    if (!secao || !palco) return;

    gsap.registerPlugin(ScrollTrigger);
    const gatilho = ScrollTrigger.create({
      trigger: secao,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      /* Movimento interno da lente pausado fora da tela: sem isso ela respiraria
         pela pagina toda, gastando compositor por nada. */
      onToggle: (self) => {
        palco.dataset.visivel = self.isActive ? '1' : '';
      },
      /* Fora da jornada não existe aproximação medida: a entrada continua sendo o
         primeiro trecho do próprio percurso, exatamente como antes de SIS-89. */
      onUpdate: (self) => aplicar(self.progress, clamp01(self.progress / ENTRADA_FIM)),
    });

    gatilhoRef.current = gatilho;

    const atualizar = () => ScrollTrigger.refresh();
    window.addEventListener('resize', atualizar);
    return () => {
      window.removeEventListener('resize', atualizar);
      /* Só o gatilho DESTA seção. Nunca `ScrollTrigger.killAll()`: as outras
         seções da página têm gatilhos próprios e sobrevivem a este desmonte. */
      gatilho.kill();
      gatilhoRef.current = null;
      limpar();
    };
  }, [dirigindo, jornada.dirigindo, aplicar, limpar]);

  /* Relógio da jornada: o capítulo se inscreve e recebe a fatia dele. */
  useEffect(() => {
    if (!dirigindo || !jornada.dirigindo) return;
    const palco = palcoRef.current;
    if (!palco) return;
    const baixa = jornada.registrar('metrics', {
      alvo: () => secaoRef.current,
      aplicar,
      aoAlternar: (visivel) => {
        palco.dataset.visivel = visivel ? '1' : '';
      },
    });
    return () => {
      baixa();
      limpar();
    };
  }, [dirigindo, jornada, aplicar, limpar]);

  /**
   * SIS-73 — atalho para o indicador `i`.
   *
   * Não mexe em `ativo`: converte o índice na FRAÇÃO de progresso em que aquele
   * indicador é o da vez — o inverso exato da conta do `onUpdate` — e leva a
   * rolagem até a altura correspondente. Quem decide o índice continua sendo o
   * ScrollTrigger.
   *
   * `start`/`end` vêm do gatilho vivo, não de `offsetTop` recalculado à mão: se o
   * percurso mudar (resize, `refresh`), o atalho acompanha sem uma segunda fonte
   * de verdade para desincronizar.
   *
   * Lenis primeiro, `window.scrollTo` como reserva — o mesmo par de
   * `Differentials.irParaPasso`. Com movimento reduzido a viagem é salto: uma
   * duração de 0,9s é movimento, e é justamente o que a preferência recusa.
   */
  const irParaIndicador = (i: number) => {
    /* Mesma `ref` que a partitura lê: o atalho continua sendo o inverso EXATO da
       conta de `aplicar`, e não uma segunda verdade sobre onde as etapas acabam. */
    const p =
      ETAPAS_INICIO + (i / (TOTAL - 1)) * (etapasFimRef.current - ETAPAS_INICIO);
    /* Duas origens possíveis para a altura, e nunca as duas ao mesmo tempo: o
       gatilho local (fora da jornada) ou a jornada (que é quem tem o gatilho
       quando a seção é um capítulo dela). A conta de `p` é a mesma nos dois
       casos — inverso exato da conta de `aplicar`. */
    const gatilho = gatilhoRef.current;
    const alvo = gatilho
      ? gatilho.start + p * (gatilho.end - gatilho.start)
      : jornada.alturaDe('metrics', p);
    if (alvo === null) return;
    const rm = prefersReducedMotion();
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: number, o?: object) => void } })
      .__lenis;
    if (lenis) lenis.scrollTo(alvo, { duration: rm ? 0 : 0.9 });
    else window.scrollTo({ top: alvo, behavior: rm ? 'auto' : 'smooth' });
  };

  return (
    <section
      id="resultados"
      ref={secaoRef}
      className="impact-scroll"
      aria-labelledby="impact-titulo"
      /* O CSS do scrollytelling inteiro pende deste atributo. Sem JavaScript ele
         nunca aparece, e a secao é a lista completa. */
      data-dirigindo={dirigindo ? '1' : undefined}
    >
      {/* SIS-101 — o percurso ganhou uma caixa própria, e ela existe por uma
          razão só: dar à faixa de logos um lugar DEPOIS do sticky.

          `position: sticky` viaja dentro do bloco pai. Enquanto o `.impact-sticky`
          era filho direto da seção, ele viajava as 340vh inteiras — e qualquer
          irmão depois dele teria a posição estática dele como origem, ou seja, a
          100svh do topo da seção: a faixa nasceria no MEIO do percurso e passaria
          as 240vh restantes escondida atrás do palco opaco, para nunca aparecer.

          Com o percurso numa caixa de 340vh, o sticky viaja aquela caixa e o rodapé
          é o que vem logo abaixo dela: nos últimos pixels da seção o palco
          desencosta do topo e sobe, e as marcas entram em quadro por baixo. É esse
          o "rodapé da seção" que SIS-101 pede — e é a mesma cena que a curva já
          contava, porque a aterragem começa onde as etapas acabam e achata a curva
          numa reta horizontal justo antes disso. A reta aterrissa, o palco sai, as
          marcas entram. Sem chanfro, sem degrau, e sem a linha ciano que existia só
          para costurar duas seções que agora são uma.

          SIS-156 — o "~130px" que estava escrito aqui era a altura da FAIXA, e o
          ponto de soltura deixou de ser um número para ser uma razão medida: ver a
          nota de `ETAPAS_FIM_PADRAO`. Com a grade estática o rodapé mede ~690px a
          1440×900, e é por isso que a partitura passou a lê-lo do DOM em vez de o
          ter cravado em `0.94`.

          O `min-height: 340vh` mudou de dono junto (era `.impact-scroll
          [data-dirigindo]`, agora é esta caixa) — ver `globals.css`. O gatilho
          continua ancorado na SEÇÃO (`start: top top` / `end: bottom bottom`), que
          agora mede 340vh + o rodapé.

          E aqui estava um erro de premissa que a SIS-156 desmentiu com medida: "as
          fatias se reescalam sozinhas sobre o progresso normalizado" é verdade só
          para as PROPORÇÕES, não para o ponto de soltura. Normalizar sobre uma
          caixa que inclui o rodapé faz o fim das etapas migrar para dentro do
          trecho em que o palco já está saindo, tanto mais quanto mais alto for o
          rodapé — e nada avisa. O que reescala sozinho, agora, é `ETAPAS_FIM`:
          medido como a razão entre esta caixa e a seção.

          ── SIS-179: A RAZÃO DE EXISTIR DESTA CAIXA CAIU, E ELA FICA
          A primeira frase acima — "ela existe por uma razão só: dar à faixa de
          logos um lugar DEPOIS do sticky" — deixou de valer. A faixa saiu na
          SIS-156, a grade que a substituiu saiu na SIS-179 (subiu para depois do
          hero), e esta seção não tem mais rodapé nenhum. A caixa não tem mais
          irmão a acomodar.
          Ela FICA, e não por inércia. Três coisas pendem dela — mas ⚠️ AS DUAS
          PRIMEIRAS ESTÃO INERTES HOJE, e é justamente por isso que precisam estar
          escritas: quem testar "tiro a caixa, nada muda" vai ver que nada muda
          MESMO, e vai apagá-la. O que a mantém é o retorno do condutor, não o
          efeito de agora.
            1. o `min-height: 340vh` mora nela (`globals.css`) — é ela que dá altura
               ao percurso, e sem ela o sticky não tem onde viajar. INERTE: cada
               regra dele é prefixada por `.impact-scroll[data-dirigindo]`
               (`globals.css:9119`, `:10818`, `:10923`) e o atributo não é mais
               escrito, porque `dirigindo` é `false` cravado em `:315`. Hoje a
               caixa não tem altura nenhuma imposta;
            2. `percursoRef` é a caixa que o efeito mede para calcular `ETAPAS_FIM`;
               a medição sobrevive à ausência de rodapé (a razão simplesmente tende
               a 1) e continua sendo o que protege a partitura de mudanças de
               altura futuras. INERTE: o efeito retorna na primeira linha
               (`if (!dirigindo) return`, em `:526`), então nenhuma medição corre —
               `ETAPAS_FIM` fica no `ETAPAS_FIM_PADRAO`, que é exatamente por que
               aquele `0.94` NÃO pode ser trocado por um valor "mais atual";
            3. desfazê-la devolveria o sticky à seção inteira, que é o arranjo que
               a SIS-101 desmontou — e a próxima peça que alguém puser depois do
               palco cairia no mesmo defeito descrito no segundo parágrafo, que
               continua sendo a única explicação escrita dele. Esta é a única das
               três que vale HOJE, e ela é sobre o futuro do arquivo, não sobre a
               tela de agora.
          Em uma frase: as razões 1 e 2 voltam a valer no minuto em que alguém
          religar `dirigindo` (as três linhas comentadas em `:313`), e a caixa é
          pré-requisito das duas. Apagá-la agora é barato e só cobra depois.
          Se um dia esta seção voltar a ter rodapé, a caixa já está pronta: era esse
          o serviço, e ele continua disponível. */}
      <div ref={percursoRef} className="impact-percurso">
      <div ref={palcoRef} className="impact-sticky">
        <div className="impact-topo">
          {/* Emenda de entrada COMENTADA: era ela a faixa clara e plana no topo da
              seção, que anunciava a passagem em vez de escondê-la.

              Ela achatava a borda de cima para `#0875c5` chapado ao longo de
              200px, para casar com a saída de Soluções — necessário só enquanto o
              degradê era resolvido contra a caixa de cada seção. Agora as duas
              pintam o mesmo `--fundo-marca` ancorado na JANELA
              (`background-attachment: fixed`, ver a nota no `:root` do
              `globals.css`), e as bordas coincidem sozinhas.

              Comentada, e não removida: a regra `.impact-emenda` do `globals.css`
              está comentada junto, com a mesma nota.
          <span aria-hidden className="impact-emenda" />
          */}
          <div className="container-lp impact-topo-inner">
            {/* SIS-74 — trilha de metadados: sobretítulo, fio e marcador na MESMA
                linha, imediatamente acima do título.

                Antes o título ficava à esquerda e o marcador na ponta oposta da
                faixa, com meia tela de vazio entre os dois: o `03 / 07` lia como
                um widget avulso, sem dono, e a faixa toda ficava com a silhueta
                genérica de "título à esquerda, coisa à direita". Aqui o marcador
                é legenda do bloco — está a um fio de distância do texto que ele
                numera, e o alinhamento é o do sobretítulo, não o da borda da
                tela. O fio é curto de propósito: ele ENCOSTA os dois, não os
                separa de ponta a ponta. */}
            <div className="impact-topo-meta">
              <p className="impact-eyebrow">Sistran em números</p>
              <span aria-hidden className="impact-meta-fio" />

              {/* Marcador de etapa. O numero em texto é o que cumpre "nao indicar
                  o item ativo so por cor"; os traços sao reforco visual.

                  SIS-165 — SÓ NO MODO DIRIGIDO, e como `dirigindo` agora é
                  sempre `false` (ver a nota longa lá) ele não entra em nenhuma
                  largura. O motivo é que ele deixou de ter o que numerar: com os
                  sete na tela ao mesmo tempo não existe "o terceiro de sete" —
                  existe o terceiro, ali, ao lado dos outros seis. `03 / 07`
                  descrevia um percurso, e o percurso saiu.
                  Comentar o bloco no lugar era impossível: ele já contém um
                  comentário JSX por dentro (o trilho de pontos da SIS-74) e
                  comentários não aninham. Fica sob `dirigindo`, que é o mesmo
                  mecanismo usado no resto da cena. */}
              {dirigindo && (
              <div className="impact-marcador">
                <p className="impact-marcador-num">
                  <span className="impact-marcador-atual">{doisDigitos(ativo + 1)}</span>
                  <span aria-hidden> / </span>
                  <span className="impact-marcador-total">{doisDigitos(TOTAL)}</span>
                </p>
                {/* Trilho de sete pontos COMENTADO (orquestração visual,
                    Prioridade 2).

                    A seção tinha QUATRO leituras simultâneas do mesmo progresso:
                    o `03 / 07` em texto, estes pontos ao lado dele, os nodes na
                    curva e a régua no pé do palco — mais a faixa de atalhos, que
                    também mostra qual é o ativo. Cinco maneiras de responder
                    "onde estou", nenhuma delas errada isoladamente, e juntas um
                    ruído: o olho procura qual delas é a oficial.

                    O corte fica com os dois canais que fazem algo que os outros
                    não fazem: o `03 / 07` em texto (informação exata, e o único
                    que não depende de cor nem de posição) e a faixa de atalhos
                    (o único que também NAVEGA, e o canal de teclado da cena).
                    Os nodes na curva ficam porque não são um indicador de
                    progresso avulso — são a própria linha-sinal da narrativa
                    passando pelos indicadores; apagá-los tiraria o motivo
                    visual, não uma duplicata.

                    Estes pontos eram o mais dispensável: repetiam, em cor e a um
                    centímetro de distância, exatamente o que o número ao lado já
                    dizia com precisão. Comentado, e não removido: as regras
                    `.impact-trilho*` do `globals.css` estão comentadas junto,
                    com a mesma nota. Religar é descomentar os dois.
                <div aria-hidden className="impact-trilho">
                  <span className="impact-trilho-aceso" />
                  {METRICS.map((m, i) => (
                    <span
                      key={m.id}
                      className="impact-trilho-ponto"
                      data-estado={i === ativo ? 'ativo' : i < ativo ? 'feito' : 'proximo'}
                    />
                  ))}
                </div>
                */}
              </div>
              )}
            </div>

            {/* O ponto final em ciano é um `span` proprio: é pontuacao, nao
                palavra, e nao deve entrar no gradiente do titulo.

                SIS-165 — o ciano deixa de ser SÓ o ponto e passa a ser a última
                PALAVRA, como na referência: "…o mercado de **seguros.**". O texto
                não muda uma letra — segue o mesmo do `copy-lock.json` —, muda de
                quem é o destaque. O ponto continua num `span` próprio dentro do
                destaque porque a razão original não caducou: ele é pontuação, e
                o gradiente do título é `background-clip: text` (ver
                `.impact-titulo`), que numa glifa de 4px de largura sai como uma
                mancha e não como cor. */}
            <h2 id="impact-titulo" className="impact-titulo">
              Escala que transforma o mercado de{' '}
              <span className="impact-titulo-destaque">
                seguros
                <span className="impact-ponto">.</span>
              </span>
            </h2>

            {/* SIS-165 — LUGAR RESERVADO, e deliberadamente vazio: o parágrafo de
                apoio e os três microrrótulos da referência NÃO entram nesta
                passada. O texto deles não existe em `.claude/conteudo-site/`, e
                escrevê-lo aqui seria decisão de conteúdo tomada no código, que é
                o que a Regra Zero proíbe. Fica o lugar e fica a referência, para
                quem aprovar o texto saber exactamente onde ele vai:

                  <p className="impact-apoio">[parágrafo de apoio — 1 a 2 linhas,
                    entre o título e a fileira]</p>
                  <ul className="impact-microrrotulos">
                    <li>[microrrótulo 1]</li>
                    <li>[microrrótulo 2]</li>
                    <li>[microrrótulo 3]</li>
                  </ul>

                Os microrrótulos são caixa-alta pequena, e é por isso que eles são
                o item mais provável de reprovar no contraste sobre o azul-marinho
                — quem os aprovar precisa remedir. Nenhum CSS foi adiantado para
                eles: classe sem uso é classe que envelhece sozinha. */}

            {/* SIS-165 — `ROLE PARA REVELAR`. Entra porque diz a verdade sobre o
                que acontece: os sete estão todos aqui, e o que a rolagem faz é
                acendê-los. Não é instrução para alcançar conteúdo — se ninguém
                rolar, e se o efeito nunca correr, os sete continuam legíveis
                (ver a nota de `acesos`). É por isso que ele pode ser
                `aria-hidden`: para quem ouve, não há nada a revelar. */}
            <p aria-hidden className="impact-role">
              <span className="impact-role-fio" />
              ROLE PARA REVELAR
            </p>
          </div>
        </div>

        <div className="impact-palco">
          {/* SIS-64 — fronteira claro/escuro em curva larga, comentada.

              Ela separava a faixa clara do palco escuro, preenchida com a cor da
              faixa. Depois de SIS-61 não existem mais dois fundos: faixa e palco
              são o mesmo `--fundo-marca`, então não há fronteira para desenhar — e
              a barriga em `#e7f0f9` viraria uma mancha clara atravessando o azul.

              Era também a origem das sujeiras nos cantos que a task descreve:
              `preserveAspectRatio="none"` sobre um viewBox de 1440x120 esticava o
              path na horizontal em telas largas, a espessura aparente mudava com a
              largura e as pontas deixavam de encostar limpas nas bordas.

              Comentada, e não removida: as regras `.impact-borda` do `globals.css`
              estão comentadas junto, com a mesma nota. Religar é descomentar os
              dois — e o path teria de fechar nas duas bordas sem depender de
              `preserveAspectRatio="none"`.
          <svg
            aria-hidden
            className="impact-borda"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
          >
            <path d="M0 0 H1440 V44 C 1180 96 980 22 720 52 C 470 80 250 118 0 74 Z" />
          </svg>
          */}

          <span aria-hidden className="impact-grade" />

          {/* SIS-165 — CURVAS DE LUZ e MALHA DE PONTOS, o fundo gráfico da
              referência. Nenhum arquivo novo: a malha é a `.impact-grade` logo
              acima (duas linhas em `linear-gradient`, que a SIS-165 passou a
              pontilhar) e as curvas são este SVG inline, três `<path>` sem
              preenchimento. `aria-hidden` porque não dizem nada — e é isso que os
              autoriza a existir: são a única decoração que entrou.

              `preserveAspectRatio="none"` aqui é seguro, ao contrário do que era
              na `.impact-borda` (ver a nota dela): lá o problema era a ESPESSURA
              aparente do traço mudar com a largura da tela e as pontas deixarem de
              encostar limpas nas bordas. Estas curvas usam
              `vector-effect="non-scaling-stroke"`, então a espessura é 1px real em
              qualquer largura, e elas atravessam o quadro de borda a borda de
              propósito — não há ponta para encostar torto.

              SEM FOTO DE PRÉDIO. A referência traz uma; ela não entra, e o lugar é
              aqui — logo atrás da fileira, à direita. O arquivo não existe no
              repositório e escolher uma imagem institucional é decisão de
              conteúdo, não de layout. Quando houver, entra como
              `<Image aria-hidden className="impact-predio" … />` neste ponto,
              com `next/image` e sem `priority` (esta seção não é o LCP da home). */}
          <svg
            aria-hidden
            className="impact-curvas"
            viewBox="0 0 1440 620"
            preserveAspectRatio="none"
            focusable="false"
          >
            <path
              vectorEffect="non-scaling-stroke"
              d="M-40 470 C 300 470 460 300 720 300 C 980 300 1140 130 1480 130"
            />
            <path
              vectorEffect="non-scaling-stroke"
              d="M-40 540 C 320 540 500 380 720 380 C 940 380 1120 220 1480 220"
            />
            <path
              vectorEffect="non-scaling-stroke"
              d="M-40 610 C 340 610 540 460 720 460 C 900 460 1100 310 1480 310"
            />
          </svg>

          {/* A cena. Tres camadas com a MESMA referencia (pixels do palco):
              o caminho (estacionario, com a curva transladada dentro), a lente
              (estacionaria no centro) e a trilha do conteudo (transladada).
              As variaveis de geometria ficam aqui — e nao no `.impact-sticky`,
              onde o ScrollTrigger escreve as de progresso: um re-render do React
              limparia da `style` tudo o que ele nao declara. */}
          <div
            ref={cenaRef}
            className="impact-cena"
            style={
              {
                '--impact-vao': `${coord(geo.vao)}px`,
                '--impact-centro': `${coord(geo.centroX)}px`,
                '--impact-linha': `${coord(geo.centroY)}px`,
              } as React.CSSProperties
            }
          >
            {/* Boca de entrada da onda: a beira esquerda do palco, na altura da
                linha-base. É aqui que a travessia vinda de Soluções
                (`SolutionsToMetrics`) pousa, para o fio de lá e a onda de cá
                lerem como UM traço atravessando a emenda. Um ponto, medido por
                `getBoundingClientRect` — a travessia não estima nada. */}
            <span aria-hidden data-fio-chegada className="impact-chegada-fio" />

            {/* O caminho é mascarado com um buraco circular no centro: a curva
                chega na borda da lente, desaparece e reaparece do outro lado —
                nunca por cima do numero, do rotulo ou da legenda. */}
            <div aria-hidden className="impact-caminho">
              <div className="impact-trilha-curva">
                {/* Duas camadas sobre o MESMO `d`: linha-base e trecho aceso.
                    `viewBox` e `width`/`height` em pixels iguais, entao 1 unidade
                    = 1 px e o `clip-path` do aceso corta no lugar exato. */}
                <svg
                  className="impact-curva"
                  viewBox={`0 0 ${coord(geo.largura)} ${coord(geo.altura)}`}
                  width={coord(geo.largura)}
                  height={coord(geo.altura)}
                >
                  <path className="impact-curva-base" d={geo.d} />
                  {/* Linha-base da passagem aos parceiros: a MESMA curva com
                      amplitude zero. As duas se cruzam por `opacity`, dirigidas
                      por `--impact-aterrar`, no último trecho do percurso — a
                      onda assenta e o que segue para a seção seguinte é uma reta.
                      Ver `criarPlano` em `geometria.ts`. */}
                  <path className="impact-curva-plana" d={geo.dPlano} />
                </svg>
                <div className="impact-curva-recorte">
                  <svg
                    className="impact-curva"
                    viewBox={`0 0 ${coord(geo.largura)} ${coord(geo.altura)}`}
                    width={coord(geo.largura)}
                    height={coord(geo.altura)}
                  >
                    <path className="impact-curva-viva" d={geo.d} />
                  </svg>
                </div>

                {/* Nodes: saem do `<li>` e vem para a trilha da curva. É a unica
                    forma de eles ficarem SOBRE a curva enquanto o conteudo do
                    indicador fica deslocado acima ou abaixo dela. */}
                {METRICS.map((m, i) => (
                  <span
                    key={m.id}
                    className="impact-no"
                    data-estado={i === ativo ? 'ativo' : i < ativo ? 'feito' : 'proximo'}
                    /* Distancia (em etapas) até o indicador da vez, saturada em 3.
                       É ela que faz o aglomerado rarefazer conforme se afasta do
                       centro: o CSS liga os satelites por faixa de distancia. Vem
                       do render, e nao do ScrollTrigger, porque só muda quando a
                       etapa muda — nao a cada quadro. */
                    data-dist={Math.min(3, Math.abs(i - ativo))}
                    style={{ '--impact-i': i } as React.CSSProperties}
                  />
                ))}

                <span className="impact-pulso" />
              </div>
            </div>

            {/* A lente. Fica FORA da trilha transladada: é ela que define o
                centro da cena, e o que se move é a trilha por baixo. Antes ela
                pertencia ao item ativo e herdava o deslocamento — por isso nunca
                caia no centro da tela. Centro transparente: o numero, que
                continua no `<li>`, aparece por cima. */}
            <span aria-hidden className="impact-lente">
              {/* SIS-74 — a lente era um anel de radar: três anéis concêntricos
                  girando em velocidades diferentes, 36 ticks radiais, um arco de
                  progresso circular com bolinha orbitando e uma varredura cónica
                  por cima. Cada peça tinha justificação própria, e somadas
                  produziam exatamente o clichê de HUD de ficção científica — a
                  moldura chamava mais atenção que o número que ela existia para
                  emoldurar.

                  No lugar: um PAINEL. Moldura retangular de 1px com cantos em
                  esquadro (marca de corte, vocabulário de prancha técnica), e o
                  progresso numa barra reta na aresta de cima. A mesma informação
                  — em que ponto do percurso a cena está — lida num gesto que não
                  gira: barra que enche da esquerda para a direita, na mesma
                  direção em que a trilha anda.

                  Os quatro esquadros são um `<path>` só: são o mesmo traço em
                  quatro cantos, e separá-los em quatro nós seria quatro nós para
                  manter a mesma espessura. `vectorEffect` mantém 1px real em
                  qualquer largura de painel — sem ele o `viewBox` esticado
                  engrossaria o traço na horizontal. */}
              <svg
                className="impact-moldura"
                viewBox="0 0 100 62"
                preserveAspectRatio="none"
                focusable="false"
              >
                <rect
                  className="impact-moldura-caixa"
                  x="0.5"
                  y="0.5"
                  width="99"
                  height="61"
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  className="impact-moldura-esquadro"
                  vectorEffect="non-scaling-stroke"
                  d="M0.5 12V0.5H12 M88 0.5H99.5V12 M99.5 50V61.5H88 M12 61.5H0.5V50"
                />
              </svg>

              {/* Barra de progresso na aresta de cima. `scaleX` a partir da
                  esquerda, dirigido por `--impact-etapa` — a MESMA variável que
                  o único ScrollTrigger da seção já escreve, nenhum gatilho novo.
                  Nó próprio para o `transform` ter um dono só (a lição de
                  SIS-42). */}
              <span className="impact-barra">
                <span className="impact-barra-viva" />
              </span>

              {/* Um contextual só, o do indicador da vez: a lente é unica. */}
              <span className="impact-contextual" key={METRICS[ativo]?.id}>
                <ImpactVisual nome={METRICS[ativo]?.visual} />
              </span>
              {/* Marca de chegada: onde a curva entra na máscara, na aresta
                  esquerda do painel. Era uma bolinha branca com dois halos
                  ciano; virou um traço vertical rente à aresta, do mesmo
                  vocabulário dos esquadros. */}
              <span className="impact-chegada" />
            </span>

            <div className="impact-track">
              <ol
                ref={fileiraRef}
                className="impact-lista"
                aria-label="Indicadores institucionais da Sistran"
                /* SIS-165 — o atributo que LIGA o apagamento, e ele mora no pai
                   de propósito: uma chave só, escrita depois de os sete estarem
                   conferidos pelo efeito. Sem ela o CSS pinta a fileira acesa,
                   que é o estado final e o padrão. */
                        >
                {METRICS.map((m, i) => (
                  <li
                    key={m.id}
                    className="impact-item"
                    /* SIS-165 — âncora da conferência. `data-indicador-i` e não
                       `nth-child` no JS: o índice fica escrito no nó, então quem
                       confere os retângulos não precisa reconstruir a ordem. */
                    data-indicador-i={i}
                    /* `data-aceso` é escrito SEMPRE, inclusive antes da primeira
                       conferência, e isso é seguro: quem decide se "nao" significa
                       apagado é o `data-observando` da FILEIRA, que só aparece
                       depois. Sem ele, o CSS ignora este atributo e pinta o
                       indicador aceso. Duas condições no mesmo lugar davam a
                       impressão de dupla proteção e na prática eram um render
                       extra — a proteção está no seletor, não aqui. */
                    data-aceso={acesos.has(i) ? 'sim' : 'nao'}
                    data-estado={i === ativo ? 'ativo' : i < ativo ? 'feito' : 'proximo'}
                    /* SIS-62 — `data-dist` e `data-lado`, os dois derivados do que
                       o item já tem. `data-dist` é a distancia em etapas até o
                       ativo (0..3), o MESMO canal que os nodes usam: é ele que
                       rarefaz os vizinhos por distancia, em vez da opacidade fixa
                       que pesava igual no vizinho de ao lado e no da ponta da tela.
                       `data-lado` diz para que lado da onda o bloco foi empurrado,
                       e é o que orienta a haste. */
                    data-dist={Math.min(3, Math.abs(i - ativo))}
                    data-lado={(DESVIOS_TRILHO[i] ?? 0) < 0 ? 'acima' : 'abaixo'}
                    /* Posicao vai por variavel, nao por `left`/`top` inline:
                       estilo inline venceria o CSS do modo lista, e ai a lista
                       vertical nasceria com os itens espalhados. O resto do calculo
                       é o vao comum, compartilhado com a curva e com os nodes.

                       `--impact-haste` é o MODULO do mesmo desvio: a distancia do
                       centro do bloco até a onda. Nao é numero novo — sai de
                       `DESVIOS_TRILHO`, a mesma fonte da posicao. */
                    style={
                      {
                        '--impact-i': i,
                        '--impact-desvio': `${DESVIOS_TRILHO[i] ?? 0}px`,
                        '--impact-haste': `${Math.abs(DESVIOS_TRILHO[i] ?? 0)}px`,
                      } as React.CSSProperties
                    }
                  >
                    {/* Haste que liga este bloco ao seu node na onda. O bloco e o
                        node já nascem no mesmo x, mas o bloco é empurrado na
                        vertical para nao brigar com a lente, e nada preenchia esse
                        vao: o numero lia como solto no palco em vez de pendurado no
                        percurso. Decorativa, e por isso `aria-hidden`. */}
                    <span aria-hidden className="impact-haste" />
                    {/* Ordinal decorativo: a posicao no percurso ja vem da `<ol>`,
                        entao repeti-la em texto acessivel seria leitura dobrada. */}
                    <p aria-hidden className="impact-indice">
                      {doisDigitos(i + 1)}
                    </p>

                    {/* Nada aqui é `sr-only`: o numero e o sufixo SAO o texto
                        acessivel. A versao anterior duplicava o valor num
                        `sr-only` para poder esconder o contador do leitor de
                        tela, e era essa copia que aparecia sobreposta ao numero.
                        Com o valor real no HTML a copia perdeu a razao de
                        existir — e é por isso que o numero continua aqui, no
                        item, e nao dentro da lente: duplicar o valor la faria o
                        leitor de tela ler cada indicador duas vezes. */}
                    <p className="impact-valor">
                      {/* SIS-165 — o gatilho da contagem passa a ser "acendeu",
                          não "virou o ativo". No modo dirigido havia UM ativo e a
                          contagem era dele; na fileira estática os sete acendem
                          conforme a rolagem passa, cada um contando uma vez. A
                          expressão guarda os dois casos — o de cima está inerte
                          enquanto `dirigindo` for `false` (ver a nota lá).
                          Sem conferência (efeito que não correu, ou movimento
                          reduzido) `acesos` fica vazio, nada conta, e o que fica
                          na tela é o valor final que já está no HTML. */}
                      <ImpactNumero
                        valor={m.value}
                        ativo={dirigindo ? i === ativo : acesos.has(i)}
                      />
                      {/* Fora do contador de proposito: dentro dele o `+` seria
                          reescrito a cada quadro da contagem. */}
                      <span className="impact-mais">{m.suffix}</span>
                    </p>

                    <p className="impact-rotulo">{m.label}</p>
                    {/* SIS-165 — a legenda de contexto sai por REGRA ZERO, não por
                        desenho: as sete frases são o único texto desta seção fora
                        de `.claude/conteudo-site/`. Ficam comentadas em
                        `src/data/metrics.ts`, uma por uma, com o texto integral; o
                        campo `caption` do tipo passou a opcional para permitir
                        isso. Religar é descomentar os três lugares.
                    <p className="impact-caption">{m.caption}</p>
                    */}
                  </li>
                ))}
              </ol>
            </div>

            {/* Régua do pé do palco COMENTADA (orquestração visual, Prioridade 2).

                Era a terceira leitura do progresso: traços em
                `repeating-linear-gradient` e, por cima, a mesma régua em ciano
                recortada pelo avanço. A justificação original — "dá escala ao
                percurso sem acrescentar texto" — perdeu o objeto: a faixa de
                atalhos ocupa a mesma aresta inferior do palco, mostra os sete
                ordinais e marca o ativo, então a escala do percurso já está
                escrita ali, com números em vez de traços, e clicável.

                Duas réguas na mesma borda também competiam: a de traços era a
                que parecia interativa e não era.

                Comentada, e não removida: as regras `.impact-regua*` do
                `globals.css` estão comentadas junto, com a mesma nota. Religar
                é descomentar os dois — e então rever a faixa de atalhos, porque
                as duas dividem a aresta.
            <span aria-hidden className="impact-regua">
              <span className="impact-regua-viva" />
            </span>
            */}
          </div>

          {/* SIS-73 — faixa de atalhos. Fica FORA do `.impact-cena`, direto no
              palco, pelo mesmo motivo da lente: `.impact-track` e
              `.impact-trilha-curva` recebem `transform` por quadro, e um alvo de
              clique que anda 1400px na horizontal é um alvo que ninguém acerta.

              Só existe no modo dirigido — `dirigindo` é `false` abaixo de 1024px
              e com movimento reduzido, e nesses casos a seção é a lista completa
              dos sete indicadores. Não há por que oferecer atalho para o que já
              está todo na tela, e transformar a lista em tabs esconderia seis dos
              sete atrás de interação.

              `<nav>` com botões, não `role="tablist"`: são sete destinos dentro da
              MESMA cena, não sete painéis alternáveis. O leitor de tela que
              ouvisse "aba" esperaria trocar de conteúdo, e o que acontece é a
              rolagem andar. */}
          {dirigindo && (
            <nav className="impact-atalhos" aria-label="Ir para um indicador">
              {METRICS.map((m, i) => (
                <button
                  key={m.id}
                  type="button"
                  className="impact-atalho"
                  /* `aria-current` é o sinal semântico do ativo, e o ordinal em
                     texto mais o peso da fonte são os sinais visuais
                     não-cromáticos — a borda ciano é reforço, nunca a única
                     informação. */
                  aria-current={i === ativo ? 'true' : undefined}
                  data-estado={i === ativo ? 'ativo' : undefined}
                  /* O rótulo visível é só o ordinal, para a faixa caber nos sete
                     sem competir com a cena. O nome do indicador vai no
                     `aria-label`, senão o botão seria lido como "zero quatro". */
                  aria-label={`${doisDigitos(i + 1)} — ${m.label}`}
                  onClick={() => irParaIndicador(i)}
                >
                  <span aria-hidden className="impact-atalho-num">
                    {doisDigitos(i + 1)}
                  </span>
                </button>
              ))}
            </nav>
          )}

          <span aria-hidden className="impact-vinheta" />
        </div>
      </div>
      </div>
      {/* SIS-101 — a faixa de logos de parceiros, agora como rodapé desta seção
          em vez de seção independente. Ver a nota na abertura do
          `.impact-percurso` acima e o cabeçalho de `SignalMarquee.tsx`.

          Ela traz o próprio fundo off-white (`#f5faff`), e isso é escolha, não
          herança acidental: as 15 marcas de `clients.ts` são todas desenhadas para
          fundo claro, e esta seção pinta o degradê azul da marca. Herdar o fundo
          exigiria devolver as placas brancas do `ClientWall` — uma moldura por
          logo, que é justamente o peso que a faixa não tem. A superfície clara é
          também o que emenda no creme da montagem logo depois (EMENDA 4, em
          `legacy.css`), então a faixa continua fazendo o trabalho de transição que
          fazia solta, só sem os chanfros órfãos.

          Sem `aria-hidden` e sem wrapper: o componente já é um `role="region"`
          rotulado, e não tem texto — não precisa da serifa editorial que o
          envolvia na home. */}
      {/* ══════════════════════════════════════════════════════════════════════
          SIS-179 — A GRADE TAMBÉM SAIU DAQUI. ESTE BLOCO É HERANÇA.

          O `<BrandGrid />` que este comentário inteiro explica não é montado mais
          nesta seção: subiu para logo depois do hero, em `src/app/page.tsx`. Nada
          fecha "Sistran em números" agora — a seção termina na própria partitura.
          O bloco fica, pela regra da casa, porque cada um dos quatro parágrafos
          abaixo continua sendo o único registro de uma decisão que ainda vale ou
          de um defeito que ainda pode voltar. Leia cada um com a ressalva que o
          acompanha.

          ⚠️ NÃO RECALCULE `ETAPAS_FIM_PADRAO` POR CAUSA DESTA MUDANÇA. É a
          armadilha desta issue: o quarto parágrafo abaixo diz que a grade mede
          ~690px contra os ~130px da faixa, e a saída dela tira esses ~690px da
          caixa do percurso — a leitura natural é "então o 0,94 mudou". Está
          errado, e a razão é o próprio conserto da SIS-156: `ETAPAS_FIM` deixou de
          ser número e passou a ser RAZÃO MEDIDA do DOM (`etapasFimRef` nasce com
          `ETAPAS_FIM_PADRAO` e é reescrito pelo efeito que mede a razão entre a
          caixa de `percursoRef` e a seção; quem lê é a partitura). Tirar a grade
          faz a razão se recalcular sozinha na primeira medição. O `0,94` é só o
          valor de partida antes dela.
          Os números 690/130/527 são, portanto, o HISTÓRICO de por que a razão
          passou a ser medida — e a saída da grade sem uma linha de código alterada
          é a prova de que a medição funciona. Era isso que o parágrafo queria
          dizer; escrito como estava, ele convidava ao recálculo.
          ══════════════════════════════════════════════════════════════════════

          SIS-156 — a FAIXA ROLANTE saiu daqui e entrou a grade estática
          (`BrandGrid`), no formato de `terminal-industries.com`: título editorial
          acima e as marcas paradas numa malha de linhas finas. O
          `<SignalMarquee />` fica comentado, não deletado:

              <SignalMarquee />

          Ele NÃO saiu do projeto — `/contato:133` e
          `/parceiros-e-implementacoes:105` continuam montando a faixa rolante, e
          essa divergência é deliberada: a issue troca só a home. Por isso também
          nenhum CSS ficou órfão com a troca (o kit `.marquee-*` de `globals.css` e
          o desenho `.lp-signals`/`.lp-partner` de `legacy.css` seguem com dois
          consumidores) — não há o que comentar lá, e comentar seria quebrar as
          outras duas telas.

          O que a grade traz de volta é o TÍTULO, que era a metade da referência
          que a faixa não tinha (a nota da SIS-101 em `page.tsx` registra que o
          wrapper de serifa editorial não a acompanhou porque "a faixa é só logos,
          não tem uma palavra de texto"). O texto é aprovado e está no
          `copy-lock.json`, na mesma passada desta implementação — fora dele, a
          próxima varredura o trataria como cópia solta e o reescreveria.

          A EMENDA continua resolvida pelo mesmo recurso: a grade traz o mesmo
          off-white `#f5faff` da faixa e o mesmo `border-bottom` de `--line`, então
          quem costura o palco escuro acima e o creme da montagem abaixo é a
          superfície clara, como antes. Nada de `NotchDivider` — ver o parágrafo do
          `.impact-percurso` no topo desta seção.

          ⚠️ SIS-179 — ESTE É O PARÁGRAFO QUE A MUDANÇA DESFAZ, E É ACHADO ABERTO.
          A superfície clara que costurava aqui era a da GRADE, e a grade levou o
          `#f5faff` embora. A emenda que ela costurava — palco escuro acima, creme
          da montagem abaixo — fica descoberta, e é o espelho exato do ganho da
          issue: fecha-se a aresta debaixo do hero e abre-se uma aqui.
          Medido, não argumentado (números no relatório da SIS-179). A correção não
          é desta issue: ela é ou devolver uma superfície clara a este fim de seção,
          ou aceitar o degrau como aresta legítima entre duas cenas. Fica escrito
          para que o próximo não descubra o degrau sem saber de onde veio.

          E O QUE FOI MEDIDO, porque é o que quebrou em silêncio de verdade: a caixa
          do percurso mede 340vh MAIS a altura deste rodapé, e a grade é ~690px
          contra os ~130px da faixa. Com `ETAPAS_FIM` cravado em `0.94`, a sétima
          etapa passou a ser alcançada 527px DEPOIS de o palco começar a sair do
          topo — `07 / 07` fora de quadro, cena aparentemente intacta. A correção
          está em `ETAPAS_FIM_PADRAO` e no efeito que mede a razão entre as duas
          caixas.
          ABAIXO de 1024px não há partitura a conferir, e isso é achado, não
          desculpa: `dirigindo` exige `min-width: 1024px`, então na arrumação de
          cinco fileiras a seção é a lista completa, sem sticky e sem etapas. A
          grade mais alta não tem o que reescalar lá.
          Medido em 1440×900, 1366×768 e 900×800 por
          `scripts/medir-percurso-marcas.mjs` — que mediu o ARRANJO ANTERIOR à
          SIS-179, com a grade ainda aqui. */}
      {/* SIS-179 — o mount saiu daqui, e fica comentado em vez de apagado porque é
          o registro de que esta seção já teve rodapé, e de que devolvê-lo é uma
          linha:

              <BrandGrid />

          O `import` correspondente também está comentado no topo do arquivo. */}
    </section>
  );
}
