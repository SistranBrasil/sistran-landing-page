'use client';

/**
 * HeroCinematic — Hero cinematográfico controlado por scroll.
 *
 * Wrapper de 300vh (desktop) / 200vh (mobile) com cena sticky em 100svh. O vídeo
 * é o conteúdo da cena; sobre ele passam as três legendas do hero, uma por
 * janela de rolagem (ver `HeroCaptions`). Os indicadores, o painel institucional
 * e os botões de capítulo saíram a pedido, para o vídeo ficar em destaque.
 *
 * Sequência:
 *   0.00–0.58  O vídeo avança quadro a quadro com a rolagem (ver `ScrollVideo`)
 *              e as três legendas entram e saem em janelas próprias
 *   0.55–0.78  A pastilha "role para explorar" sai de cena
 *   0.62–1.00  A viewport cheia recua e vira card sobre a folha clara, e depois
 *              desce para encontrar o mosaico da seção seguinte
 *
 * Os indicadores de "Resultados" fechavam este percurso e saíram a pedido: agora
 * são seção própria depois do Método (ver `legacy/MetricsStrip`).
 */

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useReducedMotion, useScrollOpacity } from '@/lib/motion';
import HeroCaptions from './ui/HeroCaptions';
import { ScrollVideo } from './primitives/ScrollVideo';
import { ScrollCue } from './primitives/ScrollCue';

/**
 * Vídeo reencodado all-intra: todo quadro é keyframe, então o scroll pode buscar
 * qualquer posição sem o decodificador recomeçar do keyframe anterior (que é o
 * que faz a imagem andar aos saltos). Comando em `ScrollVideo`.
 */
const HERO_VIDEO = '/videos/hero-scroll.mp4';

/* Primeiro quadro do proprio video: enquanto o arquivo carrega, o hero mostra a
   cena inicial em vez de preto. Gerado com
   `ffmpeg -i hero-scroll.mp4 -frames:v 1 -q:v 80 hero-scroll-poster.webp`. */
const HERO_POSTER = '/videos/hero-scroll-poster.webp';

