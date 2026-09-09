'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import Image from 'next/image';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { EVENTS } from '@/data/events';
import { useReducedMotion } from '@/lib/motion';

/* ============================================================================
   SIS-160 · Mosaico de abertura de /eventos-inovacao
   ----------------------------------------------------------------------------
   A estrutura vem da apresentação Transformação de Legado (seção `#sinais`):
   cartões espalhados em posição absoluta, subindo em DUAS velocidades de
   parallax a partir de um único `useScroll`, cada cartão em TRÊS camadas.
   Aqui a mídia deixa de ser bloco abstrato e passa a ser a foto dos quinze
   eventos.

   AS CINCO DECISÕES DO PONTO 12 DA ISSUE, como foram implementadas:

   (a) O MOSAICO É ABERTURA, NÃO SUBSTITUIÇÃO. Ele entra ANTES do palco, e o
       palco continua inteiro — é lá que se lê (título, descrição e categoria dos
       quinze eventos não existem em outro lugar da rota). Por isso este é um
       COMPONENTE NOVO, montado em `src/app/eventos-inovacao/page.tsx` entre o
       `HeroVideoBackdrop` e o `<EventsGrid />`, e nenhuma linha do `EventsGrid`
       precisou mudar.
   (b) OS FILTROS CONTINUAM GOVERNANDO O PALCO e não tocam o mosaico — e aqui
       isso é ESTRUTURAL, não uma regra a respeitar: o estado `filter` vive dentro
       do `EventsGrid`, e este componente lê `EVENTS` direto. A composição não se
       rearranja a cada clique porque ela não conhece o filtro, e a armadilha do
       `:nth-child` (posição de cartão mudando com a lista filtrada) não existe:
       cada cartão recebe a própria posição por índice do catálogo.
   (c) A FACE É 16:9, COM `thumb`. Os `3 / 4` da origem não vêm: treze das fotos
       são 1672x941, documentais, e recortadas para retrato em ~200px de largura
       entregam mancha, não fotografia (o mesmo motivo que já está escrito no
       cabeçalho do `EventsGrid.tsx`). Consequência aceita: cartão landscape ocupa
       mais largura, então a densidade do mosaico é menor que na origem.
   (d) OS QUINZE EVENTOS, TODOS. Um subconjunto exigiria critério editorial de
       escolha, que não sai do código.
   (e) FUNDO CLARO — a decisão foi REVERTIDA (a versão anterior era navy, pelo
       risco da SIS-107). O que a reversão custou não foi trocar uma cor: o bloco
       passou a ficar entre DOIS vizinhos escuros (o hero fecha em
       `rgb(4 27 61 / 78%)`, e `.evento-cena` abre em `#041d37`), então são duas
       fronteiras novas. As duas são resolvidas DENTRO deste bloco, por degradê:
       ele nasce no navy do hero, clareia, e volta a fechar em `#041d37`. Não há
       faixa clara nascendo do nada — e não há emenda nova em cima das duas que a
       rota já tem, porque quem muda de cor é o próprio bloco. Consequência
       aproveitada: no alto do bloco o fundo AINDA é navy, e é exatamente onde o
       fio ciano do hero desemboca — o elo por LINHA sobrevive sem repintura.
       Ver `.eventos-mosaico` e `.eventos-mosaico-fio` no `globals.css`.

   TÍTULO NA ABERTURA, e NENHUMA OUTRA ESCRITA. O bloco central da origem entra
   como `.eventos-mosaico-titulo`: sticky, com a deriva amortecida por mola. Ele
   traz SÓ "Eventos & Inovação", como `h2` — o sobretítulo e a linha de apoio da
   origem NÃO vêm, porque as duas seriam escrita nova, e escrita nova não sai de
   código (é o que deixou a SIS-156 parada). O `h1` continua sendo o do hero.
   O texto do `h2` não é redação nova: é o mesmo rótulo do menu que o hero já
   imprime, e `.claude/conteudo-site/06-eventos-inovacao.md` diz que a página não
   tem heading próprio — daí `h2`, e não um segundo `h1`.

   LEGENDA EM CADA CARTÃO, com o título do evento, e também sem redação nova: o
   campo `title` de `src/data/events.ts` já está no formato pedido, com o mesmo
   separador (`'Web Summit AI · Ofertas Personalizadas de Seguros'`). É consumo de
   campo existente.

   OS QUINZE CARTÕES CONTINUAM `aria-hidden`, e agora isso é DECISÃO com texto na
   tela, não ausência de texto: os quinze títulos são anunciados um a um pelo
   palco logo abaixo, com descrição e categoria. Sem o `aria-hidden`, a rota
   anunciaria os quinze nomes duas vezes antes de o leitor chegar ao conteúdo.
   Texto visível e escondido do leitor é o certo aqui justamente porque é
   REPETIÇÃO LITERAL. E nenhum cartão é focável ou clicável, então continua não
   havendo beco sem saída de teclado — é por isso que o `aria-hidden` vai no
   CARTÃO e nunca na camada.
   Com texto na tela o contraste passa a ter alvo de verdade: título e legendas
   medidos, número por número, no relato da issue.

   MOBILE NÃO RECEBE O MOSAICO (`display: none` abaixo de `lg`), pelo mesmo
   critério que já vale para o palco e para o navegador nesta rota: 390px não é
   esta cena estreitada. Como é decoração, esconder não tira informação nenhuma —
   e com `display: none` + `loading="lazy"` as quinze miniaturas nem chegam a ser
   baixadas ali (a mesma apuração já registrada na foto mobile do `EventsGrid`).
   ========================================================================== */

