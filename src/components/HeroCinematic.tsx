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
 *
 * ════════════════════════════════════════════════════════════════════════════
 * SIS-178 — A CENA SE DIVIDE EM DUAS COLUNAS, E O PONTO DE QUEBRA É 1024px
 *
 * O PONTO DE QUEBRA É `(min-width: 1024px)`. Está escrito assim aqui porque três
 * exigências dependem dele e a issue não o nomeava. 1024 e não outro valor: é o
 * mesmo degrau em que `#top` já troca de altura (`globals.css:905`), o mesmo do
 * percurso de indicadores (`ui/PercursoIndicadores.tsx`) e o `lg` do Tailwind —
 * inventar um quarto degrau só para o hero criaria uma faixa de larguras em que
 * o hero está dividido e o resto da página não.
 *
 * ── O QUE MUDA, E O QUE NÃO ─────────────────────────────────────────────────
 * O percurso de rolagem sobrevive inteiro: a cena continua `sticky` (NUNCA
 * `pin: true`), o vídeo continua raspado por `scrollYProgress`, as três legendas
 * continuam se sucedendo nas mesmas janelas de `HeroCaptions.tsx:36-40` e o texto
 * continua vindo de `HERO_SLIDES`. Nenhuma palavra nova.
 * O que mudou é GEOMETRIA e COR: o vídeo passa à metade direita dissolvendo no
 * branco pela esquerda, e as legendas passam a texto escuro na coluna esquerda.
 * A divisão inteira vive em CSS (`globals.css`, bloco "hero dividido"), porque é
 * dependente de largura — e largura não se escreve em `style` inline.
 *
 * ── SÃO DOIS REGIMES DE COR EM TRÊS ARRANJOS DE LAYOUT ──────────────────────
 * Isto é o que a próxima pessoa precisa ler antes de "unificar" as cores das
 * legendas — unificar apaga o texto de um dos lados:
 *
 *   A. ≥1024px, com movimento           duas colunas, TEXTO ESCURO sobre branco
 *   B. ≥1024px, movimento reduzido      cena em fluxo, TEXTO ESCURO sobre branco
 *   C. <1024px, com ou sem movimento    vídeo em sangria, TEXTO CLARO sobre vídeo
 *
 * B existia como TERCEIRO regime e era um defeito: o bloco de movimento reduzido
 * (`globals.css:994-1015`) põe as legendas em fluxo mas deixava o vídeo em
 * sangria e a vinheta em 0.7 — texto escuro sobre vídeo escuro, ilegível. Em vez
 * de calibrar uma terceira paleta, B foi COLAPSADO em A: com movimento reduzido
 * o vídeo também fica confinado à direita e as legendas também ficam na coluna
 * esquerda. Duas paletas para manter, não três.
 * E os DOIS interruptores de movimento recebem o mesmo tratamento: a `@media
 * (prefers-reduced-motion)` e o espelho do botão da interface em
 * `globals.css:2089-2113`. Mexer em um só é o defeito que a SIS-159 mediu.
 *
 * Dependem do ponto de quebra, e por isso estão todos no mesmo bloco de CSS: as
 * cores das três linhas da legenda, o `text-shadow` de `.hero-caption`, a sombra
 * radial `.hero-caption::before`, o filete `.hero-caption-title::before`, o traço
 * do sobretítulo, o corpo do título, a máscara do vídeo, a vinheta e as duas
 * `.brand-line` decorativas.
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
/* SIS-178 — quadro NOVO da cena. O arquivo anterior fica no repositorio e a
   constante fica AQUI comentada, nao apagada: é o unico registro de que o hero
   já foi 16:9, e voltar a ele é uma linha.
     const HERO_VIDEO = '/videos/hero-scroll.mp4';   // 1280x720, 556 quadros, 8,2 MB
   O material bruto (`videos/videohero.mp4`, 2160x2160, 15,1s, 60fps, 98,1 MB,
   com audio) NAO serve direto: tem só 4 keyframes, e `primitives/ScrollVideo`
   exige all-intra — com quadros interpolados o decodificador recomeça do
   keyframe anterior a cada busca e a imagem anda aos saltos. Reencodado com
     ffmpeg -i videohero.mp4 -an -vf "scale=1440:1440,fps=24" -c:v libx264 \
       -preset slow -crf 32 -g 1 -keyint_min 1 -sc_threshold 0 \
       -pix_fmt yuv420p -movflags +faststart hero-scroll-v2.mp4
   Conferido: 361 keyframes em 361 quadros (`ffprobe -skip_frame nokey`), 15,4 MB.
   O 1:1 é de proposito e casa melhor com a cena dividida da SIS-178 do que o
   16:9 antigo: a metade direita mede 885x900 a 1440, quase quadrada, então o
   `object-fit: cover` quase não corta. E o assunto de cada beat (o rotulo
   "Brasil", as torres, a marca) vive no centro/direita do quadro — nenhum deles
   cai na borda esquerda que a `mask-image` dissolve no branco. */
