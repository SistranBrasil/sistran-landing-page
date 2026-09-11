"use client";

/**
 * HeroCaptions — as tres legendas que aparecem SOBRE o video do hero, cada uma
 * na sua janela de rolagem e cada uma com uma entrada diferente.
 *
 * A escrita vem de `HERO_SLIDES` (src/data/hero.ts), verbatim do site. Nao ha
 * texto escrito aqui: se a copy mudar, muda num lugar so.
 *
 * As tres janelas cabem no trecho em que a cena do hero esta de pé (0 -> 0.58 do
 * percurso); dai em diante entra o `HeroPitch`, que é o quarto passo e fica até a
 * cena sair. Ver `HeroCinematic`.
 *
 * O movimento tem duas escalas: o BLOCO inteiro entra por um caminho proprio
 * (desfoque, cortina ou assentamento) e DENTRO dele sobretitulo, titulo e
 * paragrafo sobem em tempos e distancias diferentes. Sem essa segunda escala as
 * tres legendas entravam como uma laje unica — legivel, mas parada.
 *
 * ── SIS-226 · DOIS RELOGIOS, E POR QUE O SEGUNDO NAO E UM CARROSSEL ──────────
 * A alternancia continua sendo da ROLAGEM: as janelas de entrada e saida das
 * legendas 2 e 3, e a saida das tres, leem `scrollYProgress`. Nada aqui avança
 * por temporizador infinito.
 *
 * A UNICA excecao é a ENTRADA DA PRIMEIRA legenda, e ela é pedido explicito da
 * issue: "ao entrar no site, a primeira escrita deve se revelar progressivamente,
 * nao aparecer completa sem transicao". Amarrar essa revelacao ao scroll nao
 * cumpre o pedido, e por um motivo medido na propria cena: no instante do
 * carregamento `scrollYProgress` é 0, e uma janela que comeca em 0.01 deixa o
 * hero SEM TEXTO NENHUM até a pagina andar. Com a rolagem automatica da Fase A
 * (SIS-189) ela anda em seguida — mas a Fase A é uma promocao decidida depois de
 * montar, e se o `play()` for recusado (aba em segundo plano, economia de
 * bateria, movimento reduzido) ela nao acontece e o hero fica em branco.
 *
 * Entao a primeira legenda tem um relogio de MONTAGEM: um valor que vai de 0 a 1
 * uma vez, ao montar. Ele nao repete, nao cicla e nao volta — expira e a legenda
 * passa a depender so da rolagem, como as outras duas. Os EFEITOS sao os mesmos
 * (desfoque + cascata das tres linhas): o que muda é quem os avança.
 *
 * Sem CTA e com `pointer-events: none`: é legenda de video, nao um bloco
 * clicavel — os caminhos para "Quem somos", "Soluções" e "Parceiros" seguem no
 * cabecalho e nas secoes seguintes. A decisao vale tambem para os `ctaLabel` dos
 * tres slides em `hero.ts` (SIS-226, item 5): tres botoes trocando de lugar a
 * cada janela de rolagem, sobre um video, dariam alvo de clique que muda de
 * destino debaixo do cursor — e os tres destinos (`/quem-somos`, `/solucoes`,
 * `/parceiros-e-implementacoes`) ja estao no cabecalho fixo, em foco navegavel.
 * Os campos ficam no data, intactos.
 *
 * Nenhum titulo aqui é `<h1>`, e isso é deliberado (SIS-226, item 4): o unico
 * cabecalho de nivel 1 da home é o do `HeroPitch`, o quarto passo. As tres
 * legendas sao texto secundario da cena — `<p className="hero-caption-title">`,
 * tipografia de titulo sem semantica de titulo. Promover a legenda ativa daria
 * um `h1` que TROCA de frase durante a rolagem, e leitor de tela nao tem como
 * anunciar isso sem ficar repetindo o cabecalho da pagina.
 */

