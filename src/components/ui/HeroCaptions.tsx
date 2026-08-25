"use client";

/**
 * HeroCaptions — as tres legendas que aparecem SOBRE o video do hero, cada uma
 * na sua janela de rolagem e cada uma com uma entrada diferente.
 *
 * A escrita vem de `HERO_SLIDES` (src/data/hero.ts), verbatim do site. Nao ha
 * texto escrito aqui: se a copy mudar, muda num lugar so.
 *
 * As tres janelas cabem no trecho em que a cena do hero esta de pé (0 -> 0.58 do
 * percurso); dai em diante ela se fecha em card, e legenda esticada pelo `scale`
 * ficaria distorcida. Ver `HeroCinematic`.
 *
 * O movimento tem duas escalas: o BLOCO inteiro entra por um caminho proprio
 * (desfoque, cortina ou assentamento) e DENTRO dele sobretitulo, titulo e
 * paragrafo sobem em tempos e distancias diferentes. Sem essa segunda escala as
 * tres legendas entravam como uma laje unica — legivel, mas parada.
 *
 * Um relogio so: quem avanca tudo isso é a rolagem, nao um temporizador. Parou
 * de rolar, a legenda fica onde esta.
 *
 * Sem CTA e com `pointer-events: none`: é legenda de video, nao um bloco
 * clicavel — os caminhos para "Quem somos", "Soluções" e "Parceiros" seguem no
 * cabecalho e nas secoes seguintes.
 */

import { motion, useTransform, type MotionValue } from "motion/react";
import { HERO_SLIDES } from "@/data/hero";
import { useReducedMotion } from "@/lib/motion";

type Percurso = [number, number, number, number];

/* Janelas de cada legenda: [entra_de, entra_ate, sai_de, sai_ate].
   Os intervalos nao se tocam — sobra um respiro de video puro entre elas, senao
   a leitura de uma comeca antes de a anterior terminar de sair. */
const JANELAS: readonly Percurso[] = [
  [0.01, 0.08, 0.15, 0.2],
  [0.24, 0.31, 0.36, 0.41],
  [0.44, 0.5, 0.54, 0.58],
];

/**
 * Uma linha da legenda (sobretitulo, titulo ou paragrafo).
 *
 * `atraso` desloca a janela DE ENTRADA em fracao do percurso: cada linha comeca
 * um pouco depois da anterior, e é isso que faz o bloco se montar em cascata em
 * vez de aparecer inteiro. A janela de SAIDA nao é deslocada — na saida as tres
 * vao juntas, senao sobraria uma linha solta sobre o video.
 *
 * `sobe` é a distancia percorrida: quanto mais abaixo na legenda, mais longe a
 * linha vem, o que abre uma leve profundidade entre elas.
 */
function Linha({
  children,
  className,
  progress,
  percurso,
  atraso,
  sobe,
  rm,
}: {
  children: React.ReactNode;
  className: string;
  progress: MotionValue<number>;
  percurso: Percurso;
  atraso: number;
  sobe: number;
  rm: boolean;
}) {
  const [entraDe, entraAte, saiDe, saiAte] = percurso;
  const janela = [entraDe + atraso, entraAte + atraso, saiDe, saiAte];

  const opacity = useTransform(progress, janela, [0, 1, 1, 0]);
  const y = useTransform(progress, janela, [sobe, 0, 0, -sobe * 0.5]);

  return (
    <motion.p className={className} style={rm ? undefined : { opacity, y }}>
      {children}
    </motion.p>
  );
}

function Legenda({
  progress,
  indice,
  rm,
}: {
  progress: MotionValue<number>;
  indice: number;
  rm: boolean;
}) {
  const slide = HERO_SLIDES[indice];
  const percurso = JANELAS[indice];
  const [entraDe, entraAte, saiDe, saiAte] = percurso;
  const janela = [entraDe, entraAte, saiDe, saiAte];

  /* A opacidade do BLOCO cuida da sombra atrás do texto (`.hero-caption::before`
     herda daqui). As linhas têm a sua própria, deslocada — por isso esta fecha
     em 1 bem no começo da entrada: senão as duas se multiplicariam e a cascata
     apareceria lavada. */
  const opacity = useTransform(
    progress,
    [entraDe, entraDe + 0.015, saiDe, saiAte],
    [0, 1, 1, 0],
  );

  /* Cada legenda entra por um caminho diferente — o video é um plano continuo,
     e repetir a mesma entrada tres vezes faria as tres parecerem o mesmo bloco
     piscando. */

  // 1. Sai do desfoque, como se o texto ganhasse foco.
  const blur1 = useTransform(progress, janela, [16, 0, 0, 12]);
  const filter1 = useTransform(blur1, (b) => `blur(${b}px)`);

  // 2. Cortina lateral: o bloco é revelado da esquerda para a direita.
  const x2 = useTransform(progress, janela, [-64, 0, 0, 44]);
  const corte2 = useTransform(progress, janela, [100, 0, 0, 0]);
  /* Folga generosa em cima, embaixo e à esquerda: o recorte só deve avançar pela
     direita. Sem ela o `clip-path` cortaria também a sombra do bloco, que se
     estende bem além do texto (ver `.hero-caption::before`), e a mancha entraria
     com um lado reto — exatamente o que essa sombra existe para evitar. */
  const clip2 = useTransform(corte2, (c) => `inset(-120% ${c}% -120% -80%)`);

  // 3. Assenta: vem de um pouco maior, como uma camera que estabiliza.
  const scale3 = useTransform(progress, janela, [1.1, 1, 1, 0.98]);

  const estilo = rm
    ? undefined
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
          percurso={percurso}
          atraso={0}
          sobe={18}
          rm={rm}
        >
          {slide.eyebrow}
        </Linha>
      ) : null}
      <Linha
        className="hero-caption-title"
        progress={progress}
        percurso={percurso}
        atraso={0.008}
        sobe={38}
        rm={rm}
      >
        {slide.titleTop}
        <br />
        <span>{slide.titleBottom}</span>
      </Linha>
      <Linha
        className="hero-caption-lead"
        progress={progress}
        percurso={percurso}
        atraso={0.02}
        sobe={56}
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

  return (
    <div className="hero-captions">
      {HERO_SLIDES.map((slide, i) => (
        <Legenda key={slide.id} progress={progress} indice={i} rm={rm} />
      ))}
    </div>
  );
}