/* Deslocamento de parallax, em px, nas duas velocidades da origem. O sinal é
   invertido no caminho (`[0, 1] -> [+d, -d]`): o cartão sobe conforme a seção
   atravessa a janela. */
const LENTO = 110;
const RAPIDO = 230;

/* Posição de cada cartão, em porcentagem da caixa da seção: `[x, y]`, canto
   superior esquerdo. São quinze pares, na ordem de `EVENTS`.

   POR QUE NÚMEROS À MÃO e não um `:nth-child` como na origem: o `.tile-N` de lá
   é seletor de posição, e seletor de posição é justamente a armadilha que o ponto
   3 da issue nomeia. Aqui a posição vem do índice do catálogo, então o Web Summit
   está sempre no mesmo lugar do mosaico.

   AS QUINZE POSIÇÕES FORAM REFEITAS DUAS VEZES quando a legenda entrou, e a
   segunda vez porque a primeira estava resolvendo o problema errado.
   A composição original (espalhada livremente entre 3% e 80%) produziu quatro
   pares sobrepostos — medido no navegador em 1024/1366/1440/1920. A primeira
   correção foi vertical: cinco fileiras em faixas de 18%, contando que 18% de
   passo é maior que a altura do cartão. Medido de novo, ainda havia de dois a
   quatro pares sobrepostos, e a conta explicava por quê: PASSO DE FILEIRA NÃO
   GOVERNA NADA AQUI, porque cada cartão carrega um deslocamento próprio maior que
   a folga entre fileiras — o parallax move as duas velocidades da origem em até
   110px e 230px, ou seja até 240px de deslocamento RELATIVO entre um cartão e o
   vizinho de baixo, contra ~20px de folga entre fileiras em 1920. Nenhuma escolha
   de porcentagem vertical sobrevive a isso; empilhar mais folga só encolheria o
   cartão até a legenda não caber.
   Quem resolve, então, é o EIXO HORIZONTAL: dois cartões só podem se cobrir se as
   faixas horizontais deles se cruzarem. As fileiras alternam entre DOIS CONJUNTOS
   DE COLUNAS deslocados — A em 2/36/70 e B em 18/52/84 — de modo que nenhuma
   coluna de uma fileira cruza a faixa da fileira vizinha. A folga mais estreita do
   arranjo é de 3% (~31px em 1024), e é ela que fixa o teto da amplitude lateral da
   flutuação — ver a nota de `--flutua-x` em `RITMOS`. Como a sobreposição fica
   impossível, o quanto cada cartão sobe deixa de ser problema de colisão.
   Fileiras NÃO vizinhas voltam a repetir o conjunto de colunas, e aí elas se
   cruzam de novo na horizontal — mas não colidem por outro motivo, e este é
   aritmético: a velocidade alterna pela paridade do índice, o índice é `3*fileira +
   coluna`, e duas fileiras de mesma paridade distam duas fileiras, logo a mesma
   coluna cai sempre na MESMA paridade (0 e 6, 3 e 9, ...). Mesma velocidade =
   separação constante de 36% da caixa, em qualquer posição de rolagem.
   O recorte contra as bordas esquerda e direita continua sendo do `clamp()` do
   `left`, abaixo; o `84` do conjunto B foi escolhido para ficar abaixo do teto
   desse `clamp()` em 1024 (85,9%), senão a coluna seria empurrada para dentro e o
   arranjo de colunas deixaria de valer justamente na janela mais estreita. */
