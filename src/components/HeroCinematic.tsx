'use client';

/**
 * HeroCinematic — Hero cinematográfico controlado por scroll.
 *
 * Wrapper de 300vh (desktop) / 200vh (mobile) com cena sticky em 100svh. O vídeo
 * é o conteúdo da cena; ao lado dele, na coluna esquerda, passam as três legendas
 * do hero (ver `HeroCaptions`) e, por último, a manchete da home (ver
 * `HeroPitch`). Os indicadores, o painel institucional e os botões de
 * capítulo saíram a pedido, para o vídeo ficar em destaque.
 *
 * SIS-226 — a coluna VOLTOU A CICLAR, em quatro passos. A nota da SIS-192 dizia
 * "a coluna deixou de ciclar: agora é um bloco só, que não troca de conteúdo", e
 * isso deixou de valer: passos 1–3 são as três legendas de `HERO_SLIDES` (ver
 * `HeroCaptions`), uma por janela de rolagem, e o passo 4 é a manchete do
 * `HeroPitch`, que entra depois da terceira e FICA até a cena sair. As legendas
 * nunca saíram do repositório — só do mount, e voltaram a ele.
 *
 * Sequência:
 *   0.00–0.58  O vídeo avança quadro a quadro com a rolagem (ver `ScrollVideo`)
 *              SIS-189 — e agora começa a andar SOZINHO ao entrar na home, nesta
 *              mesma faixa: 0.58 é o teto da entrada automática, não por acaso —
 *              é onde o vídeo deixa de ser o assunto.
 *              O contrato das duas fases está na nota de `scrollYProgress`.
 *   0.01–0.58  As TRÊS legendas entram e saem em janelas próprias
 *              (SIS-226; janelas em `ui/HeroCaptions.tsx`. A ENTRADA da primeira
 *              não é rolagem: é uma revelação de montagem, ao entrar no site —
 *              justificada no cabeçalho de lá. A saída dela é rolagem, como as
 *              outras duas.)
 *   0.575–0.65 A manchete (passo 4) ENTRA, e não sai mais: fica até a cena
 *              desprender do sticky.
 *              (SIS-226; era "0.52–0.66 a manchete sai de cena". Ela saía para
 *              não ser escalada pelo card que fechava em 0.62 — card que a
 *              SIS-198 removeu, ver a linha `————` abaixo. Sem escala não há de
 *              que fugir, e o item 3 da issue pede que o passo 4 permaneça.)
 *   0.55–0.78  A pastilha "role para explorar" sai de cena
 *   ————       SIS-198 — E ACABOU AQUI. A última linha da partitura era:
 *
 *                0.62–1.00  A viewport cheia recua e vira card sobre a folha
 *                           clara, e depois desce para encontrar a seção seguinte
 *
 *              O card não recua mais e não desce: ele JÁ NASCE no tamanho da
 *              referência (`public/referencia-hero-card-tamanho.png`) e fica nele
 *              do primeiro quadro ao último. Os três trechos anteriores perderam
 *              a menção a "antes de o card fechar", que era a única coisa que os
 *              amarrava a esta linha. Quem recebe o card no fim do percurso
 *              continua sendo a `BrandGrid` — só que por rolagem normal, quando a
 *              cena desprende do sticky, sem card fechando nem descida.
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
 * `pin: true`), o vídeo continua raspado por `scrollYProgress` e o texto continua
 * vindo de arquivo de dados. Nenhuma palavra nova.
 * SIS-192 — caducou aqui: "as três legendas continuam se sucedendo nas mesmas
 * janelas de `HeroCaptions.tsx:36-40` e o texto continua vindo de `HERO_SLIDES`".
 * Não há mais sucessão, e a fonte passou a ser `mosaicIntroHome` +
 * `DIFFERENTIALS`. O que a frase defendia continua verdadeiro e é o que importa:
 * a GEOMETRIA e a COR da divisão não mudaram, e a escrita não foi reescrita —
 * só mudou de endereço.
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

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useReducedMotion, useScrollOpacity } from '@/lib/motion';
import { syncSmoothScroll } from '@/lib/smoothScroll';
/* SIS-226 — as três legendas voltaram. O import ficou comentado desde a SIS-192
   exatamente para que religar fosse uma linha, e foi. */