import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect } from "react";
import { HERO_SLIDES } from "@/data/hero";
import { useReducedMotion } from "@/lib/motion";

type Percurso = [number, number, number, number];

/* Janelas de cada legenda: [entra_de, entra_ate, sai_de, sai_ate].
   Os intervalos nao se tocam — sobra um respiro de video puro entre elas, senao
   a leitura de uma comeca antes de a anterior terminar de sair.

   SIS-226 — os numeros NAO mudaram ao religar as legendas, e isso é conferido, nao
   sorte: os `BEATS` de enquadramento do video em `HeroCinematic` estao em 0.10,
   0.32 e 0.51, que sao os centros destas tres janelas. Eles foram escolhidos assim
   quando as legendas existiam, e continuaram no lugar quando ela sairam. Mexer nas
   janelas agora desalinharia a legenda do respiro do quadro. */
const JANELAS: readonly Percurso[] = [
  [0.01, 0.08, 0.15, 0.2],
  [0.24, 0.31, 0.36, 0.41],
  [0.44, 0.5, 0.54, 0.58],
];

/* Duracao da revelacao de montagem da PRIMEIRA legenda, em fracao do valor
   `revelacao` (que vai de 0 a 1 em `SEGUNDOS_DA_REVELACAO`). 0.72 deixa 0.28 de
   folga para o escalonamento das tres linhas caber dentro do mesmo percurso. */
const VAO_DA_REVELACAO = 0.72;
const SEGUNDOS_DA_REVELACAO = 1.1;

/**
 * As duas fases de uma peca da legenda, normalizadas: `e` vai de 0 a 1 na
 * ENTRADA, `s` vai de 0 a 1 na SAIDA.
 *
 * Foi extraido para ca (SIS-226) porque agora a entrada tem dois relogios
 * possiveis e a saida so tem um. Antes cada peca montava uma rampa de quatro
 * pontos sobre `progress`; com duas fases separadas o mesmo efeito se escreve
 * como conta (`16 * (1 - e) + 12 * s`) e o relogio da entrada passa a ser
 * escolhivel sem duplicar nenhuma formula.
 *
 * `naEntrada` é constante para cada instancia (depende so do indice da legenda),
 * entao a quantidade e a ordem dos hooks nao mudam entre renders.
 */
function useFases({
  progress,
  revelacao,
  percurso,
  atraso,
  naEntrada,
}: {
  /* Um objeto e nao cinco parametros posicionais: a lista posicional com
     `MotionValue<number>,` em duas linhas seguidas é lida como no de texto JSX
     pelo extrator do `copy-lock` (`scripts/copy-lock.mjs`), e o trecho de
     assinatura entrava no lock como se fosse escrita do site. Na forma de objeto
     os campos terminam em `;` e a segunda rede (`pareceCodigo`) os descarta. */
  progress: MotionValue<number>;
  revelacao: MotionValue<number>;
  percurso: Percurso;
  atraso: number;
  naEntrada: boolean;
}) {
  const [entraDe, entraAte, saiDe, saiAte] = percurso;
  /* O `atraso` chega em fracao do PERCURSO DE ROLAGEM; para o relogio de
     montagem ele tem de virar fracao da revelacao. A regra de tres é o vao da
     janela de entrada, para a cascata guardar as mesmas proporcoes nos dois
     relogios. */
  const vao = Math.max(entraAte - entraDe, 0.001);
  const inicio = Math.min(atraso / vao, 1 - VAO_DA_REVELACAO);

  const e = useTransform(
    naEntrada ? revelacao : progress,
    naEntrada
      ? [inicio, inicio + VAO_DA_REVELACAO]
      : [entraDe + atraso, entraAte + atraso],
    [0, 1],
  );
  const s = useTransform(progress, [saiDe, saiAte], [0, 1]);
  return { e, s };
}