const POSICOES: readonly [number, number][] = [
  [2, 2],
  [36, 4],
  [70, 1],
  [18, 20],
  [52, 18],
  [84, 21],
  [2, 38],
  [36, 40],
  [70, 37],
  [18, 56],
  [52, 54],
  [84, 57],
  [2, 74],
  [36, 76],
  [70, 73],
];

/* RITMO E ÂNGULOS DE CADA CARTÃO — sete variáveis por cartão, como na origem
   (`apresentação/site/app/styles/sections.css`, o bloco de `--float-*` e
   `--tilt-*` por tile). Aqui elas vêm do componente, por ÍNDICE DO CATÁLOGO, e
   não de `:nth-child`, pelo mesmo motivo já registrado em `POSICOES`.

   `ty`/`tx` — inclinação de REPOUSO, 7 a 11° e 3 a 5°. O sinal segue o lado em
   que o cartão está: os da esquerda giram mostrando a face direita e vice-versa,
   como se a câmera estivesse no centro da seção. A versão anterior disto era um
   único `--gira` de `(i % 3) - 1`, ou seja −1°/0°/+1° — cartão plano, e sem
   `rotateX` nenhum.
   `t` — PERÍODO próprio, 4,6s a 7,5s. Antes eram 9s fixos para os quinze com
   atraso negativo, e atraso desencontra a FASE, não o período: quinze cartões com
   o mesmo período respiram juntos de novo a cada volta.
   `atraso` — desencontra a partida.
   `y`/`x`/`rot`/`ry`/`rx` — amplitude do percurso nos cinco eixos do keyframe.

   A AMPLITUDE LATERAL (`x`) É TETADA EM 12px, e o teto é conta, não gosto. O que
   impede um cartão de cobrir o vizinho é a folga horizontal entre as colunas (ver
   `POSICOES`), e a folga mais estreita do arranjo é de 3% da caixa — ~31px na
   janela de 1024. Dois cartões da mesma fileira com `x` de sinais opostos andam um
   contra o outro, então o que consome a folga é a SOMA das duas amplitudes: com os
   16px que estavam aqui, o pior par podia chegar a ~5px de distância (medido: 12px
   no pior quadro amostrado — passou, mas por sorte de amostragem, não por
   construção). Com 12px o consumo máximo é 24px e sobram ~7px em qualquer quadro,
   em qualquer fase, sem depender de medição. */
type Ritmo = {
  ty: number;
  tx: number;
  t: number;
  atraso: number;
  y: number;
  x: number;
  rot: number;
  ry: number;
  rx: number;
};

const RITMOS: readonly Ritmo[] = [
  { ty: 9, tx: 4, t: 5.4, atraso: 0, y: -40, x: 12, rot: 2.4, ry: 8, rx: -5 },
  { ty: 10, tx: 3, t: 6.6, atraso: -1.1, y: -30, x: 12, rot: 3, ry: 10, rx: -4 },
  { ty: -7, tx: -3, t: 4.8, atraso: -2.3, y: -46, x: -10, rot: -3.4, ry: -7, rx: 6 },
  { ty: 8, tx: 5, t: 7.2, atraso: -0.6, y: -33, x: 11, rot: 2.2, ry: 8, rx: -5 },
  { ty: -11, tx: 3, t: 6, atraso: -3.2, y: -43, x: -12, rot: -3, ry: -11, rx: -4 },
  { ty: 7, tx: -4, t: 5.1, atraso: -1.7, y: -36, x: 9, rot: 3.4, ry: 7, rx: 6 },
  { ty: 8, tx: 5, t: 6.9, atraso: -2.9, y: -29, x: 12, rot: 2.2, ry: 9, rx: -5 },
  { ty: -9, tx: -3, t: 5.7, atraso: -0.4, y: -48, x: -12, rot: -2.8, ry: -11, rx: 4 },
  { ty: 10, tx: 4, t: 7.5, atraso: -2.1, y: -32, x: 9, rot: 3.4, ry: 8, rx: -6 },
  { ty: -9, tx: 4, t: 4.6, atraso: -1.4, y: -38, x: -12, rot: -2.4, ry: -9, rx: -5 },
  { ty: -8, tx: -5, t: 6.3, atraso: -3.6, y: -35, x: -12, rot: -2.6, ry: -8, rx: 5 },
  { ty: 11, tx: 3, t: 5.9, atraso: -0.9, y: -44, x: 12, rot: 3.2, ry: 10, rx: -4 },
  { ty: 7, tx: 5, t: 7.1, atraso: -2.6, y: -31, x: 10, rot: 2.8, ry: 7, rx: -6 },
  { ty: -10, tx: -4, t: 4.9, atraso: -1.9, y: -47, x: -12, rot: -3.2, ry: -10, rx: 5 },
  { ty: 9, tx: 4, t: 6.4, atraso: -3.9, y: -34, x: 12, rot: 2.6, ry: 9, rx: -5 },
];

