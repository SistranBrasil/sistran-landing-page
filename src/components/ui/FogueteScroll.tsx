"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { useReducedMotion } from "@/lib/motion";

/**
 * SIS-254 - arte raster do foguete durante toda a travessia de SOCIAL.
 *
 * `foguete-scroll.webp` deriva do PNG fornecido (1024x1536, 1.681.797 bytes).
 * O quadriculado vinha gravado no RGB, apesar de a arte ser descrita como
 * transparente; ele foi isolado apenas na derivada, recortada para 360x1044 com
 * alfa e 57.128 bytes. O PNG permanece como fonte e nunca e servido no scroll.
 *
 * ── POR QUE SAO DUAS CAMADAS, E NAO UMA OPACIDADE MAIOR
 *
 * A rodada 1 pintava uma camada normal a 0,14 e a arte 3D nao se lia: o foguete
 * virava mancha pastel. Subir esse numero nao era caminho, e a medida diz por
 * que. O texto desta secao e `rgb(61 90 128)` (`.section-light .text-ink-muted`),
 * que pede fundo com luminancia >= 0,619 para 4,5:1 — cinza ~206. Com a arte
 * ESCONDIDA (`SEM_FOGUETE=1`), o pior fundo sob glifo dentro da caixa do foguete
 * JA era 4,94:1 / 5,02:1 / 5,05:1 em 390/1024/1440, no pixel `rgb(208 217 225)`
 * da superficie dos cartoes de apoio. Sobravam ~4 niveis de cinza para
 * escurecer, e os 0,14 gastavam esse resto inteiro (4,56:1 medido). Nao havia
 * opacidade maior possivel — nem com mascara, nem com escala menor: o orcamento
 * nao estava na arte, estava no fundo por onde ela passa.
 *
 * O que resolve e separar COR de LUMINOSIDADE, o caminho `mix` autorizado. As
 * duas camadas se dividem assim:
 *
 *   COR    `foguete-scroll-cor.webp`, opacidade 0,95. E a arte reescrita por
 *          `SetLum` (a conta de `mix-blend-mode: color`) sobre a luminosidade do
 *          azul da secao: guarda matiz e croma, joga fora o brilho. Como o
 *          contraste WCAG le luminancia, ela entra quase de graca — nenhum pixel
 *          dela mede menos de 5,59:1 contra o texto, contra os 4,56:1 que a
 *          camada normal da rodada 1 media sozinha. E dela que vem o nariz
 *          laranja, os boosters azuis e as chamas.
 *   FORMA  a arte original, opacidade 0,08, por cima. Devolve volume: fuselagem
 *          branca, sombra e contorno, que a camada de cor nao tem porque a
 *          luminosidade dela e plana. Pedido da usuária: levemente opaco —
 *          volume em 0,24, acima dos 0,08 medidos e abaixo de chapar o texto.
 *
 * Por que a de cor vem EMBAIXO: a 0,95 ela cobriria a de forma se viesse por
 * cima, e a peca voltaria a ser um decalque plano.
 *
 * A conta esta em `scripts/derivar-foguete-cor-sis254.mjs`, que gera a derivada
 * de cor e imprime o pior pixel dela. Ela e assada em ARQUIVO, e nao aplicada
 * com `mix-blend-mode: color` no navegador, por um motivo medido em 14/09: blend
 * so alcanca o que foi pintado no mesmo grupo isolado, e esta camada esta atras
 * de tres fronteiras que criam contexto de empilhamento (o `-z-10` do wrapper, o
 * `sticky` da ancora e o `transform` da peca movel). Com `mix-blend-color` no
 * wrapper, o blend nao viu o fundo da secao — viu transparencia, e blend sobre
 * transparencia devolve a fonte crua: o medidor acusou 1,19:1 / 2,12:1 / 1,95:1,
 * o foguete OPACO atras do texto. Assada, a mesma conta e uma imagem comum.
 *
 * ── CURSO
 *
 * 6 pontos / 112svh no eixo y (`-60 > -22 > 52 > 18 > -18 > 18`). A deriva
 * lateral RECUOU de ate 22vw para 15vw (`-1 > -6 > -12 > -5 > -15 > -7`): a 1440
 * o pico de 22vw levava a arte a x=959, dentro da coluna de texto e chegando na
 * coluna da esquerda. Menos sobreposicao com letra e o outro caminho que a
 * conferencia autorizou, e soma com as camadas em vez de competir — a arte passa
 * mais tempo sobre o azul liso da secao, onde a tinta se le melhor do que sobre
 * a superficie de cartao. Continua em quadro nos 11 passos das tres larguras.
 *
 * Medicao SIS-254 rodada 2 (`scripts/medir-foguete-social-sis234.mjs`, 11 passos,
 * 390/1024/1440): arte em quadro em 11/11 nas tres larguras; pior contraste sob
 * ela 4,78:1 / 4,97:1 / 4,96:1 (era 4,56 / 4,63 / 4,64 na rodada 1, com arte
 * menos legivel); recorte computado `clip/clip`.
 *
 * ── O QUE A OPACIDADE NAO GOVERNA: OCLUSAO
 *
 * A peca e decorativa e mora ATRAS do conteudo, entao o que chega ao olho depende
 * de onde o conteudo esta. Medido por diferenca de fotos (arte visivel contra
 * arte em `visibility: hidden`), sobre a silhueta da arte em coordenada de tela:
 * a 390 chegam 47% no passo 2, 23% no passo 5 e 12% no passo 8; a 1440, 53% / 41%
 * / 66%. A 390 o miolo da secao E a pilha de fotos das turmas e os dois cartoes
 * de apoio, que sao opacos e ocupam a coluna inteira (`container-lp` deixa 20px
 * de margem) — nenhum valor de opacidade ou de deriva mostra o shuttle inteiro
 * ali. A largura onde a arte aparece inteira a 390 e a faixa de fundo aberto do
 * topo da secao (passo 2). Isto e layout, nao tinta.
 *
 * A arvore e identica em movimento normal/reduzido. Em reduce, somente os
 * MotionValues viram constantes (`18svh`, `-12vw`, 5deg), deixando a arte parada
 * e visivel no miolo. O wrapper segue decorativo, sem eventos, atras do conteudo
 * e confinado a secao por `overflow-clip`.
 */