export default function HeroCinematic() {
  const rm = useReducedMotion();

  const wrapperRef = useRef<HTMLDivElement>(null);

  /* Relógio único do hero: o mesmo percurso que fecha a cena em card posiciona o
     vídeo quadro a quadro. Nada de play/pause — o vídeo só existe como função do
     scroll.

     Substitui o `driveVideoByScroll` que ficava aqui comentado: aquele escrevia
     `currentTime` a cada frame de um lerp, inclusive durante um seek pendente,
     e é exatamente isso que entope a fila do decodificador. O acelerador certo
     está em `ScrollVideo`. */
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  });

  /* 55% é onde a cena começa a se recolher (ver `scale` abaixo).

     `useScrollOpacity` em vez da forma de array: nela o `motion` acelera a
     opacidade numa `Animation` nativa com `ViewTimeline`, que mede a
     visibilidade da propria pastilha — e ela é `position: fixed`, entao esse
     relogio nunca avança e a pastilha ficava em `opacity: 1` pelo resto da
     pagina, exatamente o que o comentario de `.hero-cue` diz que nao pode
     acontecer. Ver `@/lib/motion`. */
  const cueFade = useScrollOpacity(scrollYProgress, [0.55, 0.78], [1, 0]);

  /* Saída da cena: em vez de afundar (scale + fade + blur), a viewport cheia
     recua e vira card sobre uma folha clara — a mesma cor do mosaico da seção
     seguinte —, e depois DESCE para encontrá-lo. É o mesmo desenho da
     apresentação de legado: o hero desprende do sticky já emendado no mosaico,
     sem corte de fundo e sem salto.

     Nada de opacidade nem blur no card: ele não desaparece, ele se fecha e
     entrega a cor da seção seguinte. */
  const scale = useTransform(scrollYProgress, [0.62, 0.96], [1, 0.54]);
  const radius = useTransform(scrollYProgress, [0.62, 0.96], [0, 30]);
  /* A folha clara NAO tem mais fade. Enquanto ela subia de 0 a 1, o azul do body
     aparecia por tras do card no meio do caminho e emendava em corte seco com o
     branco do mosaico logo abaixo. Agora ela é branca e opaca do inicio ao fim:
     enquanto a cena é full bleed ela fica coberta, e quando o card recua o que
     surge em volta ja é a cor da secao seguinte. Ver `.hero-sheet`. */
  /* Começa depois de o card fechar (0.84) e termina no fim do percurso: quando
     a cena desprende do sticky, ela já está na altura do bloco do mosaico. */
  const drop = useTransform(scrollYProgress, [0.84, 1], ['0svh', '20svh']);

  return (
    /* Altura do percurso (200vh / 320vh) e cena sticky vivem em globals.css. */
    <section id="top" ref={wrapperRef} className="relative">
      {/* Folha clara por trás do card, sempre presente e opaca. Também é sticky,
          e com `margin-bottom: -100svh` ela divide a mesma vaga da cena sem
          somar altura ao percurso — ver `.hero-sheet`. */}
      <div aria-hidden className="hero-sheet" />
      <motion.div
        className="hero-scene flex overflow-hidden"
        style={
          rm
            ? { minHeight: 'clamp(640px, 100svh, 960px)' }
            : {
                minHeight: 'clamp(640px, 100svh, 960px)',
                scale,
                borderRadius: radius,
                y: drop,
                willChange: 'transform',
              }
        }
      >
        {/* Linha decorativa superior */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-[104px] z-10 brand-line opacity-70"
        />

        {/* O vídeo é o conteúdo do hero, então fica em opacidade cheia e nada
            se sobrepõe a ele além da vinheta.

            Antes ele morava dentro de `[data-hero-atmosphere]`, e aquela camada
            era aberta pelo GSAP em `opacity: 0.55` — no topo da página o vídeo
            aparecia a 55% sobre a folha branca, e era isso que o lavava. A
            camada saiu junto com os orbs e as linhas que ela embalava. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          {/* Base navy: é o que se vê enquanto o arquivo não chega, em vez de um
              retângulo preto. */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 90% 70% at 72% 38%, rgba(4,32,66,0.45), transparent 62%),' +
                'linear-gradient(165deg, #041B3D 0%, #062B54 42%, #0A3E70 78%, #0F5590 100%)',
            }}
          />
          <ScrollVideo
            className="hero-video"
            src={HERO_VIDEO}
            poster={HERO_POSTER}
            progress={scrollYProgress}
          />
        </div>

        {/* Vinheta radial: escurece as bordas e joga o olho para o centro */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              'radial-gradient(ellipse 78% 68% at 50% 45%, transparent 40%, rgba(3,17,38,0.55) 100%)',
          }}
        />

        {/* As tres legendas do hero, uma por janela de rolagem. Ficam ACIMA da
            vinheta: é a vinheta que garante o contraste do texto claro contra os
            trechos claros do video (o corredor de papel dos primeiros segundos). */}
        <HeroCaptions progress={scrollYProgress} />

        {/* Linha decorativa inferior */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 brand-line opacity-60"
        />
        {/* A home precisa de um h1. A escrita do hero saiu de cena a pedido — o
            video passou a ser o conteudo —, mas remover o titulo junto deixaria
            a pagina sem cabecalho de nivel 1: perda para busca e para leitor de
            tela. Ele continua aqui, so nao e desenhado. */}
        <h1 className="sr-only">Soluções de Negócio em Seguros — Sistran Brasil</h1>
      </motion.div>

      {/* Irmã da cena, nunca filha: o `position: fixed` da pastilha seria contido
          pelo `scale` aplicado em `.hero-scene`.

          Some junto com a saída da cena — sendo `fixed`, sem isso a pastilha
          continuaria colada ao cursor pelo resto da página, convidando a rolar um
          percurso que já terminou. */}
      <motion.div className="hero-cue" style={{ opacity: cueFade }}>
        <ScrollCue />
      </motion.div>
    </section>
  );
}