/**
 * Uma linha da legenda (sobretitulo, titulo ou paragrafo).
 *
 * `atraso` desloca a ENTRADA: cada linha comeca um pouco depois da anterior, e é
 * isso que faz o bloco se montar em cascata em vez de aparecer inteiro. A SAIDA
 * nao é deslocada — na saida as tres vao juntas, senao sobraria uma linha solta
 * sobre o video.
 *
 * `sobe` é a distancia percorrida: quanto mais abaixo na legenda, mais longe a
 * linha vem, o que abre uma leve profundidade entre elas.
 */
function Linha({
  children,
  className,
  progress,
  revelacao,
  percurso,
  atraso,
  sobe,
  naEntrada,
  rm,
}: {
  children: React.ReactNode;
  className: string;
  progress: MotionValue<number>;
  revelacao: MotionValue<number>;
  percurso: Percurso;
  atraso: number;
  sobe: number;
  naEntrada: boolean;
  rm: boolean;
}) {
  const { e, s } = useFases({ progress, revelacao, percurso, atraso, naEntrada });

  const opacity = useTransform([e, s], ([a, b]: number[]) => a * (1 - b));
  const y = useTransform([e, s], ([a, b]: number[]) => sobe * (1 - a) - sobe * 0.5 * b);

  /* Com movimento reduzido NAO basta `style={undefined}`, e isto era um defeito
     MEDIDO: com `prefers-reduced-motion: reduce` a 1440x900 as tres legendas
     ficavam em `opacity: 0` do inicio ao fim do percurso — o hero sem texto
     nenhum. A causa e a ordem dos renders: `useReducedMotion` nasce `false`
     (tem de nascer, senao o servidor e o cliente divergem — ver `@/lib/motion`),
     entao no PRIMEIRO render o `motion` escreve `opacity: 0` no `style` inline
     do no; quando `rm` vira `true`, `undefined` so faz o `motion` PARAR de
     cuidar da propriedade, e o zero que ele ja gravou fica no elemento para
     sempre. So um valor explicito o sobrescreve. */
  return (
    <motion.p className={className} style={rm ? { opacity: 1, y: 0 } : { opacity, y }}>
      {children}
    </motion.p>
  );
}