export default function EventsMosaic() {
  const rm = useReducedMotion();
  const secao = useRef<HTMLElement>(null);

  /* UM `useScroll` para os quinze cartões, como na origem. Quinze observadores
     próprios dariam quinze assinaturas de scroll para a mesma medida. */
  const { scrollYProgress } = useScroll({
    target: secao,
    offset: ['start end', 'end start'],
  });
  /* O `rm` entra no percurso por REF, e o percurso é função em vez de par de
     faixas. Motivo medido, não precaução: com `[0, 1] -> [LENTO, -LENTO]` e o
     desligamento feito na prop (`y: rm ? 0 : lento`), o cartão continuava com
     `translateY(110px)` sob `prefers-reduced-motion` — conferido no navegador,
     `transform: matrix(1,0,0,1,0,110)` com a preferência ligada. Trocar o
     MotionValue por um número na mesma prop não desfaz o que o valor anterior já
     escreveu em linha. Com transform de FUNÇÃO, quem decide é o próprio percurso,
     que roda a cada frame e lê o ref: com a preferência ligada ele devolve zero e
     não há deslocamento residual nenhum. */
  const rmRef = useRef(rm);
  useEffect(() => {
    rmRef.current = rm;
  }, [rm]);
  const percurso = (d: number) => (v: number) => (rmRef.current ? 0 : d - 2 * d * v);
  const lento = useTransform(scrollYProgress, percurso(LENTO));
  const rapido = useTransform(scrollYProgress, percurso(RAPIDO));

  /* Deriva do título, amortecida por mola, como na origem: sem ela o bloco
     desprende do sticky de um quadro para o outro e o corte se vê. Anulada com
     movimento reduzido — aqui é puro efeito, e nada do título depende dela. */
  const derivaCrua = useTransform(scrollYProgress, [0, 0.5, 1], [56, 0, -56]);
  const deriva = useSpring(derivaCrua, { stiffness: 90, damping: 26, mass: 0.6 });

  return (
    <section
      ref={secao}
      className="eventos-mosaico"
      aria-labelledby="eventos-mosaico-h2"
    >
      {/* O que o fio ciano do hero encontra aceso na entrada: a mesma linha,
          continuada. Ver `.eventos-mosaico-fio` no `globals.css`. */}
      <span aria-hidden className="eventos-mosaico-fio" />

      {/* O título vem ANTES dos cartões no DOM e é o único conteúdo desta seção
          que o leitor de tela alcança — daí o `aria-labelledby` da seção apontar
          para ele. A árvore é a MESMA com e sem movimento reduzido: muda só o
          `style`, nunca quais nós existem (`if (rm) return <A/>` desmontaria a
          subárvore quando o valor convergisse depois da hidratação). */}
      <motion.div
        className="eventos-mosaico-titulo"
        style={rm ? undefined : { y: deriva }}
      >
        <h2 id="eventos-mosaico-h2">Eventos &amp; Inovação</h2>
      </motion.div>

      {EVENTS.map((e, i) => {
        const [x, y] = POSICOES[i];
        const r = RITMOS[i];
        /* Alternância das duas velocidades pela paridade do índice, como na
           origem. O índice é o do CATÁLOGO — não muda com filtro nenhum. */
        const velocidade = i % 2 ? rapido : lento;
        return (
          <motion.div
            key={e.id}
            aria-hidden
            className="eventos-mosaico-tile"
            style={{
              /* O `clamp()` é o que cumpre "nenhum cartão das bordas recortado
                 em 1024/1366/1440/wide" por CONSTRUÇÃO, e não por acerto de
                 porcentagem: o valor preferido é a posição desejada, mas o teto
                 é a borda direita menos a largura do cartão, então em qualquer
                 largura de janela o cartão termina dentro da caixa.
                 A folga subiu de 0,75rem para 2rem quando a flutuação ganhou
                 EIXO X: `--flutua-x` chega a 16px e o `translateZ(46px)` do hover
                 alarga a projeção, então 12px de folga deixariam o cartão da
                 borda encostar no recorte no ponto extremo do percurso — e o
                 critério é "nenhum cartão cortado", não "nenhum cartão cortado em
                 repouso". */
              left: `clamp(2rem, ${x}%, calc(100% - var(--mosaico-l) - 2rem))`,
              top: `${y}%`,
              /* CAMADA 1 — parallax. O `motion` escreve `transform` EM LINHA
                 aqui, e estilo em linha vence regra de classe: é por isso que a
                 flutuação e o hover NÃO podem morar neste nó (a armadilha já
                 paga em `.cta-reativo` e em `.esg-apoio > :first-child`). */
              y: rm ? 0 : velocidade,
            }}
          >
            {/* CAMADA 2 — flutuação. Animação de keyframes vence declaração
                normal de `transform` no mesmo elemento, então ela fica sozinha
                num nó só dela. É também onde vive a sombra projetada
                (`::before`), que precisa acompanhar o cartão no percurso.
                Um keyframe só para os quinze, com as sete variáveis vindo daqui:
                período, atraso e amplitude nos cinco eixos. */}
            <div
              className="eventos-mosaico-flutua"
              style={
                {
                  '--flutua-t': `${r.t}s`,
                  '--flutua-atraso': `${r.atraso}s`,
                  '--flutua-y': `${r.y}px`,
                  '--flutua-x': `${r.x}px`,
                  '--flutua-rot': `${r.rot}deg`,
                  '--flutua-ry': `${r.ry}deg`,
                  '--flutua-rx': `${r.rx}deg`,
                } as CSSProperties
              }
            >
              {/* CAMADA 3 — face. `perspective()` LOCAL, dentro do próprio
                  `transform`: perspectiva única declarada no centro da seção
                  arremessa os cartões das bordas para fora da tela, porque o
                  ponto de fuga fica a centenas de pixels deles. Com a
                  perspectiva local cada cartão tem o seu. */}
              <div
                className="eventos-mosaico-face"
                style={
                  { '--tilt-y': `${r.ty}deg`, '--tilt-x': `${r.tx}deg` } as CSSProperties
                }
              >
                {e.thumb && (
                  <Image
                    src={e.thumb}
                    alt=""
                    fill
                    /* `thumb`, nunca `image`: `next.config` está com
                       `images: { unoptimized: true }`, então `image` baixaria as
                       quinze artes inteiras para caixas de ~200px. MEDIDO com
                       `du -ck`: as quinze artes somam 2508 KB e as quinze
                       miniaturas de 240px somam 164 KB, quinze arquivos em
                       `public/images/EVENTOS/thumb/`. Quinze vezes menos peso
                       para a mesma decoração. */
                    sizes="208px"
                    loading="lazy"
                    className="object-cover"
                  />
                )}
              </div>

              {/* LEGENDA — irmã da face, nunca filha dela: a face tem
                  `overflow: hidden` para recortar a foto no raio do cartão, e
                  qualquer texto criado dentro seria cortado na borda (é a mesma
                  apuração que a origem registra para o balão de apoio).
                  Ela também fica FORA da inclinação: a face gira 7 a 11°, e texto
                  de 11px girado em profundidade sai borrado — a foto suporta o
                  giro, a escrita não.
                  Está dentro da camada de flutuação, então viaja junto com o
                  cartão em vez de ficar plantada no fundo.
                  O texto é o `title` do catálogo, verbatim: já vem com o separador
                  `·` do formato pedido. */}
              <p className="eventos-mosaico-legenda">{e.title}</p>
            </div>
          </motion.div>
        );
      })}
    </section>
  );
}