import HeroCaptions from './ui/HeroCaptions';
import HeroPitch from './ui/HeroPitch';
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

  /* Eixo de tempo único do hero: um `t ∈ [0,1]` que alimenta o vídeo, a manchete
     e o recolhimento em card. É o mesmo de sempre — o que a SIS-189 muda é QUEM
     escreve esse `t`, e nunca são dois ao mesmo tempo.

     SIS-189 — ERA: "Nada de play/pause — o vídeo só existe como função do
     scroll." Deixou de ser verdade a pedido: ao entrar na home o vídeo começa
     sozinho. Em duas fases:

       FASE A (entrada, automática)  o vídeo TOCA e é ele o relógio. A fração de
         `currentTime` vira posição de rolagem (`aoFracaoDoVideo`), então a página
         acompanha e a manchete e o card leem o mesmo `t` de sempre. A raspagem
         fica suspensa dentro do `ScrollVideo`.
       FASE B (a rolagem assume)  no primeiro gesto do usuário — ou se a página
         divergir do alvo, que é como a barra de rolagem entra — o vídeo pausa e
         `t` volta a ser `scrollYProgress`, nos DOIS sentidos. Rolar para cima
         rebobina vídeo e card juntos.

     A Fase A não retoma no meio do percurso, e nem se o usuário voltar ao topo:
     é UMA VEZ POR VISITA. A issue deixa a retomada em aberto e pede o registro —
     ela está de fora porque "voltou ao topo e ficou parado" é indistinguível de
     "está lendo a manchete", e devolver o controle da página a quem parou de rolar
     é justamente o que a rolagem automática não deve fazer.

     Substitui o `driveVideoByScroll` que ficava aqui comentado: aquele escrevia
     `currentTime` a cada frame de um lerp, inclusive durante um seek pendente,
     e é exatamente isso que entope a fila do decodificador. O acelerador certo
     está em `ScrollVideo`. */
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  });

  /* Teto da Fase A: o vídeo é o assunto até 0.58. O NÚMERO NÃO MUDA com a SIS-198,
     a justificativa dele muda: era "0.62 é onde o `scale` começa a fechar o card",
     e o `scale` não existe mais. O que 0.58 marca agora é onde a pastilha de
     convite já terminou de sair (`cueFade`, 0.55 → 0.78) e o último beat de
     enquadramento (`BEATS` termina em 0.6) está se resolvendo — ou seja, o fim da
     parte da rolagem que o vídeo conduz, que é exatamente o que o teto quer dizer.
     Mexer nele para 0.62 ou 0.96 agora seria arrastar a rolagem automática por
     mais tela sem nada novo acontecendo nela.
     Forçar play até `t = 1` levaria
     a página sozinha até a grade de marcas, que não é entrada de hero, é embarque
     à força. O número está AQUI, e não dentro do `ScrollVideo`: é a partitura
     desta cena, não uma propriedade do vídeo. */
  const TETO_ENTRADA = 0.58;

  /* Nasce em 'rolagem' — o comportamento de antes desta issue. A entrada é uma
     PROMOÇÃO decidida depois de montar, e nunca o contrário: assim servidor e
     cliente renderizam a mesma árvore, e qualquer caminho em que a decisão não
     aconteça (movimento reduzido, página aberta no meio do hero, `play()`
     recusado) cai no comportamento que já existia. */
  const [fase, setFase] = useState<'entrada' | 'rolagem'>('rolagem');
  const alvoDaEntrada = useRef<number | null>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    /* As DUAS chaves de movimento reduzido, lidas aqui e não pelo `rm` do
       componente: `useReducedMotion` nasce `false` de propósito (senão servidor e
       cliente divergem) e só converge num efeito posterior — decidir pelo valor
       dele nesta passada ligaria o automático para quem pediu para não ver
       movimento, pelo tempo de um quadro. */
    const reduzido =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.dataset.motion === 'reduce';
    if (reduzido) return;

    /* Um quadro de folga antes de decidir, por dois motivos: a decisão depende de
       `window.scrollY`, que o navegador só restaura depois da primeira pintura
       (volta do histórico, recarga no meio da página); e marcar estado de forma
       síncrona dentro do efeito é o `setState` em cascata que o lint da casa
       aponta. */
    const quadro = requestAnimationFrame(() => {
      /* Ponto 5 da issue: página aberta JÁ dentro do hero não dispara automático.
         A tolerância é de 4px porque restauração de scroll e barras de endereço
         móveis deixam sobra de 1–2px. */
      if (window.scrollY > 4) return;
      setFase('entrada');
    });
    return () => cancelAnimationFrame(quadro);
  }, []);

  /* Sai da Fase A e não volta. Uma função só para os quatro caminhos de saída
     (gesto, divergência, teto, recusa do `play()`) porque o estado final é o
     mesmo — e é ele que garante o escritor único de `currentTime`. */
  const encerrarEntrada = useCallback(() => {
    alvoDaEntrada.current = null;
    setFase('rolagem');
  }, []);

  /* Relógio da Fase A: a fração do vídeo vira posição de rolagem.
     Pelo Lenis, sempre (`syncSmoothScroll`), e não por `window.scrollTo`: o Lenis
     guarda a própria posição animada e não acompanha um scroll feito por fora —
     sem isso o primeiro giro de roda saltaria de volta para onde ele achava que
     estava, e o `useScroll` divergiria do que está na tela. O `immediate` dele é
     o que faz este caminho ser posicionamento, não uma segunda animação
     disputando o eixo. */
  const aoFracaoDoVideo = useCallback(
    (fracao: number) => {
      const el = wrapperRef.current;
      if (!el) return;
      const topo = el.getBoundingClientRect().top + window.scrollY;
      const alcance = el.offsetHeight - window.innerHeight;
      if (alcance <= 0) return;

      /* Divergência = o usuário mexeu na página por um caminho que não emite
         gesto no `window` — arrastar a barra de rolagem é o caso real. Sem esta
         verificação a Fase A brigaria com ele arrastando a página de volta. */
      const anterior = alvoDaEntrada.current;
      if (anterior != null && Math.abs(window.scrollY - anterior) > 24) {
        encerrarEntrada();
        return;
      }
      /* Primeira fração da fase: a página tem de estar no topo AINDA. A guarda do
         efeito lê `window.scrollY` um quadro depois de montar, e há caminhos que
         posicionam a página depois disso (restauração de scroll lenta, âncora
         resolvida na hidratação, script de terceiro). Sem esta segunda leitura, a
         Fase A puxaria a página de volta ao topo — o oposto do ponto 5. Medido:
         sem ela, abrir em y=900 caía para 306 com o vídeo tocando. */
      if (anterior == null && window.scrollY > 4) {
        encerrarEntrada();
        return;
      }

      const destino = Math.round(topo + fracao * alcance);
      alvoDaEntrada.current = destino;
      syncSmoothScroll(destino);
      /* Sem Lenis (ele não é criado com movimento reduzido do sistema) o registro
         é no-op e a página não andaria. Não deveria acontecer — movimento
         reduzido nem chega a ligar a Fase A —, mas o custo de garantir é uma
         linha, e o defeito seria "o vídeo toca e a página fica parada". */
      if (window.scrollY !== destino) window.scrollTo(0, destino);
    },
    [encerrarEntrada],
  );

  /* Primeiro gesto do usuário encerra a entrada. `pointerdown` entra na lista por
     causa do clique na barra de rolagem em alguns navegadores; onde ele não
     dispara, quem pega é a verificação de divergência acima. Todos `passive` e
     `once`: nenhum deles cancela nada, e um basta. */
  useEffect(() => {
    if (fase !== 'entrada') return;
    const gestos = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const;
    const sair = () => encerrarEntrada();
    for (const g of gestos) {
      window.addEventListener(g, sair, { passive: true, once: true });
    }
    return () => {
      for (const g of gestos) window.removeEventListener(g, sair);
    };
  }, [fase, encerrarEntrada]);

  /* 55% é onde a terceira legenda já está saindo (`0.54–0.58` na partitura) e a
     rolagem deixa de ser conduzida pelo vídeo. SIS-226 — dizia "onde a manchete já
     está saindo (`0.52–0.66`)", e a manchete agora ENTRA nessa faixa em vez de
     sair; o número fica pelo mesmo motivo de sempre. A pastilha ainda está
     desaparecendo enquanto o passo 4 assenta (a 0.65 ela está em ~56% de
     opacidade), e isso é coerente: ela é convite a rolar, e ali ainda há percurso
     — some de vez em 0.78, com o passo 4 já inteiro na tela. Ela é `fixed` no pé
     da janela e não disputa a caixa do texto.
     SIS-198 — dizia "é onde a cena começa a se
     recolher (ver `scale` abaixo)", e o recolhimento saiu; o número fica, porque o
     que ele marca é o fim do assunto do hero, não o começo do encolhimento.

     `useScrollOpacity` em vez da forma de array: nela o `motion` acelera a
     opacidade numa `Animation` nativa com `ViewTimeline`, que mede a
     visibilidade da propria pastilha — e ela é `position: fixed`, entao esse
     relogio nunca avança e a pastilha ficava em `opacity: 1` pelo resto da
     pagina, exatamente o que o comentario de `.hero-cue` diz que nao pode
     acontecer. Ver `@/lib/motion`. */
  const cueFade = useScrollOpacity(scrollYProgress, [0.55, 0.78], [1, 0]);

  /* ── SIS-198 · O CARD NÃO ENCOLHE MAIS ────────────────────────────────────
     O hero NASCE no tamanho de `public/referencia-hero-card-tamanho.png` e fica
     nele. Não há mais retração de sangria inteira para mini-card: era ela o
     "ficar diminuindo" que a issue manda tirar.

     O que saiu, e por quê cada um:

       const scale  = useTransform(scrollYProgress, [0.62, 0.96], [1, 0.54]);
       const radius = useTransform(scrollYProgress, [0.62, 0.96], [0, 30]);
       const drop   = useTransform(scrollYProgress, [0.84, 1], ['0svh', '20svh']);

     `scale` era o recolhimento: a cena fechava a 54% no fim do percurso. `radius`
     só existia para acompanhá-lo (raio 0 em sangria não se vê; ele aparecia
     quando o card fechava). `drop` era a descida de 20svh que levava o card já
     fechado até a altura do bloco seguinte — sem card fechando, não há distância
     a percorrer, e o hero desprende do sticky onde o percurso do `#top` termina.

     No lugar dos três, GEOMETRIA ESTÁTICA em `globals.css` (`.hero-scene`, bloco
     ">= 1024px"): recuo, altura e raio medidos na referência por
     `scripts/medir-referencia-card-hero.mjs`. Card parado é layout, não
     animação — e como CSS, ele vale antes da hidratação, sem JS e com movimento
     reduzido, sem precisar de um segundo caminho.

     A `.hero-sheet` CONTINUA, e agora é o tempo todo o que se vê em volta do card,
     não só no fim.
     SIS-199 — o que NÃO segue valendo é a frase que estava aqui: "as duas cores não
     se unificam". Elas se unificaram. Na home a folha e a `BrandGrid` deixaram de
     ter cor própria (`#f4f8fc` e `#f5faff`) e passaram a ler o canvas claro da
     página, o mesmo `--fundo-claro-secao` ancorado na janela — a decisão contrária,
     em `brand-grid.css`, foi tomada quando o claro era um MOMENTO do hero e existia
     uma jornada azul para ele desembocar; as duas premissas caíram juntas. O
     `#f4f8fc` da regra base fica para qualquer rota que monte o hero sem o canvas,
     e hoje não existe nenhuma: este componente só é montado em `/`. */

  /* SIS-190 — raio dos cantos DA DIREITA do quadro do vídeo (a esquerda dissolve,
     e canto arredondado num lado que dissolve não existe). São os 20px medidos em
     `public/referenciavideo.png` (arco de 19–20px nos dois cantos, ver
     `scripts/medir-referencia-moldura-hero.mjs`), CONFIRMADOS pela referência do
     card: `scripts/medir-referencia-card-hero.mjs` acha arco nos dois cantos da
     direita do card com o mesmo raio.
     SIS-198 — era `useTransform(scrollYProgress, [0.62, 0.96], [20, 30])`, para
     acompanhar o `radius` do card enquanto ele fechava. Sem `radius`, o raio do
     card é constante e o da moldura também: o valor saiu do `style` inline e
     passou para o CSS, onde `.hero-scene`, `.hero-media` e `.hero-frame` leem o
     MESMO `--hero-card-raio`. Continua sendo uma fonte só — só que agora estática,
     e por isso mais barata: três propriedades a menos escritas por quadro. */
  /* A folha clara NAO tem mais fade. Enquanto ela subia de 0 a 1, o azul do body
     aparecia por tras do card no meio do caminho e emendava em corte seco com o
     branco do mosaico logo abaixo. Agora ela é branca e opaca do inicio ao fim.
     SIS-198 — o motivo mudou de "enquanto a cena é full bleed ela fica coberta, e
     quando o card recua o que surge em volta já é a cor da seção seguinte" para
     algo mais simples: a cena NUNCA é full bleed acima de 1024px, então a folha é
     visível em volta do card do primeiro quadro ao último. O valor e a razão de
     ele não ser token continuam na nota de `.hero-sheet`.

     Aqui ficava o `drop` (comentado no bloco SIS-198 acima, com o motivo):
     ele descia o card 20svh entre 0.84 e 1 para encontrar o bloco de baixo. */

  /* ── Enquadramento por beat ────────────────────────────────────────────────
     As três legendas trocavam sobre um vídeo que não reagia: o quadro era o
     mesmo nos três momentos, e trocar a frase sem trocar a imagem lê como um
     slide de texto por cima de um fundo, não como três beats de uma cena.

     SIS-192 — o parágrafo acima descreve por que os beats EXISTEM, e a razão
     nasceu das três legendas, que já não estão aqui. Fica escrito porque os beats
     FICAM: sem eles o vídeo volta a ser um quadro parado por 320svh de rolagem, e
     isso continua sendo pior do que era com legenda. O que muda é que agora nada
     no texto depende desses pontos — a manchete é uma só e não tem janela.

     Os pontos eram os centros das janelas das legendas (0.10, 0.32, 0.51),
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
      {/* SIS-198 — a cena deixou de ser `motion.div`: com `scale`, `borderRadius`
          e `y` fora (ver o bloco "O CARD NÃO ENCOLHE MAIS"), não sobrou nenhum
          valor de movimento para ela receber. O `style` inline saiu inteiro, e com
          ele o `willChange: 'transform'` — `will-change` sem animação é só memória
          de GPU reservada para nada (`.claude/skills/performance-gpu.md`).

          O `min-height` que estava aqui foi para `globals.css`, junto do recuo, da
          altura e do raio do card: é geometria de layout, e o próprio arquivo já
          dizia que "a cena sticky vive em globals.css". Estava assim:

            style={ rm
              ? { minHeight: 'clamp(640px, 100svh, 960px)' }
              : { minHeight: 'clamp(640px, 100svh, 960px)', scale,
                  borderRadius: radius, y: drop, willChange: 'transform' } }

          Sem `style` inline não há mais o risco que a nota de `.hero-media`
          descreve (o `motion` soltar a propriedade sem limpar o que gravou):
          não há nada gravado. */}
      <div className="hero-scene flex overflow-hidden">
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
          /* SIS-190 dizia: "o raio vive aqui, e não no CSS, porque ele ACOMPANHA o
             card". SIS-198 — não acompanha mais nada, o card é estático. Os dois
             raios saíram deste `style` e foram para `.hero-media` em `globals.css`,
             lendo `--hero-card-raio`, o mesmo do card e da moldura. Eram:

               borderTopRightRadius: 20 / molduraRaio
               borderBottomRightRadius: 20 / molduraRaio

             O `scale`/`x`/`y` do beat FICAM: são movimento de verdade, e é por
             causa deles que o repouso continua ESCRITO, nunca `undefined` (ver o
             parágrafo acima). */
          style={
            rm
              ? {
                  scale: 1,
                  x: 0,
                  y: 0,
                }
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
            /* Fase A. `rm &&` não é redundante com a guarda do efeito: aquela
               decide se a fase COMEÇA, e esta garante que ela não sobrevive a
               alguém ligar movimento reduzido pelo botão da interface com a
               entrada em curso. */
            reproduzir={!rm && fase === 'entrada'}
            tetoReproducao={TETO_ENTRADA}
            onFracao={aoFracaoDoVideo}
            onEntradaEncerrada={encerrarEntrada}
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

        {/* SIS-190 — moldura do quadro do vídeo (ref. `public/referenciavideo.png`).
            Elemento IRMÃO da camada de mídia, não borda dela: a camada respira por
            beat e é mascarada, e a moldura da referência está parada — é o quadro
            que se move dentro dela. O traço, o degradê ciano/azul, o recorte da
            lateral que dissolve e o fallback sem `mask-composite` estão em
            `globals.css`, no bloco "hero dividido" (procure `.hero-frame`);
            abaixo de 1024px a moldura não existe, por decisão registrada lá.
            `z-[2]` a põe acima da vinheta — a vinheta escurece as bordas, e é
            exatamente ali que o traço precisa ser lido.
            Com movimento reduzido a moldura CONTINUA visível: ela é referência
            visual do quadro, não efeito — e agora isso não custa um segundo
            caminho, porque o raio dela é CSS e vale igual nos dois modos.
            SIS-198 — deixou de ser `motion.span`: sem raio animado não sobrou
            valor de movimento. O `style` era:

              rm ? { borderTopRightRadius: 20, borderBottomRightRadius: 20 }
                 : { borderTopRightRadius: molduraRaio,
                     borderBottomRightRadius: molduraRaio } */}
        <span
          aria-hidden
          className="hero-frame pointer-events-none absolute inset-0 z-[2]"
        />

        {/* SIS-226 — A COLUNA DE TEXTO VOLTOU A CICLAR, EM QUATRO PASSOS.
            A SIS-192 tinha desmontado as três legendas de `HERO_SLIDES` e posto
            no lugar UM bloco que não trocava (o `HeroPitch`). Esta issue restaura
            a alternância e mantém aquele bloco como FECHO: passos 1–3 são as três
            legendas, cada uma na sua janela de rolagem, e o passo 4 é a manchete
            "Entrega com Alta Performance e Comprometimento" + apoio + pilares,
            que entra depois da terceira e fica até a cena sair.

            NENHUMA PALAVRA MUDOU DE LUGAR NESTA ISSUE. Os três slides sempre
            estiveram em `src/data/hero.ts` (nunca foram apagados) e a manchete
            continua vindo de `mosaicIntroHome` + `DIFFERENTIALS[].title`.

            Os dois ficam no mesmo lugar da árvore e pelo mesmo motivo: ACIMA da
            vinheta. É a vinheta que garante o contraste do texto claro contra os
            trechos claros do vídeo (o corredor de papel dos primeiros segundos)
            no regime C, e trocar a ordem devolveria o texto para baixo dela.

            AS DUAS MONTAGENS COMPARTILHAM O MESMO `scrollYProgress`, e é por isso
            que a partitura fecha: as janelas das legendas terminam em 0.58 e o
            pitch começa em 0.575. Não há segundo relógio, nem temporizador — a
            única coisa que não é rolagem no hero é a revelação de MONTAGEM da
            primeira legenda, justificada no cabeçalho de `ui/HeroCaptions.tsx`.

            Um `h1` só: ele é o do `HeroPitch`. As três legendas usam
            `<p className="hero-caption-title">` — tipografia de título sem
            semântica de título. A escolha está registrada nos dois cabeçalhos. */}
        <HeroCaptions progress={scrollYProgress} />
        <HeroPitch progress={scrollYProgress} />

        {/* Linha decorativa inferior */}
        <span
          aria-hidden
          className="hero-rule pointer-events-none absolute inset-x-0 bottom-0 z-10 brand-line opacity-60"
        />
        {/* SIS-192 — O `h1` INVISÍVEL SAIU, E ELE NÃO FOI SUBSTITUÍDO POR NADA:
            ele foi PROMOVIDO. A nota antiga dizia "a escrita do hero saiu de cena
            a pedido, mas remover o título junto deixaria a página sem cabeçalho
            de nível 1" — e por isso havia um `h1` que ninguém via. Essa premissa
            caducou: a partir desta issue o hero TEM manchete visível, e ela é o
            `<h1 className="hero-caption-title">` dentro do `HeroPitch`.
            Manter os dois daria dois cabeçalhos de nível 1 com frases
            diferentes, que é o defeito que o critério de aceite proíbe.
            A frase que estava aqui — "Soluções de Negócio em Seguros — Sistran
            Brasil" — era escrita travada, então a retirada está registrada em
            `.claude/conteudo-site/00-home.md`, como manda a SIS-177: uma remoção
            que só aparece como linha a menos no `copy-lock.json` é exatamente a
            remoção em silêncio que a trava existe para impedir.
        <h1 className="sr-only">Soluções de Negócio em Seguros — Sistran Brasil</h1>
        */}
      </div>

      {/* Irmã da cena, nunca filha. O motivo original era o `scale` da
          `.hero-scene`, que saiu com a SIS-198 — mas a regra FICA, e por dois
          motivos que continuam de pé: a cena tem `overflow: hidden` (uma pastilha
          `fixed` dentro dela seria recortada nas bordas do card), e a cena ainda é
          `position: sticky` com filhos transformados por beat. Voltar a pastilha
          para dentro é reintroduzir um defeito de contenção sem ganho nenhum.

          Some junto com a saída da cena — sendo `fixed`, sem isso a pastilha
          continuaria colada ao cursor pelo resto da página, convidando a rolar um
          percurso que já terminou. */}
      <motion.div className="hero-cue" style={{ opacity: cueFade }}>
        <ScrollCue />
      </motion.div>
    </section>
  );
}