function Legenda({
  progress,
  revelacao,
  indice,
  rm,
}: {
  progress: MotionValue<number>;
  revelacao: MotionValue<number>;
  indice: number;
  rm: boolean;
}) {
  const slide = HERO_SLIDES[indice];
  const percurso = JANELAS[indice];
  /* A primeira legenda é a que se revela na entrada do site; as outras duas
     dependem so da rolagem. Ver o cabecalho do arquivo. */
  const naEntrada = indice === 0;

  /* A opacidade do BLOCO cuida da sombra atrás do texto (`.hero-caption::before`
     herda daqui). As linhas têm a sua própria, deslocada — por isso esta é a
     rampa SEM atraso e com vao curto: senão as duas se multiplicariam e a
     cascata apareceria lavada. */
  const { e, s } = useFases({ progress, revelacao, percurso, atraso: 0, naEntrada });
  const opacity = useTransform([e, s], ([a, b]: number[]) =>
    Math.min(a * 6, 1) * (1 - b),
  );

  /* Cada legenda entra por um caminho diferente — o video é um plano continuo,
     e repetir a mesma entrada tres vezes faria as tres parecerem o mesmo bloco
     piscando. As contas sao as mesmas rampas de antes, escritas em funcao das
     duas fases: `e = 0` é o estado de entrada, `s = 1` é o de saida. */

  // 1. Sai do desfoque, como se o texto ganhasse foco.
  const filter1 = useTransform(
    [e, s],
    ([a, b]: number[]) => `blur(${16 * (1 - a) + 12 * b}px)`,
  );

  // 2. Cortina lateral: o bloco é revelado da esquerda para a direita.
  const x2 = useTransform([e, s], ([a, b]: number[]) => -64 * (1 - a) + 44 * b);
  /* Folga generosa em cima, embaixo e à esquerda: o recorte só deve avançar pela
     direita. Sem ela o `clip-path` cortaria também a sombra do bloco, que se
     estende bem além do texto (ver `.hero-caption::before`), e a mancha entraria
     com um lado reto — exatamente o que essa sombra existe para evitar. */
  const clip2 = useTransform(
    e,
    (a) => `inset(-120% ${100 * (1 - a)}% -120% -80%)`,
  );

  // 3. Assenta: vem de um pouco maior, como uma camera que estabiliza.
  const scale3 = useTransform(
    [e, s],
    ([a, b]: number[]) => 1 + 0.1 * (1 - a) - 0.02 * b,
  );

  /* Mesmo motivo da nota em `Linha`: o repouso tem de ser ESCRITO. E aqui nao e
     so a opacidade — o primeiro render tambem grava `blur(16px)`, `clip-path:
     inset(… 100% …)` (que apaga o bloco inteiro) e `translateX(-64px)`, e cada
     um deles sobreviveria a troca para `undefined`. */
  const estilo = rm
    ? {
        opacity: 1,
        filter: "none",
        x: 0,
        clipPath: "none",
        scale: 1,
      }
    : indice === 0
      ? { opacity, filter: filter1 }
      : indice === 1
        ? { opacity, x: x2, clipPath: clip2 }
        : { opacity, scale: scale3, transformOrigin: "0% 50%" };

  return (
    <motion.div className="hero-caption" style={estilo}>
      {slide.eyebrow ? (
        <Linha
          className="hero-caption-eyebrow"
          progress={progress}
          revelacao={revelacao}
          percurso={percurso}
          atraso={0}
          sobe={18}
          naEntrada={naEntrada}
          rm={rm}
        >
          {slide.eyebrow}
        </Linha>
      ) : null}
      <Linha
        className="hero-caption-title"
        progress={progress}
        revelacao={revelacao}
        percurso={percurso}
        atraso={0.008}
        sobe={38}
        naEntrada={naEntrada}
        rm={rm}
      >
        {slide.titleTop}
        <br />
        <span>{slide.titleBottom}</span>
      </Linha>
      <Linha
        className="hero-caption-lead"
        progress={progress}
        revelacao={revelacao}
        percurso={percurso}
        atraso={0.02}
        sobe={56}
        naEntrada={naEntrada}
        rm={rm}
      >
        {slide.lead}
      </Linha>
    </motion.div>
  );
}

export default function HeroCaptions({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  const rm = useReducedMotion();

  /* O relogio de MONTAGEM da primeira legenda. Nasce em 0 no servidor e no
     cliente (paridade de hidratacao) e sobe uma vez ate 1. Nao repete e nao
     reage a rolagem: quando expira, a primeira legenda passa a depender so da
     saida por `progress`, como as outras duas. */
  const revelacao = useMotionValue(0);

  useEffect(() => {
    /* Com movimento reduzido a revelacao nao acontece: o valor vai direto para o
       fim. O `estilo` de repouso ja escreve os valores explicitos, mas deixar o
       valor em 0 manteria um relogio andando sem ninguem lendo. */
    if (rm) {
      revelacao.set(1);
      return;
    }
    const controle = animate(revelacao, 1, {
      duration: SEGUNDOS_DA_REVELACAO,
      ease: "easeOut",
      /* Respiro curto antes de comecar: no `next dev` o primeiro quadro do video
         ainda esta sendo baixado, e a legenda entrando junto do cartaz de poster
         lia como salto. */
      delay: 0.12,
    });
    return () => controle.stop();
  }, [revelacao, rm]);

  return (
    <div className="hero-captions">
      {HERO_SLIDES.map((slide, i) => (
        <Legenda
          key={slide.id}
          progress={progress}
          revelacao={revelacao}
          indice={i}
          rm={rm}
        />
      ))}
    </div>
  );
}