export default function FogueteScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const reduzido = useReducedMotion();

  /* `start end` → `end start`: o progresso cobre toda a travessia da seção pela
     janela, então o foguete tem curso inteiro em vez de só o pedaço central. */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  /* A ancora sticky de altura zero cobre a travessia inteira. Mais joelhos fazem
     a peca passar por base, centro e topo da janela; svh liga o curso ao viewport. */
  const progresso = [0, 0.18, 0.36, 0.58, 0.78, 1];
  const y = useTransform(
    scrollYProgress,
    progresso,
    reduzido
      ? ["18svh", "18svh", "18svh", "18svh", "18svh", "18svh"]
      : ["-60svh", "-22svh", "52svh", "18svh", "-18svh", "18svh"],
  );
  const x = useTransform(
    scrollYProgress,
    progresso,
    reduzido
      ? ["-12vw", "-12vw", "-12vw", "-12vw", "-12vw", "-12vw"]
      : ["-1vw", "-6vw", "-12vw", "-5vw", "-15vw", "-7vw"],
  );
  const rotate = useTransform(
    scrollYProgress,
    progresso,
    reduzido ? [5, 5, 5, 5, 5, 5] : [12, 8, 3, 7, -2, 4],
  );

  return (
    <div
      ref={ref}
      aria-hidden
      data-foguete="social"
      className="pointer-events-none absolute inset-0 -z-10 overflow-clip"
    >
      {/* Âncora de altura zero. `top-0` prega no topo da janela; o `sticky` só vale
          dentro do pai, e o pai é a seção — daí o confinamento. */}
      <div className="sticky top-0 h-0 w-full">
        {/* Um `transform` só para as duas camadas: elas têm de coincidir pixel a
            pixel, senão o croma descola do volume e aparece franja colorida. */}
        <motion.div
          className="absolute right-[-2%] top-0 w-[150px] md:right-[-1%] md:w-[188px]"
          style={{ x, y, rotate }}
        >
          <Image
            src="/images/esg/foguete-scroll-cor.webp"
            alt=""
            width={360}
            height={1044}
            sizes="(max-width: 767px) 150px, 188px"
            className="h-auto w-full select-none opacity-95"
            draggable={false}
          />
          <Image
            src="/images/esg/foguete-scroll.webp"
            alt=""
            width={360}
            height={1044}
            sizes="(max-width: 767px) 150px, 188px"
            className="absolute inset-0 h-full w-full select-none opacity-[0.24]"
            draggable={false}
          />
        </motion.div>
      </div>
    </div>
  );
}