const HERO_VIDEO = '/videos/hero-scroll-v2.mp4';

/* Primeiro quadro do proprio video: enquanto o arquivo carrega, o hero mostra a
   cena inicial em vez de preto. Gerado com
   `ffmpeg -i hero-scroll-v2.mp4 -frames:v 1 -vf scale=720:720 -quality 72 hero-scroll-v2-poster.webp`.
   Reduzido a 720: em 1440 cheio o mesmo quadro dava 369 KB, e um cartaz que só
   se vê por um instante não paga esse preço. Anterior:
     const HERO_POSTER = '/videos/hero-scroll-poster.webp'; */
const HERO_POSTER = '/videos/hero-scroll-v2-poster.webp';

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

  /* ── Enquadramento por beat ────────────────────────────────────────────────
     As três legendas trocavam sobre um vídeo que não reagia: o quadro era o
     mesmo nos três momentos, e trocar a frase sem trocar a imagem lê como um
     slide de texto por cima de um fundo, não como três beats de uma cena.

     Os pontos são os centros das janelas de `HeroCaptions` (0.10, 0.32, 0.51),
     e o movimento é só `scale`/`x`/`y` — sem tocar em layout e sem um segundo
     relógio: é o MESMO `scrollYProgress` que já posiciona o vídeo.

     Todas as escalas ficam >= 1: abaixo disso o recorte descolaria das bordas e
     apareceria a base navy por dentro do quadro.

     ── SIS-178, segunda rodada: MENOS AMPLIAÇÃO E CONTEÚDO PUXADO PARA A ESQUERDA
     A marca `SISTRAN` / `Beyond Technology`, que fecha o vídeo, aparecia cortada
     pela DIREITA. Três coisas somavam corte, e o beat 2 juntava as três:
       1. `object-fit: cover` do `.hero-video` num quadro 1:1 dentro de uma caixa
          de `width: 58%` — a 1024 a caixa dá 594x768, então o `cover` escala
          pela altura e já corta 174px na horizontal antes de qualquer zoom.
       2. a ampliação do beat (era 1.18 aqui);
       3. o deslocamento, que era `+4%` — para a DIREITA, o mesmo sentido do
          corte, porque abrir espaço para a coluna de texto e trazer a marca para
          dentro do quadro pedem sinais opostos.
     Antes:
       const quadroScale = … [1.06, 1.06, 1.18, 1.02, 1];
       const quadroX = … ['0%', '0%', '4%', '0%', '0%'];
     Só (2) e (3) mudam: o `cover` sozinho ainda deixa a marca inteira em todas as
     larguras medidas, e o vídeo e os 58% são desenho aprovado — não se toca.
     O sinal do `x` é NEGATIVO de propósito: puxa a camada para a esquerda, que é
     o que traz a borda direita do quadro para dentro da janela. E ele continua
     dentro da folga da escala (a 1.08 sobra 4% por lado, e -1.5% cabe), senão
     apareceria a base navy pela aresta. */
  const BEATS = [0, 0.1, 0.32, 0.51, 0.6];
  const quadroScale = useTransform(scrollYProgress, BEATS, [1.03, 1.03, 1.08, 1.02, 1]);
  const quadroX = useTransform(scrollYProgress, BEATS, ['0%', '0%', '-1.5%', '0%', '0%']);
  const quadroY = useTransform(scrollYProgress, BEATS, ['0%', '0%', '-1.5%', '-3%', '0%']);
  /* A vinheta fecha no beat 2 (quadro mais apertado pede borda mais escura) e
     reabre no 3. É a "máscara" que muda de beat para beat.

     Varia a OPACIDADE do elemento, não a cor do gradiente: o gradiente vai de
     `transparent` ao tom final, e opacidade multiplica os dois — o miolo
     transparente continua transparente, só a borda pesa mais ou menos. Trocar a
     string do `background` a cada quadro reconstruiria o gradiente na GPU. */
  const vinheta = useTransform(scrollYProgress, BEATS, [0.7, 0.7, 1, 0.58, 0.7]);

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
        {/* Linha decorativa superior.
            SIS-178 — `hero-rule` a confina à metade do vídeo a partir de 1024px,
            pelo mesmo motivo da vinheta: `.brand-line` é um degradê de ciano,
            azul e violeta desenhado para atravessar fundo navy. Atravessando a
            coluna branca ele não lê como linha de marca, lê como emenda de
            layout — um risco de 1px cortando o texto escuro pela metade. */}
        <span
          aria-hidden
          className="hero-rule pointer-events-none absolute inset-x-0 top-[104px] z-10 brand-line opacity-70"
        />

        {/* O vídeo é o conteúdo do hero, então fica em opacidade cheia e nada
            se sobrepõe a ele além da vinheta.

            Antes ele morava dentro de `[data-hero-atmosphere]`, e aquela camada
            era aberta pelo GSAP em `opacity: 0.55` — no topo da página o vídeo
            aparecia a 55% sobre a folha branca, e era isso que o lavava. A
            camada saiu junto com os orbs e as linhas que ela embalava. */}
        <motion.div
          aria-hidden
          className="hero-media pointer-events-none absolute inset-0 -z-10"
          /* SIS-178 — `hero-media` é o gancho do CSS que confina esta camada à
             metade DIREITA a partir de 1024px e dissolve a borda esquerda dela
             num degradê até o branco (`mask-image`). Aqui no TSX ela continua
             `inset-0`: quem divide é o CSS, porque a divisão é dependente do
             ponto de quebra e regra de largura não se escreve em `style` inline.

             `-z-10` continua sendo essencial e agora por um motivo a mais: o
             branco da coluna esquerda NÃO é um retângulo pintado por cima — é a
             `.hero-sheet` (e o `#top`) aparecendo por onde a máscara apagou o
             vídeo. Se alguém der `background` a `.hero-scene`, esta camada de
             z-index negativo desaparece atrás dele. */
          /* O enquadramento por beat vive AQUI, na camada, e não no `<video>`:
             assim a base navy escala junto e nunca aparece uma aresta dela por
             dentro do quadro. O `overflow-hidden` de `.hero-scene` corta o
             excedente. */
          /* Repouso ESCRITO, nunca `undefined`: `useReducedMotion` nasce `false`
             (obrigatorio, senao servidor e cliente divergem), entao o primeiro
             render ja grava `scale: 1.06` e o `x`/`y` do beat 1 no `style` inline.
             Trocar para `undefined` faz o `motion` soltar a propriedade sem
             limpar o que gravou, e o quadro ficaria 6% ampliado para sempre. Foi
             assim que as legendas ficaram em `opacity: 0` com movimento reduzido
             (ver `ui/HeroCaptions.tsx`). */
          style={
            rm
              ? { scale: 1, x: 0, y: 0 }
              : {
                  scale: quadroScale,
                  x: quadroX,
                  y: quadroY,
                  willChange: 'transform',
                }
          }
        >
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
        </motion.div>

        {/* Vinheta radial: escurece as bordas e joga o olho para o centro, e
            fecha/abre conforme o beat (ver `vinheta`).

            SIS-178 — `hero-vignette` é o gancho que a confina à metade do vídeo
            a partir de 1024px. O `50% 45%` do gradiente foi calibrado para uma
            cena de sangria inteira: numa cena dividida ele escurece a coluna
            ESQUERDA, que é exatamente onde o texto escuro precisa de fundo
            claro. Confinada, o `50%` volta a significar "o meio do vídeo".
            A opacidade continua sendo modulada por `vinheta` — o confinamento é
            de geometria, não de intensidade. */}
        <motion.div
          aria-hidden
          className="hero-vignette pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              'radial-gradient(ellipse 78% 68% at 50% 45%, transparent 40%, rgba(3,17,38,0.78) 100%)',
            opacity: rm ? 0.7 : vinheta,
          }}
        />

        {/* As tres legendas do hero, uma por janela de rolagem. Ficam ACIMA da
            vinheta: é a vinheta que garante o contraste do texto claro contra os
            trechos claros do video (o corredor de papel dos primeiros segundos). */}
        <HeroCaptions progress={scrollYProgress} />

        {/* Linha decorativa inferior */}
        <span
          aria-hidden
          className="hero-rule pointer-events-none absolute inset-x-0 bottom-0 z-10 brand-line opacity-60"
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
